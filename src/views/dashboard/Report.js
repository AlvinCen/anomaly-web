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
  cilShare,
  cilCreditCard,
  cilBike,
  cilCalculator,
} from '@coreui/icons'
import WidgetsBrand from '../widgets/WidgetsBrand'
import WidgetsDropdown from '../widgets/WidgetsDropdown'
import MainChart from './MainChart'
import { NavLink } from 'react-router-dom'
import AppTable from '../../components/AppTable'
// import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc, Timestamp, where } from 'firebase/firestore'
import moment from 'moment-timezone'
import { formatNumber } from 'chart.js/helpers'
import Loading from '../../components/Loading'
import Swal from 'sweetalert2'
import { ConsoleView } from 'react-device-detect'
import api from '../../axiosInstance'
import { useAuth } from '../../AuthContext'
import { faAnchor, faDice, faHammer, faHelmetSafety, faMotorcycle, faPercent, faTable } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import DoughnutChartQty from '../../components/DoughnutChart'
import { exportProduct, exportStorage } from '../../components/ExportExcel'

const Report = () => {
  const { currentUser } = useAuth();

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

  const [startProductDateBoardGame, setStartProductDateBoardGame] = useState(moment().format("YYYY-MM-DD").toString());
  const [endProductDateBoardGame, setEndProductDateBoardGame] = useState(moment().format("YYYY-MM-DD").toString());
  const [startProductDateCafe, setStartProductDateCafe] = useState(moment().format("YYYY-MM-DD").toString());
  const [endProductDateCafe, setEndProductDateCafe] = useState(moment().format("YYYY-MM-DD").toString());

  const [productBoardGame, setProductBoardGame] = useState([]);
  const [filterProductBoardGame, setFilterProductBoardGame] = useState([]);
  const [productCafe, setProductCafe] = useState([]);
  const [filterProductCafe, setFilterProductCafe] = useState([]);

  const [activeBtn, setActiveBtn] = useState("Day")
  const [activeBtnCafe, setActiveBtnCafe] = useState("Day")
  const [initDataCafe, setInitDataCafe] = useState(false)
  const [initData, setInitData] = useState(false)
  const [dataCafe, setDataCafe] = useState([])
  const [initDataMerch, setInitDataMerch] = useState(false)
  const [dataMerch, setDataMerch] = useState([])
  const [storageLog, setStorageLog] = useState([])
  const [data, setData] = useState([])
  const [chartData, setChartData] = useState([])
  const [otherSales, setOtherSales] = useState(0)
  const [net, setNet] = useState(0)
  const [table, setTable] = useState(0)
  const [totalMinutes, setTotalMinutes] = useState(0)
  const [average, setAverage] = useState(0)
  const [minimum, setMinimum] = useState(0)
  const [maximum, setMaximum] = useState(0)
  const [cafe, setCafe] = useState(0)
  const [totalProductCafe, setTotalProductCafe] = useState(0)
  const [totalProductBG, setTotalProductBG] = useState(0)
  const [cash, setCash] = useState(0)
  const [cashless, setCashless] = useState(0)
  const [gofood, setGofood] = useState(0)
  const [grabfood, setGrabfood] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [tax, setTax] = useState(0)
  const [cashCafe, setCashCafe] = useState([])
  const [qrisCafe, setQrisCafe] = useState([])
  const [service, setService] = useState([])
  // const [service, set] = useState([])
  const [filterData, setFilterData] = useState([])
  const [startDate, setStartDate] = useState(moment().format("YYYY-MM-DD").toString());
  const [endDate, setEndDate] = useState(moment().format("YYYY-MM-DD").toString());
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

  const handleExport = () => {
    exportProduct(productCafe, productBoardGame)
  }

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


  const compareAddons = (addons1, addons2) => {
    if (addons1.length !== addons2.length) return false;
    return addons1.every((addon) => addons2.some((a) => a.name === addon.name));
  };

  function mergeItems(items) {
    const merged = [];

    // var sortedItems =  items.sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }));
    // const sortedItems = items.sort((a, b) => b.qty - a.qty);

    items.forEach((item) => {
      const existing = merged.find(
        (i) => i.itemId === item.itemId && compareAddons(i.addOns, item.addOns)
      );

      if (existing) {
        existing.qty = Number(existing.qty || 0) + Number(item.qty || 0);
        existing.totalHarga = Number(existing.totalHarga || 0) + Number(item.totalHarga || 0);
      } else {
        merged.push({ ...item });
      }
    });


    return merged;
  }

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


  function totalDurasiBoardGame(tableHistory) {
    let totalMenit = 0;
    let count = 0;
    let durasiList = [];

    tableHistory.forEach((doc) => {
      const hasBoardGameItem = Array.isArray(doc.item) && doc.item.some(
        (item) => item?.tipe || item?.category === "board game"
      );

      if (hasBoardGameItem && doc.start && doc.end) {
        const start = new Date(doc.start);
        const end = new Date(doc.end);
        const durasiMenit = (end - start) / 1000 / 60;

        if (durasiMenit > 0) {
          durasiList.push(durasiMenit);
          totalMenit += durasiMenit;
          count += 1;
        }
      }
    });

    const avgMenit = durasiList.length > 0 ? totalMenit / durasiList.length : 0;
    const minMenit = durasiList.length > 0 ? Math.min(...durasiList) : 0;
    const maxMenit = durasiList.length > 0 ? Math.max(...durasiList) : 0;

    const format = (menit) => {
      const jam = Math.floor(menit / 60);
      const sisamenit = Math.round(menit % 60);
      return { jam, menit: sisamenit };
    };

    return {
      totalMenit,
      total: format(totalMenit),
      avg: format(avgMenit),
      min: format(minMenit),
      max: format(maxMenit),
    };
  }


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

  // // Fungsi untuk mengambil data merchandise
  // const fetchMerchData = async () => {
  //   try {
  //     const response = await api.post('/data', {
  //       collection: "merchandise",
  //       filter: {},
  //       sort: {}
  //     })
  //     setDataMerch(response.data);
  //     setInitDataMerch(true);
  //   } catch (error) {
  //     console.error('Error fetching merchandise data:', error);
  //     // Swal.fire('Error', 'Gagal memuat data merchandise', 'error');
  //   } finally {
  //     (false);
  //   }
  // };
  const fetchStorageLog = async () => {
    try {
      const response = await api.post('/data', {
        collection: "storageLog",
        filter: {},
        sort: {}
      })
      setStorageLog(response.data);
    } catch (error) {
      console.error('Error fetching merchandise data:', error);
      // Swal.fire('Error', 'Gagal memuat data merchandise', 'error');
    }
  };

  // Fungsi untuk mengambil data menu report
  const fetchProductReport = async () => {
    try {
      const response = await api.post('/data', {
        collection: "productReport",
        filter: {},
        sort: {}
      })

      const response1 = await api.post('/data', {
        collection: "tableHistory",
        filter: {
          item: {
            $elemMatch: {
              $or: [
                { tipe: { $exists: true, $ne: null } },
                { category: "board game" }
              ]
            }
          }
        },
        sort: {}
      })


      const data = response.data
      var tableHistory = response1.data
      const productCafe = data.filter((data) => data.category !== "board game")
      const mergeCafe = mergeItems(productCafe)
      const sortedCafe = mergeCafe.sort((a, b) => b.qty - a.qty);
      const productBoardGame = data.filter((data) => data.category === "board game")
      const mergeBoardGame = mergeItems(productBoardGame)
      const sortedBoardGame = mergeBoardGame.sort((a, b) => b.qty - a.qty);
      var tmpTotalProductCafe = mergeCafe?.reduce((total, item) => {
        return total + item?.qty
      }, 0)
      var tmpTotalProductBG = mergeBoardGame?.reduce((total, item) => {
        return total + item?.qty
      }, 0)


      setProductBoardGame(sortedBoardGame);
      setProductCafe(sortedCafe);
      setInitProduct(true);

      // Filter data berdasarkan tanggal jika diperlukan
      if (startProductDateBoardGame && endProductDateBoardGame) {
        const filtered = productBoardGame.filter(item => {
          return moment(new Date(item.createdAt)).tz("Asia/Jakarta").isBetween(moment(startProductDateBoardGame).startOf("day"), moment(endProductDateBoardGame).endOf("day"))
        });
        const filterTableHistory = tableHistory.filter(item => {
          return moment(new Date(item.createdAt)).tz("Asia/Jakarta").isBetween(moment(startProductDateBoardGame).startOf("day"), moment(endProductDateBoardGame).endOf("day"))
        });
        var merge = mergeItems(filtered);
        tmpTotalProductBG = merge?.reduce((total, item) => {
          return total + item?.qty
        }, 0)
        const sortedData = merge.sort((a, b) => b.qty - a.qty);

        tableHistory = filterTableHistory
        setFilterProductBoardGame(sortedData);
      }
      if (startProductDateCafe && endProductDateCafe) {
        const filtered = productCafe.filter(item => {
          return moment(new Date(item.createdAt)).tz("Asia/Jakarta").isBetween(moment(startProductDateCafe).startOf("day"), moment(endProductDateCafe).endOf("day"))
        });
        var merge = mergeItems(filtered);
        tmpTotalProductCafe = merge?.reduce((total, item) => {
          return total + item?.qty
        }, 0)
        const sortedData = merge.sort((a, b) => b.qty - a.qty);
        setFilterProductCafe(sortedData);
      }

      const { totalMenit, avg, min, max, total } = totalDurasiBoardGame(tableHistory)

      setTotalMinutes(total)
      setAverage(avg)
      setMaximum(max)
      setMinimum(min)
      setTotalProductCafe(tmpTotalProductCafe)
      setTotalProductBG(tmpTotalProductBG)
    } catch (error) {
      console.error('Error fetching menu reports:', error);
      // Swal.fire('Error', 'Gagal memuat laporan menu', 'error');
    } finally {
      setLoading(false);
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

  // const fetchFilteredData = async () => {
  //   try {
  //     var tmpChart = []
  //     var cashTotal = 0
  //     var cashlessTotal = 0
  //     var gofoodTotal = 0
  //     var grabfoodTotal = 0
  //     var mStart = moment(startDate).tz("Asia/Jakarta").startOf("day").format();
  //     var mEnd = moment(endDate).tz("Asia/Jakarta").endOf("day").format();

  //     const tmpData = cashier.filter(cashier => {
  //       var createdAt = moment(cashier.createdAt).tz("Asia/Jakarta")
  //       return createdAt.isBetween(mStart, mEnd, undefined, '[]');
  //     });


  //     if (tmpData.length > 0) {
  //       // Hitung total
  //       const tableTotal = tmpData?.reduce((dailyTotal, cashier) => {
  //         var total = cashier?.transaction?.reduce((grandTotal, transaction) => {
  //           var total = transaction?.item.reduce((total, item) => {
  //             // const harga = data?.hargaVoid ? data?.hargaVoid : data?.harga;
  //             const harga = item?.harga || 0;
  //             if (item?.tipe) return total + ((Number(harga)) * item?.qty);
  //             else return total
  //           }, 0);
  //           return grandTotal + (total || 0)
  //         }, 0)
  //         return (total || 0) + dailyTotal
  //       }, 0)

  //       const cafeTotal = tmpData?.reduce((dailyTotal, cashier) => {
  //         var total = cashier?.transaction?.reduce((grandTotal, transaction) => {
  //           var total = transaction?.item.reduce((total, item) => {
  //             // const harga = data?.hargaVoid ? data?.hargaVoid : data?.harga;
  //             var totalAddOn = item?.addOns ? item?.addOns?.reduce((total1, item1) => {
  //               return total1 + Number(item1.harga);
  //             }, 0) : 0
  //             const harga = item?.harga || 0;
  //             if (item?.addOns !== undefined) return total + ((Number(harga) + Number(totalAddOn)) * item?.qty);
  //             else return total
  //           }, 0);
  //           return grandTotal + (total || 0)
  //         }, 0)
  //         return (total || 0) + dailyTotal
  //       }, 0)

  //       const discountTotal = tmpData?.reduce((dailyTotal, cashier) => {
  //         var total = cashier?.transaction?.reduce((grandTotal, transaction) => {
  //           var cafeTotal = transaction?.item.reduce((total, item) => {
  //             // const harga = data?.hargaVoid ? data?.hargaVoid : data?.harga;
  //             var totalAddOn = item?.addOns ? item?.addOns?.reduce((total1, item1) => {
  //               return total1 + Number(item1.harga);
  //             }, 0) : 0
  //             const harga = item?.harga || 0;
  //             if (item?.addOns !== undefined) return total + (((Number(harga) + Number(totalAddOn)) * item?.qty) || 0);
  //             else return total
  //           }, 0);
  //           var transactionDiscount = transaction?.typeDiscount ? (transaction?.discount / 100) * cafeTotal : cafeTotal - transaction?.discount
  //           return grandTotal + transactionDiscount
  //         }, 0)
  //         return (total || 0) + dailyTotal
  //       }, 0)

  //       const taxTotal = tmpData?.reduce((dailyTotal, cashier) => {
  //         var total = cashier?.transaction?.reduce((grandTotal, transaction) => {
  //           var cafeTotal = transaction?.item.reduce((total, item) => {
  //             // const harga = data?.hargaVoid ? data?.hargaVoid : data?.harga;
  //             var totalAddOn = item?.addOns ? item?.addOns?.reduce((total1, item1) => {
  //               return total1 + Number(item1.harga);
  //             }, 0) : 0
  //             const harga = item?.harga || 0;
  //             if (item?.addOns !== undefined) return total + ((Number(harga) + Number(totalAddOn)) * item?.qty);
  //             else return total
  //           }, 0);
  //           var tax = transaction?.tax * (cafeTotal || 0)
  //           return grandTotal + tax
  //         }, 0)
  //         return (total || 0) + dailyTotal
  //       }, 0)

  //       tmpData?.map((cashier) => {
  //         cashier?.transaction?.map((transaction) => {
  //           if (transaction?.splitBill === undefined) {
  //             if (transaction?.paymentMethod === "cash") {
  //               var total = transaction?.item.reduce((sum, item) => {
  //                 // const harga = data?.hargaVoid ? data?.hargaVoid : data?.harga;
  //                 const harga = item?.harga || 0;
  //                 return sum + ((Number(harga)) * item?.qty);
  //               }, 0);
  //               cashTotal += Number(total || 0)
  //             }
  //             else if (transaction?.paymentMethod === "qris" || transaction?.paymentMethod === "debit") {
  //               var total = transaction?.item.reduce((total, item) => {
  //                 // const harga = data?.hargaVoid ? data?.hargaVoid : data?.harga;
  //                 const harga = item?.harga || 0;
  //                 return total + ((Number(harga)) * item?.qty);
  //               }, 0);
  //               cashlessTotal += (total || 0)
  //             }
  //             else if (transaction?.paymentMethod === "grabfood") {
  //               var total = transaction?.item.reduce((total, item) => {
  //                 // const harga = data?.hargaVoid ? data?.hargaVoid : data?.harga;
  //                 const harga = item?.harga || 0;
  //                 return total + ((Number(harga)) * item?.qty);
  //               }, 0);
  //               grabfoodTotal += (total || 0)
  //             }
  //             else if (transaction?.paymentMethod === "gofood") {
  //               var total = transaction?.item.reduce((total, item) => {
  //                 // const harga = data?.hargaVoid ? data?.hargaVoid : data?.harga;
  //                 const harga = item?.harga || 0;
  //                 return total + ((Number(harga)) * item?.qty);
  //               }, 0);
  //               gofoodTotal += (total || 0)
  //             }
  //           }
  //           else {
  //             // console.log(transaction)
  //             transaction?.splitBill.map((splitBill) => {
  //               if (splitBill?.paymentMethod === "cash") {
  //                 var total = splitBill?.item.reduce((total, item) => {
  //                   const harga = item?.harga || 0;
  //                   return total + ((Number(harga)) * item?.qty);
  //                 }, 0);
  //                 cashTotal += (total || 0)
  //               }
  //               else if (splitBill?.paymentMethod === "qris" || splitBill?.paymentMethod === "debit") {
  //                 var total = splitBill?.item.reduce((total, item) => {
  //                   // const harga = data?.hargaVoid ? data?.hargaVoid : data?.harga;More actions
  //                   const harga = item?.harga || 0;
  //                   return total + ((Number(harga)) * item?.qty);
  //                 }, 0);
  //                 cashlessTotal += (total || 0)
  //               }
  //               else if (splitBill?.paymentMethod === "grabfood") {
  //                 var total = splitBill?.item.reduce((total, item) => {
  //                   // const harga = data?.hargaVoid ? data?.hargaVoid : data?.harga;More actions
  //                   const harga = item?.harga || 0;
  //                   return total + ((Number(harga)) * item?.qty);
  //                 }, 0);
  //                 grabfoodTotal += (total || 0)
  //               }
  //               else if (splitBill?.paymentMethod === "gofood") {
  //                 var total = splitBill?.item.reduce((total, item) => {
  //                   // const harga = data?.hargaVoid ? data?.hargaVoid : data?.harga;More actions
  //                   const harga = item?.harga || 0;
  //                   return total + ((Number(harga)) * item?.qty);
  //                 }, 0);
  //                 gofoodTotal += (total || 0)
  //               }
  //             });
  //           }
  //         })
  //       })

  //       const totalCost = (storageLog || []).reduce((total, storage) => {
  //         if (storage?.beforeStok > storage?.stok) {
  //           var usedStok = Number(storage.beforeStok) - Number(storage.stok)
  //           return total + (usedStok * storage?.costPerItem)
  //         }
  //         else return total
  //       }, 0)

  //       // var tmpPemasukan = tmpCashier?.pemasukan?.reduce((total, data) => { return total + data?.value }, 0)More actions
  //       cashTotal += tmpPemasukan || 0
  //       // console.log(totalCost)

  //       setGross((tableTotal + cafeTotal) || 0);
  //       setNet(((tableTotal + cafeTotal) + taxTotal - discountTotal) || 0);
  //       setTable(tableTotal || 0);
  //       setCafe(cafeTotal || 0)
  //       setCash(cashTotal || 0)
  //       setCashless(cashlessTotal || 0)
  //       setGrabfood(grabfoodTotal || 0)
  //       setGofood(gofoodTotal || 0)
  //       // setNetCafe(cafeTotal || 0)
  //       setDiscount(discountTotal || 0)
  //       setTax(taxTotal || 0)
  //       setFilterData(tmpData);
  //     } else {
  //       setGross(0);
  //       setNet(0);
  //       setTable(0);
  //       setCafe(0)
  //       setCash(0)
  //       setCashless(0)
  //       setGofood(0)
  //       setGrabfood(0)
  //       // setNetCafe(0)
  //       setDiscount(0)
  //       setTax(0)
  //       setFilterData([]);
  //     }


  //   } catch (error) {
  //     console.error('Error fetching filtered data:', error);
  //   }
  // };

  // Fungsi untuk mengambil data produk dengan filter tanggal

  const fetchFilteredData = async () => {
    try {
      var tmpChart = []
      var tmpPemasukan = 0
      var cashTotal = 0
      var cashlessTotal = 0
      var gofoodTotal = 0
      var grabfoodTotal = 0
      var mStart = moment(startDate).tz("Asia/Jakarta").startOf("day").format();
      var mEnd = moment(endDate).tz("Asia/Jakarta").endOf("day").format();

      if (moment(mStart).isValid() && moment(mEnd).isValid()) {
        const tmpData = cashier.filter(cashier => {
          var createdAt = moment(cashier.createdAt).tz("Asia/Jakarta")
          return createdAt.isBetween(mStart, mEnd, undefined, '[]');
        });

        if (moment.duration(moment(mEnd).diff(moment(mStart))).asDays() < 7) {
          mStart = moment(mEnd).subtract(6, "days").startOf("day").format();
          const tmpData = cashier.filter(cashier => {
            var createdAt = moment(cashier.createdAt).tz("Asia/Jakarta")
            return createdAt.isBetween(mStart, mEnd, undefined, '[]');
          });
          tmpData?.map((cashier) => {
            var total = cashier?.transaction?.reduce((dailyTotal, transaction) => {
              var tableTotal = transaction?.item.reduce((total, item) => {
                // const harga = data?.hargaVoid ? data?.hargaVoid : data?.harga;
                const harga = item?.harga || 0;
                if (item?.tipe) return total + ((Number(harga)) * item?.qty);
                else return total
              }, 0);
              var cafeTotal = transaction?.item.reduce((total, item) => {
                // const harga = data?.hargaVoid ? data?.hargaVoid : data?.harga;
                var totalAddOn = item?.addOns ? item?.addOns?.reduce((total1, item1) => {
                  return total1 + Number(item1.harga);
                }, 0) : 0
                const harga = item?.harga || 0;
                if (item?.addOns !== undefined) return total + ((Number(harga) + Number(totalAddOn)) * item?.qty);
                else return total
              }, 0);
              var discount = transaction?.typeDiscount ? (transaction?.discount / 100) * cafeTotal : cafeTotal - transaction?.discount
              var tax = transaction?.tax * (cafeTotal || 0)
              var grandTotal = (tableTotal + cafeTotal) + tax - discount
              return dailyTotal + grandTotal
            }, 0)
            tmpChart.push(total)
          })
        } else {
          tmpData?.map((cashier) => {
            var total = cashier?.transaction?.reduce((dailyTotal, transaction) => {
              var tableTotal = transaction?.item.reduce((total, item) => {
                // const harga = data?.hargaVoid ? data?.hargaVoid : data?.harga;
                const harga = item?.harga || 0;
                if (item?.tipe) return total + ((Number(harga)) * item?.qty);
                else return total
              }, 0);
              var cafeTotal = transaction?.item.reduce((total, item) => {
                // const harga = data?.hargaVoid ? data?.hargaVoid : data?.harga;
                var totalAddOn = item?.addOns ? item?.addOns?.reduce((total1, item1) => {
                  return total1 + Number(item1.harga);
                }, 0) : 0
                const harga = item?.harga || 0;
                if (item?.addOns !== undefined) return total + ((Number(harga) + Number(totalAddOn)) * item?.qty);
                else return total
              }, 0);
              var discount = transaction?.typeDiscount ? (transaction?.discount / 100) * cafeTotal : cafeTotal - transaction?.discount
              var tax = transaction?.tax * (cafeTotal || 0)
              var grandTotal = (tableTotal + cafeTotal) + tax - discount
              return dailyTotal + grandTotal
            }, 0)
            tmpChart.push(total)
          })
        }

        if (tmpChart.length > 0) {
          setChartData(tmpChart)
        }

        if (tmpData.length > 0) {
          // Hitung total
          const tableTotal = tmpData?.reduce((dailyTotal, cashier) => {
            var total = cashier?.transaction?.reduce((grandTotal, transaction) => {
              var total = transaction?.item.reduce((total, item) => {
                // const harga = data?.hargaVoid ? data?.hargaVoid : data?.harga;
                const harga = item?.harga || 0;
                if (item?.tipe) return total + ((Number(harga)) * item?.qty);
                else return total
              }, 0);
              return grandTotal + (total || 0)
            }, 0)
            return (total || 0) + dailyTotal
          }, 0)

          const cafeTotal = tmpData?.reduce((dailyTotal, cashier) => {
            var total = cashier?.transaction?.reduce((grandTotal, transaction) => {
              var total = transaction?.item.reduce((total, item) => {
                // const harga = data?.hargaVoid ? data?.hargaVoid : data?.harga;
                var totalAddOn = item?.addOns ? item?.addOns?.reduce((total1, item1) => {
                  return total1 + Number(item1.harga);
                }, 0) : 0
                const harga = item?.harga || 0;
                if (item?.addOns !== undefined) return total + ((Number(harga) + Number(totalAddOn)) * item?.qty);
                else return total
              }, 0);
              return grandTotal + (total || 0)
            }, 0)
            return (total || 0) + dailyTotal
          }, 0)

          const discountTotal = tmpData?.reduce((dailyTotal, cashier) => {
            var total = cashier?.transaction?.reduce((grandTotal, transaction) => {
              var cafeTotal = transaction?.item.reduce((total, item) => {
                // const harga = data?.hargaVoid ? data?.hargaVoid : data?.harga;
                var totalAddOn = item?.addOns ? item?.addOns?.reduce((total1, item1) => {
                  return total1 + Number(item1.harga);
                }, 0) : 0
                const harga = item?.harga || 0;
                if (item?.addOns !== undefined) return total + (((Number(harga) + Number(totalAddOn)) * item?.qty) || 0);
                else return total
              }, 0);
              var transactionDiscount = transaction?.typeDiscount ? (transaction?.discount / 100) * cafeTotal : cafeTotal - transaction?.discount
              return grandTotal + transactionDiscount
            }, 0)
            return (total || 0) + dailyTotal
          }, 0)

          const taxTotal = tmpData?.reduce((dailyTotal, cashier) => {
            var total = cashier?.transaction?.reduce((grandTotal, transaction) => {
              var cafeTotal = transaction?.item.reduce((total, item) => {
                // const harga = data?.hargaVoid ? data?.hargaVoid : data?.harga;
                var totalAddOn = item?.addOns ? item?.addOns?.reduce((total1, item1) => {
                  return total1 + Number(item1.harga);
                }, 0) : 0
                const harga = item?.harga || 0;
                if (item?.addOns !== undefined) return total + ((Number(harga) + Number(totalAddOn)) * item?.qty);
                else return total
              }, 0);
              var tax = transaction?.tax * (cafeTotal || 0)
              return grandTotal + tax
            }, 0)
            return (total || 0) + dailyTotal
          }, 0)

          tmpData?.map((cashier) => {
            tmpPemasukan += cashier?.pemasukan?.reduce((total, data) => { return total + data?.value }, 0)

            cashier?.transaction?.map((transaction) => {
              if (transaction?.splitBill === undefined) {
                if (transaction?.paymentMethod === "cash") {
                  // var total = transaction?.item.reduce((sum, item) => {
                  //   // const harga = data?.hargaVoid ? data?.hargaVoid : data?.harga;
                  //   const harga = item?.harga || 0;
                  //   return sum + ((Number(harga)) * item?.qty);
                  // }, 0);
                  var tableTotal = transaction?.item.reduce((total, item) => {
                    // const harga = data?.hargaVoid ? data?.hargaVoid : data?.harga;
                    const harga = item?.harga || 0;
                    if (item?.tipe) return total + ((Number(harga)) * item?.qty);
                    else return total
                  }, 0);
                  var cafeTotal = transaction?.item.reduce((total, item) => {
                    // const harga = data?.hargaVoid ? data?.hargaVoid : data?.harga;
                    var totalAddOn = item?.addOns ? item?.addOns?.reduce((total1, item1) => {
                      return total1 + Number(item1.harga);
                    }, 0) : 0
                    const harga = item?.harga || 0;
                    if (item?.addOns !== undefined) return total + ((Number(harga) + Number(totalAddOn)) * item?.qty);
                    else return total
                  }, 0);
                  var discount = transaction?.typeDiscount ? (transaction?.discount / 100) * cafeTotal : cafeTotal - transaction?.discount
                  var tax = transaction?.tax * (cafeTotal || 0)
                  var grandTotal = (tableTotal + cafeTotal) + tax - discount
                  cashTotal += Number(grandTotal || 0)
                }
                else if (transaction?.paymentMethod === "qris" || transaction?.paymentMethod === "debit") {
                  // var total = transaction?.item.reduce((total, item) => {
                  //   // const harga = data?.hargaVoid ? data?.hargaVoid : data?.harga;
                  //   const harga = item?.harga || 0;
                  //   return total + ((Number(harga)) * item?.qty);
                  // }, 0);
                  var tableTotal = transaction?.item.reduce((total, item) => {
                    // const harga = data?.hargaVoid ? data?.hargaVoid : data?.harga;
                    const harga = item?.harga || 0;
                    if (item?.tipe) return total + ((Number(harga)) * item?.qty);
                    else return total
                  }, 0);
                  var cafeTotal = transaction?.item.reduce((total, item) => {
                    // const harga = data?.hargaVoid ? data?.hargaVoid : data?.harga;
                    var totalAddOn = item?.addOns ? item?.addOns?.reduce((total1, item1) => {
                      return total1 + Number(item1.harga);
                    }, 0) : 0
                    const harga = item?.harga || 0;
                    if (item?.addOns !== undefined) return total + ((Number(harga) + Number(totalAddOn)) * item?.qty);
                    else return total
                  }, 0);
                  var discount = transaction?.typeDiscount ? (transaction?.discount / 100) * cafeTotal : cafeTotal - transaction?.discount
                  var tax = transaction?.tax * (cafeTotal || 0)
                  var grandTotal = (tableTotal + cafeTotal) + tax - discount
                  cashlessTotal += Number(grandTotal || 0)
                  // cashlessTotal += (total || 0)
                }
                else if (transaction?.paymentMethod === "grabfood") {
                  // var total = transaction?.item.reduce((total, item) => {
                  //   // const harga = data?.hargaVoid ? data?.hargaVoid : data?.harga;
                  //   const harga = item?.harga || 0;
                  //   return total + ((Number(harga)) * item?.qty);
                  // }, 0);
                  var tableTotal = transaction?.item.reduce((total, item) => {
                    // const harga = data?.hargaVoid ? data?.hargaVoid : data?.harga;
                    const harga = item?.harga || 0;
                    if (item?.tipe) return total + ((Number(harga)) * item?.qty);
                    else return total
                  }, 0);
                  var cafeTotal = transaction?.item.reduce((total, item) => {
                    // const harga = data?.hargaVoid ? data?.hargaVoid : data?.harga;
                    var totalAddOn = item?.addOns ? item?.addOns?.reduce((total1, item1) => {
                      return total1 + Number(item1.harga);
                    }, 0) : 0
                    const harga = item?.harga || 0;
                    if (item?.addOns !== undefined) return total + ((Number(harga) + Number(totalAddOn)) * item?.qty);
                    else return total
                  }, 0);
                  var discount = transaction?.typeDiscount ? (transaction?.discount / 100) * cafeTotal : cafeTotal - transaction?.discount
                  var tax = transaction?.tax * (cafeTotal || 0)
                  var grandTotal = (tableTotal + cafeTotal) + tax - discount
                  grabfoodTotal += Number(grandTotal || 0)
                  // grabfoodTotal += (total || 0)
                }
                else if (transaction?.paymentMethod === "gofood") {
                  // var total = transaction?.item.reduce((total, item) => {
                  //   // const harga = data?.hargaVoid ? data?.hargaVoid : data?.harga;
                  //   const harga = item?.harga || 0;
                  //   return total + ((Number(harga)) * item?.qty);
                  // }, 0);
                  var tableTotal = transaction?.item.reduce((total, item) => {
                    // const harga = data?.hargaVoid ? data?.hargaVoid : data?.harga;
                    const harga = item?.harga || 0;
                    if (item?.tipe) return total + ((Number(harga)) * item?.qty);
                    else return total
                  }, 0);
                  var cafeTotal = transaction?.item.reduce((total, item) => {
                    // const harga = data?.hargaVoid ? data?.hargaVoid : data?.harga;
                    var totalAddOn = item?.addOns ? item?.addOns?.reduce((total1, item1) => {
                      return total1 + Number(item1.harga);
                    }, 0) : 0
                    const harga = item?.harga || 0;
                    if (item?.addOns !== undefined) return total + ((Number(harga) + Number(totalAddOn)) * item?.qty);
                    else return total
                  }, 0);
                  var discount = transaction?.typeDiscount ? (transaction?.discount / 100) * cafeTotal : cafeTotal - transaction?.discount
                  var tax = transaction?.tax * (cafeTotal || 0)
                  var grandTotal = (tableTotal + cafeTotal) + tax - discount
                  gofoodTotal += Number(grandTotal || 0)
                  // gofoodTotal += (total || 0)
                }
              }
              else {
                // console.log(transaction)
                transaction?.splitBill.map((splitBill) => {
                  if (splitBill?.paymentMethod === "cash") {
                    // var total = transaction?.item.reduce((sum, item) => {
                    //   // const harga = data?.hargaVoid ? data?.hargaVoid : data?.harga;
                    //   const harga = item?.harga || 0;
                    //   return sum + ((Number(harga)) * item?.qty);
                    // }, 0);
                    var tableTotal = splitBill?.item.reduce((total, item) => {
                      // const harga = data?.hargaVoid ? data?.hargaVoid : data?.harga;
                      const harga = item?.harga || 0;
                      if (item?.tipe) return total + ((Number(harga)) * item?.qty);
                      else return total
                    }, 0);
                    var cafeTotal = splitBill?.item.reduce((total, item) => {
                      // const harga = data?.hargaVoid ? data?.hargaVoid : data?.harga;
                      var totalAddOn = item?.addOns ? item?.addOns?.reduce((total1, item1) => {
                        return total1 + Number(item1.harga);
                      }, 0) : 0
                      const harga = item?.harga || 0;
                      if (item?.addOns !== undefined) return total + ((Number(harga) + Number(totalAddOn)) * item?.qty);
                      else return total
                    }, 0);
                    var discount = transaction?.typeDiscount ? (transaction?.discount / 100) * cafeTotal : cafeTotal - transaction?.discount
                    var tax = transaction?.tax * (cafeTotal || 0)
                    var grandTotal = (tableTotal + cafeTotal) + tax - discount
                    cashTotal += Number(grandTotal || 0)
                  }
                  else if (splitBill?.paymentMethod === "qris" || splitBill?.paymentMethod === "debit") {
                    // var total = transaction?.item.reduce((total, item) => {
                    //   // const harga = data?.hargaVoid ? data?.hargaVoid : data?.harga;
                    //   const harga = item?.harga || 0;
                    //   return total + ((Number(harga)) * item?.qty);
                    // }, 0);
                    var tableTotal = splitBill?.item.reduce((total, item) => {
                      // const harga = data?.hargaVoid ? data?.hargaVoid : data?.harga;
                      const harga = item?.harga || 0;
                      if (item?.tipe) return total + ((Number(harga)) * item?.qty);
                      else return total
                    }, 0);
                    var cafeTotal = splitBill?.item.reduce((total, item) => {
                      // const harga = data?.hargaVoid ? data?.hargaVoid : data?.harga;
                      var totalAddOn = item?.addOns ? item?.addOns?.reduce((total1, item1) => {
                        return total1 + Number(item1.harga);
                      }, 0) : 0
                      const harga = item?.harga || 0;
                      if (item?.addOns !== undefined) return total + ((Number(harga) + Number(totalAddOn)) * item?.qty);
                      else return total
                    }, 0);
                    var discount = transaction?.typeDiscount ? (transaction?.discount / 100) * cafeTotal : cafeTotal - transaction?.discount
                    var tax = transaction?.tax * (cafeTotal || 0)
                    var grandTotal = (tableTotal + cafeTotal) + tax - discount
                    cashlessTotal += Number(grandTotal || 0)
                    // cashlessTotal += (total || 0)
                  }
                  else if (splitBill?.paymentMethod === "grabfood") {
                    // var total = transaction?.item.reduce((total, item) => {
                    //   // const harga = data?.hargaVoid ? data?.hargaVoid : data?.harga;
                    //   const harga = item?.harga || 0;
                    //   return total + ((Number(harga)) * item?.qty);
                    // }, 0);
                    var tableTotal = splitBill?.item.reduce((total, item) => {
                      // const harga = data?.hargaVoid ? data?.hargaVoid : data?.harga;
                      const harga = item?.harga || 0;
                      if (item?.tipe) return total + ((Number(harga)) * item?.qty);
                      else return total
                    }, 0);
                    var cafeTotal = splitBill?.item.reduce((total, item) => {
                      // const harga = data?.hargaVoid ? data?.hargaVoid : data?.harga;
                      var totalAddOn = item?.addOns ? item?.addOns?.reduce((total1, item1) => {
                        return total1 + Number(item1.harga);
                      }, 0) : 0
                      const harga = item?.harga || 0;
                      if (item?.addOns !== undefined) return total + ((Number(harga) + Number(totalAddOn)) * item?.qty);
                      else return total
                    }, 0);
                    var discount = transaction?.typeDiscount ? (transaction?.discount / 100) * cafeTotal : cafeTotal - transaction?.discount
                    var tax = transaction?.tax * (cafeTotal || 0)
                    var grandTotal = (tableTotal + cafeTotal) + tax - discount
                    grabfoodTotal += Number(grandTotal || 0)
                    // grabfoodTotal += (total || 0)
                  }
                  else if (splitBill?.paymentMethod === "gofood") {
                    // var total = transaction?.item.reduce((total, item) => {
                    //   // const harga = data?.hargaVoid ? data?.hargaVoid : data?.harga;
                    //   const harga = item?.harga || 0;
                    //   return total + ((Number(harga)) * item?.qty);
                    // }, 0);
                    var tableTotal = splitBill?.item.reduce((total, item) => {
                      // const harga = data?.hargaVoid ? data?.hargaVoid : data?.harga;
                      const harga = item?.harga || 0;
                      if (item?.tipe) return total + ((Number(harga)) * item?.qty);
                      else return total
                    }, 0);
                    var cafeTotal = splitBill?.item.reduce((total, item) => {
                      // const harga = data?.hargaVoid ? data?.hargaVoid : data?.harga;
                      var totalAddOn = item?.addOns ? item?.addOns?.reduce((total1, item1) => {
                        return total1 + Number(item1.harga);
                      }, 0) : 0
                      const harga = item?.harga || 0;
                      if (item?.addOns !== undefined) return total + ((Number(harga) + Number(totalAddOn)) * item?.qty);
                      else return total
                    }, 0);
                    var discount = transaction?.typeDiscount ? (transaction?.discount / 100) * cafeTotal : cafeTotal - transaction?.discount
                    var tax = transaction?.tax * (cafeTotal || 0)
                    var grandTotal = (tableTotal + cafeTotal) + tax - discount
                    gofoodTotal += Number(grandTotal || 0)
                    // gofoodTotal += (total || 0)
                  }
                });
              }
            })
          })

          const totalCost = (storageLog || []).reduce((total, storage) => {
            if (storage?.beforeStok > storage?.stok) {
              var usedStok = Number(storage.beforeStok) - Number(storage.stok)
              return total + (usedStok * storage?.costPerItem)
            }
            else return total
          }, 0)

          // var tmpPemasukan = tmpCashier?.pemasukan?.reduce((total, data) => { return total + data?.value }, 0)
          cashTotal += tmpPemasukan || 0
          // console.log(totalCost)

          setOtherSales(tmpPemasukan || 0);
          setNet(((tableTotal + cafeTotal + tmpPemasukan) + taxTotal - discountTotal) || 0);
          setTable(tableTotal || 0);
          setCafe(cafeTotal || 0)
          setCash(cashTotal || 0)
          setCashless(cashlessTotal || 0)
          setGrabfood(grabfoodTotal || 0)
          setGofood(gofoodTotal || 0)
          // setNetCafe(cafeTotal || 0)
          setDiscount(discountTotal || 0)
          setTax(taxTotal || 0)
          setFilterData(tmpData);
        } else {

          setOtherSales(0);
          setNet(0);
          setTable(0);
          setCafe(0)
          setCash(0)
          setCashless(0)
          setGofood(0)
          setGrabfood(0)
          // setNetCafe(0)
          setDiscount(0)
          setTax(0)
          setFilterData([]);
        }
      } else {
        const tmpData = cashier
        if (moment.duration(moment(mEnd).diff(moment(mStart))).asDays() < 7) {
          mStart = moment(mEnd).subtract(6, "days").startOf("day").format();
          console.log(tmpData)
          tmpData?.map((cashier) => {
            var total = cashier?.transaction?.reduce((dailyTotal, transaction) => {
              var tableTotal = transaction?.item.reduce((total, item) => {
                // const harga = data?.hargaVoid ? data?.hargaVoid : data?.harga;
                const harga = item?.harga || 0;
                if (item?.tipe) return total + ((Number(harga)) * item?.qty);
                else return total
              }, 0);
              var cafeTotal = transaction?.item.reduce((total, item) => {
                // const harga = data?.hargaVoid ? data?.hargaVoid : data?.harga;
                var totalAddOn = item?.addOns ? item?.addOns?.reduce((total1, item1) => {
                  return total1 + Number(item1.harga);
                }, 0) : 0
                const harga = item?.harga || 0;
                if (item?.addOns !== undefined) return total + ((Number(harga) + Number(totalAddOn)) * item?.qty);
                else return total
              }, 0);
              var discount = transaction?.typeDiscount ? (transaction?.discount / 100) * cafeTotal : cafeTotal - transaction?.discount
              var tax = transaction?.tax * (cafeTotal || 0)
              var grandTotal = (tableTotal + cafeTotal) + tax - discount
              return dailyTotal + grandTotal
            }, 0)
            tmpChart.push(total)
          })
        } else {
          tmpData?.map((cashier) => {
            var total = cashier?.transaction?.reduce((dailyTotal, transaction) => {
              var tableTotal = transaction?.item.reduce((total, item) => {
                // const harga = data?.hargaVoid ? data?.hargaVoid : data?.harga;
                const harga = item?.harga || 0;
                if (item?.tipe) return total + ((Number(harga)) * item?.qty);
                else return total
              }, 0);
              var cafeTotal = transaction?.item.reduce((total, item) => {
                // const harga = data?.hargaVoid ? data?.hargaVoid : data?.harga;
                var totalAddOn = item?.addOns ? item?.addOns?.reduce((total1, item1) => {
                  return total1 + Number(item1.harga);
                }, 0) : 0
                const harga = item?.harga || 0;
                if (item?.addOns !== undefined) return total + ((Number(harga) + Number(totalAddOn)) * item?.qty);
                else return total
              }, 0);
              var discount = transaction?.typeDiscount ? (transaction?.discount / 100) * cafeTotal : cafeTotal - transaction?.discount
              var tax = transaction?.tax * (cafeTotal || 0)
              var grandTotal = (tableTotal + cafeTotal) + tax - discount
              return dailyTotal + grandTotal
            }, 0)
            tmpChart.push(total)
          })
        }

        if (tmpChart.length > 0) {
          setChartData(tmpChart)
        }

        if (tmpData.length > 0) {
          // Hitung total
          const tableTotal = tmpData?.reduce((dailyTotal, cashier) => {
            var total = cashier?.transaction?.reduce((grandTotal, transaction) => {
              var total = transaction?.item.reduce((total, item) => {
                // const harga = data?.hargaVoid ? data?.hargaVoid : data?.harga;
                const harga = item?.harga || 0;
                if (item?.tipe) return total + ((Number(harga)) * item?.qty);
                else return total
              }, 0);
              return grandTotal + (total || 0)
            }, 0)
            return (total || 0) + dailyTotal
          }, 0)

          const cafeTotal = tmpData?.reduce((dailyTotal, cashier) => {
            var total = cashier?.transaction?.reduce((grandTotal, transaction) => {
              var total = transaction?.item.reduce((total, item) => {
                // const harga = data?.hargaVoid ? data?.hargaVoid : data?.harga;
                var totalAddOn = item?.addOns ? item?.addOns?.reduce((total1, item1) => {
                  return total1 + Number(item1.harga);
                }, 0) : 0
                const harga = item?.harga || 0;
                if (item?.addOns !== undefined) return total + ((Number(harga) + Number(totalAddOn)) * item?.qty);
                else return total
              }, 0);
              return grandTotal + (total || 0)
            }, 0)
            return (total || 0) + dailyTotal
          }, 0)

          const discountTotal = tmpData?.reduce((dailyTotal, cashier) => {
            var total = cashier?.transaction?.reduce((grandTotal, transaction) => {
              var cafeTotal = transaction?.item.reduce((total, item) => {
                // const harga = data?.hargaVoid ? data?.hargaVoid : data?.harga;
                var totalAddOn = item?.addOns ? item?.addOns?.reduce((total1, item1) => {
                  return total1 + Number(item1.harga);
                }, 0) : 0
                const harga = item?.harga || 0;
                if (item?.addOns !== undefined) return total + (((Number(harga) + Number(totalAddOn)) * item?.qty) || 0);
                else return total
              }, 0);
              var transactionDiscount = transaction?.typeDiscount ? (transaction?.discount / 100) * cafeTotal : cafeTotal - transaction?.discount
              return grandTotal + transactionDiscount
            }, 0)
            return (total || 0) + dailyTotal
          }, 0)

          const taxTotal = tmpData?.reduce((dailyTotal, cashier) => {
            var total = cashier?.transaction?.reduce((grandTotal, transaction) => {
              var cafeTotal = transaction?.item.reduce((total, item) => {
                // const harga = data?.hargaVoid ? data?.hargaVoid : data?.harga;
                var totalAddOn = item?.addOns ? item?.addOns?.reduce((total1, item1) => {
                  return total1 + Number(item1.harga);
                }, 0) : 0
                const harga = item?.harga || 0;
                if (item?.addOns !== undefined) return total + ((Number(harga) + Number(totalAddOn)) * item?.qty);
                else return total
              }, 0);
              var tax = transaction?.tax * (cafeTotal || 0)
              return grandTotal + tax
            }, 0)
            return (total || 0) + dailyTotal
          }, 0)

          tmpData?.map((cashier) => {
            cashier?.transaction?.map((transaction) => {
              if (transaction?.splitBill === undefined) {
                if (transaction?.paymentMethod === "cash") {
                  var total = transaction?.item.reduce((sum, item) => {
                    // const harga = data?.hargaVoid ? data?.hargaVoid : data?.harga;
                    const harga = item?.harga || 0;
                    return sum + ((Number(harga)) * item?.qty);
                  }, 0);
                  cashTotal += Number(total || 0)
                }
                else if (transaction?.paymentMethod === "qris" || transaction?.paymentMethod === "debit") {
                  var total = transaction?.item.reduce((total, item) => {
                    // const harga = data?.hargaVoid ? data?.hargaVoid : data?.harga;
                    const harga = item?.harga || 0;
                    return total + ((Number(harga)) * item?.qty);
                  }, 0);
                  cashlessTotal += (total || 0)
                }
                else if (transaction?.paymentMethod === "grabfood") {
                  var total = transaction?.item.reduce((total, item) => {
                    // const harga = data?.hargaVoid ? data?.hargaVoid : data?.harga;
                    const harga = item?.harga || 0;
                    return total + ((Number(harga)) * item?.qty);
                  }, 0);
                  grabfoodTotal += (total || 0)
                }
                else if (transaction?.paymentMethod === "gofood") {
                  var total = transaction?.item.reduce((total, item) => {
                    // const harga = data?.hargaVoid ? data?.hargaVoid : data?.harga;
                    const harga = item?.harga || 0;
                    return total + ((Number(harga)) * item?.qty);
                  }, 0);
                  gofoodTotal += (total || 0)
                }
              }
              else {
                // console.log(transaction)
                transaction?.splitBill.map((splitBill) => {
                  if (splitBill?.paymentMethod === "cash") {
                    var total = splitBill?.item.reduce((total, item) => {
                      // const harga = data?.hargaVoid ? data?.hargaVoid : data?.harga;
                      const harga = item?.harga || 0;
                      return total + ((Number(harga)) * item?.qty);
                    }, 0);
                    cashTotal += (total || 0)
                  }
                  else if (splitBill?.paymentMethod === "qris" || splitBill?.paymentMethod === "debit") {
                    var total = splitBill?.item.reduce((total, item) => {
                      // const harga = data?.hargaVoid ? data?.hargaVoid : data?.harga;
                      const harga = item?.harga || 0;
                      return total + ((Number(harga)) * item?.qty);
                    }, 0);
                    cashlessTotal += (total || 0)
                  }
                  else if (splitBill?.paymentMethod === "grabfood") {
                    var total = splitBill?.item.reduce((total, item) => {
                      // const harga = data?.hargaVoid ? data?.hargaVoid : data?.harga;
                      const harga = item?.harga || 0;
                      return total + ((Number(harga)) * item?.qty);
                    }, 0);
                    grabfoodTotal += (total || 0)
                  }
                  else if (splitBill?.paymentMethod === "gofood") {
                    var total = splitBill?.item.reduce((total, item) => {
                      // const harga = data?.hargaVoid ? data?.hargaVoid : data?.harga;
                      const harga = item?.harga || 0;
                      return total + ((Number(harga)) * item?.qty);
                    }, 0);
                    gofoodTotal += (total || 0)
                  }
                });
              }
            })
          })

          const totalCost = (storageLog || []).reduce((total, storage) => {
            if (storage?.beforeStok > storage?.stok) {
              var usedStok = Number(storage.beforeStok) - Number(storage.stok)
              return total + (usedStok * storage?.costPerItem)
            }
            else return total
          }, 0)

          // var tmpPemasukan = tmpCashier?.pemasukan?.reduce((total, data) => { return total + data?.value }, 0)
          cashTotal += tmpPemasukan || 0
          // console.log(totalCost)

          setOtherSales((tableTotal + cafeTotal) || 0);
          setNet(((tableTotal + cafeTotal) + taxTotal - discountTotal) || 0);
          setTable(tableTotal || 0);
          setCafe(cafeTotal || 0)
          setCash(cashTotal || 0)
          setCashless(cashlessTotal || 0)
          setGrabfood(grabfoodTotal || 0)
          setGofood(gofoodTotal || 0)
          // setNetCafe(cafeTotal || 0)
          setDiscount(discountTotal || 0)
          setTax(taxTotal || 0)
          setFilterData(tmpData);
        } else {

          setOtherSales(0);
          setNet(0);
          setTable(0);
          setCafe(0)
          setCash(0)
          setCashless(0)
          setGofood(0)
          setGrabfood(0)
          // setNetCafe(0)
          setDiscount(0)
          setTax(0)
          setFilterData([]);
        }

      }

    } catch (error) {
      console.error('Error fetching filtered data:', error);
    }
  };

  const fetchFilteredProducts = async () => {
    try {
      const response = await api.post('/data', {
        collection: "productReport",
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
      // await fetchMerchData();
      await fetchStorageLog();
      await fetchFilteredData();
      await fetchProductReport();
      await fetchCashiers();
      await calculateIncome();
      setLoadingInit(false);
    };

    if (!loadingInit) {
      loadInitialData();
    }
  }, [loadingInit, refresh]);

  useEffect(() => {
    if (startDate !== undefined && endDate !== undefined) {
      fetchFilteredData();
    }
  }, [activeBtn, cashier, startDate, endDate]);

  useEffect(() => {
    if ((startProductDateBoardGame && endProductDateBoardGame) || (startProductDateCafe && endProductDateCafe)) {
      fetchProductReport();
    }
  }, [startProductDateBoardGame, endProductDateBoardGame, startProductDateCafe, endProductDateCafe]);

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
                    {currentUser?.role === "superadmin" && <CTableHeaderCell style={{ width: "110px" }}>Action</CTableHeaderCell>}
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
                        {currentUser?.role === "superadmin" && <CTableDataCell>
                          <CButton color='danger' className='me-1' onClick={() => hapusPemasukan(idx)}>✗</CButton>
                        </CTableDataCell>}
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
                    {currentUser?.role === "superadmin" && <CTableHeaderCell style={{ width: "110px" }}>Action</CTableHeaderCell>}
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
                        {currentUser?.role === "superadmin" && <CTableDataCell>
                          <CButton color='danger' className='me-1' onClick={() => hapusPengeluaran(idx)}>✗</CButton>
                        </CTableDataCell>}
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
                  Detail Revenue
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
            <MainChart activeBtn={activeBtn} data={chartData} startDate={startDate} endDate={endDate} />
          </CCardBody>
          <CCardFooter>
            <CRow>
              <CCol xs={12} md={6}>
                <CWidgetStatsF
                  className="mb-3"
                  color="success"
                  icon={<CIcon icon={cilChartPie} height={24} />}
                  title="Net Sales"
                  value={`Rp. ${formatNumber(net)}`} />
              </CCol>
              <CCol xs={12} md={6}>
                <CWidgetStatsF
                  className="mb-3"
                  color="success"
                  icon={<CIcon icon={cilCalculator} height={24} />}
                  title="Other Sales"
                  value={`Rp. ${formatNumber(otherSales)}`} />
              </CCol>
              <CCol xs={12} md={6}>
                <CWidgetStatsF
                  className="mb-3"
                  color="info"
                  icon={<CIcon icon={cilCash} height={24} />}
                  title="Cash"
                  value={`Rp. ${formatNumber(cash)}`} />
              </CCol>
              <CCol xs={12} md={6}>
                <CWidgetStatsF
                  className="mb-3"
                  color="primary"
                  icon={<CIcon icon={cilCreditCard} height={24} />}
                  title="QRIS / Debit"
                  value={`Rp. ${formatNumber(cashless)}`} />
              </CCol>
              <CCol xs={12} md={6}>
                <CWidgetStatsF
                  className="mb-3"
                  color="info"
                  icon={<FontAwesomeIcon icon={faMotorcycle} />}
                  title="Gofood"
                  value={`Rp. ${formatNumber(gofood)}`} />
              </CCol>
              <CCol xs={12} md={6}>
                <CWidgetStatsF
                  className="mb-3"
                  color="primary"
                  icon={<FontAwesomeIcon icon={faMotorcycle} />}
                  title="Grabfood"
                  value={`Rp. ${formatNumber(grabfood)}`} />
              </CCol>
              <CCol xs={12} md={6}>
                <CWidgetStatsF
                  className="mb-3"
                  color="info"
                  icon={<FontAwesomeIcon icon={faDice} />}
                  title="Net Board Game Revenue"
                  value={`Rp. ${formatNumber(table)}`} />
              </CCol>
              <CCol xs={12} md={6}>
                <CWidgetStatsF
                  className="mb-3"
                  color="primary"
                  icon={<CIcon icon={cilCoffee} height={24} />}
                  title="Gross Cafe Revenue"
                  value={`Rp. ${formatNumber(cafe)}`} />
              </CCol>
              <CCol xs={12} md={6}>
                <CWidgetStatsF
                  className="mb-3"
                  color="warning"
                  icon={<FontAwesomeIcon icon={faPercent} />}
                  title="Sales Discount"
                  value={`Rp. ${formatNumber(discount)}`} />
              </CCol>
              <CCol xs={12} md={6}>
                <CWidgetStatsF
                  className="mb-3"
                  color="danger"
                  icon={<FontAwesomeIcon icon={faAnchor} />}
                  title="Sales PB1"
                  value={`Rp. ${formatNumber(tax)}`} />
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
          exportExcel={true}
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

        <CRow className='mb-3'>
          <CCol xs="12" md="12">
            <CCard>
              <CCardHeader>
                <b>Laporan Produk Board Game</b>
              </CCardHeader>
              <CCardBody>
                <CRow className='justify-content-end'>
                  <CButton style={{ width: "100px" }} color="primary" className='mb-3' onClick={handleExport}><CIcon icon={cilShare} /> Export</CButton>

                  <CCol xs={9} md={7} lg={6} xl={5}>
                    <CInputGroup style={{ width: "100%" }}>
                      <CFormInput
                        type="date"
                        className='mb-3'
                        value={startProductDateBoardGame}
                        onChange={(e) => {
                          setStartProductDateBoardGame(e.target.value)
                        }}
                        placeholder="Start Date"
                        aria-label="Start Date"
                      />
                      <CInputGroupText className='mb-3'
                      >~</CInputGroupText>
                      <CFormInput
                        type="date"
                        className='mb-3'
                        value={endProductDateBoardGame}
                        onChange={(e) => {
                          setEndProductDateBoardGame(e.target.value)
                        }}
                        placeholder="End Date"
                        aria-label="End Date"
                      />
                      <CInputGroupText className="mb-3 close-btn" style={{ backgroundColor: "#e74c3c", color: "white", border: "none", cursor: "pointer" }} onClick={() => { setStartProductDateBoardGame(""); setEndProductDateBoardGame(""); setFilterProductBoardGame([]) }}><b>x</b></CInputGroupText>
                    </CInputGroup>
                  </CCol>
                </CRow>
                {((startProductDateBoardGame !== "" && endProductDateBoardGame !== "") ? filterProductBoardGame.length > 0 : productBoardGame.length > 0) && <CRow>
                  <CCol>
                    <div style={{ width: '400px', height: '400px' }}>
                      <DoughnutChartQty data={(startProductDateBoardGame !== "" && endProductDateBoardGame !== "") ? filterProductBoardGame : productBoardGame} />
                    </div>
                  </CCol>
                  <CCol>
                    <div style={{ maxHeight: "500px", overflowY: "auto" }} >
                      <CTable border={1} hover responsive striped bordered>
                        <CTableHead>
                          <CTableRow>
                            <CTableHeaderCell>Nama Item</CTableHeaderCell>
                            <CTableHeaderCell>Qty</CTableHeaderCell>
                          </CTableRow>
                        </CTableHead>
                        <CTableBody>
                          {(startProductDateBoardGame !== "" && endProductDateBoardGame !== "") ? filterProductBoardGame.map((product, index) => (
                            <CTableRow key={index}>
                              <CTableDataCell>{product.name}</CTableDataCell>
                              <CTableDataCell>{product.qty}</CTableDataCell>
                              {/* <CTableDataCell>{formatNumber(product.harga)}</CTableDataCell>
                          <CTableDataCell>{formatNumber(product.harga * product.qty)}</CTableDataCell> */}
                            </CTableRow>
                          )) :
                            productBoardGame.map((product, index) => (
                              <CTableRow key={index}>
                                <CTableDataCell>{product.name}</CTableDataCell>
                                <CTableDataCell>{product.qty}</CTableDataCell>
                                {/* <CTableDataCell>{formatNumber(product.harga)}</CTableDataCell>
                            <CTableDataCell>{formatNumber(product.harga * product.qty)}</CTableDataCell> */}
                              </CTableRow>
                            ))
                          }
                          {/* <CTableRow>
                        <CTableDataCell colSpan={3}><b>Total</b></CTableDataCell>
                        <CTableDataCell><b>{formatNumber(productData.reduce((total, data) => { return total + (data?.harga * data?.qty) }, 0))}</b></CTableDataCell>
                      </CTableRow> */}
                          <CTableRow>
                            <CTableHeaderCell>Total Qty</CTableHeaderCell>
                            <CTableHeaderCell>{totalProductBG}</CTableHeaderCell>
                          </CTableRow>
                          <CTableRow>
                            <CTableHeaderCell>Min. Duration</CTableHeaderCell>
                            <CTableHeaderCell>{`${minimum?.jam} JAM ${minimum?.menit} MENIT`}</CTableHeaderCell>
                          </CTableRow>
                          <CTableRow>
                            <CTableHeaderCell>Max. Duration</CTableHeaderCell>
                            <CTableHeaderCell>{`${maximum?.jam} JAM ${maximum?.menit} MENIT`}</CTableHeaderCell>
                          </CTableRow>
                          <CTableRow>
                            <CTableHeaderCell>Average Duration</CTableHeaderCell>
                            <CTableHeaderCell>{`${average?.jam} JAM ${average?.menit} MENIT`}</CTableHeaderCell>
                          </CTableRow>
                          <CTableRow>
                            <CTableHeaderCell>Total Duration</CTableHeaderCell>
                            <CTableHeaderCell>{`${totalMinutes?.jam} JAM ${totalMinutes?.menit} MENIT`}</CTableHeaderCell>
                          </CTableRow>

                        </CTableBody>
                      </CTable>
                    </div>
                  </CCol>
                </CRow>}

              </CCardBody>
            </CCard>
          </CCol>
        </CRow>

        <CRow>
          <CCol xs="12" md="12">
            <CCard>
              <CCardHeader>
                <b>Laporan Produk Cafe</b>
              </CCardHeader>
              <CCardBody>
                <CRow className='justify-content-end'>
                  <CCol xs={9} md={7} lg={6} xl={5}>
                    <CInputGroup style={{ width: "100%" }}>
                      <CFormInput
                        type="date"
                        className='mb-3'
                        value={startProductDateCafe}
                        onChange={(e) => {
                          setStartProductDateCafe(e.target.value)
                        }}
                        placeholder="Start Date"
                        aria-label="Start Date"
                      />
                      <CInputGroupText className='mb-3'
                      >~</CInputGroupText>
                      <CFormInput
                        type="date"
                        className='mb-3'
                        value={endProductDateCafe}
                        onChange={(e) => {
                          setEndProductDate(e.target.value)
                        }}
                        placeholder="End Date"
                        aria-label="End Date"
                      />
                      <CInputGroupText className="mb-3 close-btn" style={{ backgroundColor: "#e74c3c", color: "white", border: "none", cursor: "pointer" }} onClick={() => { setStartProductDateCafe(""); setEndProductDateCafe(""); setFilterProductCafe([]) }}><b>x</b></CInputGroupText>
                    </CInputGroup>
                  </CCol>
                </CRow>
                {((startProductDateCafe !== "" && endProductDateCafe !== "") ? filterProductCafe.length > 0 : productCafe.length > 0) && <CRow>
                  <CCol>
                    <div style={{ width: '400px', height: '400px' }}>
                      <DoughnutChartQty data={(startProductDateCafe !== "" && endProductDateCafe !== "") ? filterProductCafe : productCafe} />
                    </div>
                  </CCol>
                  <CCol>
                    <div style={{ maxHeight: "500px", overflowY: "auto" }} >
                      <CTable border={1} hover responsive striped bordered>
                        <CTableHead>
                          <CTableRow>
                            <CTableHeaderCell>Nama Item</CTableHeaderCell>
                            <CTableHeaderCell>Qty</CTableHeaderCell>
                          </CTableRow>
                        </CTableHead>
                        <CTableBody>
                          {(startProductDateCafe !== "" && endProductDateCafe !== "") ? filterProductCafe.map((product, index) => (
                            <CTableRow key={index}>
                              <CTableDataCell>{product.name}</CTableDataCell>
                              <CTableDataCell>{product.qty}</CTableDataCell>
                              {/* <CTableDataCell>{formatNumber(product.harga)}</CTableDataCell>
                          <CTableDataCell>{formatNumber(product.harga * product.qty)}</CTableDataCell> */}
                            </CTableRow>
                          )) :
                            productCafe.map((product, index) => (
                              <CTableRow key={index}>
                                <CTableDataCell>{product.name}</CTableDataCell>
                                <CTableDataCell>{product.qty}</CTableDataCell>
                                {/* <CTableDataCell>{formatNumber(product.harga)}</CTableDataCell>
                            <CTableDataCell>{formatNumber(product.harga * product.qty)}</CTableDataCell> */}
                              </CTableRow>
                            ))
                          }
                          <CTableRow>
                            <CTableHeaderCell>Total</CTableHeaderCell>
                            <CTableHeaderCell>{totalProductCafe}</CTableHeaderCell>
                          </CTableRow>
                        </CTableBody>
                      </CTable>
                    </div>
                  </CCol>
                </CRow>}

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
