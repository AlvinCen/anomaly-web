import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import moment from 'moment';

export const exportToExcel = async (data, fileName = `Laporan-Anomaly-${moment(data?.createdAt).format("DD-MM-YYYY")}.xlsx`, startDate, endDate) => {
    const workbook = new ExcelJS.Workbook();
    if (data.length > 0) {
        const summaryWorksheet = workbook.addWorksheet(`Summary Laporan ${startDate} - ${endDate}`);
        const worksheet = workbook.addWorksheet(`Laporan ${startDate} - ${endDate}`);
        var grandTotal = 0

        // Header
        const summaryHeaders = [
            "Tanggal",
            "Cash",
            "QRIS",
            "Debit",
            "Grabfood",
            "Gofood",
            "Board Game Revenue",
            "Cafe Revenue",
            "Total Revenue",
        ];

        const headers = [
            "Tanggal",
            "ReceiptID",
            "Pelanggan",
            "Meja",
            "Sub Total",
            "Diskon",
            `Pajak`,
            `Payment Method`,
            "Grand Total"
        ];

        summaryWorksheet.addRow(summaryHeaders);
        worksheet.addRow(headers);

        summaryWorksheet.columns = [
            { width: 22 }, // Tanggal
            { width: 20, style: { numFmt: '#,##0' } }, // Cash
            { width: 20, style: { numFmt: '#,##0' } }, // QRIS
            { width: 20, style: { numFmt: '#,##0' } }, // Debit
            { width: 20, style: { numFmt: '#,##0' } }, // Grabfood
            { width: 20, style: { numFmt: '#,##0' } }, // Gofood
            { width: 20, style: { numFmt: '#,##0' } }, // Board Game
            { width: 20, style: { numFmt: '#,##0' } }, // Cafe
            { width: 23, style: { numFmt: '#,##0' } }, // Total
        ];
        worksheet.columns = [
            { width: 22 }, // Tanggal
            { width: 25 }, // ReceiptID
            { width: 25 }, // Pelanggan
            { width: 15 }, // Meja
            { width: 18, style: { numFmt: '#,##0' } }, // Subtotal
            { width: 15, style: { numFmt: '#,##0' } }, // Diskon
            { width: 15, style: { numFmt: '#,##0' } }, // Pajak
            { width: 15 }, // Payment method
            { width: 20, style: { numFmt: '#,##0' } }, // Subtotal
        ];

        var summaryRows = data.flatMap((data) => {
            var cashTotal = 0
            var qris = 0
            var debit = 0
            var gofoodTotal = 0
            var grabfoodTotal = 0
            var boardGameRevenue = 0
            var cafeRevenue = 0

            const dataWorksheet = workbook.addWorksheet(`Laporan ${moment(data?.createdAt).format("DD-MM-YYYY")}`);

            // Header
            const headers = [
                "Tanggal",
                "ReceiptID",
                "Meja",
                "Item",
                "Qty",
                "Harga",
                "Sub Total",
                "Discount",
                "Pajak",
                "Total",
            ];

            dataWorksheet.addRow(headers);

            dataWorksheet.columns = [
                { width: 22 }, // Tanggal
                { width: 25 }, // ReceiptID
                { width: 15 }, // Meja
                { width: 35 }, // Item
                { width: 10 }, // Qty
                { width: 15, style: { numFmt: '#,##0' } }, // Harga
                { width: 15, style: { numFmt: '#,##0' } }, // Subtotal
                { width: 15, style: { numFmt: '#,##0' } }, // Diskon
                { width: 15, style: { numFmt: '#,##0' } }, // Pajak
                { width: 22, style: { numFmt: '#,##0' } }, // Total
            ];

            const rows = data.transaction.flatMap((trx) => {
                if (trx?.splitBill !== undefined) {
                    return trx.splitBill.map((bill) => {
                        const totalHarga = bill.item.reduce(
                            (sum, item) => sum + parseInt(item.harga) * parseInt(item.qty),
                            0
                        );
                        const orderTotal = bill.item.reduce(
                            (sum, item) => {
                                if (item?.tipe !== undefined && item?.tipe !== "") return sum;
                                return sum + parseInt(item.harga) * parseInt(item.qty);
                            },
                            0
                        );

                        const diskonNominal = bill.typeDiscount
                            ? (orderTotal * bill.discount) / 100
                            : bill.discount;
                        const pajakNominal = (orderTotal * bill.tax) || 0;
                        const subtotal = totalHarga - diskonNominal + pajakNominal;

                        return [
                            new Date(trx.createdAt).toLocaleString(),
                            trx.transactionId,
                            trx.client?.name || "",
                            trx.tableName,
                            (totalHarga),
                            (diskonNominal),
                            (pajakNominal),
                            bill?.paymentMethod,
                            (subtotal),
                        ];
                    });
                } else {
                    const totalHarga = trx.item.reduce(
                        (sum, item) => sum + parseInt(item.harga) * parseInt(item.qty),
                        0
                    );
                    const orderTotal = trx.item.reduce(
                        (sum, item) => {
                            if (item?.tipe !== undefined && item?.tipe !== "") return sum;
                            return sum + parseInt(item.harga) * parseInt(item.qty);
                        },
                        0
                    );

                    const diskonNominal = trx.typeDiscount
                        ? (orderTotal * trx.discount) / 100
                        : trx.discount;
                    const pajakNominal = (orderTotal * trx.tax) || 0;
                    const subtotal = totalHarga - diskonNominal + pajakNominal;

                    return [[
                        new Date(trx.createdAt).toLocaleString(),
                        trx.transactionId,
                        trx.client?.name || "",
                        trx.tableName,
                        (totalHarga),
                        (diskonNominal),
                        (pajakNominal),
                        trx?.paymentMethod,
                        (subtotal),
                    ]]; // dibungkus array karena `flatMap`
                }
            });

            const dataRows = data.transaction.flatMap((trx) => {
                return trx.item.map((item) => {
                    if (item?.addOns) {
                        var totalAddOn = item?.addOns?.reduce((total1, item1) => {
                            return total1 + Number(item1.harga);
                        }, 0)
                        var subTotal = item?.qty * (Number(item?.harga) + Number(totalAddOn))
                        const diskonNominal = trx.typeDiscount
                            ? (subTotal * trx.discount) / 100
                            : trx.discount;
                        const pajakNominal = (subTotal * trx.tax) || 0;
                        const total = subTotal - diskonNominal + pajakNominal;
                        return [
                            new Date(trx.createdAt).toLocaleString(),
                            trx.transactionId,
                            trx.tableName,
                            item?.name,
                            item?.qty,
                            (Number(item?.harga) + Number(totalAddOn)),
                            (subTotal),
                            (diskonNominal),
                            (pajakNominal),
                            (total),
                        ];
                    } else {
                        var subTotal = item?.qty * (Number(item?.harga))
                        const diskonNominal = trx.typeDiscount
                            ? (subTotal * trx.discount) / 100
                            : trx.discount;
                        const total = subTotal - diskonNominal;
                        return [
                            new Date(trx.createdAt).toLocaleString(),
                            trx.transactionId,
                            trx.tableName,
                            item?.name,
                            item?.qty,
                            (item?.harga),
                            (subTotal),
                            (diskonNominal),
                            "0",
                            (total),
                        ];
                    }
                })
            });

            const rows1 = data.pemasukan.map((trx) => [
                new Date(trx.createdAt).toLocaleString(),
                "",
                trx.note,
                "",
                (trx.value),
                "",
                "",
                "",
                (trx.value),
            ]);

            const rows2 = data.pengeluaran.map((trx) => [
                new Date(trx.createdAt).toLocaleString(),
                "",
                trx.note,
                "",
                "-" + (trx.value),
                "",
                "",
                "",
                "-" + (trx.value),
            ]);

            dataRows.forEach((row) => {
                dataWorksheet.addRow(row);
            });

            [...rows, ...rows1, ...rows2].forEach((row) => {
                worksheet.addRow(row);
            });

            // Total baris
            const totalSubtotal = rows.reduce((sum, r) => sum + parseInt(r[8]), 0) +
                rows1.reduce((sum, r) => sum + parseInt(r[8]), 0) +
                rows2.reduce((sum, r) => sum + parseInt(r[8]), 0)
            grandTotal += totalSubtotal

            const totalDataRow = ["", "", "", "", "", "", "", "", "Total", (totalSubtotal)];
            dataWorksheet.addRow(totalDataRow);

            // Bold total
            const totalDataRowIndex = dataWorksheet.lastRow.number;
            dataWorksheet.getRow(totalDataRowIndex).font = { bold: true };

            // Apply alignment + border ke semua cell
            dataWorksheet.eachRow((row, rowNumber) => {
                row.eachCell((cell, colNumber) => {
                    // Border semua sisi
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' },
                    };

                    // Rata kanan untuk kolom angka (Harga, Diskon, Pajak, Subtotal)
                    if ([5, 6, 7, 8].includes(colNumber)) {
                        cell.alignment = { horizontal: 'right' };
                    }
                });
            });

            data?.transaction?.map((transaction) => {
                if (transaction?.splitBill === undefined) {
                    boardGameRevenue += transaction?.item.reduce((total, item) => {
                        const harga = item?.harga || 0;
                        if (item?.tipe) return total + (Number(harga) * item?.qty);
                        else return total
                    }, 0);
                    cafeRevenue += transaction?.item.reduce((total, item) => {
                        var totalAddOn = item?.addOns ? item?.addOns?.reduce((total1, item1) => {
                            return total1 + Number(item1.harga);
                        }, 0) : 0
                        const harga = item?.harga || 0;
                        if (item?.addOns !== undefined) return total + ((Number(harga) + Number(totalAddOn)) * item?.qty);
                        else return total
                    }, 0);

                    if (transaction?.paymentMethod === "cash") {
                        var total = transaction?.item.reduce((sum, item) => {
                            // const harga = data?.hargaVoid ? data?.hargaVoid : data?.harga;
                            const harga = item?.harga || 0;
                            return sum + ((Number(harga)) * item?.qty);
                        }, 0);
                        cashTotal += Number(total || 0)
                    }
                    else if (transaction?.paymentMethod === "qris") {
                        var total = transaction?.item.reduce((total, item) => {
                            // const harga = data?.hargaVoid ? data?.hargaVoid : data?.harga;
                            const harga = item?.harga || 0;
                            return total + ((Number(harga)) * item?.qty);
                        }, 0);
                        qris += (total || 0)
                    }
                    else if (transaction?.paymentMethod === "debit") {
                        var total = transaction?.item.reduce((total, item) => {
                            // const harga = data?.hargaVoid ? data?.hargaVoid : data?.harga;
                            const harga = item?.harga || 0;
                            return total + ((Number(harga)) * item?.qty);
                        }, 0);
                        debit += (total || 0)
                    }
                    else if (transaction?.paymentMethod === "grabfood") {
                        var total = transaction?.item.reduce((total, item) => {
                            // const harga = data?.hargaVoid ? data?.hargaVoid : data?.harga;
                            const harga = item?.harga || 0;
                            return total + ((Number(harga)) * item?.qty);
                        }, 0);
                        grabfoodTotal += (total || 0)
                    }
                    else if (transaction?.paymentMethod === "gofood") {
                        var total = transaction?.item.reduce((total, item) => {
                            // const harga = data?.hargaVoid ? data?.hargaVoid : data?.harga;
                            const harga = item?.harga || 0;
                            return total + ((Number(harga)) * item?.qty);
                        }, 0);
                        gofoodTotal += (total || 0)
                    }
                }
                else {
                    // console.log(transaction)
                    transaction?.splitBill.map((splitBill) => {
                        boardGameRevenue += splitBill?.item.reduce((total, item) => {
                            const harga = item?.harga || 0;
                            if (item?.tipe) return total + (Number(harga) * item?.qty);
                            else return total
                        }, 0);
                        cafeRevenue += splitBill?.item.reduce((total, item) => {
                            var totalAddOn = item?.addOns ? item?.addOns?.reduce((total1, item1) => {
                                return total1 + Number(item1.harga);
                            }, 0) : 0
                            const harga = item?.harga || 0;
                            if (item?.addOns !== undefined) return total + ((Number(harga) + Number(totalAddOn)) * item?.qty);
                            else return total
                        }, 0);
                        if (splitBill?.paymentMethod === "cash") {
                            var total = splitBill?.item.reduce((total, item) => {
                                // const harga = data?.hargaVoid ? data?.hargaVoid : data?.harga;
                                const harga = item?.harga || 0;
                                return total + ((Number(harga)) * item?.qty);
                            }, 0);
                            cashTotal += (total || 0)
                        }
                        else if (splitBill?.paymentMethod === "qris") {
                            var total = splitBill?.item.reduce((total, item) => {
                                // const harga = data?.hargaVoid ? data?.hargaVoid : data?.harga;
                                const harga = item?.harga || 0;
                                return total + ((Number(harga)) * item?.qty);
                            }, 0);
                            qris += (total || 0)
                        }
                        else if (splitBill?.paymentMethod === "debit") {
                            var total = splitBill?.item.reduce((total, item) => {
                                // const harga = data?.hargaVoid ? data?.hargaVoid : data?.harga;
                                const harga = item?.harga || 0;
                                return total + ((Number(harga)) * item?.qty);
                            }, 0);
                            debit += (total || 0)
                        }
                        else if (splitBill?.paymentMethod === "grabfood") {
                            var total = splitBill?.item.reduce((total, item) => {
                                // const harga = data?.hargaVoid ? data?.hargaVoid : data?.harga;
                                const harga = item?.harga || 0;
                                return total + ((Number(harga)) * item?.qty);
                            }, 0);
                            grabfoodTotal += (total || 0)
                        }
                        else if (splitBill?.paymentMethod === "gofood") {
                            var total = splitBill?.item.reduce((total, item) => {
                                // const harga = data?.hargaVoid ? data?.hargaVoid : data?.harga;
                                const harga = item?.harga || 0;
                                return total + ((Number(harga)) * item?.qty);
                            }, 0);
                            gofoodTotal += (total || 0)
                        }
                    });
                }
            })

            return [[
                new Date(data.createdAt).toLocaleString(),
                (cashTotal),
                (qris),
                (debit),
                (grabfoodTotal),
                (gofoodTotal),
                (boardGameRevenue),
                (cafeRevenue),
                ((boardGameRevenue + cafeRevenue)/* + taxTotal - discountTotal)*/ || 0),
            ]]; // dibungkus array karena `flatMap`
        })

        const totalRow = ["", "", "", "", "", "", "", "Total", (grandTotal)];
        worksheet.addRow(totalRow);

        const totalRowIndex = worksheet.lastRow.number;
        worksheet.getRow(totalRowIndex).font = { bold: true };

        worksheet.eachRow((row, rowNumber) => {
            row.eachCell((cell, colNumber) => {
                // Border semua sisi
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' },
                };

                // Rata kanan untuk kolom angka (Harga, Diskon, Pajak, Subtotal)
                if ([5, 6, 7, 8].includes(colNumber)) {
                    cell.alignment = { horizontal: 'right' };
                }
            });
        });

        summaryRows.forEach((row) => {
            summaryWorksheet.addRow(row);
        });

        const totalDataRowSummary = ["", "", "", "", "", "", "", "Total", (grandTotal)];
        summaryWorksheet.addRow(totalDataRowSummary);

        // Bold total
        const totalDataRowIndexSummmary = summaryWorksheet.lastRow.number;
        summaryWorksheet.getRow(totalDataRowIndexSummmary).font = { bold: true };

        // Apply alignment + border ke semua cell
        summaryWorksheet.eachRow((row, rowNumber) => {
            row.eachCell((cell, colNumber) => {
                // Border semua sisi
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' },
                };

                // Rata kanan untuk kolom angka (Harga, Diskon, Pajak, Subtotal)
                if ([5, 6, 7, 8].includes(colNumber)) {
                    cell.alignment = { horizontal: 'right' };
                }
            });
        });
    }
    else {
        const worksheet = workbook.addWorksheet('Laporan Harian');
        worksheet.addRow(["Saldo Awal : ", (data?.saldoAwal)]);
        worksheet.addRow(["Saldo Akhir : ", (data?.saldoAkhir)]);
        worksheet.addRow(["Jam Buka : ", new Date(data.createdAt).toLocaleString()]);
        worksheet.addRow(["Jam Tutup : ", new Date(data?.closeAt).toLocaleString()]);
        worksheet.addRow([]);

        // Header
        const headers = [
            "Tanggal",
            "ReceiptID",
            "Pelanggan",
            "Meja",
            "Sub Total",
            "Diskon",
            // data.transaction[0]?.typeDiscount !== undefined ? `Diskon (${data.transaction[0].typeDiscount ? data.transaction[0].discount + "%" : data.transaction[0].discount})` : "Diskon",
            `Pajak`,
            `Payment Method`,
            "Grand Total"
        ];

        worksheet.addRow(headers);

        // Styling header
        for (let i = 1; i <= 6; i++) {
            const row = worksheet.getRow(i);
            row.font = { bold: true };
        }

        worksheet.columns = [
            { width: 22 }, // Tanggal
            { width: 25 }, // ReceiptID
            { width: 25 }, // Pelanggan
            { width: 15 }, // Meja
            { width: 18, style: { numFmt: '#,##0' } }, // Subtotal
            { width: 15, style: { numFmt: '#,##0' } }, // Diskon
            { width: 15, style: { numFmt: '#,##0' } }, // Pajak
            { width: 15 }, // Payment method
            { width: 20, style: { numFmt: '#,##0' } }, // Subtotal
        ];

        const rows = data.transaction.flatMap((trx) => {
            if (trx?.splitBill !== undefined) {
                return trx.splitBill.map((bill) => {
                    const totalHarga = bill.item.reduce(
                        (sum, item) => sum + parseInt(item.harga) * parseInt(item.qty),
                        0
                    );
                    const orderTotal = bill.item.reduce(
                        (sum, item) => {
                            if (item?.tipe !== undefined && item?.tipe !== "") return sum;
                            return sum + parseInt(item.harga) * parseInt(item.qty);
                        },
                        0
                    );

                    const diskonNominal = bill.typeDiscount
                        ? (orderTotal * bill.discount) / 100
                        : bill.discount;
                    const pajakNominal = (orderTotal * bill.tax) || 0;
                    const subtotal = totalHarga - diskonNominal + pajakNominal;

                    return [
                        new Date(trx.createdAt).toLocaleString(),
                        trx.transactionId,
                        trx.client?.name || "",
                        trx.tableName,
                        (totalHarga),
                        (diskonNominal),
                        (pajakNominal),
                        bill?.paymentMethod,
                        (subtotal),
                    ];
                });
            } else {
                const totalHarga = trx.item.reduce(
                    (sum, item) => sum + parseInt(item.harga) * parseInt(item.qty),
                    0
                );
                const orderTotal = trx.item.reduce(
                    (sum, item) => {
                        if (item?.tipe !== undefined && item?.tipe !== "") return sum;
                        return sum + parseInt(item.harga) * parseInt(item.qty);
                    },
                    0
                );

                const diskonNominal = trx.typeDiscount
                    ? (orderTotal * trx.discount) / 100
                    : trx.discount;
                const pajakNominal = (orderTotal * trx.tax) || 0;
                const subtotal = totalHarga - diskonNominal + pajakNominal;

                return [[
                    new Date(trx.createdAt).toLocaleString(),
                    trx.transactionId,
                    trx.client?.name || "",
                    trx.tableName,
                    (totalHarga),
                    (diskonNominal),
                    (pajakNominal),
                    trx?.paymentMethod,
                    (subtotal),
                ]]; // dibungkus array karena `flatMap`
            }
        });

        const rows1 = data.pemasukan.map((trx) => [
            new Date(trx.createdAt).toLocaleString(),
            "",
            trx.note,
            "",
            (trx.value),
            "",
            "",
            "",
            (trx.value),
        ]);

        const rows2 = data.pengeluaran.map((trx) => [
            new Date(trx.createdAt).toLocaleString(),
            "",
            trx.note,
            "",
            "-" + (trx.value),
            "",
            "",
            "",
            "-" + (trx.value),
        ]);


        [...rows, ...rows1, ...rows2].forEach((row) => {
            worksheet.addRow(row);
        });

        // Total baris
        const totalSubtotal = rows.reduce((sum, r) => sum + parseInt(r[8]), 0) +
            rows1.reduce((sum, r) => sum + parseInt(r[8]), 0) +
            rows2.reduce((sum, r) => sum + parseInt(r[8]), 0)

        const totalRow = ["", "", "", "", "", "", "", "Total", (totalSubtotal)];
        worksheet.addRow(totalRow);

        // Bold total
        const totalRowIndex = worksheet.lastRow.number;
        worksheet.getRow(totalRowIndex).font = { bold: true };

        // Apply alignment + border ke semua cell
        worksheet.eachRow((row, rowNumber) => {
            row.eachCell((cell, colNumber) => {
                // Border semua sisi
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' },
                };

                // Rata kanan untuk kolom angka (Harga, Diskon, Pajak, Subtotal)
                if ([5, 6, 7, 8].includes(colNumber)) {
                    cell.alignment = { horizontal: 'right' };
                }
            });
        });
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, fileName);
};

