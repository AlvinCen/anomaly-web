import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import moment from 'moment';

// Helper function to calculate item totals
const calculateItemTotal = (item) => {
    const basePrice = Number(item.harga) || 0;
    const quantity = Number(item.qty) || 0;

    if (item.addOns) {
        const addOnTotal = item.addOns.reduce((total, addOn) => {
            return total + Number(addOn.harga);
        }, 0);
        return quantity * (basePrice + addOnTotal);
    }

    return quantity * basePrice;
};

// Helper function to calculate discount amount
const calculateDiscountAmount = (total, discount, isPercentage) => {
    if (!discount) return 0;
    return isPercentage ? (total * discount) / 100 : discount;
};

// Helper function to calculate tax amount
const calculateTaxAmount = (total, taxRate) => {
    return (total * (taxRate || 0));
};

// Helper function to calculate transaction totals
const calculateTransactionTotals = (transaction) => {
    const items = transaction.item || [];

    // Calculate board game revenue (items with 'tipe' property)
    const boardGameRevenue = items.reduce((total, item) => {
        if (item.tipe) {
            return total + (Number(item.harga) * Number(item.qty));
        }
        return total;
    }, 0);

    // Calculate cafe revenue (items with addOns or without 'tipe')
    const cafeItemTotal = items.reduce((total, item) => {
        if (item.addOns || !item.tipe) {
            return total + calculateItemTotal(item);
        }
        return total;
    }, 0);

    // Calculate discount and tax
    const discountAmount = calculateDiscountAmount(
        cafeItemTotal,
        transaction.discount,
        transaction.typeDiscount
    );
    const taxAmount = calculateTaxAmount(cafeItemTotal, transaction.tax);

    // Calculate grand total
    const grandTotal = (boardGameRevenue + cafeItemTotal) + taxAmount - discountAmount;
    const cafeRevenue = cafeItemTotal + taxAmount;

    return {
        boardGameRevenue,
        cafeRevenue,
        grandTotal,
        discountAmount,
        taxAmount
    };
};

// Helper function to categorize payment totals
const categorizePaymentTotals = (transactions) => {
    const paymentTotals = {
        cash: 0,
        qris: 0,
        debit: 0,
        grabfood: 0,
        gofood: 0
    };

    transactions.forEach(transaction => {
        const totals = calculateTransactionTotals(transaction);

        if (transaction.splitBill) {
            transaction.splitBill.forEach(bill => {
                const method = bill.paymentMethod?.toLowerCase();
                if (paymentTotals.hasOwnProperty(method)) {
                    paymentTotals[method] += totals.grandTotal;
                }
            });
        } else {
            const method = transaction.paymentMethod?.toLowerCase();
            if (paymentTotals.hasOwnProperty(method)) {
                paymentTotals[method] += totals.grandTotal;
            }
        }
    });

    return paymentTotals;
};

// Helper function to process transaction rows for worksheet
const processTransactionRows = (transactions) => {
    return transactions.flatMap((trx) => {
        if (trx.splitBill) {
            return trx.splitBill.map((bill) => {
                const totalHarga = bill.item.reduce(
                    (sum, item) => sum + parseInt(item.harga) * parseInt(item.qty),
                    0
                );
                const orderTotal = bill.item.reduce(
                    (sum, item) => {
                        if (item.tipe) return sum;
                        return sum + parseInt(item.harga) * parseInt(item.qty);
                    },
                    0
                );

                const diskonNominal = calculateDiscountAmount(orderTotal, bill.discount, bill.typeDiscount);
                const pajakNominal = calculateTaxAmount(orderTotal, bill.tax);
                const subtotal = totalHarga - diskonNominal + pajakNominal;

                return [
                    new Date(trx.createdAt).toLocaleString(),
                    trx.transactionId,
                    trx.client?.name || "",
                    trx.tableName,
                    totalHarga,
                    diskonNominal,
                    pajakNominal,
                    bill.paymentMethod,
                    subtotal,
                ];
            });
        } else {
            const totalHarga = trx.item.reduce(
                (sum, item) => sum + parseInt(item.harga) * parseInt(item.qty),
                0
            );
            const orderTotal = trx.item.reduce(
                (sum, item) => {
                    if (item.tipe) return sum;
                    return sum + parseInt(item.harga) * parseInt(item.qty);
                },
                0
            );

            const diskonNominal = calculateDiscountAmount(orderTotal, trx.discount, trx.typeDiscount);
            const pajakNominal = calculateTaxAmount(orderTotal, trx.tax);
            const subtotal = totalHarga - diskonNominal + pajakNominal;

            return [[
                new Date(trx.createdAt).toLocaleString(),
                trx.transactionId,
                trx.client?.name || "",
                trx.tableName,
                totalHarga,
                diskonNominal,
                pajakNominal,
                trx.paymentMethod,
                subtotal,
            ]];
        }
    });
};

