import { cilMediaStop, cilPencil, cilPrint } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CBadge, CButton, CCard, CCardBody, CCardHeader, CCardImage, CCol, CContainer, CFormInput, CFormLabel, CFormSelect, CHeader, CInputGroup, CInputGroupText, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CPagination, CPaginationItem, CProgress, CRow, CSpinner, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import moment from 'moment';
import React, { Suspense, useEffect, useState } from 'react'
// import { firestore } from '../../Firebase';
import { collection, getDocs, onSnapshot, addDoc, setDoc, doc, query, where, orderBy, deleteDoc } from 'firebase/firestore';
import Swal from 'sweetalert2'
import AppTable from '../../components/AppTable';
import { formatNumber } from 'chart.js/helpers';
import ReactSelectAsync from 'react-select/async';


const PriceList = () => {
    const [loading, setLoading] = useState(false);

    const [action, setAction] = useState(null)
    const [visible, setVisible] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const [waktu, setWaktu] = useState(moment("00:00", "HH:mm").startOf("hour").format("HH:mm"))
    const [item, setItem] = useState([])
    const [member, setMember] = useState("")
    const [harga, setHarga] = useState("")
    const [jumlah, setJumlah] = useState("")
    // const [harga1, setHarga1] = useState("")

    const [data, setData] = useState([])
    const [nama, setNama] = useState("")

    const [edit, setEdit] = useState({});
    const [hapus, setHapus] = useState({});

    useEffect(() => {
        if (Object.keys(hapus).length > 0) {
            Swal.fire({
                title: "Konfirmasi",
                html: `<p>Apakah anda yakin menghapus data <b>${hapus?.name}</b>?</p>`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Ya",
                cancelButtonText: "Batal"
            }).then(async (result) => {
                if (result.isConfirmed && hapus?.status === "KOSONG") {
                    try {
                        await api.delete("/data/delete", {
                            data: {
                                collection: "memberPrice",
                                filter: { _id: hapus?._id }
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
                } else if (result.isConfirmed && hapus?.status === "AKTIF") {
                    Swal.fire({
                        title: "Failed!",
                        text: "Data gagal dihapus",
                        icon: "error"
                    });
                }
            })
            setHapus({})
        }

    }, [hapus])

    useEffect(() => {
        if (action === "edit") {
            setNama(edit?.name)
            setHarga(edit?.harga)
            setWaktu(edit?.duration)
            // setHarga(edit?.rate)
            // setHarga1(edit?.rate1)
        }
    }, [action])

    const tambahHarga = async (e) => {
        e.preventDefault();
        setLoading(true)
        var dataForm = {
            name: nama,
            duration: waktu,
            createdAt: moment().format().toString(),
            harga: harga,
        }
        // console.log(docId)
        // console.log(dataForm)
        await addDoc(collection(firestore, "memberPrice"), dataForm)
            .then(() => {
                console.log('Data berhasil ditambahkan');
                Swal.fire({
                    title: "Success!",
                    text: "Berhasil menambahkan data baru",
                    icon: "success"
                });
                // Lakukan apa yang perlu dilakukan setelah data berhasil ditambahkan
            })
            .catch((error) => {
                console.error('Error menambahkan data: ', error);
                Swal.fire({
                    title: "Error!",
                    text: "Gagal mnenambahkan data baru",
                    icon: "error"
                });
            });
        setVisible(false)
        setLoading(false)
    }

    const updateHarga = async (e) => {
        e.preventDefault();
        setLoading(true)
        var dataForm = {
            createdAt: moment().format().toString(),
            duration: waktu,
            harga: harga,
            name: nama
        }
        await setDoc(doc(firestore, "memberPrice", edit?.id), dataForm, { merge: true })
            .then(() => {
                Swal.fire({
                    title: "Updated!",
                    text: "Data berhasil diperbarui",
                    icon: "success"
                });
                setVisible(false)
            })
            .catch((error) => {
                console.error('Error menambahkan data: ', error);
                Swal.fire({
                    title: "Error!",
                    text: "Data gagal diperbarui",
                    icon: "error"
                });
            });
        setVisible(false)
        setLoading(false)
    }

    const renderModal = () => {
        switch (action) {
            case "add":
                return <>
                    <CModalHeader>
                        <CModalTitle id="actionModal">Tambah Harga</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <CContainer>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-3 col-form-label">Nama</CFormLabel>
                                <CCol sm={9}>
                                    <CFormInput type="text" placeholder="Input Nama" onChange={(e) => setNama(e.target.value)} defaultValue={nama} />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-3 col-form-label">Harga</CFormLabel>
                                <CCol sm={9}>
                                    <CFormInput type="text"
                                        placeholder="Input Harga"
                                        onChange={(e) => { if (/^\d*\.?\d*$/.test(e.target.value.replace(/,/g, ""))) setHarga(e.target.value.replace(/,/g, "")) }}
                                        value={formatNumber(harga)}
                                    />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-3 col-form-label">Benefit</CFormLabel>
                                <CCol sm={9}>
                                    <CFormInput type="text"
                                        placeholder="Input Harga"
                                        onChange={(e) => { if (/^\d*\.?\d*$/.test(e.target.value.replace(/,/g, ""))) setHarga(e.target.value.replace(/,/g, "")) }}
                                        value={formatNumber(harga)}
                                    />
                                </CCol>
                            </CRow>
                            <CRow className='mb-3'>
                                <CFormLabel className="col-sm-3 col-form-label">Jenis Member</CFormLabel>
                                <CCol sm={9}>
                                    <CFormSelect value={member} onChange={(e) => {
                                        setMember(e.target.value);
                                    }}>
                                        <option value="" disabled selected>Pilih Jenis Member</option>
                                        <option value="trx" >Per Transaksi</option>
                                        <option value="monthly" >Per Bulan</option>
                                    </CFormSelect>
                                </CCol>
                            </CRow>
                            {member === "trx" && <CRow>
                                <CFormLabel className="col-sm-3 col-form-label">Jumlah Transaksi</CFormLabel>
                                <CCol sm={9}>
                                    <CFormInput type="text"
                                        placeholder="Input Jumlah Transaksi"
                                        onChange={(e) => { if (/^\d*\.?\d*$/.test(e.target.value.replace(/,/g, ""))) setJumlah(e.target.value.replace(/,/g, "")) }}
                                        value={formatNumber(jumlah)}
                                    />
                                </CCol>
                            </CRow>}
                        </CContainer>
                    </CModalBody>

                    <CModalFooter>
                        {!loading ? <CButton color="success" onClick={(e) => { tambahHarga(e) }}>Tambah</CButton>
                            : <CSpinner color="primary" className="float-end" variant="grow" />}
                    </CModalFooter>
                </>
            case "edit":
                return <>
                    <CModalHeader>
                        <CModalTitle id="actionModal">Update Harga</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <CContainer>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-2 col-form-label">Nama</CFormLabel>
                                <CCol sm={10}>
                                    <CFormInput type="text" placeholder="Input Nama" onChange={(e) => setNama(e.target.value)} defaultValue={nama} />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-2 col-form-label">Harga</CFormLabel>
                                <CCol sm={10}>
                                    <CFormInput type="text"
                                        placeholder="Input Harga"
                                        onChange={(e) => { if (/^\d*\.?\d*$/.test(e.target.value.replace(/,/g, ""))) setHarga(e.target.value.replace(/,/g, "")) }}
                                        value={formatNumber(harga)}
                                    />
                                </CCol>
                            </CRow>
                            <CRow>
                                <CFormLabel className="col-sm-2 col-form-label">Durasi</CFormLabel>
                                <CCol sm="auto">
                                    <CFormInput type="time"
                                        placeholder={"Pilih Durasi"}
                                        // list="time_list"
                                        onChange={(e) => {
                                            setWaktu(e.target.value)
                                        }}
                                        value={waktu}
                                    />
                                </CCol>
                            </CRow>
                            {/* <CRow className="mb-3">
                                <CFormLabel className="col-sm-2 col-form-label">Rate Harga Malam</CFormLabel>
                                <CCol sm={10}>
                                    <CFormInput type="text"
                                        placeholder="Input Harga Malam"
                                        onChange={(e) => { if (/^\d*\.?\d*$/.test(e.target.value)) setHarga1(e.target.value.replace(/,/g, "")) }}
                                        value={harga1}
                                    />
                                </CCol>
                            </CRow> */}
                        </CContainer>
                    </CModalBody>

                    <CModalFooter>
                        {!loading ? <CButton color="warning" onClick={(e) => { updateHarga(e) }}>Update</CButton>
                            : <CSpinner color="primary" className="float-end" variant="grow" />}
                    </CModalFooter>
                </>
            default:
                return <>
                    <CModalHeader>
                        <CModalTitle id="actionModal">Tambah Harga</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <CContainer>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-2 col-form-label">Nama</CFormLabel>
                                <CCol sm={10}>
                                    <CFormInput type="text" placeholder="Input Nama" onChange={(e) => setNama(e.target.value)} defaultValue={nama} />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-2 col-form-label">Harga</CFormLabel>
                                <CCol sm={10}>
                                    <CFormInput type="text"
                                        placeholder="Input Harga"
                                        onChange={(e) => { if (/^\d*\.?\d*$/.test(e.target.value.replace(/,/g, ""))) setHarga(e.target.value.replace(/,/g, "")) }}
                                        value={formatNumber(harga)}
                                    />
                                </CCol>
                            </CRow>
                            <CRow>
                                <CFormLabel className="col-sm-2 col-form-label">Durasi</CFormLabel>
                                <CCol sm="auto">
                                    <CFormInput type="time"
                                        placeholder={"Pilih Durasi"}
                                        // list="time_list"
                                        onChange={(e) => {
                                            setWaktu(e.target.value)
                                        }}
                                        value={waktu}
                                    />
                                </CCol>
                            </CRow>
                            {/* <CRow className="mb-3">
                            <CFormLabel className="col-sm-2 col-form-label">Rate Harga Malam</CFormLabel>
                            <CCol sm={10}>
                                <CFormInput type="text"
                                    placeholder="Input Harga Malam"
                                    onChange={(e) => { if (/^\d*\.?\d*$/.test(e.target.value)) setHarga1(e.target.value.replace(/,/g, "")) }}
                                    value={harga1}
                                />
                            </CCol>
                        </CRow> */}
                        </CContainer>
                    </CModalBody>

                    <CModalFooter>
                        {!loading ? <CButton color="success" onClick={(e) => { tambahHarga(e) }}>Tambah</CButton>
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
            <AppTable
                title={"Management Member Price"}
                column={[
                    { name: "#", key: "index" },
                    { name: "Nama", key: "name" },
                    { name: "Harga", key: "harga" },
                    { name: "Benefit", key: "benefit" },
                    // { name: "Rate (/menit)", key: "rate" },
                    // { name: "Rate Malam (/menit)", key: "rate1" },
                    { name: "Action", key: "action" }
                ]}
                // headers={['#', 'Nama Customer', 'Status', 'Booking', 'Created At', 'Action']}
                collection={"cashiers"} // Ambil data dari koleksi "cashiers"
                filter={{}} // Bisa diberikan filter
                sort={{ createdAt: -1 }} // Sortir dari terbaru
                crudAction={[{ name: "Tambah List Harga", key: "add" }]}
                isManage={true}
                listStatus={[{ name: "AKTIF", color: "success" }, { name: "KOSONG", color: "info" }]}
                refresh={refresh}
                setAction={setAction}
                setVisible={setVisible}
                setParentData={setData}
                setEdit={setEdit}
                setHapus={setHapus}
            />
            <CModal
                size="lg"
                scrollable
                alignment='center'
                visible={visible}
                onClose={() => { setNama(""); setHarga(0); setVisible(false); setAction(null); }}
                aria-labelledby="actionModal"
            >
                {renderModal()}
            </CModal>

        </Suspense>
    )
}

export default PriceList