export const exportStorage = async (data, fileName = `Laporan-Storage.xlsx`) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Laporan Storage');

    // Header
    const headers = [
        "#",
        "Item",
        "Stock Type",
        "Stock Before",
        "Stock",
        "Cost",
        "Cost Per Item",
        `Event Type`,
        `Created At`
    ];

    worksheet.addRow(headers);

    // // Styling header
    // for (let i = 1; i <= 6; i++) {
    //     const row = worksheet.getRow(i);
    //     row.font = { bold: true };
    // }


    // Styling header
    for (let i = 1; i <= 6; i++) {
        const headerRow = worksheet.getRow(1);
        headerRow.font = { bold: true };
    }

    worksheet.columns = [
        { width: 5 }, // #
        { width: 25 }, // Nama Item
        { width: 10 }, // Tipe Stok
        { width: 10 }, // StokBefore
        { width: 10 }, // Stok
        { width: 15 }, // Harga
        { width: 18 }, // Cost Per Item
        { width: 15 }, // Event Type
        { width: 15 }, // CreatedAt
    ];
    const rows = data.map((data, idx) => {
        if (data.event === "add")
            return [
                idx + 1,
                data.name,
                data.tipe,
                "",
                data.stok,
                parseInt(data.harga),
                data?.costPerItem,
                data.event,
                moment(data.createdAt).format("DD MMMM YYYY"),
            ];
        if (data.event === "update")
            return [
                idx + 1,
                data.name,
                data.tipe,
                data?.beforeStok,
                data.stok,
                parseInt(Math.abs(data?.beforeStok !== undefined ? (data?.beforeStok - data?.stok) * data?.costPerItem : data?.harga)),
                data?.costPerItem,
                data.event,
                moment(data.createdAt).format("DD MMMM YYYY"),
            ];
        else return
    });

    rows.forEach((row) => {
        worksheet.addRow(row);
    });

    // Total baris
    const totalHarga = data.reduce((sum, r) => {
        if (r.event === "update")
            return sum + parseInt(r.cost)
        else return sum
    }, 0)



    const totalRow = ["", "", "", "", "Total", (totalHarga)];
    worksheet.addRow(totalRow);

    // Bold total
    const totalRowIndex = worksheet.lastRow.number;
    worksheet.getRow(totalRowIndex).font = { bold: true };

    // Apply alignment + border ke semua cell
    worksheet.eachRow((row, rowNumber) => {
        row.eachCell((cell, colNumber) => {
            // Border semua sisi
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' },
            };

        });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, fileName);
};