// Helper function to process detailed item rows
const processDetailedItemRows = (transactions) => {
    return transactions.flatMap((trx) => {
        return trx.item.map((item) => {
            const subTotal = calculateItemTotal(item);
            const diskonNominal = calculateDiscountAmount(subTotal, trx.discount, trx.typeDiscount);
            const pajakNominal = item.addOns ? calculateTaxAmount(subTotal, trx.tax) : 0;
            const total = subTotal - diskonNominal + pajakNominal;

            const itemPrice = item.addOns
                ? Number(item.harga) + item.addOns.reduce((sum, addOn) => sum + Number(addOn.harga), 0)
                : Number(item.harga);

            return [
                new Date(trx.createdAt).toLocaleString(),
                trx.transactionId,
                trx.tableName,
                item.name,
                item.qty,
                itemPrice,
                subTotal,
                diskonNominal,
                pajakNominal || "0",
                total,
            ];
        });
    });
};

// Helper function to apply worksheet styling
const applyWorksheetStyling = (worksheet, numberColumns = [5, 6, 7, 8]) => {
    worksheet.eachRow((row, rowNumber) => {
        row.eachCell((cell, colNumber) => {
            // Apply borders
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' },
            };

            // Right align number columns
            if (numberColumns.includes(colNumber)) {
                cell.alignment = { horizontal: 'right' };
            }
        });
    });
};

// Helper function to create daily worksheet
const createDailyWorksheet = (workbook, data, startDate, endDate) => {
    const worksheet = workbook.addWorksheet(`Laporan ${startDate} - ${endDate}`);

    const headers = [
        "Tanggal", "ReceiptID", "Pelanggan", "Meja", "Sub Total",
        "Diskon", "Pajak", "Payment Method", "Grand Total"
    ];

    worksheet.addRow(headers);
    worksheet.columns = [
        { width: 22 }, { width: 25 }, { width: 25 }, { width: 15 },
        { width: 18, style: { numFmt: '#,##0' } }, { width: 15, style: { numFmt: '#,##0' } },
        { width: 15, style: { numFmt: '#,##0' } }, { width: 15 }, { width: 20, style: { numFmt: '#,##0' } }
    ];

    return worksheet;
};

// Helper function to create summary worksheet
const createSummaryWorksheet = (workbook, startDate, endDate) => {
    const worksheet = workbook.addWorksheet(`Summary Laporan ${startDate} - ${endDate}`);

    const headers = [
        "Tanggal", "Cash", "QRIS", "Debit", "Grabfood", "Gofood",
        "Board Game Revenue", "Cafe Revenue", "Total Revenue"
    ];

    worksheet.addRow(headers);
    worksheet.columns = [
        { width: 22 },
        { width: 20, style: { numFmt: '#,##0' } }, { width: 20, style: { numFmt: '#,##0' } },
        { width: 20, style: { numFmt: '#,##0' } }, { width: 20, style: { numFmt: '#,##0' } },
        { width: 20, style: { numFmt: '#,##0' } }, { width: 20, style: { numFmt: '#,##0' } },
        { width: 20, style: { numFmt: '#,##0' } }, { width: 23, style: { numFmt: '#,##0' } }
    ];

    return worksheet;
};

// Helper function to create detailed daily worksheet
const createDetailedDailyWorksheet = (workbook, date) => {
    const worksheet = workbook.addWorksheet(`Laporan ${moment(date).format("DD-MM-YYYY")}`);

    const headers = [
        "Tanggal", "ReceiptID", "Meja", "Item", "Qty",
        "Harga", "Sub Total", "Discount", "Pajak", "Total"
    ];

    worksheet.addRow(headers);
    worksheet.columns = [
        { width: 22 }, { width: 25 }, { width: 15 }, { width: 35 }, { width: 10 },
        { width: 15, style: { numFmt: '#,##0' } }, { width: 15, style: { numFmt: '#,##0' } },
        { width: 15, style: { numFmt: '#,##0' } }, { width: 15, style: { numFmt: '#,##0' } },
        { width: 22, style: { numFmt: '#,##0' } }
    ];

    return worksheet;
};

