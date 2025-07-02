import React, { useEffect, useState } from 'react';
// import { firestore } from '../../Firebase'; // Import your Firebase configuration
// import { collection, addDoc, serverTimestamp, query, orderBy, where, onSnapshot, updateDoc, doc, setDoc } from 'firebase/firestore';
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../../AuthContext';
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CContainer,
    CForm,
    CFormLabel,
    CFormInput,
    CButton,
    CRow,
    CAlert,
    CInputGroup,
    CSpinner,
} from '@coreui/react';
import AppTable from '../../components/AppTable';
import Swal from 'sweetalert2';
import moment from 'moment';
import { formatNumber } from 'chart.js/helpers';

const Cashier = () => {
    const { currentUser } = useAuth();
    const [saldoAwal, setSaldoAwal] = useState("");
    const [saldoAkhir, setSaldoAkhir] = useState("");
    const [pemasukan, setPemasukan] = useState("");
    const [pengeluaran, setPengeluaran] = useState("");
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false)

    const [init, setInit] = useState(false)
    const [data, setData] = useState([])
    const [done, setDone] = useState(false)

    // const openCashier = async (e) => {
    //     e.preventDefault();
    //     setLoading(true)
    //     try {
    //         await addDoc(collection(firestore, 'cashier'), {
    //             saldoAwal: Number(saldoAwal),
    //             saldoAkhir: 0,
    //             pemasukan: 0,
    //             pengeluaran: 0,
    //             transaksi: [],
    //             status: "OPEN",
    //             createdAt: serverTimestamp()
    //         });
    //         Swal.fire({
    //             title: "Success!",
    //             text: "Berhasil menambahkan data",
    //             icon: "success"
    //         });
    //     } catch (err) {
    //         console.log(err)
    //         setError('Gagal membuka kasir.');
    //         Swal.fire({
    //             title: "Failed!",
    //             text: "Gagal menambahkan data",
    //             icon: "error"
    //         });
    //     }

    //     setLoading(false)
    // };

    // const closeCashier = async (e) => {
    //     e.preventDefault();
    //     setLoading(true)
    //     const [tmpData] = data || []; // Menggunakan destructuring untuk mengambil item pertama
    //     console.log(tmpData)
    //     try {
    //         await setDoc(doc(firestore, 'cashier', tmpData?.id), {
    //             saldoAkhir: Number(saldoAkhir),
    //             pemasukan: Number(pemasukan),
    //             pengeluaran: Number(pengeluaran),
    //             status: "CLOSE",
    //             closeAt: serverTimestamp()
    //         }, { merge: true });
    //         Swal.fire({
    //             title: "Success!",
    //             text: "Berhasil mengubah data",
    //             icon: "success"
    //         });
    //     } catch (err) {
    //         console.log(err)
    //         setError('Gagal menutup kasir.');
    //         Swal.fire({
    //             title: "Failed!",
    //             text: "Gagal mengubah data",
    //             icon: "error"
    //         });
    //     }

    //     setLoading(false)
    // };

    // useEffect(() => {
    //     const todayStart = new Date();
    //     todayStart.setHours(0, 0, 0, 0);

    //     const todayEnd = new Date();
    //     todayEnd.setHours(23, 59, 59, 999);
    //     const colRefTable = query(collection(firestore, "cashier"),
    //         where('createdAt', '>=', todayStart),
    //         where('createdAt', '<=', todayEnd));
    //     const unsubscribeInit = onSnapshot(colRefTable, { includeMetadataChanges: true, source: 'cache' }, async (snapshot) => {
    //         // var tmpData = [...data];
    //         var tmpData = []
    //         var filterData = []
    //         const source = snapshot.metadata.fromCache ? "local cache" : "server";
    //         // console.log(snapshot.metadata.hasPendingWrites)
    //         // console.log(source)
    //         if (!init) {
    //             snapshot.forEach((tmpDocs) => {
    //                 // console.log(tmpDocs.id)
    //                 const docData = { ...tmpDocs.data(), id: tmpDocs.id };
    //                 tmpData.push(docData);

    //             });
    //             // if (snapshot.size === 1) {
    //             //     filterData = tmpData.find((data) => data.status === "OPEN")
    //             //     setData(filterData);
    //             // } else setData(tmpData);
    //             if (tmpData.find((data) => data.status === "CLOSE")) {
    //                 tmpData = []
    //                 setDone(true)
    //             }
    //             console.log(tmpData)
    //             setData(tmpData);
    //             setInit(true);
    //         }
    //     });

    //     const unsubscribe = onSnapshot(colRefTable, async (snapshot) => {
    //         // var tmpData = [...data];
    //         var tmpData = []
    //         var filterData = []
    //         const source = snapshot.metadata.fromCache ? "local cache" : "server";
    //         // console.log(snapshot.metadata.hasPendingWrites)
    //         // console.log(source)
    //         if (init) {
    //             snapshot.forEach((tmpDocs) => {
    //                 // console.log(tmpDocs.id)
    //                 const docData = { ...tmpDocs.data(), id: tmpDocs.id };
    //                 tmpData.push(docData);
    //             })
    //             // if (snapshot.size === 1) {
    //             //     filterData = tmpData.find((data) => data.status === "OPEN")
    //             //     // console.log(filterData)
    //             //     setData(filterData);
    //             // } else setData(tmpData);
    //             if (tmpData.find((data) => data.status === "CLOSE")) {
    //                 tmpData = []
    //                 setDone(true)
    //             }
    //             console.log(tmpData)
    //             setData(tmpData);
    //         }
    //     });

    //     return () => {
    //         unsubscribe();
    //         unsubscribeInit();
    //     };
    // }, [init]);

    return (
        <CRow>
            <CCol xs>
                {error && <CAlert color="danger">{error}</CAlert>}
                <CCard className="mb-4">
                    <CCardHeader><b>Buka / Tutup Kasir</b></CCardHeader>
                    <CCardBody>
                        <CForm>
                            <CContainer>
                                {data.length === 0 && <CRow className="mb-3">
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
                                {data.length > 0 && <>
                                    <CRow className="mb-3">
                                        <CFormLabel className="col-sm-3 col-form-label">Pemasukan</CFormLabel>
                                        <CCol sm={9}>
                                            <CFormInput
                                                type="text"
                                                placeholder="Input Pemasukan"
                                                value={formatNumber(pemasukan)}
                                                onChange={(e) => setPemasukan(e.target.value.replace(/,/g, ""))}
                                                feedbackInvalid="Input hanya menerima angka."
                                                required
                                            />
                                        </CCol>
                                    </CRow>
                                    <CRow className="mb-3">
                                        <CFormLabel className="col-sm-3 col-form-label">Pengeluaran</CFormLabel>
                                        <CCol sm={9}>
                                            <CFormInput
                                                type="text"
                                                placeholder="Input Pengeluaran"
                                                value={formatNumber(pengeluaran)}
                                                onChange={(e) => setPengeluaran(e.target.value.replace(/,/g, ""))}
                                                feedbackInvalid="Input hanya menerima angka."
                                                required
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
                                </>}
                                {/* <CCol xs={12} className="d-flex justify-content-end">
                                    {!loading ?
                                        (data.length === 0 ?
                                            <CButton color="primary" type="submit" onClick={openCashier}> Buka Kasir</CButton> :
                                            <CButton color="danger" type="submit" onClick={closeCashier}> Tutup Kasir</CButton>)
                                        : <CSpinner color="primary" className="float-end" variant="grow" />}
                                </CCol> */}
                            </CContainer>
                        </CForm>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    );
}

export default Cashier;