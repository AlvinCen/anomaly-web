import React, { Suspense, useEffect, useState } from 'react'
import classNames from 'classnames'

import {
  CAlert,
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
  CLink,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CProgress,
  CRow,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTooltip,
  CWidgetStatsF,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cibCcAmex,
  cibCcApplePay,
  cibCcMastercard,
  cibCcPaypal,
  cibCcStripe,
  cibCcVisa,
  cibGoogle,
  cibFacebook,
  cibLinkedin,
  cifBr,
  cifEs,
  cifFr,
  cifIn,
  cifPl,
  cifUs,
  cibTwitter,
  cilCloudDownload,
  cilPeople,
  cilUser,
  cilUserFemale,
  cilChartPie,
  cilArrowRight,
  cilMoney,
  cilCash,
  cilPaperclip,
  cilPaperPlane,
  cilCheck,
  cilDataTransferDown,
  cilPencil,
  cilEnvelopeClosed,
  cilGift,
  cilCoffee,
  cilTablet,
} from '@coreui/icons'
import WidgetsBrand from '../widgets/WidgetsBrand'
import WidgetsDropdown from '../widgets/WidgetsDropdown'
import MainChart from './MainChart'
import { NavLink } from 'react-router-dom'
import AppTable from '../../components/AppTable'
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc, Timestamp, where } from 'firebase/firestore'
import moment from 'moment-timezone'
import { formatNumber } from 'chart.js/helpers'
import Loading from '../../components/Loading'
import Swal from 'sweetalert2'
import { ConsoleView } from 'react-device-detect'
import api from '../../axiosInstance'

