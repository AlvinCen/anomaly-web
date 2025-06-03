const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const router = express.Router();
const moment = require("moment")

const { authMiddleware } = require("../middlewares/authMiddleware");

const convertDateFields = (data, dateFields = []) => {
    for (const key of dateFields) {
        if (data[key] && typeof data[key] === "string" && !isNaN(Date.parse(data[key]))) {
            data[key] = new Date(data[key]);
        }
    }
};

// Fungsi untuk mendapatkan model koleksi secara dinamis
const getModel = (collection) => {
    if (mongoose.models[collection]) {
        return mongoose.models[collection]; // Jika model sudah ada, gunakan yang sudah ada
    }

    return mongoose.model(collection, new mongoose.Schema({}, { strict: false }), collection);
};


const generateId = async () => {
    const datePart = moment().format("YYMMDD")
    const prefix = `TX-${datePart}`

    const Model = getModel("tableHistory");

    // const counter = await Counter.findOneAndUpdate(
    //     { _id: String(prefix) },
    //     { $inc: { seq: 1 } },
    //     { upsert: true, returnDocument: "after" }
    // )
    const last = await Model
        .find({ transactionId: { $regex: `^${prefix}-\\d{3}$` } })
        .sort({ transactionId: -1 })
        .limit(1)


    let counter = 1;
    if (last.length > 0) {
        const lastId = last[0].transactionId;
        const lastCounter = parseInt(lastId.split("-")[2], 10)
        counter = lastCounter + 1;
    }

    const sequence = String(counter).padStart(3, "0")
    return `${prefix}-${sequence}`
}


// ✅ **AMBIL DATA (READ)**
router.post("/data", authMiddleware, async (req, res) => {
    try {
        const { collection, filter = {}, sort = {} } = req.body;
        if (!collection) return res.status(400).json({ error: "Nama koleksi harus diberikan!" });

        const Model = getModel(collection);
        const result = await Model.find(filter).sort(sort);

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: "Gagal mengambil data", message: err.message });
    }
});

// ✅ **TAMBAH DATA (CREATE)**
router.post("/data/add", authMiddleware, async (req, res) => {
    try {
        let newData
        const { collection, data } = req.body;
        if (!collection || !data) return res.status(400).json({ error: "Nama koleksi dan data harus diberikan!" });

        if (collection === "cashier") convertDateFields(data, ["createdAt"])
        else if (collection === "storageLog") convertDateFields(data, ["createdAt"])

        const Model = getModel(collection);
        if (collection === "tableHistory") {
            const transactionId = await generateId()
            newData = new Model({ ...data, transactionId });
        } else {
            newData = new Model(data);
        }
        await newData.save();

        res.status(201).json({ message: "Data berhasil ditambahkan!", newData });
    } catch (err) {
        console.log(err.message)
        res.status(500).json({ error: "Gagal menambahkan data", message: err.message });
    }
});

// ✅ **UPDATE DATA (UPDATE)**
router.put("/data/update", authMiddleware, async (req, res) => {
    try {
        const { collection, filter, update } = req.body;
        // var tmpUpdate = { ...update }
        var tmpUpdate = req.body.update
        if (!collection || !filter || !update) return res.status(400).json({ error: "Nama koleksi, filter, dan update harus diberikan!" });

        if (collection === "cashier") convertDateFields(update, ["closeAt"])
        else if (collection === "storageLog") convertDateFields(update, ["createdAt"])

        const Model = getModel(collection);
        // if (collection === "user") tmpUpdate = { ...tmpUpdate, password: await bcrypt.hash(tmpUpdate?.password, 10) }
        if (collection === "user") {
            // Cek apakah username sudah digunakan oleh user lain
            const existing = await Model.findOne({ username: update.username, _id: { $ne: filter._id } });
            if (existing) return res.status(400).json({ error: "Username sudah digunakan oleh user lain." });

            // Hash password kalau diisi
            if (update.password) {
                tmpUpdate.password = await bcrypt.hash(update.password, 10);
            } else {
                delete tmpUpdate.password; // Jangan update password kalau kosong
            }
        }
        // const updatedData = await Model.findOneAndUpdate(filter, tmpUpdate, { new: true });
        let updatedData;
        if (Array.isArray(tmpUpdate)) {
            // Pipeline update
            const result = await Model.updateOne(filter, tmpUpdate);
            if (result.matchedCount === 0) {
                return res.status(404).json({ error: "Data tidak ditemukan!" });
            }
            updatedData = await Model.findOne(filter); // Query ulang untuk ambil data
        } else {
            // Normal update
            updatedData = await Model.findOneAndUpdate(filter, tmpUpdate, { new: true });
            if (!updatedData) {
                return res.status(404).json({ error: "Data tidak ditemukan!" });
            }
        }

        if (!updatedData) return res.status(404).json({ error: "Data tidak ditemukan!" });

        res.json({ message: "Data berhasil diperbarui!", updatedData });
    } catch (err) {
        res.status(500).json({ error: "Gagal memperbarui data", message: err.message });
    }
});

// ✅ **HAPUS DATA (DELETE)**
router.delete("/data/delete", authMiddleware, async (req, res) => {
    try {
        const { collection, filter } = req.body;
        if (!collection || !filter) return res.status(400).json({ error: "Nama koleksi dan filter harus diberikan!" });

        const Model = getModel(collection);
        const deletedData = await Model.findOneAndDelete(filter);

        if (!deletedData) return res.status(404).json({ error: "Data tidak ditemukan!" });

        res.json({ message: "Data berhasil dihapus!", deletedData });
    } catch (err) {
        res.status(500).json({ error: "Gagal menghapus data", message: err.message });
    }
});

module.exports = router;