// Main export function - refactored for better readability
export const exportToExcel = async (data, fileName = `Laporan-Anomaly-${moment(data?.createdAt).format("DD-MM-YYYY")}.xlsx`, startDate, endDate) => {
    const workbook = new ExcelJS.Workbook();

    if (data.length > 0) {
        // Create worksheets
        const summaryWorksheet = createSummaryWorksheet(workbook, startDate, endDate);
        const worksheet = createDailyWorksheet(workbook, data, startDate, endDate);

        let grandTotal = 0;

        // Process each day's data
        const summaryRows = data.flatMap((dayData) => {
            const paymentTotals = categorizePaymentTotals(dayData.transaction);

            // Calculate revenue totals
            let boardGameRevenue = 0;
            let cafeRevenue = 0;

            dayData.transaction.forEach(transaction => {
                const totals = calculateTransactionTotals(transaction);
                boardGameRevenue += totals.boardGameRevenue;
                cafeRevenue += totals.cafeRevenue;
            });

            // Add income from pemasukan
            dayData.pemasukan?.forEach(income => {
                cafeRevenue += income.value || 0;
                paymentTotals.cash += income.value || 0;
            });

            const totalRevenue = boardGameRevenue + cafeRevenue;
            grandTotal += totalRevenue;

            // Create detailed daily worksheet
            const dataWorksheet = createDetailedDailyWorksheet(workbook, dayData.createdAt);
            const detailedRows = processDetailedItemRows(dayData.transaction);
            const incomeDailyRows = dayData.pemasukan.map(trx => [
                new Date(trx.createdAt).toLocaleString(), "", trx.note, "",
                trx.value, "", "", "", "", trx.value
            ]);
            const outcomeDailyRows = dayData.pengeluaran.map(trx => [
                new Date(trx.createdAt).toLocaleString(), "", trx.note, "",
                "-" + trx.value, "", "", "", "", "-" + trx.value
            ]);

            detailedRows.forEach(row => dataWorksheet.addRow(row));
            incomeDailyRows.forEach(row => dataWorksheet.addRow(row));
            outcomeDailyRows.forEach(row => dataWorksheet.addRow(row));


            // Add total row to detailed worksheet
            const detailedTotal = detailedRows.reduce((sum, row) => sum + parseInt(row[9]), 0);
            const incomeTotal = incomeDailyRows.reduce((sum, row) => sum + parseInt(row[9]), 0);
            const outcomeTotal = outcomeDailyRows.reduce((sum, row) => sum + parseInt(row[9]), 0);

            const totalDataRow = ["", "", "", "", "", "", "", "", "Total", (detailedTotal + incomeTotal - outcomeTotal)];
            dataWorksheet.addRow(totalDataRow);
            dataWorksheet.getRow(dataWorksheet.lastRow.number).font = { bold: true };

            applyWorksheetStyling(dataWorksheet);

            // Process main worksheet rows
            const transactionRows = processTransactionRows(dayData.transaction);
            const incomeRows = dayData.pemasukan.map(trx => [
                new Date(trx.createdAt).toLocaleString(), "", trx.note, "",
                trx.value, "", "", "", trx.value
            ]);
            const expenseRows = dayData.pengeluaran.map(trx => [
                new Date(trx.createdAt).toLocaleString(), "", trx.note, "",
                "-" + trx.value, "", "", "", "-" + trx.value
            ]);

            [...transactionRows, ...incomeRows, ...expenseRows].forEach(row => {
                worksheet.addRow(row);
            });

            return [[
                new Date(dayData.createdAt).toLocaleString(),
                paymentTotals.cash,
                paymentTotals.qris,
                paymentTotals.debit,
                paymentTotals.grabfood,
                paymentTotals.gofood,
                boardGameRevenue,
                cafeRevenue,
                totalRevenue
            ]];
        });

        // Add summary rows
        summaryRows.forEach(row => summaryWorksheet.addRow(row));

        // Add total rows
        const totalRow = ["", "", "", "", "", "", "", "Total", grandTotal];
        worksheet.addRow(totalRow);
        worksheet.getRow(worksheet.lastRow.number).font = { bold: true };

        const totalSummaryRow = ["", "", "", "", "", "", "", "Total", grandTotal];
        summaryWorksheet.addRow(totalSummaryRow);
        summaryWorksheet.getRow(summaryWorksheet.lastRow.number).font = { bold: true };

        // Apply styling
        applyWorksheetStyling(worksheet);
        applyWorksheetStyling(summaryWorksheet);

    } else {
        // Handle single day report
        const worksheet = workbook.addWorksheet('Laporan Harian');

        // Add header information
        worksheet.addRow(["Saldo Awal : ", data?.saldoAwal]);
        worksheet.addRow(["Saldo Akhir : ", data?.saldoAkhir]);
        worksheet.addRow(["Jam Buka : ", new Date(data.createdAt).toLocaleString()]);
        worksheet.addRow(["Jam Tutup : ", new Date(data?.closeAt).toLocaleString()]);
        worksheet.addRow([]);

        // Style header rows
        for (let i = 1; i <= 5; i++) {
            worksheet.getRow(i).font = { bold: true };
        }

        // Add transaction headers
        const headers = [
            "Tanggal", "ReceiptID", "Pelanggan", "Meja", "Sub Total",
            "Diskon", "Pajak", "Payment Method", "Grand Total"
        ];
        worksheet.addRow(headers);

        worksheet.columns = [
            { width: 22 }, { width: 25 }, { width: 25 }, { width: 15 },
            { width: 18, style: { numFmt: '#,##0' } }, { width: 15, style: { numFmt: '#,##0' } },
            { width: 15, style: { numFmt: '#,##0' } }, { width: 15 }, { width: 20, style: { numFmt: '#,##0' } }
        ];

        // Process and add transaction data
        const transactionRows = processTransactionRows(data.transaction);
        const incomeRows = data.pemasukan.map(trx => [
            new Date(trx.createdAt).toLocaleString(), "", trx.note, "",
            trx.value, "", "", "", trx.value
        ]);
        const expenseRows = data.pengeluaran.map(trx => [
            new Date(trx.createdAt).toLocaleString(), "", trx.note, "",
            "-" + trx.value, "", "", "", "-" + trx.value
        ]);

        [...transactionRows, ...incomeRows, ...expenseRows].forEach(row => {
            worksheet.addRow(row);
        });

        // Calculate and add total
        const totalSubtotal = transactionRows.reduce((sum, r) => sum + parseInt(r[8]), 0) +
            incomeRows.reduce((sum, r) => sum + parseInt(r[8]), 0) +
            expenseRows.reduce((sum, r) => sum + parseInt(r[8]), 0);

        const totalRow = ["", "", "", "", "", "", "", "Total", totalSubtotal];
        worksheet.addRow(totalRow);
        worksheet.getRow(worksheet.lastRow.number).font = { bold: true };

        applyWorksheetStyling(worksheet);
    }

    // Generate and save file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, fileName);
};

