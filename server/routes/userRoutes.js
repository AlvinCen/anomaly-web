const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { authMiddleware } = require("../middlewares/authMiddleware");

// Model User (Schema fleksibel)
const UserSchema = new mongoose.Schema({}, { strict: false });
const User = mongoose.model("users", UserSchema, "users");

// 🟢 Tambah User ke MongoDB
router.post("/users/add", authMiddleware, async (req, res) => {
    try {
        const { name, role, username, hasAccessPos, hasAccessManage, password } = req.body;

        const newUser = new User({
            name,
            role,
            username,
            hasAccessPos,
            hasAccessManage,
            password
        });

        await newUser.save();
        res.json({ message: "User berhasil ditambahkan", data: newUser });
    } catch (err) {
        res.status(500).json({ error: "Gagal menambahkan user", message: err.message });
    }
});

// 🟢 Update User di MongoDB
router.put("/users/update", authMiddleware, async (req, res) => {
    try {
        const { id, name, role, username, hasAccessPos, hasAccessManage, password } = req.body;

        const updatedUser = await User.findByIdAndUpdate(id, {
            name,
            role,
            username,
            hasAccessPos,
            hasAccessManage,
            password
        }, { new: true });

        res.json({ message: "User berhasil diperbarui", data: updatedUser });
    } catch (err) {
        res.status(500).json({ error: "Gagal mengupdate user", message: err.message });
    }
});

// 🟢 Hapus User dari MongoDB
router.delete("/users/delete", authMiddleware, async (req, res) => {
    try {
        const { id } = req.body;
        await User.findByIdAndDelete(id);
        res.json({ message: "User berhasil dihapus" });
    } catch (err) {
        res.status(500).json({ error: "Gagal menghapus user", message: err.message });
    }
});

module.exports = router;
