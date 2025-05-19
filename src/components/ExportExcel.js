import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import moment from 'moment';

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

const exportToExcel = async (data, fileName = `Laporan-Anomaly-${moment().format("DD-MM-YYYY")}.xlsx`) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Laporan Harian');
    worksheet.addRow(["Saldo Awal : ", formatNumber(data?.saldoAwal)]);
    worksheet.addRow(["Saldo Akhir : ", formatNumber(data?.saldoAkhir)]);
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
        { width: 18 }, // Subtotal
        { width: 15 }, // Diskon
        { width: 15 }, // Pajak
        { width: 15 }, // Pajak
        { width: 20 }, // Subtotal
    ];

    const rows = data.transaction.map((trx) => {
        const totalHarga = trx.item.reduce(
            (sum, item) => sum + parseInt(item.harga) * parseInt(item.qty),
            0
        );
        const orderTotal = trx.item.reduce(
            (sum, item) => {
                if (item?.tipe !== undefined && item?.tipe !== "") return sum
                else return sum + parseInt(item.harga) * parseInt(item.qty)
            },
            0
        );

        console.log(orderTotal)
        const diskonNominal = trx.typeDiscount
            ? (orderTotal * trx.discount) / 100
            : trx.discount;
        const pajakNominal = (orderTotal * trx.tax) || 0;
        const subtotal = totalHarga - diskonNominal + pajakNominal;

        return [
            new Date(trx.createdAt).toLocaleString(),
            trx.transactionId,
            trx.client?.name || "",
            trx.tableName,
            formatNumber(totalHarga),
            formatNumber(diskonNominal),
            //   formatNumber(pajakNominal) + ` (${(trx?.tax || 0) * 100} %)`,
            formatNumber(pajakNominal),
            trx?.paymentMethod,
            formatNumber(subtotal),
        ];
    });

    const rows1 = data.pemasukan.map((trx) => [
        new Date(trx.createdAt).toLocaleString(),
        "",
        trx.note,
        "",
        formatNumber(trx.value),
        "",
        "",
        "",
        formatNumber(trx.value),
    ]);

    const rows2 = data.pengeluaran.map((trx) => [
        new Date(trx.createdAt).toLocaleString(),
        "",
        trx.note,
        "",
        "-" + formatNumber(trx.value),
        "",
        "",
        "",
        "-"+ formatNumber(trx.value),
    ]);


    [...rows, ...rows1, ...rows2].forEach((row) => {
        worksheet.addRow(row);
    });

    // Total baris
    const totalSubtotal = rows.reduce((sum, r) => sum + parseInt(r[8].replace(/\./g, '')), 0) +
        rows1.reduce((sum, r) => sum + parseInt(r[8].replace(/\./g, '')), 0) +
        rows2.reduce((sum, r) => sum + parseInt(r[8].replace(/\./g, '')), 0)

    const totalRow = ["", "", "", "", "", "", "", "Total", formatNumber(totalSubtotal)];
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

    // Rata kanan kolom angka
    // const colIndex = [5, 6, 7, 8]; // ExcelJS pakai 1-based index
    // worksheet.eachRow((row, rowNumber) => {
    //     colIndex.forEach((col) => {
    //         const cell = row.getCell(col);
    //         cell.alignment = { horizontal: 'right' };
    //     });
    // });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, fileName);
};

export default exportToExcel;
