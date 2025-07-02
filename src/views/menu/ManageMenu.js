import { cilMediaStop, cilPencil, cilPrint } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CBadge, CButton, CCard, CCardBody, CCardHeader, CCardImage, CCol, CContainer, CFormInput, CFormLabel, CFormSelect, CHeader, CInputGroup, CInputGroupText, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CPagination, CPaginationItem, CProgress, CRow, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import ReactToPrint from "react-to-print";
// import { firestore } from '../../Firebase';
// import { collection, getDocs, onSnapshot, addDoc, setDoc, doc, query, where, orderBy, deleteDoc } from 'firebase/firestore';
import Swal from 'sweetalert2'
import AppTable from '../../components/AppTable';
import { formatNumber } from 'chart.js/helpers';
import api from '../../axiosInstance';
import ReactSelectCreatable from 'react-select/creatable';
import ReactSelectAsyncCreatable from 'react-select/async-creatable';
import axios from 'axios';

const ManageMenu = () => {

    const [refresh, setRefresh] = useState(false)
    const [action, setAction] = useState(null)
    const [visible, setVisible] = useState(false)
    const [hargaModal, setHargaModal] = useState(0)
    const [hargaJual, setHargaJual] = useState(0)
    const [photo, setPhoto] = useState(null);
    const [category, setCategory] = useState(null);
    const [addOns, setAddOns] = useState([]);


    const [initCategory, setInitCategory] = useState(false)
    const [categoryOptions, setCategoryOptions] = useState([])

    const [data, setData] = useState([])
    const [nama, setNama] = useState("")
    const [stok, setStok] = useState("")
    const [label, setLabel] = useState("")
    const [status, setStatus] = useState("")

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
                                collection: "menu",
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
            setNama(edit?.name)
            setHargaJual(edit?.harga)
            setCategory(edit?.category)
            setLabel(edit?.label)
            // setStok(edit?.stok ? edit?.stok : 0)
            setStatus(edit?.status)
            setAddOns(edit?.addOns)
            // setPhoto(edit?.photoURL)
        }
    }, [action])

    const fetchMenuCategoryOption = async () => {
        try {
            const response = await api.post('/data', {
                collection: "menuCategory",
                filter: {},
                sort: { label: 1 }
            })
            setCategoryOptions(response.data);
        } catch (error) {
            console.error('Error fetching menu reports:', error);
            // Swal.fire('Error', 'Gagal memuat laporan menu', 'error');
        }
    };

    useEffect(() => {
        fetchMenuCategoryOption()
    }, [refresh])

    const handleUpload = async () => {
        const formData = new FormData()
        formData.append('foto', photo)
        console.log(photo)
        console.log(formData)

        try {
            const response = await axios.post('http://localhost:5000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // ini boleh diisi di axios
                },
            })
            console.log(response.data)
            if (response.data) return response.data.url
        } catch (err) {
            console.error(err)
            //   alert("Upload gagal")
        }
    }

    const tambahMenu = async (e) => {
        e.preventDefault();
        setVisible(false)
        const tmpAddOns = addOns.map((item) => {
            var tmpItem = { ...item }
            delete tmpItem.isNew
            return tmpItem
        })
        try {
            const photoURL = await handleUpload()
            const data = {
                name: nama,
                harga: hargaJual,
                category: category,
                addOns: tmpAddOns,
                photoURL: photo ? photoURL : "",
                label: label,
                createdAt: moment().format().toString(),
                // stok: stok,
                status: "LISTED"
            }
            try {
                await api.post("/data/add", {
                    collection: "menu",
                    data: data
                });

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

            if (category?._id === undefined)
                try {
                    await api.post("/data/add", {
                        collection: "menuCategory",
                        data: category
                    });

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
            setRefresh(!refresh)
            Swal.fire({
                title: "Success!",
                text: "Berhasil menambahkan data baru",
                icon: "success"
            });
        } catch (err) {
            console.log(err)
            Swal.fire({
                title: "Error!",
                text: "Gagal menambahkan data baru",
                icon: "error"
            });
        }
    }

    const updateMenu = async (e) => {
        e.preventDefault();
        setVisible(false)
        const tmpAddOns = addOns.map((item) => {
            var tmpItem = { ...item }
            delete tmpItem.isNew
            return tmpItem
        })
        try {
            var dataForm = {
                harga: hargaJual,
                name: nama,
                category: category,
                // stok: stok,
                label:label,
                addOns: tmpAddOns,
                status: status,
            }
            if (photo) {
                const photoRef = handleUpload()
                // dataForm = { ...dataForm, photoURL: photoURL }
                dataForm = { ...dataForm, photoURL: photoURL }
            }
            try {
                await api.put("/data/update", {
                    collection: "menu",
                    filter: { _id: edit._id },
                    update: dataForm
                });
                if (category?._id === undefined)
                    try {
                        await api.post("/data/add", {
                            collection: "menuCategory",
                            data: category
                        });

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
            setRefresh(!refresh)
            Swal.fire({
                title: "Updated!",
                text: "Data berhasil diperbarui",
                icon: "success"
            });
        } catch (err) {
            Swal.fire({
                title: "Error!",
                text: "Data gagal diperbarui",
                icon: "error"
            });
        }
    }

    const handlePhotoChange = (e) => {
        console.log(e.target.files[0])
        if (e.target.files[0]) {
            setPhoto(e.target.files[0]);
        }
    };
    const createOption = (label) => ({
        label,
        value: label.toLowerCase().replace(/\W/g, ''),
    });

    const loadOption = (inputValue, callback) => {
        const options = categoryOptions
        // const options = [];
        // // console.log(options)
        callback(options)
    }

    const filterOption = (option, inputValue) => {
        return option?.value.includes(inputValue)
    }

    const isOptionUnique = (inputValue) => {
        // Check if the option already exists
        return !categoryOptions.some(
            (option) => option.label.toLowerCase().includes(inputValue.toLowerCase())
        );
    };

    const handleCreate = async (inputValue) => {
        (true);
        setTimeout(() => {
            const newOption = createOption(inputValue);
            (false);
            // setOptions((prev) => [...prev, newOption]);
            setCategory(newOption);
        }, 1000);
    };
    const renderModal = () => {
        switch (action) {
            case "add":
                return <>
                    <CModalHeader>
                        <CModalTitle id="actionModal">Tambah Menu</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <CContainer>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-2 col-form-label">Nama Menu</CFormLabel>
                                <CCol sm={10}>
                                    <CFormInput type="text" placeholder="Input Nama Menu" onChange={(e) => setNama(e.target.value)} defaultValue={nama} />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-2 col-form-label">Kategori</CFormLabel>
                                <CCol sm={10}>
                                    <ReactSelectAsyncCreatable
                                        defaultOptions
                                        loadOptions={loadOption}
                                        styles={customStyles}

                                        filterOption={filterOption}
                                        menuPortalTarget={document.body}
                                        onChange={(newValue) => setCategory(newValue)}
                                        onCreateOption={handleCreate}

                                        value={category}
                                        placeholder="Pilih Kategori" />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-2 col-form-label">Harga</CFormLabel>
                                <CCol sm={10}>
                                    <CFormInput type="text"
                                        placeholder="Input Harga"
                                        onChange={(e) => {
                                            // if (/^\d*$/.test(e.target.value)) setHarga(e.target.value)
                                            setHargaJual(e.target.value.replace(/,/g, ""))
                                        }}
                                        value={formatNumber(hargaJual)}
                                    />
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
                                <CFormLabel className="col-sm-2 col-form-label">Foto Menu</CFormLabel>
                                <CCol sm={10}>
                                    <CFormInput
                                        type="file"
                                        accept="image/*"
                                        // capture="environment"
                                        onChange={handlePhotoChange}
                                        required
                                    />
                                </CCol>
                            </CRow>
                        </CContainer>
                        <CContainer className='mt-3'>
                            <hr />
                            <h4 style={{ textAlign: "center" }}>List Add Ons</h4>
                            <hr />
                            <CTable>
                                <CTableHead>
                                    <CTableRow>
                                        <CTableHeaderCell style={{ width: "110px" }}>Action</CTableHeaderCell>
                                        <CTableHeaderCell style={{ width: "400px" }}>Nama</CTableHeaderCell>
                                        <CTableHeaderCell>Harga</CTableHeaderCell>
                                        {/* <CTableHeaderCell>Sub Total</CTableHeaderCell> */}
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {addOns?.map((item, idx) => {
                                        // // console.log(item)
                                        return (
                                            <CTableRow key={idx}>
                                                {(
                                                    <CTableDataCell>
                                                        {item?.isNew && (
                                                            <CButton color='danger' className='me-1' onClick={() => {
                                                                var tmpOrder = [...addOns]
                                                                tmpOrder?.splice(idx, 1)
                                                                // // console.log(tmpOrder)
                                                                setAddOns(tmpOrder)
                                                            }}>✗</CButton>
                                                        )}
                                                    </CTableDataCell>
                                                )}
                                                {
                                                    item?.isNew &&
                                                    <>
                                                        <CTableDataCell>
                                                            <CFormInput type="text"
                                                                value={item?.name}
                                                                onChange={(e) => {
                                                                    var tmpItem = [...addOns]
                                                                    tmpItem[idx].name = e.target.value
                                                                    setAddOns(tmpItem)
                                                                }}
                                                                placeholder='Input add-on' />
                                                        </CTableDataCell>
                                                        {/* <CTableDataCell><CFormInput type="text" value={formatNumber(item?.harga)} readOnly plainText /></CTableDataCell> */}
                                                        <CTableDataCell><CFormInput type="text"
                                                            value={formatNumber(item?.harga)}
                                                            onChange={(e) => {
                                                                var tmpItem = [...addOns]
                                                                if (/^\d*$/.test(e.target.value)) {
                                                                    tmpItem[idx].harga = e.target.value.replace(/,/g, "")
                                                                    setAddOns(tmpItem)
                                                                }
                                                            }}
                                                        /></CTableDataCell>
                                                    </>
                                                }

                                            </CTableRow>
                                        )
                                    })}
                                    {<CTableRow>
                                        <CTableDataCell colSpan={4} ><CButton color='success' onClick={() => {
                                            var tmpOrder = [...addOns]
                                            tmpOrder?.push({ harga: 0, name: "", isNew: true })
                                            // console.log(tmpOrder)
                                            setAddOns(tmpOrder)
                                        }}>+</CButton></CTableDataCell>
                                    </CTableRow>}
                                </CTableBody>
                            </CTable>
                        </CContainer>
                    </CModalBody>

                    <CModalFooter>
                        <CButton color="success" onClick={(e) => { tambahMenu(e) }}>Tambah</CButton>
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
                                    <CFormInput type="text" placeholder="Input Nama Menu" onChange={(e) => setNama(e.target.value)} defaultValue={nama} />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-2 col-form-label">Kategori</CFormLabel>
                                <CCol sm={10}>
                                    <ReactSelectAsyncCreatable
                                        defaultOptions
                                        loadOptions={loadOption}
                                        styles={customStyles}
                                        menuPortalTarget={document.body}
                                        onChange={(newValue) => setCategory(newValue)}
                                        onCreateOption={handleCreate}
                                        value={category}
                                        placeholder="Pilih Kategori" />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-2 col-form-label">Harga</CFormLabel>
                                <CCol sm={10}>
                                    <CFormInput type="text"
                                        placeholder="Input Harga"
                                        onChange={(e) => {
                                            // if (/^\d*$/.test(e.target.value)) setHarga(e.target.value)
                                            setHargaJual(e.target.value.replace(/,/g, ""))
                                        }}
                                        value={formatNumber(hargaJual)}
                                    />
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
                                <CFormLabel className="col-sm-2 col-form-label">Foto Menu</CFormLabel>
                                <CCol sm={10}>
                                    <CFormInput
                                        type="file"
                                        accept="image/*"
                                        // capture="environment"
                                        onChange={handlePhotoChange}
                                        required
                                    />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-2 col-form-label">Status</CFormLabel>
                                <CCol sm={10}>
                                    <CFormSelect options={['LISTED', 'ARCHIVE']} value={status} onChange={(e) => setStatus(e.target.value)} />
                                </CCol>
                            </CRow>
                        </CContainer>
                        <CContainer className='mt-3'>
                            <hr />
                            <h4 style={{ textAlign: "center" }}>List Add Ons</h4>
                            <hr />
                            <CTable>
                                <CTableHead>
                                    <CTableRow>
                                        <CTableHeaderCell style={{ width: "110px" }}>Action</CTableHeaderCell>
                                        <CTableHeaderCell style={{ width: "400px" }}>Nama</CTableHeaderCell>
                                        <CTableHeaderCell>Harga</CTableHeaderCell>
                                        {/* <CTableHeaderCell>Sub Total</CTableHeaderCell> */}
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {addOns?.map((item, idx) => {
                                        // // console.log(item)
                                        return (
                                            <CTableRow key={idx}>
                                                {(
                                                    <CTableDataCell>
                                                        {(item?.isNew || edit !== null) && (
                                                            <CButton color='danger' className='me-1' onClick={() => {
                                                                var tmpOrder = [...addOns]
                                                                tmpOrder?.splice(idx, 1)
                                                                // // console.log(tmpOrder)
                                                                setAddOns(tmpOrder)
                                                            }}>✗</CButton>
                                                        )}
                                                    </CTableDataCell>
                                                )}
                                                {
                                                    (item?.isNew || edit !== null) &&
                                                    <>
                                                        <CTableDataCell>
                                                            <CFormInput type="text"
                                                                value={item?.name}
                                                                onChange={(e) => {
                                                                    var tmpItem = [...addOns]
                                                                    tmpItem[idx].name = e.target.value
                                                                    setAddOns(tmpItem)
                                                                }}
                                                                placeholder='Input add-on' />
                                                        </CTableDataCell>
                                                        {/* <CTableDataCell><CFormInput type="text" value={formatNumber(item?.harga)} readOnly plainText /></CTableDataCell> */}
                                                        <CTableDataCell><CFormInput type="text"
                                                            value={formatNumber(item?.harga)}
                                                            onChange={(e) => {
                                                                var tmpItem = [...addOns]
                                                                if (/^\d*$/.test(e.target.value)) {
                                                                    tmpItem[idx].harga = e.target.value.replace(/,/g, "")
                                                                    setAddOns(tmpItem)
                                                                }
                                                            }}
                                                        /></CTableDataCell>
                                                    </>
                                                }

                                            </CTableRow>
                                        )
                                    })}
                                    {<CTableRow>
                                        <CTableDataCell colSpan={4} ><CButton color='success' onClick={() => {
                                            var tmpOrder = [...addOns]
                                            tmpOrder?.push({ harga: 0, name: "", isNew: true })
                                            // console.log(tmpOrder)
                                            setAddOns(tmpOrder)
                                        }}>+</CButton></CTableDataCell>
                                    </CTableRow>}
                                </CTableBody>
                            </CTable>
                        </CContainer>
                    </CModalBody>

                    <CModalFooter>
                        <CButton color="success" onClick={(e) => { updateMenu(e) }}>Ubah</CButton>
                    </CModalFooter>
                </>
        }
    }
    return (
        <>
            <AppTable
                title={"Management Menu F&B"}
                column={[
                    { name: "#", key: "index" },
                    { name: "Nama Item", key: "name" },
                    { name: "Gambar", key: "photoURL" },
                    { name: "Category", key: "category" },
                    // { name: "Stok", key: "stok" },
                    { name: "Harga", key: "harga" },
                    { name: "Label", key: "label" },
                    { name: "Status", key: "status" },
                    { name: "Action", key: "action" }
                ]}
                // headers={['#', 'Nama Customer', 'Status', 'Booking', 'Created At', 'Action']}
                collection={"menu"} // Ambil data dari koleksi "cashiers"
                filter={{}} // Bisa diberikan filter
                sort={{ createdAt: -1 }} // Sortir dari terbaru
                crudAction={[{ name: "Tambah Menu", key: "add" }]}
                listStatus={[{ name: "LISTED", color: "success" }, { name: "ARCHIVE", color: "secondary" }]}
                refresh={refresh}
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
                onClose={() => { setNama(""); setHargaModal(0); setLabel(""); setCategory(null); setStok(""); setHargaJual(0); setStatus(""); setVisible(false); setAction(null); }}
                aria-labelledby="actionModal"
            >
                {renderModal()}
            </CModal>

        </>
    )
}

export default ManageMenu