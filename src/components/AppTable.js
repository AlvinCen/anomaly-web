import React, { useState, useEffect, Suspense } from 'react';
import { CButton, CCard, CCardHeader, CCardBody, CRow, CCol, CInputGroup, CFormLabel, CFormInput, CInputGroupText, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CBadge, CPagination, CPaginationItem, CImage, CSpinner } from '@coreui/react';
import moment from 'moment-timezone';
import Swal from 'sweetalert2';
import { collection, doc, getDocs, onSnapshot, writeBatch } from 'firebase/firestore';
import { formatNumber } from 'chart.js/helpers';
import { cilPencil, cilShare, cilTrash } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import Loading from './Loading';
import axios from 'axios';
import api from '../axiosInstance';
import exportToExcel from './ExportExcel';
// import { firestore } from '../Firebase.tmp';

const sortByExpiredDate = (items, ascending = true) => {
  return [...items].sort((a, b) => {
    const dateA = a.stok.length > 0 ? new Date(a.stok[0].expired) : new Date("9999-12-31");
    const dateB = b.stok.length > 0 ? new Date(b.stok[0].expired) : new Date("9999-12-31");
    return ascending ? dateA - dateB : dateB - dateA;
  });
};

const getNearestExpired = (items) => {
  const today = new Date();
  return items
    .filter(s => new Date(s.expired) >= today)
    .sort((a, b) => new Date(a.expired) - new Date(b.expired))[0] || null;
};

