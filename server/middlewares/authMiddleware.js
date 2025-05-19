const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY || "your_secret_key";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "your_refresh_secret";

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1]; // Ambil token setelah "Bearer "
    
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(403).json({ error: "Forbidden: Invalid token" });

        req.user = decoded; // Simpan userId dari token
        next();
    });
};

module.exports = { authMiddleware, SECRET_KEY, REFRESH_SECRET };
