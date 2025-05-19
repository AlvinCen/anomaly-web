import { cilMediaStop, cilPencil, cilPrint } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CBadge, CButton, CCard, CCardBody, CCardHeader, CCardImage, CCol, CContainer, CFormInput, CFormLabel, CFormSelect, CFormTextarea, CHeader, CInputGroup, CInputGroupText, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CPagination, CPaginationItem, CProgress, CRow, CSpinner, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import moment from 'moment';
import React, { Suspense, useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import AppTable from '../../components/AppTable';
import { formatNumber } from 'chart.js/helpers';
import ReactSelectAsyncCreatable from 'react-select/async-creatable';
import { useAuth } from '../../AuthContext.js';
import api from '../../axiosInstance.js';

const StorageList = () => {
    const { currentUser } = useAuth();

    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState(false)

    const [init, setInit] = useState(false);

    const [action, setAction] = useState(null)
    const [visible, setVisible] = useState(false)
    const [harga, setHarga] = useState(0)
    const [index, setIndex] = useState(0)
    const [expired, setExpired] = useState(moment().add(7, "days").format("YYYY-MM-DD").toString())

    const [data, setData] = useState([])
    const [nama, setNama] = useState("")
    const [stok, setStok] = useState(1)
    const [berat, setBerat] = useState(100)
    const [tipe, setTipe] = useState("")
    const [comment, setComment] = useState("")
    const [status, setStatus] = useState("")
    const [isAscending, setIsAscending] = useState(true);


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

    const sortByExpiredDate = (item, ascending = true) => {
        const sortedStok = [...item.stok].sort((a, b) => {
            const dateA = new Date(a.expired);
            const dateB = new Date(b.expired);
            return ascending ? dateA - dateB : dateB - dateA;
        });
        return { ...item, stok: sortedStok };
    };

    const handleSort = () => {
        setIsAscending(!isAscending);
        setDetail(sortByExpiredDate(detail, !isAscending));
    };

    // Fetch storage data from MongoDB
    const fetchStorageData = async () => {
        (true);
        try {
            const response = await api.post('/data', {
                collection: "storage",
                filter: {},
                sort: {}
            })
            const formattedData = response.data.map(item => ({
                ...item,
                label: item.name,
                value: item.name
            }));
            setData(formattedData);
            setInit(true);
        } catch (error) {
            console.error('Error fetching storage data:', error);
            // Swal.fire('Error', 'Gagal memuat data storage', 'error');
        } finally {
            (false);
        }
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
                        await api.post("/data/add", {
                            collection: "storageLog",
                            data: {
                                name: hapus?.name,
                                stok: "-",
                                comment: `Hapus data ${hapus?.name}`,
                                expired: "",
                                event: "delete",
                                createdAt: moment().format().toString(),
                                createdBy: currentUser.name ? currentUser.name : currentUser.username,
                                storageId: hapus?._id
                            }
                        });
                        await api.delete("/data/delete", {
                            data: {
                                collection: "storage",
                                filter: { _id: hapus?._id }
                            }
                        });

                        setRefresh(!refresh)
                        Swal.fire({
                            title: "Deleted!",
                            text: "Data berhasil dihapus",
                            icon: "success"
                        });
                        fetchStorageData(); // Refresh data
                    } catch (error) {
                        console.error('Error deleting data:', error);
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

    useEffect(() => {
        if (action === "edit") {
            setExpired(edit?.expired || moment().add(7, "days").format("YYYY-MM-DD").toString());
        }
    }, [action, edit]);

    useEffect(() => {
        fetchStorageData();
    }, [refresh]);

    const tambahItem = async (e) => {
        e.preventDefault();
        setLoading(true)
        console.log(nama)
        console.log(tipe)
        const tmpData = {
            name: nama.label,
            tipe,
            stok: tipe === "qty" ? Number(stok) : Number(berat),
            comment,
            harga,
            expired,
            event: "add",
            createdAt: moment().format().toString(),
            createdBy: currentUser.name ? currentUser.name : currentUser.username
        }
        if (nama?._id) tmpData.storageId = nama?._id
        try {
            if (nama?._id) {
                var matchExpired = false
                var storageData = data.find((s) => s._id === nama?._id)
                var updatedStok = storageData?.stok.map(s => {
                    if (s.expired === expired) {
                        matchExpired = true
                        if (Number(s.harga) === Number(harga) && tipe === "qty") return { ...s, qty: Number(s.qty) + Number(stok) }; // update qty
                        else if (tipe === "berat") return { ...s, berat: Number(s.berat) + Number(berat) }; // update qty
                    }
                    return s; // tetap
                });
                console.log(updatedStok)

                await api.put("/data/update", {
                    collection: "storage",
                    filter: { _id: nama?._id },
                    update: {
                        $push: !matchExpired ?
                            (tipe === "qty" ? {
                                stok: {
                                    expired,
                                    harga,
                                    qty: Number(stok),
                                }
                            } :
                                {
                                    stok: {
                                        expired,
                                        harga,
                                        berat: Number(berat),
                                    }
                                }) : {},
                        $set: matchExpired ? {
                            stok: updatedStok
                        } : {},
                        updatedAt: moment().format().toString(),
                    }
                });
                await api.post("/data/add", {
                    collection: "storageLog",
                    data: {
                        ...tmpData,
                        storageId: nama?._id
                    }
                });
            } else {
                if (tipe === "qty") {
                    const response = await api.post("/data/add", {
                        collection: "storage",
                        data: {
                            name: nama?.value,
                            stok: [{
                                expired,
                                harga,
                                qty: Number(stok),
                            }],
                            tipe,
                            createdAt: moment().format().toString(),
                        }
                    });
                    await api.post("/data/add", {
                        collection: "storageLog",
                        data: {
                            ...tmpData,
                            storageId: response.data.newData._id
                        }
                    });

                } else {
                    const response = await api.post("/data/add", {
                        collection: "storage",
                        data: {
                            name: nama?.value,
                            stok: [{
                                expired,
                                harga,
                                berat: Number(berat),
                            }],
                            tipe,
                            createdAt: moment().format().toString(),
                        }
                    });
                    await api.post("/data/add", {
                        collection: "storageLog",
                        data: {
                            ...tmpData,
                            storageId: response.data.newData._id
                        }
                    });
                }

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

    const updateItem = async (e) => {
        e.preventDefault();
        setLoading(true)

        const data = {
            storageId: detail?._id,
            name: detail?.name,
            stok: Number(stok),
            comment: comment,
            expired: expired,
            event: Number(stok) === 0 ? "delete" : "update",
            createdAt: moment().format().toString(),
            createdBy: currentUser.name ? currentUser.name : currentUser.username
        }
        try {
            if (detail?._id) {
                var updatedStok = detail?.stok.map(s => {
                    if (s.expired === expired) {
                        return { ...s, qty: Number(stok) }; // update qty
                    }
                    return s; // tetap
                });

                // Hapus kalau qty = 0
                updatedStok = updatedStok.filter(s => s.qty > 0);
                await api.put("/data/update", {
                    collection: "storage",
                    filter: { _id: detail?._id },
                    update: {
                        $set: {
                            stok: updatedStok,
                            updatedAt: moment().format().toString(),
                        }
                    }
                });
                await api.post("/data/add", {
                    collection: "storageLog",
                    data: {
                        ...data,
                        storageId: nama?._id
                    }
                });
            }
            else {
                throw new Error("Data barang tidak ditemukan")
            }
            // else {
            //     const response = await api.post("/data/add", {
            //         collection: "storage",
            //         data: {
            //             name: nama?.value,
            //             stok: [{
            //                 expired: expired,
            //                 qty: Number(stok),
            //             }],
            //             createdAt: moment().format().toString(),
            //         }
            //     });

            //     await api.post("/data/add", {
            //         collection: "storageLog",
            //         data: {
            //             ...data,
            //             storageId: response.data.newData._id
            //         }
            //     });
            // }

            setRefresh(!refresh)

            Swal.fire({
                title: "Updated!",
                text: "Data berhasil diperbarui",
                icon: "success"
            });
        } catch (error) {
            console.log(error)
            Swal.fire({
                title: "Error!",
                text: "Gagal memperbarui data",
                icon: "error"
            });
        }
        setLoading(false)
        setVisible(false)
    }

    const createOption = (label) => ({
        label,
        // value: label.toLowerCase().replace(/\W/g, ''),
        value: label.toLowerCase(),
    });

    const loadOption = (inputValue, callback) => {
        const options = [{ options: data }]
        // const options = [];
        // console.log(options)
        callback(options)
    }

    const filterOption = (option, inputValue) => {
        if (option?.value) return option?.value?.includes(inputValue)
        else return
    }

    const isOptionUnique = (inputValue) => {
        // Check if the option already exists
        return !data.some(
            (option) => option.label.toLowerCase().includes(inputValue.toLowerCase())
        );
    };

    const handleCreate = async (inputValue) => {
        setTimeout(() => {
            const newOption = createOption(inputValue);
            // setOptions((prev) => [...prev, newOption]);
            setNama(newOption);
        }, 1000);
    };

    const renderModal = () => {
        switch (action) {
            case "add":
                return (
                    <>
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
                                    <CFormLabel className="col-sm-2 col-form-label">Tipe Stok</CFormLabel>
                                    <CCol sm={10}>
                                        <CFormSelect value={tipe} onChange={(e) => setTipe(e.target.value)}>
                                            <option value="" disabled>Pilih Tipe Stok</option>
                                            <option value="qty">Kuantitas</option>
                                            <option value="berat">Berat</option>
                                        </CFormSelect>
                                    </CCol>
                                </CRow>

                                {tipe === "qty" && <CRow className="mb-3">
                                    <CFormLabel className="col-sm-2 col-form-label">Qty</CFormLabel>
                                    <CCol sm={10}>
                                        <CFormInput type="number" min={1} value={stok} onChange={(e) => { setStok(e.target.value) }} />
                                    </CCol>
                                </CRow>}
                                {tipe === "berat" && <CRow className="mb-3">
                                    <CFormLabel className="col-sm-2 col-form-label">Berat (gram)</CFormLabel>
                                    <CCol sm={10}>
                                        <CFormInput type="number" min={1} value={berat} onChange={(e) => { setBerat(e.target.value) }} />
                                    </CCol>
                                </CRow>}
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
                                    <CFormLabel className="col-sm-2 col-form-label">Harga</CFormLabel>
                                    <CCol sm={10}>
                                        <CFormInput type="text"
                                            placeholder="Input Harga"
                                            onChange={(e) => {
                                                // if (/^\d*$/.test(e.target.value)) setHarga(e.target.value)
                                                setHarga(e.target.value.replace(/,/g, ""))
                                            }}
                                            value={formatNumber(harga)}
                                        />
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
                            {!loading ? <CButton color="success" onClick={tambahItem}>Tambah</CButton>
                                : <CSpinner color="primary" className="float-end" variant="grow" />}
                        </CModalFooter>
                    </>
                );
            case "edit":
                return (
                    <>
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
                                <CRow className="mb-3">
                                    <CFormLabel className="col-sm-2 col-form-label">Berat (gram)</CFormLabel>
                                    <CCol sm={10}>
                                        <CFormInput type="number" min={1} max={edit?.berat} value={berat} onChange={(e) => { setBerat(e.target.value) }} />
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
                            <CButton color="primary" onClick={() => { setAction("detail"); setVisible(true) }}>← Kembali</CButton>
                            <CButton color="warning" onClick={updateItem}>Update</CButton>
                            <CButton color="danger" onClick={() => { setVisible(false) }}>Tutup</CButton>
                        </CModalFooter>
                    </>
                );
            case "detail":
                return (
                    <>
                        <CModalHeader>
                            <CModalTitle id="actionModal">Detail Stok - {detail?.name}</CModalTitle>
                        </CModalHeader>
                        <CModalBody>
                            <CTable align="middle" className="mb-3 border" hover responsive striped>
                                <CTableHead className="text-nowrap">
                                    <CTableRow>
                                        <CTableHeaderCell className="bg-body">#</CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body">{detail?.tipe === "qty" ? "Qty" : "Berat (gr)"}</CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body">Harga</CTableHeaderCell>
                                        <CTableHeaderCell onClick={handleSort} className="bg-body">Expired {isAscending ? "↑" : "↓"}</CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body">Action</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {detail?.stok?.length > 0 ? detail.stok.map((data, idx) => (
                                        <CTableRow key={idx}>
                                            <CTableDataCell>{idx + 1}</CTableDataCell>
                                            <CTableDataCell>{data?.qty}</CTableDataCell>
                                            <CTableDataCell>{data?.harga}</CTableDataCell>
                                            <CTableDataCell>{moment(data?.expired).format("DD MMMM YYYY")}</CTableDataCell>
                                            <CTableDataCell>
                                                <CButton className='me-2' size="sm" color="warning"
                                                    onClick={() => {
                                                        setEdit(data);
                                                        setAction("edit");
                                                        setIndex(idx);
                                                        setVisible(true)
                                                    }}>
                                                    <CIcon icon={cilPencil} /> Edit
                                                </CButton>
                                            </CTableDataCell>
                                        </CTableRow>
                                    )) : (
                                        <CTableRow>
                                            <CTableDataCell colSpan={8}>
                                                <h4 style={{ textAlign: "center", color: "#9f9f9f" }}>Data tidak ditemukan</h4>
                                            </CTableDataCell>
                                        </CTableRow>
                                    )}
                                </CTableBody>
                            </CTable>
                        </CModalBody>
                        <CModalFooter>
                            <CButton color="danger" onClick={() => { setVisible(false) }}>Tutup</CButton>
                        </CModalFooter>
                    </>
                );
            default:
                return (
                    <>
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
                                <CFormSelect value={tipe} onChange={(e) => setTipe(e.target.value)}>
                                    <option value="" disabled>Pilih Tipe Stok</option>
                                    <option value="qty">Kuantitas</option>
                                    <option value="berat">Berat</option>
                                </CFormSelect>
                                {tipe === "qty" && <CRow className="mb-3">
                                    <CFormLabel className="col-sm-2 col-form-label">Qty</CFormLabel>
                                    <CCol sm={10}>
                                        <CFormInput type="number" min={1} value={stok} onChange={(e) => { setStok(e.target.value) }} />
                                    </CCol>
                                </CRow>}
                                {tipe === "berat" && <CRow className="mb-3">
                                    <CFormLabel className="col-sm-2 col-form-label">Berat (gram)</CFormLabel>
                                    <CCol sm={10}>
                                        <CFormInput type="number" min={1} value={berat} onChange={(e) => { setBerat(e.target.value) }} />
                                    </CCol>
                                </CRow>}
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
                                    <CFormLabel className="col-sm-2 col-form-label">Harga</CFormLabel>
                                    <CCol sm={10}>
                                        <CFormInput type="text"
                                            placeholder="Input Harga"
                                            onChange={(e) => {
                                                // if (/^\d*$/.test(e.target.value)) setHarga(e.target.value)
                                                setHarga(e.target.value.replace(/,/g, ""))
                                            }}
                                            value={formatNumber(harga)}
                                        />
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
                            {!loading ? <CButton color="success" onClick={tambahItem}>Tambah</CButton>
                                : <CSpinner color="primary" className="float-end" variant="grow" />}
                        </CModalFooter>
                    </>
                );
        }
    };

    return (
        <Suspense
            fallback={
                <div className="pt-3 text-center">
                    <CSpinner color="primary" variant="grow" />
                </div>
            }
        >
            <AppTable
                title={"Management Storage"}
                column={[
                    { name: "#", key: "index" },
                    { name: "Nama Item", key: "name" },
                    { name: "Total Stok", key: "totalStok" },
                    { name: "Harga", key: "harga" },
                    { name: "Expired", key: "expiredStok" },
                    { name: "Action", key: "action" }
                ]}
                sortDesc={true}
                collection="storage" // Use the MongoDB endpoint
                filter={{}} // Empty filter by default
                sort={{ createdAt: -1 }} // Sort by newest first
                isSort={true}
                crudAction={[{ name: "Tambah Item", key: "add" }]}
                listStatus={[{ name: "LISTED", color: "success" }, { name: "ARCHIVE", color: "secondary" }]}
                refresh={refresh}
                setAction={setAction}
                setVisible={setVisible}
                setDetail={setDetail}
                setParentData={setData}
                setEdit={setEdit}
                setHapus={setHapus}
            />
            <CModal
                size="lg"
                scrollable
                alignment='center'
                visible={visible}
                onClose={() => {
                    setNama("");
                    setHarga(0);
                    setDetail("");
                    setStok(0);
                    setStatus("");
                    setVisible(false);
                    setAction(null);
                }}
                aria-labelledby="actionModal"
            >
                {renderModal()}
            </CModal>
        </Suspense>
    );
};

export default StorageList;