const AppTable = (
  { title,
    column,
    // query,
    collectionRef,
    refData = [],
    collection,
    filter,
    sort,
    createdAt,
    crudAction = [],
    filterDate,
    defaultDate,
    refresh,
    listStatus,
    cashierData = [],
    isSort = false,
    setVisible,
    setTitle,
    setModal,
    setAction,
    setTable,
    setDetail,
    setMeja,
    setParentData = () => {
      return
    },
    setEdit,
    setHapus,
    setCancel,
    stopTable,
    func,
    func1,
    cancelBooking,
    isManage,
  }
) => {
  const token = localStorage.getItem("token");

  const [data, setData] = useState([]);
  const [tmpData, setTmpData] = useState([]);
  const [loading, setLoading] = useState(true)
  // const [currentData, setCurrentData] = ([]);
  const { currentUser } = useAuth();
  const [filterData, setFilterData] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [init, setInit] = useState(false);
  const [startDate, setStartDate] = useState(defaultDate ? defaultDate : '');
  const [endDate, setEndDate] = useState(defaultDate ? defaultDate : '');

  const [sortedData, setSortedData] = useState(isSort ? sortByExpiredDate(data) : null);
  const [isAscending, setIsAscending] = useState(true);
  const [nearestExpired, setNearestExpired] = useState(null);


  const handleFilter = (startDate, endDate) => {
    const filtered = data.filter((item) => {
      var date = typeof item?.createdAt === "object" ? item?.createdAt?.toDate() : item?.createdAt
      const isInRange = moment(date).isBetween(moment(startDate), moment(endDate), 'day', '[]');
      return isInRange
    });
    setFilterData(filtered);
  };

  const handleSort = () => {
    setIsAscending(!isAscending);
    setData(sortByExpiredDate(data, !isAscending));
  };

  const location = useLocation();
  const navigate = useNavigate();

  const filteredData = startDate && endDate ?
    filterData.filter(item =>
      Object.values(item).some(val =>
        String(val).toLowerCase().includes(search?.toLowerCase())
      )) :
    data.filter(item =>
      Object.values(item).some(val =>
        String(val).toLowerCase().includes(search?.toLowerCase())
      ));

  // Pagination Logic
  const itemsPerPage = 10;
  function hitungDurasi(waktuAwal, waktuAkhir = moment().format()) {
    const durasi = moment.duration(moment(waktuAkhir).diff(moment(waktuAwal)));
    const durasiFormatted = `${durasi.hours()}:${durasi.minutes() < 10 ? '0' : ''}${durasi.minutes()}:${durasi.seconds() < 10 ? '0' : ''}${durasi.seconds()}`;
    return durasiFormatted;
  }

  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const currentData = filteredData.slice(firstIndex, lastIndex);

  useEffect(() => {
    if (startDate && endDate && data) {
      handleFilter(startDate, endDate)
    }
  }, [data, startDate, endDate])

  useEffect(() => {
    const totalPages = Math.ceil(data.length / itemsPerPage);
    setTotalPages(totalPages)
  }, [data])

  // useEffect(() => {
  //   const unsubscribeInit = onSnapshot(query, { includeMetadataChanges: true, source: 'cache' }, async (snapshot) => {
  //     // var tmpData = [...data];
  //     var tmpData = []
  //     const source = snapshot.metadata.fromCache ? "local cache" : "server";
  //     if (!init) {
  //       snapshot.forEach((tmpDocs) => {
  //         // console.log(tmpDocs.id)
  //         const docData = { ...tmpDocs.data(), id: tmpDocs.id };
  //         tmpData.push(docData);
  //       });
  //       setParentData(tmpData)
  //       setData(tmpData);
  //       setInit(true);
  //     }
  //   });

  //   const unsubscribe = onSnapshot(query, async (snapshot) => {
  //     // var tmpData = [...data];
  //     const q = collectionRef
  //     const refData = []
  //     if (collectionRef) {
  //       // Mendapatkan snapshot dari cache (jika tersedia)
  //       const snapshotRef = await getDocs(q);

  //       // Mengupdate dokumen yang relevan
  //       snapshotRef.forEach((res) => {
  //         refData.push({ ...res.data(), id: res?.id })
  //       });
  //     }

  //     var tmpData = []
  //     const source = snapshot.metadata.fromCache ? "local cache" : "server";
  //     // console.log(snapshot.metadata.hasPendingWrites)
  //     // console.log(source)
  //     if (init) {
  //       {
  //         snapshot.forEach((tmpDocs) => {
  //           // console.log(tmpDocs.id)
  //           if (collectionRef) var refUser = refData?.find((user) => user?.id === tmpDocs.data()?.userId)

  //           const docData = collectionRef ?
  //             {
  //               ...tmpDocs.data(),
  //               id: tmpDocs.id,
  //               username: refUser?.username ? refUser?.username : "ERROR",
  //               name: refUser?.name ? refUser?.name : "ERROR"
  //             } :
  //             {
  //               ...tmpDocs.data(),
  //               id: tmpDocs.id,
  //             }
  //             ;
  //           tmpData.push(docData);
  //         });
  //         // console.log(tmpData)
  //         // if (title === "History") {
  //         //   console.log(tmpData)
  //         //   const batch = writeBatch(firestore);
  //         //   tmpData.forEach((data) => {
  //         //     if (data?.status === "PAYMENT") {
  //         //       const docRef = doc(firestore, "booking", data?.id);
  //         //       batch.update(docRef, { status: "CLOSE" });
  //         //     }
  //         //     // var tmpMenu = data.find((menu) => menu?.id === data?.id)
  //         //     // const docRef = doc(firestore, "menu", data?.id);
  //         //     // batch.update(docRef, { stok: tmpMenu?.stok });
  //         //   });

  //         //   // Melakukan commit pada batch
  //         //   await batch.commit();
  //         // }
  //         const sortedData = prioritySort(tmpData)
  //         // console.log(sortedData)
  //         setParentData(tmpData)
  //         setData(tmpData);
  //       }
  //     }
  //   });

  //   return () => {
  //     unsubscribe();
  //     unsubscribeInit();
  //     setLoading(false)
  //   };
  // }, [init]);

  const fetchData = async () => {
    console.time("Fetch Data"); // Mulai timer

    try {
      setLoading(true);
      const response = await api.post("/data", {
        collection, // Nama koleksi yang diminta
        filter, // Filter yang diberikan dari prop
        sort, // Urutan data
      });
      var sortedData = isSort ? sortByExpiredDate(response.data) : response.data
      console.log(sortedData)
      setParentData(sortedData)
      setData(sortedData);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [collection, refresh]); // Query berubah -> data di-fetch ulang

  const getBadge = (status) => {
    var data = listStatus.find((list) => {
      return status === list?.name
    })
    return data?.color
  }

  const changePage = (page) => {
    if (page < 1) {
      setCurrentPage(1);
    } else if (page > totalPages) {
      setCurrentPage(totalPages);
    } else {
      setCurrentPage(page);
    }
  };
  const prioritySort = (data) => {
    const priorityCompare = (a, b) => {
      // Prioritas status
      const priority = {
        AKTIF: 1,
        "ON PROCESS": 2,
        PAYMENT: 3
      };

      const priorityA = priority[a.status] || Infinity;
      const priorityB = priority[b.status] || Infinity;

      // Bandingkan status berdasarkan prioritas
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      } else {
        // Jika prioritas sama, urutkan berdasarkan tanggal dan waktu terbaru
        if (a?.start && b?.start) {
          return moment(b.start).diff(moment(a.start));
        }
        else {
          return moment(b?.createdAt).diff(moment(a?.createdAt));
        }
      }
    }
    data.sort(priorityCompare);

    return data;
  }

  const renderPaginationItems = () => {
    const items = [];

    // Show the first page
    items.push(
      <CPaginationItem key={1} active={currentPage === 1} onClick={() => changePage(1)}>
        1
      </CPaginationItem>
    );

    // Show ellipsis if needed
    if (currentPage > 4) {
      items.push(<CPaginationItem key="start-ellipsis" disabled>...</CPaginationItem>);
    }

    // Show pages around the current page
    for (let i = Math.max(2, currentPage - 2); i <= Math.min(totalPages - 1, currentPage + 2); i++) {
      items.push(
        <CPaginationItem key={i} active={currentPage === i} onClick={() => changePage(i)}>
          {i}
        </CPaginationItem>
      );
    }

    // Show ellipsis if needed
    if (currentPage < totalPages - 3) {
      items.push(<CPaginationItem key="end-ellipsis" disabled>...</CPaginationItem>);
    }

    // Show the last page
    if (totalPages > 1) {
      items.push(
        <CPaginationItem key={totalPages} active={currentPage === totalPages} onClick={() => changePage(totalPages)}>
          {totalPages}
        </CPaginationItem>
      );
    }

    return items;
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

  const handlePrintClick = async (data, action, paymentMethod, bayar, kembali) => {
    console.log(data)
    if (window?.electron) {
      const collection = "tableHistory";
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
    setVisible(false);
    setModal(false);
  };

  function hitungHarga(table, waktuAwal, waktuAkhir = moment().format(), harga = 0, calculateDuration = false) {
    let isHourPromo = false;
    const tableGame = table?.item?.find((data) => data?.tipe === "durasi" && data?.duration === "00:00")
    const rate = tableGame?.harga
    const qty = tableGame?.qty

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

    if (calculateDuration) {
      // var tmpDurasi = moment.duration(moment().diff(moment(waktuAwal)))
      const tmpDurasi = moment.duration(effectiveDuration, "minutes");
      setDurasi(tmpDurasi)
      return
    }
    else return harga

    // return Math.ceil(harga / 1000) * 1000;
  }

  return (
    <Suspense
      fallback={
        <div className="pt-3 text-center">
          <CSpinner color="primary" variant="grow" />
        </div>
      }
    >
      {!loading ? <CCard className='mb-3' >
        <CCardHeader><b>{title}</b></CCardHeader>
        <CCardBody>
          <CRow className="justify-content-between">
            {crudAction.map((data, index) => {
              return <CCol xs="auto" className='mb-3' key={index}><CButton color="success"
                onClick={() => {
                  if (data?.href) {
                    navigate(location.pathname + data?.href)
                  } else {
                    setAction("add");
                    setVisible(true)
                  }
                }}>+ {data.name}</CButton></CCol>
            })}

            <CCol xs={8} md={6} lg={5} xl={4}>
              <CInputGroup style={{ width: "100%" }}>
                <CFormLabel style={{ padding: "5px" }}><b>Filter : </b></CFormLabel>
                <CFormInput
                  type="text"
                  placeholder="Search..."
                  className='mb-3'
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <CInputGroupText className="mb-3 close-btn" style={{ backgroundColor: "#e74c3c", color: "white", border: "none", cursor: "pointer" }} onClick={() => setSearch("")}><b>x</b></CInputGroupText>
              </CInputGroup>
            </CCol>

            {filterDate && <CCol xs={9} md={7} lg={6} xl={5}>
              <CInputGroup style={{ width: "100%" }}>
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
              </CInputGroup>
            </CCol>}
          </CRow>

          <CTable align="middle" className="mb-3 border" hover responsive striped>
            <CTableHead className="text-nowrap">
              <CTableRow>
                {column.map((column, index) => {
                  if (column.key === "expiredStok") {
                    return <CTableHeaderCell key={index} onClick={handleSort} className="bg-body">{column.name} {isAscending ? "↑" : "↓"}</CTableHeaderCell>
                  } else
                    return <CTableHeaderCell key={index} className="bg-body">{column.name}</CTableHeaderCell>
                })}
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {currentData.map((data, index1) => {
                var totalStok = title === "Management Storage" && data?.stok?.reduce((sum, s) => sum + s.qty ? s.qty : s.berat, 0);
                if(data?.tipe ==="berat"){
                  totalStok = totalStok >= 1000? totalStok/1000 + " kg" : totalStok + " gram"
                }

                return <CTableRow key={index1}>
                  <CTableHeaderCell scope="row" key={index1}>{firstIndex + index1 + 1}</CTableHeaderCell>
                  {column.map((column, index) => {
                    var render = []
                    // console.log(fires)
                    var color = currentUser?.role === "superadmin" ? "primary" : "warning"
                    if (currentUser?.role === "superadmin" ||
                      currentUser?.hasAccessPos?.find((access) => access.name === location.pathname && access.view) ||
                      currentUser?.hasAccessManage?.find((access) => access.name === location.pathname && access.view)
                    ) {
                      if (currentUser?.role === "superadmin" || currentUser?.hasAccessPos?.find((access) => access.name === location.pathname && access.update) || currentUser?.hasAccessManage?.find((access) => access.name === location.pathname && access.update)
                      ) {
                        color = "primary"
                        if (title === "Laporan Kasir") {
                          render.push(
                            <CButton className='me-2' size="sm" color="warning" onClick={() => { setDetail(data); setAction("edit"); setVisible(true) }}><CIcon icon={cilPencil} /> Edit</CButton>)
                          render.push(
                            <CButton className='me-2' size="sm" color="primary" onClick={() => exportToExcel(data, `Laporan-Anomaly-${moment(data?.createdAt).format("DD-MM-YYYY")}.xlsx`)}><CIcon icon={cilShare} /> Export</CButton>)
                          render.push(
                            <CButton className='me-2' size="sm" color="info" onClick={() => { setDetail(data); setTitle("pool"); setAction("detail"); setVisible(true) }}>Detail</CButton>)
                        } else {
                          if (title === "Management Storage") {
                            render.push(
                              <CButton className='me-2' size="sm" color="warning" onClick={() => { setDetail(data); setAction("detail"); setVisible(true) }}><CIcon icon={cilPencil} /> Edit</CButton>)
                          } else if (data?.order !== "close" && data?.status !== "CLOSE" && title !== "Management Subscription") {
                            render.push(
                              <CButton className='me-2' size="sm" color="warning" onClick={() => { setEdit(data); setAction("edit"); setVisible(true) }}><CIcon icon={cilPencil} /> Edit</CButton>)
                          }
                        }
                      }
                      if (currentUser?.role === "superadmin" || currentUser?.hasAccessPos?.find((access) => access.name === location.pathname && access.delete) || currentUser?.hasAccessManage?.find((access) => access.name === location.pathname && access.delete)
                      ) {
                        color = "primary"
                        render.push(
                          <CButton color="danger" className='me-2' size="sm" onClick={() => { setHapus(data); }}><CIcon icon={cilTrash} /> Delete</CButton>
                        )
                      }
                    }
                    switch (column.key) {
                      case "tableName": return <CTableDataCell key={column.key + index}>{data?.tableName ? data?.tableName : data?.table}</CTableDataCell>
                      case "photoURL": return <CTableDataCell key={column.key + index}><CImage src={data?.[column.key]} width={100} height={100}></CImage></CTableDataCell>
                      case "category": return <CTableDataCell key={column.key + index}>{data?.[column.key]?.label}</CTableDataCell>
                      case "client": return <CTableDataCell key={column.key + index}>{data?.client?.name}</CTableDataCell>
                      case "order": return <CTableDataCell key={column.key + index}>{titleCase(data?.[column.key])} Bill</CTableDataCell>
                      case "status": return <CTableDataCell key={column.key + index}><CBadge color={getBadge(data?.status)}>{data.status}</CBadge></CTableDataCell>
                      case "event": return <CTableDataCell key={column.key + index}><CBadge color={getBadge(data?.event)}>{data.event}</CBadge></CTableDataCell>
                      case "bookingDate": return <CTableDataCell key={column.key + index}>{moment(data?.bookingDate).format("HH:mm:ss")}</CTableDataCell>
                      case "durasi": return <CTableDataCell key={column.key + index}>{data?.start && data?.end ? hitungDurasi(data.start, data.end) : "-"}</CTableDataCell>
                      case "createdAt": return <CTableDataCell key={column.key + index}>{typeof data?.createdAt === "object" ? moment(data?.createdAt?.toDate()).tz("Asia/Jakarta").format("DD MMMM YYYY HH:mm:ss") : moment(data?.createdAt).tz("Asia/Jakarta").format("DD MMMM YYYY HH:mm:ss")}</CTableDataCell>
                      case "orderAt": return <CTableDataCell key={column.key + index}>{typeof data?.orderAt === "object" ? moment(data?.orderAt?.toDate()).tz("Asia/Jakarta").format("DD MMMM YYYY HH:mm:ss") : moment(data?.orderAt).tz("Asia/Jakarta").format("DD MMMM YYYY HH:mm:ss")}</CTableDataCell>
                      case "tanggal": return <CTableDataCell key={column.key + index}>{moment(data?.createdAt).format("DD/MM/YYYY")}</CTableDataCell>
                      case "time_in": return <CTableDataCell key={column.key + index}>{typeof data?.createdAt === "object" ? moment(data?.createdAt?.toDate()).tz("Asia/Jakarta").format("HH:mm:ss") : moment(data?.createdAt).tz("Asia/Jakarta").format("HH:mm:ss")}</CTableDataCell>
                      case "time_out": return <CTableDataCell key={column.key + index}>{data?.time_out ? moment(data?.time_out).format("HH:mm:ss") : "-"}</CTableDataCell>
                      case "closeAt": return <CTableDataCell key={column.key + index}>{data?.closeAt ? moment(data?.closeAt).format("HH:mm:ss") : "-"}</CTableDataCell>
                      case "pemasukan": return <CTableDataCell key={column.key + index}>{(() => {
                        var pemasukan = (data?.transaction || []).reduce((total, table) => {
                          // console.log(table?.paymentMethod)
                          if (table?.paymentMethod === "cash") {
                            var orderTotal = (table?.item ? table?.item?.reduce((total1, item1) => {
                              const totalAddOn = item1?.addOns
                                ? item1.addOns.reduce((total1, item1) => total1 + Number(item1.harga), 0)
                                : 0;

                              if (!item1?.tipe && item1?.addOns) {
                                const itemTotal = (Number(item1.harga) + totalAddOn) * item1.qty;
                                return total1 + itemTotal;
                              } else return total1
                            }, 0) : 0) || 0
                            var boardGame = (table?.item ? table?.item?.reduce((total1, item1) => {
                              if (!item1?.addOns) {
                                if (item1?.tipe === "durasi" && item1?.duration === "00:00") return total1 + hitungHarga(table, table?.start, table?.end)
                                else return total1 + (Number(item1.harga) * Number(item1.qty));
                              } else return total1
                            }, 0) : 0) || 0

                            var subTotal = (table?.discount && table?.discount !== 0 ? (table?.typeDiscount ? Number(orderTotal) * (1 - (table?.discount / 100)) : (Number(orderTotal) - table?.discount)) : 0)
                            const tax = Number(table?.tax && table?.tax !== 0 ? Number(orderTotal) * (((table?.tax < 1 && table?.tax > 0) ? table?.tax : table?.tax / 100)) : 0);
                            subTotal += tax
                            return total + subTotal + boardGame
                          } else return total
                        }, 0)
                        return formatNumber(pemasukan)
                      })()}</CTableDataCell>
                      case "pengeluaran": return <CTableDataCell key={column.key + index}>{Array.isArray(data?.pengeluaran) ? formatNumber(data?.pengeluaran?.reduce((total, data) => { return total + data?.value }, 0)) : 0}</CTableDataCell>
                      case "start":
                        if (column.name === "Date") return <CTableDataCell key={column.key + index}>{data?.start ? moment(data?.[column.key]).format("DD/MM/YYYY") :
                          moment(data?.createdAt).format("DD/MM/YYYY")}</CTableDataCell>
                        else return <CTableDataCell key={column.key + index}>{data?.start ? moment(data?.[column.key]).format("HH:mm:ss") : "-"}</CTableDataCell>
                      case "end": return <CTableDataCell key={column.key + index}>{data?.end ? moment(data?.[column.key]).format("HH:mm:ss") : "-"}</CTableDataCell>
                      case "action":
                        if (!isManage) {
                          switch (data?.status) {
                            case "AKTIF": {
                              render = []
                              if (currentUser?.role === "superadmin") { render.push(<CButton color="success" className="me-2" size="sm" onClick={() => { setDetail(data); setAction("resume"); setVisible(true) }}>Resume</CButton>) }
                              if (title === "Management Member") {
                                render.push(
                                  <CButton className='me-2' size="sm" color="warning" onClick={() => { setEdit(data); setAction("edit"); setVisible(true) }}><CIcon icon={cilPencil} /> Edit</CButton>)
                                render.push(<CButton color="danger" className='me-2' size="sm" onClick={() => { setHapus(data); }}><CIcon icon={cilTrash} /> Delete</CButton>)
                                if (!data?.subscription || data?.status === "EXPIRED")
                                  render.push(<CButton className='me-2' color={color} size="sm" onClick={() => { setDetail(data); setAction("subscription"); setVisible(true) }}>Subscription</CButton>)
                              } else if (title === "History Order") {
                                var isPromo = data?.item?.some((data) => data?.group !== undefined)
                                var tmpData = isPromo ? data?.item[0] : data
                                if (tmpData?.item?.some((data) => data?.addOns !== undefined) || isPromo) {
                                  render.push(<CButton color="warning" className="me-2" size="sm" onClick={() => {
                                    handlePrintClick(data, "printOrder")
                                  }}>Print Order</CButton>)
                                }
                              }
                              return <CTableDataCell key={column.key + index}>
                                {render}
                              </CTableDataCell>
                            }
                            case "PAYMENT": {
                              if (title === "History Table") {
                                var tmpData = window.btoa(JSON.stringify({ id: data?.id, collection: 'tableHistory' }))
                                // console.log(window.atob(tmpData))
                                // var open = () => window.open(`https://breakpointciledug.page.link/?link=https://breakpoint-ciledug.web.app/welcome?data=${tmpData}&apn=com.breakpoint&afl=https://breakpoint-ciledug.web.app/`)
                                render.push(<CButton className='me-2' color={color} size="sm" onClick={() => { }}>Pay</CButton>)
                              } else if (title === "Management Member") {
                                render.push(<CButton className='me-2' color={color} size="sm" onClick={() => { setDetail(data); setAction("pay"); setModal(true) }}>Pay</CButton>)
                              } else if (title === "Management Subscription") {
                                render.push(<CButton color="primary" className='me-2' size="sm" onClick={() => { setCancel(data) }}>Cancel</CButton>)
                              } else {
                                render.push(<CButton className='me-2' color={color} size="sm" onClick={() => { setDetail(data); setAction("pay"); setModal(true) }}>Pay</CButton>)
                                if (title === "History Order") render.push(<CButton color="success" size="sm" onClick={() => { setDetail(data); setMeja("table-1"); setAction("resume"); setVisible(true) }}>Resume</CButton>)
                              }
                              return <CTableDataCell key={column.key + index}>
                                {/* <CButton className='me-2' size="sm" color="info" onClick={() => { setDetail(data); setAction("detail"); setModal(true) }}>Detail</CButton> */}
                                {render}
                              </CTableDataCell>
                            }
                            case "ON PROCESS": {
                              render.push(<CButton className='me-2' size="sm" color="info" onClick={() => { setDetail(data); setAction("detail"); setModal(true) }}>Detail</CButton>)
                              if (title === "History Table") render.push(<CButton className='me-2' size="sm" color="success" onClick={() => { func(data?.id) }}>Serve</CButton>)
                              return <CTableDataCell key={column.key + index}>
                                {render}
                              </CTableDataCell>
                            }
                            case "READY": {
                              render.push(<CButton className='me-2' size="sm" color="success" onClick={() => { func1(data?.id, data?.order) }}>Finish</CButton>)
                              return <CTableDataCell key={column.key + index}>
                                {render}
                              </CTableDataCell>
                            }
                            case "CLOSE": {
                              if (title !== "Laporan Kasir") {
                                render.push(<>
                                  <CButton className='me-2' size="sm" color="info" onClick={() => { setDetail(data); setAction("detail"); setModal(true) }}>Detail</CButton>
                                  <CButton color="warning" size="sm" onClick={() => {
                                    handlePrintClick(data, "", data?.paymentMethod, data?.pay, data?.changes)
                                    // console.log(tmpData)
                                    // window.open(`https://breakpointciledug.page.link/?link=https://breakpoint-ciledug.web.app/welcome?data=${tmpData}&apn=com.breakpoint&afl=https://breakpoint-ciledug.web.app/`)
                                  }}>Print</CButton>
                                </>)
                              }
                              return <CTableDataCell key={column.key + index}>
                                {render}
                              </CTableDataCell>
                            }
                            case "WAITING": {
                              render.push(<>
                                <CButton className='me-2' size="sm" color="success" onClick={() => { setTable(data) }}>Start</CButton>
                                <CButton color="danger" size="sm" onClick={() => { cancelBooking(data) }}>Cancel</CButton>
                              </>)
                              return <CTableDataCell key={column.key + index}>
                                {render}
                              </CTableDataCell>
                            }
                            case "EXPIRED": {
                              render.push(<CButton className='me-2' color="info" size="sm" onClick={() => { setCancel(data) }}>Cancel</CButton>)
                              render.push(<CButton className='me-2' color={color} size="sm" onClick={() => { setDetail(data); setAction("subscription"); setVisible(true) }}>Subscription</CButton>)
                              return <CTableDataCell key={column.key + index}>
                                {/* <CButton className='me-2' size="sm" color="info" onClick={() => { setDetail(data); setAction("detail"); setModal(true) }}>Detail</CButton> */}
                                {render}
                              </CTableDataCell>
                            }
                            case "CANCEL": return <CTableDataCell key={column.key + index} >
                              {render}
                            </CTableDataCell>
                            default: return <CTableDataCell key={column.key + index}>
                              {render}
                              {/* <CButton className='me-2' size="sm" color="warning" onClick={() => { setEdit(data); setAction("edit"); setVisible(true) }}><CIcon icon={cilPencil} /> Edit</CButton>
                            <CButton color="danger" size="sm" onClick={() => { setHapus(data); }}><CIcon icon={cilTrash} /> Delete</CButton> */}
                            </CTableDataCell>
                          }
                        } else {
                          return <CTableDataCell key={column.key + index}>
                            {render}
                            {/* <CButton className='me-2' size="sm" color="warning" onClick={() => { setEdit(data); setAction("edit"); setVisible(true) }}><CIcon icon={cilPencil} /> Edit</CButton>
                          <CButton color="danger" size="sm" onClick={() => { setHapus(data); }}><CIcon icon={cilTrash} /> Delete</CButton> */}
                          </CTableDataCell>
                        }
                      case "total": return <CTableDataCell key={column.key + index}>{data?.[column.key] ? formatNumber(data?.[column.key]) : "-"}</CTableDataCell>
                      case "harga": return <CTableDataCell key={column.key + index}>{data?.[column.key] ? formatNumber(data?.[column.key]) : "-"}</CTableDataCell>
                      case "late": return <CTableDataCell key={column.key + index}>{data?.[column.key] ? "Ya" : "Tidak"}</CTableDataCell>
                      case "totalStok": return <CTableDataCell key={column.key + index}>{totalStok}</CTableDataCell>
                      case "expiredStok": return <CTableDataCell key={column.key + index}>{getNearestExpired(data?.stok)?.expired}</CTableDataCell>
                      case "subscription": return <CTableDataCell key={column.key + index}>{data?.subscription?.expired ? data?.subscription?.expired : "-"}</CTableDataCell>
                      case "priceList": return <CTableDataCell key={column.key + index}>
                        <ul className="mb-0">
                          {
                            data?.priceList.map((data, index) => {
                              return <li key={index} className="small">  {data.name} </li>
                            })
                          }  </ul>
                      </CTableDataCell>
                      case "index": return
                      default:
                        if (Array.isArray(data?.[column.key])) {
                          const mergedLabels = data?.[column.key].reduce((acc, table) => {
                            return acc ? `${acc}, ${table.label}` : table.label;
                          }, '');
                          const mergedName = data?.[column.key].reduce((acc, table) => {
                            return acc ? `${acc}, ${table.name}` : table.name;
                          }, '');
                          const merged = data?.[column.key].reduce((acc, name) => {
                            return acc ? `${acc}, ${name}` : name;
                          }, '');

                          // const mergedName = data?.[column.key].map(tmp => tmp.name).join(', ');
                          if (mergedLabels && data?.[column.key][0]?.label) return <CTableDataCell key={column.key + index}>{mergedLabels}</CTableDataCell>
                          if (mergedName && data?.[column.key][0]?.name) return <CTableDataCell key={column.key + index}>{mergedName}</CTableDataCell>
                          else if (merged) return <CTableDataCell key={column.key + index}>{merged}</CTableDataCell>
                          else return <CTableDataCell key={column.key + index}>-</CTableDataCell>
                        }
                        else if (typeof data?.[column.key] === "number") {
                          return <CTableDataCell key={column.key + index}>{data?.[column.key] !== undefined ? formatNumber(data?.[column.key]) : "-"}</CTableDataCell>
                        }
                        else {
                          return <CTableDataCell key={column.key + index}>{data?.[column.key] !== undefined ? data?.[column.key] : "-"}</CTableDataCell>
                        }
                    }
                  })}
                  {/* <CTableDataCell>{data.client}</CTableDataCell>
                <CTableDataCell><CBadge color={getBadge(data?.status)}>{data.status}</CBadge></CTableDataCell>
                <CTableDataCell>{moment(data?.bookingDate, "dddd, DD MMMM YYYY HH:mm:ss").format("HH:mm:ss")}</CTableDataCell>
                <CTableDataCell>{data?.createdAt}</CTableDataCell>
                <CTableDataCell>
                  <CButton className='me-2' color="success">Start</CButton>
                  <CButton color="danger" onClick={() => { cancelBooking(data) }}>Cancel</CButton>
                </CTableDataCell> */}
                </CTableRow>
              })}
              {(currentData.length === 0) && <CTableRow><CTableDataCell colSpan={8}><h4 style={{ textAlign: "center", color: "#9f9f9f" }}>Data tidak ditemukan</h4></CTableDataCell></CTableRow>}
            </CTableBody>
          </CTable>
          <CPagination className='pagination-container'>
            <CPaginationItem aria-label="Previous" disabled={currentPage === 1} onClick={() => currentPage > 1 ? changePage(currentPage - 1) : ""}>
              <span aria-hidden="true">&laquo;</span>
            </CPaginationItem>
            {renderPaginationItems()}
            {/* {Array.from({ length: totalPages }, (_, idx) => {
            return (
              <CPaginationItem key={idx} active={currentPage === idx + 1} onClick={() => changePage(idx + 1)}>{idx + 1}</CPaginationItem>
            )
          })} */}
            <CPaginationItem aria-label="Next" disabled={currentPage === totalPages} onClick={() => currentPage < totalPages ? changePage(currentPage + 1) : ""}>
              <span aria-hidden="true">&raquo;</span>
            </CPaginationItem>
          </CPagination>
        </CCardBody>
      </CCard> : <Loading />}

    </Suspense>
  );
}
export default AppTable;
