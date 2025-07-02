import { cilMediaStop, cilPencil, cilPrint } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CBadge, CButton, CCard, CCardBody, CCardHeader, CCardImage, CCol, CContainer, CFormInput, CFormLabel, CFormSelect, CHeader, CInputGroup, CInputGroupText, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CPagination, CPaginationItem, CProgress, CRow, CSpinner, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import moment from 'moment';
import React, { Suspense, useEffect, useState } from 'react'
// import { firestore } from '../../Firebase';
// import { collection, getDocs, onSnapshot, addDoc, setDoc, doc, query, where, orderBy, deleteDoc } from 'firebase/firestore';
import Swal from 'sweetalert2'
import AppTable from '../../components/AppTable';
import { formatNumber } from 'chart.js/helpers';

const ManageMerch = () => {
    const [loading, setLoading] = useState(false);

    const [action, setAction] = useState(null)
    const [visible, setVisible] = useState(false)
    const [harga, setHarga] = useState(0)

    const [data, setData] = useState([])
    const [nama, setNama] = useState("")
    const [stok, setStok] = useState(1)
    const [status, setStatus] = useState("")

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
                if (result.isConfirmed) {
                    try {
                        await api.delete("/data/delete", {
                            data: {
                                collection: "merch",
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
                }
            })
            setHapus({})
        }

    }, [hapus])

    useEffect(() => {
        if (action === "edit") {
            setStok(edit?.stok)
            setNama(edit?.name)
            setHarga(edit?.harga)
            setStatus(edit?.status)
        }
    }, [action])

    const tambahMerch = async (e) => {
        e.preventDefault();
        setLoading(true)
        const data = {
            name: nama,
            harga: harga,
            stok: stok,
            createdAt: moment().format().toString(),
            status: "LISTED"
        }
        const docRef = await addDoc(collection(firestore, "merchandise"), data)
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
                    icon: "danger"
                });
            });
        setVisible(false)
    }

    const updateMerch = async (e) => {
        e.preventDefault();
        setLoading(true)
        var dataForm = {
            harga: harga,
            name: nama,
            stok: stok,
            status: status,
        }
        await setDoc(doc(firestore, "merchandise", edit?.id), dataForm, { merge: true })
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
    }

    const renderModal = () => {
        switch (action) {
            case "add":
                return <>
                    <CModalHeader>
                        <CModalTitle id="actionModal">Tambah Aksesoris</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <CContainer>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-2 col-form-label">Nama Barang</CFormLabel>
                                <CCol sm={10}>
                                    <CFormInput type="text" placeholder="Input Nama Barang" onChange={(e) => setNama(e.target.value)} defaultValue={nama} />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-2 col-form-label">Harga</CFormLabel>
                                <CCol sm={10}>
                                    <CFormInput type="text"
                                        placeholder="Input Harga"
                                        onChange={(e) => setHarga(e.target.value.replace(/,/g, ""))}
                                        value={formatNumber(harga)}
                                    />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-2 col-form-label">Stok</CFormLabel>
                                <CCol sm={10}>
                                    <CFormInput type="number" min={1} value={stok} onChange={(e) => { setStok(e.target.value) }} />
                                </CCol>
                            </CRow>
                        </CContainer>
                    </CModalBody>

                    <CModalFooter>
                        {!loading ? <CButton color="success" onClick={(e) => { tambahMerch(e) }}>Tambah</CButton>
                            : <CSpinner color="primary" className="float-end" variant="grow" />}
                    </CModalFooter>
                </>
            case "edit":
                return <>
                    <CModalHeader>
                        <CModalTitle id="actionModal">Ubah Menu</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <CContainer>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-2 col-form-label">Nama Menu</CFormLabel>
                                <CCol sm={10}>
                                    <CFormInput type="text" placeholder="Input Nama Barang" onChange={(e) => setNama(e.target.value)} defaultValue={nama} />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-2 col-form-label">Harga</CFormLabel>
                                <CCol sm={10}>
                                    <CFormInput type="text"
                                        placeholder="Input Harga"
                                        onChange={(e) => setHarga(e.target.value.replace(/,/g, ""))}
                                        value={formatNumber(harga)}
                                    />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-2 col-form-label">Stok</CFormLabel>
                                <CCol sm={10}>
                                    <CFormInput type="number" min={1} value={stok} onChange={(e) => { setStok(e.target.value) }} />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-2 col-form-label">Status</CFormLabel>
                                <CCol sm={10}>
                                    <CFormSelect options={['LISTED', 'ARCHIVE']} value={status} onChange={(e) => setStatus(e.target.value)} />
                                </CCol>
                            </CRow>
                        </CContainer>
                    </CModalBody>

                    <CModalFooter>
                        {!loading ? <CButton color="success" onClick={(e) => { updateMerch(e) }}>Ubah</CButton>
                            : <CSpinner color="primary" className="float-end" variant="grow" />}
                    </CModalFooter>
                </>
            default:
                return <>
                    <CModalHeader>
                        <CModalTitle id="actionModal">Tambah Aksesoris</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <CContainer>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-2 col-form-label">Nama Barang</CFormLabel>
                                <CCol sm={10}>
                                    <CFormInput type="text" placeholder="Input Nama Menu" onChange={(e) => setNama(e.target.value)} defaultValue={nama} />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-2 col-form-label">Harga</CFormLabel>
                                <CCol sm={10}>
                                    <CFormInput type="text"
                                        placeholder="Input Harga"
                                        onChange={(e) => setHarga(e.target.value.replace(/,/g, ""))}
                                        value={formatNumber(harga)}
                                    />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-2 col-form-label">Stok</CFormLabel>
                                <CCol sm={10}>
                                    <CFormInput type="number" min={1} value={stok} onChange={(e) => { setStok(e.target.value) }} />
                                </CCol>
                            </CRow>
                        </CContainer>
                    </CModalBody>

                    <CModalFooter>
                        {!loading ? <CButton color="success" onClick={(e) => { tambahMerch(e) }}>Tambah</CButton>
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
                title={"Management Merchandise"}
                column={[
                    { name: "#", key: "index" },
                    { name: "Nama Item", key: "name" },
                    { name: "Harga", key: "harga" },
                    { name: "Stok", key: "stok" },
                    { name: "Status", key: "status" },
                    { name: "Action", key: "action" }
                ]}
                // headers={['#', 'Nama Customer', 'Status', 'Booking', 'Created At', 'Action']}
                collection={"cashiers"} // Ambil data dari koleksi "cashiers"
                filter={{}} // Bisa diberikan filter
                sort={{ createdAt: -1 }} // Sortir dari terbaru
                crudAction={[{ name: "Tambah Merchandise", key: "add" }]}
                listStatus={[{ name: "LISTED", color: "success" }, { name: "ARCHIVE", color: "secondary" }]}
                setAction={setAction}
                setVisible={setVisible}
                setEdit={setEdit}
                setHapus={setHapus}
            />
            <CModal
                size="lg"
                scrollable
                alignment='center'
                visible={visible}
                onClose={() => { setNama(""); setHarga(0); setStok(0); setStatus(""); setVisible(false); setAction(null); }}
                aria-labelledby="actionModal"
            >
                {renderModal()}
            </CModal>

        </Suspense>
    )
}

export default ManageMerch