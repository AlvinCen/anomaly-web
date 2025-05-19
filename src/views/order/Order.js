import { cilMediaStop, cilPencil, cilPrint } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CBadge, CButton, CCard, CCardBody, CCardHeader, CCardImage, CCol, CCollapse, CContainer, CFormCheck, CFormInput, CFormLabel, CFormSelect, CFormSwitch, CHeader, CInputGroup, CInputGroupText, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CPagination, CPaginationItem, CProgress, CRow, CSpinner, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import moment from 'moment';
import React, { Suspense, useEffect, useRef, useState } from 'react'
// import { firestore } from '../../Firebase';
// import { collection, getDocs, onSnapshot, addDoc, setDoc, doc, query, where, orderBy, deleteDoc, writeBatch } from 'firebase/firestore';
import Swal from 'sweetalert2'
import AppTable from '../../components/AppTable';
import { formatNumber } from 'chart.js/helpers';
import Select, { components } from 'react-select';
import ReactSelectAsync from 'react-select/async';
import PropTypes from 'prop-types';


const Order = () => {
    const [loading, setLoading] = useState(false);
    const [action, setAction] = useState(null)
    const [visible, setVisible] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const [modal, setModal] = useState(false)

    const [meja, setMeja] = useState([])
    const [status, setStatus] = useState("")

    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [data, setData] = useState([])
    const [item, setItem] = useState([])
    const [menu, setMenu] = useState([])
    const [table, setTable] = useState([])
    const [merch, setMerch] = useState([])
    const [tableOptions, setTableOptions] = useState([])
    const [menuOptions, setMenuOptions] = useState([])
    const [merchOptions, setMerchOptions] = useState([])
    const [detail, setDetail] = useState([])

    const [filterValue, setFilterValue] = useState("")
    const [nama, setNama] = useState("")

    const [edit, setEdit] = useState({});
    const [hapus, setHapus] = useState({});
    const [initMerch, setInitMerch] = useState(false)
    const [initMenu, setInitMenu] = useState(false)
    const [initTable, setInitTable] = useState(false)
    const [trigger, setTrigger] = useState(false)

    // Custom styles for react-select to mimic CoreUI's CFormSelect
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

    const columnDetail = [
        { label: "Nama Customer", key: "client" },
        { label: "Tipe Order / Table", key: "table" },
        { label: "Data Dibuat Tanggal", key: "createdAt" }]

    const createOption = (label) => ({
        label,
        value: label?.toLowerCase().replace(/\W/g, ''),
    });

    // useEffect(() => {
    //     if (Object.keys(hapus).length > 0) {
    //         Swal.fire({
    //             title: "Konfirmasi",
    //             html: `<p>Apakah anda yakin menghapus data <b>${hapus?.id}</b>?</p>`,
    //             icon: "warning",
    //             showCancelButton: true,
    //             confirmButtonColor: "#3085d6",
    //             cancelButtonColor: "#d33",
    //             confirmButtonText: "Ya",
    //             cancelButtonText: "Batal"
    //         }).then(async (result) => {
    //             if (result.isConfirmed) {
    //                 await deleteDoc(doc(firestore, "order", hapus?.id))
    //                     .then(() => {
    //                         // Lakukan apa yang perlu dilakukan setelah data berhasil ditambahkan
    //                         Swal.fire({
    //                             title: "Canceled!",
    //                             text: "Data berhasil dihapus",
    //                             icon: "success"
    //                         });
    //                     })
    //                     .catch((error) => {
    //                         Swal.fire({
    //                             title: "Failed!",
    //                             text: "Data gagal dihapus",
    //                             icon: "error"
    //                         });
    //                         console.error('Error menambahkan data: ', error);
    //                     });
    //             }
    //         })
    //         setHapus({})
    //     }

    // }, [hapus])

    // useEffect(() => {
    //     const q = query(collection(firestore, "menu"), orderBy("name", "asc"))
    //     const unsubscribeInitMenu = onSnapshot(q, { includeMetadataChanges: true, source: 'cache' }, async (snapshot) => {
    //         // var tmpData = [...data];
    //         var tmpData = []
    //         var tmpOptions = []
    //         const source = snapshot.metadata.fromCache ? "local cache" : "server";
    //         if (!initMenu) {
    //             snapshot.forEach((tmpDocs) => {
    //                 // console.log(tmpDocs.id)
    //                 const docData = { ...tmpDocs.data(), id: tmpDocs.id };
    //                 tmpData.push(docData);
    //                 tmpOptions.push({ value: tmpDocs.data()?.name, label: tmpDocs.data()?.name, harga: tmpDocs.data()?.harga })
    //             });
    //             console.log(tmpData)
    //             setMenuOptions(tmpOptions)
    //             setMenu(tmpData);
    //             setInitMenu(true);
    //         }
    //     });

    //     const unsubscribeMenu = onSnapshot(q, async (snapshot) => {
    //         // var tmpData = [...data];
    //         var tmpData = []
    //         var tmpOptions = []
    //         const source = snapshot.metadata.fromCache ? "local cache" : "server";
    //         // console.log(snapshot.metadata.hasPendingWrites)
    //         console.log(source)
    //         snapshot.forEach((tmpDocs) => {
    //             // console.log(tmpDocs.id)
    //             if (initMenu) {
    //                 const docData = { ...tmpDocs.data(), id: tmpDocs.id };
    //                 tmpData.push(docData);
    //                 tmpOptions.push({ value: tmpDocs.data()?.name, label: tmpDocs.data()?.name, harga: tmpDocs.data()?.harga })
    //             }
    //         });
    //         if (initMenu) {
    //             console.log(tmpData)
    //             setMenuOptions(tmpOptions)
    //             setMenu(tmpData);
    //         }
    //         // setInitTable(true);
    //     });

    //     return () => {
    //         unsubscribeMenu();
    //         unsubscribeInitMenu();
    //     };
    // }, [initMenu]);

    // useEffect(() => {
    //     const colRefTable = collection(firestore, "table");
    //     const unsubscribeInitTable = onSnapshot(colRefTable, { includeMetadataChanges: true, source: 'cache' }, async (snapshot) => {
    //         // var tmpData = [...data];
    //         var tmpData = []
    //         var tmpOptions = [{ value: "dine-in", label: "Dine In" }, { value: "takeaway", label: "Takeaway" }]
    //         const source = snapshot.metadata.fromCache ? "local cache" : "server";
    //         // console.log(snapshot.metadata.hasPendingWrites)
    //         console.log(source)
    //         if (!initTable) {
    //             snapshot.forEach((tmpDocs) => {
    //                 // console.log(tmpDocs.id)
    //                 const docData = { ...tmpDocs.data(), id: tmpDocs.id };
    //                 tmpData.push(docData);
    //                 if (tmpDocs.data()?.status === "AKTIF") tmpOptions.push({ value: tmpDocs.data()?.id, label: tmpDocs.data()?.name })
    //             });
    //             // console.log(tmpData)
    //             // console.log(tmpOptions)
    //             setTableOptions(tmpOptions)
    //             setTable(tmpData);
    //             setInitTable(true);
    //         }
    //     });

    //     const unsubscribeTable = onSnapshot(colRefTable, async (snapshot) => {
    //         // var tmpData = [...data];
    //         var tmpData = []
    //         var tmpOptions = [{ value: "dine-in", label: "Dine In" }, { value: "takeaway", label: "Takeaway" }]
    //         const source = snapshot.metadata.fromCache ? "local cache" : "server";
    //         // console.log(snapshot.metadata.hasPendingWrites)
    //         // console.log(source)
    //         snapshot.forEach((tmpDocs) => {
    //             // console.log(tmpDocs.id)
    //             if (initTable) {
    //                 const docData = { ...tmpDocs.data(), id: tmpDocs.id };
    //                 tmpData.push(docData);
    //                 if (tmpDocs.data()?.status === "AKTIF") tmpOptions.push({ value: tmpDocs.data()?.id, label: tmpDocs.data()?.name })
    //             }
    //         });
    //         if (initTable) {
    //             // console.log(tmpData)
    //             setTableOptions(tmpOptions)
    //             setTable(tmpData);
    //         }
    //         // setInitTable(true);
    //     });

    //     return () => {
    //         unsubscribeTable();
    //         unsubscribeInitTable();
    //     };
    // }, [initTable]);

    // useEffect(() => {
    //     if (action === "edit") {
    //         // setNama(edit?.name)
    //         // setHarga(edit?.harga)
    //     }
    // }, [action])

    // const handleChange = (selected) => {
    //     // Check if "Select All" option was selected
    //     setMeja(selected);
    // };

    // const tambahOrder = async (e) => {
    //     e.preventDefault();
    //     setLoading(true)
    //     const total = item?.reduce((total, item) => {
    //         return total + Number(item.harga * item.qty);
    //     }, 0)
    //     const tmpItem = item
    //         .filter(item => item.harga && item.name)
    //         .map(item => {
    //             var tmpItem = { ...item }
    //             delete tmpItem.isNew
    //             delete tmpItem.isEdit
    //             if (tmpItem.name && tmpItem.name.label) {
    //                 tmpItem.name = tmpItem.name.value;
    //             }
    //             return tmpItem;
    //         });
    //     const data = {
    //         client: nama,
    //         // table: meja?.label,
    //         item: tmpItem,
    //         total: total,
    //         createdAt: moment().format().toString(),
    //         status: "PAYMENT"
    //     }
    //     // console.log(data)
    //     try {
    //         // Menambahkan dokumen baru ke koleksi "order"
    //         const docRef = await addDoc(collection(firestore, "order"), data);
    //         console.log('Data berhasil ditambahkan');
    //         Swal.fire({
    //             title: "Success!",
    //             text: "Berhasil menambahkan data baru",
    //             icon: "success"
    //         });

    //     } catch (error) {
    //         console.error('Error menambahkan data: ', error);

    //         // Menampilkan pesan error
    //         Swal.fire({
    //             title: "Error!",
    //             text: "Gagal menambahkan data baru",
    //             icon: "error"
    //         });
    //     }
    //     setVisible(false)
    // }
    // const editOrder = async (e) => {
    //     e.preventDefault();
    //     setLoading(true)
    //     const total = edit?.item?.reduce((total, item) => {
    //         return total + Number(item.harga * item.qty);
    //     }, 0)
    //     const tmpItem = edit?.item
    //         .filter(item => item.harga && item.name)
    //         .map(item => {
    //             var tmpItem = { ...item }
    //             delete tmpItem.isNew
    //             delete tmpItem.isEdit
    //             if (tmpItem.name && tmpItem.name.label) {
    //                 tmpItem.name = tmpItem.name.value;
    //             }
    //             return tmpItem;
    //         });
    //     const data = {
    //         // client: nama,
    //         // table: meja?.label,
    //         item: tmpItem,
    //         total: total,
    //     }
    //     // console.log(data)
    //     try {
    //         // Menambahkan dokumen baru ke koleksi "order"
    //         const docRef = await setDoc(collection(firestore, "order"), data, { merge: true });
    //         console.log('Data berhasil ditambahkan');
    //         Swal.fire({
    //             title: "Success!",
    //             text: "Berhasil menambahkan data baru",
    //             icon: "success"
    //         });

    //     } catch (error) {
    //         console.error('Error menambahkan data: ', error);

    //         // Menampilkan pesan error
    //         Swal.fire({
    //             title: "Error!",
    //             text: "Gagal menambahkan data baru",
    //             icon: "error"
    //         });
    //     }
    //     setVisible(false)
    // }

    const renderModal = () => {
        switch (action) {
            case "add":
                return <>
                    <CModalHeader>
                        <CModalTitle id="actionModal">Tambah Order</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <CContainer>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-3 col-form-label">Nama Customer</CFormLabel>
                                <CCol sm={9}>
                                    <CFormInput type="text" placeholder="Input Nama Customer" onChange={(e) => setNama(e.target.value)} defaultValue={nama} />
                                </CCol>
                            </CRow>
                            {/* <CRow className="mb-3">
                                <CCol>
                                    <CInputGroup>
                                        <CFormLabel className="col-form-label">Pilih Table</CFormLabel>
                                    </CInputGroup>
                                </CCol>

                                <CCol sm={9}>
                                    <Select
                                        options={tableOptions}
                                        value={meja}
                                        placeholder="Pilih Table"
                                        styles={customStyles}
                                        menuPortalTarget={document.body}
                                        onChange={handleChange}
                                    />
                                    <CFormSelect defaultValue={meja} multiple={true} onChange={(e) => setMeja(e.target.value)} >
                                        <option value="" disabled>Pilih Table</option>
                                        <option value="all">Semua Table</option>
                                        {table.map((table) => {
                                            return (<option key={table.id} value={table.id}>
                                                {table.name}
                                            </option>)
                                        })} </CFormSelect>
                                </CCol>
                            </CRow> */}

                            <CRow className='mb-3'>
                                <hr />
                                <h4 style={{ textAlign: "center" }}>List Item</h4>
                                <hr />
                                <CTable>
                                    <CTableHead>
                                        <CTableRow>
                                            <CTableHeaderCell style={{ width: "50px" }}>Action</CTableHeaderCell>
                                            <CTableHeaderCell style={{ width: "100px" }}>Qty</CTableHeaderCell>
                                            <CTableHeaderCell style={{ width: "300px" }}>Item</CTableHeaderCell>
                                            <CTableHeaderCell>Sub Total</CTableHeaderCell>
                                        </CTableRow>
                                    </CTableHead>
                                    <CTableBody>
                                        {item?.map((data, idx) => {
                                            return (
                                                <CTableRow>
                                                    <CTableDataCell><CButton color='danger' onClick={() => {
                                                        var tmpItem = [...item]
                                                        tmpItem.splice(idx, 1)
                                                        console.log(tmpItem)
                                                        setItem(tmpItem)
                                                    }}>✗</CButton></CTableDataCell>
                                                    <CTableDataCell><CFormInput type="number" value={data?.qty} onChange={(e) => {
                                                        var tmpItem = [...item]
                                                        // console.log(JSON.parse(e.target.value))
                                                        tmpItem[idx].qty = e.target.value
                                                        setItem(tmpItem)
                                                    }} /></CTableDataCell>
                                                    <CTableDataCell>
                                                        <Select
                                                            styles={customStyles}
                                                            placeholder="Pilih Item"
                                                            value={data?.name}
                                                            options={menuOptions}
                                                            menuPortalTarget={document.body}
                                                            onChange={(selected) => {
                                                                var tmpItem = [...item];
                                                                tmpItem[idx].name = selected
                                                                tmpItem[idx].harga = selected?.harga
                                                                console.log(selected)
                                                                setItem(tmpItem);
                                                            }} />
                                                        {/* <option value="" disabled>Pilih Item</option>
                                                            {menu.map((menu) => {
                                                                return (<option key={menu?.name} value={JSON.stringify({ name: menu?.name, harga: menu?.harga })}>
                                                                    {menu?.name}
                                                                </option>)
                                                            })} */}
                                                    </CTableDataCell>
                                                    <CTableDataCell><CFormInput type="text" value={formatNumber(data?.harga * (data?.qty ? data?.qty : 1))} readOnly plainText /></CTableDataCell>
                                                </CTableRow>
                                            )
                                        })}
                                        <CTableRow>
                                            <CTableDataCell colSpan={5} ><CButton color='success' onClick={() => {
                                                var tmpItem = [...item]
                                                tmpItem.push({ qty: 1, harga: 0, name: "", id: "" })
                                                setItem(tmpItem)
                                            }}>+</CButton></CTableDataCell>
                                        </CTableRow>
                                        <CTableRow>
                                            <CTableDataCell colSpan={3} style={{ textAlign: "right" }}><b>Total</b></CTableDataCell>
                                            <CTableDataCell>{
                                                formatNumber(item?.reduce((total, item) => {
                                                    return total + Number(item.harga * item.qty);
                                                }, 0))
                                            }</CTableDataCell>
                                        </CTableRow>
                                    </CTableBody>
                                </CTable>
                            </CRow>
                        </CContainer>
                    </CModalBody>

                    <CModalFooter>
                        <CButton color="success" onClick={(e) => { tambahOrder(e) }}>Tambah</CButton>
                    </CModalFooter>
                </>
            case "edit":
                return <>
                    <CModalHeader>
                        <CModalTitle id="actionModal">Edit Order</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <CContainer>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-3 col-form-label">Nama Customer</CFormLabel>
                                <CCol sm={9}>
                                    <CFormInput type="text" value={edit?.client} readOnly plainText />
                                </CCol>
                            </CRow>

                            <CRow className='mb-3'>
                                <hr />
                                <h4 style={{ textAlign: "center" }}>List Item</h4>
                                <hr />
                                <CTable>
                                    <CTableHead>
                                        <CTableRow>
                                            <CTableHeaderCell style={{ width: "50px" }}>Action</CTableHeaderCell>
                                            <CTableHeaderCell style={{ width: "100px" }}>Qty</CTableHeaderCell>
                                            <CTableHeaderCell style={{ width: "300px" }}>Item</CTableHeaderCell>
                                            <CTableHeaderCell>Sub Total</CTableHeaderCell>
                                        </CTableRow>
                                    </CTableHead>
                                    <CTableBody>
                                        {edit?.item?.map((data, idx) => {
                                            return (
                                                <CTableRow>
                                                    <CTableDataCell><CButton color='danger' onClick={() => {
                                                        var tmpItem = [...edit?.item]
                                                        tmpItem.splice(idx, 1)
                                                        console.log(tmpItem)
                                                        setEdit({ ...edit, item: tmpItem })
                                                    }}>✗</CButton></CTableDataCell>
                                                    <CTableDataCell><CFormInput type="number" value={data?.qty} onChange={(e) => {
                                                        var tmpItem = [...edit?.item]
                                                        // console.log(JSON.parse(e.target.value))
                                                        tmpItem[idx].qty = e.target.value
                                                        setEdit({ ...edit, item: tmpItem })
                                                    }} /></CTableDataCell>
                                                    <CTableDataCell>
                                                        <Select
                                                            styles={customStyles}
                                                            placeholder="Pilih Item"
                                                            value={createOption(data?.name)}
                                                            options={menuOptions}
                                                            menuPortalTarget={document.body}
                                                            onChange={(selected) => {
                                                                var tmpItem = [...edit?.item];
                                                                tmpItem[idx].name = selected
                                                                tmpItem[idx].harga = selected?.harga
                                                                console.log(selected)
                                                                setEdit({ ...edit, item: tmpItem })
                                                            }} />
                                                        {/* <option value="" disabled>Pilih Item</option>
                                                {menu.map((menu) => {
                                                    return (<option key={menu?.name} value={JSON.stringify({ name: menu?.name, harga: menu?.harga })}>
                                                        {menu?.name}
                                                    </option>)
                                                })} */}
                                                    </CTableDataCell>
                                                    <CTableDataCell><CFormInput type="text" value={formatNumber(data?.harga * (data?.qty ? data?.qty : 1))} readOnly plainText /></CTableDataCell>
                                                </CTableRow>
                                            )
                                        })}
                                        <CTableRow>
                                            <CTableDataCell colSpan={5} ><CButton color='success' onClick={() => {
                                                var tmpItem = [...edit?.item]
                                                tmpItem.push({ qty: 1, harga: 0, name: "", id: "" })
                                                setEdit({ ...edit, item: tmpItem })
                                            }}>+</CButton></CTableDataCell>
                                        </CTableRow>
                                        <CTableRow>
                                            <CTableDataCell colSpan={3} style={{ textAlign: "right" }}><b>Total</b></CTableDataCell>
                                            <CTableDataCell>{
                                                formatNumber(edit?.item?.reduce((total, item) => {
                                                    return total + Number(item.harga * item.qty);
                                                }, 0))
                                            }</CTableDataCell>
                                        </CTableRow>
                                    </CTableBody>
                                </CTable>
                            </CRow>
                        </CContainer>
                    </CModalBody>

                    <CModalFooter>
                        {!loading ? <CButton color="success" onClick={(e) => { editOrder(e) }}>Update</CButton>
                            : <CSpinner color="primary" className="float-end" variant="grow" />}
                    </CModalFooter>
                </>
            default:
                return <>
                    <CModalHeader>
                        <CModalTitle id="actionModal">Tambah Order</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <CContainer>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-3 col-form-label">Nama Customer</CFormLabel>
                                <CCol sm={9}>
                                    <CFormInput type="text" placeholder="Input Nama Customer" onChange={(e) => setNama(e.target.value)} defaultValue={nama} />
                                </CCol>
                            </CRow>
                            {/* <CRow className="mb-3">
                                <CCol>
                                    <CInputGroup>
                                        <CFormLabel className="col-form-label">Pilih Table</CFormLabel>
                                    </CInputGroup>
                                </CCol>

                                <CCol sm={9}>
                                    <Select
                                        options={tableOptions}
                                        value={meja}
                                        placeholder="Pilih Table"
                                        styles={customStyles}
                                        menuPortalTarget={document.body}
                                        onChange={handleChange}
                                    />
                                    <CFormSelect defaultValue={meja} multiple={true} onChange={(e) => setMeja(e.target.value)} >
                                    <option value="" disabled>Pilih Table</option>
                                    <option value="all">Semua Table</option>
                                    {table.map((table) => {
                                        return (<option key={table.id} value={table.id}>
                                            {table.name}
                                        </option>)
                                    })} </CFormSelect>
                                </CCol>
                            </CRow> */}

                            <CRow className='mb-3'>
                                <hr />
                                <h4 style={{ textAlign: "center" }}>List Item</h4>
                                <hr />
                                <CTable>
                                    <CTableHead>
                                        <CTableRow>
                                            <CTableHeaderCell style={{ width: "50px" }}>Action</CTableHeaderCell>
                                            <CTableHeaderCell style={{ width: "100px" }}>Qty</CTableHeaderCell>
                                            <CTableHeaderCell style={{ width: "300px" }}>Item</CTableHeaderCell>
                                            <CTableHeaderCell>Sub Total</CTableHeaderCell>
                                        </CTableRow>
                                    </CTableHead>
                                    <CTableBody>
                                        {item?.map((data, idx) => {
                                            return (
                                                <CTableRow>
                                                    <CTableDataCell><CButton color='danger' onClick={() => {
                                                        var tmpItem = [...item]
                                                        tmpItem.splice(idx, 1)
                                                        console.log(tmpItem)
                                                        setItem(tmpItem)
                                                    }}>✗</CButton></CTableDataCell>
                                                    <CTableDataCell><CFormInput type="number" value={data?.qty} onChange={(e) => {
                                                        var tmpItem = [...item]
                                                        // console.log(JSON.parse(e.target.value))
                                                        tmpItem[idx].qty = e.target.value
                                                        setItem(tmpItem)
                                                    }} /></CTableDataCell>
                                                    <CTableDataCell>
                                                        <Select
                                                            styles={customStyles}
                                                            placeholder="Pilih Item"
                                                            value={data?.name}
                                                            options={menuOptions}
                                                            menuPortalTarget={document.body}
                                                            onChange={(selected) => {
                                                                var tmpItem = [...item];
                                                                tmpItem[idx].name = selected
                                                                tmpItem[idx].harga = selected?.harga
                                                                console.log(selected)
                                                                setItem(tmpItem);
                                                            }} />
                                                        {/* <option value="" disabled>Pilih Item</option>
                                                        {menu.map((menu) => {
                                                            return (<option key={menu?.name} value={JSON.stringify({ name: menu?.name, harga: menu?.harga })}>
                                                                {menu?.name}
                                                            </option>)
                                                        })} */}
                                                    </CTableDataCell>
                                                    <CTableDataCell><CFormInput type="text" value={formatNumber(data?.harga * (data?.qty ? data?.qty : 1))} readOnly plainText /></CTableDataCell>
                                                </CTableRow>
                                            )
                                        })}
                                        <CTableRow>
                                            <CTableDataCell colSpan={5} ><CButton color='success' onClick={() => {
                                                var tmpItem = [...item]
                                                tmpItem.push({ qty: 1, harga: 0, name: "" })
                                                setItem(tmpItem)
                                            }}>+</CButton></CTableDataCell>
                                        </CTableRow>
                                        <CTableRow>
                                            <CTableDataCell colSpan={4} style={{ textAlign: "right" }}><b>Total</b></CTableDataCell>
                                            <CTableDataCell>{
                                                formatNumber(item?.reduce((total, item) => {
                                                    return total + Number(item.harga * item.qty);
                                                }, 0))
                                            }</CTableDataCell>
                                        </CTableRow>
                                    </CTableBody>
                                </CTable>
                            </CRow>
                        </CContainer>
                    </CModalBody>

                    <CModalFooter>
                        {!loading ? <CButton color="success" onClick={(e) => { tambahOrder(e) }}>Tambah</CButton>
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
                title={"History Order"}
                column={[
                    { name: "#", key: "index" },
                    { name: "Nama Customer", key: "client" },
                    { name: "List Item", key: "item" },
                    // { name: "Table", key: "table" },
                    { name: "Total", key: "total" },
                    // { name: "Periode Promo", key: "date" },
                    { name: "Status", key: "status" },
                    { name: "Action", key: "action" }
                ]}
                // headers={['#', 'Nama Customer', 'Status', 'Booking', 'Created At', 'Action']}
                collection={"cashiers"} // Ambil data dari koleksi "cashiers"
                filter={{}} // Bisa diberikan filter
                sort={{ createdAt: -1 }} // Sortir dari terbaru
                crudAction={[{ name: "Tambah Order", key: "add" }]}
                listStatus={[{ name: "PAYMENT", color: "warning" }, { name: "CLOSE", color: "dark" }, { name: "ON PROCESS", color: "primary" }]}
                refresh={refresh}
                setAction={setAction}
                setVisible={setVisible}
                setModal={setModal}
                setDetail={setDetail}
                setEdit={setEdit}
                setHapus={setHapus}
            />
            <CModal
                size="lg"
                scrollable
                alignment='center'
                visible={visible}
                onClose={() => { setNama(""); setMeja([]); setHours(0); setMinutes(0); setItem([]); setVisible(false); setAction(null); }}
                aria-labelledby="actionModal"
            >
                {renderModal()}
            </CModal>

            <CModal
                size="lg"
                scrollable
                alignment='center'
                visible={modal}
                onClose={() => { setDetail([]); setModal(false); setAction(null); }}
                aria-labelledby="actionModal"
            >
                <CModalHeader>
                    <CModalTitle id="actionModal">{action === "detail" ? "Detail Order" : "Choose Payment Method"}</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CContainer>
                        {columnDetail.map((data) => {
                            if (data.key === "start" || data.key === "end" || data.key === "createdAt") {
                                return <CRow className="align-items-start mb-2">
                                    <CCol xs={4} sm={5} md={3}><b>{data.label} </b></CCol>
                                    <CCol xs="auto" sm={"auto"} md={"auto"}>:</CCol>
                                    <CCol> {moment(detail?.[data.key]).format("dddd, DD MMMM YYYY HH:mm:ss")}</CCol>
                                </CRow>
                            } else if (data.key === "table") {
                                return <CRow className="align-items-start mb-2">
                                    <CCol xs={4} sm={5} md={3}><b>{data.label} </b></CCol>
                                    <CCol xs="auto" sm={"auto"} md={"auto"}>:</CCol>
                                    <CCol> {detail?.table ? detail?.[data.key] : detail?.name}</CCol>
                                </CRow>
                            } else if (data.key === "estimasi") {
                                var harga = 0;
                                if (detail?.status === "AKTIF") harga = !isNaN(detail?.end) && detail?.end !== "" ? formatNumber(hitungHarga(detail?.start, detail?.end, detail?.rate))
                                    : formatNumber(hitungHarga(detail?.start, moment().format(), detail?.rate))
                                else harga = !isNaN(detail?.harga) && detail?.harga !== "" ? formatNumber(detail?.harga) : formatNumber(hitungHarga(detail?.start, detail?.end, detail?.rate))
                                return <CRow className="align-items-start mb-2">
                                    <CCol xs={4} sm={5} md={3}><b>{data.label} </b></CCol>
                                    <CCol xs="auto" sm={"auto"} md={"auto"}>:</CCol>
                                    <CCol>{harga}</CCol>
                                </CRow>
                            } else {
                                return <CRow className="align-items-start mb-2">
                                    <CCol xs={4} sm={5} md={3}><b>{data.label} </b></CCol>
                                    <CCol xs="auto" sm={"auto"} md={"auto"}>:</CCol>
                                    <CCol> {detail?.[data.key]}</CCol>
                                </CRow>
                            }
                        })}
                    </CContainer>
                    <CContainer className='mt-3'>
                        <hr />
                        <h4 style={{ textAlign: "center" }}>Order List</h4>
                        <hr />
                        <CTable>
                            <CTableHead>
                                <CTableRow>
                                    <CTableHeaderCell>Qty</CTableHeaderCell>
                                    <CTableHeaderCell>Item</CTableHeaderCell>
                                    <CTableHeaderCell>Harga</CTableHeaderCell>
                                    <CTableHeaderCell>Sub Total</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {detail?.item?.map((item) => {
                                    return (
                                        <CTableRow>
                                            <CTableDataCell>{item?.qty}x</CTableDataCell>
                                            <CTableDataCell>{item?.name}</CTableDataCell>
                                            <CTableDataCell>{formatNumber(item?.harga)}</CTableDataCell>
                                            <CTableDataCell>{formatNumber(item?.harga * item?.qty)}</CTableDataCell>
                                        </CTableRow>
                                    )
                                })}
                                <CTableRow>
                                    <CTableDataCell style={{ textAlign: "right" }} colSpan={3}><b>Total</b></CTableDataCell>
                                    <CTableDataCell>{
                                        formatNumber(detail?.item?.reduce((total, item) => {
                                            return total + Number(item.harga * item.qty);
                                        }, 0))
                                    }</CTableDataCell>
                                </CTableRow>
                            </CTableBody>
                        </CTable>
                    </CContainer>
                    <CModalFooter>
                        {action === "detail" ?
                            <CButton color="danger" onClick={() => setModal(false)}>Close</CButton> :
                            <>
                                {detail?.status === "PAYMENT" && <CButton color="primary" onClick={(e) => {
                                    var data = window.btoa(JSON.stringify({ id: detail?.id, collection: 'order' }))
                                    // console.log(data)
                                    window.open(
                                        `https://breakpointciledug.page.link/?link=https://breakpoint-ciledug.web.app/welcome?data=${data}&apn=com.breakpoint&afl=https://breakpoint-ciledug.web.app/`
                                    )
                                }}>Bayar</CButton>}
                                <CButton color="danger" onClick={() => setModal(false)}>Close</CButton>
                            </>
                        }
                    </CModalFooter>
                </CModalBody>
            </CModal>
        </Suspense>
    )
}

export default Order