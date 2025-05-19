const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    cashierId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Kasir yang bertanggung jawab
    items: [
      {
        menuId: { type: mongoose.Schema.Types.ObjectId, ref: "Menu", required: true },
        quantity: { type: Number, required: true },
        totalPrice: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true }, // Total harga transaksi
    paymentMethod: { type: String, enum: ["cash", "card"], required: true }, // Metode pembayaran
    status: { type: String, enum: ["pending", "paid", "cancelled"], default: "pending" },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", TransactionSchema);