export const exportStorageExpense = async (data, fileName = `Laporan-Storage_Expense-${moment(data?.createdAt).format("DD-MM-YYYY")}.xlsx`) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Laporan Storage');

    // Header
    const headers = [
        "#",
        "Item",
        "Stock Type",
        // "Stock Before",
        "Stock",
        "Cost",
        "Cost Per Item",
        `Event Type`,
        `Created At`
    ];

    worksheet.addRow(headers);

    // // Styling header
    // for (let i = 1; i <= 6; i++) {
    //     const row = worksheet.getRow(i);
    //     row.font = { bold: true };
    // }


    // Styling header
    for (let i = 1; i <= 6; i++) {
        const headerRow = worksheet.getRow(1);
        headerRow.font = { bold: true };
    }

    worksheet.columns = [
        { width: 5 }, // #
        { width: 25 }, // Nama Item
        { width: 10 }, // Tipe Stok
        // { width: 10 }, // StokBefore
        { width: 10 }, // Stok
        { width: 15 }, // Harga
        { width: 18 }, // Cost Per Item
        { width: 15 }, // Event Type
        { width: 15 }, // CreatedAt
    ];
    const rows = data.map((data, idx) => {
        if (data.event === "add")
            return [
                idx + 1,
                data.name,
                data.tipe,
                // "",
                data.stok,
                parseInt(data.harga),
                data?.costPerItem,
                data.event,
                moment(data.createdAt).format("DD MMMM YYYY"),
            ];

        // if (data.event === "update")
        //     return [
        //         idx + 1,
        //         data.name,
        //         data.tipe,
        //         // data?.beforeStok,
        //         data.stok,
        //         parseInt(Math.abs(data?.beforeStok !== undefined ? (data?.beforeStok - data?.stok) * data?.costPerItem : data?.harga)),
        //         data?.costPerItem,
        //         data.event,
        //         moment(data.createdAt).format("DD MMMM YYYY"),
        //     ];
        return null
    });

    rows
        .filter(Boolean) // buang undefined/null
        .forEach((row) => {
            worksheet.addRow(row);
        });

    // Total baris
    const totalHarga = data.reduce((sum, r) => {
        if (r.event === "add")
            return sum + parseInt(r.harga)
        else return sum
    }, 0)


    // console.log(totalHarga)

    const totalRow = ["", "", "", "Total", (totalHarga)];
    worksheet.addRow(totalRow);

    // Bold total
    const totalRowIndex = worksheet.lastRow.number;
    worksheet.getRow(totalRowIndex).font = { bold: true };

    // Apply alignment + border ke semua cell
    worksheet.eachRow((row, rowNumber) => {
        row.eachCell((cell, colNumber) => {
            // Border semua sisi
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' },
            };

        });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, fileName);
};

