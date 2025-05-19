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
import api from '../../axiosInstance';


const PriceList = () => {
    const [loading, setLoading] = useState(false);

    const [action, setAction] = useState(null)
    const [visible, setVisible] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const [waktu, setWaktu] = useState("00:00")
    const [item, setItem] = useState([])
    const [tipe, setTipe] = useState("billing")
    const [label, setLabel] = useState("")

    const [harga, setHarga] = useState("")
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
                if (result.isConfirmed) {
                    try {
                        await api.delete("/data/delete", {
                            data: {
                                collection: "tablePrice",
                                filter: { _id: hapus?._id }
                            }
                        });
                        setRefresh(!refresh)
                        Swal.fire("Deleted!", "Data berhasil dihapus", "success");
                    } catch (error) {
                        console.error('Error deleting data:', error);
                        Swal.fire("Failed!", "Gagal menghapus data", "error");
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
            setTipe(edit?.tipe)
            setLabel(edit?.label?.replace(/\s*\(.*?\)\s*/g, "").trim())
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
            tipe: tipe,
            createdAt: moment().format().toString(),
            harga: harga,
            label
        }
        // console.log(docId)
        // console.log(dataForm)
        try {
            const response = await api.post("/data/add", {
                collection: "tablePrice",
                data: dataForm
            });
            setRefresh(!refresh)

            Swal.fire("Success!", "Data berhasil ditambahkan", "success");
            // Refresh data
            // await fetchCashiers();
        } catch (err) {
            console.log(err);
            Swal.fire("Failed!", "Gagal menambahkan data", "error");
        }
        setVisible(false)
        setLoading(false)
    }

    const syncTablePrices = async () => {
        const tablePrices = await api.post("/data", {
            collection: "tablePrice", // Nama koleksi yang diminta
            filter: {}, // Filter yang diberikan dari prop
            sort: {}, // Urutan data
        });
        const tables = await api.post("/data", {
            collection: "table", // Nama koleksi yang diminta
            filter: {}, // Filter yang diberikan dari prop
            sort: {}, // Urutan data
        });

        const priceMap = new Map(tablePrices.data.map(p => [p._id, p]));

        for (const table of tables.data) {
            const updatedPriceList = table.priceList.map(p => {
                const latest = priceMap.get(p.value);
                if (latest) {
                    return {
                        label: `${latest.name} (${Number(latest.harga).toLocaleString()})`,
                        value: latest._id,
                        harga: latest.harga,
                        tipe: latest.tipe,
                        duration: latest.duration,
                    };
                }
                return p; // Jika tidak ditemukan, pakai yang lama
            });

            await api.put("/data/update", {
                collection: "table",
                filter: { _id: table._id },
                update: {
                    $set: {
                        priceList: updatedPriceList,
                        updatedAt: moment().format().toString(),
                    }
                }
            });
        }
    };


    const updateHarga = async (e) => {
        e.preventDefault();
        setLoading(true)
        var dataForm = {
            updatedAt: moment().format().toString(),
            duration: waktu,
            harga: harga,
            tipe: tipe,
            name: nama,
            label
        }
        console.log(edit)
        try {
            await api.put("/data/update", {
                collection: "tablePrice",
                filter: { _id: edit?._id },
                update: dataForm
            });
            syncTablePrices();
            setRefresh(!refresh)

            Swal.fire("Success!", "Berhasil menambahkan data", "success");
        } catch (err) {
            console.log(err);
            // setError('Gagal menambahkan data.');
            Swal.fire("Failed!", "Gagal menambahkan data", "error");
        }
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
                                <CFormLabel className="col-sm-2 col-form-label">Nama</CFormLabel>
                                <CCol sm={10}>
                                    <CFormInput type="text" placeholder="Input Nama" onChange={(e) => setNama(e.target.value)} defaultValue={nama} />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-2 col-form-label">Label Struk</CFormLabel>
                                <CCol sm={10}>
                                    <CFormInput type="text"
                                        placeholder="Input Label Struk (Max 13 Char)"
                                        maxLength={13}
                                        onChange={(e) => setLabel(e.target.value.replace(/,/g, ""))}
                                        value={label}
                                    />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-2 col-form-label">{tipe === "durasi" && "Rate "}Harga</CFormLabel>
                                <CCol sm={10}>
                                    <CFormInput type="text"
                                        placeholder="Input Harga"
                                        onChange={(e) => { if (/^\d*\.?\d*$/.test(e.target.value.replace(/,/g, ""))) setHarga(e.target.value.replace(/,/g, "")) }}
                                        value={formatNumber(harga)}
                                    />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-2 col-form-label">Tipe</CFormLabel>
                                <CCol sm={10}>
                                    <CFormSelect value={tipe} onChange={(e) => setTipe(e.target.value)}>
                                        <option value="billing">Billing</option>
                                        <option value="durasi">Durasi</option>
                                    </CFormSelect>
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-2 col-form-label">Durasi</CFormLabel>
                                <CCol sm="auto">
                                    <CFormInput
                                        type="text"
                                        placeholder={"Input Durasi"}
                                        // list="time_list"
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (/^\d{0,2}:\d{0,2}$/.test(value)) {
                                                setWaktu(value);
                                            }
                                        }}
                                        value={waktu}
                                    />
                                </CCol>
                            </CRow>
                          
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
                                <CFormLabel className="col-sm-2 col-form-label">Label Struk</CFormLabel>
                                <CCol sm={10}>
                                    <CFormInput type="text"
                                        placeholder="Input Label Struk (Max 13 Char)"
                                        maxLength={13}
                                        onChange={(e) => setLabel(e.target.value.replace(/,/g, ""))}
                                        value={label}
                                    />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-2 col-form-label">{tipe === "durasi" && "Rate "}Harga</CFormLabel>
                                <CCol sm={10}>
                                    <CFormInput type="text"
                                        placeholder="Input Harga"
                                        onChange={(e) => { if (/^\d*\.?\d*$/.test(e.target.value.replace(/,/g, ""))) setHarga(e.target.value.replace(/,/g, "")) }}
                                        value={formatNumber(harga)}
                                    />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-2 col-form-label">Tipe</CFormLabel>
                                <CCol sm={10}>
                                    <CFormSelect value={tipe} onChange={(e) => setTipe(e.target.value)}>
                                        <option value="billing">Billing</option>
                                        <option value="durasi">Durasi</option>
                                    </CFormSelect>
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-2 col-form-label">Durasi</CFormLabel>
                                <CCol sm="auto">
                                    <CFormInput
                                        type="text"
                                        placeholder={"Input Durasi"}
                                        // list="time_list"
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (/^\d{0,2}:\d{0,2}$/.test(value)) {
                                                setWaktu(value);
                                            }
                                        }}
                                        value={waktu}
                                    />
                                </CCol>
                            </CRow>
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
                                <CFormLabel className="col-sm-2 col-form-label">Label Struk</CFormLabel>
                                <CCol sm={10}>
                                    <CFormInput type="text"
                                        placeholder="Input Label Struk (Max 13 Char)"
                                        maxLength={13}
                                        onChange={(e) => setLabel(e.target.value.replace(/,/g, ""))}
                                        value={label}
                                    />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-2 col-form-label">Harga {tipe === "billing" && "(/Jam)"}</CFormLabel>
                                <CCol sm={10}>
                                    <CFormInput type="text"
                                        placeholder="Input Harga"
                                        onChange={(e) => { if (/^\d*\.?\d*$/.test(e.target.value.replace(/,/g, ""))) setHarga(e.target.value.replace(/,/g, "")) }}
                                        value={formatNumber(harga)}
                                    />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-2 col-form-label">Tipe</CFormLabel>
                                <CCol sm={10}>
                                    <CFormSelect value={tipe} onChange={(e) => setTipe(e.target.value)}>
                                        <option value="billing">Billing</option>
                                        <option value="durasi">Durasi</option>
                                    </CFormSelect>
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-2 col-form-label">Durasi</CFormLabel>
                                <CCol sm="auto">
                                    <CFormInput
                                        type="text"
                                        placeholder={"Input Durasi"}
                                        // list="time_list"
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (/^\d{0,2}:\d{0,2}$/.test(value)) {
                                                setWaktu(value);
                                            }
                                        }}
                                        value={waktu}
                                    />
                                </CCol>
                            </CRow>
                           
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
                title={"Management Table Price"}
                column={[
                    { name: "#", key: "index" },
                    { name: "Nama", key: "name" },
                    { name: "Harga", key: "harga" },
                    { name: "Durasi", key: "duration" },
                    { name: "Label", key: "label" },
                    // { name: "Rate (/menit)", key: "rate" },
                    // { name: "Rate Malam (/menit)", key: "rate1" },
                    { name: "Action", key: "action" }
                ]}
                // headers={['#', 'Nama Customer', 'Status', 'Booking', 'Created At', 'Action']}
                collection={"tablePrice"} // Ambil data dari koleksi "cashiers"
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
                onClose={() => { setNama(""); setHarga(0); setTipe("billing"); setWaktu("00:00"); setVisible(false); setAction(null); }}
                aria-labelledby="actionModal"
            >
                {renderModal()}
            </CModal>

        </Suspense>
    )
}

export default PriceList