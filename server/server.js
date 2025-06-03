require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require('multer')
const cors = require('cors')
const path = require('path')
const cron = require("node-cron");
const moment = require("moment")
const cookieParser = require("cookie-parser");
const fs = require('fs')
const startWatcher = require("./watcher.js")

const { authMiddleware, SECRET_KEY, REFRESH_SECRET } = require("./middlewares/authMiddleware");
const User = require("./models/User");

const app = express();
const PORT = process.env.PORT || 5000;
const uploadDir = path.join(__dirname, 'uploads')

// Middleware
app.use(cors({
    origin: ['http://localhost', 'http://localhost:3000'], // HANYA mengizinkan request dari http://localhost
    credentials: true // Mengizinkan cookies & authentication headers
}));
app.use(express.json());
app.use(cookieParser()); // Untuk baca refresh token di cookie
app.use(express.urlencoded({ extended: true }))

// Koneksi MongoDB
mongoose.connect("mongodb://localhost:27017/anomaly")
    .then(async () => {
        console.log("✅ MongoDB Connected")

        await startWatcher();

        // const storageLog = mongoose.connection.collection("storageLog");

        // const docsToUpdate = await storageLog.find({
        //     createdAt: { $type: "string" } // cari yang masih string
        // }).toArray();

        // console.log(`🔍 Ditemukan ${docsToUpdate.length} dokumen dengan createdAt bertipe string.`);

        // for (const doc of docsToUpdate) {
        //     try {
        //         const parsedDate = new Date(doc.createdAt);
        //         if (isNaN(parsedDate.getTime())) {
        //             console.warn(`❌ Gagal parse tanggal untuk _id: ${doc._id}`);
        //             continue;
        //         }

        //         await storageLog.updateOne(
        //             { _id: doc._id },
        //             { $set: { createdAt: parsedDate } }
        //         );

        //         console.log(`✅ Updated _id: ${doc._id} → ${parsedDate.toISOString()}`);
        //     } catch (err) {
        //         console.error(`❌ Error updating _id: ${doc._id}`, err.message);
        //     }
        // }

        // console.log("✅ Migrasi selesai.");

        // ⬇️ Tambahkan ini
        // const syncProductReport = require("./syncProductReport.js");
        // await syncProductReport(); // Jalankan sinkronisasi productReport
        // const syncStorage = require("./syncProductReport.js");
        // await syncStorage(); // Jalankan sinkronisasi productReport

    })
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

// 🔥 Buat Token
const generateAccessToken = (user) => jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: "30d" });
const generateRefreshToken = (user) => jwt.sign({ userId: user._id }, REFRESH_SECRET, { expiresIn: "30d" });

// Cek dan buat folder kalau belum ada
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir)
}

// Fungsi untuk mendapatkan model koleksi secara dinamis
const getModel = (collection) => {
    if (mongoose.models[collection]) {
        return mongoose.models[collection]; // Jika model sudah ada, gunakan yang sudah ada
    }
    return mongoose.model(collection, new mongoose.Schema({}, { strict: false }), collection);
};

cron.schedule("*/5 * * * *", async () => {
    try {
        const Member = getModel("member")
        const members = await Member.find({
            status: { $ne: "EXPIRED" },
            "subscription.expired": { $exists: true }
        })
        const now = moment()
        const expiredMembers = members.filter(member => moment(member.subscription.expired).isBefore(now))
        for (const member of expiredMembers) {
            await Member.updateOne(
                { _id: member._id },
                { $set: { status: "EXPIRED" } }
            )
            console.log(`[CRON] Updated ${member.name || member._id} member(s) to EXPIRED`)
        }

    } catch (err) {
        console.log(`Error in member expiration check :`, err)
    }
})


// ✅ REGISTER
app.post("/api/auth/register", async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ error: "Username sudah digunakan" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const Model = getModel("user")
        const newUser = new Model({ ...req.body, role: "admin", password: hashedPassword })
        await newUser.save();

        res.status(201).json({ message: "User berhasil dibuat!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ LOGIN + SET REFRESH TOKEN DI COOKIE
app.post("/api/auth/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ error: "User tidak ditemukan" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Password salah" });

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Simpan refresh token di HttpOnly Cookie (lebih aman)
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true, // Aktifkan ini jika pakai HTTPS
            sameSite: "Strict"
        });

        res.json({ user, accessToken });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ AUTO REFRESH TOKEN
app.post("/api/auth/refresh", (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ error: "Unauthorized" });

    jwt.verify(refreshToken, REFRESH_SECRET, async (err, decoded) => {
        if (err) return res.status(403).json({ error: "Invalid refresh token" });

        const user = await User.findById(decoded.userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        const newAccessToken = generateAccessToken(user);
        res.json({ accessToken: newAccessToken });
    });
});

// ✅ LOGOUT (Hapus Refresh Token)
app.post("/api/auth/logout", (req, res) => {
    res.clearCookie("refreshToken");
    res.json({ message: "Logout berhasil" });
});


app.post("/api/change-password", async (req, res) => {
    try {
        const { id, currentPassword, newPassword } = req.body;
        var currPass = Buffer.from(currentPassword, 'base64').toString('utf-8');
        var newPass = Buffer.from(newPassword, 'base64').toString('utf-8');

        if (!id || !currentPassword || !newPassword) {
            return res.status(400).json({ error: "Semua field wajib diisi." });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: "User tidak ditemukan." });
        }

        // Cek password lama
        const isMatch = await bcrypt.compare(currPass, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Password lama salah." });
        }

        // Hash password baru
        const hashedPassword = await bcrypt.hash(newPass, 10);
        user.password = hashedPassword;
        await user.save();

        res.json({ message: "Password berhasil diganti." });
    } catch (err) {
        console.error("Change password error:", err);
        res.status(500).json({ error: "Gagal mengganti password", message: err.message });

    }
});

// ✅ CEK USER (Butuh Token)
app.get("/api/protected/dashboard", authMiddleware, async (req, res) => {
    try {
        // console.log(req.user)
        const user = await User.findById(req.user.userId).select("-password");
        // console.log(user)
        res.json({ user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.get("/api/storageReport", authMiddleware, async (req, res) => {

    try {
        const { startDate, endDate } = req.query;
        const StorageLog = getModel("storageLog");
        const StorageReport = getModel("storageReport");
        var total = 0;

        const storageLogs = await StorageLog.find(
            {
                createdAt: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                },
                event: "update"
            }
        );

        var data = {
            createdAt: moment().tz("Asia/Jakarta").toDate(),
            startDate,
            endDate,
            item: []
        }

        for (const str of storageLogs) {
            if (str.beforeStok > str.stok) {
                var usedStok = Number(str.beforeStok) - Number(str.stok)
                total += usedStok * str?.costPerItem
                data.item.push({ tipe: str?.tipe, usedStok, cost: usedStok * str?.costPerItem, costPerItem: str.costPerItem })
            }
        }
        data.total = Math.ceil(total)
        await StorageReport.create(data);

        console.log("✅ Pembuat Laporan Storage selesai.");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Setup penyimpanan dengan multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/') // folder tujuan
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)) // nama file
    }
})

const upload = multer({ storage: storage })

// Endpoint upload
app.post('/upload', upload.single('foto'), (req, res) => {
    console.log(req.file)
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' })
    }

    // buat URL public
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`

    res.status(200).json({
        message: 'Upload berhasil',
        filename: req.file.filename,
        url: fileUrl
    })
})

const dataRoutes = require("./routes/dataRoutes");
app.use("/api", dataRoutes);
app.use('/uploads', express.static('uploads'))

// ✅ Jalankan server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
