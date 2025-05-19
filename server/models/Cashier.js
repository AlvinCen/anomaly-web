const mongoose = require("mongoose");

const CashierSchema = new mongoose.Schema(
  {
    tanggal: { type: Date, required: true }, // Tanggal transaksi
    time_in: { type: String, required: true }, // Jam buka
    closeAt: { type: String }, // Jam tutup (opsional)
    saldoAwal: { type: Number, required: true }, // Saldo awal kasir
    pemasukan: { type: Number, default: 0 }, // Total pemasukan
    pengeluaran: { type: Number, default: 0 }, // Total pengeluaran
    saldoAkhir: { type: Number, required: true }, // Saldo akhir kasir
    createdAt: { type: Date, default: Date.now }, // Waktu pencatatan
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cashier", CashierSchema);
