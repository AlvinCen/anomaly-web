import { cilMediaStop, cilPencil, cilPrint } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CBadge, CButton, CCard, CCardBody, CCardHeader, CCardImage, CCol, CContainer, CFormInput, CFormLabel, CFormSelect, CFormTextarea, CHeader, CInputGroup, CInputGroupText, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CPagination, CPaginationItem, CProgress, CRow, CSpinner, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import moment from 'moment';
import React, { Suspense, useEffect, useState } from 'react'
// import { firestore } from '../../Firebase';
import { collection, getDocs, onSnapshot, addDoc, setDoc, doc, query, where, orderBy, deleteDoc, serverTimestamp } from 'firebase/firestore';
import Swal from 'sweetalert2'
import AppTable from '../../components/AppTable';
import { formatNumber } from 'chart.js/helpers';
import ReactSelectAsyncCreatable from 'react-select/async-creatable';
import { useAuth } from '../../AuthContext';
import api from '../../axiosInstance';


const ManageStorage = () => {
    const { currentUser } = useAuth();

    const [loading, setLoading] = useState(false);

    const [init, setInit] = useState(false);

    const [action, setAction] = useState(null)
    const [visible, setVisible] = useState(false)
    const [harga, setHarga] = useState(0)
    const [index, setIndex] = useState(0)
    const [expired, setExpired] = useState(moment().add(7, "days").format("YYYY-MM-DD").toString())

    const [data, setData] = useState([])
    const [nama, setNama] = useState("")
    const [stok, setStok] = useState(1)
    const [comment, setComment] = useState("")
    const [status, setStatus] = useState("")

    const [detail, setDetail] = useState({});
    const [edit, setEdit] = useState({});
    const [hapus, setHapus] = useState({});

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
                                collection: "storage",
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
            console.log(edit)
            // setStok(edit?.qty)
            // setNama(edit?.name)
            // setComment(edit?.comment)
            setExpired(edit?.expired)
        }
    }, [action])

    useEffect(() => {
        const colRefTable = collection(firestore, "storage");
        const unsubscribeInit = onSnapshot(colRefTable, { includeMetadataChanges: true, source: 'cache' }, async (snapshot) => {
            // var tmpData = [...data];
            var tmpData = []
            const source = snapshot.metadata.fromCache ? "local cache" : "server";
            if (!init) {
                snapshot.forEach((tmpDocs) => {
                    // console.log(tmpDocs.id)
                    const docData = { ...tmpDocs.data(), id: tmpDocs.id, label: tmpDocs.data().name, value: tmpDocs.data().name };
                    tmpData.push(docData);
                });
                setData(tmpData);
                setInit(true);
            }
        });

        const unsubscribe = onSnapshot(colRefTable, async (snapshot) => {
            // var tmpData = [...data];
            var tmpData = []
            const source = snapshot.metadata.fromCache ? "local cache" : "server";
            // console.log(snapshot.metadata.hasPendingWrites)
            // console.log(source)
            if (init) {
                snapshot.forEach((tmpDocs) => {
                    // console.log(tmpDocs.id)
                    const docData = { ...tmpDocs.data(), id: tmpDocs.id, label: tmpDocs.data().name, value: tmpDocs.data().name };
                    tmpData.push(docData);
                })
                // console.log(tmpData)
                setData(tmpData);
            }
        });


        return () => {
            unsubscribe();
            unsubscribeInit();
            setLoading(false)
        };
    }, [init]);

    const tambahItem = async (e) => {
        e.preventDefault();
        setLoading(true)
        console.log(nama)

        const data = {
            name: nama?.label,
            stok: Number(stok),
            comment: comment,
            expired: expired,
            event: "add",
            createdAt: moment().format().toString(),
            createdBy: currentUser.name ? currentUser.name : currentUser.username
        }
        // if (nama?.id) data.storageId = nama?.id
        // console.log(data)
        // try {
        //     if (nama?.id) {
        //         await api.put("/data/update", {
        //             collection: "storage",
        //             filter: { _id: nama?.id },
        //             update: {
        //                 $push: {
        //                     stok: {
        //                         expired: expired,
        //                         qty: Number(stok),
        //                     }
        //                 },
        //                 updatedAt: moment().format().toString(),
        //             }
        //         });
        //         await api.post("/data/add", {
        //             collection: "storageLog",
        //             data: {
        //                 ...data,
        //                 storageId: nama?.id
        //             }
        //         });
        //     } else {
        //         const response = await api.post("/data/add", {
        //             collection: "storage",
        //             data: {
        //                 name: nama?.value,
        //                 stok: [{
        //                     expired: expired,
        //                     qty: Number(stok),
        //                 }],
        //                 createdAt: moment().format().toString(),
        //             }
        //         });

        //         await api.post("/data/add", {
        //             collection: "storageLog",
        //             data: {
        //                 ...data,
        //                 storageId: response.data.newData._id
        //             }
        //         });
        //     }

        //     setRefresh(!refresh)

        //     Swal.fire({
        //         title: "Updated!",
        //         text: "Data berhasil ditambahkan",
        //         icon: "success"
        //     });
        // } catch (error) {
        //     Swal.fire({
        //         title: "Error!",
        //         text: "Gagal menambahkan data",
        //         icon: "error"
        //     });
        // }
        setLoading(false)
        setVisible(false)
    }

    const updateItem = async (e) => {
        e.preventDefault();
        setLoading(true)

        const data = {
            storageId: detail?.id,
            name: detail?.name,
            stok: Number(stok),
            comment: comment,
            expired: expired,
            event: edit?.qty - Number(stok) === 0 ? "delete" : "update",
            createdAt: moment().format().toString(),
            createdBy: currentUser.name ? currentUser.name : currentUser.username
        }
        try {
            if (nama?.id) {
                await api.put("/data/update", {
                    collection: "storage",
                    filter: { _id: nama?.id },
                    update: {
                        $push: {
                            stok: {
                                expired: expired,
                                qty: Number(stok),
                            }
                        },
                        updatedAt: moment().format().toString(),
                    }
                });
                await api.post("/data/add", {
                    collection: "storageLog",
                    data: {
                        ...data,
                        storageId: nama?.id
                    }
                });
            } else {
                const response = await api.post("/data/add", {
                    collection: "storage",
                    data: {
                        name: nama?.value,
                        stok: [{
                            expired: expired,
                            qty: Number(stok),
                        }],
                        createdAt: moment().format().toString(),
                    }
                });

                await api.post("/data/add", {
                    collection: "storageLog",
                    data: {
                        ...data,
                        storageId: response.data.newData._id
                    }
                });
            }

            setRefresh(!refresh)

            Swal.fire({
                title: "Updated!",
                text: "Data berhasil ditambahkan",
                icon: "success"
            });
        } catch (error) {
            Swal.fire({
                title: "Error!",
                text: "Gagal menambahkan data",
                icon: "error"
            });
        }
        setLoading(false)
        setVisible(false)
    }

    const createOption = (label) => ({
        label,
        value: label.toLowerCase().replace(/\W/g, ''),
    });

    const loadOption = (inputValue, callback) => {
        const options = [{ options: data }]
        // const options = [];
        // console.log(options)
        callback(options)
    }

    const filterOption = (option, inputValue) => {
        return option?.value.includes(inputValue)
    }

    const isOptionUnique = (inputValue) => {
        // Check if the option already exists
        return !data.some(
            (option) => option.label.toLowerCase().includes(inputValue.toLowerCase())
        );
    };

    const handleCreate = async (inputValue) => {
        (true);
        setTimeout(() => {
            const newOption = createOption(inputValue);
            (false);
            // setOptions((prev) => [...prev, newOption]);
            setNama(newOption);
        }, 1000);
    };

    const renderModal = () => {
        switch (action) {
            case "add":
                return <>
                    <CModalHeader>
                        <CModalTitle id="actionModal">Tambah Item</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <CContainer>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-2 col-form-label">Nama Barang</CFormLabel>
                                <CCol sm={10}>
                                    <ReactSelectAsyncCreatable
                                        defaultOptions
                                        loadOptions={loadOption}
                                        styles={customStyles}
                                        filterOption={filterOption}
                                        menuPortalTarget={document.body}
                                        onChange={(newValue) => setNama(newValue)}
                                        onCreateOption={handleCreate}
                                        
                                        value={nama}
                                        placeholder="Nama Barang" />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-2 col-form-label">Stok</CFormLabel>
                                <CCol sm={10}>
                                    <CFormInput type="number" min={1} value={stok} onChange={(e) => { setStok(e.target.value) }} />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-2 col-form-label">Expired</CFormLabel>
                                <CCol sm="auto">
                                    <CFormInput
                                        type="date"
                                        value={expired}
                                        onChange={(e) => setExpired(e.target.value)}
                                        placeholder="Expired Date"
                                        aria-label="Expired Date" />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-2 col-form-label">Comment</CFormLabel>
                                <CCol>
                                    <CFormTextarea
                                        rows={3}
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Input Comment"
                                        aria-label="Input Comment" />
                                </CCol>
                            </CRow>
                        </CContainer>
                    </CModalBody>

                    <CModalFooter>
                        {!loading ? <CButton color="success" onClick={(e) => { tambahItem(e) }}>Tambah</CButton>
                            : <CSpinner color="primary" className="float-end" variant="grow" />}
                    </CModalFooter>
                </>
            case "edit":
                return <>
                    <CModalHeader>
                        <CModalTitle id="actionModal">Update Item - {detail?.name}</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <CContainer>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-2 col-form-label">Stok</CFormLabel>
                                <CCol sm={10}>
                                    <CFormInput type="number" min={1} max={edit?.qty} value={stok} onChange={(e) => { setStok(e.target.value) }} />
                                </CCol>
                            </CRow>
                            {/* <CRow className="mb-3">
                                <CFormLabel className="col-sm-2 col-form-label">Expired</CFormLabel>
                                <CCol sm="auto">
                                    <CFormInput
                                        type="date"
                                        value={edit?.expired}
                                        onChange={(e) => setExpired(e.target.value)}
                                        placeholder="Expired Date"
                                        aria-label="Expired Date" />
                                </CCol>
                            </CRow> */}
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-2 col-form-label">Comment</CFormLabel>
                                <CCol>
                                    <CFormTextarea
                                        rows={3}
                                        value={edit?.comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Input Comment"
                                        aria-label="Input Comment" />
                                </CCol>
                            </CRow>
                        </CContainer>
                    </CModalBody>

                    <CModalFooter>
                        <CButton color="primary" onClick={() => { setAction("detail"); setVisible(true) }}>← Kembali</CButton>
                        <CButton color="warning" onClick={(e) => { updateItem(e) }}>Update</CButton>
                        <CButton color="danger" onClick={() => { setVisible(false) }}>Tutup</CButton>
                    </CModalFooter>
                </>
            case "detail":
                // var tmpDataMerch = detailTransaksiMerch?.filter((data, idx) => {
                //     var promo = data.item.filter((item) => item.isPromo)
                //         .reduce((total, data) => {
                //             return Number(total) + Number(data?.harga * data?.qty)
                //         }, 0);
                //     data.total -= promo
                //     return data.item.some(item => !item.name?.toLowerCase().includes("promo")) && data.total > 0
                // })
                //     .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                // var tmpData = []
                // var totalPool = 0
                // var totalMerch = 0

                // if (title === "pool") {
                //     tmpData = detailTransaksi?.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

                //     totalPool = tmpData.reduce((total, data) => {
                //         var harga = data?.hargaVoid ? data?.hargaVoid : data?.harga
                //         return total + Number(harga)
                //     }, 0)
                //     totalMerch = tmpDataMerch.reduce((total, data) => {
                //         return total + Number(data?.total)
                //     }, 0)
                // } else {
                //     totalMerch = tmpDataMerch.reduce((total, data) => {
                //         return total + Number(data?.grandTotal)
                //     }, 0)
                // }

                return <>
                    <CModalHeader>
                        <CModalTitle id="actionModal">Detail Stok - {detail?.name}</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <CTable align="middle" className="mb-3 border" hover responsive striped>
                            <CTableHead className="text-nowrap">
                                <CTableRow>
                                    <CTableHeaderCell className="bg-body">#</CTableHeaderCell>
                                    <CTableHeaderCell className="bg-body">Qty</CTableHeaderCell>
                                    <CTableHeaderCell className="bg-body">Expired</CTableHeaderCell>
                                    <CTableHeaderCell className="bg-body">Action</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {
                                    detail?.stok.length > 0 ? detail?.stok?.map((data, idx) =>
                                        <CTableRow>
                                            <CTableDataCell>{idx + 1}</CTableDataCell>
                                            <CTableDataCell>{data?.qty}</CTableDataCell>
                                            <CTableDataCell>{moment(data?.expired).format("DD MMMM YYYY")}</CTableDataCell>
                                            <CTableDataCell>
                                                <CButton className='me-2' size="sm" color="warning" onClick={() => { setEdit(data); setAction("edit"); setIndex(idx); setVisible(true) }}><CIcon icon={cilPencil} /> Edit</CButton>
                                            </CTableDataCell>
                                        </CTableRow>
                                    ) :
                                        <CTableRow><CTableDataCell colSpan={8}><h4 style={{ textAlign: "center", color: "#9f9f9f" }}>Data tidak ditemukan</h4></CTableDataCell></CTableRow>
                                }

                            </CTableBody>
                        </CTable>
                    </CModalBody>
                    <CModalFooter>
                        <CButton color="danger" onClick={() => { setVisible(false) }}>Tutup</CButton>
                    </CModalFooter>
                </>
            default:
                return <>
                    <CModalHeader>
                        <CModalTitle id="actionModal">Tambah Item</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <CContainer>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-2 col-form-label">Nama Barang</CFormLabel>
                                <CCol sm={10}>
                                    <ReactSelectAsyncCreatable
                                        defaultOptions
                                        loadOptions={loadOption}
                                        styles={customStyles}

                                        filterOption={filterOption}
                                        menuPortalTarget={document.body}
                                        onChange={(newValue) => setNama(newValue)}
                                        onCreateOption={handleCreate}
                                        
                                        value={nama}
                                        placeholder="Nama Barang" />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-2 col-form-label">Stok</CFormLabel>
                                <CCol sm={10}>
                                    <CFormInput type="number" min={1} value={stok} onChange={(e) => { setStok(e.target.value) }} />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-2 col-form-label">Expired</CFormLabel>
                                <CCol sm="auto">
                                    <CFormInput
                                        type="date"
                                        value={expired}
                                        onChange={(e) => setExpired(e.target.value)}
                                        placeholder="Expired Date"
                                        aria-label="Expired Date" />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-2 col-form-label">Comment</CFormLabel>
                                <CCol>
                                    <CFormTextarea
                                        rows={3}
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Input Comment"
                                        aria-label="Input Comment" />
                                </CCol>
                            </CRow>
                        </CContainer>
                    </CModalBody>

                    <CModalFooter>
                        {!loading ? <CButton color="success" onClick={(e) => { tambahItem(e) }}>Tambah</CButton>
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
                title={"Storage Log"}
                column={[
                    { name: "#", key: "index" },
                    { name: "Nama Item", key: "name" },
                    { name: "Stok", key: "stok" },
                    { name: "Expired", key: "expired" },
                    { name: "Event Type", key: "event" },
                    { name: "Comment", key: "comment" },
                    { name: "Created At", key: "createdAt" },
                    { name: "Update By", key: "createdBy" },
                    // { name: "Action", key: "action" }
                ]}
                // headers={['#', 'Nama Customer', 'Status', 'Booking', 'Created At', 'Action']}
                collection={"cashiers"} // Ambil data dari koleksi "cashiers"
                filter={{}} // Bisa diberikan filter
                sort={{ createdAt: -1 }} // Sortir dari terbaru
                listStatus={[
                    { name: "add", color: "success" },
                    { name: "update", color: "warning" },
                    { name: "delete", color: "danger" }
                ]}
                setAction={setAction}
                setVisible={setVisible}
                setEdit={setEdit}
                setHapus={setHapus}
            />
            {/* <CCard>
                <CCardHeader><b>Storage Log</b></CCardHeader>
                <CCardBody>
                    <CCard>
                        <CCardBody>asd</CCardBody>
                    </CCard>
                    <CCard>
                        <CCardBody>asd</CCardBody>
                    </CCard>
                    <CCard>
                        <CCardBody>asd</CCardBody>
                    </CCard>
                    <CCard>
                        <CCardBody>asd</CCardBody>
                    </CCard>
                </CCardBody>
            </CCard> */}


            <AppTable
                title={"Management Storage"}
                column={[
                    { name: "#", key: "index" },
                    { name: "Nama Item", key: "name" },
                    // { name: "Harga", key: "harga" },
                    { name: "Total Stok", key: "totalStok" },
                    // { name: "Expired", key: "expired" },
                    // { name: "Status", key: "status" },
                    { name: "Action", key: "action" }
                ]}
                // headers={['#', 'Nama Customer', 'Status', 'Booking', 'Created At', 'Action']}
                collection={"cashiers"} // Ambil data dari koleksi "cashiers"
                filter={{}} // Bisa diberikan filter
                sort={{ createdAt: -1 }} // Sortir dari terbaru
                crudAction={[{ name: "Tambah Item", key: "add" }]}
                listStatus={[{ name: "LISTED", color: "success" }, { name: "ARCHIVE", color: "secondary" }]}
                setAction={setAction}
                setVisible={setVisible}
                setDetail={setDetail}
                setEdit={setEdit}
                setHapus={setHapus}
            />
            <CModal
                size="lg"
                scrollable
                alignment='center'
                visible={visible}
                onClose={() => { setNama(""); setHarga(0); setDetail(""); setStok(0); setStatus(""); setVisible(false); setAction(null); }}
                aria-labelledby="actionModal"
            >
                {renderModal()}
            </CModal>

        </Suspense>
    )
}

export default ManageStorage