export const exportProduct = async (cafe, boardgame, fileName = `Laporan-Product.xlsx`) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Laporan Cafe');
    const worksheet1 = workbook.addWorksheet('Laporan Board Game');

    // Header
    const headers = [
        "#",
        "Item",
        "Qty",
        "Price",
        "Total",
        "PB1",
        "Discount",
        `Created At`
    ];

    worksheet.addRow(headers);
    worksheet1.addRow(headers);

    // // Styling header
    // for (let i = 1; i <= 6; i++) {
    //     const row = worksheet.getRow(i);
    //     row.font = { bold: true };
    // }


    // Styling header
    for (let i = 1; i <= 6; i++) {
        const headerRow = worksheet.getRow(1);
        headerRow.font = { bold: true };
    }

    // Styling header
    for (let i = 1; i <= 6; i++) {
        const headerRow = worksheet1.getRow(1);
        headerRow.font = { bold: true };
    }

    worksheet.columns = [
        { width: 5 }, // #
        { width: 25 }, // Nama Item
        { width: 5 }, // Qty
        { width: 10 }, // Price
        { width: 10 }, // Total
        { width: 5 }, // PB1
        { width: 5 }, // Discount
        { width: 15 }, // CreatedAt
    ];

    worksheet1.columns = [
        { width: 5 }, // #
        { width: 25 }, // Nama Item
        { width: 5 }, // Qty
        { width: 10 }, // Price
        { width: 10 }, // Total
        { width: 5 }, // PB1
        { width: 5 }, // Discount
        { width: 15 }, // CreatedAt
    ];
    const rows = cafe.map((data, idx) => {
        return [
            idx + 1,
            data.name,
            data.qty,
            parseInt(data.harga),
            parseInt(data.harga) * parseInt(data.qty),
            data.tax,
            data.discount,
            moment(data.createdAt).format("DD MMMM YYYY"),
        ];
    });

    const rows1 = boardgame.map((data, idx) => {
        return [
            idx + 1,
            data.name,
            data.qty,
            parseInt(data.harga),
            parseInt(data.harga) * parseInt(data.qty),
            data.tax,
            data.discount,
            moment(data.createdAt).format("DD MMMM YYYY"),
        ];
    });

    rows.forEach((row) => {
        worksheet.addRow(row);
    });

    rows1.forEach((row) => {
        worksheet1.addRow(row);
    });

    // Total baris
    const totalCafe = cafe.reduce((sum, r) => {
        if (r.category === "cafe" || r.category === "")
            return sum + (parseInt(r.harga) * parseInt(r.qty))
        else return sum
    }, 0)

    const totalBoardGame = boardgame.reduce((sum, r) => {
        if (r.category === "board game")
            return sum + (parseInt(r.harga) * parseInt(r.qty))
        else return sum
    }, 0)


    const totalRow = ["", "", "", "Total", (totalCafe)];
    worksheet.addRow(totalRow);

    const totalRow1 = ["", "", "", "Total", (totalBoardGame)];
    worksheet1.addRow(totalRow1);

    // Bold total
    const totalRowIndex = worksheet.lastRow.number;
    worksheet.getRow(totalRowIndex).font = { bold: true };

    const totalRowIndex1 = worksheet.lastRow.number;
    worksheet1.getRow(totalRowIndex1).font = { bold: true };

    // Apply alignment + border ke semua cell
    worksheet.eachRow((row, rowNumber) => {
        row.eachCell((cell, colNumber) => {
            // Border semua sisi
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' },
            };

        });
    });

    // Apply alignment + border ke semua cell
    worksheet1.eachRow((row, rowNumber) => {
        row.eachCell((cell, colNumber) => {
            // Border semua sisi
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' },
            };

        });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, fileName);
};