export const exportStorage = async (data, fileName = `Laporan-Storage.xlsx`) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Laporan Storage');

    // Header
    const headers = [
        "#", "Item", "Stock Type", "Stock Before", "Stock",
        "Cost", "Cost Per Item", "Event Type", "Created At"
    ];

    worksheet.addRow(headers);

    // Styling header
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true };

    worksheet.columns = [
        { width: 5 }, { width: 25 }, { width: 10 }, { width: 10 }, { width: 10 },
        { width: 15 }, { width: 18 }, { width: 15 }, { width: 15 }
    ];

    const rows = data.map((item, idx) => {
        if (item.event === "add") {
            return [
                idx + 1, item.name, item.tipe, "", item.stok,
                parseInt(item.harga), item?.costPerItem, item.event,
                moment(item.createdAt).format("DD MMMM YYYY")
            ];
        }
        if (item.event === "update") {
            const cost = item?.beforeStok !== undefined
                ? Math.abs((item?.beforeStok - item?.stok) * item?.costPerItem)
                : item?.harga;
            return [
                idx + 1, item.name, item.tipe, item?.beforeStok, item.stok,
                parseInt(cost), item?.costPerItem, item.event,
                moment(item.createdAt).format("DD MMMM YYYY")
            ];
        }
        return null;
    }).filter(Boolean);

    rows.forEach(row => worksheet.addRow(row));

    // Calculate total
    const totalHarga = data.reduce((sum, item) => {
        return item.event === "update" ? sum + parseInt(item.cost) : sum;
    }, 0);

    const totalRow = ["", "", "", "", "Total", totalHarga];
    worksheet.addRow(totalRow);
    worksheet.getRow(worksheet.lastRow.number).font = { bold: true };

    applyWorksheetStyling(worksheet, []);

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, fileName);
};

