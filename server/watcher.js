const mongoose = require('mongoose');
const moment = require("moment-timezone")

const compareAddons = (addons1, addons2) => {
    if (addons1.length !== addons2.length) return false;
    return addons1.every((addon) => addons2.some((a) => a.name === addon.name));
};

const isSameItem = (a, b) => {
    return a.id === b.id
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
                // let hargaItem = parseInt(item.harga) || 0;
                // if (Array.isArray(item.addOns)) {
                //     item.addOns.forEach((addon) => {
                //         hargaItem += parseInt(addon.harga) || 0
                //     })
                // }

                if (item.group === "promo") {
                    return {
                        itemId: item.id || null,
                        name: item.name,
                        qty: Number(item.qty) || 0,
                        // harga: Number(item.harga) || 0,
                        item: item.item,
                        addOns: item.addOns || [],
                        // totalHarga: hargaItem * (Number(item.qty) || 1),
                        // tax: doc.tax || 0,
                        // discount: doc.discount || 0,
                        // typeDiscount: doc.typeDiscount,
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
                    qty: Number(item.qty) || 0,
                    // harga: Number(item.harga) || 0,
                    addOns: item.addOns || [],
                    // tax: doc.tax || 0,
                    // discount: doc.discount || 0,
                    // typeDiscount: doc.typeDiscount,
                    // totalHarga: hargaItem * (Number(item.qty) || 1),
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


                        if (existing !== null) {
                            await productReport.updateOne({ _id: existing._id }, {
                                $inc: { qty: Number(r.qty || 0) }
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
                    $or: [
                        {
                            $expr: {
                                $and: [
                                    { $gt: [moment(doc.createdAt).endOf("day").tz("Asia/Jakarta").toDate(), "$createdAt"] },
                                    { $lt: [moment(doc.createdAt).startOf("day").tz("Asia/Jakarta").toDate(), "$closeAt"] }
                                ]
                            }
                        },
                        {
                            $expr: {
                                $gt: [moment(doc.createdAt).endOf("day").tz("Asia/Jakarta").toDate(), "$createdAt"]
                            },
                            closeAt: { $exists: false } // atau closeAt: null
                        }
                    ]
                })
                // console.log(tmpCashier)

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

                else {
                    const beforeItems = (change.fullDocumentBeforeChange?.item || []).map(i => ({ ...i, id: i.id }))
                    const afterItems = [...doc.item]
                    // const removedItems = beforeItems.filter(a => !afterItems.some(b => isSameItem(a, b)))
                    const removedItems = await beforeItems.filter(b => !afterItems.some(a => a.id === b.id))
                    const addedItems = await afterItems.filter(b => !beforeItems.some(a => a.id === b.id))
                    const updatedItems = await afterItems.filter(b => beforeItems.some(a => a.id === b.id && a.qty !== b.qty))
                    // console.log(removedItems, "removed")
                    // console.log(addedItems, "added")

                    await updatedItems.forEach(async (updated) => {
                        var updatedQty = 0
                        const beforeItem = beforeItems.find((item) => item.id === updated.id && isSameItem(item, updated))

                        const startOfDay = moment(updated.createdAt).tz("Asia/Jakarta").startOf("day").toDate();
                        const endOfDay = moment(updated.createdAt).tz("Asia/Jakarta").endOf("day").toDate();

                        const existing = await productReport.findOne({
                            itemId: updated.id,
                            createdAt: {
                                $gte: startOfDay,
                                $lte: endOfDay
                            },
                            addOns: updated.addOns || []
                        })

                        if (existing !== null && beforeItem.qty > updated.qty) {
                            updatedQty = Number(existing?.qty) - (Number(beforeItem?.qty) - (Number(updated.qty) || 0) || 0)
                        } else if (existing !== null && beforeItem.qty < updated.qty) {
                            updatedQty = Number(existing?.qty) + ((Number(updated.qty) || 0) - Number(beforeItem?.qty) || 0)
                        } else if (existing !== null) {
                            updatedQty = Number(existing?.qty) + Number(updated.qty || 0)
                        } else if (beforeItem?.qty === updated.qty) {
                            return
                        }

                        if (existing === null) {
                            const item = reports.find(a => a.itemId === updated.id)
                            await productReport.insertOne(item)
                        } else {
                            await productReport.updateOne(
                                {
                                    _id: existing._id
                                },
                                {
                                    $set: {
                                        qty: Number(updatedQty)
                                    }
                                })
                        }

                        console.log(`✅ Update updated items ${updated.id} records into 'productReport'`);
                    })

                    await addedItems.forEach(async (added) => {
                        var updatedQty = 0
                        const beforeItem = beforeItems.find((item) => item.id === added.id)

                        const startOfDay = moment(added.createdAt).tz("Asia/Jakarta").startOf("day").toDate();
                        const endOfDay = moment(added.createdAt).tz("Asia/Jakarta").endOf("day").toDate();

                        const existing = await productReport.findOne({
                            itemId: added.id,
                            createdAt: {
                                $gte: startOfDay,
                                $lte: endOfDay
                            },
                            addOns: added.addOns || []
                        })

                        if (existing === null) {
                            const item = reports.find(a => a.itemId === added.id)
                            await productReport.insertOne(item)
                        } else {
                            await productReport.updateOne(
                                {
                                    _id: existing._id
                                },
                                {
                                    $inc: {
                                        qty: Number(added.qty) || 0
                                    }
                                })
                        }

                        console.log(`✅ Update added items ${added.id} records into 'productReport'`);

                    })

                    await removedItems.forEach(async (removed) => {
                        const start = moment(removed.createdAt).tz("Asia/Jakarta").startOf('day').toDate()
                        const end = moment(removed.createdAt).tz("Asia/Jakarta").endOf('day').toDate()

                        const existing = await productReport.findOne({
                            itemId: removed.id,
                            createdAt: {
                                $gte: start,
                                $lte: end
                            },
                            addOns: removed.addOns || []
                        })

                        const updatedQty = Number(existing?.qty) - (Number(removed.qty) || 0)

                        if (updatedQty <= 0) {

                            await productReport.deleteOne(
                                {
                                    itemId: removed.id,
                                    createdAt: { $gte: start, $lte: end },
                                    addOns: removed.addOns || []
                                }
                            )
                        } else {

                            await productReport.updateOne(
                                {
                                    itemId: removed.id,
                                    createdAt: { $gte: start, $lte: end },
                                    addOns: removed.addOns || []
                                },
                                {
                                    $inc: { qty: -1 * Number(removed.qty || 0) }
                                }

                            )
                        }

                        console.log(`✅ Update removed items ${removed.id} records into 'productReport'`);
                    })
                }

            }

            if (change.operationType === "delete") {
                const tmpCashier = await cashier.findOne({
                    $or: [
                        {
                            $expr: {
                                $and: [
                                    { $gt: [moment(doc.createdAt).startOf("day").tz("Asia/Jakarta").toDate(), "$createdAt"] },
                                    { $lt: [moment(doc.createdAt).endOf("day").tz("Asia/Jakarta").toDate(), "$closeAt"] }
                                ]
                            }
                        },
                        {
                            $expr: {
                                $gt: [moment(doc.createdAt).endOf("day").tz("Asia/Jakarta").toDate(), "$createdAt"]
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
                    // const totalAddOn = r?.addOns
                    //     ? r.addOns.reduce((total1, item1) => total1 + Number(item1.harga), 0)
                    //     : 0;

                    const existing = await productReport.findOne({
                        itemId: r.itemId,
                        createdAt: {
                            $gte: startOfDay,
                            $lte: endOfDay
                        },
                        addOns: r.addOns || []
                    })
                    const updatedQty = Number(existing?.qty) - Number(r.qty || 0)

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
                                $inc: { qty: -1 * (Number(r.qty) || 0) }
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