const Report = () => {
  const [isLoading,] = useState(false)
  const [loadingInit, setLoadingInit] = useState(false)
  const [today, setToday] = useState(0)
  const [income, setIncome] = useState(0)
  const [editDate, setEditDate] = useState("")
  const [editTimeIn, setEditTimeIn] = useState("")
  const [editTimeOut, setEditTimeOut] = useState("")
  const [isEditDate, setIsEditDate] = useState(false)
  const [isEditTimeIn, setIsEditTimeIn] = useState(false)
  const [isEditTimeOut, setIsEditTimeOut] = useState(false)
  const [waktu, setWaktu] = useState("")
  const [tanggal, setTanggal] = useState(moment().format())
  const [detail, setDetail] = useState([])
  const [hapus, setHapus] = useState([])
  const [col, setCol] = useState("")
  const [title, setTitle] = useState("")

  const [startProductDate, setStartProductDate] = useState(moment().format("YYYY-MM-DD").toString());
  const [endProductDate, setEndProductDate] = useState(moment().format("YYYY-MM-DD").toString());

  const [productData, setProductData] = useState([]);
  const [filterProduct, setFilterProduct] = useState([]);

  const [activeBtn, setActiveBtn] = useState("Day")
  const [activeBtnCafe, setActiveBtnCafe] = useState("Day")
  const [initDataCafe, setInitDataCafe] = useState(false)
  const [initData, setInitData] = useState(false)
  const [dataCafe, setDataCafe] = useState([])
  const [initDataMerch, setInitDataMerch] = useState(false)
  const [dataMerch, setDataMerch] = useState([])
  const [data, setData] = useState([])
  const [total, setTotal] = useState([])
  const [table, setTable] = useState([])
  const [cafe, setCafe] = useState([])
  const [cashCafe, setCashCafe] = useState([])
  const [qrisCafe, setQrisCafe] = useState([])
  const [tax, setTax] = useState([])
  const [service, setService] = useState([])
  // const [service, set] = useState([])
  const [filterData, setFilterData] = useState([])
  const [startDate, setStartDate] = useState(moment().format("YYYY-MM-DD").toString());
  const [endDate, setEndDate] = useState(moment().add("1", "days").format("YYYY-MM-DD").toString());
  const [startDateCafe, setStartDateCafe] = useState(moment().format("YYYY-MM-DD").toString());
  const [endDateCafe, setEndDateCafe] = useState(moment().add("1", "days").format("YYYY-MM-DD").toString());
  const [action, setAction] = useState(null)
  const [visible, setVisible] = useState(false)
  const [refresh, setRefresh] = useState(false)

  const [saldoAwal, setSaldoAwal] = useState("");
  const [saldoAkhir, setSaldoAkhir] = useState("");
  const [pemasukan, setPemasukan] = useState("");
  const [pengeluaran, setPengeluaran] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState('');

  const [saldoAwalCafe, setSaldoAwalCafe] = useState("");
  const [saldoAkhirCafe, setSaldoAkhirCafe] = useState("");
  const [errorCafe, setErrorCafe] = useState('');
  const [loading, setLoading] = useState(false)

  const [init, setInit] = useState(false)
  const [initCafe, setInitCafe] = useState(false)
  const [initProduct, setInitProduct] = useState(false)
  const [cashier, setCashier] = useState([])
  const [detailCashier, setDetailCashier] = useState([])
  const [detailCashierCafe, setDetailCashierCafe] = useState([])
  const [cashierCafe, setCashierCafe] = useState([])

  const tmpCashier = cashier.find((data) => data?.status === "OPEN")
  const tmpCashierCafe = cashierCafe.find((data) => data?.status === "OPEN")

  var tmpData = data.filter((data) => {
    return moment(data?.createdAt).isBetween(moment(tmpCashier?.createdAt?.toDate()).format(), moment("23:59", "HH:mm").format()) && data?.status !== "AKTIF"
  })
  var tmpCash = tmpData.filter((data) => {
    return data?.paymentMethod === "cash" || data?.paymentMethod === undefined
  }).reduce((total, data) => {
    var harga = data?.hargaVoid ? data?.hargaVoid : data?.harga
    return Number(total) + Number(harga)
  }, 0)
  var tmpPemasukan = tmpCashier?.pemasukan?.reduce((total, data) => { return total + data?.value }, 0)
  var tmpPengeluaran = tmpCashier?.pengeluaran?.reduce((total, data) => { return total + data?.value }, 0)
  var selisih = (tmpCashier?.saldoAkhir ? tmpCashier?.saldoAkhir : saldoAkhir) - (tmpCashier?.saldoAwal + tmpCash + tmpPemasukan - tmpPengeluaran)


  // var tmpDataCafe = dataCafe.filter((data) => {
  //   return moment(data?.createdAt).isBetween(moment(tmpCashierCafe?.createdAt?.toDate()).format(), moment("23:59", "HH:mm").format())
  // })


  // var tmpCashCafe = tmpDataCafe.filter((data) => {
  //   return data?.paymentMethod === "cash"
  // }).reduce((total, data) => {
  //   var grandTotal = data?.pay === 0 ? "0" : data?.grandTotal
  //   return Number(total) + Number(grandTotal)
  // }, 0)
  // var tmpPemasukanCafe = tmpCashierCafe?.pemasukan?.reduce((total, data) => { return total + data?.value }, 0)
  // var tmpPengeluaranCafe = tmpCashierCafe?.pengeluaran?.reduce((total, data) => { return total + data?.value }, 0)
  // var selisihCafe = (tmpCashierCafe?.saldoAkhir ? tmpCashierCafe?.saldoAkhir : saldoAkhirCafe) - (tmpCashierCafe?.saldoAwal + tmpCashCafe + tmpPemasukanCafe - tmpPengeluaranCafe)

  const calculateIncome = () => {
    var tmpData = data.filter((data) => { return moment().isSame(data?.createdAt, "days") && data?.status === "CLOSE" })
    // const total = tmpData?.reduce((total, data) => {
    //   return total + data?.item.reduce((totalItem, item) => {
    //     return totalItem + Number(item?.harga * item?.qty)
    //   }, total)
    // }, 0)
    const total = tmpData?.reduce((total, data) => {
      return total + data?.harga
    }, 0)
    setIncome(total)
    setToday(tmpData?.length)
  }

  // Fungsi untuk mengambil data booking
  const fetchBookings = async () => {
    try {
      const response = await api.post('/data', {
        collection: "booking",
        filter: {},
        sort: {}
      })
      setData(response.data);
      setInitData(true);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      // Swal.fire('Error', 'Gagal memuat data booking', 'error');
    }
  };

  // Fungsi untuk mengambil data cashier
  const fetchCashiers = async () => {
    try {
      const response = await api.post('/data', {
        collection: "cashier",
        filter: {},
        sort: {}
      })
      setCashier(response.data);
      setInit(true);
    } catch (error) {
      console.error('Error fetching cashiers:', error);
    }
  };

  // Fungsi untuk menghapus data
  const deleteData = async (collectionName, id) => {
    try {
      await api.delete("/data/delete", {
        data: {
          collection: collectionName,
          filter: { _id: id }
        }
      });

      Swal.fire("Deleted!", "Data berhasil dihapus", "success");
      // Refresh data
      if (collectionName === "cashier") {
        await fetchCashiers();
      } else if (collectionName === "cashierCafe") {
        // fetch cashier cafe jika perlu
      }
    } catch (error) {
      console.error('Error deleting data:', error);
      Swal.fire("Failed!", "Gagal menghapus data", "error");
    }
  };


  // ==================== USE EFFECT ====================

  useEffect(() => {
    // Load data awal
    const loadData = async () => {
      await fetchBookings();
      await fetchCashiers();
      // Load data lainnya jika perlu
    };

    loadData();
  }, [refresh]);

  //   useEffect(() => {
  //     if (Object.keys(hapus).length > 0) {
  //       Swal.fire({
  //         title: "Konfirmasi",
  //         html: `<p>Apakah anda yakin menghapus data <b>${hapus?.id}</b>?</p>`,
  //         icon: "warning",
  //         showCancelButton: true,
  //         confirmButtonColor: "#3085d6",
  //         cancelButtonColor: "#d33",
  //         confirmButtonText: "Ya",
  //         cancelButtonText: "Batal"
  //       }).then(async (result) => {
  //         if (result.isConfirmed) {
  //           const col = cashier?.find((data) => data?.id === hapus?.id) ? "cashier" : "cashierCafe";
  //           await deleteData(col, hapus?.id);
  //         }
  //         setHapus({});
  //       });
  //     }
  //   }, [hapus]);

  // useEffect(() => {
  //   const colRef = query(collection(firestore, "booking"));
  //   const unsubscribeInit = onSnapshot(colRef, { includeMetadataChanges: true, source: 'cache' }, async (snapshot) => {
  //     var tmpData = []
  //     const source = snapshot.metadata.fromCache ? "local cache" : "server";
  //     if (!initData) {
  //       snapshot.forEach((tmpDocs) => {
  //         const docData = { ...tmpDocs.data(), id: tmpDocs.id };
  //         tmpData.push(docData);

  //       });
  //       // console.log(tmpData)
  //       setData(tmpData);
  //       setInitData(true);
  //     }
  //   });

  //   const unsubscribe = onSnapshot(colRef, async (snapshot) => {
  //     var tmpData = []
  //     (true)
  //     const source = snapshot.metadata.fromCache ? "local cache" : "server";
  //     if (initData) {
  //       snapshot.forEach((tmpDocs) => {
  //         // console.log(tmpDocs.id)
  //         const docData = { ...tmpDocs.data(), id: tmpDocs.id };
  //         tmpData.push(docData);
  //       })
  //       // console.log(tmpData)
  //       setData(tmpData);
  //       (false)
  //     }
  //   });

  //   return () => {
  //     unsubscribe();
  //     unsubscribeInit();
  //   };
  // }, [initData]);

  // useEffect(() => {
  //   const colRef = query(collection(firestore, "cafe"));
  //   const unsubscribeInit = onSnapshot(colRef, { includeMetadataChanges: true, source: 'cache' }, async (snapshot) => {
  //     var tmpData = []
  //     const source = snapshot.metadata.fromCache ? "local cache" : "server";
  //     if (!initDataCafe) {
  //       snapshot.forEach((tmpDocs) => {
  //         const docData = { ...tmpDocs.data(), id: tmpDocs.id };
  //         tmpData.push(docData);

  //       });
  //       // console.log(tmpData)
  //       setDataCafe(tmpData);
  //       setInitDataCafe(true);
  //     }
  //   });

  //   const unsubscribe = onSnapshot(colRef, async (snapshot) => {
  //     var tmpData = []
  //     (true)
  //     const source = snapshot.metadata.fromCache ? "local cache" : "server";
  //     if (initDataCafe) {
  //       snapshot.forEach((tmpDocs) => {
  //         // console.log(tmpDocs.id)
  //         const docData = { ...tmpDocs.data(), id: tmpDocs.id };
  //         tmpData.push(docData);
  //       })
  //       // console.log(tmpData)
  //       setDataCafe(tmpData);
  //       (false)
  //     }
  //   });

  //   return () => {
  //     unsubscribe();
  //     unsubscribeInit();
  //   };
  // }, [initDataCafe]);

  // useEffect(() => {
  //   const colRef = query(collection(firestore, "order"));
  //   const unsubscribeInit = onSnapshot(colRef, { includeMetadataChanges: true, source: 'cache' }, async (snapshot) => {
  //     var tmpData = []
  //     const source = snapshot.metadata.fromCache ? "local cache" : "server";
  //     if (!initDataMerch) {
  //       snapshot.forEach((tmpDocs) => {
  //         const data = tmpDocs.data();
  //         const docData = { ...tmpDocs.data(), id: tmpDocs.id };
  //         tmpData.push(docData);
  //       });
  //       // snapshot.forEach((tmpDocs) => {
  //       //   const docData = { ...tmpDocs.data(), id: tmpDocs.id };
  //       //   tmpData.push(docData);

  //       // });
  //       // console.log(tmpData)
  //       setDataMerch(tmpData);
  //       setInitDataMerch(true);
  //     }
  //   });

  //   const unsubscribe = onSnapshot(colRef, async (snapshot) => {
  //     var tmpData = []
  //     (true)
  //     const source = snapshot.metadata.fromCache ? "local cache" : "server";
  //     if (initDataMerch) {
  //       snapshot.forEach((tmpDocs) => {
  //         const data = tmpDocs.data();
  //         const docData = { ...tmpDocs.data(), id: tmpDocs.id };
  //         tmpData.push(docData);
  //       });
  //       // snapshot.forEach((tmpDocs) => {
  //       //   const docData = { ...tmpDocs.data(), id: tmpDocs.id };
  //       //   tmpData.push(docData);

  //       // });
  //       // console.log(tmpData)
  //       setDataMerch(tmpData);
  //       (false)
  //     }
  //   });

  //   return () => {
  //     unsubscribe();
  //     unsubscribeInit();
  //   };
  // }, [initDataMerch]);

  // useEffect(() => {
  //   var tmpCashier = cashier.map((cashier) => {
  //     var closeDate = cashier?.closeAt ? moment(cashier?.closeAt.toDate()).format() : moment("23:59", "HH:mm").format()

  //     var tmpData = data.filter((data) => {
  //       return moment(data?.createdAt).isBetween(moment(cashier?.createdAt?.toDate()).format(), closeDate) && (data?.status === "PAYMENT" || data?.status === "CLOSE")
  //     })
  //     var tmpCash = tmpData.filter((data) => {
  //       return data?.paymentMethod === "cash" || data?.paymentMethod === undefined
  //     }).reduce((total, data) => {
  //       var harga = data?.hargaVoid ? data?.hargaVoid : data?.harga
  //       return Number(total) + Number(harga)
  //     }, 0)
  //     var tmpPemasukan = cashier?.pemasukan?.reduce((total, data) => { return total + data?.value }, 0)
  //     var totalPemasukan = Number(tmpCash) + Number(tmpPemasukan)
  //     return { ...cashier, total: totalPemasukan }
  //   })

  //   // var tmpCashierCafe = cashierCafe.map((cashier) => {
  //   //   var closeDate = cashier?.closeAt ? moment(cashier?.closeAt.toDate()).format() : moment("23:59", "HH:mm").format()

  //   //   var tmpData = dataCafe.filter((data) => {
  //   //     return moment(data?.createdAt).isBetween(moment(cashier?.createdAt?.toDate()).format(), closeDate) && data?.status === "CLOSE"
  //   //   })

  //   //   var tmpCash = tmpData.filter((data) => {
  //   //     return data?.paymentMethod === "cash"
  //   //   }).reduce((total, data) => {
  //   //     var grandTotal = data?.pay === 0 ? "0" : data?.grandTotal
  //   //     return Number(total) + Number(grandTotal)
  //   //   }, 0)
  //   //   var tmpPemasukan = cashier?.pemasukan?.reduce((total, data) => { return total + data?.value }, 0)
  //   //   var totalPemasukan = Number(tmpCash) + Number(tmpPemasukan)
  //   //   return { ...cashier, total: totalPemasukan }
  //   // })

  //   setDetailCashier(tmpCashier)
  //   // setDetailCashierCafe(tmpCashierCafe)
  //   if (tmpCashier.length > 0) setLoadingInit(false)

  // }, [loadingInit, cashier, data])

  // Fungsi untuk menambah uang masuk
  const tambahUangMasuk = async (e) => {
    e.preventDefault();
    setLoading(true);

    const tmpCashier = cashier.find((data) => data?.status === "OPEN")
    try {
      await api.put("/data/update", {
        collection: "cashier",
        filter: { _id: tmpCashier?._id },
        update: {
          $push: {
            pemasukan: {
              value: Number(pemasukan),
              note: note,
              createdAt: new Date(moment().utc().toDate()),
            }
          },
        }
      });
      setRefresh(!refresh)
      Swal.fire("Success!", "Berhasil menambahkan data", "success");
    } catch (err) {
      console.log(err);
      setError('Gagal menambahkan data.');
      Swal.fire("Failed!", "Gagal menambahkan data", "error");
    }

    setVisible(false);
    setLoading(false);
  };

  const tambahUangKeluar = async (e) => {
    e.preventDefault();
    setLoading(true);

    const tmpCashier = cashier.find((data) => data?.status === "OPEN")
    try {
      await api.put("/data/update", {
        collection: "cashier",
        filter: { _id: tmpCashier?._id },
        update: {
          $push: {
            pengeluaran: {
              value: Number(pengeluaran),
              note: note,
              createdAt: new Date(moment().utc().toDate()),
            }
          },
        }
      });
      setRefresh(!refresh)
      Swal.fire("Success!", "Berhasil menambahkan data", "success");
    } catch (err) {
      console.log(err);
      setError('Gagal menambahkan data.');
      Swal.fire("Failed!", "Gagal menambahkan data", "error");
    }

    setVisible(false);
    setLoading(false);
  };

  // Fungsi untuk membuka kasir
  const openCashier = async (e, col) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/data/add", {
        collection: "cashier",
        data: {
          saldoAwal: Number(saldoAwal),
          saldoAkhir: 0,
          pemasukan: [],
          pengeluaran: [],
          createdAt: new Date(moment().utc().toDate()),
          status: "OPEN"
        }
      });
      setRefresh(!refresh)
      Swal.fire("Success!", "Berhasil membuka kasir", "success");
      // Refresh data
      // await fetchCashiers();
    } catch (err) {
      console.log(err);
      setError('Gagal membuka kasir.');
      // else setErrorCafe('Gagal membuka kasir.');
      Swal.fire("Failed!", "Gagal membuka kasir", "error");
    }

    setLoading(false);
  };

  // Fungsi untuk menutup kasir
  const closeCashier = async (e, col) => {
    e.preventDefault();
    setLoading(true);
    const tmpCashier = cashier.find((data) => data?.status === "OPEN")

    try {
      await api.put("/data/update", {
        collection: "cashier",
        filter: { _id: tmpCashier?._id },
        update: {
          saldoAkhir: Number(saldoAkhir),
          closeAt: new Date(moment().utc().toDate()),
          status: "CLOSE"
        }
      })
      setRefresh(!refresh)

      Swal.fire("Success!", "Berhasil menutup kasir", "success");
      // Refresh data
    } catch (err) {
      console.log(err);
      Swal.fire("Failed!", "Gagal menutup kasir", "error");
    }

    setLoading(false);
  };

  // Fungsi untuk update tanggal
  const updateTanggal = async () => {
    setLoading(true);

    const date = moment(`${editDate} ${moment(detail?.createdAt).format("HH:mm:ss")}`, "YYYY-MM-DD HH:mm:ss");

    try {
      await api.put("/data/update", {
        collection: "cashier",
        filter: { _id: detail?.id },
        update: {
          value: Number(pemasukan),
          note: note,
          createdAt: new Date(moment().utc().toDate()),
        }
      })
      setRefresh(!refresh)

      Swal.fire("Updated!", "Data berhasil diperbarui", "success");
      await fetchCashiers();
    } catch (err) {
      console.log(err);
      Swal.fire("Error!", "Data gagal diperbarui", "error");
    }

    setVisible(false);
    setLoading(false);
    (false);
  };

  const updateJamBuka = async () => {
    setLoading(true)
    // const total = edit?.item?.reduce((total, item) => {
    //     return total + Number(item.harga * item.qty);
    // }, 0)
    const date = moment(`${moment(detail?.createdAt).format("YYYY-MM-DD")} ${editTimeIn}`, "YYYY-MM-DD HH:mm:ss")
    try {
      const data = {
        createdAt: date.toDate()
      }
      const updateOrder = await setDoc(doc(firestore, "cashier", detail?.id), data, { merge: true })
      setRefresh(!refresh)

      Swal.fire({
        title: "Updated!",
        text: "Data berhasil diperbarui",
        icon: "success"
      });
    } catch (err) {
      console.log(err)
      Swal.fire({
        title: "Error!",
        text: "Data gagal diperbarui",
        icon: "error"
      });
    }
    setVisible(false)
    setLoading(false)
      (false)
  }
  const updateJamTutup = async () => {
    setLoading(true)
    // const total = edit?.item?.reduce((total, item) => {
    //     return total + Number(item.harga * item.qty);
    // }, 0)
    const date = moment(`${moment(detail?.createdAt).format("YYYY-MM-DD")} ${editTimeOut}`, "YYYY-MM-DD HH:mm:ss")
    // console.log(date)
    try {
      const data = {
        createdAt: date.toDate()
      }
      // console.log(data)
      const updateOrder = await setDoc(doc(firestore, "cashier", detail?.id), data, { merge: true })
      setRefresh(!refresh)

      Swal.fire({
        title: "Updated!",
        text: "Data berhasil diperbarui",
        icon: "success"
      });
    } catch (err) {
      console.log(err)
      Swal.fire({
        title: "Error!",
        text: "Data gagal diperbarui",
        icon: "error"
      });
    }
    setVisible(false)
    setLoading(false)
      (false)
  }


  // useEffect(() => {
  //   const todayStart = new Date();
  //   todayStart.setHours(0, 0, 0, 0);

  //   const todayEnd = new Date();
  //   todayEnd.setHours(23, 59, 59, 999);
  //   const colRefTable = query(collection(firestore, "cashier"))
  //   const unsubscribeInit = onSnapshot(colRefTable, { includeMetadataChanges: true, source: 'cache' }, async (snapshot) => {
  //     // var tmpData = [...data];
  //     var tmpData = []
  //     var filterData = []
  //     const source = snapshot.metadata.fromCache ? "local cache" : "server";
  //     // console.log(snapshot.metadata.hasPendingWrites)
  //     // console.log(source)
  //     if (!init) {
  //       snapshot.forEach((tmpDocs) => {
  //         // console.log(tmpDocs.id)
  //         const docData = { ...tmpDocs.data(), id: tmpDocs.id };
  //         tmpData.push(docData);

  //       });
  //       // if (snapshot.size === 1) {
  //       //     filterData = tmpData.find((data) => data.status === "OPEN")
  //       //     setData(filterData);
  //       // } else setData(tmpData);
  //       // console.log(tmpData)
  //       setCashier(tmpData);
  //       setInit(true);
  //     }
  //   });

  //   const unsubscribe = onSnapshot(colRefTable, async (snapshot) => {
  //     // var tmpData = [...data];
  //     var tmpData = []
  //     var filterData = []
  //     const source = snapshot.metadata.fromCache ? "local cache" : "server";
  //     // console.log(snapshot.metadata.hasPendingWrites)
  //     // console.log(source)
  //     if (init) {
  //       snapshot.forEach((tmpDocs) => {
  //         // console.log(tmpDocs.id)
  //         const docData = { ...tmpDocs.data(), id: tmpDocs.id };
  //         tmpData.push(docData);
  //       })
  //       // if (snapshot.size === 1) {
  //       //     filterData = tmpData.find((data) => data.status === "OPEN")
  //       //     // console.log(filterData)
  //       //     setData(filterData);
  //       // } else setData(tmpData);
  //       // console.log(tmpData)
  //       setCashier(tmpData);
  //     }
  //   });

  //   return () => {
  //     unsubscribe();
  //     unsubscribeInit();
  //   };
  // }, [init]);

  // useEffect(() => {
  //   const todayStart = new Date();
  //   todayStart.setHours(0, 0, 0, 0);

  //   const todayEnd = new Date();
  //   todayEnd.setHours(23, 59, 59, 999);
  //   const colRefTable = query(collection(firestore, "cashierCafe"))
  //   const unsubscribeInit = onSnapshot(colRefTable, { includeMetadataChanges: true, source: 'cache' }, async (snapshot) => {
  //     // var tmpData = [...data];
  //     var tmpData = []
  //     var filterData = []
  //     const source = snapshot.metadata.fromCache ? "local cache" : "server";
  //     // console.log(snapshot.metadata.hasPendingWrites)
  //     // console.log(source)
  //     if (!initCafe) {
  //       snapshot.forEach((tmpDocs) => {
  //         // console.log(tmpDocs.id)
  //         const docData = { ...tmpDocs.data(), id: tmpDocs.id };
  //         tmpData.push(docData);

  //       });
  //       // if (snapshot.size === 1) {
  //       //     filterData = tmpData.find((data) => data.status === "OPEN")
  //       //     setData(filterData);
  //       // } else setData(tmpData);
  //       // console.log(tmpData)
  //       setCashierCafe(tmpData);
  //       setInitCafe(true);
  //     }
  //   });

  //   const unsubscribe = onSnapshot(colRefTable, async (snapshot) => {
  //     // var tmpData = [...data];
  //     var tmpData = []
  //     var filterData = []
  //     const source = snapshot.metadata.fromCache ? "local cache" : "server";
  //     // console.log(snapshot.metadata.hasPendingWrites)
  //     // console.log(source)
  //     if (initCafe) {
  //       snapshot.forEach((tmpDocs) => {
  //         // console.log(tmpDocs.id)
  //         const docData = { ...tmpDocs.data(), id: tmpDocs.id };
  //         tmpData.push(docData);
  //       })
  //       // if (snapshot.size === 1) {
  //       //     filterData = tmpData.find((data) => data.status === "OPEN")
  //       //     // console.log(filterData)
  //       //     setData(filterData);
  //       // } else setData(tmpData);
  //       // console.log(tmpData)
  //       setCashierCafe(tmpData);
  //     }
  //   });

  //   return () => {
  //     unsubscribe();
  //     unsubscribeInit();
  //   };
  // }, [initCafe]);

  // useEffect(() => {
  //   const todayStart = new Date();
  //   todayStart.setHours(0, 0, 0, 0);

  //   const todayEnd = new Date();
  //   todayEnd.setHours(23, 59, 59, 999);
  //   const colRefTable = query(collection(firestore, "menuReport"))
  //   const unsubscribeInit = onSnapshot(colRefTable, { includeMetadataChanges: true, source: 'cache' }, async (snapshot) => {
  //     // var tmpData = [...data];
  //     var tmpData = []
  //     var filterData = []
  //     const source = snapshot.metadata.fromCache ? "local cache" : "server";
  //     // console.log(snapshot.metadata.hasPendingWrites)
  //     // console.log(source)
  //     if (!initProduct) {
  //       snapshot.forEach((tmpDocs) => {
  //         // console.log(tmpDocs.id)
  //         const docData = { ...tmpDocs.data(), id: tmpDocs.id };
  //         tmpData.push(docData);
  //       });
  //       // if (snapshot.size === 1) {
  //       //     filterData = tmpData.find((data) => data.status === "OPEN")
  //       //     setData(filterData);
  //       // } else setData(tmpData);
  //       // console.log(tmpData)
  //       setProductData(tmpData);
  //       setInitProduct(true);
  //     }
  //   });

  //   const unsubscribe = onSnapshot(colRefTable, async (snapshot) => {
  //     // var tmpData = [...data];
  //     var tmpData = []
  //     var filterData = []
  //     const source = snapshot.metadata.fromCache ? "local cache" : "server";
  //     // console.log(snapshot.metadata.hasPendingWrites)
  //     // console.log(source)
  //     if (initProduct) {
  //       snapshot.forEach((tmpDocs) => {
  //         // console.log(tmpDocs.id)
  //         const docData = { ...tmpDocs.data(), id: tmpDocs.id };
  //         tmpData.push(docData);
  //       })
  //       const combinedData = Object.values(
  //         tmpData.reduce((acc, item) => {
  //           if (!acc[item.menuId]) {
  //             // Jika menuId belum ada, tambahkan ke objek
  //             acc[item.menuId] = { ...item };
  //           } else {
  //             // Jika menuId sudah ada, gabungkan stoknya
  //             acc[item.menuId].qty += item.qty;
  //           }
  //           return acc;
  //         }, {})
  //       );
  //       filterData = combinedData.filter((data) => moment(data?.createdAt).isBetween(moment().startOf("day").format().toString(), moment().endOf("day").format().toString()))
  //       setProductData(combinedData);
  //       setFilterProduct(filterData)
  //     }
  //   });

  //   return () => {
  //     unsubscribe();
  //     unsubscribeInit();
  //   };
  // }, [initProduct]);

  useEffect(() => {
    if (Object.keys(hapus).length > 0) {
      Swal.fire({
        title: "Konfirmasi",
        html: `<p>Apakah anda yakin menghapus data tanggal <b>${moment(hapus?.createdAt).format("DD/MM/YYYY")}</b>?</p>`,
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
                collection: "cashier",
                filter: { _id: hapus?._id }
              }
            });
            setRefresh(!refresh)

            Swal.fire({
              title: "Deleted!",
              text: "Data berhasil dihapus",
              icon: "success"
            });
          } catch (error) {
            console.error('Error deleting log:', error);
            Swal.fire({
              title: "Failed!",
              text: "Data gagal dihapus",
              icon: "error"
            });
          }
        }
        setHapus({});
      });
    }
  }, [hapus]);

  // useEffect(() => {
  //   calculateIncome()
  // }, [data])

  // useEffect(() => {
  //   var start = ""
  //   var end = ""
  //   if (activeBtn === 'Day') {
  //     start = moment(moment(startDate), 'YYYY-MM-DD').set("hour", 8);
  //     end = moment(moment(endDate), 'YYYY-MM-DD')
  //   } else {
  //     start = moment(moment(startDate), 'YYYY-MM-DD').set("hour", 8);
  //     end = moment(moment(endDate), 'YYYY-MM-DD')
  //   }
  //   if (moment(start).isValid() && moment(end).isValid()) {
  //     var tmpData = data.filter((data) => {
  //       return (moment(data?.createdAt).isBetween(start, end) || moment(data?.createdAt).isBetween(moment(endDate, "YYYY-MM-DD").set("hour", 0), moment(endDate, "YYYY-MM-DD").set("hour", 6)))
  //         && (data?.status === "PAYMENT" || data?.status === "CLOSE")
  //     })

  //     var tmpOrder = dataMerch.filter((data) => {
  //       return (moment(data?.createdAt).isBetween(start, end) || moment(data?.createdAt).isBetween(moment(endDate, "YYYY-MM-DD").set("hour", 0), moment(endDate, "YYYY-MM-DD").set("hour", 6)))
  //         && (data?.status === "PAYMENT" || data?.status === "CLOSE")
  //     })

  //     console.log(tmpData)

  //     var table = tmpData.reduce((total, data) => {
  //       var harga = data?.hargaVoid ? data?.hargaVoid : data?.harga
  //       return total + Number(harga)
  //     }, 0)

  //     var cafe = tmpOrder.reduce((total, data) => {
  //       var promo = data?.item?.filter(item => !item.hasOwnProperty('duration'))

  //       if (data?.total !== undefined && !isNaN(data?.total)) {
  //         var tmpTotal = promo?.reduce((totalPromo, item) => { return Number(totalPromo) + (Number(item?.harga) * Number(item?.qty)) }, 0)
  //         return Number(total) + Number(tmpTotal)
  //       }
  //       else return Number(total)
  //     }, 0)
  //     // console.log(tmpOrder)

  //     var total = table + cafe
  //     // console.log(tmpData)

  //     setTotal(total)
  //     setTable(table)
  //     setCafe(cafe)
  //     setFilterData(tmpData)
  //   }
  // }, [activeBtn, data, startDate, endDate])

  // useEffect(() => {
  //   var start = moment(startProductDate).startOf("day").format()
  //   var end = moment(endProductDate).endOf("day").format()
  //   var tmpProductData = productData?.filter((data) => {
  //     return moment(data?.createdAt).isBetween(start, end)
  //   })
  //   setFilterProduct(tmpProductData)
  // }, [productData, startProductDate, endProductDate])

  // useEffect(() => {
  //   var start = ""
  //   var end = ""
  //   if (activeBtnCafe === 'Day') {
  //     start = moment(moment(startDateCafe), 'YYYY-MM-DD').startOf("day");
  //     end = moment(moment(endDateCafe), 'YYYY-MM-DD').endOf("day");
  //   } else {
  //     start = moment(moment(startDateCafe, 'MMMM'), 'YYYY-MM').startOf("day");
  //     end = moment(moment(endDateCafe, 'MMMM'), 'YYYY-MM').endOf("day");
  //   }
  //   if (moment(start).isValid() && moment(end).isValid()) {
  //     var tmpData = dataCafe.filter((data) => {
  //       return moment(data?.createdAt).isBetween(start, end) && data?.status === "CLOSE"
  //     })
  //     var cash = tmpData.filter((data) => {
  //       return data?.paymentMethod === "cash"
  //     }).reduce((total, data) => {
  //       if (data?.pay !== 0) return total + data?.grandTotal
  //       else return total
  //     }, 0)

  //     var qris = tmpData.filter((data) => {
  //       return data?.paymentMethod === "cashless"
  //     }).reduce((total, data) => {
  //       if (data?.pay !== 0) return total + data?.grandTotal
  //       else return total
  //     }, 0)

  //     var tax = tmpData.reduce((total, data) => {
  //       return total + data?.total * 0.1
  //     }, 0)

  //     var service = tmpData.reduce((total, data) => {
  //       var tmpTax = data?.total * 0.1
  //       return total + (data?.grandTotal - (data?.total + tmpTax))
  //     }, 0)

  //     // var totalVoid = tmpData.reduce((total, data) => {
  //     //   return Number(total) + (data?.hargaNormal && data?.hargaVoid ? (Number(data?.hargaNormal) - Number(data?.hargaVoid)) : 0)
  //     // }, 0)

  //     // var promo = tmpData
  //     //   .flatMap((data) => data?.item.filter((item) => item?.isPromo))
  //     //   .reduce((total, item) => {
  //     //     return Number(total) + (Number(item?.harga) * Number(item?.qty))
  //     //   }, 0)
  //     setCashCafe(cash)
  //     setQrisCafe(qris)
  //     setTax(tax)
  //     setService(service)
  //     // setFilterData(tmpData)
  //   }
  // }, [activeBtnCafe, dataCafe, startDateCafe, endDateCafe])

  // Fungsi untuk mengambil data cafe
  const fetchCafeData = async () => {
    try {
      const response = await api.post('/data', {
        collection: "cafe",
        filter: {},
        sort: {}
      })
      setDataCafe(response.data);
      setInitDataCafe(true);
    } catch (error) {
      console.error('Error fetching cafe data:', error);
      // Swal.fire('Error', 'Gagal memuat data cafe', 'error');
    }
  };

  // Fungsi untuk mengambil data merchandise
  const fetchMerchData = async () => {
    try {
      const response = await api.post('/data', {
        collection: "merchandise",
        filter: {},
        sort: {}
      })
      setDataMerch(response.data);
      setInitDataMerch(true);
    } catch (error) {
      console.error('Error fetching merchandise data:', error);
      // Swal.fire('Error', 'Gagal memuat data merchandise', 'error');
    } finally {
      (false);
    }
  };

  // Fungsi untuk mengambil data menu report
  const fetchMenuReports = async () => {
    try {
      const response = await api.post('/data', {
        collection: "productReport",
        filter: {},
        sort: {}
      })
      console.log(response.data)
      setProductData(response.data);
      setInitProduct(true);

      // Filter data berdasarkan tanggal jika diperlukan
      if (startProductDate && endProductDate) {
        const filtered = response.data.filter(item =>
          moment(item.createdAt).isBetween(startProductDate, endProductDate)
        );
        setFilterProduct(filtered);
      }
    } catch (error) {
      console.error('Error fetching menu reports:', error);
      // Swal.fire('Error', 'Gagal memuat laporan menu', 'error');
    } finally {
      (false);
    }
  };

  // Fungsi untuk menghapus pemasukan
  const hapusPemasukan = async (index) => {
    detail?.pemasukan?.splice(index, 1)
    const col = "cashier"
    try {
      await api.put("/data/update", {
        collection: col,
        filter: { _id: tmpCashier?._id },
        update: {
          pemasukan: detail?.pemasukan
        }
      })
      Swal.fire("Success!", "Pemasukan berhasil dihapus", "success");

      // Refresh data cashier
      await fetchCashiers();
    } catch (err) {
      console.log(err);
      Swal.fire("Failed!", "Gagal menghapus pemasukan", "error");
    }
  };

  // Fungsi untuk menghapus pengeluaran
  const hapusPengeluaran = async (index) => {
    detail?.pengeluaran?.splice(index, 1)
    const col = "cashier"
    try {
      await api.put("/data/update", {
        collection: col,
        filter: { _id: tmpCashier?._id },
        update: {
          pengeluaran: detail?.pengeluaran
        }
      })
      Swal.fire("Success!", "Pengeluaran berhasil dihapus", "success");

      // Refresh data cashier
      await fetchCashiers();
    } catch (err) {
      console.log(err);
      Swal.fire("Failed!", "Gagal menghapus pengeluaran", "error");
    }
  };

  // // Fungsi untuk menghitung pendapatan
  // const calculateIncome = async () => {
  //   try {
  //     const response = await api.post('/reports/income', {
  //       params: {
  //         date: moment().format('YYYY-MM-DD')
  //       }
  //     });
  //     setIncome(response.data.totalIncome);
  //     setToday(response.data.transactionCount);
  //   } catch (error) {
  //     console.error('Error calculating income:', error);
  //   }
  // };

  // Fungsi untuk mengambil data dengan filter
  const fetchFilteredData = async () => {
    try {
      const params = {
        startDate: moment(startDate).format('YYYY-MM-DD'),
        endDate: moment(endDate).format('YYYY-MM-DD'),
        statuses: ['PAYMENT', 'CLOSE']
      };

      const response = await api.post('/data', {
        collection: "booking",
        filter: params,
        sort: {}
      })
      const tmpData = response.data;

      // Hitung total
      const tableTotal = tmpData.reduce((total, data) => {
        const harga = data?.hargaVoid ? data?.hargaVoid : data?.harga;
        return total + Number(harga);
      }, 0);

      // Hitung merchandise
      const merchResponse = await api.post('/data', {
        collection: "booking",
        filter: params,
        sort: {}
      })
      const merchData = merchResponse.data;

      const cafeTotal = merchData.reduce((total, data) => {
        const promoItems = data?.item?.filter(item => !item.hasOwnProperty('duration'));
        const tmpTotal = promoItems?.reduce((totalPromo, item) => {
          return Number(totalPromo) + (Number(item?.harga) * Number(item?.qty));
        }, 0);
        return Number(total) + (Number(tmpTotal) || 0);
      }, 0);

      setTotal(tableTotal + cafeTotal);
      setTable(tableTotal);
      setCafe(cafeTotal);
      setFilterData(tmpData);
    } catch (error) {
      console.error('Error fetching filtered data:', error);
    }
  };

  // Fungsi untuk mengambil data produk dengan filter tanggal
  const fetchFilteredProducts = async () => {
    try {
      const response = await api.post('/data', {
        collection: "menuReport",
        filter: {
          startDate: startProductDate,
          endDate: endProductDate
        },
        sort: {}
      })
      setFilterProduct(response.data);
    } catch (error) {
      console.error('Error fetching filtered products:', error);
    }
  };

  // Update useEffect hooks
  useEffect(() => {
    const loadInitialData = async () => {
      await fetchBookings();
      await fetchCafeData();
      await fetchMerchData();
      await fetchMenuReports();
      await fetchCashiers();
      await calculateIncome();
      setLoadingInit(false);
    };

    if (!loadingInit) {
      loadInitialData();
    }
  }, [loadingInit, refresh]);

  useEffect(() => {
    if (initData && initDataCafe && initDataMerch && init && initProduct) {
      fetchFilteredData();
    }
  }, [activeBtn, startDate, endDate, initData, initDataCafe, initDataMerch, init, initProduct]);

  useEffect(() => {
    if (startProductDate && endProductDate && initProduct) {
      fetchFilteredProducts();
    }
  }, [startProductDate, endProductDate, initProduct]);

  const renderModal = () => {
    switch (action) {
      case "cash_in":
        return <>
          <CModalHeader>
            <CModalTitle id="actionModal">Uang Masuk</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CContainer>
              <CRow className="mb-3">
                <CFormLabel className="col-sm-3 col-form-label">Uang Masuk</CFormLabel>
                <CCol sm={9}>
                  <CFormInput
                    type="text"
                    placeholder="Input Uang Masuk"
                    value={formatNumber(pemasukan)}
                    onChange={(e) => setPemasukan(e.target.value.replace(/,/g, ""))}
                    feedbackInvalid="Input hanya menerima angka."
                    required
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CFormLabel className="col-sm-3 col-form-label">Note</CFormLabel>
                <CCol sm={9}>
                  <CFormInput
                    type="text"
                    placeholder="Input Note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    required
                  />
                </CCol>
              </CRow>
            </CContainer>
          </CModalBody>

          <CModalFooter>
            {!loading ? <CButton color="success" onClick={(e) => { tambahUangMasuk(e) }}>Tambah</CButton>
              : <CSpinner color="primary" className="float-end" variant="grow" />}
          </CModalFooter>
        </>
      case "cash_out":
        return <>
          <CModalHeader>
            <CModalTitle id="actionModal">Uang Keluar</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CContainer>
              <CRow className="mb-3">
                <CFormLabel className="col-sm-3 col-form-label">Uang Keluar</CFormLabel>
                <CCol sm={9}>
                  <CFormInput
                    type="text"
                    placeholder="Input Uang Keluar"
                    value={formatNumber(pengeluaran)}
                    onChange={(e) => setPengeluaran(e.target.value.replace(/,/g, ""))}
                    feedbackInvalid="Input hanya menerima angka."
                    required
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CFormLabel className="col-sm-3 col-form-label">Note</CFormLabel>
                <CCol sm={9}>
                  <CFormInput
                    type="text"
                    placeholder="Input Note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    feedbackInvalid="Input hanya menerima angka."
                    required
                  />
                </CCol>
              </CRow>
            </CContainer>
          </CModalBody>

          <CModalFooter>
            {!loading ? <CButton color="success" onClick={(e) => { tambahUangKeluar(e) }}>Tambah</CButton>
              : <CSpinner color="primary" className="float-end" variant="grow" />}
          </CModalFooter>
        </>
      case "close":
        return <>
          <CModalHeader>
            <CModalTitle id="actionModal">Tutup Kasir</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CContainer>
              <CRow className="mb-3">
                <CFormLabel className="col-sm-3 col-form-label">Saldo Awal</CFormLabel>
                <CCol sm={9}>
                  <CFormInput
                    type="text"
                    value={formatNumber(tmpCashier?.saldoAwal)}
                    plainText
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CFormLabel className="col-sm-3 col-form-label">Total Transaksi Tunai</CFormLabel>
                <CCol sm={9}>
                  <CFormInput
                    type="text"
                    style={{ color: "green" }}
                    value={`+${formatNumber(cash)}`}
                    plainText
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CFormLabel className="col-sm-3 col-form-label">Total Uang Masuk</CFormLabel>
                <CCol sm={9}>
                  <CFormInput
                    type="text"
                    style={{ color: "green" }}
                    value={`+${formatNumber(pemasukan)}`}
                    plainText
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CFormLabel className="col-sm-3 col-form-label">Total Uang Keluar</CFormLabel>
                <CCol sm={9}>
                  <CFormInput
                    type="text"
                    style={{ color: "red" }}
                    value={`-${formatNumber(pengeluaran)}`}
                    plainText
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CFormLabel className="col-sm-3 col-form-label">Saldo Akhir</CFormLabel>
                <CCol sm={9}>
                  <CFormInput
                    type="text"
                    value={formatNumber(saldoAkhir)}
                    plainText
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CFormLabel className="col-sm-3 col-form-label">Selisih</CFormLabel>
                <CCol sm={9}>
                  <CFormInput
                    type="text"
                    style={{ color: Math.sign(selisih) === -1 ? "red" : "green" }}
                    value={formatNumber(selisih)}
                    plainText
                  />
                </CCol>
              </CRow>
            </CContainer>
          </CModalBody>

          <CModalFooter>
            {!loading ? <CButton color="danger" onClick={(e) => { closeCashier(e) }}>Tutup</CButton>
              : <CSpinner color="primary" className="float-end" variant="grow" />}
          </CModalFooter>
        </>
      case "detail":
        var closeDate = detail?.closeAt ? moment(detail?.closeAt).format() : moment("23:59", "HH:mm").format()

        if (title === "pool") {
          var tmpData = data.filter((data) => {
            return moment(data?.createdAt).isBetween(moment(detail?.createdAt).format(), closeDate) && (data?.status === "PAYMENT" || data?.status === "CLOSE")
          })
          var tmpCash = tmpData.filter((data) => {
            return data?.paymentMethod === "cash" || data?.paymentMethod === undefined
          }).reduce((total, data) => {
            var harga = data?.hargaVoid ? data?.hargaVoid : data?.harga
            return Number(total) + Number(harga)
          }, 0)
          var tmpPemasukan = detail?.pemasukan?.reduce((total, data) => { return total + data?.value }, 0)
          var tmpPengeluaran = detail?.pengeluaran?.reduce((total, data) => { return total + data?.value }, 0)

          var selisih = detail?.saldoAkhir - (detail?.saldoAwal + tmpCash + tmpPemasukan - tmpPengeluaran)
        }

        return <>
          <CModalHeader>
            <CModalTitle id="actionModal">Detail Laporan Kasir</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CContainer>
              <CRow className="mb-3">
                <CFormLabel className="col-sm-3 col-form-label">Saldo Awal</CFormLabel>
                <CCol sm={9}>
                  <CFormInput
                    type="text"
                    value={formatNumber(detail?.saldoAwal)}
                    plainText
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CFormLabel className="col-sm-3 col-form-label">Total Transaksi Tunai</CFormLabel>
                <CCol sm={9}>
                  <CFormInput
                    type="text"
                    style={{ color: "green" }}
                    value={`+${formatNumber(tmpCash)}`}
                    plainText
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CFormLabel className="col-sm-3 col-form-label">Total Uang Masuk</CFormLabel>
                <CCol sm={9}>
                  <CFormInput
                    type="text"
                    style={{ color: "green" }}
                    value={`+${formatNumber(tmpPemasukan)}`}
                    plainText
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CFormLabel className="col-sm-3 col-form-label">Total Uang Keluar</CFormLabel>
                <CCol sm={9}>
                  <CFormInput
                    type="text"
                    style={{ color: "red" }}
                    value={`-${formatNumber(tmpPengeluaran)}`}
                    plainText
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CFormLabel className="col-sm-3 col-form-label">Saldo Akhir</CFormLabel>
                <CCol sm={9}>
                  <CFormInput
                    type="text"
                    value={formatNumber(detail?.saldoAkhir)}
                    plainText
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CFormLabel className="col-sm-3 col-form-label">Selisih</CFormLabel>
                <CCol sm={9}>
                  <CFormInput
                    type="text"
                    style={{ color: Math.sign(selisih) === -1 ? "red" : "green" }}
                    value={formatNumber(selisih)}
                    plainText
                  />
                </CCol>
              </CRow>
            </CContainer>
            <CContainer className='mt-3'>
              <hr />
              <h4 style={{ textAlign: "center" }}>Detail Pemasukan</h4>
              <hr />
              <CTable>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell style={{ width: "110px" }}>Action</CTableHeaderCell>
                    <CTableHeaderCell style={{ width: "200px" }}>Uang Masuk</CTableHeaderCell>
                    <CTableHeaderCell>Note</CTableHeaderCell>
                    <CTableHeaderCell>Tanggal</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {detail?.pemasukan?.map((item, idx) => {
                    // console.log(item)
                    return (
                      <CTableRow key={idx}>
                        <CTableDataCell>
                          <CButton color='danger' className='me-1' onClick={() => hapusPemasukan(idx)}>✗</CButton>
                        </CTableDataCell>
                        <CTableDataCell>{formatNumber(item?.value)}</CTableDataCell>
                        <CTableDataCell>{item?.note}</CTableDataCell>
                        <CTableDataCell>{moment(item?.createdAt).format("DD/MM/YYYY HH:mm:ss")}</CTableDataCell>
                      </CTableRow>
                    )
                  })}
                </CTableBody>
              </CTable>
            </CContainer>
            <CContainer className='mt-3'>
              <hr />
              <h4 style={{ textAlign: "center" }}>Detail Pengeluaran</h4>
              <hr />
              <CTable>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell style={{ width: "110px" }}>Action</CTableHeaderCell>
                    <CTableHeaderCell style={{ width: "200px" }}>Uang Keluar</CTableHeaderCell>
                    <CTableHeaderCell>Note</CTableHeaderCell>
                    <CTableHeaderCell>Tanggal</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {detail?.pengeluaran?.map((item, idx) => {
                    // console.log(item)
                    return (
                      <CTableRow key={idx}>
                        <CTableDataCell>
                          <CButton color='danger' className='me-1' onClick={() => hapusPengeluaran(idx)}>✗</CButton>
                        </CTableDataCell>
                        <CTableDataCell>{formatNumber(item?.value)}</CTableDataCell>
                        <CTableDataCell>{item?.note}</CTableDataCell>
                        <CTableDataCell>{moment(item?.createdAt).format("DD/MM/YYYY HH:mm:ss")}</CTableDataCell>
                      </CTableRow>
                    )
                  })}
                </CTableBody>
              </CTable>
            </CContainer>
          </CModalBody>

          <CModalFooter>
            <CButton color="danger" onClick={(e) => { setVisible(false) }}>Tutup</CButton>
          </CModalFooter>
        </>
      case "edit":
        return <>
          <CModalHeader>
            <CModalTitle id="actionModal">Edit Laporan Kasir</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CContainer>
              <CRow className="mb-3">
                <CFormLabel className="col-sm-3 col-form-label">Tanggal</CFormLabel>
                <CCol sm="auto">
                  <CInputGroup>
                    <input type={isEditDate ? "date" : "text"} className={isEditDate ? "form-control" : "no-border"}
                      value={isEditDate ? editDate : moment(detail?.createdAt).format("DD/MM/YYYY")}
                      onChange={(e) => {
                        console.log(e.target.value)
                        setEditDate(moment(e.target.value).format("YYYY-MM-DD"))
                      }}
                      readOnly={!isEditDate} />
                    {isEditDate ? <CButton color='info' onClick={(e) => {
                      updateTanggal()
                    }}>✓</CButton> : <CButton color='warning' className='ms-2' onClick={() => {
                      setEditDate(moment(detail?.createdAt).format("YYYY-MM-DD"))
                      setIsEditDate(true)
                    }}><CIcon icon={cilPencil} /></CButton>}
                  </CInputGroup>

                  {/* {isEditDate ? <CFormInput type="time"
                    placeholder={"Pilih Waktu"}
                    // list="time_list"
                    defaultValue={moment().add(1, "hours").startOf("hour").format("HH:mm")}
                    onChange={(e) => setWaktu(e.target.value)}
                  /> : <div>{moment(detail?.createdAt.toDate()).format("DD/MM/YYYY")}</div>} */}
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CFormLabel className="col-sm-3 col-form-label">Jam Buka</CFormLabel>
                <CCol sm="auto">
                  <CInputGroup>
                    <input type={isEditTimeIn ? "time" : "text"} className={isEditTimeIn ? "form-control" : "no-border"}
                      value={isEditTimeIn ? editTimeIn : moment(detail?.createdAt).format("HH:mm:ss")}
                      onChange={(e) => {
                        console.log(e.target.value)
                        // setDetail({ ...detail, createdAt:e.target.value})
                        setEditTimeIn(e.target.value)
                      }}
                      readOnly={!isEditTimeIn} />
                    {isEditTimeIn ? <CButton color='info' onClick={(e) => {
                      updateJamBuka()
                    }}>✓</CButton> : <CButton color='warning' className='ms-2' onClick={() => {
                      setEditTimeIn(moment(detail?.createdAt).format("HH:mm"))
                      setIsEditTimeIn(true)
                    }}><CIcon icon={cilPencil} /></CButton>}
                  </CInputGroup>
                  {/* {isEditTimeIn ? <CFormInput type="time"
                    placeholder={"Pilih Waktu"}
                    // list="time_list"
                    defaultValue={moment().add(1, "hours").startOf("hour").format("HH:mm")}
                    onChange={(e) => setWaktu(e.target.value)}
                  /> : <div>{moment(detail?.createdAt.toDate()).format("HH:mm:ss")}</div>} */}
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CFormLabel className="col-sm-3 col-form-label">Jam Tutup</CFormLabel>
                <CCol sm="auto">
                  <CInputGroup>
                    <input type={isEditTimeOut ? "time" : "text"} className={isEditTimeOut ? "form-control" : "no-border"}
                      value={isEditTimeOut ? editTimeOut
                        : moment(typeof detail?.closeAt === "object" ? detail?.closeAt.toDate() : "").format("HH:mm:ss")}
                      onChange={(e) => {
                        console.log(e.target.value)
                        // setDetail({ ...detail, createdAt:e.target.value})
                        setEditTimeOut(e.target.value)
                      }}
                      readOnly={!isEditTimeOut} />
                    {isEditTimeOut ? <CButton color='info' onClick={(e) => {
                      updateJamTutup()
                    }}>✓</CButton> : <CButton color='warning' className='ms-2' onClick={() => {
                      setEditTimeOut(moment(typeof detail?.closeAt === "object" ? detail?.closeAt.toDate() : "").format("HH:mm"))
                      setIsEditTimeOut(true)
                    }}><CIcon icon={cilPencil} /></CButton>}
                  </CInputGroup>
                  {/* {isEditTimeOut ? <CFormInput type="time"
                    placeholder={"Pilih Waktu"}
                    // list="time_list"
                    defaultValue={moment().add(1, "hours").startOf("hour").format("HH:mm")}
                    onChange={(e) => setWaktu(e.target.value)}
                  /> : <div>{detail?.closeAt ? moment(detail?.closeAt.toDate()).format("HH:mm:ss") : "-"}</div>} */}
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CFormLabel className="col-sm-3 col-form-label">Saldo Awal</CFormLabel>
                <CCol sm={9}>
                  <CFormInput
                    type="text"
                    value={formatNumber(detail?.saldoAwal)}
                    plainText
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CFormLabel className="col-sm-3 col-form-label">Saldo Akhir</CFormLabel>
                <CCol sm={9}>
                  <CFormInput
                    type="text"
                    value={formatNumber(detail?.saldoAkhir)}
                    plainText
                  />
                </CCol>
              </CRow>
            </CContainer>
            <CContainer className='mt-3'>
              <hr />
              <h4 style={{ textAlign: "center" }}>Detail Pemasukan</h4>
              <hr />
              <CTable>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell style={{ width: "110px" }}>Action</CTableHeaderCell>
                    <CTableHeaderCell style={{ width: "200px" }}>Uang Masuk</CTableHeaderCell>
                    <CTableHeaderCell>Note</CTableHeaderCell>
                    <CTableHeaderCell>Tanggal</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {detail?.pemasukan?.map((item, idx) => {
                    // console.log(item)
                    return (
                      <CTableRow key={idx}>
                        <CTableDataCell>
                          <CButton color='danger' className='me-1' onClick={() => hapusPemasukan(idx)}>✗</CButton>
                        </CTableDataCell>
                        <CTableDataCell>{formatNumber(item?.value)}</CTableDataCell>
                        <CTableDataCell>{item?.note}</CTableDataCell>
                        <CTableDataCell>{moment(item?.createdAt).format("DD/MM/YYYY HH:mm:ss")}</CTableDataCell>
                      </CTableRow>
                    )
                  })}
                </CTableBody>
              </CTable>
            </CContainer>
            <CContainer className='mt-3'>
              <hr />
              <h4 style={{ textAlign: "center" }}>Detail Pengeluaran</h4>
              <hr />
              <CTable>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell style={{ width: "110px" }}>Action</CTableHeaderCell>
                    <CTableHeaderCell style={{ width: "200px" }}>Uang Keluar</CTableHeaderCell>
                    <CTableHeaderCell>Note</CTableHeaderCell>
                    <CTableHeaderCell>Tanggal</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {detail?.pengeluaran?.map((item, idx) => {
                    // console.log(item)
                    return (
                      <CTableRow key={idx}>
                        <CTableDataCell>
                          <CButton color='danger' className='me-1' onClick={() => hapusPengeluaran(idx)}>✗</CButton>
                        </CTableDataCell>
                        <CTableDataCell>{formatNumber(item?.value)}</CTableDataCell>
                        <CTableDataCell>{item?.note}</CTableDataCell>
                        <CTableDataCell>{moment(item?.createdAt).format("DD/MM/YYYY HH:mm:ss")}</CTableDataCell>
                      </CTableRow>
                    )
                  })}
                </CTableBody>
              </CTable>
            </CContainer>
          </CModalBody>

          <CModalFooter>
            <CButton color="danger" onClick={(e) => { setVisible(false) }}>Tutup</CButton>
          </CModalFooter>
        </>
      default:
        return <>
          <CModalHeader>
            <CModalTitle id="actionModal">Uang Masuk</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CContainer>
              <CRow className="mb-3">
                <CFormLabel className="col-sm-3 col-form-label">Uang Masuk</CFormLabel>
                <CCol sm={9}>
                  <CFormInput
                    type="text"
                    placeholder="Input Uang Masuk"
                    value={formatNumber(pemasukan)}
                    onChange={(e) => setPemasukan(e.target.value.replace(/,/g, ""))}
                    feedbackInvalid="Input hanya menerima angka."
                    required
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CFormLabel className="col-sm-3 col-form-label">Note</CFormLabel>
                <CCol sm={9}>
                  <CFormInput
                    type="text"
                    placeholder="Input Note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    required
                  />
                </CCol>
              </CRow>
            </CContainer>
          </CModalBody>

          <CModalFooter>
            {!loading ? <CButton color="success" onClick={(e) => { tambahUangMasuk(e) }}>Tambah</CButton>
              : <CSpinner color="primary" className="float-end" variant="grow" />}
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
      {!loadingInit ? <>
        <CCard className="mb-4">
          <CCardBody>
            <CRow>
              <CCol sm={5}>
                <h4 id="traffic" className="card-title mb-0">
                  Detail Income
                </h4>
                {/* <div className="small text-body-secondary">{moment(startDate).format("DD MMMM YYYY")} - {moment(endDate).format("DD MMMM YYYY")}</div> */}
              </CCol>
              <CCol sm={7}>
                <CButtonGroup className="float-end me-3 mb-2">
                  {['Day', 'Month'].map((value) => (
                    <CButton
                      color="outline-secondary"
                      key={value}
                      className="mx-0"
                      onClick={() => setActiveBtn(value)}
                      active={value === activeBtn}
                    >
                      {value}
                    </CButton>
                  ))}
                </CButtonGroup>
                <CInputGroup>
                  {activeBtn === "Day" && <>
                    <CFormInput
                      type="date"
                      className='mb-3'
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      placeholder="Start Date"
                      aria-label="Start Date"
                    />
                    <CInputGroupText className='mb-3'
                    >~</CInputGroupText>
                    <CFormInput
                      type="date"
                      className='mb-3'
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      placeholder="End Date"
                      aria-label="End Date"
                    />
                    <CInputGroupText className="mb-3 close-btn" style={{ backgroundColor: "#e74c3c", color: "white", border: "none", cursor: "pointer" }} onClick={() => { setStartDate(""); setEndDate("") }}><b>x</b></CInputGroupText>
                  </>}
                  {activeBtn === "Month" && <>
                    <CFormSelect
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      style={{ height: "38px" }}
                    >
                      <option value="">Pilih Bulan</option>
                      <option value="January">January</option>
                      <option value="February">February</option>
                      <option value="March">March</option>
                      <option value="April">April</option>
                      <option value="May">May</option>
                      <option value="June">June</option>
                      <option value="July">July</option>
                      <option value="August">August</option>
                      <option value="September">September</option>
                      <option value="October">October</option>
                      <option value="November">November</option>
                      <option value="December">December</option>
                    </CFormSelect>
                    <CInputGroupText className='mb-3'
                    >~</CInputGroupText>
                    <CFormSelect
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      style={{ height: "38px" }}
                    >
                      <option value="">Pilih Bulan</option>
                      <option value="January">January</option>
                      <option value="February">February</option>
                      <option value="March">March</option>
                      <option value="April">April</option>
                      <option value="May">May</option>
                      <option value="June">June</option>
                      <option value="July">July</option>
                      <option value="August">August</option>
                      <option value="September">September</option>
                      <option value="October">October</option>
                      <option value="November">November</option>
                      <option value="December">December</option>
                    </CFormSelect>
                    <CInputGroupText className="mb-3 close-btn" style={{ backgroundColor: "#e74c3c", color: "white", border: "none", cursor: "pointer" }} onClick={() => { setStartDate(""); setEndDate("") }}><b>x</b></CInputGroupText>
                  </>}
                </CInputGroup>
              </CCol>
            </CRow>
            {/* <MainChart activeBtn={activeBtn} data={data} startDate={startDate} endDate={endDate} /> */}
          </CCardBody>
          <CCardFooter>
            <CRow>
              <CCol xs={12} md={6}>
                <CWidgetStatsF
                  className="mb-3"
                  color="success"
                  icon={<CIcon icon={cilCash} height={24} />}
                  title="Total Income"
                  value={`Rp. ${formatNumber(total)}`} />
              </CCol>
              <CCol xs={12} md={6}>
                <CWidgetStatsF
                  className="mb-3"
                  color="info"
                  icon={<CIcon icon={cilTablet} height={24} />}
                  title="Board Game Income"
                  value={`Rp. ${formatNumber(table)}`} />
              </CCol>
              <CCol xs={12} md={6}>
                <CWidgetStatsF
                  className="mb-3"
                  color="primary"
                  icon={<CIcon icon={cilCoffee} height={24} />}
                  title="Cafe Income"
                  value={`Rp. ${formatNumber(cafe)}`} />
              </CCol>
            </CRow>
          </CCardFooter>
        </CCard>

        <CRow>
          <CCol xs>
            {error && <CAlert color="danger">{error}</CAlert>}
            <CCard className="mb-4">
              <CCardHeader><b>Buka / Tutup Kasir</b></CCardHeader>
              <CCardBody>
                <CForm>
                  <CContainer>
                    {tmpCashier === undefined && <CRow className="mb-3">
                      <CFormLabel className="col-sm-3 col-form-label">Saldo Awal</CFormLabel>
                      <CCol sm={9}>
                        <CFormInput
                          type="text"
                          placeholder="Input Saldo Awal"
                          value={formatNumber(saldoAwal)}
                          onChange={(e) => setSaldoAwal(e.target.value.replace(/,/g, ""))}
                          feedbackInvalid="Input hanya menerima angka."
                          required
                        />
                      </CCol>
                    </CRow>}
                    {tmpCashier?.status === "OPEN" && <>
                      <CRow className="mb-3">
                        <CFormLabel className="col-sm-3 col-form-label">Saldo Awal</CFormLabel>
                        <CCol sm={9}>
                          <CFormInput
                            type="text"
                            value={formatNumber(tmpCashier?.saldoAwal)}
                            plainText
                          />
                        </CCol>
                      </CRow>
                      <CRow className="mb-3">
                        <CFormLabel className="col-sm-3 col-form-label">Total Transaksi Tunai</CFormLabel>
                        <CCol sm={9}>
                          <CFormInput
                            type="text"
                            style={{ color: "green" }}
                            value={`+${formatNumber(tmpCash)}`}
                            plainText
                          />
                        </CCol>
                      </CRow>
                      <CRow className="mb-3">
                        <CFormLabel className="col-sm-3 col-form-label">Total Uang Masuk</CFormLabel>
                        <CCol sm={9}>
                          <CFormInput
                            type="text"
                            style={{ color: "green" }}
                            value={`+${formatNumber(tmpPemasukan)}`}
                            plainText
                          />
                        </CCol>
                      </CRow>
                      <CRow className="mb-3">
                        <CFormLabel className="col-sm-3 col-form-label">Total Uang Keluar</CFormLabel>
                        <CCol sm={9}>
                          <CFormInput
                            type="text"
                            style={{ color: "red" }}
                            value={`-${formatNumber(tmpPengeluaran)}`}
                            plainText
                          />
                        </CCol>
                      </CRow>
                      <CRow className="mb-3">
                        <CFormLabel className="col-sm-3 col-form-label">Saldo Akhir</CFormLabel>
                        <CCol sm={9}>
                          <CFormInput
                            type="text"
                            placeholder="Input Saldo Akhir"
                            value={formatNumber(saldoAkhir)}
                            onChange={(e) => setSaldoAkhir(e.target.value.replace(/,/g, ""))}
                            feedbackInvalid="Input hanya menerima angka."
                            required
                          />
                        </CCol>
                      </CRow>
                      <CRow className="mb-3">
                        <CFormLabel className="col-sm-3 col-form-label">Selisih</CFormLabel>
                        <CCol sm={9}>
                          <CFormInput
                            type="text"
                            style={{ color: Math.sign(selisih) === -1 ? "red" : "green" }}
                            value={formatNumber(selisih)}
                            plainText
                          />
                        </CCol>
                      </CRow>
                    </>}
                    <CCol xs={12} className="d-flex justify-content-end">
                      {!loading ?
                        (tmpCashier === undefined ?
                          <CButton color="primary" type="submit" onClick={(e) => openCashier(e, "cashier")}> Buka Kasir</CButton> :
                          <>
                            <CButton color="primary" className='me-2' onClick={() => { setVisible(true); setAction("cash_in"); setCol("cashier") }}> Uang Masuk</CButton>
                            <CButton color="info" className='me-2' onClick={() => { setVisible(true); setAction("cash_out"); setCol("cashier") }}> Uang Keluar</CButton>
                            <CButton color="danger" type="submit" onClick={(e) => { closeCashier(e, "cashier") }}> Tutup Kasir</CButton>
                          </>
                        )
                        : <CSpinner color="primary" className="float-end" variant="grow" />}
                    </CCol>
                  </CContainer>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
        <AppTable
          title={"Laporan Kasir"}
          column={[
            { name: "#", key: "index" },
            { name: "Tanggal", key: "tanggal" },
            { name: "Jam Buka", key: "time_in" },
            { name: "Jam Tutup", key: "closeAt" },
            { name: "Saldo Awal", key: "saldoAwal" },
            { name: "Pemasukan", key: "pemasukan" },
            { name: "Pengeluaran", key: "pengeluaran" },
            { name: "Saldo Akhir", key: "saldoAkhir" },
            { name: "Action", key: "action" },
          ]}
          // query={query(collection(firestore, "cashier"), orderBy("createdAt", "desc"))}
          // listStatus={[{ name: "OPEN", color: "success" }, { name: "CLOSE", color: "danger" }]}
          // refData={data}
          collection={"cashier"} // Ambil data dari koleksi "cashiers"
          filter={{}} // Bisa diberikan filter
          sort={{ createdAt: -1 }} // Sortir dari terbaru
          cashierData={detailCashier}
          filterDate={true}
          refresh={refresh}
          setTitle={setTitle}
          setDetail={setDetail}
          setVisible={setVisible}
          setAction={setAction}
          setHapus={setHapus}
        // defaultDate={moment().format("YYYY-MM-DD").toString()}
        />

        {/* <CCard className="mb-4">
          <CCardBody>
            <CRow>
              <CCol sm={5}>
                <h4 id="traffic" className="card-title mb-0">
                  Detail Income Cafe
                </h4>
              </CCol>
              <CCol sm={7}>
                <CButtonGroup className="float-end me-3 mb-2">
                  {['Day', 'Month'].map((value) => (
                    <CButton
                      color="outline-secondary"
                      key={value}
                      className="mx-0"
                      onClick={() => setActiveBtnCafe(value)}
                      active={value === activeBtnCafe}
                    >
                      {value}
                    </CButton>
                  ))}
                </CButtonGroup>
                <CInputGroup>
                  {activeBtnCafe === "Day" && <>
                    <CFormInput
                      type="date"
                      className='mb-3'
                      value={startDateCafe}
                      onChange={(e) => setStartDateCafe(e.target.value)}
                      placeholder="Start Date"
                      aria-label="Start Date"
                    />
                    <CInputGroupText className='mb-3'
                    >~</CInputGroupText>
                    <CFormInput
                      type="date"
                      className='mb-3'
                      value={endDateCafe}
                      onChange={(e) => setEndDateCafe(e.target.value)}
                      placeholder="End Date"
                      aria-label="End Date"
                    />
                    <CInputGroupText className="mb-3 close-btn" style={{ backgroundColor: "#e74c3c", color: "white", border: "none", cursor: "pointer" }} onClick={() => { setStartDateCafe(""); setEndDateCafe("") }}><b>x</b></CInputGroupText>
                  </>}
                  {activeBtnCafe === "Month" && <>
                    <CFormSelect
                      value={startDate}
                      onChange={(e) => setStartDateCafe(e.target.value)}
                      style={{ height: "38px" }}
                    >
                      <option value="">Pilih Bulan</option>
                      <option value="January">January</option>
                      <option value="February">February</option>
                      <option value="March">March</option>
                      <option value="April">April</option>
                      <option value="May">May</option>
                      <option value="June">June</option>
                      <option value="July">July</option>
                      <option value="August">August</option>
                      <option value="September">September</option>
                      <option value="October">October</option>
                      <option value="November">November</option>
                      <option value="December">December</option>
                    </CFormSelect>
                    <CInputGroupText className='mb-3'
                    >~</CInputGroupText>
                    <CFormSelect
                      value={endDateCafe}
                      onChange={(e) => setEndDateCafe(e.target.value)}
                      style={{ height: "38px" }}
                    >
                      <option value="">Pilih Bulan</option>
                      <option value="January">January</option>
                      <option value="February">February</option>
                      <option value="March">March</option>
                      <option value="April">April</option>
                      <option value="May">May</option>
                      <option value="June">June</option>
                      <option value="July">July</option>
                      <option value="August">August</option>
                      <option value="September">September</option>
                      <option value="October">October</option>
                      <option value="November">November</option>
                      <option value="December">December</option>
                    </CFormSelect>
                    <CInputGroupText className="mb-3 close-btn" style={{ backgroundColor: "#e74c3c", color: "white", border: "none", cursor: "pointer" }} onClick={() => { setStartDateCafe(""); setEndDateCafe("") }}><b>x</b></CInputGroupText>
                  </>}
                </CInputGroup>
              </CCol>
            </CRow>
          </CCardBody>
          <CCardFooter>
            <CRow>
              <CCol xs={12} md={6}>
                <CWidgetStatsF
                  className="mb-3"
                  color="success"
                  icon={<CIcon icon={cilCash} height={24} />}
                  title="Cafe (Cash)"
                  value={`Rp. ${formatNumber(cashCafe)}`} />
              </CCol>
              <CCol xs={12} md={6}>
                <CWidgetStatsF
                  className="mb-3"
                  color="warning"
                  icon={<CIcon icon={cilPaperPlane} height={24} />}
                  title="Cafe (QRIS)"
                  value={`Rp. ${formatNumber(qrisCafe)}`} />
              </CCol>
              <CCol xs={12} md={6}>
                <CWidgetStatsF
                  className="mb-3"
                  color="danger"
                  icon={<CIcon icon={cilEnvelopeClosed} height={24} />}
                  title="Tax"
                  value={`Rp. ${formatNumber(tax)}`} />
              </CCol>
              <CCol xs={12} md={6}>
                <CWidgetStatsF
                  className="mb-3"
                  color="primary"
                  icon={<CIcon icon={cilPeople} height={24} />}
                  title="Service"
                  value={`Rp. ${formatNumber(service)}`} />
              </CCol>

            </CRow>
          </CCardFooter>
        </CCard> */}

        {/* <CRow>
          <CCol xs>
            {errorCafe && <CAlert color="danger">{errorCafe}</CAlert>}
            <CCard className="mb-4">
              <CCardHeader><b>Buka / Tutup Kasir Cafe</b></CCardHeader>
              <CCardBody>
                <CForm>
                  <CContainer>
                    {tmpCashierCafe === undefined && <CRow className="mb-3">
                      <CFormLabel className="col-sm-3 col-form-label">Saldo Awal</CFormLabel>
                      <CCol sm={9}>
                        <CFormInput
                          type="text"
                          placeholder="Input Saldo Awal"
                          value={formatNumber(saldoAwalCafe)}
                          onChange={(e) => setSaldoAwalCafe(e.target.value.replace(/,/g, ""))}
                          feedbackInvalid="Input hanya menerima angka."
                          required
                        />
                      </CCol>
                    </CRow>}
                    {tmpCashierCafe?.status === "OPEN" && <>
                      <CRow className="mb-3">
                        <CFormLabel className="col-sm-3 col-form-label">Saldo Awal</CFormLabel>
                        <CCol sm={9}>
                          <CFormInput
                            type="text"
                            value={formatNumber(tmpCashierCafe?.saldoAwal)}
                            plainText
                          />
                        </CCol>
                      </CRow>
                      <CRow className="mb-3">
                        <CFormLabel className="col-sm-3 col-form-label">Total Transaksi Tunai</CFormLabel>
                        <CCol sm={9}>
                          <CFormInput
                            type="text"
                            style={{ color: "green" }}
                            value={`+${formatNumber(tmpCashCafe)}`}
                            plainText
                          />
                        </CCol>
                      </CRow>
                      <CRow className="mb-3">
                        <CFormLabel className="col-sm-3 col-form-label">Total Uang Masuk</CFormLabel>
                        <CCol sm={9}>
                          <CFormInput
                            type="text"
                            style={{ color: "green" }}
                            value={`+${formatNumber(tmpPemasukanCafe)}`}
                            plainText
                          />
                        </CCol>
                      </CRow>
                      <CRow className="mb-3">
                        <CFormLabel className="col-sm-3 col-form-label">Total Uang Keluar</CFormLabel>
                        <CCol sm={9}>
                          <CFormInput
                            type="text"
                            style={{ color: "red" }}
                            value={`-${formatNumber(tmpPengeluaranCafe)}`}
                            plainText
                          />
                        </CCol>
                      </CRow>
                      <CRow className="mb-3">
                        <CFormLabel className="col-sm-3 col-form-label">Saldo Akhir</CFormLabel>
                        <CCol sm={9}>
                          <CFormInput
                            type="text"
                            placeholder="Input Saldo Akhir"
                            value={formatNumber(saldoAkhirCafe)}
                            onChange={(e) => setSaldoAkhirCafe(e.target.value.replace(/,/g, ""))}
                            feedbackInvalid="Input hanya menerima angka."
                            required
                          />
                        </CCol>
                      </CRow>
                      <CRow className="mb-3">
                        <CFormLabel className="col-sm-3 col-form-label">Selisih</CFormLabel>
                        <CCol sm={9}>
                          <CFormInput
                            type="text"
                            style={{ color: Math.sign(selisihCafe) === -1 ? "red" : "green" }}
                            value={formatNumber(selisihCafe)}
                            plainText
                          />
                        </CCol>
                      </CRow>
                    </>}
                    <CCol xs={12} className="d-flex justify-content-end">
                      {!loading ?
                        (tmpCashierCafe === undefined ?
                          <CButton color="primary" type="submit" onClick={(e) => openCashier(e, "cashierCafe")}> Buka Kasir</CButton> :
                          <>
                            <CButton color="primary" className='me-2' onClick={() => { setVisible(true); setAction("cash_in"); setCol("cashierCafe") }}> Uang Masuk</CButton>
                            <CButton color="info" className='me-2' onClick={() => { setVisible(true); setAction("cash_out"); setCol("cashierCafe") }}> Uang Keluar</CButton>
                            <CButton color="danger" type="submit" onClick={(e) => { closeCashier(e, "cashierCafe") }}> Tutup Kasir</CButton>
                          </>
                        )
                        : <CSpinner color="primary" className="float-end" variant="grow" />}
                    </CCol>
                  </CContainer>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
        {/* {console.log(dataCafe)} */}
        {/*<AppTable
          title={"Laporan Kasir Cafe"}
          column={[
            { name: "#", key: "index" },
            { name: "Tanggal", key: "tanggal" },
            { name: "Jam Buka", key: "time_in" },
            { name: "Jam Tutup", key: "closeAt" },
            { name: "Saldo Awal", key: "saldoAwal" },
            { name: "Pemasukan", key: "pemasukan" },
            { name: "Pengeluaran", key: "pengeluaran" },
            { name: "Saldo Akhir", key: "saldoAkhir" },
            { name: "Action", key: "action" },
          ]}
          query={query(collection(firestore, "cashierCafe"), orderBy("createdAt", "desc"))}

          cashierData={detailCashierCafe}
          filterDate={true}
          setTitle={setTitle}
          setDetail={setDetail}
          setVisible={setVisible}
          setAction={setAction}
          setHapus={setHapus}
        /> */}

        <CRow>
          <CCol xs="12" md="12">
            <CCard>
              <CCardHeader>
                <b>Laporan Produk</b>
              </CCardHeader>
              <CCardBody>
                <CRow className='justify-content-end'>
                  <CCol xs={9} md={7} lg={6} xl={5}>
                    <CInputGroup style={{ width: "100%" }}>
                      <CFormInput
                        type="date"
                        className='mb-3'
                        value={startProductDate}
                        onChange={(e) => {
                          setStartProductDate(e.target.value)
                        }}
                        placeholder="Start Date"
                        aria-label="Start Date"
                      />
                      <CInputGroupText className='mb-3'
                      >~</CInputGroupText>
                      <CFormInput
                        type="date"
                        className='mb-3'
                        value={endProductDate}
                        onChange={(e) => {
                          setEndProductDate(e.target.value)
                        }}
                        placeholder="End Date"
                        aria-label="End Date"
                      />
                      <CInputGroupText className="mb-3 close-btn" style={{ backgroundColor: "#e74c3c", color: "white", border: "none", cursor: "pointer" }} onClick={() => { setStartProductDate(""); setEndProductDate(""); setFilterProduct([]) }}><b>x</b></CInputGroupText>
                    </CInputGroup>
                  </CCol>
                </CRow>

                <div style={{ maxHeight: "500px", overflowY: "auto" }} >
                  <CTable striped responsive>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>Nama Item</CTableHeaderCell>
                        <CTableHeaderCell>Qty</CTableHeaderCell>
                        <CTableHeaderCell>Harga</CTableHeaderCell>
                        <CTableHeaderCell>Total Harga</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {(startProductDate !== "" && endProductDate !== "") ? filterProduct.map((product, index) => (
                        <CTableRow key={index}>
                          <CTableDataCell>{product.name}</CTableDataCell>
                          <CTableDataCell>{product.qty}</CTableDataCell>
                          <CTableDataCell>{formatNumber(product.harga)}</CTableDataCell>
                          <CTableDataCell>{formatNumber(product.harga * product.qty)}</CTableDataCell>
                        </CTableRow>
                      )) :
                        productData.map((product, index) => (
                          <CTableRow key={index}>
                            <CTableDataCell>{product.name}</CTableDataCell>
                            <CTableDataCell>{product.qty}</CTableDataCell>
                            <CTableDataCell>{formatNumber(product.harga)}</CTableDataCell>
                            <CTableDataCell>{formatNumber(product.harga * product.qty)}</CTableDataCell>
                          </CTableRow>
                        ))
                      }
                      <CTableRow>
                        <CTableDataCell colSpan={3}><b>Total</b></CTableDataCell>
                        <CTableDataCell><b>{formatNumber(productData.reduce((total, data) => { return total + (data?.harga * data?.qty) }, 0))}</b></CTableDataCell>
                      </CTableRow>
                    </CTableBody>
                  </CTable>
                </div>


              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </> : <Loading />}
      <CModal
        size="lg"
        scrollable
        alignment='center'
        visible={visible}
        onClose={() => { setSaldoAwal(""); setIsEditDate(false); setIsEditTimeIn(false); setIsEditTimeOut(false); setSaldoAkhir(""); setPemasukan(""); setPengeluaran(""); setNote(""); setDetail([]); setVisible(false); setAction(null); }}
        aria-labelledby="actionModal"
      >
        {renderModal()}
      </CModal>
    </Suspense>
  )
}

export default Report