export const exportStorageExpense = async (data, fileName = `Laporan-Storage_Expense-${moment(data?.createdAt).format("DD-MM-YYYY")}.xlsx`) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Laporan Storage');

    const headers = [
        "#", "Item", "Stock Type", "Stock", "Cost",
        "Cost Per Item", "Event Type", "Created At"
    ];

    worksheet.addRow(headers);
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true };

    worksheet.columns = [
        { width: 5 }, { width: 25 }, { width: 10 }, { width: 10 },
        { width: 15 }, { width: 18 }, { width: 15 }, { width: 15 }
    ];

    const rows = data.map((item, idx) => {
        if (item.event === "add") {
            return [
                idx + 1, item.name, item.tipe, item.stok,
                parseInt(item.harga), item?.costPerItem, item.event,
                moment(item.createdAt).format("DD MMMM YYYY")
            ];
        }
        return null;
    }).filter(Boolean);

    rows.forEach(row => worksheet.addRow(row));

    const totalHarga = data.reduce((sum, item) => {
        return item.event === "add" ? sum + parseInt(item.harga) : sum;
    }, 0);

    const totalRow = ["", "", "", "Total", totalHarga];
    worksheet.addRow(totalRow);
    worksheet.getRow(worksheet.lastRow.number).font = { bold: true };

    applyWorksheetStyling(worksheet, []);

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, fileName);
};

export const exportProduct = async (cafe, boardgame, fileName = `Laporan-Product.xlsx`) => {
    const workbook = new ExcelJS.Workbook();
    const cafeWorksheet = workbook.addWorksheet('Laporan Cafe');
    const boardgameWorksheet = workbook.addWorksheet('Laporan Board Game');

    const headers = [
        "#", "Item", "Qty", "Price", "Total", "PB1", "Discount", "Created At"
    ];

    // Setup both worksheets
    [cafeWorksheet, boardgameWorksheet].forEach(worksheet => {
        worksheet.addRow(headers);
        worksheet.getRow(1).font = { bold: true };
        worksheet.columns = [
            { width: 5 }, { width: 25 }, { width: 5 }, { width: 10 },
            { width: 10 }, { width: 5 }, { width: 5 }, { width: 15 }
        ];
    });

    // Process cafe data
    const cafeRows = cafe.map((item, idx) => [
        idx + 1, item.name, item.qty, parseInt(item.harga),
        parseInt(item.harga) * parseInt(item.qty), item.tax, item.discount,
        moment(item.createdAt).format("DD MMMM YYYY")
    ]);

    // Process boardgame data
    const boardgameRows = boardgame.map((item, idx) => [
        idx + 1, item.name, item.qty, parseInt(item.harga),
        parseInt(item.harga) * parseInt(item.qty), item.tax, item.discount,
        moment(item.createdAt).format("DD MMMM YYYY")
    ]);

    cafeRows.forEach(row => cafeWorksheet.addRow(row));
    boardgameRows.forEach(row => boardgameWorksheet.addRow(row));

    // Calculate totals
    const totalCafe = cafe.reduce((sum, item) => {
        return (item.category === "cafe" || item.category === "")
            ? sum + (parseInt(item.harga) * parseInt(item.qty))
            : sum;
    }, 0);

    const totalBoardGame = boardgame.reduce((sum, item) => {
        return item.category === "board game"
            ? sum + (parseInt(item.harga) * parseInt(item.qty))
            : sum;
    }, 0);

    // Add total rows
    const totalCafeRow = ["", "", "", "Total", totalCafe];
    const totalBoardGameRow = ["", "", "", "Total", totalBoardGame];

    cafeWorksheet.addRow(totalCafeRow);
    boardgameWorksheet.addRow(totalBoardGameRow);

    cafeWorksheet.getRow(cafeWorksheet.lastRow.number).font = { bold: true };
    boardgameWorksheet.getRow(boardgameWorksheet.lastRow.number).font = { bold: true };

    // Apply styling
    applyWorksheetStyling(cafeWorksheet, []);
    applyWorksheetStyling(boardgameWorksheet, []);

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, fileName);
};
