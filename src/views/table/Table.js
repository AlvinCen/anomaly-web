import { cilCash, cilCreditCard, cilMediaStop, cilPen, cilPencil, cilPrint } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CBadge, CButton, CCard, CCardBody, CCardHeader, CCardImage, CCol, CCollapse, CContainer, CForm, CFormCheck, CFormInput, CFormLabel, CFormSelect, CFormSwitch, CHeader, CInputGroup, CInputGroupText, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CPagination, CPaginationItem, CProgress, CRow, CSpinner, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import moment from 'moment';
import React, { Suspense, useEffect, useRef, useState } from 'react'
// import { firestore } from '../../Firebase';
// import { collection, getDocs, onSnapshot, addDoc, setDoc, doc, query, where, orderBy, arrayUnion, writeBatch, deleteDoc, limit, getDoc, updateDoc } from 'firebase/firestore';
import Swal from 'sweetalert2'
import AppTable from '../../components/AppTable';
import { formatNumber } from 'chart.js/helpers';
import Select, { components } from 'react-select';
import ReactSelectAsync from 'react-select/async';
import PropTypes from 'prop-types';
import ReactSelect from 'react-select';
import { useAuth } from '../../AuthContext';
import classNames from 'classnames';
import Loading from '../../components/Loading';
import { useLocation, useNavigate } from 'react-router-dom';
import ReactSelectCreatable from 'react-select/creatable';
import qrisIcon from '../../assets/images/qris.png'
import api from '../../axiosInstance';
import { faMotorcycle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import grabFood from "../../assets/images/grabfood-logo.png";
import goFood from "../../assets/images/gofood-logo.png";
import io from "socket.io-client";

const socket = io("http://192.168.1.100:5000")


const Table = () => {
    // const [start, setStart] = useState(moment().format('DD/MM/YYYY HH:mm:ss'));
    var totalHarga = 0;
    const location = useLocation();
    const isBack = sessionStorage.getItem("isBack");
    const tmpTable = JSON.parse(sessionStorage.getItem("tmpTable"))
    // const tmpCafe = location.state?.cafe
    const [tmpCafe, setTmpCafe] = useState(location.state?.cafe || { item: [] });
    const [tmpAction, setTmpAction] = useState(location.state?.action || "");

    const tmpMenu = location.state?.menu
    const poolData = location.state?.poolData
    // // console.log(tmpCafe)
    const { currentUser } = useAuth();

    const [inputValue, setInputValue] = useState("");
    const [inputFilter, setInputFilter] = useState("");

    const [time, setTime] = useState(0);
    const [isLoading, setIsLoading] = useState(false)
    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState(false)
    const [selectAll, setSelectAll] = useState(true)

    const [value, setValue] = useState("");
    const [col, setCol] = useState("")
    const [dataClient, setDataClient] = useState([])


    const [isRunning, setIsRunning] = useState(true);
    // const [data, setData] = useState([])
    const [usePromo, setUsePromo] = useState(false)
    const [useDurasi, setUseDurasi] = useState(false)
    const [edit, setEdit] = useState({});
    const [hapus, setHapus] = useState({});
    const [cafe, setCafe] = useState([])

    const [tableControl, setTableControl] = useState("durasi")
    const [changeTable, setChangeTable] = useState("")
    const [action, setAction] = useState(null)
    const [visible, setVisible] = useState(false)
    const [modal, setModal] = useState(false)
    const [isMultiple, setIsMultiple] = useState(false)
    const [initTable, setInitTable] = useState(false)
    const [initClient, setInitClient] = useState(false)
    const [initMenu, setInitMenu] = useState(false)
    const [initPromo, setInitPromo] = useState(false)
    const [initMerch, setInitMerch] = useState(false)

    const [nomor, setNomor] = useState("")

    const [client, setClient] = useState("")
    const [tipe, setTipe] = useState("open")
    const [cashier, setCashier] = useState("")
    const [createdAt, setCreatedAt] = useState("")

    const [data, setData] = useState([])
    const [menu, setMenu] = useState([])
    const [order, setOrder] = useState([])
    const [promo, setPromo] = useState("")
    const [booking, setBooking] = useState([])
    const [priceList, setPriceList] = useState([])
    const [detail, setDetail] = useState([])
    const [nama, setNama] = useState("")
    const [durasi, setDurasi] = useState("")
    const [meja, setMeja] = useState("table-1")
    const [waktu, setWaktu] = useState(moment().add(1, "hours").startOf("hour").format("HH:mm"))
    const [total, setTotal] = useState(0)
    const [orderId, setOrderId] = useState("")
    const [merch, setMerch] = useState([])
    const [merchOptions, setMerchOptions] = useState([])
    const [editHarga, setEditHarga] = useState(false)
    const [editNama, setEditNama] = useState(false)
    const [editStatus, setEditStatus] = useState(false)
    const [status, setStatus] = useState("")
    const [item, setItem] = useState([])
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [inputBayar, setInputBayar] = useState('0');

    const [isService, setIsService] = useState(false);
    const [isTax, setIsTax] = useState(true);
    const [isDiscount, setIsDiscount] = useState(false);

    const [service, setService] = useState(10);
    const [tax, setTax] = useState(10);
    const [discount, setDiscount] = useState("10");
    const [typeDiscount, setTypeDiscount] = useState(true);

    const [intervals, setIntervals] = useState({});
    const [menuOptions, setMenuOptions] = useState([])
    const [promoOptions, setPromoOptions] = useState([])

    const [filterValue, setFilterValue] = useState("")
    const [trigger, setTrigger] = useState(false)

    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const intervalRefs = useRef({});

    const navigate = useNavigate();
    const columnDetail = [
        { label: "Nama Customer", key: "client" },
        { label: "Table", key: "tableName" },
        { label: "Jam Mulai", key: "start" },
        { label: "Jam Selesai", key: "end" },
        // { label: "Rate Harga (per 15 menit)", key: "rate" },
        // { label: "Rate Harga Malam (per 15 menit)", key: "rate1" },
        // { label: "Estimasi Harga", key: "estimasi" },
        { label: "Total Durasi Pause", key: "pauseTimes" },
        { label: "Order Dibuat Tanggal", key: "orderAt" },
        { label: "Data Dibuat Tanggal", key: "createdAt" }]

    const groupBadgeStyles = {
        backgroundColor: '#EBECF0',
        borderRadius: '2em',
        color: '#172B4D',
        display: 'inline-block',
        fontSize: 12,
        fontWeight: 'normal',
        lineHeight: '1',
        minWidth: 1,
        padding: '0.16666666666667em 0.5em',
        textAlign: 'center',
        marginLeft: "10px",
        borderBottom: '1px solid'
    };

    const hitungOrder = (table, detail) => {
        let harga = 0;
        // // Jika status AKTIF, hitung harga berdasarkan waktu end
        // if (table?.status === "AKTIF" || table?.status === "PAUSE") {
        //     // const waktuAkhir = table?.end ? table?.end : moment().format();
        //     harga = hitungHarga(table, table?.start, moment().format());
        // } else {
        //     // Jika tidak AKTIF, hitung harga langsung atau gunakan hitungHarga
        //     harga = table?.hargaVoid ? table?.hargaVoid : hitungHarga(table, table?.start, table?.end);
        // }

        harga = isNaN(harga) ? 0 : harga

        harga += (table?.splitBill !== undefined && table?.status === "PAYMENT" ? table?.unpaidItems : table?.item)?.reduce((total, item) => {
            const totalAddOn = item?.addOns
                ? item.addOns.reduce((total1, item1) => total1 + Number(item1.harga), 0)
                : 0;


            if (item?.addOns && !item?.tipe) {
                const itemTotal = (Number(item.harga) + totalAddOn) * item.qty;
                if (table?.status === "CLOSE" || ((item?.isPay || item?.payAt !== undefined) || table?.status === "AKTIF")) {
                    return total + itemTotal;
                } else if (item?.payAt === undefined || item?.isPay === undefined || !item?.isPay) {
                    return total
                }
            } else return total
        }, 0);

        harga += tmpCafe?.item.reduce((total, item) => {
            var totalAddOn = item?.addOns
                ? item?.addOns?.reduce((total1, item1) => total1 + Number(item1.harga), 0)
                : 0
            if (item?.addOns && !item?.tipe) {
                const itemTotal = (Number(item.harga) + totalAddOn) * item.qty;
                return total + itemTotal;
            } else return total
            //BARU
            // return total + Number((item.harga + totalAddOn) * item.qty);
        }, 0)

        //BARU

        // harga += orderTotal
        // harga = isDiscount ? (typeDiscount ? (harga * (1 - table?.discount / 100)) : (harga - table?.discount)) : harga
        return harga;
    }


    const hitungSubTotal = (table = detail) => {
        let harga = 0;
        var cafeCharge = 0
        // Jika status AKTIF, hitung harga berdasarkan waktu end
        if (table?.status === "AKTIF" || table?.status === "PAUSE") {
            // const waktuAkhir = table?.end ? table?.end : moment().format();
            harga = hitungHarga(table, table?.start, moment().format());
        } else {
            // Jika tidak AKTIF, hitung harga langsung atau gunakan hitungHarga
            harga = table?.hargaVoid ? table?.hargaVoid : hitungHarga(table, table?.start, table?.end);
        }

        harga = isNaN(harga) ? 0 : harga
        // console.log(harga)


        var boardGame = table?.item?.reduce((total, item) => {
            if (!item?.addOns) {
                if (item?.tipe === "durasi" && item?.duration === "00:00") return total
                else if ((item?.isPay || item?.payAt !== undefined) || table?.status === "AKTIF" || table?.status === "CLOSE") return total + (Number(item.harga) * Number(item.qty));
                else return total
            } else return total

        }, 0);
        console.log(boardGame)
        // if (table?.orderTotal) {
        // console.log(table)
        var orderTotal = tmpCafe?.item.reduce((total, item) => {
            var totalAddOn = item?.addOns ? item?.addOns?.reduce((total1, item1) => {
                return total1 + Number(item1.harga);
            }, 0) : 0
            return total + totalAddOn + Number(item.harga * item.qty);
        }, 0)
        orderTotal += (table?.splitBill !== undefined && table?.status === "PAYMENT" ? table?.unpaidItems : table?.item)?.reduce((total, item) => {
            // if (item?.isPromo && table?.status !== "AKTIF") {
            //     return total
            // }
            //  else
            //   {
            const totalAddOn = item?.addOns
                ? item.addOns.reduce((total1, item1) => total1 + Number(item1.harga), 0)
                : 0;

            // Default tax and service values to 0 if they are undefined
            // const tax = cafe?.tax ?? 0;
            // const service = cafe?.service ?? 0;
            // Calculate item total with tax and service if add-ons are present
            if (!item?.tipe && item?.addOns) {
                const itemTotal = (Number(item.harga) + totalAddOn) * item.qty;
                if (table?.status === "CLOSE" || ((item?.isPay || item?.payAt !== undefined) || table?.status === "AKTIF")) {
                    return total + itemTotal;
                } else {
                    return total
                }
            } else return total
            // }
            // return item?.addOns
            //     ? total + ((Number(item.harga) + totalAddOn) * item.qty)
            //     : total + (Number(item.harga) * item.qty);
        }, 0);

        harga += orderTotal
        harga += boardGame

        return harga;
    }

    const hitungGrandTotal = (table = detail) => {
        let harga = 0;
        var cafeCharge = 0
        // Jika status AKTIF, hitung harga berdasarkan waktu end
        if (table?.status === "AKTIF" || table?.status === "PAUSE") {
            // const waktuAkhir = table?.end ? table?.end : moment().format();
            harga = hitungHarga(table, table?.start, moment().format());
        } else {
            // Jika tidak AKTIF, hitung harga langsung atau gunakan hitungHarga
            harga = table?.hargaVoid ? table?.hargaVoid : hitungHarga(table, table?.start, table?.end);
        }

        harga = isNaN(harga) ? 0 : harga

        var boardGame = (table?.splitBill !== undefined && table?.status === "PAYMENT" ? table?.unpaidItems : table?.item)?.reduce((total, item) => {

            if (!item?.addOns) {
                if (item?.tipe === "durasi" && item?.duration === "00:00") return total
                else if (table?.status === "CLOSE" || ((item?.isPay || item?.payAt !== undefined) || table?.status === "AKTIF")) return total + (Number(item.harga) * Number(item.qty));
                else return total
            } else return total

        }, 0);
        boardGame = isNaN(boardGame) ? 0 : boardGame
        // if (table?.orderTotal) {
        var orderTotal = tmpCafe?.item.reduce((total, item) => {
            var totalAddOn = item?.addOns ? item?.addOns?.reduce((total1, item1) => {
                return total1 + Number(item1.harga);
            }, 0) : 0
            return total + totalAddOn + Number(item.harga * item.qty);
        }, 0)
        orderTotal += (table?.splitBill !== undefined && table?.status === "PAYMENT" ? table?.unpaidItems : table?.item)?.reduce((total, item) => {
            // if (item?.isPromo && table?.status !== "AKTIF") {
            //     return total
            // }
            //  else
            //   {
            const totalAddOn = item?.addOns
                ? item.addOns.reduce((total1, item1) => total1 + Number(item1.harga), 0)
                : 0;


            if (item?.addOns && !item?.tipe) {
                const itemTotal = (Number(item.harga) + totalAddOn) * item.qty;
                if (table?.status === "CLOSE" || ((item?.isPay || item?.payAt !== undefined) || table?.status === "AKTIF")) {
                    return total + itemTotal;
                } else if (item?.isPay === undefined || !item?.isPay) {
                    return total
                }
            } else return total

            // }
            // return item?.addOns
            //     ? total + ((Number(item.harga) + totalAddOn) * item.qty)
            //     : total + (Number(item.harga) * item.qty);
        }, 0);
        orderTotal = isNaN(orderTotal) ? 0 : orderTotal


        var diskon = (isDiscount ? (typeDiscount ? orderTotal * (table?.discount / 100) : table?.discount) : 0)
        if (status === "PAYMENT") {
            harga += Number(table?.discount ? (table?.typeDiscount ? orderTotal * (1 - table?.discount / 100) : orderTotal - table?.discount) : orderTotal)
        } else {
            harga += Number(isDiscount ? (typeDiscount ? orderTotal * (1 - table?.discount / 100) : orderTotal - table?.discount) : orderTotal)
        }
        // harga += orderTotal
        harga += boardGame

        const tax = Number(isTax ? ((table?.tax < 1 && table?.tax > 0) ? table?.tax : table?.tax / 100) : 0);
        // const service = Number(isService ? ((table?.service < 1 && table?.service > 0) ? table?.service : table?.service / 100) : 0);
        // const orderTotal = Number(table?.ordertotal ?? 0);

        const totalCharge = isNaN(tax) ? 0 : tax;
        cafeCharge = (orderTotal * totalCharge);

        harga += cafeCharge;
        // harga -= diskon
        // }

        return harga;
    }

    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            border: '1px solid #dbdfe6',
            borderRadius: '4px',
            padding: '0.1rem 0.1rem',
            backgroundColor: '#fff',
            boxShadow: state.isFocused ? '0 0 0 0.25rem rgba(88, 86, 214, 0.25)' : 'none',
            '&:hover': {
                borderColor: state.isFocused ? '#acabeb' : '#dbdfe6',
            },
            // '&:hover': {
            //     borderColor: '#dbdfe6',
            // },
        }),
        menuPortal: base => ({ ...base, zIndex: 9999 }),
        multiValue: (provided) => ({
            ...provided,
            backgroundColor: '#e9ecef',
        }),
        multiValueLabel: (provided) => ({
            ...provided,
            color: '#495057',
        }),
        multiValueRemove: (provided) => ({
            ...provided,
            color: '#495057',
            ':hover': {
                backgroundColor: '#80bdff',
                color: 'white',
            },
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isFocused ? '#80bdff' : 'white',
            color: state.isFocused ? 'white' : '#495057',
            '&:active': {
                backgroundColor: '#80bdff',
                color: 'white',
            },
        }),
    };

    const customStylesInput = {
        control: (provided, state) => ({
            ...provided,
            border: "1px solid #dbdfe6", // Warna border seperti CFormInput
            borderRadius: "8px", // Radius border
            padding: "0.1rem 0.1rem", // Padding seperti CFormInput
            backgroundColor: state.isDisabled ? "#e9ecef" : "#fff", // Warna background
            color: "#495057", // Warna teks
            boxShadow: state.isFocused ? "0 0 0 0.2rem rgba(13, 110, 253, 0.25)" : "none", // Efek fokus
            fontSize: "1rem", // Ukuran font seperti CFormInput
            lineHeight: "1.5", // Line height seperti CFormInput
            "&:hover": {
                borderColor: "#adb5bd", // Warna border saat hover
            },
        }),
        placeholder: (provided) => ({
            ...provided,
            color: "#6c757d", // Warna placeholder seperti CFormInput
            fontSize: "1rem", // Ukuran font placeholder
            lineHeight: "1.5",
        }),
        singleValue: (provided) => ({
            ...provided,
            color: "#495057", // Warna teks nilai yang dipilih
            fontSize: "1rem", // Ukuran font
            lineHeight: "1.5",
        }),
        menu: (provided) => ({
            ...provided,
            borderRadius: "4px", // Radius menu dropdown
            border: "1px solid #dbdfe6",
            zIndex: 9999,
        }),
        menuList: (provided) => ({
            ...provided,
            padding: "0", // Hapus padding default
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isFocused ? "#80bdff" : "white", // Warna opsi saat fokus
            color: state.isFocused ? "white" : "#495057", // Warna teks opsi saat fokus
            padding: "0.375rem 0.75rem", // Padding opsi
            fontSize: "1rem",
            lineHeight: "1.5",
            "&:active": {
                backgroundColor: "#0056b3", // Warna saat opsi diklik
                color: "white",
            },
        }),
        dropdownIndicator: () => ({
            display: "none", // Hide dropdown arrow
        }),
        indicatorSeparator: () => ({
            display: "none", // Hide separator
        }),
    };

    const handlePaymentChange = (value) => {
        setPaymentMethod(value);
    };

    const handlePrintOrder = async (data, action, paymentMethod, bayar, kembali) => {
        console.log(data)
        if (window?.electron) {
            const result = await window?.electron.printReceipt({
                data,
                // cafe,
                action,
                paymentMethod,
                pay: bayar,
                changes: kembali
            });

            if (result.success) {
                try {

                    var response = await api.put("/data/update", {
                        collection: "table",
                        filter: { _id: data?._id },
                        update: [ // <== ini HARUS array
                            {
                                $set: {
                                    item: {
                                        $map: {
                                            input: "$item",
                                            as: "i",
                                            in: {
                                                $mergeObjects: ["$$i", { statusPrint: true }]
                                            }
                                        }
                                    }
                                }
                            }
                        ]
                    });
                    await api.put("/data/update", {
                        collection: "tableHistory",
                        filter: { _id: data?.orderId },
                        update: [ // <== ini HARUS array
                            {
                                $set: {
                                    item: {
                                        $map: {
                                            input: "$item",
                                            as: "i",
                                            in: {
                                                $mergeObjects: ["$$i", { statusPrint: true }]
                                            }
                                        }
                                    }
                                }
                            }
                        ]
                    });
                    // const cleanItem = Object.fromEntries(
                    //     Object.entries(response.data.updatedData).filter(([key]) => key !== "0")
                    // );
                    // console.log(cleanItem)
                    // setData((prevData) =>
                    //     prevData.map((item) => (item.id === cleanItem._id ? { ...item, ...cleanItem } : item))
                    // );

                    Swal.fire({
                        title: "Success!",
                        text: "Print berhasil",
                        icon: "success"
                    });
                } catch (error) {
                    console.error("Error updating data:", error);
                    Swal.fire({
                        title: "Failed!",
                        text: "Print gagal",
                        icon: "error"
                    });
                }
            } else {
                Swal.fire({
                    title: "Failed!",
                    text: result.message,
                    icon: "error"
                });
            }
        } else {
            Swal.fire({
                title: "Failed!",
                text: "Print gagal",
                icon: "error"
            });
            console.log("Electron is not available.");
        }
        setRefresh(!refresh)
        setVisible(false);
        setModal(false);
    };


    const handlePrintClick = async (data, kembali) => {
        data.tax = isTax ? (data?.tax < 1 && data?.tax > 0 ? data?.tax : data?.tax / 100) : 0;
        console.log(data)
        // await api.post("/data/update", {
        //     collection: "tableHistory",
        //     filter: { _id: data?._id },
        //     update: {
        //         $push: {
        //             paidItems: { $each: paidItems },
        //             unpaidItems: { $each: unpaidItems }
        //         }
        //     }
        // });
        // var isPaid = data.item.every(item => item.payAt !== undefined || item.isPay);
        if (window?.electron) {
            const collection = "tableHistory";
            const result = await window?.electron.printReceipt({
                data,
                // paymentMethod: ((data?.table === "grabfood" || data?.table === "gofood") && paymentMethod === "qris") ? "qris" : paymentMethod,
                paymentMethod: (data?.table === "grabfood" || data?.table === "gofood") ? data?.paymentMethod : paymentMethod,
                pay: inputBayar,
                changes: kembali ? kembali : 0
            });


            if (result.success) {
                try {
                    if (data?.status === "PAYMENT" && kembali !== false) {
                        // ✅ Update data menggunakan API MongoDB       
                        // var isPaid = data.item.every(item => item.payAt !== undefined || item.isPay);
                        var paidItems = [];
                        var unpaidItems = [];

                        var tmpItem = (data?.splitBill !== undefined ? data?.unpaidItems : data?.item)?.map(item => {
                            const paidQty = item?.qty;
                            const totalQty = item?.totalQty
                            const unpaidQty = totalQty - paidQty;
                            if (item.isPay && item?.isPay !== undefined) {
                                if (unpaidQty > 0) {
                                    unpaidItems.push({
                                        ...((({ isPay, totalQty, ...rest }) => rest)(item)),
                                        qty: unpaidQty,
                                    });

                                    paidItems.push({
                                        ...((({ totalQty, ...rest }) => rest)(item)),
                                        qty: paidQty,
                                    });
                                } else {
                                    paidItems.push({
                                        ...((({ totalQty, ...rest }) => rest)(item)),
                                        qty: paidQty,
                                    });
                                }

                                return {
                                    ...((({ totalQty, ...rest }) => rest)(item)),
                                    qty: totalQty
                                };
                            } else {
                                unpaidItems.push({
                                    ...((({ isPay, ...rest }) => rest)(item)),
                                });

                                return {
                                    ...((({ totalQty, ...rest }) => rest)(item)),
                                    qty: totalQty
                                };
                            }
                        });


                        var splitBill = {
                            item: paidItems,
                            createdAt: moment().format(),
                            paymentMethod,
                            pay: Number(inputBayar),
                            tax: isTax ? (data?.tax < 1 && data?.tax > 0 ? data?.tax : data?.tax / 100) : 0,
                            typeDiscount,
                            discount: isDiscount ? data?.discount : 0,
                        }

                        var isPaid = unpaidItems?.length === 0

                        if (isPaid) {
                            if (data?.splitBill !== undefined) {
                                await api.put("/data/update", {
                                    collection,
                                    filter: { _id: data?._id },
                                    update: {
                                        $push: {
                                            splitBill: { $each: [splitBill] }
                                        },
                                        $set: {
                                            unpaidItems,
                                            status: "CLOSE"
                                        }
                                    }
                                });
                            } else {
                                await api.put("/data/update", {
                                    collection,
                                    filter: { _id: data?._id },
                                    update: {
                                        paymentMethod: paymentMethod,
                                        pay: Number(inputBayar),
                                        tax: isTax ? (data?.tax < 1 && data?.tax > 0 ? data?.tax : data?.tax / 100) : 0,
                                        // service: isService ? (data?.service < 1 && data?.service > 0 ? data?.service : data?.service / 100) : 0,
                                        typeDiscount,
                                        discount: isDiscount ? data?.discount : 0,
                                        status: "CLOSE"
                                    }
                                });
                            }
                        } else {
                            await api.put("/data/update", {
                                collection,
                                filter: { _id: data?._id },
                                update: {
                                    $push: {
                                        splitBill: { $each: [splitBill] }
                                    },
                                    $set: {
                                        unpaidItems,
                                    }
                                }
                            });
                        }
                        setRefresh(!refresh)
                        // // ✅ Jika ada orderId, update juga dokumen order
                        // if (collection !== "cafe" && data?.orderId) {
                        //     await api.put("/data/update", {
                        //         collection: "order",
                        //         filter: { _id: data?.orderId },
                        //         update: {
                        //             pay: Number(inputBayar),
                        //             paymentMethod: paymentMethod,
                        //             status: "PAID"
                        //         }
                        //     });
                        // }

                        // ✅ Jika ada cafeId, update juga dokumen cafe
                        // if (data?.cafeId) {
                        //     await apiput("/data/update", {
                        //         collection: "cafe",
                        //         filter: { _id: data?.cafeId },
                        //         update: {
                        //             pay: Number(inputBayar),
                        //             paymentMethod: paymentMethod,
                        //             status: "PAID"
                        //         }
                        //     });
                        // }
                    }

                    Swal.fire({
                        title: "Success!",
                        text: "Print Berhasil",
                        icon: "success"
                    });
                } catch (error) {
                    console.error("Error updating data:", error);
                    Swal.fire({
                        title: "Failed!",
                        text: "Status gagal diperbarui",
                        icon: "error"
                    });
                }
            } else {
                Swal.fire({
                    title: "Failed!",
                    text: result.message,
                    icon: "error"
                });
            }
        } else {
            Swal.fire({
                title: "Failed!",
                text: "Print tidak dapat diproses",
                icon: "error"
            });
            console.log("Electron is not available.");
        }
        setRefresh(!refresh)
        setVisible(false);
        setModal(false);
    };


    const serve = async (id) => {
        try {
            await api.put("/data/update", {
                collection: "tableHistory",
                filter: { _id: id },
                update: { status: "READY" }
            });
            setRefresh(!refresh)

            Swal.fire({
                title: "Success!",
                text: "Status berhasil diubah",
                icon: "success"
            });
        } catch (error) {
            Swal.fire({
                title: "Failed!",
                text: "Status gagal diubah",
                icon: "error"
            });
        }
    };


    const finish = async (id, tipe) => {
        try {
            await api.put("/data/update", {
                collection: "tableHistory",
                filter: { _id: id },
                update: { status: tipe === "close" ? "PAID" : "PAYMENT" }
            });
            setRefresh(!refresh)

            Swal.fire({
                title: "Success!",
                text: "Status berhasil diubah",
                icon: "success"
            });
        } catch (error) {
            Swal.fire({
                title: "Failed!",
                text: "Status gagal diubah",
                icon: "error"
            });
        }
        setVisible(false);
    };



    const loadOption = (inputValue, callback) => {
        const options = [
            { label: "Reguler", options: priceList },
            { label: "Promo", options: promoOptions },
        ]
        // // console.log(options)
        callback(options)
    }
    const filterOption = (option, inputValue) => {
        const label = option.label?.toLowerCase() || '';
        const value = option.value?.toLowerCase() || '';
        const input = inputValue.toLowerCase();

        return label.includes(input) || value.includes(input);
    };
    const formatGroupLabel = (data) => {
        // // console.log(data)
        var tmpFilter = data.options.filter((val) => { return val.label.toLowerCase().includes(filterValue) })
        if (data?.options[0]?.label === "") {
            return <div style={{ borderBottom: "1px solid #EBECF0", paddingBottom: "5px" }}>
                <span>{data.label}</span>
                <span id={data.label.replaceAll(" ", "_")} style={groupBadgeStyles}>{0}</span>
            </div>
        } else {
            return <div style={{ borderBottom: "1px solid #EBECF0", paddingBottom: "5px" }}>
                <span>{data.label}</span>
                <span id={data.label.replaceAll(" ", "_")} style={groupBadgeStyles}>{tmpFilter.length}</span>
            </div>
        }
    };

    const GroupHeading = (props) => {
        GroupHeading.propTypes = {
            data: PropTypes.object,
            id: PropTypes.string,
            selectProps: PropTypes.object,
        };
        var key = props.data.label.replaceAll(" ", "_")
        var data = sessionStorage.getItem(key)
        return <components.GroupHeading {...props}
            onClick={() => {
                if (props.data.options[0]?.label !== "") sessionStorage.setItem(key, !(/true/).test(data))
                setTrigger(!trigger)
            }}
        />
    };

    const HideGroupChildren = (props) => {
        HideGroupChildren.propTypes = {
            children: PropTypes.array,
            data: PropTypes.object,
            id: PropTypes.string,
            selectProps: PropTypes.object
        };
        var key = props.data.label.replaceAll(" ", "_")
        var data = sessionStorage.getItem(key)
        return <components.Group {...props}>
            <CCollapse visible={(/true/).test(data)}>
                {props.children[0]?.label !== "" && props.children}
            </CCollapse>
        </components.Group>
    };
    const handleHoursChange = (e) => {
        // // console.log(e.target.value.replace(/^0+/, ""))
        const tmpVal = e.target.value.replace(/^0+/, "");
        setHours(tmpVal);
    };

    const handleMinutesChange = (e) => {
        const tmpVal = minutes !== "" ? e.target.value.replace(/^0+/, "") : e.target.value;
        setMinutes(tmpVal);
    };

    const compareAddons = (addons1, addons2) => {
        if (addons1.length !== addons2.length) return false;
        return addons1.every((addon) => addons2.some((a) => a.name === addon.name && a.harga === addon.harga));
    };

    useEffect(() => {
        socket.on("dataChange", (changeInfo) => {
            console.log(`Notifikasi diterima: ${changeInfo.collection} berubah`)
            setRefresh(!refresh)
        })

        return () => {
            socket.off("dataChange")
        }
    }, [refresh])

    useEffect(() => {
        var poolData = JSON.parse(sessionStorage.getItem("poolData"))
        if (isBack) {
            if (tmpTable) {
                setVisible(true)
                setClient(tmpTable?.client)
                setUsePromo(tmpTable?.usePromo)
                setPromo(tmpTable?.promo)
                setDetail(tmpTable?.meja)
                setMeja("")
                sessionStorage.removeItem("isBack")
                sessionStorage.removeItem("tmpTable")
            } else if (poolData) {
                setModal(true)
                setAction("detail")
                setDetail(poolData)
                sessionStorage.removeItem("isBack")
                sessionStorage.removeItem("poolData")
            }

        }
    }, [isBack, tmpTable, poolData, tmpAction])

    useEffect(() => {
        // console.log(action)
        // console.log(tmpCafe)
        if (tmpCafe !== undefined && poolData !== undefined) {
            // // console.log(tmpCafe)
            // const tmpOrder = [
            //     ...(Array.isArray(poolData?.promo) ? poolData.promo : []),
            //     ...(Array.isArray(tmpCafe?.item) ? tmpCafe.item : [])
            // ];
            if (tmpAction === "detail") {
                // var tmpOrder = [...poolData?.item]
                var tmpOrder = { ...poolData }
                // var orderCafe = tmpCafe.item.forEach((data, idx) => {
                //     var indexOrder = tmpOrder?.item?.findIndex((item) => item?.id === data?.id && compareAddons(item?.addOns, data?.addOns) && item?.note === data?.note)
                //     if (indexOrder !== -1) {
                //         tmpOrder.item[indexOrder].qty = (Number(tmpOrder.item[indexOrder].qty) || 0) + Number(data.qty)
                //         tmpOrder.item[indexOrder].note = tmpOrder.item[indexOrder].note || data?.note ?
                //             (data?.note ? data?.note : tmpOrder.item[indexOrder].note) : ""
                //         tmpCafe?.item.splice(idx, 1)
                //     }
                // })
                console.log(tmpOrder)
                setModal(true)
                setAction("detail")
                setDetail(poolData)
                // setDetail(detail)
            } else if (tmpAction === "open") {
                setVisible(true)
                setClient(poolData?.client)
                setUsePromo(poolData?.usePromo)
                setPromo(poolData?.promo)
                setDetail(poolData?.meja)
                setMeja("")
            }
            // // console.log(tmpCafe)
            // setCafe(tmpCafe)
        }
    }, [tmpCafe, poolData, tmpAction])


    useEffect(() => {
        console.log(action)
        if (action === "edit") {
            // setHarga(edit?.harga)
            // // console.log(edit?.hargaVoid)
            setValue(edit?.hargaVoid ? edit?.hargaVoid : edit?.harga)
        } else if (action === "editCafe") {
            setEdit(edit)
            setCreatedAt(edit?.createdAt)
            setClient(edit?.client)
            setTipe(edit?.order)
            setCashier(edit?.cashier)
            setStatus(edit?.status?.replace(" ", "_").toLowerCase())
        } else if (action === "detailCafe") {
            setEdit(detail)
            setCreatedAt(detail?.createdAt)
            setClient(detail?.client)
            setTipe(detail?.order)
            setCashier(detail?.cashier)
            setStatus(detail?.status?.replace(" ", "_").toLowerCase())
        } else if (action === "resume") {
            var tmpClient = createOption(detail?.client?.name)
            setClient({ ...detail?.client, ...tmpClient })
            setNomor(detail?.client?.nomor)
            setMeja(data?.find((table) => table.status === "KOSONG")?._id)
        } else if (action === "pay") {
            if (detail?.splitBill !== undefined) {
                var tmpItem = detail?.unpaidItems?.map((data) => {
                    return { ...data, isPay: true }
                })
                setDetail({ ...detail, unpaidItems: tmpItem })
            } else {
                var tmpItem = detail?.item?.map((data) => {
                    return { ...data, isPay: true }
                })
                setDetail({ ...detail, item: tmpItem })
            }

        }
    }, [action])

    useEffect(() => {

        if (Object.keys(hapus).length > 0) {
            Swal.fire({
                title: "Konfirmasi",
                html: `<p>Apakah anda yakin menghapus data <b>${hapus?.client?.name}</b>?</p>`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Ya",
                cancelButtonText: "Batal"
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        await api.delete("/data/delete", {
                            data: {
                                collection: "tableHistory",
                                filter: { _id: hapus?._id }
                            }
                        });

                        await api.post("/data/add", {
                            collection: "tableLog",
                            data: {
                                action: `Hapus data`,
                                orderId: hapus?._id,
                                customer: hapus?.client?.name,
                                table: hapus?.tableName,
                                event: "delete",
                                createdAt: moment().format().toString(),
                                user: currentUser.name ? currentUser.name : currentUser.username,
                            }
                        });
                        setRefresh(!refresh)

                        Swal.fire({
                            title: "Success!",
                            text: "Data berhasil dihapus",
                            icon: "success"
                        });
                    } catch (error) {
                        Swal.fire({
                            title: "Failed!",
                            text: "Data gagal dihapus",
                            icon: "error"
                        });
                        console.error("Error menghapus data: ", error);
                    }
                }
            });

            setHapus({});
        }
    }, [col, hapus]);


    useEffect(() => {
        let interval;
        if (isRunning) {
            interval = setInterval(() => {
                setTime(prevTime => prevTime + 1);
            }, 1000);
        } else {
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [isRunning]);

    useEffect(() => {
        setWaktu(moment().add(1, "hours").startOf("hour").format("HH:mm"))
    }, [action])

    // useEffect(() => {
    //     if (Object.values(detail).length > 0 && total === 0) {
    //         var grandTotal = formatNumber(detail?.harga)
    //         var harga = 0
    //         if (detail?.status === "AKTIF") harga = !isNaN(detail?.end) && detail?.end !== "" ?
    //             hitungHarga(detail, detail?.start, detail?.end, detail?.harga)
    //             : hitungHarga(detail, detail?.start, moment().format(), detail?.harga)
    //         else harga = !isNaN(detail?.harga) ? detail?.harga : hitungHarga(detail, detail?.start, detail?.end, detail?.harga)
    //         if (detail?.item?.length > 0) {
    //             if (detail?.item.some(item => 'duration' in item)) {
    //                 grandTotal = formatNumber(detail?.item?.reduce((total, item) => {
    //                     return total + Number(item.harga * item.qty);
    //                 }, harga))
    //             }
    //             else {
    //                 grandTotal = formatNumber(detail?.item?.reduce((total, item) => {
    //                     return total + Number(item.harga * item.qty);
    //                 }, harga))
    //             }
    //         }
    //         setTotal(grandTotal)
    //     } else {
    //         setTotal(0)
    //     }
    // }, [detail, cafe])

    useEffect(() => {
        if (detail?.status === "PAYMENT" && modal) {
            // setIsDiscount(detail?.discount)
            // setTypeDiscount(detail?.typeDiscount)
            setInputBayar(hitungGrandTotal())
        } else {
            // setIsDiscount(detail?.discount)
            // setTypeDiscount(detail?.typeDiscount)
            setInputBayar(((isDiscount ? (typeDiscount ? (totalHarga * (1 - (detail?.discount / 100))) : totalHarga * detail?.discount) : totalHarga)) +
                Math.floor(((isDiscount ? (typeDiscount ? (totalHarga * (1 - (detail?.discount / 100))) : totalHarga * detail?.discount) : totalHarga)) * ((detail?.tax || 0) + (detail?.service || 0))))
        }
    }, [detail, isTax, isDiscount, typeDiscount, cafe, visible, modal])


    function hitungDurasi(table, waktuAwal = moment().format(), waktuAkhir = moment().format()) {
        // console.log(waktuAwal, "waktuAwal")
        // console.log(waktuAkhir, "waktuAkhir")
        // const durasi = moment.duration(moment(waktuAkhir).diff(moment(waktuAwal)));
        // const durasiFormatted = `${durasi.hours()}:${durasi.minutes() < 10 ? '0' : ''}${durasi.minutes()}:${durasi.seconds() < 10 ? '0' : ''}${durasi.seconds()}`;
        // return durasiFormatted;
        // Calculate total paused duration in minutes
        const pauseTimes = table?.pauseTimes || [];
        // console.log(table?.pauseTimes)

        // Calculate total paused duration in minutes
        const totalPauseDuration = pauseTimes.reduce((total, pauseEntry) => {
            const pauseStart = pauseEntry.resume && table?.end ? moment(pauseEntry.resume) : moment(pauseEntry.pause);
            const pauseEnd = pauseEntry.resume ? moment(pauseEntry.resume) : moment(); // Use current time if not resumed
            return total + moment.duration(pauseEnd.diff(pauseStart)).asMinutes();
        }, 0);
        // console.log(totalPauseDuration)

        // Calculate total duration between start and end

        // const totalDuration = moment.duration(moment(moment(waktuAwal).isSame(moment().format()) ? moment(waktuAkhir).add(totalPauseDuration, "minutes") : moment(waktuAkhir)).diff(moment(waktuAwal))).asMinutes();
        // var effectiveDuration = totalDuration - totalPauseDuration

        // const totalDuration = moment.duration(moment(moment(waktuAwal).isSame(moment().format()) ? moment(waktuAkhir).add(totalPauseDuration, "minutes") : moment(waktuAkhir)).diff(moment(waktuAwal))).asMinutes();
        const totalDuration = moment.duration(
            moment(moment(waktuAwal).isSame(moment(), 'second') ? moment(waktuAkhir).add(totalPauseDuration, "minutes") : moment(waktuAkhir))
                .diff(moment(waktuAwal))
        ).asMinutes();
        // console.log(totalDuration)
        // console.log(totalPauseDuration)
        // var effectiveDuration = Math.max(0, totalDuration - totalPauseDuration) > 60 && table?.end ? Math.max(0, totalDuration - totalPauseDuration) : 60;
        var effectiveDuration = Math.max(0, totalDuration - totalPauseDuration);
        // console.log(totalPauseDuration)

        if (moment(waktuAwal).isSame(moment(), 'second')) {
            effectiveDuration = totalDuration;
        }

        const totalSeconds = Math.floor(effectiveDuration * 60);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        // console.log(effectiveDuration)
        // console.log(hours)
        // console.log(minutes)
        // Format the effective duration as HH:mm:ss
        // const effectiveDurationFormatted = `${Math.floor(effectiveDuration / 60)}:${String(Math.floor(effectiveDuration % 60)).padStart(2, '0')}:${String(Math.floor(effectiveDuration % 1 * 60)).padStart(2, '0')}`;
        const effectiveDurationFormatted = `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        // Format the total duration as HH:mm:ss
        const totalDurationFormatted = `${Math.floor(totalDuration / 60)}:${String(Math.floor(totalDuration % 60)).padStart(2, '0')}:${String(Math.floor(totalDuration % 1 * 60)).padStart(2, '0')}`;
        // console.log(effectiveDurationFormatted)
        return effectiveDurationFormatted
        // return {
        //     totalDuration: `${Math.floor(totalDuration / 3600)}:${Math.floor((totalDuration % 3600) / 60)}:${totalDuration % 60}`,
        //     effectiveDuration: effectiveDurationFormatted
        // };

    }

    //18mei2025
    // function hitungHarga(table, waktuAwal, waktuAkhir = moment().format(), harga = 0, calculateDuration = false) {
    //     let isHourPromo = false;
    //     const tableGame = table?.item?.find((data) => data?.tipe === "durasi" && data?.duration === "00:00")
    //     const rate = tableGame?.harga
    //     const qty = tableGame?.qty

    //     harga = isNaN(harga) ? 0 : harga

    //     const promoItems = table?.item?.filter(item => item?.duration && !item?.endTime);
    //     if (promoItems?.length > 0) {
    //         const [totalJam, totalMenit] = promoItems.reduce(
    //             ([totalJam, totalMenit], item) => {
    //                 const [jam, menit] = item?.duration?.split(':')?.map(Number) || [0, 0];
    //                 const totalItemMenit = ((jam * 60) + menit) * item.qty;
    //                 const newTotalMenit = totalMenit + totalItemMenit;
    //                 const newTotalJam = totalJam + Math.floor(newTotalMenit / 60);
    //                 const sisaMenit = newTotalMenit % 60;
    //                 return [newTotalJam, sisaMenit];
    //             },
    //             [0, 0]
    //         );
    //         if (moment.duration(moment(waktuAkhir).diff(moment(waktuAwal).add(totalJam, "hours").add(totalMenit, "minutes"))) < 0) {
    //             return harga;
    //         } else {
    //             isHourPromo = true;
    //             waktuAwal = moment(waktuAwal).add(totalJam, "hours").add(totalMenit, "minutes");
    //         }
    //     }

    //     const promoTime = table?.item?.find(item => item?.endTime);
    //     if (promoTime) {
    //         const [jam, menit, detik] = promoTime?.endTime?.split(':')?.map(Number);
    //         const promoEndTime = moment(waktuAwal).hours(jam).minutes(menit).seconds(detik);
    //         const currentTime = table?.status === "AKTIF" ? moment() : moment(waktuAkhir);

    //         if (promoEndTime.diff(currentTime) > 0) {
    //             return harga;
    //         } else {
    //             isHourPromo = true;
    //             waktuAwal = promoEndTime.format();
    //         }
    //     }

    //     // Menghitung total durasi pause
    //     const totalPauseDuration = (table?.pauseTimes || []).reduce((total, pauseEntry) => {
    //         const pauseStart = moment(pauseEntry.pause);
    //         const pauseEnd = moment(pauseEntry.resume);
    //         return total + moment.duration(pauseEnd.diff(pauseStart)).asMinutes();
    //     }, 0);

    //     // Menghitung total durasi bermain setelah mengurangi durasi pause
    //     // const totalDuration = moment.duration(moment(waktuAkhir !== "" ? waktuAkhir : moment().format()).diff(moment(waktuAwal))).asMinutes();
    //     const totalDuration = moment.duration(moment(waktuAkhir).diff(moment(waktuAwal))).asMinutes();
    //     const effectiveDuration = Math.max(0, totalDuration - totalPauseDuration) > 60 ? Math.max(0, totalDuration - totalPauseDuration) : 60;
    //     // console.log(effectiveDuration)

    //     // Menghitung jumlah interval 15 menit
    //     // const totalIncrements = Math.ceil(effectiveDuration / 15);

    //     // Membagi durasi antara siang dan malam
    //     const dayMinutes = Math.max(0, effectiveDuration);
    //     const dayIncrements = Math.ceil(dayMinutes / 60);

    //     if (rate) harga += (dayIncrements * rate) * qty

    //     if (calculateDuration) {
    //         // var tmpDurasi = moment.duration(moment().diff(moment(waktuAwal)))
    //         const tmpDurasi = moment.duration(effectiveDuration, "minutes");
    //         setDurasi(tmpDurasi)
    //         return
    //     }
    //     else return harga

    //     // return Math.ceil(harga / 1000) * 1000;
    // }

    function hitungHarga(table, waktuAwal, waktuAkhir = moment().format(), harga = 0, calculateDuration = false) {
        let isHourPromo = false;
        const tableGame = table?.item?.filter((data) => data?.tipe === "durasi" && data?.duration === "00:00")
        if (tableGame?.length > 0) {
            tableGame.map((game) => {
                const rate = game?.harga
                const qty = game?.qty

                harga = isNaN(harga) ? 0 : harga

                const promoItems = table?.item?.filter(item => item?.duration && !item?.endTime);
                if (promoItems?.length > 0) {
                    const [totalJam, totalMenit] = promoItems.reduce(
                        ([totalJam, totalMenit], item) => {
                            const [jam, menit] = item?.duration?.split(':')?.map(Number) || [0, 0];
                            const totalItemMenit = ((jam * 60) + menit) * item.qty;
                            const newTotalMenit = totalMenit + totalItemMenit;
                            const newTotalJam = totalJam + Math.floor(newTotalMenit / 60);
                            const sisaMenit = newTotalMenit % 60;
                            return [newTotalJam, sisaMenit];
                        },
                        [0, 0]
                    );
                    if (moment.duration(moment(waktuAkhir).diff(moment(waktuAwal).add(totalJam, "hours").add(totalMenit, "minutes"))) < 0) {
                        return harga;
                    } else {
                        isHourPromo = true;
                        waktuAwal = moment(waktuAwal).add(totalJam, "hours").add(totalMenit, "minutes");
                    }
                }

                const promoTime = table?.item?.find(item => item?.endTime);
                if (promoTime) {
                    const [jam, menit, detik] = promoTime?.endTime?.split(':')?.map(Number);
                    const promoEndTime = moment(waktuAwal).hours(jam).minutes(menit).seconds(detik);
                    const currentTime = table?.status === "AKTIF" ? moment() : moment(waktuAkhir);

                    if (promoEndTime.diff(currentTime) > 0) {
                        return harga;
                    } else {
                        isHourPromo = true;
                        waktuAwal = promoEndTime.format();
                    }
                }

                // Menghitung total durasi pause
                const totalPauseDuration = (table?.pauseTimes || []).reduce((total, pauseEntry) => {
                    const pauseStart = moment(pauseEntry.pause);
                    const pauseEnd = moment(pauseEntry.resume);
                    return total + moment.duration(pauseEnd.diff(pauseStart)).asMinutes();
                }, 0);

                // Menghitung total durasi bermain setelah mengurangi durasi pause
                // const totalDuration = moment.duration(moment(waktuAkhir !== "" ? waktuAkhir : moment().format()).diff(moment(waktuAwal))).asMinutes();
                const totalDuration = moment.duration(moment(waktuAkhir).diff(moment(waktuAwal))).asMinutes();
                const effectiveDuration = Math.max(0, totalDuration - totalPauseDuration) > 60 ? Math.max(0, totalDuration - totalPauseDuration) : 60;
                // console.log(effectiveDuration)

                // Menghitung jumlah interval 15 menit
                // const totalIncrements = Math.ceil(effectiveDuration / 15);

                // Membagi durasi antara siang dan malam
                const dayMinutes = Math.max(0, effectiveDuration);
                const dayIncrements = Math.ceil(dayMinutes / 60);

                if (rate) harga += (dayIncrements * rate) * qty
            })
        }

        if (calculateDuration) {
            // var tmpDurasi = moment.duration(moment().diff(moment(waktuAwal)))
            const tmpDurasi = moment.duration(effectiveDuration, "minutes");
            setDurasi(tmpDurasi)
            return
        }
        else return harga

        // return Math.ceil(harga / 1000) * 1000;
    }

    const removeUndefined = (obj) => {
        return Object.fromEntries(
            Object.entries(obj).filter(([_, value]) => value !== undefined)
        );
    }


    const resume = async (e) => {
        setLoading(true);
        e.preventDefault();
        var dataClient = { name: client?.id ? client?.label.split(" ")[0] : client?.label, nomor: client?.id ? client?.nomor : nomor };

        const dataForm = {
            client: dataClient,
            end: "",
            harga: 0,
            orderId: detail?._id,
            start: detail?.start,
            cashier: currentUser?.name,
            item: detail?.item,
            unpaidItems: detail?.unpaidItems,
            splitBill: detail?.splitBill,
            tax: detail?.tax,
            // service: detail?.service,
            discount: Number(detail?.discount),
            typeDiscount: detail?.typeDiscount,
            status: "AKTIF"
        };
        console.log(detail)
        console.log(dataForm)
        try {
            await api.put("/data/update", {
                collection: "tableHistory",
                filter: { _id: detail?._id },
                update: { client: dataClient, status: "AKTIF" }
            });

            delete dataForm.table;
            await api.put("/data/update", {
                collection: "table",
                filter: { _id: meja },
                update: dataForm
            });
            setData((prevData) =>
                prevData.map((item) => (item.id === meja ? { ...item, ...dataForm } : item))
            );

        } catch (error) {
            console.error("Error memperbarui data: ", error);
        }
        setRefresh(!refresh)
        setVisible(false);
        setLoading(false);
    };

    const start = async (e) => {
        setLoading(true);
        e.preventDefault();
        const tmpMeja = detail?._id || meja?.id;
        const namaMeja = detail?.name || meja?.name;
        var dataClient = { name: client?.id ? client?.label.split(" ")[0] : client?.label, nomor: client?.id ? client?.nomor : nomor };
        dataClient.name = dataClient.name !== undefined ? dataClient.name : namaMeja
        var orderItem = []; let isPromo = false

        if (Object.keys(item).length > 0) {
            console.log(item?.group)
            //BARU DIGANTI
            // if (item?.group) {
            //     isPromo = true
            //     var name = item?.label.replace(/\s*\(.*?\)\s*/g, "").trim()
            //     const { label, value, ...tmpItem } = item;
            //     orderItem.push({ ...tmpItem, name, qty: tmpItem?.qty ? tmpItem?.qty : 1 })
            // }
            // else orderItem.push({ ...item, name: name ? name : item?.name, qty: item?.qty ? item?.qty : 1 })
            var name = item?.label.replace(/\s*\(.*?\)\s*/g, "").trim()
            const { label, value, ...tmpItem } = item;
            orderItem.push({ ...item, label: item?.labelStruk, name: name ? name : item?.name, qty: tmpItem?.qty ? tmpItem?.qty : 1 })
        }
        if (tmpCafe?.item.length > 0) {
            var cafe = tmpCafe?.item.map((item) => { return { ...item, createdAt: moment().format() } })
            cafe.map((item) => {
                orderItem.push({ ...item })
            })
        }

        console.log(orderItem)
        try {
            if (!client?.id) {
                try {
                    const docRef1 = await api.post("/data/add", {
                        collection: "member",
                        data: { name: dataClient.name, nomor: dataClient.nomor, createdAt: moment().utcOffset("+07:00").format(), status: "AKTIF" }
                    });
                    if (docRef1.data.insertedId) dataClient.id = docRef1.data.insertedId
                    else throw new Error("Gagal membuat data customer")
                    // Swal.fire({ title: "Success!", text: "Customer berhasil ditambahkan", icon: "success" });
                } catch (error) {
                    console.error(error)
                    // Swal.fire({ title: "Error!", text: "Gagal menambahkan customer", icon: "error" });
                }
            }
            if (item?.tipe !== undefined || isPromo) {
                const tmpItem = isPromo ? item?.item[0] : item
                const [jam, menit] = tmpItem?.duration !== "00:00" ? tmpItem?.duration?.split(":") : [hours, minutes]
                // var tmpItem = client?.status !== "PAYMENT" && client?.subscription !== undefined && moment(client?.subscription?.expired).isSameOrAfter(moment().startOf("day")) ? { harga: 0, qty: 1, name: "MEMBER PASS" }
                //     : { ...item, name: item?.label.replace(/\s*\(.*?\)\s*/g, "").trim(), qty: item?.qty ? item?.qty : "1" }
                // delete tmpItem.label
                // delete tmpItem.value
                // var orderItem = []
                // if (tmpItem !== undefined) orderItem.push(tmpItem)
                // if (tmpCafe?.item.length > 0) orderItem.push(...tmpCafe?.item)

                const dataForm = {
                    cashier: currentUser?.name,
                    client: dataClient,
                    order: "open",
                    tax: isTax ? tax / 100 : 0,
                    // service: isService ? service / 100 : 0,
                    typeDiscount,
                    discount: isDiscount ? Number(discount) : 0,
                    orderTotal: Math.ceil((isDiscount ? (typeDiscount ? total * (1 - (discount / 100)) : total - discount) : total) * ((isTax ? tax / 100 : 0) + (isService ? service / 100 : 0))),
                    // item: usePromo && promo ? [{ qty: 1, harga: promo.harga, name: promo.value, sub: [...promo.menu], isPromo: true }] : [],
                    item: orderItem,
                    createdAt: moment().format(),
                    start: moment().format(),
                    orderAt: orderItem.some((item) => item?.addOns) ? moment().format() : "",
                    // end: usePromo && promo ? moment().add(promo.duration.split(":")[0], "hours").add(promo.duration.split(":")[1], "minutes").format() : "",
                    end: jam && menit && (jam != 0) ? moment().add(jam, "hours").add(menit, "minutes").format() : "",
                    tableName: namaMeja,
                    status: "AKTIF"
                };
                // console.log(bookingId)
                // console.log(tmpMeja)
                if (!/^\s/.test(nama)) {
                    if (orderId) {
                        await api.put("/data/update", {
                            collection: "tableHistory",
                            filter: { _id: orderId },
                            update: {
                                table: tmpMeja,
                                start: dataForm.start,
                                end: dataForm.end,
                                status: "AKTIF"
                            }
                        });

                    } else {
                        const response = await api.post("/data/add", {
                            collection: "tableHistory",
                            data: { ...dataForm, table: tmpMeja }
                        });
                        dataForm.orderId = response.data.newData._id;
                        dataForm.transactionId = response.data.newData.transactionId
                    }

                    await api.put("/data/update", {
                        collection: "table",
                        filter: { _id: tmpMeja },
                        update: dataForm
                    });
                    setRefresh(!refresh)

                    setData((prevData) =>
                        prevData.map((item) => (item.id === tmpMeja ? { ...item, ...dataForm } : item))
                    );
                    navigate("", { state: undefined, replace: true });
                }
            } else {
                // var tmpItem = client?.status !== "PAYMENT" && client?.subscription !== undefined && moment(client?.subscription?.expired).isSameOrAfter(moment().startOf("day")) && item.length > 0 ?
                //     { harga: 0, qty: 1, name: "MEMBER PASS" } : undefined

                // var orderItem = []

                // if (tmpItem !== undefined) orderItem.push(tmpItem)
                // if (tmpCafe?.item.length > 0) orderItem.push(...tmpCafe?.item)

                const dataForm = {
                    cashier: currentUser?.name,
                    client: dataClient,
                    order: "open",
                    tax: isTax ? tax / 100 : 0,
                    // service: isService ? service / 100 : 0,
                    start: moment().format(),
                    typeDiscount,
                    discount: isDiscount ? Number(discount) : 0,
                    orderTotal: Math.ceil((isDiscount ? (typeDiscount ? total * (1 - discount / 100) : total - discount) : total) * ((isTax ? tax / 100 : 0) + (isService ? service / 100 : 0))),
                    item: orderItem,
                    createdAt: moment().format(),
                    tableName: namaMeja,
                    status: "AKTIF"
                };
                console.log(dataForm)
                // console.log(bookingId)
                // console.log(tmpMeja)
                if (!/^\s/.test(nama)) {
                    if (orderId) {
                        await api.put("/data/update", {
                            collection: "tableHistory",
                            filter: { _id: orderId },
                            update: {
                                table: tmpMeja,
                                start: dataForm.start,
                                end: dataForm.end,
                                status: "AKTIF"
                            }
                        });

                    } else {
                        const response = await api.post("/data/add", {
                            collection: "tableHistory",
                            data: { ...dataForm, table: tmpMeja }
                        });
                        dataForm.orderId = response.data.newData._id;
                        dataForm.transactionId = response.data.newData.transactionId
                    }

                    await api.put("/data/update", {
                        collection: "table",
                        filter: { _id: tmpMeja },
                        update: dataForm
                    });
                    setRefresh(!refresh)

                    setData((prevData) =>
                        prevData.map((item) => (item.id === tmpMeja ? { ...item, ...dataForm } : item))
                    );
                    navigate("", { state: undefined, replace: true });
                }
            }
        } catch (error) {
            Swal.fire({
                title: "Error!",
                text: error.message,
                icon: "error"
            });
        }

        setVisible(false);
        setLoading(false);
        setHours(0);
        setMinutes(0);
    };

    const addPause = async (table) => {
        if (!table.pauseTimes) table.pauseTimes = [];

        const lastPause = table.pauseTimes[table.pauseTimes.length - 1];
        const now = moment().format("YYYY-MM-DD HH:mm:ss");
        let resume = false;

        if (lastPause && !lastPause.resume) {
            lastPause.resume = now;
            const totalDurationPause = moment.duration(moment(lastPause.resume).diff(moment(lastPause.pause))).asMinutes();
            if (table.end) table.end = moment(table.end).add(totalDurationPause, "minutes").format();
            table.status = "AKTIF";
            resume = true;
        } else {
            table.pauseTimes.push({ pause: now, resume: null });
            table.status = "PAUSE";
        }

        const dataForm = resume && table.end
            ? { pauseTimes: table.pauseTimes, status: table.status, end: table.end }
            : { pauseTimes: table.pauseTimes, status: table.status };

        try {
            await api.put("/data/update", {
                collection: "table",
                filter: { _id: table.id },
                update: dataForm
            });
            setRefresh(!refresh)

            Swal.fire({
                title: "Updated!",
                text: "Data berhasil diperbarui",
                icon: "success"
            });
        } catch (error) {
            Swal.fire({
                title: "Error!",
                text: "Data gagal diperbarui",
                icon: "error"
            });
        }
    };


    const confirmationStop = async (table) => {
        Swal.fire({
            title: "Konfirmasi",
            html: `<p>Apakah anda yakin menghentikan table atas nama <b>${table?.client?.name}</b>?</p>`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Ya",
            cancelButtonText: "Batal"
        }).then(async (result) => {
            if (result.isConfirmed) {
                // // console.log("STOP")
                stop(table)
            }
        })
    }

    const stop = async (table, isHistory = false) => {
        const dataForm = {
            orderId: "",
            client: "",
            item: [],
            pauseTimes: [],
            harga: 0,
            date: "",
            start: "",
            end: "",
            timer: "",
            status: "KOSONG",
            createdAt: ""
        };
        setLoading(true);
        var item = table?.item.length > 0 ? table?.item?.reduce((total, item) => {
            if (item?.isPromo) {
                return total;
            } else {
                const totalAddOn = item?.addOns
                    ? item.addOns.reduce((total1, item1) => total1 + Number(item1.harga), 0)
                    : 0;

                const tax = cafe?.tax ?? 0;
                const service = cafe?.service ?? 0;

                if (item?.addOns) {
                    const itemTotal = (Number(item.harga) + totalAddOn) * item.qty;
                    return total + itemTotal * (1 - tax + service);
                } else {
                    return total + (Number(item.harga) * item.qty);
                }
            }
        }, 0) : 0;

        var isPlay = table?.item.some((data) => data.tipe !== undefined)

        table.harga = 0;
        var harga = Math.ceil(hitungGrandTotal(table));
        table.table = table.name;
        table.end = table?.end !== "" && moment().isAfter(table?.end) ? table?.end : moment().format();
        table.harga = harga - item;
        var unpaidItems = syncUnpaidItems(table);

        const updatedItems = table.item.map((item) => {
            if (item.tipe === "durasi" && item.duration === "00:00") {
                const startTime = new Date(table?.start);
                const endTime = new Date(table?.end ? table?.end : moment().format().toString());
                const diffMs = endTime - startTime;
                const diffMinutes = Math.floor(diffMs / 60000);
                const hours = String(Math.floor(diffMinutes / 60)).padStart(2, "0");
                const minutes = String(diffMinutes % 60).padStart(2, "0");
                const tmpNote = `${hours}:${minutes}`
                return { ...item, note: tmpNote };
            }
            return item;
        });

        try {
            await api.put("/data/update", {
                collection: "tableHistory",
                filter: { _id: isHistory ? table?.id : table?.orderId },
                update: {
                    orderId: table?.orderId || "",
                    item: updatedItems,
                    unpaidItems,
                    harga: table?.harga,
                    table: table?.id,
                    pauseTimes: table?.pauseTimes || [],
                    end: table?.start !== "" ? table.end : "",
                    status: "PAYMENT"
                }
            });

            // if (table?.orderId) {
            //     await api.put("/data/update", {
            //         collection: "order",
            //         filter: { _id: table?.orderId },
            //         update: { status: "PAYMENT" }
            //     });
            // }

            // if (table?.cafeId) {
            //     await api.put("/data/update", {
            //         collection: "cafe",
            //         filter: { _id: table?.cafeId },
            //         update: { status: "PAYMENT" }
            //     });
            // }
            console.log(table._id)
            console.log(table)

            table.status = "KOSONG";
            await api.put("/data/update", {
                collection: "table",
                filter: { _id: table._id },
                update: { $set: dataForm, $unset: { unpaidItems: 1, splitBill: 1 } }
            });
        } catch (error) {
            console.error('Error updating data: ', error);
        }
        setRefresh(!refresh)
        setVisible(false);
        setLoading(false);
    };


    const deleteTimer = async () => {
        setLoading(true);
        try {
            await api.put("/data/update", {
                collection: "table",
                filter: { _id: detail?._id },
                update: { end: "" }
            });
            setRefresh(!refresh)
            Swal.fire({ title: "Updated!", text: "Data berhasil diperbarui", icon: "success" });
        } catch (error) {
            console.error('Error updating data: ', error);
            Swal.fire({ title: "Error!", text: "Data gagal diperbarui", icon: "error" });
        }
        setVisible(false);
        setLoading(false);
    };

    const updateTable = async () => {
        // console.log(waktu)
        setLoading(true)
        if ((Number(hours) > 0 || waktu !== "")) {

            const [jam, menit] = waktu.split(":")
            const durasi = moment.duration(moment(waktu, "HH:mm").diff(moment(detail?.start)));
            const tmpDate = detail?.end === "" ? moment(detail?.start).seconds(moment(detail?.start).seconds()) : moment(detail?.end)
            const newDate = tableControl === "durasi" ? tmpDate.add(hours, "hours").add(minutes, "minutes").format().toString() :
                (durasi > 0 ? moment(waktu + ":" + moment(detail?.start).seconds(), "HH:mm:ss").format() : moment(detail?.start).set("hour", jam).set("minute", menit).format())
            console.log(newDate)
            try {
                await api.put("/data/update", {
                    collection: "table",
                    filter: { _id: detail?._id },
                    update: { end: newDate }
                });
                Swal.fire({ title: "Updated!", text: "Data berhasil diperbarui", icon: "success" });
            } catch (error) {
                Swal.fire({ title: "Error!", text: "Data gagal diperbarui", icon: "error" });
            }

        }

        if (changeTable !== "") {
            const dataForm = { orderId: "", client: "", item: [], start: "", end: "", timer: "", status: "KOSONG" }
            try {
                console.log(changeTable)
                await api.put("/data/update", {
                    collection: "table",
                    filter: { _id: detail?._id },
                    update: dataForm
                });
                var { priceList, tableName, ...newForm } = detail
                delete newForm.id
                delete newForm._id
                delete newForm.name

                console.log(newForm)
                await api.put("/data/update", {
                    collection: "table",
                    filter: { _id: changeTable },
                    update: newForm
                });

                Swal.fire({ title: "Updated!", text: "Data berhasil diperbarui", icon: "success" });
            } catch (error) {
                Swal.fire({ title: "Error!", text: "Data gagal diperbarui", icon: "error" });
            }
        }
        setRefresh(!refresh)
        setVisible(false)
        setLoading(false)
    }

    const pindahTable = () => {
        var filteredData = data.filter((data) => { return data.status === "KOSONG" && data._id !== detail?._id; })
        if (filteredData.length > 0) setChangeTable(filteredData[0]?._id)
    }

    const setTable = (data) => {
        if (data) {
            setNama(data?.client?.name)
            setOrderId(data?.id)
        }
        setVisible(true)
    }

    const tambahCustomer = async (e) => {
        e.preventDefault();
        setLoading(true)
        var tmpWaktu = waktu === "" ? moment().add(1, "hours").startOf("hour").format("HH:mm") : waktu
        var dataClient = { name: client?.label, nomor: client?.id ? client?.nomor : nomor }
        try {
            if (client?.id) dataClient.id = client?.id
            else {
                // console.log(docRef1.id)
                try {
                    const docRef1 = await api.post("/data/add", {
                        collection: "member",
                        data: { name: client?.label, nomor: nomor, createdAt: moment().utcOffset("+07:00").format(), status: "AKTIF" }
                    });
                    if (docRef1.data.insertedId) dataClient.id = docRef1.data.insertedId
                    else throw new Error("Gagal membuat data customer")
                    Swal.fire({ title: "Success!", text: "Customer berhasil ditambahkan", icon: "success" });
                } catch (error) {
                    Swal.fire({ title: "Error!", text: "Gagal menambahkan customer", icon: "error" });
                }

            }
            const data = {
                client: dataClient,
                // tableId: "table-1",
                bookingDate: moment(tmpWaktu, "HH:mm").format().toString(),
                createdAt: moment().format().toString(),
                item: [],
                start: "",
                end: "",
                status: "WAITING"
            }
            try {
                const docRef1 = await api.post("/data/add", {
                    collection: "tableHistory",
                    data: data
                });
                Swal.fire({ title: "Success!", text: "Customer berhasil ditambahkan", icon: "success" });
            } catch (error) {
                Swal.fire({ title: "Error!", text: "Gagal menambahkan customer", icon: "error" });
            }
            // const docRef = await addDoc(collection(firestore, "booking"), data);
            // // console.log("Document written with ID: ", docRef.id);
        }
        catch (err) {
            Swal.fire({
                title: "Error!",
                text: err,
                icon: "error"
            });
        }
        setRefresh(!refresh)
        setVisible(false)
        setLoading(false)
    }

    const updateHarga = async () => {
        setLoading(true);
        (true);
        setEditHarga(false);
        const total = edit?.item?.reduce((total, item) => total + Number(item.harga * item.qty), 0);
        try {
            await api.put("/data/update", {
                collection: "tableHistory",
                filter: { _id: edit?.id },
                update: {
                    harga: Number(total) + Number(value),
                    hargaVoid: Number(value),
                    hargaNormal: edit?.hargaNormal
                }
            });
            Swal.fire({ title: "Updated!", text: "Data berhasil diperbarui", icon: "success" });
        } catch (err) {
            Swal.fire({ title: "Error!", text: "Data gagal diperbarui", icon: "error" });
        }
        setVisible(false);
        setLoading(false);
        (false);
    };

    const updateHargaCafe = async (e) => {
        // // console.log(id, tipe)
        try {
            // const update = await setDoc(doc(firestore, "tableHistory", edit?.id), { item: edit?.item }, { merge: true })
            await api.put("/data/update", {
                collection: "tableHistory",
                filter: { _id: edit?.id },
                update: {
                    item: edit?.item
                }
            });
            Swal.fire({
                title: "Success!",
                text: "Data berhasil diubah",
                icon: "success"
            });
        } catch (err) {
            Swal.fire({
                title: "Failed!",
                text: "Data gagal diubah",
                icon: "error"
            });
        }
        setVisible(false)
    }

    const updateStatus = async () => {
        setLoading(true)
        setEditStatus(false)
        try {
            // const updateOrder = await setDoc(doc(firestore, "tableHistory", edit?.id), { status: edit?.status }, { merge: true })
            await api.put("/data/update", {
                collection: "tableHistory",
                filter: { _id: edit?.id },
                update: {
                    status: edit?.status
                }
            });
            Swal.fire({
                title: "Updated!",
                text: "Data berhasil diperbarui",
                icon: "success"
            });
        } catch (err) {
            // console.log(err)
            Swal.fire({
                title: "Error!",
                text: "Data gagal diperbarui",
                icon: "error"
            });
        }
        setVisible(false)
        setLoading(false)
    }

    const updateClient = async () => {
        setLoading(true)
        setEditHarga(false)
        // console.log(detail)
        try {
            const data = { name: value, nomor: "" }
            console.log(detail)
            await api.put("/data/update", {
                collection: "table",
                filter: { _id: detail?._id },
                update: {
                    $set: {
                        client: data
                    }
                }
            });
            await api.put("/data/update", {
                collection: "tableHistory",
                filter: { _id: detail?.orderId },
                update: {
                    $set: {
                        client: data
                    }
                }
            });

            Swal.fire({
                title: "Updated!",
                text: "Data berhasil diperbarui",
                icon: "success"
            });
        } catch (err) {
            // console.log(err)
            Swal.fire({
                title: "Error!",
                text: "Data gagal diperbarui",
                icon: "error"
            });
        }
        setRefresh(!refresh)
        setEditNama(false)
        setModal(false)
        setLoading(false)
    }

    const updateOrder = async (e) => {
        e.preventDefault();
        setLoading(true)
        // var tmpMerch = [...merch]
        var end = ""
        var tmpDetail = Object.keys(detail).length > 0 ? detail : edit
        var newItem = []
        // console.log(tmpDetail)
        // console.log(edit)
        const playItem = tmpDetail?.item ? tmpDetail?.item?.filter(item => item?.tipe !== undefined) : [];
        var isNew = tmpDetail?.item ? tmpDetail?.item?.some((data) => data.tipe !== undefined && data?.isNew) : false;
        var isPlay = tmpDetail?.item ? tmpDetail?.item?.some((data) => data.tipe !== undefined) : false;

        const total = tmpDetail?.item?.reduce((total, item) => {
            if (!item?.isPromo && !item?.addOns) {
                // Konversi harga ke Number dan tambahkan ke total
                return total + Number(item.harga) * Number(item.qty);
            }
            // Jika kondisi tidak terpenuhi, kembalikan akumulasi total
            return total;
        }, 0); // Nilai awal 0 untuk total


        var tmpOrder = tmpDetail?.item ? tmpDetail?.item
            .filter(item => (item.harga && item.name && Math.sign(item.qty) === 1))
            .map((item, idx) => {
                // // console.log(item)
                var tmpItem = { ...item }
                // var index = tmpMerch.findIndex(data => data.id === item.id);
                // // console.log(index)
                Object.keys(tmpItem).forEach((key) => {
                    // Check if the property value is undefined
                    if (tmpItem[key] === undefined) {
                        // Delete the property
                        delete tmpItem[key];
                    }
                });
                delete tmpItem.isNew
                delete tmpItem.isEdit
                if (tmpItem.name && tmpItem.name.label) {
                    tmpItem.name = tmpItem.name.label.split("(")[0];
                }
                if (tmpItem.id === undefined) tmpItem.id = tmpItem?.value;
                // tmpItem.id = tmpItem?.value;
                delete tmpItem.label
                delete tmpItem.value
                // if (tmpItem?.isNew) {
                //     delete tmpItem.isNew
                //     delete tmpItem.isEdit
                //     if (tmpItem.name && tmpItem.name.label) {
                //         tmpItem.name = tmpItem.name.label.split("(")[0];
                //     }
                //     if (tmpItem.id === undefined) tmpItem.id = tmpItem?.value;
                //     // tmpItem.id = tmpItem?.value;
                //     delete tmpItem.label
                //     delete tmpItem.value
                //     newItem.push(tmpItem)
                // } else {
                //     delete tmpItem.isNew
                //     delete tmpItem.isEdit
                //     if (tmpItem.name && tmpItem.name.label) {
                //         tmpItem.name = tmpItem.name.label.split("(")[0];
                //     }
                //     if (tmpItem.id === undefined) tmpItem.id = tmpItem?.value;
                //     // tmpItem.id = tmpItem?.value;
                //     delete tmpItem.label
                //     delete tmpItem.value
                // }

                return tmpItem;
            }) : [];
        if (tmpCafe?.item.length > 0) {
            var cafe = tmpCafe?.item.map((item) => { return { ...item, createdAt: moment().format() } })
            cafe.map((item) => {
                tmpOrder.push({ ...item })
            })
            // tmpOrder.push(...tmpCafe?.item)
        }
        tmpDetail.item = tmpOrder
        var unpaidItems = syncUnpaidItems(tmpDetail)
        // // console.log(tmpMerch)
        // console.log(detail)
        // console.log(detail)
        // console.log(tmpOrder)
        // console.log(isPlay)
        // // console.log(promoIdx)
        if (playItem.length > 0) {
            const [jam, menit] = playItem[0].duration !== "00:00" ? playItem[0]?.duration?.split(":") : [0, 0]


            // const [jam, menit] = tmpOrder[promoIdx]?.duration?.split(':').map(Number);
            // const totalMinutes = (jam * 60) + menit;

            // const multipliedMinutes = totalMinutes * tmpOrder[promoIdx]?.qty;

            // const totalJam = Math.floor(multipliedMinutes / 60);
            // const totalMenit = multipliedMinutes % 60;
            if (jam > 0 || menit > 0)
                end = moment(tmpDetail?.start ? tmpDetail?.start : moment()).add(jam, "hours").add(menit, "minutes").format()
        }
        if (tmpDetail?.orderId) {
            const dataOrder = {
                item: tmpOrder.filter((item) => !item?.isPromo && !item?.addOns),
                total: total,
            }
            try {
                // var bookingId = action === "edit" ? detail?.id : detail?.bookingId;
                // await api.put("/data/update", {
                //     collection: "order",
                //     filter: { _id: detail?.orderId },
                //     update: dataOrder
                // });

                if (action !== "edit") {
                    await api.put("/data/update", {
                        collection: "table",
                        filter: { _id: tmpDetail?._id },
                        update: {
                            discount: isDiscount ? Number(tmpDetail?.discount) : 0,
                            tax: isTax ? Number(tmpDetail?.tax) : 0,
                            typeDiscount,
                            orderAt: tmpOrder.some((item) => item?.addOns) ? moment().format() : "",
                            start: isPlay ? (isNew ? moment().format().toString() : tmpDetail?.start) : "",
                            end: end,
                            item: tmpOrder
                        }
                    });
                }

                if (tmpDetail?.splitBill !== undefined) {
                    await api.put("/data/update", {
                        collection: "tableHistory",
                        filter: { _id: tmpDetail?.orderId },
                        update: {
                            discount: isDiscount ? Number(tmpDetail?.discount) : 0,
                            tax: isTax ? Number(tmpDetail?.tax) : 0,
                            typeDiscount,
                            orderAt: tmpOrder.some((item) => item?.addOns) ? moment().format() : "",
                            start: isPlay ? (isNew ? moment().format().toString() : tmpDetail?.start) : "",
                            end: end,
                            item: tmpOrder,
                            unpaidItems,
                        }
                    });
                } else {
                    await api.put("/data/update", {
                        collection: "tableHistory",
                        filter: { _id: tmpDetail?.orderId },
                        update: {
                            discount: isDiscount ? Number(tmpDetail?.discount) : 0,
                            tax: isTax ? Number(tmpDetail?.tax) : 0,
                            typeDiscount,
                            orderAt: tmpOrder.some((item) => item?.addOns) ? moment().format() : "",
                            start: isPlay ? (isNew ? moment().format().toString() : tmpDetail?.start) : "",
                            end: end,
                            item: tmpOrder,
                        }
                    });
                }


                // for (let item of merch) {
                //     await api.put("/data/update", {
                //         collection: "merchandise",
                //         filter: { _id: item.id },
                //         update: { stok: item.stok }
                //     });
                // }
                Swal.fire({ title: "Updated!", text: "Data berhasil diperbarui", icon: "success" });

            } catch (err) {
                console.error('Error menambahkan data: ', err);
                Swal.fire({
                    title: "Error!",
                    text: "Data gagal diperbarui",
                    icon: "error"
                });
            }
        } else {
            const dataOrder = {
                client: tmpDetail?.client,
                table: tmpDetail?.table ? tmpDetail?.table : tmpDetail?.id,
                item: tmpOrder.filter((item) => !item?.isPromo && !item?.addOns),
                total: total,
                createdAt: moment().format().toString(),
                status: "PAYMENT"
            }
            try {
                const orderId = ""
                if (orderId) {
                    if (action !== "edit") {
                        await api.put("/data/update", {
                            collection: "table",
                            filter: { _id: tmpDetail?._id },
                            update: {
                                discount: isDiscount ? Number(tmpDetail?.discount) : 0,
                                tax: isTax ? Number(tmpDetail?.tax) : 0,
                                typeDiscount,
                                orderAt: tmpOrder.some((item) => item?.addOns) ? moment().format() : "",
                                start: isPlay ? moment().format().toString() : "",
                                end: end,
                                item: tmpOrder
                            }
                        });
                    }
                    else {
                        await api.put("/data/update", {
                            collection: "tableHistory",
                            filter: { _id: tmpDetail?.orderId },
                            update: {
                                discount: isDiscount ? Number(tmpDetail?.discount) : 0,
                                tax: isTax ? Number(tmpDetail?.tax) : 0,
                                typeDiscount,
                                orderAt: tmpOrder.some((item) => item?.addOns) ? moment().format() : "",
                                start: isPlay ? moment().format().toString() : "", end: end,
                                item: tmpOrder
                            }
                        });

                    }
                }

                // for (let item of merch) {
                //     await api.put("/data/update", {
                //         collection: "merchandise",
                //         filter: { _id: item.id },
                //         update: { stok: item.stok }
                //     });
                // }
                Swal.fire({ title: "Updated!", text: "Data berhasil diperbarui", icon: "success" });
            } catch (err) {
                console.error('Error menambahkan data: ', err);
                Swal.fire({
                    title: "Error!",
                    text: "Data gagal diperbarui",
                    icon: "error"
                });
            }
        }
        setRefresh(!refresh)
        setVisible(false)
        setLoading(false)
        setDetail([])
        setModal(false)
        // }
    }
    function syncUnpaidItems(orderData) {
        const allItems = orderData.item || [];
        const splitItems = (orderData.splitBill || []).flatMap(split => split.item || []);

        // Hitung total qty untuk setiap item+createdAt di splitBill
        const paidItemMap = new Map();
        for (const item of splitItems) {
            const key = `${item.id}_${item.createdAt}`;
            const prevQty = paidItemMap.get(key) || 0;
            paidItemMap.set(key, prevQty + item.qty);
        }

        // Buat unpaidItems baru berdasarkan pengurangan qty dari item aslinya
        const unpaidItems = [];

        for (const item of allItems) {
            const key = `${item.id}_${item.createdAt}`;
            const paidQty = paidItemMap.get(key) || 0;
            const unpaidQty = item.qty - paidQty;

            if (unpaidQty > 0) {
                unpaidItems.push({
                    ...item,
                    qty: unpaidQty
                });
            }
        }

        console.log(unpaidItems)

        // Return hasil update unpaidItems
        return unpaidItems;
    }
    const mergeData = (arr1, arr2) => {
        const map = new Map();

        [...arr1, ...arr2].forEach(item => {
            const key = item.id;
            if (map.has(key)) {
                const existing = map.get(key);
                map.set(key, {
                    ...existing,
                    qty: (existing.qty || 0) + (item.qty || 0)
                });
            } else {
                map.set(key, { ...item }); // clone biar gak mutasi original
            }
        });

        return Array.from(map.values());
    };

    const handleDecrease = (idx, item) => {
        var tmpQty = item?.qty
        if (item?.qty > 1) {
            var tmpOrder = { ...detail }
            if (tmpOrder?.splitBill !== undefined) {
                if (item?.totalQty === undefined) tmpOrder.unpaidItems[idx] = { ...tmpOrder.unpaidItems[idx], totalQty: Number(tmpQty), qty: Number(item?.qty) - 1 };
                else tmpOrder.unpaidItems[idx] = { ...tmpOrder.unpaidItems[idx], qty: Number(item?.qty) - 1 };
            }
            else {
                if (item?.totalQty === undefined) tmpOrder.item[idx] = { ...tmpOrder.item[idx], totalQty: Number(tmpQty), qty: Number(item?.qty) - 1 };
                else tmpOrder.item[idx] = { ...tmpOrder.item[idx], qty: Number(item?.qty) - 1 };
            }
            setDetail(tmpOrder)
        }
    };

    const handleIncrease = (idx, item) => {
        var tmpOrder = { ...detail }
        // var totalQty = item?.totalQty !== undefined ? item?.totalQty : tmpOrder?.unpaidItems?.find((data) => data?.id === item?.id)?.qty
        var totalQty = item?.totalQty
        const newValue = item?.qty + 1;
        if (item?.qty < totalQty) {
            if (tmpOrder?.splitBill !== undefined) {
                tmpOrder.unpaidItems[idx] = { ...tmpOrder.unpaidItems[idx], qty: newValue };
            }
            else
                tmpOrder.item[idx] = { ...tmpOrder.item[idx], qty: newValue };
            setDetail(tmpOrder)
        }
    };

    const titleCase = (str) => {
        if (str !== "" && str) {
            var splitStr = str.toLowerCase().split(' ');
            for (var i = 0; i < splitStr.length; i++) {
                // You do not need to check if i is larger than splitStr length, as your for does that for you
                // Assign it back to the array
                splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
            }
            // Directly return the joined string
            return splitStr.join(' ');
        } else return ""

    }

    // useEffect(() => {
    //     const colRefTable = query(
    //         collection(firestore, "table"),
    //         where("category", "==", "pool")
    //     );
    //     const unsubscribeInitTable = onSnapshot(colRefTable, { includeMetadataChanges: true, source: 'cache' }, async (snapshot) => {
    //         // var tmpData = [...data];
    //         var tmpData = []
    //         const source = snapshot.metadata.fromCache ? "local cache" : "server";
    //         // // console.log(snapshot.metadata.hasPendingWrites)
    //         // // console.log(source)
    //         if (!initTable) {
    //             snapshot.forEach((tmpDocs) => {
    //                 // // console.log(tmpDocs.id)
    //                 const docData = { ...tmpDocs.data(), id: tmpDocs.id };
    //                 tmpData.push(docData);

    //             });
    //             // // console.log(tmpData)
    //             tmpData = tmpData.sort((a, b) => {
    //                 const numA = parseInt(a.id.split('-')[1], 10); // Mendapatkan bagian numerik dari id
    //                 const numB = parseInt(b.id.split('-')[1], 10);
    //                 return numA - numB
    //             });
    //             setData(tmpData);
    //             setInitTable(true);
    //         }
    //     });

    //     const unsubscribeTable = onSnapshot(colRefTable, async (snapshot) => {
    //         // var tmpData = [...data];
    //         var tmpData = []
    //         const source = snapshot.metadata.fromCache ? "local cache" : "server";
    //         // // console.log(snapshot.metadata.hasPendingWrites)
    //         // // console.log(source)
    //         if (initTable) {
    //             snapshot.forEach((tmpDocs) => {
    //                 // // console.log(tmpDocs.id)
    //                 const docData = { ...tmpDocs.data(), id: tmpDocs.id };
    //                 tmpData.push(docData);
    //             })
    //             // // console.log(tmpData)
    //             tmpData = tmpData.sort((a, b) => {
    //                 const numA = parseInt(a.id.split('-')[1], 10); // Mendapatkan bagian numerik dari id
    //                 const numB = parseInt(b.id.split('-')[1], 10);
    //                 return numA - numB
    //             });
    //             setData(tmpData);
    //         }

    //         // if (initTable) {
    //         //     // console.log(tmpData)
    //         //     setData(tmpData);
    //         // }
    //         // setInitTable(true);
    //     });

    //     return () => {
    //         unsubscribeTable();
    //         unsubscribeInitTable();
    //     };
    // }, [initTable]);

    useEffect(() => {
        // Clear all existing intervals when data changes
        Object.values(intervals).forEach(clearInterval);

        // Create new intervals based on updated data
        const newIntervals = {};

        data.forEach((item, index) => {
            if (item?.status === "AKTIF" && item?.end) {
                const intervalId = setInterval(() => {
                    // // console.log(hitungDurasi(moment().format(), item?.end), item?.name);

                    const duration = moment.duration(moment(item?.end).diff(moment()));
                    if (duration < 0) {
                        // console.log(item, "STOP DARI TIMER")
                        clearInterval(intervalId);
                        stop(item);
                    }
                }, 1000);

                // Store the interval ID
                newIntervals[index] = intervalId;
            }
            else if (item?.status === "PAUSE") {
                clearInterval(intervals[index])
            }
        });

        // Update intervals state
        setIntervals(newIntervals);

        // Clear intervals on component unmount
        return () => {
            Object.values(newIntervals).forEach(clearInterval);
        };
    }, [data]);

    // useEffect(() => {
    //     const q = query(collection(firestore, "merchandise"), orderBy("name", "asc"))
    //     const unsubscribeInitMerch = onSnapshot(q, { includeMetadataChanges: true, source: 'cache' }, async (snapshot) => {
    //         // var tmpData = [...data];
    //         var tmpData = []
    //         var tmpOptions = []
    //         const source = snapshot.metadata.fromCache ? "local cache" : "server";
    //         if (!initMerch) {
    //             snapshot.forEach((tmpDocs) => {
    //                 // // console.log(tmpDocs.id)
    //                 const docData = { ...tmpDocs.data(), id: tmpDocs.id };
    //                 tmpData.push(docData);
    //                 tmpOptions.push({
    //                     id: tmpDocs.id,
    //                     value: tmpDocs.data()?.name,
    //                     label: tmpDocs.data()?.name + ` Qty: ${tmpDocs.data()?.stok}`,
    //                     harga: tmpDocs.data()?.harga,
    //                     stok: tmpDocs.data()?.stok,
    //                     group: "merch"
    //                 })
    //             });
    //             // // console.log(tmpData)
    //             setMerchOptions(tmpOptions)
    //             setMerch(tmpData);
    //             setInitMerch(true);
    //         }
    //     });

    //     const unsubscribeMerch = onSnapshot(q, async (snapshot) => {
    //         // var tmpData = [...data];
    //         var tmpData = []
    //         var tmpOptions = []
    //         const source = snapshot.metadata.fromCache ? "local cache" : "server";
    //         // // console.log(snapshot.metadata.hasPendingWrites)
    //         // // console.log(source)
    //         snapshot.forEach((tmpDocs) => {
    //             // // console.log(tmpDocs.id)
    //             if (initMerch) {
    //                 const docData = { ...tmpDocs.data(), id: tmpDocs.id };
    //                 tmpData.push(docData);
    //                 tmpOptions.push({
    //                     id: tmpDocs.id,
    //                     value: tmpDocs.data()?.name,
    //                     label: tmpDocs.data()?.name + ` Qty: ${tmpDocs.data()?.stok}`,
    //                     harga: tmpDocs.data()?.harga,
    //                     stok: tmpDocs.data()?.stok,
    //                     group: "merch"
    //                 })
    //             }
    //         });
    //         if (initMerch) {
    //             // // console.log(tmpData)
    //             setMerchOptions(tmpOptions)
    //             setMerch(tmpData);
    //         }
    //         // setInitTable(true);
    //     });

    //     return () => {
    //         unsubscribeMerch();
    //         unsubscribeInitMerch();
    //     };
    // }, [initMerch]);

    // useEffect(() => {
    //     const q = query(collection(firestore, "promo"), orderBy("name", "asc"))
    //     const unsubscribeInitPromo = onSnapshot(q, { source: 'cache' }, async (snapshot) => {
    //         // var tmpData = [...data];
    //         var tmpData = []
    //         var tmpOptions = []
    //         const source = snapshot.metadata.fromCache ? "local cache" : "server";
    //         if (!initPromo) {
    //             snapshot.forEach((tmpDocs) => {
    //                 // // console.log(tmpDocs.id)
    //                 const docData = { ...tmpDocs.data(), id: tmpDocs.id };
    //                 // tmpData.push(docData);
    //                 tmpOptions.push({
    //                     id: tmpDocs.id,
    //                     value: tmpDocs.data()?.name,
    //                     label: `${tmpDocs.data()?.name} (${formatNumber(tmpDocs.data()?.harga)})`,
    //                     harga: tmpDocs.data()?.harga,
    //                     duration: tmpDocs.data()?.duration,
    //                     startTime: tmpDocs.data()?.startTime,
    //                     endTime: tmpDocs.data()?.endTime,
    //                     menu: tmpDocs.data()?.menu,
    //                     table: tmpDocs.data()?.table,
    //                     group: "promo"
    //                 })
    //             });
    //             // // console.log(tmpData)
    //             setPromoOptions(tmpOptions)
    //             // setMenu(tmpData);
    //             setInitPromo(true);
    //         }
    //     });

    //     const unsubscribePromo = onSnapshot(q, async (snapshot) => {
    //         // var tmpData = [...data];
    //         var tmpData = []
    //         var tmpOptions = []
    //         const source = snapshot.metadata.fromCache ? "local cache" : "server";
    //         // // console.log(snapshot.metadata.hasPendingWrites)
    //         // // console.log(source)
    //         if (initPromo) {
    //             snapshot.forEach((tmpDocs) => {
    //                 // // console.log(tmpDocs.id)
    //                 const docData = { ...tmpDocs.data(), id: tmpDocs.id };
    //                 // tmpData.push(docData);
    //                 tmpOptions.push({
    //                     id: tmpDocs.id,
    //                     value: tmpDocs.data()?.name,
    //                     label: `${tmpDocs.data()?.name} (${formatNumber(tmpDocs.data()?.harga)})`,
    //                     harga: tmpDocs.data()?.harga,
    //                     duration: tmpDocs.data()?.duration,
    //                     startTime: tmpDocs.data()?.startTime,
    //                     endTime: tmpDocs.data()?.endTime,
    //                     menu: tmpDocs.data()?.menu,
    //                     table: tmpDocs.data()?.table,
    //                     group: "promo"
    //                 })
    //             });

    //             // // console.log(tmpData)
    //             // // console.log(promoOptions)
    //             setPromoOptions(tmpOptions)
    //         }
    //         // if (initPromo) {
    //         //     // console.log(tmpData)
    //         //     setPromoOptions(tmpOptions)
    //         //     // setMenu(tmpData);
    //         // }
    //         // setInitTable(true);
    //     });

    //     return () => {
    //         unsubscribePromo();
    //         unsubscribeInitPromo();
    //     };
    // }, [initPromo]);

    // useEffect(() => {
    //     const colRefTable = query(
    //         collection(firestore, "customer")
    //     );
    //     const unsubscribeInitClient = onSnapshot(colRefTable, { includeMetadataChanges: true, source: 'cache' }, async (snapshot) => {
    //         // var tmpData = [...data];
    //         var tmpData = []
    //         const source = snapshot.metadata.fromCache ? "local cache" : "server";
    //         // // console.log(snapshot.metadata.hasPendingWrites)
    //         // // console.log(source)
    //         if (!initClient) {
    //             snapshot.forEach((tmpDocs) => {
    //                 // // console.log(tmpDocs.id)
    //                 const docData = { id: tmpDocs.id, nomor: tmpDocs.data()?.nomor, value: tmpDocs.id, label: tmpDocs.data()?.name };
    //                 tmpData.push(docData);
    //             });
    //             // // console.log(tmpData)
    //             setDataClient(tmpData);
    //             setInitClient(true);
    //         }
    //     });

    //     const unsubscribeClient = onSnapshot(colRefTable, async (snapshot) => {
    //         // var tmpData = [...data];
    //         var tmpData = []
    //         const source = snapshot.metadata.fromCache ? "local cache" : "server";
    //         // // console.log(snapshot.metadata.hasPendingWrites)
    //         // // console.log(source)
    //         if (initClient) {
    //             snapshot.forEach((tmpDocs) => {
    //                 // // console.log(tmpDocs.id)
    //                 const docData = { id: tmpDocs.id, nomor: tmpDocs.data()?.nomor, value: tmpDocs.id, label: tmpDocs.data()?.name };
    //                 tmpData.push(docData);
    //             })
    //             // console.log(tmpData)
    //             setDataClient(tmpData);
    //         }

    //         // if (initTable) {
    //         //     // console.log(tmpData)
    //         //     setData(tmpData);
    //         // }
    //         // setInitTable(true);
    //     });

    //     return () => {
    //         unsubscribeClient();
    //         unsubscribeInitClient();
    //     };
    // }, [initClient]);

    // useEffect(() => {
    //     console.log(item)
    // }, [item])

    const fetchTables = async () => {
        try {
            const response = await api.post("/data", {
                collection: "table",
                filter: {},
                sort: {}
            });
            let tmpData = response.data;
            tmpData = tmpData.sort((a, b) => {
                const numA = parseInt(a.name.split(' ')[1], 10);
                const numB = parseInt(b.name.split(' ')[1], 10);
                return numA - numB;
            });
            setData(tmpData);
        } catch (error) {
            console.error("Error fetching table data: ", error);
        }
    };

    const fetchMember = async () => {
        try {
            const response = await api.post('/data', {
                collection: "member",
                filter: {},
                sort: { label: 1 }
            })
            var tmpData = []
            response.data.forEach((data) => {
                tmpData.push({ label: `${data.name} (${data.nomor})`, status: data?.status, value: data._id, nomor: data.nomor, id: data._id, subscription: data.subscription })
            })
            setDataClient(tmpData);
        } catch (error) {
            console.error('Error fetching menu reports:', error);
            // Swal.fire('Error', 'Gagal memuat laporan menu', 'error');
        }
    };
    const fetchPriceOption = async () => {
        try {
            const response = await api.post('/data', {
                collection: "tablePrice",
                filter: {},
                sort: { label: 1 }
            })
            var tmpData = []
            response.data.forEach((data) => {
                tmpData.push({ label: `${data.name} (${formatNumber(data.harga)})`, labelStruk: data?.label ? data?.label : "", value: data._id, harga: data.harga, tipe: data.tipe, duration: data.duration, id: data._id, category: "board game" })
            })
            console.log(tmpData)
            setPriceList(tmpData);
        } catch (error) {
            console.error('Error fetching menu reports:', error);
            // Swal.fire('Error', 'Gagal memuat laporan menu', 'error');
        }
    };


    const fetchPromo = async () => {
        try {
            const response = await api.post("/data", {
                collection: "promo",
                filter: {},
                sort: { name: 1 }
            });

            let tmpOptions = response.data.map(doc => ({
                id: doc._id,
                value: doc.name,
                label: doc.label,
                harga: doc.harga,
                item: doc.item,
                group: "promo"
            }));
            console.log(tmpOptions)
            setPromoOptions(tmpOptions);
        } catch (error) {
            console.error("Error fetching promo data: ", error);
        }
    };

    const fetchMerchandise = async () => {
        try {
            const response = await api.post("/data", {
                collection: "merchandise",
                filter: {},
                sort: { name: 1 }
            });

            let tmpOptions = response.data.map(doc => ({
                id: doc._id,
                value: doc.name,
                label: `${doc.name} Qty: ${doc.stok}`,
                harga: doc.harga,
                stok: doc.stok,
                group: "merch"
            }));

            setMerchOptions(tmpOptions);
            setMerch(response.data);
        } catch (error) {
            console.error("Error fetching merchandise data: ", error);
        }
    };

    useEffect(() => {
        fetchTables();
        fetchMerchandise();
        fetchPromo();
        fetchMember();
        fetchPriceOption();
    }, [refresh]);

    // useEffect(() => {
    //     if (visible && action === null) setItem({ qty: 1, harga: "", name: "" })
    // }, [visible, action])


    const filteredOptions =
        inputValue !== ""
            ? dataClient.filter((option) =>
                option.label.toLowerCase().includes(inputValue.toLowerCase())
            )
            : []; // Return an empty array if

    const createOption = (label) => ({
        label,
        value: label.toLowerCase().replace(/\W/g, ''),
    });

    // const isOptionUnique = (inputValue) => {
    //     // Check if the option already exists
    //     return !dataClient.some(
    //         (option) => option.label.toLowerCase().includes(inputValue.toLowerCase())
    //     );
    // };

    const handleCreate = async (inputValue) => {
        // (true);
        const newOption = createOption(inputValue);
        // (false);
        // setOptions((prev) => [...prev, newOption]);
        setClient(newOption);
    };
    const getCafe = async (table) => {
        if (!table?.cafeId) return;

        try {
            const response = await api.post("/data", {
                collection: "tableHistory",
                filter: {
                    _id: table?.cafeId
                },
            });

            if (response.data.length > 0) {
                setCafe(response.data[0]);
            }
        } catch (error) {
            console.error("Error fetching cafe data: ", error);
        }
    };



    useEffect(() => {
        if (edit && edit.cafeId) {  // Pastikan edit.cafeId memiliki nilai
            getCafe(edit)
        }

        else if (detail && detail.cafeId) {  // Pastikan edit.cafeId memiliki nilai
            getCafe(detail)
        }
    }, [edit, detail])


    useEffect(() => {
        console.log(visible, action)
        if (visible && action !== null) {
            var tmpDetail = Object.keys(detail).length > 0 ? detail : edit
            hitungHarga(tmpDetail, tmpDetail?.start, tmpDetail?.end, 0, 0, 0, true)
            setTypeDiscount(tmpDetail?.typeDiscount)
            setIsTax(tmpDetail?.tax !== undefined && tmpDetail?.tax !== 0)
            setIsService(tmpDetail?.service !== undefined || tmpDetail?.service !== "")
            setIsDiscount(tmpDetail?.discount !== undefined && tmpDetail?.discount !== 0)
            setDiscount(tmpDetail?.discount)
        }
    }, [visible, action])

    useEffect(() => {
        console.log(modal)
        if (modal) {
            hitungHarga(detail, detail?.start, detail?.end, 0, 0, 0, true)
            setTypeDiscount(detail?.typeDiscount)
            setIsTax(detail?.tax !== undefined && detail?.tax !== 0)
            setIsService(detail?.service !== undefined || detail?.service !== "")
            setIsDiscount(detail?.discount !== undefined && detail?.discount !== 0)
            setDiscount(detail?.discount)
        }

    }, [modal])

    const renderModal = () => {
        switch (action) {
            case "add":
                return <>
                    <CModalHeader>
                        <CModalTitle id="actionModal">Tambah Waiting List</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <CContainer>
                            {/* <ComponentToPrint ref={componentRef} /> */}
                            <CRow className="mb-3">
                                <CCol>
                                    <CFormLabel className="col-form-label">Customer</CFormLabel>
                                </CCol>
                                <CCol sm={10}>
                                    {/* <CFormInput type="text" onChange={(e) => setNama(e.target.value)} defaultValue={nama}
                                    readOnly={bookingId !== "" ? true : false}
                                    plainText={bookingId !== "" ? true : false} /> */}
                                    <ReactSelectCreatable
                                        isClearable
                                        value={client} // Match value in options
                                        options={filteredOptions}
                                        onInputChange={(value) => setInputValue(value)} // Track input value                                  
                                        onChange={(selectedOption) => {
                                            // setNomor(selectedOption?.nomor)
                                            console.log(selectedOption)
                                            setClient(selectedOption)
                                        }} // Only store the value
                                        placeholder="Input Nama Customer"
                                        // onCreateOption={handleCreate}
                                        // isValidNewOption={()=> true}
                                        styles={customStylesInput}
                                        noOptionsMessage={() => (inputValue === "" ? "Start typing to search..." : "No options available")}
                                        components={{ IndicatorSeparator: null }}
                                    />

                                </CCol>
                            </CRow>
                            <CRow className='mb-3'>
                                <CCol>
                                    <CFormLabel className="col-form-label">Nomor HP </CFormLabel>
                                </CCol>
                                <CCol sm={10}>
                                    <CFormInput type="text"
                                        value={client?.nomor !== undefined ? client?.nomor : nomor}
                                        onChange={(e) => {
                                            if (/^\d*$/.test(e.target.value)) setNomor(e.target.value)
                                        }}
                                        disabled={client?.nomor !== undefined}
                                        placeholder='Input Nomor HP'
                                        required />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-2 col-form-label">Pilih Waktu</CFormLabel>
                                <CCol sm="auto">
                                    <CFormInput type="time"
                                        placeholder={"Pilih Waktu"}
                                        // list="time_list"
                                        defaultValue={moment().add(1, "hours").startOf("hour").format("HH:mm")}
                                        onChange={(e) => setWaktu(e.target.value)}
                                    />
                                </CCol>
                            </CRow>
                        </CContainer>
                    </CModalBody>

                    <CModalFooter>
                        {!loading ? <CButton color="success" onClick={(e) => tambahCustomer(e)}>Tambah</CButton> : <CSpinner color="primary" className="float-end" variant="grow" />}
                    </CModalFooter>
                </>
            case "edit":
                var harga = 0;
                if (edit?.status === "AKTIF") harga = !isNaN(edit?.end) && edit?.end !== "" ?
                    hitungHarga(edit, edit?.start, edit?.end, edit?.harga)
                    : hitungHarga(edit, edit?.start, moment().format(), edit?.harga)
                // else if (action === "pay") harga = formatNumber(edit?.harga)
                else harga = hitungHarga(edit, edit?.start, edit?.end, edit?.rate, edit?.rate1)

                return <>
                    <CModalHeader>
                        <CModalTitle id="actionModal">Ubah Detail Order</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <CContainer>
                            <CRow className="align-items-start mb-2">
                                <CCol xs={4} sm={5} md={3}><b>Nama Customer </b></CCol>
                                <CCol xs="auto" sm={"auto"} md={"auto"}>:</CCol>
                                <CCol>{edit?.client?.name}</CCol>
                            </CRow>
                            <CRow className="align-items-start mb-2">
                                <CCol xs={4} sm={5} md={3}><b>Table </b></CCol>
                                <CCol xs="auto" sm={"auto"} md={"auto"}>:</CCol>
                                <CCol>{titleCase(edit?.tableName)}</CCol>
                            </CRow>
                            <CRow className="align-items-start mb-2">
                                <CCol xs={4} sm={5} md={3}><b>Jam Mulai </b></CCol>
                                <CCol xs="auto" sm={"auto"} md={"auto"}>:</CCol>
                                <CCol>{moment(edit?.start).format("dddd, DD MMMM YYYY HH:mm:ss")}</CCol>
                            </CRow>
                            <CRow className="align-items-start mb-2">
                                <CCol xs={4} sm={5} md={3}><b>Jam Selesai </b></CCol>
                                <CCol xs="auto" sm={"auto"} md={"auto"}>:</CCol>
                                <CCol>{moment(edit?.end).format("dddd, DD MMMM YYYY HH:mm:ss")}</CCol>
                            </CRow>
                        </CContainer>
                        <CContainer className='mt-3'>
                            <hr />
                            <h4 style={{ textAlign: "center" }}>Order List</h4>
                            <hr />
                            <CTable>
                                <CTableHead>
                                    <CTableRow>
                                        <CTableHeaderCell style={{ width: "110px" }}>Action</CTableHeaderCell>
                                        <CTableHeaderCell style={{ width: "100px" }}>Qty</CTableHeaderCell>
                                        <CTableHeaderCell style={{ width: "400px" }}>Item</CTableHeaderCell>
                                        <CTableHeaderCell style={{ width: "200px" }}>Harga</CTableHeaderCell>
                                        <CTableHeaderCell style={{ width: "200px" }}>Sub Total</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {/* {durasi > 0 &&
                                        <CTableRow>
                                            <CTableDataCell></CTableDataCell>
                                            <CTableDataCell>1x</CTableDataCell>
                                            <CTableDataCell>{`${durasi.hours()} JAM ${durasi.minutes()} MENIT`}</CTableDataCell>
                                            <CTableDataCell>{
                                                edit?.status === "AKTIF" ?
                                                    !isNaN(edit?.end) && edit?.end !== "" ?
                                                        formatNumber(hitungHarga(edit, edit?.start, edit?.end, edit?.harga))
                                                        : formatNumber(hitungHarga(edit, edit?.start, moment().format(), edit?.harga))
                                                    // else if (action === "pay") harga = formatNumber(edit?.harga)
                                                    : formatNumber(hitungHarga(edit, edit?.start, edit?.end, edit?.rate, edit?.rate1))}</CTableDataCell>
                                        </CTableRow>} */}
                                    {edit?.item?.map((item, idx) => {
                                        var itemCafe = item.hasOwnProperty("addOns")
                                        var totalAddOn = itemCafe ? item?.addOns?.reduce((total1, item1) => {
                                            return total1 + Number(item1.harga);
                                        }, 0) : 0
                                        var subTotal = ((Number(item?.harga) + Number(itemCafe ? totalAddOn : 0)) * (item?.qty ? item?.qty : 1))
                                        return (
                                            <CTableRow key={idx}>

                                                <CTableDataCell>
                                                    {(item?.isNew || item?.isEdit) && (
                                                        <CButton color='danger' className='me-1' onClick={() => {
                                                            var tmpOrder = { ...edit }
                                                            tmpOrder?.item.splice(idx, 1)
                                                            // // console.log(tmpOrder)
                                                            setEdit(tmpOrder)
                                                        }}>✗</CButton>
                                                    )}
                                                    {item?.isEdit && (
                                                        <>
                                                            <CButton color='info' onClick={(e) => {
                                                                var tmpOrder = { ...edit }
                                                                tmpOrder.item[idx] = {
                                                                    ...tmpOrder.item[idx],
                                                                    name: tmpOrder?.item[idx]?.name?.value,
                                                                    isEdit: false
                                                                };
                                                                setEdit(tmpOrder);
                                                                // updatePerItem(e, idx)
                                                            }}>✓</CButton>

                                                        </>

                                                    )}
                                                    {!item.isNew && !item?.isEdit && (
                                                        <>
                                                            <CButton color='danger' className='me-1' onClick={() => {
                                                                var tmpOrder = { ...edit }
                                                                tmpOrder?.item.splice(idx, 1)
                                                                // // console.log(tmpOrder)
                                                                setEdit(tmpOrder)
                                                            }}>✗</CButton>
                                                            <CButton color='warning' onClick={() => {
                                                                var tmpOrder = { ...edit }
                                                                tmpOrder.item[idx] = {
                                                                    ...tmpOrder.item[idx],
                                                                    name: { value: tmpOrder.item[idx]?.name, label: tmpOrder.item[idx]?.name, harga: tmpOrder.item[idx]?.harga },
                                                                    isEdit: true
                                                                };
                                                                setEdit(tmpOrder);
                                                            }}><CIcon icon={cilPencil} /></CButton>
                                                        </>

                                                    )}
                                                </CTableDataCell>
                                                {
                                                    item?.isNew || item?.isEdit ?
                                                        <>
                                                            <CTableDataCell><CFormInput type="number" min={1} value={item?.qty} onChange={(e) => {
                                                                var tmpOrder = { ...edit }
                                                                // console.log(e.target.value)
                                                                tmpOrder.item[idx] = { ...tmpOrder.item[idx], qty: e.target.value };
                                                                setEdit(tmpOrder)

                                                            }} /></CTableDataCell>
                                                            <CTableDataCell>
                                                                {!itemCafe ? <ReactSelectAsync
                                                                    defaultOptions
                                                                    loadOptions={loadOption}
                                                                    filterOption={filterOption}
                                                                    styles={customStyles}
                                                                    placeholder="Pilih Item"
                                                                    value={item?.name}
                                                                    menuPortalTarget={document.body}
                                                                    onChange={(selected) => {
                                                                        var tmpOrder = { ...edit };
                                                                        const promoTime = selected?.endTime !== undefined ? { endTime: selected?.endTime, duration: selected?.duration }
                                                                            : { duration: selected?.duration }
                                                                        tmpOrder.item[idx] = {
                                                                            ...tmpOrder.item[idx],
                                                                            ...selected,
                                                                            name: selected,
                                                                            // harga: selected?.harga,
                                                                            // sub: selected?.menu,
                                                                            // isPromo: selected?.duration ? true : false,
                                                                            // isPromo: false,
                                                                            // id: selected?._id,
                                                                            // ...promoTime
                                                                        };
                                                                        console.log(tmpOrder.item[idx])
                                                                        setEdit(tmpOrder);
                                                                    }}
                                                                    formatGroupLabel={formatGroupLabel}
                                                                    components={{
                                                                        GroupHeading: GroupHeading,
                                                                        Group: HideGroupChildren,
                                                                    }}
                                                                /> : item?.name?.label}
                                                                {item?.addOns && item?.addOns?.length > 0 && (
                                                                    <div className="mt-2">
                                                                        <strong>Add-ons:</strong>
                                                                        <ul className="mb-0">
                                                                            {item.addOns.map((addon, index) => (
                                                                                <li key={index} className="small">
                                                                                    {addon.name} (+Rp. {formatNumber(addon.harga)})
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>
                                                                )}
                                                            </CTableDataCell>
                                                            <CTableDataCell><CFormInput type="text" value={formatNumber(item?.harga)} onChange={(e) => {
                                                                var tmpOrder = { ...edit }
                                                                tmpOrder.item[idx] = { ...tmpOrder.item[idx], harga: e.target.value.replace(/,/g, "") };
                                                                setEdit(tmpOrder)
                                                            }} /></CTableDataCell>
                                                            <CTableDataCell><CFormInput type="text" value={formatNumber(Number(item?.harga) * (item?.qty ? Number(item?.qty) : 1))} readOnly plainText /></CTableDataCell>
                                                        </> :
                                                        <>
                                                            <CTableDataCell>{item?.qty}x</CTableDataCell>
                                                            <CTableDataCell>
                                                                {item?.name}
                                                                {item?.addOns && item?.addOns?.length > 0 && (
                                                                    <div className="mt-2">
                                                                        <strong>Add-ons:</strong>
                                                                        <ul className="mb-0">
                                                                            {item.addOns.map((addon, index) => (
                                                                                <li key={index} className="small">
                                                                                    {addon.name} (+Rp. {formatNumber(addon.harga)})
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>
                                                                )}
                                                                <CInputGroup className='mt-3'> <strong style={{ marginTop: "7px", marginRight: "10px" }}>{
                                                                    item?.tipe === "durasi" && item?.duration === "00:00" ? "Durasi:" : "Note:"
                                                                } </strong>
                                                                    <CFormInput value={item?.note} onChange={(e) => {
                                                                        var tmpItem = { ...edit }
                                                                        tmpItem.item[idx].note = e.target.value
                                                                        setEdit(tmpItem)
                                                                    }}></CFormInput>
                                                                </CInputGroup>
                                                            </CTableDataCell>
                                                            <CTableDataCell>{formatNumber(item?.harga)}</CTableDataCell>
                                                            <CTableDataCell>{formatNumber(subTotal)}</CTableDataCell>
                                                        </>
                                                }

                                            </CTableRow>
                                        )
                                    })}
                                    {
                                        tmpCafe?.item.map((item, idx) => {
                                            var totalAddOn = item?.addOns ? item?.addOns?.reduce((total1, item1) => {
                                                return total1 + Number(item1.harga);
                                            }, 0) : 0
                                            return (
                                                <CTableRow key={idx}>
                                                    <CTableDataCell>
                                                        <CButton color='danger' className='me-1' onClick={() => {
                                                            var tempCafe = { ...tmpCafe }
                                                            tempCafe?.item.splice(idx, 1)
                                                            setTmpCafe(tempCafe)
                                                        }}>✗</CButton>
                                                    </CTableDataCell>
                                                    {detail?.status === "AKTIF" && <CTableDataCell>
                                                        <CFormCheck id={`data-cafe-${idx}`}
                                                            checked={item?.statusPrint}
                                                            onChange={(e) => {
                                                                var tempCafe = { ...tmpCafe }
                                                                tempCafe.item[idx].statusPrint = e.target.checked
                                                                setTmpCafe(tempCafe)
                                                            }}
                                                        /></CTableDataCell>}
                                                    <CTableDataCell>
                                                        <CFormInput type="number" min={1} defaultValue={item?.qty} onChange={(e) => {
                                                            var tempCafe = { ...tmpCafe }
                                                            tempCafe.item[idx].qty = e.target.value
                                                            setTmpCafe(tempCafe)
                                                        }} /></CTableDataCell>
                                                    <CTableDataCell>
                                                        {item?.name}
                                                        {item?.addOns && item?.addOns?.length > 0 && (
                                                            <div className="mt-2">
                                                                <strong>Add-ons:</strong>
                                                                <ul className="mb-0">
                                                                    {item.addOns.map((addon, index) => (
                                                                        <li key={index} className="small">
                                                                            {addon.name} (+Rp. {formatNumber(addon.harga)})
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}
                                                        <CInputGroup className='mt-3'> <strong style={{ marginTop: "7px", marginRight: "10px" }}>Note: </strong>
                                                            {action === "detail" && detail?.status === "AKTIF" ? <CFormInput value={item?.note} onChange={(e) => {
                                                                var tmpItem = { ...tmpCafe }
                                                                tmpItem.item[idx].note = e.target.value
                                                                setTmpCafe(tmpItem)
                                                            }}></CFormInput> : item.note}
                                                        </CInputGroup>
                                                    </CTableDataCell>
                                                    <CTableDataCell>
                                                        {formatNumber(Number(item?.harga))}
                                                    </CTableDataCell>
                                                    <CTableDataCell>
                                                        {formatNumber((Number(item?.harga) + Number(totalAddOn)) * Number(item?.qty))}
                                                    </CTableDataCell>
                                                </CTableRow>
                                            )
                                        })
                                    }
                                    {edit?.item?.some((data) => data?.tipe === undefined) && <CTableRow>
                                        <CTableDataCell colSpan={5} ><CButton color='success' onClick={() => {
                                            var tmpOrder = { ...edit }
                                            tmpOrder?.item?.push({ qty: 1, harga: 0, name: "", isNew: true })
                                            setEdit(tmpOrder)
                                        }}>+</CButton></CTableDataCell>
                                    </CTableRow>}
                                    <CTableRow>
                                        <CTableDataCell style={{ textAlign: "right" }} colSpan={4}><b>Total</b></CTableDataCell>
                                        <CTableDataCell>
                                            {formatNumber(hitungSubTotal(edit))}
                                        </CTableDataCell>

                                    </CTableRow>

                                    <CTableRow>
                                        <CTableDataCell colSpan={3} style={{ textAlign: "right" }} >
                                            <CFormCheck inline id="service" style={{ marginRight: "10px" }}
                                                checked={isDiscount}
                                                onChange={(e) => {
                                                    setIsDiscount(e.target.checked)
                                                }}
                                            />
                                            <b>Discount</b></CTableDataCell>
                                        <CTableDataCell>
                                            <CInputGroup>
                                                {!typeDiscount && <span className="input-group-text" id="basic-addon1" onClick={() => setTypeDiscount(!typeDiscount)}>
                                                    Rp.</span>}
                                                <CFormInput type='text' value={formatNumber(edit?.discount)} onChange={(e) => { setEdit({ ...edit, discount: e.target.value.replace(/,/g, "") }) }} disabled={!isDiscount} />
                                                {typeDiscount && <span className="input-group-text" id="basic-addon1" onClick={() => setTypeDiscount(!typeDiscount)}>
                                                    %</span>}
                                            </CInputGroup>

                                        </CTableDataCell>
                                        <CTableDataCell>{(() => {
                                            let harga = 0;
                                            var orderTotal = tmpCafe?.item.reduce((total, item) => {
                                                var totalAddOn = item?.addOns ? item?.addOns?.reduce((total1, item1) => {
                                                    return total1 + Number(item1.harga);
                                                }, 0) : 0
                                                return total + totalAddOn + Number(item.harga * item.qty);
                                            }, 0)
                                            harga += edit?.item?.reduce((total, item) => {
                                                const totalAddOn = item?.addOns
                                                    ? item?.addOns?.reduce((total1, item1) => total1 + Number(item1.harga), 0)
                                                    : 0;

                                                return item?.addOns
                                                    ? total + ((Number(item.harga) + totalAddOn) * item.qty)
                                                    : total
                                            }, 0);
                                            harga += orderTotal
                                            var diskon = isDiscount ? (typeDiscount ? (harga * edit?.discount / 100) : edit?.discount) : 0
                                            return formatNumber(diskon);
                                        })()}</CTableDataCell>
                                    </CTableRow>
                                    <CTableRow>
                                        <CTableDataCell colSpan={4} style={{ textAlign: "right" }} >
                                            <CFormCheck inline id="tax" style={{ marginRight: "10px" }}
                                                checked={isTax}
                                                onChange={(e) => {
                                                    setIsTax(e.target.checked)
                                                }}
                                            />
                                            <b>PB1 {<input type='number' min={0} max={20} value={edit?.tax < 1 && edit?.tax > 0 ? edit?.tax * 100 : edit?.tax} onChange={(e) =>
                                                setEdit({ ...edit, tax: e.target.value })} />} %</b></CTableDataCell>
                                        <CTableDataCell>{isTax ? formatNumber(hitungOrder(edit) * (edit?.tax < 1 && edit?.tax > 0 ? edit?.tax : edit?.tax / 100)) : 0}</CTableDataCell>
                                    </CTableRow>
                                    <CTableRow>
                                        <CTableDataCell style={{ textAlign: "right" }} colSpan={4}><b>Grand Total</b></CTableDataCell>
                                        <CTableDataCell>{formatNumber(hitungGrandTotal(edit))}</CTableDataCell>
                                    </CTableRow>
                                </CTableBody>
                            </CTable>
                        </CContainer>
                        <CModalFooter>
                            <>
                                {!loading ? <CButton color="success" onClick={(e) => updateOrder(e)}>Update Order</CButton>
                                    : <CSpinner color="primary" className="float-end" variant="grow" />}
                                {/* {!loading ? <CButton color="warning" onClick={(e) => {
                                    // sessionStorage.setItem("cartItems", JSON.stringify(detail?.item?.filter((item) => item.hasOwnProperty("addOns"))));
                                    sessionStorage.setItem("cartItems", JSON.stringify([]))
                                    navigate("/order/add", { state: { table: edit, cafe: cafe, action: "detail", tmpTable: edit } })
                                }}>Tambah Order Cafe</CButton> : <CSpinner color="primary" className="float-end" variant="grow" />} */}
                                <CButton color="danger" onClick={() => setModal(false)}>Close</CButton>
                            </>
                        </CModalFooter>
                    </CModalBody>
                </>
            case "editCafe":
                return <>
                    <CModalHeader>
                        <CModalTitle id="actionModal">Ubah Order</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <CContainer>
                            <CRow className='mb-3'>
                                <CFormLabel className="col-sm-3 col-form-label">Pesanan dibuat tanggal </CFormLabel>
                                <CCol>
                                    <CFormInput type="text"
                                        value={moment(createdAt).format("dddd, DD MMMM YYYY HH:mm:ss")}
                                        plainText
                                    />
                                </CCol>
                            </CRow>
                            <CRow className='mb-3'>
                                <CFormLabel className="col-sm-3 col-form-label">Nama Customer </CFormLabel>
                                <CCol>
                                    <CFormInput type="text"
                                        value={client}
                                        plainText
                                    />
                                </CCol>
                            </CRow>
                            <CRow className='mb-3'>
                                <CFormLabel className="col-sm-3 col-form-label">Tipe Order</CFormLabel>
                                <CCol>
                                    <CFormInput type="text"
                                        value={titleCase(tipe) + " Bill"}
                                        plainText
                                    />
                                </CCol>
                            </CRow>
                            <CRow className='mb-3'>
                                <CFormLabel className="col-sm-3 col-form-label">Nama Operator</CFormLabel>
                                <CCol>
                                    <CFormInput type="text"
                                        value={cashier}
                                        plainText />
                                </CCol>
                            </CRow>
                            <CRow className='mb-3'>
                                <CFormLabel className="col-sm-3 col-form-label">Status</CFormLabel>
                                <CCol>
                                    <CInputGroup>
                                        {editStatus ? <>
                                            <CFormSelect value={status} onChange={(e) => setStatus(e.target.value)}>
                                                <option value="on_process">ON PROCESS</option>
                                                <option value="ready">READY</option>
                                                <option value="payment">PAYMENT</option>
                                                <option value="close">CLOSE</option>
                                            </CFormSelect>
                                            <CButton color='info' onClick={(e) => {
                                                updateStatus()
                                            }}>✓</CButton>
                                        </>
                                            :
                                            <>
                                                <input type="text"
                                                    value={status.replace("_", " ").toUpperCase()}
                                                    readOnly
                                                    className='no-border' />
                                                <CButton color='warning' className='ms-2' onClick={() => {
                                                    setEditStatus(true)
                                                }}><CIcon icon={cilPencil} /></CButton>
                                            </>}
                                    </CInputGroup>
                                </CCol>
                            </CRow>
                            <CContainer className='mt-3'>
                                <hr />
                                <h4 style={{ textAlign: "center" }}>Order List</h4>
                                <hr />
                                <CTable>
                                    <CTableHead>
                                        <CTableRow>
                                            <CTableHeaderCell style={{ width: "60px" }}>Qty</CTableHeaderCell>
                                            <CTableHeaderCell style={{ width: "25rem" }}>Item</CTableHeaderCell>
                                            <CTableHeaderCell style={{ width: "10rem" }}>Harga</CTableHeaderCell>
                                            <CTableHeaderCell style={{ width: "10rem" }}>Sub Total</CTableHeaderCell>
                                        </CTableRow>
                                    </CTableHead>
                                    <CTableBody>
                                        {edit?.item?.map((item, idx) => {
                                            // // console.log(item)
                                            totalHarga = edit?.item?.reduce((total, item) => {
                                                var totalAddOn = item?.addOns ? item?.addOns?.reduce((total1, item1) => {
                                                    return total1 + Number(item1.harga);
                                                }, 0) : 0
                                                return total + totalAddOn + Number(item.harga * item.qty);
                                            }, 0)
                                            var totalAddOn = item?.addOns ? item?.addOns?.reduce((total1, item1) => {
                                                return total1 + Number(item1.harga);
                                            }, 0) : 0

                                            // setTotal(tmpTotal)
                                            var isAdmin = currentUser?.email === "owner@twinpool.com"
                                            return (
                                                <CTableRow key={idx}>
                                                    <CTableDataCell>
                                                        <CFormInput type="number" value={item?.qty} readOnly plainText />
                                                    </CTableDataCell>

                                                    <CTableDataCell>
                                                        <CFormInput type="text" value={item?.name} readOnly plainText />
                                                        {item.addOns && item.addOns.length > 0 && (
                                                            <div className="mt-2">
                                                                <strong>Add-ons:</strong>
                                                                <ul className="mb-0">
                                                                    {item.addOns.map((addon, index) => (
                                                                        <li key={index} className="small">
                                                                            {addon.name} (+Rp. {formatNumber(addon.harga)})
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}
                                                        <CInputGroup className='mt-3'> <strong style={{ marginTop: "7px", marginRight: "10px" }}>Note: </strong>
                                                            <CFormInput value={item?.note} onChange={(e) => {
                                                                var tmpItem = { ...item }
                                                                tmpItem.item[idx].note = e.target.value
                                                                setEdit(tmpItem)
                                                            }}></CFormInput>
                                                        </CInputGroup>
                                                    </CTableDataCell>

                                                    <CTableDataCell><CFormInput type="text"
                                                        value={formatNumber(Number(item?.harga) + Number(totalAddOn))}
                                                        onChange={(e) => {
                                                            var tmpItem = { ...edit }
                                                            tmpItem.item[idx].harga = e.target.value.replace(/,/g, "")
                                                            setEdit(tmpItem)
                                                        }}
                                                        readOnly={!isAdmin} plainText={!isAdmin}
                                                    /></CTableDataCell>
                                                    <CTableDataCell><CFormInput type="text" value={formatNumber((Number(item?.harga) + Number(totalAddOn)) * (item?.qty ? item?.qty : 1))} readOnly plainText /></CTableDataCell>


                                                </CTableRow>
                                            )
                                        })}

                                        <CTableRow>
                                            <CTableDataCell colSpan={3} style={{ textAlign: "right" }}><b>Total</b></CTableDataCell>
                                            <CTableDataCell>{formatNumber(totalHarga)}</CTableDataCell>
                                        </CTableRow>
                                        <CTableRow>
                                            <CTableDataCell colSpan={3} style={{ textAlign: "right" }}><b>Discount</b></CTableDataCell>
                                            <CTableDataCell>{formatNumber(subTotal)}</CTableDataCell>
                                        </CTableRow>

                                        <CTableRow>
                                            <CTableDataCell colSpan={3} style={{ textAlign: "right" }} >
                                                <b>Service Charge ({edit?.service * 100}%)</b></CTableDataCell>
                                            <CTableDataCell>{formatNumber(Math.ceil(totalHarga * (edit?.service)))}</CTableDataCell>
                                        </CTableRow>
                                        <CTableRow>
                                            <CTableDataCell colSpan={3} style={{ textAlign: "right" }} >
                                                <b>PB1 ({edit?.tax * 100}%)</b></CTableDataCell>
                                            <CTableDataCell>{formatNumber(Math.ceil(totalHarga * (edit?.tax)))}</CTableDataCell>
                                        </CTableRow>
                                        <CTableRow>
                                            <CTableDataCell colSpan={3} style={{ textAlign: "right" }} >
                                                <b>Discount</b></CTableDataCell>
                                            <CTableDataCell>{formatNumber(edit?.discount)}</CTableDataCell>
                                        </CTableRow>
                                        <CTableRow>
                                            <CTableDataCell colSpan={3} style={{ textAlign: "right" }} ><b>Grand Total</b></CTableDataCell>
                                            <CTableDataCell>{formatNumber((isDiscount ? (typeDiscount ? totalHarga * (1 - edit?.discount / 100) : totalHarga - edit?.discount) : totalHarga)
                                                + Math.ceil((isDiscount ? (typeDiscount ? totalHarga * (1 - edit?.discount / 100) : totalHarga - edit?.discount) : totalHarga) * (edit?.tax + edit?.service)))}</CTableDataCell>
                                        </CTableRow>
                                    </CTableBody>
                                </CTable>
                            </CContainer>
                        </CContainer>
                    </CModalBody>

                    <CModalFooter>
                        {currentUser?.email === "owner@twinpool.com" &&
                            <CButton color="warning" onClick={(e) => {
                                updateHargaCafe(e)
                            }}>
                                Ubah Harga
                            </CButton>}
                        <CButton color="success" onClick={(e) => {
                            sessionStorage.setItem('cartItems', JSON.stringify(edit?.item))
                            sessionStorage.setItem('tmpCartItems', JSON.stringify(edit?.item))
                            navigate("/cafe/order/edit", { state: edit?.id })
                        }}>Ubah Order</CButton>
                    </CModalFooter>
                </>
            case "editMerch":
                return <>
                    <CModalHeader>
                        <CModalTitle id="actionModal">Ubah Order</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <CContainer>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-3 col-form-label">Nama Customer</CFormLabel>
                                <CCol sm={9}>
                                    <CFormInput type="text" value={edit?.client?.name} readOnly plainText />
                                </CCol>
                            </CRow>

                            <CRow className='mb-3'>
                                <hr />
                                <h4 style={{ textAlign: "center" }}>List Item</h4>
                                <hr />
                                <CTable>
                                    <CTableHead>
                                        <CTableRow>
                                            <CTableHeaderCell style={{ width: "50px" }}>Action</CTableHeaderCell>
                                            <CTableHeaderCell style={{ width: "100px" }}>Qty</CTableHeaderCell>
                                            <CTableHeaderCell style={{ width: "300px" }}>Item</CTableHeaderCell>
                                            <CTableHeaderCell>Sub Total</CTableHeaderCell>
                                        </CTableRow>
                                    </CTableHead>
                                    <CTableBody>
                                        {edit?.item?.map((data, idx) => {
                                            return (
                                                <CTableRow>
                                                    <CTableDataCell><CButton color='danger' onClick={() => {
                                                        var tmpItem = [...edit?.item]
                                                        tmpItem.splice(idx, 1)
                                                        // console.log(tmpItem)
                                                        setEdit(tmpItem)
                                                    }}>✗</CButton></CTableDataCell>
                                                    <CTableDataCell><CFormInput type="number" value={data?.qty} onChange={(e) => {
                                                        var tmpItem = [...edit?.item]
                                                        // // console.log(JSON.parse(e.target.value))
                                                        tmpItem[idx].qty = e.target.value
                                                        setEdit(tmpItem)
                                                    }} /></CTableDataCell>
                                                    <CTableDataCell>
                                                        <ReactSelectAsync
                                                            defaultOptions
                                                            styles={customStyles}
                                                            placeholder="Pilih Item"
                                                            value={createOption(data?.name)}
                                                            loadOptions={loadOption}
                                                            filterOption={filterOption}
                                                            menuPortalTarget={document.body}
                                                            onChange={(selected) => {
                                                                var tmpItem = [...edit?.item];
                                                                tmpItem[idx].name = selected
                                                                tmpItem[idx].harga = selected?.harga
                                                                tmpItem[idx].id = selected?.id
                                                                // console.log(selected)
                                                                setEdit(tmpItem);
                                                            }}
                                                            formatGroupLabel={formatGroupLabel}
                                                            components={{
                                                                GroupHeading: GroupHeading,
                                                                Group: HideGroupChildren,
                                                            }}
                                                        />
                                                        {/* <option value="" disabled>Pilih Item</option>
                                                {menu.map((menu) => {
                                                    return (<option key={menu?.name} value={JSON.stringify({ name: menu?.name, harga: menu?.harga })}>
                                                        {menu?.name}
                                                    </option>)
                                                })} */}
                                                    </CTableDataCell>
                                                    <CTableDataCell><CFormInput type="text" value={formatNumber(data?.harga * (data?.qty ? data?.qty : 1))} readOnly plainText /></CTableDataCell>
                                                </CTableRow>
                                            )
                                        })}
                                        <CTableRow>
                                            <CTableDataCell colSpan={5} ><CButton color='success' onClick={() => {
                                                var tmpItem = [...edit?.item]
                                                tmpItem.push({ qty: 1, harga: 0, name: "", id: "" })
                                                setItem(tmpItem)
                                            }}>+</CButton></CTableDataCell>
                                        </CTableRow>
                                        <CTableRow>
                                            <CTableDataCell colSpan={3} style={{ textAlign: "right" }}><b>Total</b></CTableDataCell>
                                            <CTableDataCell>{
                                                formatNumber(edit?.item?.reduce((total, item) => {
                                                    return total + Number(item.harga * item.qty);
                                                }, 0))
                                            }</CTableDataCell>
                                        </CTableRow>
                                    </CTableBody>
                                </CTable>
                            </CRow>
                        </CContainer>
                    </CModalBody>

                    <CModalFooter>
                        {!loading ? <CButton color="success" onClick={(e) => { tambahOrder(e) }}>Update</CButton>
                            : <CSpinner color="primary" className="float-end" variant="grow" />}
                    </CModalFooter>
                </>

            case "order":
                return <>
                    <CModalHeader>
                        <CModalTitle id="actionModal">Tambah Order - {detail?.name}</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <CContainer className='mt-3'>
                            <CTable>
                                <CTableHead>
                                    <CTableRow>
                                        <CTableHeaderCell style={{ width: "50px" }}>Action</CTableHeaderCell>
                                        <CTableHeaderCell style={{ width: "100px" }}>Qty</CTableHeaderCell>
                                        <CTableHeaderCell style={{ width: "300px" }}>Item</CTableHeaderCell>
                                        <CTableHeaderCell>Harga</CTableHeaderCell>
                                        <CTableHeaderCell>Sub Total</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {order.map((data, idx) => {
                                        const selectedValue = data?.name ? JSON.stringify({ name: data?.name, harga: data?.harga }) : "";
                                        return (<CTableRow>
                                            <CTableDataCell><CButton color='danger' onClick={() => {
                                                var tmpOrder = [...order]
                                                tmpOrder.splice(idx, 1)
                                                // // console.log(tmpOrder)
                                                setOrder(tmpOrder)
                                            }}>✗</CButton></CTableDataCell>
                                            <CTableDataCell><CFormInput type="number" min={1} value={data?.qty} onChange={(e) => {
                                                var tmpOrder = [...order]
                                                // // console.log(JSON.parse(e.target.value))
                                                tmpOrder[idx].qty = e.target.value
                                                setOrder(tmpOrder)
                                            }} /></CTableDataCell>
                                            <CTableDataCell>
                                                <Select
                                                    styles={customStyles}
                                                    placeholder="Pilih Item"
                                                    value={data?.name}
                                                    options={menuOptions}
                                                    menuPortalTarget={document.body}
                                                    onChange={(selected) => {
                                                        var tmpItem = [...order];
                                                        tmpItem[idx].name = selected
                                                        tmpItem[idx].harga = selected?.harga
                                                        // // console.log(selected)
                                                        setOrder(tmpItem);
                                                    }} />
                                            </CTableDataCell>
                                            <CTableDataCell><CFormInput type="text" value={formatNumber(data?.harga)} readOnly plainText /></CTableDataCell>
                                            <CTableDataCell><CFormInput type="text" value={formatNumber(data?.harga * (data?.qty ? data?.qty : 1))} readOnly plainText /></CTableDataCell>
                                        </CTableRow>)
                                    })}
                                    <CTableRow>
                                        <CTableDataCell colSpan={5} ><CButton color='success' onClick={() => {
                                            var tmpOrder = [...order]
                                            tmpOrder.push({ qty: 1, harga: 0, name: "" })
                                            setOrder(tmpOrder)
                                        }}>+</CButton></CTableDataCell>
                                    </CTableRow>
                                    <CTableRow>
                                        <CTableDataCell colSpan={4} style={{ textAlign: "right" }}><b>Total</b></CTableDataCell>
                                        <CTableDataCell>{
                                            formatNumber(order?.reduce((total, item) => {
                                                return total + Number(item.harga * item.qty);
                                            }, 0))
                                        }</CTableDataCell>
                                    </CTableRow>
                                </CTableBody>
                            </CTable>
                        </CContainer>
                    </CModalBody >

                    <CModalFooter>
                        {!loading ? <CButton color="success" onClick={(e) => updateOrder(e)}>Update Order</CButton>
                            : <CSpinner color="primary" className="float-end" variant="grow" />}
                    </CModalFooter>
                </>
            case "detailMeja":
                const pauseTimes = detail?.pauseTimes || [];

                // Calculate total paused duration in milliseconds
                const totalPauseDurationMs = pauseTimes.reduce((total, pauseEntry) => {
                    const pauseStart = moment(pauseEntry.pause);
                    const pauseEnd = pauseEntry.resume ? moment(pauseEntry.resume) : moment(); // Use current time if not resumed
                    return total + moment.duration(pauseEnd.diff(pauseStart)).asMilliseconds();
                }, 0);

                // Convert the total duration to a moment.duration object
                const totalPauseDuration = moment.duration(totalPauseDurationMs);

                // Extract hours and minutes
                const jam = totalPauseDuration.hours();
                const menit = totalPauseDuration.minutes();

                return <>
                    <CModalHeader>
                        <CModalTitle id="actionModal">Detail Meja</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <CContainer>
                            {/* <ComponentToPrint ref={componentRef} /> */}
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-3 col-form-label">Customer</CFormLabel>
                                <CCol sm={9}>
                                    <CFormInput type="text" defaultValue={detail?.client?.name} readOnly plainText />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-3 col-form-label">Table</CFormLabel>
                                <CCol sm={9}>
                                    {changeTable === "" ?
                                        <>
                                            {detail?.name}
                                            <CButton color="warning" className='ms-3' onClick={() => pindahTable()}>Pindah</CButton>
                                        </>
                                        : <CInputGroup>
                                            <CFormSelect value={changeTable} onChange={(e) => setChangeTable(e.target.value)}>
                                                <option value="" disabled>Pilih Table</option>
                                                {data.map((table) => {
                                                    if (table.status === "KOSONG")
                                                        return (<option key={table._id} value={table._id}>
                                                            {table.name}
                                                        </option>)
                                                })}</CFormSelect>
                                            <CButton color="danger" style={{ color: "white" }} onClick={() => setChangeTable("")}>x</CButton>
                                        </CInputGroup>
                                    }
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-3 col-form-label">Total Durasi Pause</CFormLabel>
                                <CCol sm={9}>
                                    <b>{`${jam} JAM ${menit} MENIT`}</b>
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-3 col-form-label">Timer</CFormLabel>
                                <CCol sm="auto">
                                    {!usePromo ? <CFormInput type="text" value={`${detail?.end ?
                                        hitungDurasi(detail, moment().format(), detail?.end) + (hours ? " +" + (hours + " JAM " + minutes + " MENIT") : "") :
                                        "00:00" + (hours ? " +" + (hours + " JAM " + minutes + " MENIT") : "")}`} readOnly plainText />
                                        :
                                        <CFormInput type="text" value={`${promo?.duration?.split(":")[0] ? promo?.duration?.split(":")[0] : "0"} JAM ${promo?.duration?.split(":")[1] ? Number(promo?.duration?.split(":")[1]) > 0 ? promo?.duration?.split(":")[1] : promo?.duration?.split(":")[1].slice(0, 1) : "0"} MENIT`} plainText />
                                    }
                                </CCol>
                            </CRow>
                            {detail?.start && <>
                                <CRow className='mb-3'>
                                    <CFormLabel className="col-sm-3 col-form-label">Pilih Perintah</CFormLabel>
                                    <CCol>
                                        <CFormSelect onChange={(e) => setTableControl(e.target.value)}>
                                            <option value="durasi">Ubah Durasi</option>
                                            <option value="waktu">Ubah Waktu</option>
                                        </CFormSelect>
                                    </CCol>
                                </CRow>
                                {tableControl === "durasi" ?
                                    <CRow className="mb-3">
                                        <CFormLabel className="col-sm-3 col-form-label">Set Durasi</CFormLabel>
                                        <CCol>
                                            <CInputGroup>
                                                <CFormInput type="number" value={hours} onChange={handleHoursChange} style={{ width: "20px" }} />
                                                <CInputGroupText><b>JAM</b></CInputGroupText>
                                                <CFormInput type="number" value={minutes} onChange={handleMinutesChange} />
                                                <CInputGroupText><b>MENIT</b></CInputGroupText>
                                            </CInputGroup>
                                        </CCol>
                                    </CRow> : <CRow className="mb-3">
                                        <CFormLabel className="col-sm-3 col-form-label">Pilih Waktu</CFormLabel>
                                        <CCol sm="auto">
                                            <CFormInput type="time"
                                                placeholder={"Pilih Waktu"}
                                                // list="time_list"
                                                defaultValue={moment().add(1, "hours").startOf("hour").format("HH:mm")}
                                                onChange={(e) => setWaktu(e.target.value)}
                                            />
                                        </CCol>
                                    </CRow>}
                            </>

                            }
                        </CContainer>
                    </CModalBody>
                    <CModalFooter>
                        {detail?.end !== "" && (!loading ? <CButton color="danger" onClick={(e) => { deleteTimer() }}>Hapus Timer</CButton>
                            : <CSpinner color="primary" className="float-end" variant="grow" />)}
                        {(detail?.start || changeTable !== "") && <CButton color="success" onClick={(e) => { updateTable() }}>Update</CButton>}
                        <CButton color="warning" onClick={(e) => {
                            setVisible(false)
                        }}>Close</CButton>
                    </CModalFooter>
                </>

            case "resume":
                return <>
                    <CModalHeader>
                        <CModalTitle id="actionModal">Resume Table</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <CContainer>
                            <CRow className="mb-3">
                                <CCol>
                                    <CFormLabel className="col-form-label">Customer</CFormLabel>
                                </CCol>
                                <CCol sm={9}>
                                    {/* <CFormInput type="text" onChange={(e) => setNama(e.target.value)} defaultValue={nama}
                                    readOnly={bookingId !== "" ? true : false}
                                    plainText={bookingId !== "" ? true : false} /> */}
                                    <ReactSelectCreatable
                                        isClearable
                                        value={client} // Match value in options
                                        options={filteredOptions}
                                        onInputChange={(value) => setInputValue(value)} // Track input value                                  
                                        onChange={(selectedOption) => {
                                            // setNomor(selectedOption?.nomor)
                                            setClient(selectedOption)
                                        }} // Only store the value
                                        placeholder="Input Nama Customer"
                                        // onCreateOption={handleCreate}
                                        // isValidNewOption={()=> true}
                                        styles={customStylesInput}
                                        noOptionsMessage={() => (inputValue === "" ? "Start typing to search..." : "No options available")}
                                        components={{ IndicatorSeparator: null }}
                                    />

                                </CCol>
                            </CRow>
                            <CRow className='mb-3'>
                                <CCol>
                                    <CFormLabel className="col-form-label">Nomor HP </CFormLabel>
                                </CCol>
                                <CCol sm={9}>
                                    <CFormInput type="text"
                                        value={client?.nomor !== undefined ? client?.nomor : nomor}
                                        onChange={(e) => {
                                            if (/^\d*$/.test(e.target.value)) setNomor(e.target.value)
                                        }}
                                        disabled={client?.nomor !== undefined && client?.nomor !== ""}
                                        placeholder='Input Nomor HP'
                                        required />
                                </CCol>
                            </CRow>

                            <CRow className="mb-3">
                                <CCol>
                                    <CFormLabel className="col-form-label">Table</CFormLabel>
                                </CCol>
                                <CCol sm={9}>
                                    {meja === "" ?
                                        <CFormInput type="text" value={detail?.name}
                                            readOnly={true}
                                            plainText={true} /> :
                                        <CFormSelect defaultValue={meja} onChange={(e) => setMeja(e.target.value)}>
                                            <option value="" disabled>Pilih Table</option>
                                            {data.map((table) => {
                                                if (table.status === "KOSONG")
                                                    return (<option key={table._id} value={table._id}>
                                                        {table.name}
                                                    </option>)
                                            })}
                                        </CFormSelect>}
                                </CCol>
                            </CRow>
                        </CContainer>
                    </CModalBody >
                    <CModalFooter>
                        {!loading ? <CButton color="success" onClick={(e) => resume(e)}>Resume</CButton>
                            : <CSpinner color="primary" className="float-end" variant="grow" />}
                    </CModalFooter>
                </>
            // case "pay":
            //     var harga = detail?.status === "AKTIF" ?
            //         !isNaN(detail?.end) && detail?.end !== "" ?
            //             formatNumber(hitungHarga(detail, detail?.start, detail?.end, detail?.harga))
            //             : formatNumber(hitungHarga(detail, detail?.start, moment().format(), detail?.harga))
            //         // else if (action === "pay") harga = formatNumber(detail?.harga)
            //         : formatNumber(hitungHarga(detail, detail?.start, detail?.end, detail?.rate, detail?.rate1))
            //     return <>
            //         <CModalHeader>
            //             <CModalTitle id="actionModal">{action === "detail" ? "Detail Order" : "Detail Pembayaran"}</CModalTitle>
            //         </CModalHeader>
            //         <CModalBody>
            //             <CContainer>
            //                 <CRow className='mb-3'>
            //                     <CFormLabel className="col-sm-3 col-form-label">Pesanan dibuat tanggal </CFormLabel>
            //                     <CCol>
            //                         <CFormInput type="text"
            //                             value={moment(detail?.createdAt).format("dddd, DD MMMM YYYY HH:mm:ss")}
            //                             plainText
            //                         />
            //                     </CCol>
            //                 </CRow>
            //                 <CRow className='mb-3'>
            //                     <CFormLabel className="col-sm-3 col-form-label">Nama Customer </CFormLabel>
            //                     <CCol>
            //                         <CFormInput type="text"
            //                             value={detail?.client?.name}
            //                             plainText
            //                         />
            //                     </CCol>
            //                 </CRow>
            //                 <CRow className='mb-3'>
            //                     <CFormLabel className="col-sm-3 col-form-label">Tipe Order</CFormLabel>
            //                     <CCol>
            //                         <CFormInput type="text"
            //                             value={titleCase(detail?.tipe) + " Bill"}
            //                             plainText
            //                         />
            //                     </CCol>
            //                 </CRow>
            //                 <CRow className='mb-3'>
            //                     <CFormLabel className="col-sm-3 col-form-label">Nama Operator</CFormLabel>
            //                     <CCol>
            //                         <CFormInput type="text"
            //                             value={detail?.cashier}
            //                             plainText />
            //                     </CCol>
            //                 </CRow>
            //             </CContainer>
            //             <CContainer className='mt-3'>
            //                 <hr />
            //                 <h4 style={{ textAlign: "center" }}>Order List</h4>
            //                 <hr />
            //                 <CTable>
            //                     <CTableHead>
            //                         <CTableRow>
            //                             <CTableHeaderCell style={{ width: "100px" }}>Qty</CTableHeaderCell>
            //                             <CTableHeaderCell style={{ width: "400px" }}>Item</CTableHeaderCell>
            //                             {/* <CTableHeaderCell>Harga</CTableHeaderCell> */}
            //                             <CTableHeaderCell>Sub Total</CTableHeaderCell>
            //                         </CTableRow>
            //                     </CTableHead>
            //                     <CTableBody>
            //                         {durasi > 0 &&
            //                             <CTableRow>
            //                                 {detail?.status === "AKTIF" && <CTableDataCell></CTableDataCell>}
            //                                 <CTableDataCell>1x</CTableDataCell>
            //                                 <CTableDataCell>{`${durasi.hours()} JAM ${durasi.minutes()} MENIT`}</CTableDataCell>
            //                                 <CTableDataCell>{harga}</CTableDataCell>
            //                             </CTableRow>}
            //                         {detail?.item?.map((item, idx) => {
            //                             totalHarga = detail?.item?.reduce((total, item) => {
            //                                 var totalAddOn = item?.addOns ? item?.addOns?.reduce((total1, item1) => {
            //                                     return total1 + Number(item1.harga);
            //                                 }, 0) : 0
            //                                 return total + totalAddOn + Number(item.harga * item.qty);
            //                             }, 0)
            //                             var itemCafe = item.hasOwnProperty("addOns")
            //                             var totalAddOn = itemCafe ? item?.addOns?.reduce((total1, item1) => {
            //                                 return total1 + Number(item1.harga);
            //                             }, 0) : 0
            //                             var subTotal = ((Number(item?.harga) + Number(itemCafe ? totalAddOn : 0)) * (item?.qty ? item?.qty : 1))
            //                             return (
            //                                 <CTableRow key={idx}>
            //                                     <CTableDataCell>{item?.qty}x</CTableDataCell>
            //                                     <CTableDataCell>
            //                                         {item?.name}
            //                                         {item?.addOns && item?.addOns?.length > 0 && (
            //                                             <div className="mt-2">
            //                                                 <strong>Add-ons:</strong>
            //                                                 <ul className="mb-0">
            //                                                     {item.addOns.map((addon, index) => (
            //                                                         <li key={index} className="small">
            //                                                             {addon.name} (+Rp. {formatNumber(addon.harga)})
            //                                                         </li>
            //                                                     ))}
            //                                                 </ul>
            //                                             </div>
            //                                         )}
            //                                         <CInputGroup className='mt-3'> <strong style={{ marginTop: "7px", marginRight: "10px" }}>Note: </strong>
            //                                             <CFormInput value={item?.note} onChange={(e) => {
            //                                                 var tmpItem = { ...detail }
            //                                                 tmpItem.item[idx].note = e.target.value
            //                                                 setDetail(tmpItem)
            //                                             }}></CFormInput>
            //                                         </CInputGroup>
            //                                     </CTableDataCell>
            //                                     {/* <CTableDataCell>{formatNumber(item?.harga)}</CTableDataCell> */}
            //                                     <CTableDataCell>{formatNumber(subTotal)}</CTableDataCell>
            //                                 </CTableRow>
            //                             )
            //                         })}
            //                         <CTableRow>
            //                             <CTableDataCell style={{ textAlign: "right" }} colSpan={2}><b>Total</b></CTableDataCell>
            //                             <CTableDataCell>
            //                                 {(() => {
            //                                     let harga = 0;
            //                                     harga += detail?.item?.reduce((total, item) => {
            //                                         const totalAddOn = item?.addOns
            //                                             ? item?.addOns?.reduce((total1, item1) => total1 + Number(item1.harga), 0)
            //                                             : 0;

            //                                         return item?.addOns
            //                                             ? total + ((Number(item.harga) + totalAddOn) * item.qty)
            //                                             : total + (Number(item.harga) * item.qty);
            //                                     }, 0);

            //                                     return formatNumber(harga);
            //                                 })()}
            //                             </CTableDataCell>

            //                         </CTableRow>
            //                         {(detail?.tax ?? 0) > 0 && (
            //                             <CTableRow>
            //                                 <CTableDataCell colSpan={2} style={{ textAlign: "right" }} >
            //                                     <b>Tax ({detail?.tax * 100}%)</b>
            //                                 </CTableDataCell>
            //                                 <CTableDataCell>{formatNumber(detail?.total * detail?.tax)}</CTableDataCell>
            //                             </CTableRow>
            //                         )}

            //                         <CTableRow>
            //                         </CTableRow>
            //                         {(detail?.service ?? 0) > 0 && (
            //                             <CTableRow>
            //                                 <CTableDataCell colSpan={2} style={{ textAlign: "right" }} >
            //                                     <b>Service ({detail?.service * 100}%)</b>
            //                                 </CTableDataCell>
            //                                 <CTableDataCell>{formatNumber(detail?.total * detail?.service)}</CTableDataCell>
            //                             </CTableRow>
            //                         )}

            //                         <CTableRow>
            //                         </CTableRow>
            //                         {(detail?.discount ?? 0) > 0 && (
            //                             <CTableRow>
            //                                 <CTableDataCell colSpan={2} style={{ textAlign: "right" }} >
            //                                     <b>Discount</b>
            //                                 </CTableDataCell>
            //                                 <CTableDataCell>{formatNumber(detail?.discount)}</CTableDataCell>
            //                             </CTableRow>
            //                         )}

            //                         <CTableRow>
            //                             <CTableDataCell style={{ textAlign: "right" }} colSpan={2}><b>Grand Total</b></CTableDataCell>
            //                             <CTableDataCell>{formatNumber(totalHarga + Math.floor(totalHarga * ((detail?.tax || 0) + (detail?.service || 0))))}</CTableDataCell>
            //                         </CTableRow>
            //                         {detail?.status === "PAYMENT" && <CTableRow>
            //                             <CTableDataCell style={{ textAlign: "right" }} colSpan={2}><b>Total Bayar</b></CTableDataCell>
            //                             <CTableDataCell>
            //                                 <CFormInput type="text"
            //                                     placeholder="Input Total Bayar"
            //                                     onChange={(e) => {
            //                                         // if (/^\d*$/.test(e.target.value)) setHarga(e.target.value)
            //                                         setInputBayar(e.target.value.replace(/,/g, ""))
            //                                     }}
            //                                     value={formatNumber(inputBayar)}
            //                                 />
            //                             </CTableDataCell>
            //                         </CTableRow>}
            //                         {detail?.status === "PAYMENT" && <CTableRow>
            //                             <CTableDataCell style={{ textAlign: "right" }} colSpan={2}><b>Kembali</b></CTableDataCell>
            //                             <CTableDataCell>{formatNumber(Math.max(0, ((isDiscount ? (typeDiscount ? totalHarga * (1 - (detail?.discount / 100)) : totalHarga - detail?.discount)
            //                                 : totalHarga) + Math.floor((isDiscount ? (typeDiscount ? totalHarga * (1 - detail?.discount / 100) : totalHarga - detail?.discount) : totalHarga) * ((detail?.tax || 0) + (detail?.service || 0)))) - inputBayar))}</CTableDataCell>
            //                         </CTableRow>}
            //                     </CTableBody>
            //                 </CTable>
            //             </CContainer>
            //             <CContainer>
            //                 <CRow className="justify-content-center mt-5">
            //                     <CCol>
            //                         <CCard>
            //                             <CCardHeader className="text-center">
            //                                 <h5>Pilih Metode Pembayaran</h5>
            //                             </CCardHeader>
            //                             <CCardBody>
            //                                 <CRow className="mb-3">
            //                                     <CCol md="6">
            //                                         <CCard
            //                                             className={`p-3 ${paymentMethod === 'cash' ? 'border-primary' : ''}`}
            //                                             onClick={() => handlePaymentChange('cash')}
            //                                             style={{ cursor: 'pointer', height: "125px" }}
            //                                         >
            //                                             <CFormLabel htmlFor="cash" className="font-weight-bold">
            //                                                 <div style={{ display: 'flex', alignItems: 'center' }}>
            //                                                     <CIcon icon={cilCash} size="3xl" />
            //                                                     <CFormLabel htmlFor="ccard" className="font-weight-bold" style={{ paddingTop: "10px", paddingLeft: "10px" }}>Tunai</CFormLabel>
            //                                                 </div>
            //                                             </CFormLabel>
            //                                             <p className="small text-muted">Bayar dengan menggunakan uang tunai.</p>
            //                                         </CCard>
            //                                     </CCol>
            //                                     <CCol md="6">
            //                                         <CCard
            //                                             className={`p-3 ${paymentMethod === 'cashless' ? 'border-primary' : ''}`}
            //                                             onClick={() => handlePaymentChange('cashless')}
            //                                             style={{ cursor: 'pointer', height: "125px" }}
            //                                         >
            //                                             <CFormLabel htmlFor="cash" className="font-weight-bold">
            //                                                 <div style={{ display: 'flex', alignItems: 'center' }}>
            //                                                     <img src={qrisIcon} alt="QRIS" width={80} className="mr-2" />
            //                                                     <CFormLabel htmlFor="ccard" className="font-weight-bold" style={{ paddingTop: "10px", paddingLeft: "10px" }}>Non Tunai</CFormLabel>
            //                                                 </div>
            //                                             </CFormLabel>
            //                                             {/* <CFormLabel htmlFor="cash" className="font-weight-bold">Non Tunai</CFormLabel> */}
            //                                             <p className="small text-muted">Bayar dengan menggunakan uang non tunai.</p>
            //                                         </CCard>
            //                                     </CCol>
            //                                 </CRow>
            //                             </CCardBody>
            //                         </CCard>
            //                     </CCol>
            //                 </CRow>
            //             </CContainer>
            //             <CModalFooter>
            //                 <CButton color="primary" onClick={(e) => {
            //                     handlePrintClick(detail, Math.max(0, ((isDiscount ? (typeDiscount ? totalHarga * (1 - detail?.discount / 100) : totalHarga - detail?.discount) : totalHarga) +
            //                         Math.floor((isDiscount ? (typeDiscount ? totalHarga * (1 - detail?.discount / 100) : totalHarga - detail?.discount) : totalHarga) * ((detail?.tax || 0) + (detail?.service || 0)))) - inputBayar))
            //                 }}>Bayar</CButton>
            //                 <CButton color="danger" onClick={() => setModal(false)}>Close</CButton>
            //             </CModalFooter>
            //         </CModalBody>
            //     </>
            default:
                var orderTotal = tmpCafe?.item.reduce((total, item) => {
                    var totalAddOn = item?.addOns ? item?.addOns?.reduce((total1, item1) => {
                        return total1 + Number(item1.harga);
                    }, 0) : 0
                    return total + Number(totalAddOn * item.qty) + Number(item.harga * item.qty);
                }, 0)
                var boardGame = Number(item?.harga ? item?.harga : 0) * Number(item?.qty ? item?.qty : 1)
                var subTotal = (Number((orderTotal ? orderTotal : 0)) + Number(boardGame))
                var diskon = (isDiscount ? (typeDiscount ? orderTotal * (discount / 100) : discount) : 0)
                var tmpTax = isTax ? tax / 100 : 0
                var grandTotal = (Number(subTotal) - Number(diskon)) + (orderTotal * tmpTax)

                return <>
                    <CModalHeader>
                        <CModalTitle id="actionModal">Open Table</CModalTitle>
                    </CModalHeader>
                    <CModalBody >
                        <CContainer>
                            <CRow className="mb-3">
                                <CCol>
                                    <CFormLabel className="col-form-label">Customer</CFormLabel>
                                </CCol>
                                <CCol sm={9}>
                                    {/* <CFormInput type="text" onChange={(e) => setNama(e.target.value)} defaultValue={nama}
                                    readOnly={bookingId !== "" ? true : false}
                                    plainText={bookingId !== "" ? true : false} /> */}
                                    <ReactSelectCreatable
                                        isClearable
                                        value={client} // Match value in options
                                        options={filteredOptions}
                                        onInputChange={(value) => setInputValue(value)} // Track input value                                  
                                        onChange={(selectedOption) => {
                                            // setNomor(selectedOption?.nomor)
                                            var tmpItem = { ...item }
                                            setClient(selectedOption)
                                            if (selectedOption?.status === "AKTIF" && selectedOption?.subscription !== undefined &&
                                                moment(selectedOption?.subscription?.expired).isSameOrAfter(moment().startOf("day"))) {
                                                setItem({ harga: 0, qty: 1, name: "MEMBER PASS" })
                                            } else {
                                                setItem(tmpItem)
                                            }
                                        }} // Only store the value
                                        placeholder="Input Nama Customer"
                                        // onCreateOption={handleCreate}
                                        // isValidNewOption={()=> true}
                                        styles={customStylesInput}
                                        noOptionsMessage={() => (inputValue === "" ? "Start typing to search..." : "No options available")}
                                        components={{ IndicatorSeparator: null }}
                                    />

                                </CCol>
                            </CRow>
                            <CRow className='mb-3'>
                                <CCol>
                                    <CFormLabel className="col-form-label">Nomor HP </CFormLabel>
                                </CCol>
                                <CCol sm={9}>
                                    <CFormInput type="text"
                                        value={client?.nomor !== undefined ? client?.nomor : nomor}
                                        onChange={(e) => {
                                            if (/^\d*$/.test(e.target.value)) setNomor(e.target.value)
                                        }}
                                        disabled={client?.nomor !== undefined}
                                        placeholder='Input Nomor HP'
                                        required />
                                </CCol>
                            </CRow>
                            {(client?.status === "AKTIF" && client?.subscription === undefined && moment(client?.subscription?.expired).isSameOrAfter(moment().startOf("day"))
                                && item?.tipe === "durasi" && item?.duration === "00:00") && <CRow className="mb-3">
                                    <CCol>
                                        <CInputGroup>
                                            <CFormLabel className="col-form-label">Durasi</CFormLabel>
                                        </CInputGroup>
                                    </CCol>


                                    {/* <CCol sm={9}>
                                    <CFormInput type="text" value={`${item?.duration?.split(":")[0] ? item?.duration?.split(":")[0] : "0"} JAM ${item?.duration?.split(":")[1] ? Number(item?.duration?.split(":")[1]) > 0 ? item?.duration?.split(":")[1] : item?.duration?.split(":")[1].slice(0, 1) : "0"} MENIT`} plainText />
                                </CCol>  */}

                                    <CCol sm={9}>
                                        <CInputGroup>
                                            <CFormInput type="number" value={hours} onChange={handleHoursChange} style={{ width: "20px" }} />
                                            <CInputGroupText><b>JAM</b></CInputGroupText>
                                            <CFormInput type="number" value={minutes} onChange={handleMinutesChange} />
                                            <CInputGroupText><b>MENIT</b></CInputGroupText>
                                        </CInputGroup>
                                    </CCol>
                                </CRow>}

                            <CRow className="mb-3">
                                <CCol>
                                    <CFormLabel className="col-form-label">Table</CFormLabel>
                                </CCol>
                                <CCol sm={9}>
                                    {meja === "" ?
                                        <CFormInput type="text" value={detail?.name}
                                            readOnly={true}
                                            plainText={true} /> :
                                        <CFormSelect onChange={(e) => {
                                            setMeja(JSON.parse(e.target.value))
                                        }}>
                                            <option value="" disabled>Pilih Table</option>
                                            {data.map((table) => {
                                                if (table.status === "KOSONG")
                                                    return (<option key={table.id} value={JSON.stringify({ id: table.id, name: table.name })}>
                                                        {table.name}
                                                    </option>)
                                            })}
                                        </CFormSelect>}
                                </CCol>
                            </CRow>
                            <CRow>
                                <hr />
                                <h4 style={{ textAlign: "center" }}>Order List</h4>
                                <hr />
                                <CTable>
                                    <CTableHead>
                                        <CTableRow>
                                            <CTableHeaderCell style={{ width: "100px" }}>Action</CTableHeaderCell>
                                            <CTableHeaderCell style={{ width: "100px" }}>Qty</CTableHeaderCell>
                                            <CTableHeaderCell style={{ width: "400px" }}>Item</CTableHeaderCell>
                                            <CTableHeaderCell style={{ width: "200px" }}>Harga</CTableHeaderCell>
                                            <CTableHeaderCell style={{ width: "200px" }}>Sub Total</CTableHeaderCell>
                                        </CTableRow>
                                    </CTableHead>
                                    <CTableBody>
                                        {
                                            tmpCafe?.item.map((item, idx) => {
                                                var totalAddOn = item?.addOns ? item?.addOns?.reduce((total1, item1) => {
                                                    return total1 + Number(item1.harga);
                                                }, 0) : 0
                                                return (
                                                    <CTableRow key={idx}>
                                                        <CTableDataCell>
                                                            <CButton color='danger' className='me-1' onClick={() => {
                                                                var tempCafe = { ...tmpCafe }
                                                                tempCafe?.item.splice(idx, 1)
                                                                setTmpCafe(tempCafe)
                                                            }}>✗</CButton>
                                                        </CTableDataCell>
                                                        <CTableDataCell>
                                                            <CFormInput type="number" min={1} defaultValue={item?.qty} onChange={(e) => {
                                                                var tempCafe = { ...tmpCafe }
                                                                tempCafe.item[idx].qty = e.target.value
                                                                setTmpCafe(tempCafe)
                                                            }} /></CTableDataCell>
                                                        <CTableDataCell>
                                                            {item?.name}
                                                            {item?.addOns && item?.addOns?.length > 0 && (
                                                                <div className="mt-2">
                                                                    <strong>Add-ons:</strong>
                                                                    <ul className="mb-0">
                                                                        {item.addOns.map((addon, index) => (
                                                                            <li key={index} className="small">
                                                                                {addon.name} (+Rp. {formatNumber(addon.harga)})
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            )}
                                                            <CInputGroup className='mt-3'> <strong style={{ marginTop: "7px", marginRight: "10px" }}>Note: </strong>
                                                                <CFormInput value={item?.note} onChange={(e) => {
                                                                    var tmpItem = { ...tmpCafe }
                                                                    tmpItem.item[idx].note = e.target.value
                                                                    setTmpCafe(tmpItem)
                                                                }}></CFormInput>
                                                            </CInputGroup>
                                                        </CTableDataCell>
                                                        <CTableDataCell>
                                                            {formatNumber(Number(item?.harga))}
                                                        </CTableDataCell>
                                                        <CTableDataCell>
                                                            {formatNumber((Number(item?.harga) + Number(totalAddOn)) * Number(item?.qty))}
                                                        </CTableDataCell>
                                                    </CTableRow>
                                                )
                                            })
                                        }
                                        {(typeof item === "object" && Object?.keys(item).length === 0) ? <CTableRow>
                                            <CTableDataCell colSpan={5} ><CButton color='success' onClick={() => {
                                                setItem({ qty: 1, harga: "", name: "", category: "board game" })
                                            }}>+</CButton></CTableDataCell>
                                        </CTableRow> :
                                            (item?.name !== "MEMBER PASS" && Object?.keys(item).length > 0) ?

                                                <CTableRow>
                                                    <CTableDataCell>
                                                        <CButton color='danger' className='me-1' onClick={() => {
                                                            setItem({})
                                                        }}>✗</CButton>
                                                    </CTableDataCell>
                                                    <CTableDataCell>
                                                        <CFormInput type="number" min={0} defaultValue={1} onChange={(e) => {
                                                            setItem({ ...item, qty: e.target.value })
                                                        }} /></CTableDataCell>
                                                    <CTableDataCell>
                                                        <ReactSelectAsync
                                                            defaultOptions
                                                            loadOptions={loadOption}
                                                            filterOption={filterOption}
                                                            onInputChange={(value) => setInputFilter(value)} // Track input value                                  
                                                            styles={customStyles}
                                                            placeholder="Pilih Item"
                                                            value={item}
                                                            menuPortalTarget={document.body}
                                                            onChange={(selected) => {
                                                                console.log(selected)
                                                                setItem({ ...selected, qty: 1 });
                                                            }}
                                                            formatGroupLabel={formatGroupLabel}
                                                            components={{
                                                                GroupHeading: GroupHeading,
                                                                Group: HideGroupChildren,
                                                            }}

                                                        />
                                                    </CTableDataCell>
                                                    <CTableDataCell>{formatNumber(item?.harga ? item?.harga : "0")}</CTableDataCell>
                                                    <CTableDataCell>{formatNumber(item?.harga ? Number(item?.qty ? item?.qty : "1") * Number(item?.harga) : "0")}</CTableDataCell>
                                                </CTableRow> :
                                                <CTableRow>
                                                    <CTableDataCell></CTableDataCell>
                                                    <CTableDataCell>{item?.qty ? item?.qty : "0"}</CTableDataCell>
                                                    <CTableDataCell>{item?.name ? item?.name : "MEMBER PASS"}</CTableDataCell>
                                                    <CTableDataCell>{formatNumber(item?.harga ? item?.harga : "0")}</CTableDataCell>
                                                    <CTableDataCell>{formatNumber(item?.harga ? Number(item?.qty ? item?.qty : "1") * Number(item?.harga) : "0")}</CTableDataCell>
                                                </CTableRow>
                                        }
                                        <CTableRow>
                                            <CTableDataCell colSpan={4} style={{ textAlign: "right" }} ><b>Total</b></CTableDataCell>
                                            <CTableDataCell>{formatNumber(subTotal)}</CTableDataCell>
                                        </CTableRow>
                                        <CTableRow>
                                            <CTableDataCell colSpan={3} style={{ textAlign: "right" }} >
                                                <CFormCheck inline id="discount" style={{ marginRight: "10px" }}
                                                    checked={isDiscount}
                                                    onChange={(e) => setIsDiscount(e.target.checked)} />
                                            </CTableDataCell>
                                            {/* <CTableDataCell>
                                                <CInputGroup>
                                                    {!typeDiscount && <span className="input-group-text" id="basic-addon1" onClick={() => setTypeDiscount(!typeDiscount)}>
                                                        Rp.</span>}
                                                    <CFormInput type='text' value={formatNumber(10)} onChange={(e) => setDiscount(e.target.value.replace(/,/g, ""))} disabled={!isDiscount} />
                                                    {typeDiscount && <span className="input-group-text" id="basic-addon1" onClick={() => setTypeDiscount(!typeDiscount)}>
                                                        %</span>}
                                                </CInputGroup>
                                            </CTableDataCell> */}
                                            <CTableDataCell style={{ textAlign: "right" }}>
                                                <CInputGroup style={{ width: "250px" }}>
                                                    <CFormLabel style={{ marginRight: "10px" }}>Discount </CFormLabel>
                                                    {!typeDiscount && <span className="input-group-text" id="basic-addon1" onClick={() => setTypeDiscount(!typeDiscount)}>
                                                        Rp.</span>}
                                                    <CFormInput type='text' value={formatNumber(10)} onChange={(e) => setDiscount(e.target.value.replace(/,/g, ""))} disabled={!isDiscount} />
                                                    {typeDiscount && <span className="input-group-text" id="basic-addon1" onClick={() => setTypeDiscount(!typeDiscount)}>
                                                        %</span>}
                                                </CInputGroup>
                                            </CTableDataCell>
                                            <CTableDataCell>{formatNumber(diskon)}</CTableDataCell>
                                        </CTableRow>
                                        <CTableRow>
                                            <CTableDataCell colSpan={3} style={{ textAlign: "right" }} >
                                                <CFormCheck inline id="tax" style={{ marginRight: "10px" }}
                                                    checked={isTax}
                                                    onChange={(e) => setIsTax(e.target.checked)} />
                                            </CTableDataCell>
                                            <CTableDataCell style={{ textAlign: "right" }}>
                                                <CInputGroup>
                                                    <CFormLabel style={{ marginRight: "10px" }}>PB1 </CFormLabel>
                                                    <CFormInput type='number' min={0} max={20} value={tax} onChange={(e) => setTax(e.target.value)} />
                                                    <span className="input-group-text" id="basic-addon1">
                                                        %</span>
                                                </CInputGroup>
                                            </CTableDataCell>
                                            <CTableDataCell>{isTax ? formatNumber(Math.ceil(orderTotal * (tax / 100))) : 0}</CTableDataCell>
                                        </CTableRow>
                                        {/* <CTableRow>
                                            <CTableDataCell colSpan={4} style={{ textAlign: "right" }} >
                                                <CFormCheck inline id="service" style={{ marginRight: "10px" }}
                                                    checked={isService}
                                                    onChange={(e) => setIsService(e.target.checked)} />
                                                <b>Service {<input type='number' min={0} max={20} value={service} onChange={(e) => setService(e.target.value)} />} %</b></CTableDataCell>
                                            <CTableDataCell>{isService ? formatNumber(Math.ceil(orderTotal * (service / 100))) : 0}</CTableDataCell>
                                        </CTableRow> */}

                                        <CTableRow>
                                            <CTableDataCell colSpan={4} style={{ textAlign: "right" }} ><b>Grand Total</b></CTableDataCell>
                                            <CTableDataCell>{formatNumber(grandTotal)}</CTableDataCell>
                                        </CTableRow>
                                    </CTableBody>
                                </CTable>
                            </CRow>


                        </CContainer>
                    </CModalBody >
                    <CModalFooter>
                        {!loading ? <CButton color="success" onClick={(e) => start(e)}>Start</CButton>
                            : <CSpinner color="primary" className="float-end" variant="grow" />}
                        {tmpCafe === undefined && <CButton color="warning" onClick={(e) => navigate('/order/add', { state: { table: detail, cafe: cafe, action: "open", tmpTable: { client: client, usePromo: usePromo, promo: promo, meja: meja === "" ? detail : meja } } })}>Update Order</CButton>}
                        {tmpCafe !== undefined && <CButton color="warning" onClick={(e) => {
                            sessionStorage.setItem("cartItems", JSON.stringify(tmpCafe?.item))
                            navigate('/order/add', { state: { table: detail, cafe: cafe, action: "open", tmpTable: { client: client, usePromo: usePromo, promo: promo, meja: meja === "" ? detail : meja } } })
                        }}
                        >Update Order</CButton>}
                    </CModalFooter>
                </>
        }
    }

    return (
        <Suspense
            fallback={
                <div className="pt-3 text-center">
                    <CSpinner color="primary" variant="grow" />
                </div>
            }
        >
            {isLoading && <Loading />}
            <CRow>
                {data.map((table, index) => (
                    <CCol xxl="3" lg="4" md="4" sm="5" key={index}>
                        <CCard className="mb-4" key={index} style={{
                            border: table?.end && moment.duration(moment(table?.end ? table.end : undefined).diff(moment(table?.end ? undefined : table.start))).asMinutes() < 10 ? "red 2px solid" : ""
                        }}>
                            <CCardHeader><b>{table.name} - {table.status}{(table.status === "AKTIF" || table.status === "PAUSE") && table?.start && ` (${hitungDurasi(table, table?.end ? undefined : table?.start, table?.end ? table.end : undefined)})`}</b></CCardHeader>
                            <CCardBody style={{ padding: "10px 1.5rem 1.5rem 1.5rem" }}>
                                <CRow>
                                    <div style={{ padding: '0' }}><b>Customer</b> : {table?.client ? table.client?.name : "-"}</div>
                                </CRow>
                                <CRow>
                                    <div style={{ padding: '0' }}><b>Start</b> : {table?.start ? moment(table.start).format("DD/MM/YYYY HH:mm:ss") : "-:-:-"}</div>
                                </CRow>
                                <CRow className='mb-3'>
                                    <div style={{ padding: '0' }}><b>End</b> : {table?.end ? moment(table.end).format("DD/MM/YYYY HH:mm:ss") : "-:-:-"}</div>
                                </CRow>
                                {/* <CRow className='mb-3'>
                                        <div style={{ padding: '0' }}><b>Timer</b> : {table?.timer ? moment(table.timer, "HH:mm").format("HH:mm:ss") : "-:-:-"}</div>
                                    </CRow> */}
                                <CRow>
                                    {table.status === "AKTIF" || table.status === "PAUSE" ?
                                        <>
                                            <CCol>
                                                {/* <CButton color='primary' className='mb-2' onClick={() => { setDetail(table); setAction("order"); setVisible(true) }}>Tambah Order</CButton> */}
                                                <CButton color='info' className='mb-2 w-100' onClick={() => { setDetail(table); setAction("detail"); setModal(true) }}>Detail Order</CButton>
                                                <CButton color='warning' className="w-100" onClick={() => { setDetail(table); setAction("detailMeja"); setVisible(true) }}>Detail Meja</CButton>
                                            </CCol>
                                            <CCol>
                                                {/* <CButton className='mb-2 w-100' color='primary' onClick={() => { addPause(table) }} style={{ height: "38px", fontSize: "12.5px" }}>Resume / Pause</CButton> */}
                                                {!loading ? <CButton color='danger' className='w-100' onClick={() => { confirmationStop(table) }}>Stop</CButton>
                                                    : <CSpinner color="primary" className="float-end" variant="grow" />}
                                            </CCol>
                                        </>
                                        :
                                        <>
                                            <CButton color='success' className='mb-2' onClick={() => { setDetail(table); setMeja(""); setVisible(true); }}>Start</CButton>
                                        </>
                                    }
                                </CRow>
                            </CCardBody>
                        </CCard>
                    </CCol>
                ))}
            </CRow>

            {/* <AppTable
                key="table-1"
                title={"Waiting List"}
                column={[
                    { name: "#", key: "index" },
                    { name: "Nama Customer", key: "client" },
                    { name: "Status", key: "status" },
                    { name: "Booking", key: "bookingDate" },
                    { name: "Created At", key: "createdAt" },
                    { name: "Action", key: "action" }
                ]}
                // query={query(collection(firestore, "booking"), orderBy("createdAt", "desc"), where("status", "==", "WAITING"))}
                collection={"tableHistory"} // Ambil data dari koleksi "cashiers"
                filter={{ status: "WAITING" }} // Bisa diberikan filter
                sort={{ createdAt: -1 }} // Sortir dari terbaru    
                crudAction={[{ name: "Tambah Customer", key: "add" }]}
                listStatus={[
                    { name: "AKTIF", color: "success" },
                    { name: "PAYMENT", color: "warning" },
                    { name: "CANCEL", color: "danger" },
                    { name: "PAID", color: "dark" },
                    { name: "WAITING", color: "info" }
                ]}
                refresh={refresh}
                setAction={setAction}
                setVisible={setVisible}
                setTable={setTable}
                setHapus={setHapus}
                setEdit={setEdit}
                setDetail={setDetail}
                startTable={start}
                cancelBooking={cancelBooking}
            /> */}

            <AppTable
                key="table-2"
                title={"History Order"}
                column={[
                    { name: "#", key: "index" },
                    { name: "Nama Customer", key: "client" },
                    { name: "Table", key: "tableName" },
                    { name: "Status", key: "status" },
                    { name: "Date", key: "start" },
                    { name: "Start", key: "start" },
                    { name: "End", key: "end" },
                    { name: "Duration", key: "durasi" },
                    { name: "Action", key: "action" }
                ]}
                // query={query(collection(firestore, "booking"), orderBy("createdAt", "desc"), where("status", "in", ["PAYMENT", "AKTIF", "CLOSE", "CANCEL"]), limit(500))}
                collection={"tableHistory"} // Ambil data dari koleksi "cashiers"
                crudAction={[{ name: "Buat Order", key: "add", href: "/add" }]}
                filter={{
                    status: {
                        $in: ["PAYMENT", "AKTIF", "CLOSE", "CANCEL"]
                    }
                }} // Bisa diberikan filter
                sort={{ createdAt: -1 }} // Sortir dari terbaru    
                listStatus={[
                    { name: "AKTIF", color: "success" },
                    { name: "PAYMENT", color: "warning" },
                    { name: "CANCEL", color: "danger" },
                    { name: "CLOSE", color: "dark" },
                    { name: "WAITING", color: "info" }
                ]}
                refresh={refresh}
                filterDate={true}
                col="tableHistory"
                setHapus={setHapus}
                setEdit={setEdit}
                setAction={setAction}
                setVisible={setVisible}
                setModal={setModal}
                setDetail={setDetail}
                setMeja={setMeja}
                setCol={setCol}
                stopTable={stop}
            />

            {/* <AppTable
                key="table-3"
                title={"History Cafe Order"}
                column={[
                    { name: "#", key: "index" },
                    { name: "Nama Customer", key: "client" },
                    { name: "Table", key: "tableName" },
                    { name: "Pesanan", key: "item" },
                    { name: "Tipe Order", key: "order" },
                    { name: "Status", key: "status" },
                    { name: "Action", key: "action" }
                ]}
                // headers={['#', 'Nama Customer', 'Status', 'Booking', 'Created At', 'Action']}
                // query={query(collection(firestore, "cafe"), orderBy("createdAt", "asc"))}
                collection={"cafe"} // Ambil data dari koleksi "cashiers"
                filter={{}} // Bisa diberikan filter
                sort={{ createdAt: 1 }} // Sortir dari terbaru 
                crudAction={[{ name: "Buat Order", key: "add", href: "/add" }]}
                listStatus={[
                    { name: "ON PROCESS", color: "primary" },
                    { name: "PAYMENT", color: "warning" },
                    { name: "CLOSE", color: "black" },
                    { name: "PAID", color: "black" },
                    { name: "READY", color: "success" }
                ]}
                refresh={refresh}
                func={serve}
                func1={finish}
                filterDate={true}
                printOrder={true}
                setParentData={setOrder}
                setDetail={setDetail}
                setModal={setVisible}
                setAction={setAction}
                setVisible={setVisible}
                setEdit={setEdit}
                setHapus={setHapus}
            /> */}

            <CModal
                size="xl"
                scrollable
                alignment='center'
                visible={visible}
                onClose={() => { setTmpAction(""); setDetail([]); setTypeDiscount(true); setIsDiscount(false); setTmpCafe({ item: [] }); setItem({}); setNomor(""); setClient(undefined); setUseDurasi(false); setEdit([]); setUsePromo(false); setDurasi(""); setClient({}); setPromo(""); setDetail([]); setEditHarga(false); setValue(""); setCafe([]); setEditStatus(false); setUsePromo(false); setPromo(""); setHours(0); setMinutes(0); setNama(""); setVisible(false); setAction(null); setMeja("table-1"); setWaktu(moment().add(1, "hours").startOf("hour").format("HH:mm")); setOrderId(""); setChangeTable(""); setCafe([]) }}
                aria-labelledby="actionModal"
            >
                {renderModal()}
            </CModal>

            <CModal
                size="xl"
                scrollable
                alignment='center'
                visible={modal}
                onClose={() => { setTmpAction(""); setPaymentMethod("cash"); setDetail([]); setTypeDiscount(true); setIsDiscount(false); setTmpCafe({ item: [] }); setUseDurasi(false); setItem({}); setEdit({}); setClient(undefined); setInputBayar(""); setHours(0); setDurasi(""); setUsePromo(false); setValue(""); setCafe([]); setEditNama(false); setPromo(""); setMinutes(0); setDetail([]); setModal(false); setAction(null); setOrderId(""); setCafe([]) }}
                aria-labelledby="actionModal"
            >
                <CModalHeader>
                    <CModalTitle id="actionModal">{action === "detail" ? "Detail Order" : "Detail Pembayaran"}</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CContainer>
                        {columnDetail.map((data) => {
                            if (data.key === "start" || data.key === "end" || data.key === "createdAt" || data.key === "orderAt") {
                                return <CRow className="align-items-start mb-2" key={data.key}>
                                    <CCol xs={4} sm={5} md={3}><b>{data.label} </b></CCol>
                                    <CCol xs="auto" sm={"auto"} md={"auto"}>:</CCol>
                                    <CCol> {moment(detail?.[data.key]).format("dddd, DD MMMM YYYY HH:mm:ss")}</CCol>
                                </CRow>
                            } else if (data.key === "table") {
                                return <CRow className="align-items-start mb-2" key={data.key}>
                                    <CCol xs={4} sm={5} md={3}><b>{data.label} </b></CCol>
                                    <CCol xs="auto" sm={"auto"} md={"auto"}>:</CCol>
                                    <CCol> {detail?.tableName ? titleCase(detail?.[data.key]) : detail?.name}</CCol>
                                </CRow>
                            } else if (data.key === "estimasi") {
                                var harga = 0;
                                if ((detail?.status === "AKTIF" || detail?.status === "PAUSE")) harga = !isNaN(detail?.end) && detail?.end !== "" ?
                                    formatNumber(hitungHarga(detail, detail?.start, detail?.end, detail?.harga))
                                    : formatNumber(hitungHarga(detail, detail?.start, moment().format(), detail?.harga))
                                // else if (action === "pay") harga = formatNumber(detail?.harga)
                                else harga = formatNumber(hitungHarga(detail, detail?.start, detail?.end, detail?.rate, detail?.rate1))

                                if (detail?.status === "AKTIF" || detail?.status === "PAUSE") {
                                    return <CRow className="align-items-start mb-2" key={data.key}>
                                        <CCol xs={4} sm={5} md={3}><b>{data.label} </b></CCol>
                                        <CCol xs="auto" sm={"auto"} md={"auto"}>:</CCol>
                                        <CCol>{harga}</CCol>
                                    </CRow>
                                }

                            } else if (data.key === "client") {
                                return <CRow className="align-items-start mb-2" key={data.key}>
                                    <CCol xs={4} sm={5} md={3}><b>{data.label} </b></CCol>
                                    <CCol xs="auto" sm={"auto"} md={"auto"}>:</CCol>

                                    <input type="text" className={editNama ? "form-control" : "no-border"}
                                        value={editNama || (value !== "") ? value : detail?.client?.name}
                                        onChange={(e) => {
                                            setValue(e.target.value)
                                        }}
                                        style={{ width: "30%" }}
                                        readOnly={!editNama} />
                                    {editNama ? <CButton color='info' style={{ width: "40px" }} onClick={(e) => {
                                        updateClient()
                                    }}>✓</CButton> : ((detail?.status === "AKTIF" || detail?.status === "PAUSE") && <CButton color='warning' style={{ width: "40px" }} className='ms-2' onClick={() => {
                                        setEditNama(true); setValue(detail?.client?.name)
                                    }}><CIcon icon={cilPencil} /></CButton>)}
                                </CRow>
                            } else if (data.key === "pauseTimes") {
                                const pauseTimes = detail?.pauseTimes || [];

                                // Calculate total paused duration in milliseconds
                                const totalPauseDurationMs = pauseTimes.reduce((total, pauseEntry) => {
                                    const pauseStart = moment(pauseEntry.pause);
                                    const pauseEnd = pauseEntry.resume ? moment(pauseEntry.resume) : moment(); // Use current time if not resumed
                                    return total + moment.duration(pauseEnd.diff(pauseStart)).asMilliseconds();
                                }, 0);

                                // Convert the total duration to a moment.duration object
                                const totalPauseDuration = moment.duration(totalPauseDurationMs);

                                // Extract hours and minutes
                                const hours = totalPauseDuration.hours();
                                const minutes = totalPauseDuration.minutes();

                                return (
                                    <CRow className="align-items-start mb-2" key={data.key}>
                                        <CCol xs={4} sm={5} md={3}><b>{data.label} </b></CCol>
                                        <CCol xs="auto" sm={"auto"} md={"auto"}>:</CCol>
                                        <CCol><b>{`${hours} JAM ${minutes} MENIT`}</b></CCol>
                                    </CRow>
                                );
                            }
                            else {
                                return <CRow className="align-items-start mb-2" key={data.key}>
                                    <CCol xs={4} sm={5} md={3}><b>{data.label} </b></CCol>
                                    <CCol xs="auto" sm={"auto"} md={"auto"}>:</CCol>
                                    <CCol>{Number(detail?.[data.key]) ? formatNumber(detail?.[data.key]) : detail?.[data.key]}</CCol>
                                </CRow>
                            }
                        })}
                    </CContainer>
                    <CContainer className='mt-3'>
                        <hr />
                        <h4 style={{ textAlign: "center" }}>Order List</h4>
                        <hr />
                        <CTable>
                            <CTableHead>
                                <CTableRow>
                                    {(action !== "detail" && (detail?.status === "PAYMENT")) && <CTableHeaderCell className='d-flex flex-row' style={{ width: "150px" }}>
                                        <CFormCheck style={{ marginRight: "10px" }}
                                            checked={selectAll}
                                            onChange={(e) => {
                                                const checked = e.target.checked;
                                                setSelectAll(checked)
                                                setDetail(prevDetail => {
                                                    var updatedItem = { ...prevDetail }
                                                    if (prevDetail?.splitBill !== undefined) {
                                                        // tmpItem.unpaidItems[idx].isPay = e.target.checked
                                                        updatedItem = prevDetail.unpaidItems?.map(item => ({
                                                            ...item,
                                                            isPay: checked, // atau !item.isPay jika toggle
                                                        })) || [];
                                                        return {
                                                            ...prevDetail,
                                                            unpaidItems: updatedItem,
                                                        };
                                                    } else {
                                                        // tmpItem.unpaidItems[idx].isPay = e.target.checked
                                                        updatedItem = prevDetail.item?.map(item => ({
                                                            ...item,
                                                            isPay: checked, // atau !item.isPay jika toggle
                                                        })) || [];
                                                        return {
                                                            ...prevDetail,
                                                            item: updatedItem,
                                                        };
                                                    }
                                                });
                                            }} /><div>Pay</div></CTableHeaderCell>}
                                    {(action === "detail" && (detail?.status === "AKTIF" || detail?.status === "PAUSE")) && <CTableHeaderCell style={{ width: "110px" }}>Action</CTableHeaderCell>}
                                    {detail?.status === "AKTIF" && <CTableHeaderCell style={{ width: "100px" }}>Print</CTableHeaderCell>}
                                    <CTableHeaderCell style={{ width: detail?.status === "PAYMENT" ? "170px" : "100px" }}>Qty</CTableHeaderCell>
                                    <CTableHeaderCell style={{ width: "400px" }}>Item</CTableHeaderCell>
                                    <CTableHeaderCell style={{ width: "200px" }}>Harga</CTableHeaderCell>
                                    <CTableHeaderCell style={{ width: "200px" }}>Sub Total</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {durasi > 0 &&
                                    <CTableRow>
                                        {(detail?.status === "AKTIF" || detail?.status === "PAUSE") && <CTableDataCell></CTableDataCell>}
                                        <CTableDataCell>1x</CTableDataCell>
                                        <CTableDataCell>{`${durasi.hours()} JAM ${durasi.minutes()} MENIT`}</CTableDataCell>
                                        <CTableDataCell>{
                                            detail?.status === "AKTIF" || detail?.status === "PAUSE" ?
                                                !isNaN(detail?.end) && detail?.end !== "" ?
                                                    formatNumber(hitungHarga(detail, detail?.start, detail?.end, detail?.harga))
                                                    : formatNumber(hitungHarga(detail, detail?.start, moment().format(), detail?.harga))
                                                // else if (action === "pay") harga = formatNumber(detail?.harga)
                                                : formatNumber(hitungHarga(detail, detail?.start, detail?.end, detail?.rate, detail?.rate1))}</CTableDataCell>
                                    </CTableRow>}
                                {(detail?.splitBill !== undefined && (detail?.status === "PAYMENT" /*|| detail?.status === "CLOSE"*/) ? detail?.unpaidItems : detail?.item)?.map((item, idx) => {
                                    var itemCafe = item.hasOwnProperty("addOns")
                                    var totalAddOn = itemCafe ? item?.addOns?.reduce((total1, item1) => {
                                        return total1 + Number(item1.harga);
                                    }, 0) : 0
                                    var subTotal = ((Number(item?.harga) + Number(itemCafe ? totalAddOn : 0)) * (item?.qty ? item?.qty : 1))

                                    var orderTotal = tmpCafe?.item.reduce((total, item) => {
                                        var totalAddOn = item?.addOns ? item?.addOns?.reduce((total1, item1) => {
                                            return total1 + Number(item1.harga);
                                        }, 0) : 0
                                        return total + totalAddOn + Number(item.harga * item.qty);
                                    }, 0)
                                    // var boardGame = Number(item?.harga ? item?.harga : 0) * Number(item?.qty ? item?.qty : 1)
                                    // var grandTotal = (orderTotal ? orderTotal : 0) + boardGame
                                    return (
                                        <CTableRow key={idx}>
                                            {(action !== "detail") && <CTableDataCell>
                                                <CFormCheck id={`pay-${idx}`}
                                                    checked={item?.isPay}
                                                    onChange={(e) => {
                                                        var tmpItem = { ...detail }
                                                        if (tmpItem?.splitBill !== undefined) {
                                                            tmpItem.unpaidItems[idx].isPay = e.target.checked
                                                        } else {
                                                            tmpItem.item[idx].isPay = e.target.checked
                                                        }
                                                        console.log(tmpItem)
                                                        setDetail(tmpItem)
                                                    }}
                                                /></CTableDataCell>}
                                            {((action === "detail" && (detail?.status === "AKTIF" || detail?.status === "PAUSE"))) && (
                                                <CTableDataCell>
                                                    {(item?.isNew || item?.isEdit) && (
                                                        <CButton color='danger' className='me-1' onClick={() => {
                                                            var tmpOrder = { ...detail }
                                                            tmpOrder?.item.splice(idx, 1)
                                                            // // console.log(tmpOrder)
                                                            setDetail(tmpOrder)
                                                        }}>✗</CButton>
                                                    )}
                                                    {item?.isEdit && (
                                                        <>
                                                            <CButton color='info' onClick={(e) => {
                                                                var tmpOrder = { ...detail }
                                                                tmpOrder.item[idx] = {
                                                                    ...tmpOrder.item[idx],
                                                                    name: tmpOrder?.item[idx]?.name?.value,
                                                                    harga: tmpOrder?.item[idx]?.name?.harga,
                                                                    isEdit: false
                                                                };
                                                                setDetail(tmpOrder);
                                                                // updatePerItem(e, idx)    
                                                            }}>✓</CButton>

                                                        </>

                                                    )}
                                                    {!item.isNew && !item?.isEdit && (
                                                        <>
                                                            <CButton color='danger' className='me-1' onClick={() => {
                                                                var tmpOrder = { ...detail }
                                                                tmpOrder?.item.splice(idx, 1)
                                                                // // console.log(tmpOrder)
                                                                setDetail(tmpOrder)
                                                            }}>✗</CButton>
                                                            <CButton color='warning' onClick={() => {
                                                                var tmpOrder = { ...detail }
                                                                tmpOrder.item[idx] = {
                                                                    ...tmpOrder.item[idx],
                                                                    name: { value: tmpOrder.item[idx]?.name, label: tmpOrder.item[idx]?.name, harga: tmpOrder.item[idx]?.harga },
                                                                    isEdit: true
                                                                };
                                                                setDetail(tmpOrder);
                                                            }}><CIcon icon={cilPencil} /></CButton>
                                                        </>

                                                    )}
                                                </CTableDataCell>
                                            )}
                                            {/* {action === "detail" && (detail?.status === "AKTIF" || detail?.status === "PAUSE") && itemCafe && <CTableDataCell></CTableDataCell>} */}
                                            {
                                                item?.isNew || item?.isEdit ?
                                                    <>
                                                        {detail?.status === "AKTIF" && <CTableDataCell>
                                                            <CFormCheck id={`data-${idx}`}
                                                                checked={item?.statusPrint}
                                                                onChange={(e) => {
                                                                    var tmpItem = { ...detail }
                                                                    tmpItem.item[idx].statusPrint = e.target.checked
                                                                    setDetail(tmpItem)
                                                                }}
                                                            /></CTableDataCell>}
                                                        <CTableDataCell>
                                                            <CFormInput type="number" min={1} value={item?.qty} onChange={(e) => {
                                                                var tmpOrder = { ...detail }
                                                                // console.log(e.target.value)
                                                                console.log(item)
                                                                tmpOrder.item[idx] = { ...tmpOrder.item[idx], qty: e.target.value };
                                                                setDetail(tmpOrder)
                                                            }} />
                                                        </CTableDataCell>
                                                        <CTableDataCell>
                                                            {!itemCafe ? <ReactSelectAsync
                                                                defaultOptions
                                                                loadOptions={loadOption}
                                                                filterOption={filterOption}
                                                                styles={customStyles}
                                                                placeholder="Pilih Item"
                                                                value={item?.name}
                                                                menuPortalTarget={document.body}
                                                                onChange={(selected) => {
                                                                    var tmpOrder = { ...detail };
                                                                    const promoTime = selected?.endTime !== undefined ? { endTime: selected?.endTime, duration: selected?.duration }
                                                                        : { duration: selected?.duration }
                                                                    tmpOrder.item[idx] = {
                                                                        ...tmpOrder.item[idx],
                                                                        ...selected,
                                                                        name: selected,
                                                                        // harga: selected?.harga,
                                                                        // sub: selected?.menu,
                                                                        // isPromo: selected?.duration ? true : false,
                                                                        // isPromo: false,
                                                                        // id: selected?._id,
                                                                        // ...promoTime
                                                                    };
                                                                    console.log(tmpOrder.item[idx])
                                                                    setDetail(tmpOrder);
                                                                }}
                                                                formatGroupLabel={formatGroupLabel}
                                                                components={{
                                                                    GroupHeading: GroupHeading,
                                                                    Group: HideGroupChildren,
                                                                }}
                                                            /> : item?.name?.label}
                                                            {item?.addOns && item?.addOns?.length > 0 && (
                                                                <div className="mt-2">
                                                                    <strong>Add-ons:</strong>
                                                                    <ul className="mb-0">
                                                                        {item.addOns.map((addon, index) => (
                                                                            <li key={index} className="small">
                                                                                {addon.name} (+Rp. {formatNumber(addon.harga)})
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            )}
                                                            <CInputGroup className='mt-3'> <strong style={{ marginTop: "7px", marginRight: "10px" }}>Note: </strong>
                                                                <CFormInput value={item?.note} onChange={(e) => {
                                                                    var tmpItem = { ...detail }
                                                                    tmpItem.item[idx].note = e.target.value
                                                                    setDetail(tmpItem)
                                                                }}></CFormInput>
                                                            </CInputGroup>
                                                        </CTableDataCell>
                                                        <CTableDataCell><CFormInput type="text" value={formatNumber(item?.harga)} readOnly plainText /></CTableDataCell>
                                                        <CTableDataCell><CFormInput type="text" value={formatNumber(Number(item?.harga) * (item?.qty ? Number(item?.qty) : 1))} readOnly plainText /></CTableDataCell>
                                                    </> :
                                                    <>
                                                        {detail?.status === "AKTIF" && <CTableDataCell>
                                                            <CFormCheck id={`data-item-${idx}`}
                                                                checked={item?.statusPrint}
                                                                onChange={(e) => {
                                                                    var tmpItem = { ...detail }
                                                                    tmpItem.item[idx].statusPrint = e.target.checked
                                                                    setDetail(tmpItem)
                                                                }}
                                                            /></CTableDataCell>}
                                                        <CTableDataCell>
                                                            {detail?.status === "PAYMENT" ? <CInputGroup>
                                                                <CButton onClick={() => handleDecrease(idx, item)} color="danger"><b>-</b></CButton>
                                                                <CFormInput
                                                                    type="number"
                                                                    value={item?.qty}
                                                                    readOnly
                                                                    min={1}
                                                                    max={item?.qty}
                                                                />
                                                                <CButton value={item?.qty} onClick={(e) => handleIncrease(idx, item)} color="success"><b>+</b></CButton>
                                                            </CInputGroup>
                                                                : `${item?.qty}x`}</CTableDataCell>
                                                        <CTableDataCell>
                                                            {item?.name}
                                                            {item?.addOns && item?.addOns?.length > 0 && (
                                                                <div className="mt-2">
                                                                    <strong>Add-ons:</strong>
                                                                    <ul className="mb-0">
                                                                        {item.addOns.map((addon, index) => (
                                                                            <li key={index} className="small">
                                                                                {addon.name} (+Rp. {formatNumber(addon.harga)})
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            )}
                                                            <CInputGroup className='mt-3'> <strong style={{ marginTop: "7px", marginRight: "10px" }}>{
                                                                item?.tipe ? "Durasi :" : "Note :"
                                                            } </strong>
                                                                {action === "detail" && detail?.status === "AKTIF" ? <CFormInput value={item?.note} onChange={(e) => {
                                                                    var tmpItem = { ...detail }
                                                                    tmpItem.item[idx].note = e.target.value
                                                                    setDetail(tmpItem)
                                                                }}></CFormInput> : <div style={{ marginTop: "7px", marginRight: "10px" }}>
                                                                    {item.note}
                                                                </div>}
                                                            </CInputGroup>
                                                        </CTableDataCell>
                                                        <CTableDataCell>{formatNumber(item?.harga)}</CTableDataCell>
                                                        <CTableDataCell>{formatNumber(subTotal)}</CTableDataCell>
                                                    </>
                                            }

                                        </CTableRow>
                                    )
                                })}

                                {
                                    tmpCafe?.item.map((item, idx) => {
                                        var totalAddOn = item?.addOns ? item?.addOns?.reduce((total1, item1) => {
                                            return total1 + Number(item1.harga);
                                        }, 0) : 0
                                        return (
                                            <CTableRow key={idx}>
                                                <CTableDataCell>
                                                    <CButton color='danger' className='me-1' onClick={() => {
                                                        var tempCafe = { ...tmpCafe }
                                                        tempCafe?.item.splice(idx, 1)
                                                        setTmpCafe(tempCafe)
                                                    }}>✗</CButton>
                                                </CTableDataCell>
                                                {detail?.status === "AKTIF" && <CTableDataCell>
                                                    <CFormCheck id={`data-cafe-${idx}`}
                                                        checked={item?.statusPrint}
                                                        onChange={(e) => {
                                                            var tempCafe = { ...tmpCafe }
                                                            tempCafe.item[idx].statusPrint = e.target.checked
                                                            setTmpCafe(tempCafe)
                                                        }}
                                                    /></CTableDataCell>}
                                                <CTableDataCell>
                                                    <CFormInput type="number" min={1} defaultValue={item?.qty} onChange={(e) => {
                                                        var tempCafe = { ...tmpCafe }
                                                        tempCafe.item[idx].qty = e.target.value
                                                        setTmpCafe(tempCafe)
                                                    }} /></CTableDataCell>
                                                <CTableDataCell>
                                                    {item?.name}
                                                    {item?.addOns && item?.addOns?.length > 0 && (
                                                        <div className="mt-2">
                                                            <strong>Add-ons:</strong>
                                                            <ul className="mb-0">
                                                                {item.addOns.map((addon, index) => (
                                                                    <li key={index} className="small">
                                                                        {addon.name} (+Rp. {formatNumber(addon.harga)})
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                    <CInputGroup className='mt-3'> <strong style={{ marginTop: "7px", marginRight: "10px" }}>Note: </strong>
                                                        {action === "detail" && detail?.status === "AKTIF" ? <CFormInput value={item?.note} onChange={(e) => {
                                                            var tmpItem = { ...tmpCafe }
                                                            tmpItem.item[idx].note = e.target.value
                                                            setTmpCafe(tmpItem)
                                                        }}></CFormInput> : item.note}
                                                    </CInputGroup>
                                                </CTableDataCell>
                                                <CTableDataCell>
                                                    {formatNumber(Number(item?.harga))}
                                                </CTableDataCell>
                                                <CTableDataCell>
                                                    {formatNumber((Number(item?.harga) + Number(totalAddOn)) * Number(item?.qty))}
                                                </CTableDataCell>
                                            </CTableRow>
                                        )
                                    })
                                }
                                {(action === "detail" && (detail?.status === "AKTIF" || detail?.status === "PAUSE")) && <CTableRow>
                                    <CTableDataCell colSpan={6} ><CButton color='success' onClick={() => {
                                        var tmpOrder = { ...detail }
                                        tmpOrder?.item?.push({ qty: 1, harga: 0, name: "", isNew: true, category: "board game" })
                                        setDetail(tmpOrder)
                                    }}>+</CButton></CTableDataCell>
                                </CTableRow>}
                                <CTableRow>
                                    <CTableDataCell style={{ textAlign: "right" }} colSpan={action === "detail" && (detail?.status === "AKTIF" || detail?.status === "PAUSE") ? 5 : (detail?.status === "CLOSE" ? 3 : 4)}><b>Total</b></CTableDataCell>
                                    <CTableDataCell>{formatNumber(detail?.splitBill !== undefined ? hitungGrandTotal() : hitungSubTotal())}</CTableDataCell>

                                </CTableRow>

                                <CTableRow>
                                    <CTableDataCell colSpan={action === "detail" && (detail?.status === "AKTIF" || detail?.status === "PAUSE") ? 4 : (detail?.status === "CLOSE" ? 2 : 3)} style={{ textAlign: "right" }} >
                                        {detail?.status !== "CLOSE" && < CFormCheck inline id="service" style={{ marginRight: "10px" }}
                                            checked={isDiscount}
                                            onChange={(e) => {
                                                setIsDiscount(e.target.checked)
                                            }}
                                        />}
                                    </CTableDataCell>
                                    <CTableDataCell style={{ textAlign: "right" }}>
                                        {
                                            detail?.status === "CLOSE" ?
                                                <CFormLabel>Discount ({typeDiscount ? `${detail?.discount} %` : formatNumber(detail?.discount)})</CFormLabel>
                                                :
                                                <>
                                                    <CInputGroup style={{ width: "250px" }}>
                                                        <CFormLabel style={{ marginRight: "10px" }}>Discount </CFormLabel>
                                                        {!typeDiscount && <span className="input-group-text" id="basic-addon1" onClick={() => setTypeDiscount(!typeDiscount)}>
                                                            Rp.</span>}
                                                        <CFormInput type='text' style={{ width: "50px" }} value={formatNumber(detail?.discount)} onChange={(e) => { setDetail({ ...detail, discount: e.target.value.replace(/,/g, "") }) }} disabled={!isDiscount} />
                                                        {typeDiscount && <span className="input-group-text" id="basic-addon1" onClick={() => setTypeDiscount(!typeDiscount)}>
                                                            %</span>}
                                                    </CInputGroup>
                                                </>

                                        }
                                    </CTableDataCell>
                                    <CTableDataCell>{(() => {
                                        let harga = 0;
                                        var orderTotal = tmpCafe?.item.reduce((total, item) => {
                                            var totalAddOn = item?.addOns ? item?.addOns?.reduce((total1, item1) => {
                                                return total1 + Number(item1.harga);
                                            }, 0) : 0
                                            return total + totalAddOn + Number(item.harga * item.qty);
                                        }, 0)
                                        harga += (detail?.splitBill !== undefined && detail?.status === "PAYMENT" ? detail?.unpaidItems : detail?.item)?.reduce((total, item) => {

                                            if (detail?.status === "CLOSE" || ((item?.isPay || item?.payAt !== undefined) || detail?.status === "AKTIF")) {
                                                const totalAddOn = item?.addOns
                                                    ? item?.addOns?.reduce((total1, item1) => total1 + Number(item1.harga), 0)
                                                    : 0;

                                                return item?.addOns
                                                    ? total + ((Number(item.harga) + totalAddOn) * item.qty)
                                                    : total
                                            } else
                                                return total
                                        }, 0);

                                        harga += orderTotal
                                        var diskon = isDiscount ? (typeDiscount ? (harga * detail?.discount / 100) : detail?.discount) : 0
                                        return formatNumber(diskon);
                                    })()}</CTableDataCell>
                                </CTableRow>
                                <CTableRow>
                                    <CTableDataCell colSpan={action === "detail" && (detail?.status === "AKTIF" || detail?.status === "PAUSE") ? 4 : (detail?.status === "CLOSE" ? 2 : 3)} style={{ textAlign: "right" }} >
                                        {detail?.status !== "CLOSE" && <CFormCheck inline id="tax" style={{ marginRight: "10px" }}
                                            checked={isTax}
                                            onChange={(e) => {
                                                setIsTax(e.target.checked)
                                            }}
                                        />}
                                    </CTableDataCell>
                                    <CTableDataCell style={{ textAlign: "right" }}>
                                        {
                                            detail?.status === "CLOSE" ?
                                                <CFormLabel>PB1 ({detail?.tax < 1 && detail?.tax > 0 ? detail?.tax * 100 : detail?.tax} %)</CFormLabel>
                                                :
                                                <>
                                                    <CInputGroup>
                                                        <CFormLabel style={{ marginRight: "10px" }}>PB1 </CFormLabel>
                                                        <CFormInput type='number' min={0} max={20} value={detail?.tax < 1 && detail?.tax > 0 ? detail?.tax * 100 : detail?.tax} onChange={(e) =>
                                                            setDetail({ ...detail, tax: e.target.value })} />
                                                        <span className="input-group-text" id="basic-addon1">
                                                            %</span>
                                                    </CInputGroup>
                                                </>

                                        }
                                    </CTableDataCell>
                                    <CTableDataCell>{isTax ? formatNumber(hitungOrder(detail) * (detail?.tax < 1 && detail?.tax > 0 ? detail?.tax : detail?.tax / 100)) : 0}</CTableDataCell>
                                </CTableRow>
                                <CTableRow>
                                    <CTableDataCell style={{ textAlign: "right" }} colSpan={action === "detail" && (detail?.status === "AKTIF" || detail?.status === "PAUSE") ? 5 : (detail?.status === "CLOSE" ? 3 : 4)}><b>Grand Total</b></CTableDataCell>
                                    <CTableDataCell>{formatNumber(hitungGrandTotal())}</CTableDataCell>
                                </CTableRow>
                                {detail?.status === "PAYMENT" && <CTableRow>
                                    <CTableDataCell style={{ textAlign: "right" }} colSpan={4}><b>Total Bayar</b></CTableDataCell>
                                    <CTableDataCell>
                                        <CFormInput type="text"
                                            placeholder="Input Total Bayar"
                                            onChange={(e) => {
                                                // if (/^\d*$/.test(e.target.value)) setHarga(e.target.value)
                                                setInputBayar(e.target.value.replace(/,/g, ""))
                                            }}
                                            value={formatNumber(inputBayar)}
                                        />
                                    </CTableDataCell>
                                </CTableRow>}
                                {(detail?.paymentMethod !== "" && detail?.pay !== undefined) && <CTableRow>
                                    <CTableDataCell style={{ textAlign: "right" }} colSpan={3}><b>{titleCase(detail?.paymentMethod)}</b></CTableDataCell>
                                    <CTableDataCell>
                                        <b>{formatNumber(detail?.pay)}</b>
                                    </CTableDataCell>
                                </CTableRow>}
                                {(detail?.status === "PAYMENT") && <CTableRow>
                                    <CTableDataCell style={{ textAlign: "right" }} colSpan={4}><b>Kembali</b></CTableDataCell>
                                    <CTableDataCell>{formatNumber(Math.max(0, inputBayar - hitungGrandTotal()))}</CTableDataCell>
                                </CTableRow>}
                                {(detail?.paymentMethod !== "" && detail?.pay !== undefined) && <CTableRow>
                                    <CTableDataCell style={{ textAlign: "right" }} colSpan={3}><b>Kembali</b></CTableDataCell>
                                    <CTableDataCell>{formatNumber(Math.max(0, detail?.pay - hitungGrandTotal()))}</CTableDataCell>
                                </CTableRow>}
                            </CTableBody>
                        </CTable>
                        {(detail?.status === "PAYMENT" && paymentMethod === "cash") && (detail?.tableName !== "grabfood" && detail?.tableName !== "gofood") && (
                            <CContainer fluid>
                                <CCard className="mt-4">
                                    <CCardHeader className="text-center">
                                        <strong>Input Nominal Bayar</strong>
                                    </CCardHeader>
                                    <CCardBody>
                                        <CRow className="g-3">
                                            <CCol xs={6}>
                                                <CCard
                                                    className="py-4 input-bayar text-center w-100"
                                                    onClick={() => setInputBayar(prev => Number(prev) + 100000)}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    <h2>+100.000</h2>
                                                </CCard>
                                            </CCol>
                                            <CCol xs={6}>
                                                <CCard
                                                    className="py-4 input-bayar text-center w-100"
                                                    onClick={() => setInputBayar(prev => Number(prev) + 50000)}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    <h2>+50.000</h2>
                                                </CCard>
                                            </CCol>
                                            <CCol xs={6}>
                                                <CCard
                                                    className="py-4 input-bayar text-center w-100"
                                                    onClick={() => setInputBayar(prev => Number(prev) + 10000)}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    <h2>+10.000</h2>
                                                </CCard>
                                            </CCol>
                                            <CCol xs={6}>
                                                <CCard
                                                    className="py-4 input-bayar text-center w-100"
                                                    onClick={() => setInputBayar(0)}
                                                    style={{ cursor: 'pointer', backgroundColor: '#f8d7da' }}
                                                >
                                                    <h2>0</h2>
                                                </CCard>
                                            </CCol>
                                        </CRow>
                                    </CCardBody>
                                </CCard>
                            </CContainer>

                        )}

                        {detail?.status === "PAYMENT" && (detail?.tableName !== "grabfood" && detail?.tableName !== "gofood") &&
                            <CContainer className='mb-3'>
                                <CRow className="justify-content-center mt-5">
                                    <CCol>
                                        <CCard>
                                            <CCardHeader className="text-center">
                                                <h5>Pilih Metode Pembayaran</h5>
                                            </CCardHeader>
                                            <CCardBody>
                                                <CRow className="mb-3">
                                                    <CCol md="4" className="mb-3">
                                                        <CCard
                                                            className={`p-3 ${paymentMethod === 'cash' ? 'border-primary' : ''}`}
                                                            onClick={() => handlePaymentChange('cash')}
                                                            style={{ cursor: 'pointer', height: "125px" }}
                                                        >
                                                            <CFormLabel htmlFor="cash" className="font-weight-bold">
                                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                    <CIcon icon={cilCash} size="3xl" />
                                                                    <CFormLabel htmlFor="ccard" className="font-weight-bold" style={{ paddingTop: "10px", paddingLeft: "10px" }}>Tunai</CFormLabel>
                                                                </div>
                                                            </CFormLabel>
                                                            <p className="small text-muted">Bayar dengan menggunakan uang tunai.</p>
                                                        </CCard>
                                                    </CCol>
                                                    <CCol md="4" className="mb-3">
                                                        <CCard
                                                            className={`p-3 ${paymentMethod === 'qris' ? 'border-primary' : ''}`}
                                                            onClick={() => handlePaymentChange('qris')}
                                                            style={{ cursor: 'pointer', height: "125px" }}
                                                        >
                                                            <CFormLabel htmlFor="cash" className="font-weight-bold">
                                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                    <img src={qrisIcon} alt="QRIS" width={80} className="mr-2" />
                                                                    <CFormLabel htmlFor="ccard" className="font-weight-bold" style={{ paddingTop: "10px", paddingLeft: "10px" }}>QRIS</CFormLabel>
                                                                </div>
                                                            </CFormLabel>
                                                            {/* <CFormLabel htmlFor="cash" className="font-weight-bold">Non Tunai</CFormLabel> */}
                                                            <p className="small text-muted">Bayar dengan menggunakan QRIS</p>
                                                        </CCard>
                                                    </CCol>
                                                    <CCol md="4" className="mb-3">
                                                        <CCard
                                                            className={`p-3 ${paymentMethod === 'debit' ? 'border-primary' : ''}`}
                                                            onClick={() => handlePaymentChange('debit')}
                                                            style={{ cursor: 'pointer', height: "125px" }}
                                                        >
                                                            <CFormLabel htmlFor="cash" className="font-weight-bold">
                                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                    {/* <img src={qrisIcon} alt="QRIS" width={80} className="mr-2" /> */}
                                                                    <CIcon icon={cilCreditCard} size="3xl"></CIcon>
                                                                    <CFormLabel htmlFor="ccard" className="font-weight-bold" style={{ paddingTop: "10px", paddingLeft: "10px" }}>Kartu Debit</CFormLabel>
                                                                </div>
                                                            </CFormLabel>
                                                            {/* <CFormLabel htmlFor="cash" className="font-weight-bold">Non Tunai</CFormLabel> */}
                                                            <p className="small text-muted">Bayar dengan menggunakan uang non tunai.</p>
                                                        </CCard>
                                                    </CCol>
                                                </CRow>
                                            </CCardBody>
                                        </CCard>
                                    </CCol>
                                </CRow>
                            </CContainer>}
                        <CModalFooter>
                            {action === "pay" &&
                                detail?.status === "PAYMENT" && <CButton className='w-100' color="primary" onClick={(e) => {
                                    handlePrintClick(detail, inputBayar - hitungGrandTotal())
                                }}>Bayar</CButton>
                            }
                        </CModalFooter>
                        {detail?.splitBill !== undefined && <CTable>
                            <CTableHead>
                                <CTableRow>
                                    {(action !== "detail" && (detail?.status === "PAYMENT")) && <CTableHeaderCell className='d-flex flex-row' style={{ width: "150px" }}>
                                        <CFormCheck style={{ marginRight: "10px" }}
                                            checked={selectAll}
                                            onChange={(e) => {
                                                const checked = e.target.checked;
                                                setSelectAll(checked)
                                                setDetail(prevDetail => {
                                                    var updatedItem = { ...prevDetail }
                                                    if (prevDetail?.splitBill !== undefined) {
                                                        // tmpItem.unpaidItems[idx].isPay = e.target.checked
                                                        updatedItem = prevDetail.unpaidItems?.map(item => ({
                                                            ...item,
                                                            isPay: checked, // atau !item.isPay jika toggle
                                                        })) || [];
                                                        return {
                                                            ...prevDetail,
                                                            unpaidItems: updatedItem,
                                                        };
                                                    } else {
                                                        // tmpItem.unpaidItems[idx].isPay = e.target.checked
                                                        updatedItem = prevDetail.item?.map(item => ({
                                                            ...item,
                                                            isPay: checked, // atau !item.isPay jika toggle
                                                        })) || [];
                                                        return {
                                                            ...prevDetail,
                                                            item: updatedItem,
                                                        };
                                                    }
                                                });
                                            }} /><div>Pay</div></CTableHeaderCell>}
                                    {(action === "detail" && (detail?.status === "AKTIF" || detail?.status === "PAUSE")) && <CTableHeaderCell style={{ width: "110px" }}>Action</CTableHeaderCell>}
                                    {detail?.status === "AKTIF" && <CTableHeaderCell style={{ width: "100px" }}>Print</CTableHeaderCell>}
                                    <CTableHeaderCell style={{ width: detail?.status === "PAYMENT" ? "170px" : "100px" }}>Qty</CTableHeaderCell>
                                    <CTableHeaderCell style={{ width: "400px" }}>Item</CTableHeaderCell>
                                    <CTableHeaderCell style={{ width: "200px" }}>Harga</CTableHeaderCell>
                                    <CTableHeaderCell style={{ width: "200px" }}>Sub Total</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {detail?.splitBill?.map((transaction, idxTx) => {
                                    var element = []
                                    var orderTotal = transaction?.item?.reduce((sum, item) => {
                                        var itemCafe = item.hasOwnProperty("addOns")
                                        var totalAddOn = itemCafe ? item?.addOns?.reduce((total1, item1) => {
                                            return total1 + Number(item1.harga);
                                        }, 0) : 0
                                        var subTotal = ((Number(item?.harga) + Number(itemCafe ? totalAddOn : 0)) * (item?.qty ? item?.qty : 1))
                                        if (itemCafe) return sum + subTotal;
                                        else return sum
                                    }, 0)
                                    var tableTotal = transaction?.item?.reduce((sum, item) => {
                                        if (item?.tipe !== undefined) {
                                            return sum + (Number(item?.harga) * Number(item?.qty));
                                        } else {
                                            return sum
                                        }
                                    }, 0)
                                    var taxTotal = transaction?.tax > 0 ? Number(orderTotal) * transaction?.tax : 0
                                    var discountTotal = (transaction?.typeDiscount ? (Number(orderTotal) * transaction?.discount > 1 ? transaction?.discount / 100 : transaction?.discount) : 0)
                                    var grandTotal = (orderTotal + tableTotal) + taxTotal - discountTotal
                                    element.push(<CTableHeaderCell colSpan={5}>Transaction - {idxTx + 1} {`(${transaction?.paymentMethod?.toUpperCase()} ${moment(transaction?.createdAt).format("DD MMMM YYYY  HH:mm:ss").toString()})`}</CTableHeaderCell>)
                                    element.push(transaction?.item?.map((item, idx) => {
                                        var itemCafe = item.hasOwnProperty("addOns")
                                        var totalAddOn = itemCafe ? item?.addOns?.reduce((total1, item1) => {
                                            return total1 + Number(item1.harga);
                                        }, 0) : 0
                                        var subTotal = ((Number(item?.harga) + Number(itemCafe ? totalAddOn : 0)) * (item?.qty ? item?.qty : 1))

                                        var orderTotal = tmpCafe?.item.reduce((total, item) => {
                                            var totalAddOn = item?.addOns ? item?.addOns?.reduce((total1, item1) => {
                                                return total1 + Number(item1.harga);
                                            }, 0) : 0
                                            return total + totalAddOn + Number(item.harga * item.qty);
                                        }, 0)
                                        // var boardGame = Number(item?.harga ? item?.harga : 0) * Number(item?.qty ? item?.qty : 1)
                                        // var grandTotal = (orderTotal ? orderTotal : 0) + boardGame
                                        return (
                                            <>
                                                <CTableRow key={idx}>

                                                    {detail?.status !== "CLOSE" && <CTableDataCell>
                                                        <CButton color='danger' className='me-1' onClick={async () => {
                                                            var tmpOrder = { ...detail }
                                                            if (tmpOrder?.splitBill !== undefined) {
                                                                // tmpOrder?.splitBill[idx]?.item?.map(async (data) => {
                                                                //     var tmpDetail = tmpOrder?.unpaidItems.map((data1) => {
                                                                //         if (data1?.id === data?.id) {
                                                                //             return { ...data1, qty: Number(data1?.qty) + Number(data?.qty) }
                                                                //         }
                                                                //         else return { ...data1 }
                                                                //     })
                                                                //     // tmpOrder.unpaidItems = tmpDetail
                                                                //     console.log(tmpDetail, "detail")

                                                                // })
                                                                // tmpOrder?.unpaidItems?.map((data) => {
                                                                //     var tmpDetail = tmpOrder?.splitBill[idx]?.item?.map((data1) => {
                                                                //         if (data1?.id === data?.id) {
                                                                //             return { ...data1, qty: Number(data1?.qty) + Number(data?.qty) }
                                                                //         }
                                                                //         else return { ...data1 }
                                                                //     })
                                                                //     // tmpOrder.unpaidItems = tmpDetail
                                                                //     console.log(tmpDetail, "detail")
                                                                // })
                                                                const mergedData = mergeData(tmpOrder?.unpaidItems, tmpOrder?.splitBill[idxTx]?.item)
                                                                tmpOrder?.splitBill.splice(idxTx, 1)
                                                                setModal(false)
                                                                setRefresh(!refresh)
                                                                if (tmpOrder?.splitBill.length === 0) {
                                                                    await api.put("/data/update", {
                                                                        collection: "tableHistory",
                                                                        filter: { _id: tmpOrder?._id },
                                                                        update: {
                                                                            $unset: {
                                                                                unpaidItems: [],
                                                                                splitBill: []
                                                                            }
                                                                        }
                                                                    });
                                                                } else {
                                                                    await api.put("/data/update", {
                                                                        collection: "tableHistory",
                                                                        filter: { _id: tmpOrder?._id },
                                                                        update: {
                                                                            $set: {
                                                                                unpaidItems: mergedData,
                                                                                splitBill: tmpOrder?.splitBill
                                                                            }
                                                                        }
                                                                    });
                                                                }

                                                            } else {
                                                                tmpOrder?.item.splice(idx, 1)
                                                                setDetail(tmpOrder)
                                                            }
                                                            // // console.log(tmpOrder)
                                                        }}>✗</CButton>
                                                    </CTableDataCell>}

                                                    {/* {action === "detail" && (detail?.status === "AKTIF" || detail?.status === "PAUSE") && itemCafe && <CTableDataCell></CTableDataCell>} */}
                                                    {
                                                        item?.isNew || item?.isEdit ?
                                                            <>
                                                                {detail?.status === "AKTIF" && <CTableDataCell>
                                                                    <CFormCheck id={`data-${idx}`}
                                                                        checked={item?.statusPrint}
                                                                        onChange={(e) => {
                                                                            var tmpItem = { ...detail }
                                                                            tmpItem.item[idx].statusPrint = e.target.checked
                                                                            setDetail(tmpItem)
                                                                        }}
                                                                    /></CTableDataCell>}
                                                                <CTableDataCell>
                                                                    <CFormInput type="number" min={1} value={item?.qty} onChange={(e) => {
                                                                        var tmpOrder = { ...detail }
                                                                        // console.log(e.target.value)
                                                                        console.log(item)
                                                                        tmpOrder.item[idx] = { ...tmpOrder.item[idx], qty: e.target.value };
                                                                        setDetail(tmpOrder)
                                                                    }} />
                                                                </CTableDataCell>
                                                                <CTableDataCell>
                                                                    {!itemCafe ? <ReactSelectAsync
                                                                        defaultOptions
                                                                        loadOptions={loadOption}
                                                                        filterOption={filterOption}
                                                                        styles={customStyles}
                                                                        placeholder="Pilih Item"
                                                                        value={item?.name}
                                                                        menuPortalTarget={document.body}
                                                                        onChange={(selected) => {
                                                                            var tmpOrder = { ...detail };
                                                                            const promoTime = selected?.endTime !== undefined ? { endTime: selected?.endTime, duration: selected?.duration }
                                                                                : { duration: selected?.duration }
                                                                            tmpOrder.item[idx] = {
                                                                                ...tmpOrder.item[idx],
                                                                                ...selected,
                                                                                name: selected,
                                                                                // harga: selected?.harga,
                                                                                // sub: selected?.menu,
                                                                                // isPromo: selected?.duration ? true : false,
                                                                                // isPromo: false,
                                                                                // id: selected?._id,
                                                                                // ...promoTime
                                                                            };
                                                                            console.log(tmpOrder.item[idx])
                                                                            setDetail(tmpOrder);
                                                                        }}
                                                                        formatGroupLabel={formatGroupLabel}
                                                                        components={{
                                                                            GroupHeading: GroupHeading,
                                                                            Group: HideGroupChildren,
                                                                        }}
                                                                    /> : item?.name?.label}
                                                                    {item?.addOns && item?.addOns?.length > 0 && (
                                                                        <div className="mt-2">
                                                                            <strong>Add-ons:</strong>
                                                                            <ul className="mb-0">
                                                                                {item.addOns.map((addon, index) => (
                                                                                    <li key={index} className="small">
                                                                                        {addon.name} (+Rp. {formatNumber(addon.harga)})
                                                                                    </li>
                                                                                ))}
                                                                            </ul>
                                                                        </div>
                                                                    )}
                                                                    <CInputGroup className='mt-3'> <strong style={{ marginTop: "7px", marginRight: "10px" }}>Note: </strong>
                                                                        <CFormInput value={item?.note} onChange={(e) => {
                                                                            var tmpItem = { ...detail }
                                                                            tmpItem.item[idx].note = e.target.value
                                                                            setDetail(tmpItem)
                                                                        }}></CFormInput>
                                                                    </CInputGroup>
                                                                </CTableDataCell>
                                                                <CTableDataCell><CFormInput type="text" value={formatNumber(item?.harga)} readOnly plainText /></CTableDataCell>
                                                                <CTableDataCell><CFormInput type="text" value={formatNumber(Number(item?.harga) * (item?.qty ? Number(item?.qty) : 1))} readOnly plainText /></CTableDataCell>
                                                            </> :
                                                            <>
                                                                {detail?.status === "AKTIF" && <CTableDataCell>
                                                                    <CFormCheck id={`data-item-${idx}`}
                                                                        checked={item?.statusPrint}
                                                                        onChange={(e) => {
                                                                            var tmpItem = { ...detail }
                                                                            tmpItem.item[idx].statusPrint = e.target.checked
                                                                            setDetail(tmpItem)
                                                                        }}
                                                                    /></CTableDataCell>}
                                                                <CTableDataCell>{item?.qty}x</CTableDataCell>
                                                                <CTableDataCell>
                                                                    {item?.name}
                                                                    {item?.addOns && item?.addOns?.length > 0 && (
                                                                        <div className="mt-2">
                                                                            <strong>Add-ons:</strong>
                                                                            <ul className="mb-0">
                                                                                {item.addOns.map((addon, index) => (
                                                                                    <li key={index} className="small">
                                                                                        {addon.name} (+Rp. {formatNumber(addon.harga)})
                                                                                    </li>
                                                                                ))}
                                                                            </ul>
                                                                        </div>
                                                                    )}
                                                                    <CInputGroup className='mt-3'> <strong style={{ marginTop: "7px", marginRight: "10px" }}>{
                                                                        item?.tipe ? "Durasi :" : "Note :"
                                                                    } </strong>
                                                                        {action === "detail" && detail?.status === "AKTIF" ? <CFormInput value={item?.note} onChange={(e) => {
                                                                            var tmpItem = { ...detail }
                                                                            tmpItem.item[idx].note = e.target.value
                                                                            setDetail(tmpItem)
                                                                        }}></CFormInput> : <div style={{ marginTop: "7px", marginRight: "10px" }}>
                                                                            {item.note}
                                                                        </div>}
                                                                    </CInputGroup>
                                                                </CTableDataCell>
                                                                <CTableDataCell>{formatNumber(item?.harga)}</CTableDataCell>
                                                                <CTableDataCell>{formatNumber(subTotal)}</CTableDataCell>
                                                            </>
                                                    }

                                                </CTableRow>
                                            </>
                                        )
                                    }))
                                    element.push(<CTableRow>
                                        <CTableDataCell style={{ textAlign: "right" }} colSpan={action === "detail" && (detail?.status === "AKTIF" || detail?.status === "PAUSE") ? 5 : (detail?.status === "CLOSE" ? 3 : 4)}><b>Total</b></CTableDataCell>
                                        <CTableDataCell>{formatNumber(orderTotal + tableTotal)}</CTableDataCell>
                                    </CTableRow>)
                                    element.push(
                                        <CTableRow>
                                            <CTableDataCell colSpan={action === "detail" && (detail?.status === "AKTIF" || detail?.status === "PAUSE") ? 4 : (detail?.status === "CLOSE" ? 2 : 3)} style={{ textAlign: "right" }} >

                                            </CTableDataCell>
                                            <CTableDataCell style={{ textAlign: "right" }}>
                                                <CFormLabel style={{ marginRight: "10px" }}>Discount ({transaction?.typeDiscount ? `${transaction?.discount * 100} %` : formatNumber(transaction?.discount)})</CFormLabel>
                                            </CTableDataCell>
                                            <CTableDataCell>{formatNumber(discountTotal)}</CTableDataCell>
                                        </CTableRow>)
                                    element.push(<CTableRow>
                                        <CTableDataCell colSpan={action === "detail" && (detail?.status === "AKTIF" || detail?.status === "PAUSE") ? 4 : (detail?.status === "CLOSE" ? 2 : 3)} style={{ textAlign: "right" }} >

                                        </CTableDataCell>
                                        <CTableDataCell style={{ textAlign: "right" }}>
                                            <CFormLabel style={{ marginRight: "10px" }}>PB1 ({transaction?.tax < 1 && transaction?.tax > 0 ? transaction?.tax * 100 : transaction?.tax} %)</CFormLabel>
                                        </CTableDataCell>
                                        <CTableDataCell>{formatNumber(taxTotal)}</CTableDataCell>
                                    </CTableRow>)
                                    element.push(<CTableRow>
                                        <CTableDataCell style={{ textAlign: "right" }} colSpan={action === "detail" && (detail?.status === "AKTIF" || detail?.status === "PAUSE") ? 5 : (detail?.status === "CLOSE" ? 3 : 4)}><b>Grand Total</b></CTableDataCell>
                                        <CTableDataCell>{formatNumber(grandTotal)}</CTableDataCell>
                                    </CTableRow>)
                                    if (detail?.status === "PAYMENT") {
                                        element.push(<CTableRow>
                                            <CTableDataCell style={{ textAlign: "right" }} colSpan={4}><b>Total Bayar</b></CTableDataCell>
                                            <CTableDataCell>
                                                <CFormLabel>{formatNumber(transaction?.pay)}</CFormLabel>
                                            </CTableDataCell>
                                        </CTableRow>)
                                    }
                                    if (detail?.paymentMethod !== "" && detail?.pay !== undefined) {
                                        element.push(<CTableRow>
                                            <CTableDataCell style={{ textAlign: "right" }} colSpan={3}><b>{titleCase(transaction?.paymentMethod)}</b></CTableDataCell>
                                            <CTableDataCell>
                                                <b>{formatNumber(transaction?.pay)}</b>
                                            </CTableDataCell>
                                        </CTableRow>)
                                    }
                                    if ((detail?.status === "PAYMENT")) {
                                        element.push(<CTableRow>
                                            <CTableDataCell style={{ textAlign: "right" }} colSpan={4}><b>Kembali</b></CTableDataCell>
                                            <CTableDataCell>{formatNumber(Math.max(0, transaction?.pay - grandTotal))}</CTableDataCell>
                                        </CTableRow>)
                                    }
                                    return element
                                })}
                            </CTableBody>
                        </CTable>}
                    </CContainer>
                    <CModalFooter>
                        {action === "detail" ?
                            <>
                                {/* {tmpCafe === undefined && <CButton color="warning" onClick={(e) => navigate('/order/add', { state: { table: detail, cafe: cafe, action: "open", tmpTable: { client: client, usePromo: usePromo, promo: promo, meja: meja === "" ? detail : meja } } })}>Update Order</CButton>}
                        {tmpCafe !== undefined && <CButton color="warning" onClick={(e) => {
                            sessionStorage.setItem("cartItems", JSON.stringify(tmpCafe?.item))
                            navigate('/order/add', { state: { table: detail, cafe: cafe, action: "open", tmpTable: { client: client, usePromo: usePromo, promo: promo, meja: meja === "" ? detail : meja } } })
                        }} */}
                                {detail?.status === "AKTIF" && <CButton color="primary" className="me-2" onClick={() => {
                                    handlePrintOrder(detail, "printOrder")
                                }}>Print Order</CButton>}
                                {(detail?.status === "AKTIF" || detail?.status === "PAUSE") && (!loading ? <CButton color="success" onClick={(e) => updateOrder(e)}>Update Order List</CButton> : <CSpinner color="primary" className="float-end" variant="grow" />)}
                                {(detail?.status === "AKTIF" || detail?.status === "PAUSE") &&
                                    (!loading ? <CButton color="warning" onClick={(e) => {
                                        // sessionStorage.setItem("cartItems", JSON.stringify(detail?.item?.filter((item) => item.hasOwnProperty("addOns"))));
                                        sessionStorage.setItem("cartItems", JSON.stringify([]))

                                        navigate("/order/add", { state: { table: detail, cafe: cafe, action: "detail", tmpTable: detail } })
                                    }}>Tambah Order Cafe</CButton> : <CSpinner color="primary" className="float-end" variant="grow" />)}
                                <CButton color="danger" onClick={() => setModal(false)}>Close</CButton>
                            </>
                            :
                            <>
                                {/* {detail?.status === "PAYMENT" && <CButton color="primary" onClick={(e) => {
                                    handlePrintClick(detail, inputBayar - hitungGrandTotal())
                                }}>Bayar</CButton>} */}
                                <CButton color="danger" onClick={() => setModal(false)}>Close</CButton>
                            </>}
                    </CModalFooter>
                </CModalBody>
            </CModal>
        </Suspense>
    )
}

export default Table
