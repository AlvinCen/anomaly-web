const moment = require("moment-timezone");
const mongoose = require("mongoose");

const getModel = (collection) => {
    if (mongoose.models[collection]) return mongoose.models[collection];
    return mongoose.model(collection, new mongoose.Schema({}, { strict: false }), collection);
};

// const syncProductReport = async () => {
//     const TableHistory = getModel("tableHistory");
//     const ProductReport = getModel("productReport");

//     const transactions = await TableHistory.find();

//     for (const trx of transactions) {
//         for (const item of trx.item || []) {
//             const exists = await ProductReport.findOne({
//                 itemId: item.id,
//                 createdAt: trx.createdAt
//             });

//             if (exists) continue; // Skip jika sudah ada

//             const category = item.tipe ? "board game" : (item.addOns && item.addOns.length > 0 ? "cafe" : "");

//             const report = {
//                 itemId: item.id,
//                 name: item.name,
//                 qty: parseInt(item.qty),
//                 harga: parseInt(item.harga),
//                 addOns: item.addOns || [],
//                 category,
//                 createdAt: trx.createdAt,
//                 discount: trx.discount || 0,
//                 tax: trx.tax || 0
//             };

//             await ProductReport.create(report);
//         }
//     }

//     console.log("✅ Sinkronisasi productReport selesai.");
// };

// const syncTableHistory = async () => {
//     const tableHistory = getModel("tableHistory");

//     // Ambil semua dokumen
//     const allDocs = await tableHistory.find()
//     console.log(`🔍 Ditemukan ${allDocs.length} dokumen.`);

//     for (const doc of allDocs) {
//         const updatedItems = doc.item.map(it => ({
//             ...it,
//             payAt: doc.createdAt
//         }));

//         await tableHistory.updateOne(
//             { _id: doc._id },
//             { $set: { item: updatedItems } }
//         );
//     }
//     console.log("✅ Sinkronisasi tableHistory selesai.");
// };

// const syncStorage = async () => {
//     const Storage = getModel("storage");
//     const storage = await Storage.find();

//     for (const str of storage) {
//         var tmpStorage = (str.stok || 0).map((s) => {
//             // console.log(`${str.name} : harga => ${s.harga}, 
//             // stok => ${s.berat} 
//             // costPerItem => ${Number(s.harga) / Number(s?.tipe === "berat" ? s.berat : s.qty)}`)
//             console.log(`${str.name} : `, s)
//             return { ...s, costPerItem: Number(s.harga) / Number(str?.tipe === "berat" ? s.berat : s.qty) }
//         })
//         // console.log(tmpStorage)
//         // console.log(str._id)
//         await Storage.updateOne(
//             {
//                 _id: str._id
//             },
//             {
//                 $set: {
//                     stok: tmpStorage
//                 }
//             }
//         )
//     }

//     console.log("✅ Sinkronisasi Storage selesai.");
// };

module.exports = syncProductReport;
// module.exports = syncTableHistory;
// module.exports = syncStorage;
