const mongoose = require('mongoose');
const moment = require("moment-timezone")

const compareAddons = (addons1, addons2) => {
    if (addons1.length !== addons2.length) return false;
    return addons1.every((addon) => addons2.some((a) => a.name === addon.name && a.harga === addon.harga));
};

const isSameItem = (a, b) => {
    return a.itemId === b.itemId && compareAddons(a.addOns || [], b.addOns || [])
}

const startWatcher = async () => {
    const db = mongoose.connection;
    const tableHistory = db.collection('tableHistory');
    const productReport = db.collection('productReport');
    const cashier = db.collection('cashier');

    const changeStream = tableHistory.watch([], {
        fullDocument: "updateLookup",
        fullDocumentBeforeChange: "required"
    });

    changeStream.on('change', async (change) => {
        try {
            let doc;
            if (change.operationType === "insert") {
                doc = change.fullDocument
            } else if (change.operationType === "update") {
                doc = change.fullDocument
            } else if (change.operationType === "delete") {
                doc = change.fullDocumentBeforeChange;
            } else return


            if (!doc || !doc.item) return;

            const createdAt = moment().tz("Asia/Jakarta").toDate()
            const reports = doc.item.map((item) => {
                let hargaItem = parseInt(item.harga) || 0;
                if (Array.isArray(item.addOns)) {
                    item.addOns.forEach((addon) => {
                        hargaItem += parseInt(addon.harga) || 0
                    })
                }

                if (item.group === "promo") {
                    return {
                        itemId: item.id || null,
                        name: item.name,
                        qty: item.qty,
                        harga: parseInt(item.harga) || 0,
                        item: item.item,
                        addOns: item.addOns || [],
                        totalHarga: hargaItem * (parseInt(item.qty) || 1),
                        tax: item.tax || 0,
                        discount: item.discount || 0,
                        category: item.group || "",
                        createdAt
                    };
                }

                // if (item.group === "promo") {
                //     var tmpItem = item.item.map((data, idx) => {
                //         let hargaItem1 = parseInt(data.harga) || 0;
                //         if (Array.isArray(data.addOns)) {
                //             data.addOns.forEach((addon) => {
                //                 hargaItem1 += parseInt(addon.harga) || 0
                //             })
                //         }

                //         return {
                //             itemId: data.id || null,
                //             name: data.name,
                //             qty: data.qty,
                //             harga: parseInt(data.harga) || 0,
                //             addOns: data.addOns || [],
                //             totalHarga: hargaItem1 * (parseInt(data.qty) || 1),
                //             category: data.group || "",
                //             createdAt
                //         };
                //     })

                //     console.log(tmpItem)
                // } else {
                return {
                    itemId: item.id || null,
                    name: item.name,
                    qty: item.qty,
                    harga: parseInt(item.harga) || 0,
                    addOns: item.addOns || [],
                    tax: item.tax || 0,
                    discount: item.discount || 0,
                    totalHarga: hargaItem * (parseInt(item.qty) || 1),
                    category: item.group || "",
                    createdAt
                };
                // }

            })

            if (change.operationType === "insert") {
                if (reports && reports.length > 0) {
                    for (const r of reports) {

                        const startOfDay = moment(r.createdAt).tz("Asia/Jakarta").startOf("day").toDate();
                        const endOfDay = moment(r.createdAt).tz("Asia/Jakarta").endOf("day").toDate();

                        const existing = await productReport.findOne({
                            itemId: r.itemId,
                            createdAt: {
                                $gte: startOfDay,
                                $lte: endOfDay
                            },
                            addOns: r.addOns || []
                        })


                        if (existing) {
                            await productReport.updateOne({ _id: existing._id }, {
                                $inc: { qty: Number(r.qty), totalHarga: Number(r.totalHarga) }
                            })
                        } else {
                            await productReport.insertOne(r)
                        }

                        console.log(`✅ Update ${r.itemId} records into 'productReport'`);
                    }
                }
            }

            if (change.operationType === "update") {

                const tmpCashier = await cashier.findOne({
                    status: "OPEN",
                    $or: [
                        {
                            $expr: {
                                $and: [
                                    { $gt: [moment(doc.createdAt).tz("Asia/Jakarta").toDate(), "$createdAt"] },
                                    { $lt: [moment(doc.createdAt).tz("Asia/Jakarta").toDate(), "$closeAt"] }
                                ]
                            }
                        },
                        {
                            $expr: {
                                $gt: [moment(doc.createdAt).tz("Asia/Jakarta").toDate(), "$createdAt"]
                            },
                            closeAt: { $exists: false } // atau closeAt: null
                        }
                    ]
                })

                if (tmpCashier && doc.status === "CLOSE") {
                    // Cek apakah item dengan id dan addOns yang sama sudah ada
                    // ✅ Jika sudah ada, update qty dan totalHarga
                    console.log(`✅ Update transaction ${doc.client?.name} records into 'Cashier'`);

                    await cashier.updateOne(
                        {
                            _id: tmpCashier._id,
                        },
                        {
                            $push: {
                                transaction: doc
                            }
                        }
                    );
                }


                const updatedFields = Object.keys(change.updateDescription?.updatedFields || {})

                const isItemChanged = updatedFields.some(field => field.startsWith('item'))

                if (!isItemChanged) return;

                const beforeItems = (change.fullDocumentBeforeChange?.item || []).map(i => ({ ...i, id: i.id }))
                const afterItems = (doc.item || []).map(i => ({ ...i, id: i.id }))
                // const removedItems = beforeItems.filter(a => !afterItems.some(b => isSameItem(a, b)))
                const removedItems = beforeItems.filter(b => !afterItems.some(a => a.id === b.id))
                const addedItems = afterItems.filter(b => !beforeItems.some(a => a.id === b.id))

                for (const removed of removedItems) {
                    const beforeItem = beforeItems.find((item) => item.id === removed.id && compareAddons(item?.addOns, removed?.addOns))
                    const start = moment(doc.createdAt).tz("Asia/Jakarta").startOf('day').toDate()
                    const end = moment(doc.createdAt).tz("Asia/Jakarta").endOf('day').toDate()

                    const updatedQty = beforeItem?.qty - (removed.qty || 1)

                    // const tmpCashier = await cashier.findOne({
                    //     status: "OPEN",
                    //     $or: [
                    //         {
                    //             $expr: {
                    //                 $and: [
                    //                     { $gt: [start, "$createdAt"] },
                    //                     { $lt: [start, "$closeAt"] }
                    //                 ]
                    //             }
                    //         },
                    //         {
                    //             $expr: {
                    //                 $gt: [start, "$createdAt"]
                    //             },
                    //             closeAt: { $exists: false } // atau closeAt: null
                    //         }
                    //     ]
                    // })

                    if (updatedQty <= 0) {
                        // if (tmpCashier) {
                        //     console.log(`✅ Update ${removed.name} records into 'Cashier'`);

                        //     await cashier.updateOne(
                        //         { _id: tmpCashier._id },
                        //         {
                        //             $pull: {
                        //                 order: {
                        //                     id: removed.id,
                        //                     addOns: removed.addOns || []
                        //                 }
                        //             }
                        //         }
                        //     );
                        // }

                        await productReport.deleteOne(
                            {
                                itemId: removed.id,
                                createdAt: { $gte: start, $lte: end },
                                addOns: removed.addOns || []
                            }
                        )
                    } else {
                        // if (tmpCashier) {
                        //     console.log(`✅ Update ${removed.name} records into 'Cashier'`);

                        //     await cashier.updateOne(
                        //         {
                        //             _id: tmpCashier._id,
                        //             "order.id": removed.id,
                        //             "order.addOns": removed.addOns || []
                        //         },
                        //         {
                        //             $inc: {
                        //                 "order.$.qty": -1 * Number(removed.qty),
                        //                 "order.$.totalHarga": -1 * Number(removed.totalHarga)
                        //             }
                        //         }
                        //     );
                        // }

                        await productReport.updateOne(
                            {
                                itemId: removed.id,
                                createdAt: { $gte: start, $lte: end },
                                addOns: removed.addOns || []
                            },
                            {
                                $inc: { qty: -1 * Number(removed.qty), totalHarga: -1 * Number(removed.totalHarga) }
                            }

                        )
                    }

                    console.log(`✅ Update removed items ${removed.id} records into 'productReport'`);

                }

                for (const added of addedItems) {
                    const startOfDay = moment(added.createdAt).tz("Asia/Jakarta").startOf("day").toDate();
                    const endOfDay = moment(added.createdAt).tz("Asia/Jakarta").endOf("day").toDate();

                    const existing = await productReport.findOne({
                        itemId: added.itemId,
                        createdAt: {
                            $gte: startOfDay,
                            $lte: endOfDay
                        },
                        addOns: added.addOns || []
                    })

                    // const tmpCashier = await cashier.findOne({
                    //     status: "OPEN",
                    //     $or: [
                    //         {
                    //             $expr: {
                    //                 $and: [
                    //                     { $gt: [startOfDay, "$createdAt"] },
                    //                     { $lt: [startOfDay, "$closeAt"] }
                    //                 ]
                    //             }
                    //         },
                    //         {
                    //             $expr: {
                    //                 $gt: [startOfDay, "$createdAt"]
                    //             },
                    //             closeAt: { $exists: false } // atau closeAt: null
                    //         }
                    //     ]
                    // })
                    // console.log(tmpCashier)

                    if (existing) {
                        await productReport.updateOne({ _id: existing._id },
                            {
                                $inc: { qty: Number(added.qty), totalHarga: Number(added.totalHarga) }
                            })
                    } else {
                        const item = reports.find(a => a.itemId === added.id)
                        await productReport.insertOne(item)
                    }

                    // if (!tmpCashier) continue;

                    // // Cek apakah item dengan id dan addOns yang sama sudah ada
                    // const existingOrderItem = tmpCashier.order?.find(item =>
                    //     item.id === added.id &&
                    //     JSON.stringify(item.addOns || []) === JSON.stringify(added.addOns || [])
                    // );

                    // if (existingOrderItem) {
                    //     console.log(`✅ Update ${added.name} records into 'Cashier'`);

                    //     // ✅ Jika sudah ada, update qty dan totalHarga
                    //     await cashier.updateOne(
                    //         {
                    //             _id: tmpCashier._id,
                    //             "order.id": added.id,
                    //             "order.addOns": added.addOns || []
                    //         },
                    //         {
                    //             $inc: {
                    //                 "order.$.qty": added.qty || 1,
                    //                 "order.$.totalHarga": added.totalHarga || 0
                    //             }
                    //         }
                    //     );
                    // } else {
                    //     // ✅ Jika belum ada, push item baru
                    //     console.log(`✅ Update ${added.name} records into 'Cashier'`);

                    //     await cashier.updateOne(
                    //         { _id: tmpCashier._id },
                    //         {
                    //             $push: {
                    //                 order: {
                    //                     id: added.id,
                    //                     name: added.name,
                    //                     qty: added.qty || 1,
                    //                     harga: added.harga || 0,
                    //                     totalHarga: added.totalHarga || 0,
                    //                     addOns: added.addOns || [],
                    //                     item: added.item || [],
                    //                     category: added.group || "",
                    //                     createdAt
                    //                 }
                    //             }
                    //         }
                    //     );
                    // }

                    console.log(`✅ Update added items ${added.id} records into 'productReport'`);
                }

            }

            if (change.operationType === "delete") {
                const tmpCashier = await cashier.findOne({
                    status: "OPEN",
                    $or: [
                        {
                            $expr: {
                                $and: [
                                    { $gt: [moment(doc.createdAt).tz("Asia/Jakarta").toDate(), "$createdAt"] },
                                    { $lt: [moment(doc.createdAt).tz("Asia/Jakarta").toDate(), "$closeAt"] }
                                ]
                            }
                        },
                        {
                            $expr: {
                                $gt: [moment(doc.createdAt).tz("Asia/Jakarta").toDate(), "$createdAt"]
                            },
                            closeAt: { $exists: false } // atau closeAt: null
                        }
                    ]
                })

                const findDoc = tmpCashier.transaction?.find(item =>
                    item.id === doc.id
                );

                if (tmpCashier && findDoc) {
                    // Cek apakah item dengan id dan addOns yang sama sudah ada
                    // ✅ Jika sudah ada, update qty dan totalHarga
                    console.log(`✅ Update transaction ${doc.client?.name} records into 'Cashier'`);

                    await cashier.updateOne(
                        {
                            _id: tmpCashier._id,
                        },
                        {
                            $pull: {
                                transaction: {
                                    _id: doc._id,
                                }
                            }
                        }
                    );

                }

                for (const r of reports) {

                    const startOfDay = moment(r.createdAt).tz("Asia/Jakarta").startOf("day").toDate();
                    const endOfDay = moment(r.createdAt).tz("Asia/Jakarta").endOf("day").toDate();
                    const totalAddOn = r?.addOns
                        ? r.addOns.reduce((total1, item1) => total1 + Number(item1.harga), 0)
                        : 0;

                    const existing = await productReport.findOne({
                        itemId: r.itemId,
                        createdAt: {
                            $gte: startOfDay,
                            $lte: endOfDay
                        },
                        addOns: r.addOns || []
                    })
                    const updatedQty = existing?.qty - (r.qty || 1)

                    if (updatedQty <= 0) {

                        await productReport.deleteOne(
                            {
                                _id: existing._id
                            }
                        )
                    } else {
                        await productReport.updateOne(
                            {
                                itemId: r.itemId,
                                createdAt: {
                                    $gte: startOfDay,
                                    $lte: endOfDay
                                },
                                addOns: r.addOns || []
                            },
                            {
                                $inc: { qty: -1 * Number(r.qty), totalHarga: -1 * Number(r.harga + totalAddOn) }
                            }
                        )
                    }

                    console.log(`✅ Update ${r.itemId} records into 'productReport'`);
                }
            }

        } catch (err) {
            console.error('❌ Error processing change stream:', err.message);
        }
    });

    console.log("✅ Change stream watcher started on 'tableHistory'");
};

module.exports = startWatcher;
