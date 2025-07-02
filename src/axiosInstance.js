import axios from "axios";

const accessToken = localStorage.getItem("token");

const api = axios.create({
    baseURL: "http://192.168.1.100:5000/api", // Sesuaikan dengan URL backend
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}` // Set token di semua request
    },
    withCredentials: true // Agar bisa pakai cookies (opsional)
});

export default api;
