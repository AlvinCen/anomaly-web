import React, { Suspense, lazy, useState, useEffect } from 'react';
import { cilMediaStop, cilPencil, cilPrint } from '@coreui/icons';

const CIcon = lazy(() => import('@coreui/icons-react'));
const CBadge = lazy(() => import('@coreui/react').then(module => ({ default: module.CBadge })));
const CButton = lazy(() => import('@coreui/react').then(module => ({ default: module.CButton })));
const CCard = lazy(() => import('@coreui/react').then(module => ({ default: module.CCard })));
const CCardBody = lazy(() => import('@coreui/react').then(module => ({ default: module.CCardBody })));
const CCardHeader = lazy(() => import('@coreui/react').then(module => ({ default: module.CCardHeader })));
const CCardImage = lazy(() => import('@coreui/react').then(module => ({ default: module.CCardImage })));
const CCol = lazy(() => import('@coreui/react').then(module => ({ default: module.CCol })));
const CContainer = lazy(() => import('@coreui/react').then(module => ({ default: module.CContainer })));
const CForm = lazy(() => import('@coreui/react').then(module => ({ default: module.CForm })));
const CFormCheck = lazy(() => import('@coreui/react').then(module => ({ default: module.CFormCheck })));
const CFormInput = lazy(() => import('@coreui/react').then(module => ({ default: module.CFormInput })));
const CFormLabel = lazy(() => import('@coreui/react').then(module => ({ default: module.CFormLabel })));
const CFormSelect = lazy(() => import('@coreui/react').then(module => ({ default: module.CFormSelect })));
const CHeader = lazy(() => import('@coreui/react').then(module => ({ default: module.CHeader })));
const CInputGroup = lazy(() => import('@coreui/react').then(module => ({ default: module.CInputGroup })));
const CInputGroupText = lazy(() => import('@coreui/react').then(module => ({ default: module.CInputGroupText })));
const CModal = lazy(() => import('@coreui/react').then(module => ({ default: module.CModal })));
const CModalBody = lazy(() => import('@coreui/react').then(module => ({ default: module.CModalBody })));
const CModalFooter = lazy(() => import('@coreui/react').then(module => ({ default: module.CModalFooter })));
const CModalHeader = lazy(() => import('@coreui/react').then(module => ({ default: module.CModalHeader })));
const CModalTitle = lazy(() => import('@coreui/react').then(module => ({ default: module.CModalTitle })));
const CPagination = lazy(() => import('@coreui/react').then(module => ({ default: module.CPagination })));
const CPaginationItem = lazy(() => import('@coreui/react').then(module => ({ default: module.CPaginationItem })));
const CProgress = lazy(() => import('@coreui/react').then(module => ({ default: module.CProgress })));
const CRow = lazy(() => import('@coreui/react').then(module => ({ default: module.CRow })));
const CSpinner = lazy(() => import('@coreui/react').then(module => ({ default: module.CSpinner })));
const CTable = lazy(() => import('@coreui/react').then(module => ({ default: module.CTable })));
const CTableBody = lazy(() => import('@coreui/react').then(module => ({ default: module.CTableBody })));
const CTableDataCell = lazy(() => import('@coreui/react').then(module => ({ default: module.CTableDataCell })));
const CTableHead = lazy(() => import('@coreui/react').then(module => ({ default: module.CTableHead })));
const CTableHeaderCell = lazy(() => import('@coreui/react').then(module => ({ default: module.CTableHeaderCell })));
const CTableRow = lazy(() => import('@coreui/react').then(module => ({ default: module.CTableRow })));

const AppTable = lazy(() => import('../../components/AppTable'));
const ReactSelect = lazy(() => import('react-select'));

import moment from 'moment';
// import { firestore, functions } from '../../Firebase';
import { collection, getDocs, onSnapshot, addDoc, setDoc, doc, query, where, orderBy, deleteDoc } from 'firebase/firestore';
import Swal from 'sweetalert2'
import { useAuth } from '../../AuthContext';
import { httpsCallable } from 'firebase/functions';
import api from '../../axiosInstance';


const ManageUser = () => {
    const [loading, setLoading] = useState(false);

    const [action, setAction] = useState(null)
    const [visible, setVisible] = useState(false)
    const [refresh, setRefresh] = useState(false)

    const [harga, setHarga] = useState("")
    const [harga1, setHarga1] = useState("")

    const [data, setData] = useState([])
    const [nama, setNama] = useState("")
    const [display, setDisplay] = useState("")
    const [password, setPassword] = useState("")
    const [role, setRole] = useState()

    const [edit, setEdit] = useState({});
    const [hapus, setHapus] = useState({});

    const [pos, setPos] = useState([
        { id: 1, label: "Order", name: '/order', view: true, update: false, delete: false },
        // { id: 2, label: "Table", name: '/table', view: true, update: false, delete: false },
    ])
    const [manage, setManage] = useState([
        { id: 2, label: "Table", name: '/table/manage', view: true, update: false, delete: false },
        { id: 3, label: "Table Price", name: '/table/price-list', view: true, update: false, delete: false },
        { id: 4, label: "Storage", name: '/storage/manage', view: true, update: false, delete: false },
        { id: 5, label: "Storage Log", name: '/storage/log', view: true, update: false, delete: false },
        // { id: 3, label: "Merchandise", name: '/manage-merch', view: true, update: false, delete: false },
        { id: 6, label: "Menu", name: '/manage-menu', view: true, update: false, delete: false },
        { id: 7, label: "Promo", name: '/manage-promo', view: true, update: false, delete: false },
        { id: 8, label: "Member", name: '/member/manage', view: true, update: false, delete: false },
        { id: 9, label: "Member Subscription", name: '/member/subscription', view: true, update: false, delete: false },
    ])

    const { signup } = useAuth();

    const handleCheckboxChange = (id, action, value) => {
        // Handle checkbox change logic here
        const updatedPos = pos.map((item) =>
            item.id === id ? { ...item, [action]: value } : item
        );
        const updatedManage = manage.map((item) =>
            item.id === id ? { ...item, [action]: value } : item
        );
        setPos(updatedPos);
        setManage(updatedManage);
        // console.log(`Changed ${action} for ID ${id} to ${value}`);
    };

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

    const roleOptions = [
        { label: "Admin Pool", value: "admin-pool" },
        { label: "Admin Cafe", value: "admin-cafe" },
    ]

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
                                collection: "user",
                                filter: { _id: hapus?._id }
                            }
                        });
                        setRefresh(!refresh)

                        Swal.fire({
                            title: "Deleted!",
                            text: "User berhasil dihapus",
                            icon: "success"
                        });

                    } catch (error) {
                        console.log(error);
                        Swal.fire({
                            title: "Error!",
                            text: "Gagal menghapus user",
                            icon: "error"
                        });
                    }
                }
            });
            setHapus({});
        }
    }, [hapus]);


    useEffect(() => {
        if (action === "edit") {
            setNama(edit?.username)
            setDisplay(edit?.name)
            // var role = edit?.role?.forEach((role)=>{
            //     return {label: }
            // })
            // console.log(edit)
            var tmpPos = pos.map((pos) => {
                var tmpEdit = edit?.hasAccessPos?.find((data) => data?.name === pos.name)
                // console.log(pos)
                // console.log(tmpEdit)
                if (tmpEdit) return { ...pos, view: tmpEdit?.view, update: tmpEdit?.update, delete: tmpEdit?.delete }
                else return { ...pos, view: false, update: false, delete: false }
            })
            var tmpManage = manage.map((manage) => {
                var tmpEdit = edit?.hasAccessManage?.find((data) => data?.name === manage.name)
                // console.log(pos)
                // console.log(tmpEdit)
                if (tmpEdit) return { ...manage, view: tmpEdit?.view, update: tmpEdit?.update, delete: tmpEdit?.delete }
                else return { ...manage, view: false, update: false, delete: false }
            })
            // var tmpPos = edit?.hasAccessPos?.map((data, idx) => { return { ...data, id: pos[idx].id, label: pos[idx].label } })
            // var tmpManage = edit?.hasAccessManage?.map((data, idx) => { return { ...data, id: manage[idx].id, label: manage[idx].label } })
            setPos(tmpPos)
            setManage(tmpManage)
            // setRole(roleOptions.find((option) => option.value === edit?.role))
        }
    }, [action])

    const extractNumber = (id) => {
        // Menggunakan regex untuk mengekstrak angka
        const match = id.match(/\d+/);
        return match ? parseInt(match[0], 10) : 0;
    };

    const tambahUser = async (e) => {
        e.preventDefault();
        setLoading(true);

        const updatedPos = pos.map(({ id, ...rest }) => rest);
        const updatedManage = manage.map(({ id, ...rest }) => rest);

        var dataForm = {
            name: display,
            // role: role.value,
            username: nama,
            hasAccessPos: updatedPos,
            hasAccessManage: updatedManage,
            password: password
        };
        console.log(dataForm)

        try {
            const response = await api.post("/auth/register", dataForm);
            console.log(response)
            setRefresh(!refresh)

            Swal.fire({
                title: "Success!",
                text: "User berhasil ditambahkan",
                icon: "success"
            });

        } catch (error) {
            console.log(error);
            Swal.fire({
                title: "Error!",
                text: "Gagal menambahkan user",
                icon: "error"
            });
        }

        setVisible(false);
        setLoading(false);
    };


    const updateUser = async (e) => {
        e.preventDefault();
        setLoading(true);

        const updatedPos = pos.map(({ id, ...rest }) => rest);
        const updatedManage = manage.map(({ id, ...rest }) => rest);

        var dataForm = {
            name: display,
            // role: role.value,
            username: nama,
            hasAccessPos: updatedPos,
            hasAccessManage: updatedManage,
            password: password
        };
        console.log(dataForm)

        try {
            await api.put("/data/update", {
                collection: "user",
                filter: { _id: edit._id },
                update: dataForm
            });
            setRefresh(!refresh)

            Swal.fire({
                title: "Updated!",
                text: "User berhasil diperbarui",
                icon: "success"
            });

        } catch (error) {
            console.log(error);
            Swal.fire({
                title: "Error!",
                text: "Gagal memperbarui user",
                icon: "error"
            });
        }

        setVisible(false);
        setLoading(false);
    };


    const renderModal = () => {
        switch (action) {
            case "add":
                return <CForm onSubmit={tambahUser}>
                    <CModalHeader>
                        <CModalTitle id="actionModal">Tambah User</CModalTitle>
                    </CModalHeader>
                    <CModalBody style={{ maxHeight: 'calc(100vh - 210px)', overflowY: 'auto' }}>
                        <CContainer>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-3 col-form-label">Username</CFormLabel>
                                <CCol sm={9}>
                                    <CFormInput type="text" placeholder="Input Username" onChange={(e) => setNama(e.target.value)} defaultValue={nama} />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-3 col-form-label">Display Name</CFormLabel>
                                <CCol sm={9}>
                                    <CFormInput type="text" placeholder="Input Display Name" onChange={(e) => setDisplay(e.target.value)} defaultValue={display} />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-3 col-form-label">Password</CFormLabel>
                                <CCol sm={9}>
                                    <CFormInput type="password" placeholder="Input Password" minLength="6" onChange={(e) => setPassword(e.target.value)} />
                                </CCol>
                            </CRow>
                            {/* <CRow className="mb-3">
                                <CFormLabel className="col-sm-3 col-form-label">Role</CFormLabel>
                                <CCol sm={9}>
                                    <ReactSelect
                                        styles={customStyles}
                                        placeholder="Pilih Role"
                                        options={roleOptions}
                                        value={role}
                                        menuPortalTarget={document.body}
                                        onChange={(selected) => setRole(selected)}
                                        required
                                    />
                                </CCol>
                            </CRow> */}
                            <CContainer className='mt-3'>
                                <hr />
                                <h4 style={{ textAlign: "center" }}>POS Access Control</h4>
                                <hr />
                                <CTable>
                                    <CTableHead>
                                        <CTableRow>
                                            <CTableHeaderCell>Page</CTableHeaderCell>
                                            <CTableHeaderCell>View</CTableHeaderCell>
                                            <CTableHeaderCell>Update</CTableHeaderCell>
                                            <CTableHeaderCell>Delete</CTableHeaderCell>
                                        </CTableRow>
                                    </CTableHead>
                                    <CTableBody>
                                        {pos.map((item) => (
                                            <CTableRow key={item.id}>
                                                <CTableDataCell>{item.label}</CTableDataCell>
                                                <CTableDataCell>
                                                    <CFormCheck
                                                        checked={item.view}
                                                        onChange={(e) =>
                                                            handleCheckboxChange(item.id, 'view', e.target.checked)
                                                        }
                                                    />
                                                </CTableDataCell>
                                                <CTableDataCell>
                                                    <CFormCheck
                                                        checked={item.update}
                                                        onChange={(e) =>
                                                            handleCheckboxChange(item.id, 'update', e.target.checked)
                                                        }
                                                    />
                                                </CTableDataCell>
                                                <CTableDataCell>
                                                    <CFormCheck
                                                        checked={item.delete}
                                                        onChange={(e) =>
                                                            handleCheckboxChange(item.id, 'delete', e.target.checked)
                                                        }
                                                    />
                                                </CTableDataCell>
                                            </CTableRow>
                                        ))}
                                    </CTableBody>
                                </CTable>
                            </CContainer>
                            <CContainer className='mt-3'>
                                <hr />
                                <h4 style={{ textAlign: "center" }}>Management Access Control</h4>
                                <hr />
                                <CTable>
                                    <CTableHead>
                                        <CTableRow>
                                            <CTableHeaderCell>Page</CTableHeaderCell>
                                            <CTableHeaderCell>View</CTableHeaderCell>
                                            <CTableHeaderCell>Update</CTableHeaderCell>
                                            <CTableHeaderCell>Delete</CTableHeaderCell>
                                        </CTableRow>
                                    </CTableHead>
                                    <CTableBody>
                                        {manage.map((item) => (
                                            <CTableRow key={item.id}>
                                                <CTableDataCell>{item.label}</CTableDataCell>
                                                <CTableDataCell>
                                                    <CFormCheck
                                                        checked={item.view}
                                                        onChange={(e) =>
                                                            handleCheckboxChange(item.id, 'view', e.target.checked)
                                                        }
                                                    />
                                                </CTableDataCell>
                                                <CTableDataCell>
                                                    <CFormCheck
                                                        checked={item.update}
                                                        onChange={(e) =>
                                                            handleCheckboxChange(item.id, 'update', e.target.checked)
                                                        }
                                                    />
                                                </CTableDataCell>
                                                <CTableDataCell>
                                                    <CFormCheck
                                                        checked={item.delete}
                                                        onChange={(e) =>
                                                            handleCheckboxChange(item.id, 'delete', e.target.checked)
                                                        }
                                                    />
                                                </CTableDataCell>
                                            </CTableRow>
                                        ))}
                                    </CTableBody>
                                </CTable>
                            </CContainer>
                        </CContainer>
                    </CModalBody>

                    <CModalFooter>
                        {!loading ? <CButton color="success" type='submit' onClick={(e) => tambahUser(e)}>Tambah</CButton>
                            : <CSpinner color="primary" className="float-end" variant="grow" />}
                    </CModalFooter>
                </CForm>

            case "edit":
                return <CForm onSubmit={updateUser}>
                    <CModalHeader>
                        <CModalTitle id="actionModal">Update User</CModalTitle>
                    </CModalHeader>
                    <CModalBody style={{ maxHeight: 'calc(100vh - 210px)', overflowY: 'auto' }}>
                        <CContainer>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-3 col-form-label">Username</CFormLabel>
                                <CCol sm={9}>
                                    <CFormInput type="text" placeholder="Input Username" onChange={(e) => setNama(e.target.value)} defaultValue={nama} />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-3 col-form-label">Display Name</CFormLabel>
                                <CCol sm={9}>
                                    <CFormInput type="text" placeholder="Input Display Name" onChange={(e) => setDisplay(e.target.value)} defaultValue={display} />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-3 col-form-label">Password</CFormLabel>
                                <CCol sm={9}>
                                    <CFormInput type="password" placeholder="Input Password" onChange={(e) => setPassword(e.target.value)} />
                                </CCol>
                            </CRow>
                            <CContainer className='mt-3'>
                                <hr />
                                <h4 style={{ textAlign: "center" }}>POS Access Control</h4>
                                <hr />
                                <CTable>
                                    <CTableHead>
                                        <CTableRow>
                                            <CTableHeaderCell>Page</CTableHeaderCell>
                                            <CTableHeaderCell>View</CTableHeaderCell>
                                            <CTableHeaderCell>Update</CTableHeaderCell>
                                            <CTableHeaderCell>Delete</CTableHeaderCell>
                                        </CTableRow>
                                    </CTableHead>
                                    <CTableBody>
                                        {pos.map((item) => (
                                            <CTableRow key={item.id}>
                                                <CTableDataCell>{item.label}</CTableDataCell>
                                                <CTableDataCell>
                                                    <CFormCheck
                                                        checked={item.view}
                                                        onChange={(e) =>
                                                            handleCheckboxChange(item.id, 'view', e.target.checked)
                                                        }
                                                    />
                                                </CTableDataCell>
                                                <CTableDataCell>
                                                    <CFormCheck
                                                        checked={item.update}
                                                        onChange={(e) =>
                                                            handleCheckboxChange(item.id, 'update', e.target.checked)
                                                        }
                                                    />
                                                </CTableDataCell>
                                                <CTableDataCell>
                                                    <CFormCheck
                                                        checked={item.delete}
                                                        onChange={(e) =>
                                                            handleCheckboxChange(item.id, 'delete', e.target.checked)
                                                        }
                                                    />
                                                </CTableDataCell>
                                            </CTableRow>
                                        ))}
                                    </CTableBody>
                                </CTable>
                            </CContainer>
                            <CContainer className='mt-3'>
                                <hr />
                                <h4 style={{ textAlign: "center" }}>Management Access Control</h4>
                                <hr />
                                <CTable>
                                    <CTableHead>
                                        <CTableRow>
                                            <CTableHeaderCell>Page</CTableHeaderCell>
                                            <CTableHeaderCell>View</CTableHeaderCell>
                                            <CTableHeaderCell>Update</CTableHeaderCell>
                                            <CTableHeaderCell>Delete</CTableHeaderCell>
                                        </CTableRow>
                                    </CTableHead>
                                    <CTableBody>
                                        {manage.map((item) => (
                                            <CTableRow key={item.id}>
                                                <CTableDataCell>{item.label}</CTableDataCell>
                                                <CTableDataCell>
                                                    <CFormCheck
                                                        checked={item.view}
                                                        onChange={(e) =>
                                                            handleCheckboxChange(item.id, 'view', e.target.checked)
                                                        }
                                                    />
                                                </CTableDataCell>
                                                <CTableDataCell>
                                                    <CFormCheck
                                                        checked={item.update}
                                                        onChange={(e) =>
                                                            handleCheckboxChange(item.id, 'update', e.target.checked)
                                                        }
                                                    />
                                                </CTableDataCell>
                                                <CTableDataCell>
                                                    <CFormCheck
                                                        checked={item.delete}
                                                        onChange={(e) =>
                                                            handleCheckboxChange(item.id, 'delete', e.target.checked)
                                                        }
                                                    />
                                                </CTableDataCell>
                                            </CTableRow>
                                        ))}
                                    </CTableBody>
                                </CTable>
                            </CContainer>
                        </CContainer>
                    </CModalBody>

                    <CModalFooter>
                        {!loading ? <CButton color="success" type='submit'>Update</CButton>
                            : <CSpinner color="primary" className="float-end" variant="grow" />}
                    </CModalFooter>
                </CForm>
            // default:
            //     return <CForm onSubmit={tambahUser}>
            //         <CModalHeader>
            //             <CModalTitle id="actionModal">Tambah User</CModalTitle>
            //         </CModalHeader>
            //         <CModalBody style={{ maxHeight: 'calc(100vh - 210px)', overflowY: 'auto' }}>
            //             <CContainer>
            //                 <CRow className="mb-3">
            //                     <CFormLabel className="col-sm-3 col-form-label">Username</CFormLabel>
            //                     <CCol sm={9}>
            //                         <CFormInput type="text" placeholder="Input Username" onChange={(e) => setNama(e.target.value)} defaultValue={nama} />
            //                     </CCol>
            //                 </CRow>
            //                 <CRow className="mb-3">
            //                     <CFormLabel className="col-sm-3 col-form-label">Display Name</CFormLabel>
            //                     <CCol sm={9}>
            //                         <CFormInput type="text" placeholder="Input Display Name" onChange={(e) => setDisplay(e.target.value)} defaultValue={display} />
            //                     </CCol>
            //                 </CRow>
            //                 <CRow className="mb-3">
            //                     <CFormLabel className="col-sm-3 col-form-label">Role</CFormLabel>
            //                     <CCol sm={9}>
            //                         <ReactSelect
            //                             styles={customStyles}
            //                             isMulti={true}
            //                             placeholder="Pilih Role"
            //                             options={roleOptions}
            //                             value={role}
            //                             menuPortalTarget={document.body}
            //                             onChange={(selected) => setRole(selected)}
            //                             required
            //                         />
            //                     </CCol>
            //                 </CRow>
            //             </CContainer>
            //         </CModalBody>

            //         <CModalFooter>
            //             {!loading ? <CButton color="success" type='submit'>Tambah</CButton>
            //                 : <CSpinner color="primary" className="float-end" variant="grow" />}
            //         </CModalFooter>
            //     </CForm>
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
                title={"Management User"}
                column={[
                    { name: "#", key: "index" },
                    { name: "Username", key: "username" },
                    { name: "Nama", key: "name" },
                    { name: "Role", key: "role" },
                    { name: "Action", key: "action" }
                ]}
                // headers={['#', 'Nama Customer', 'Status', 'Booking', 'Created At', 'Action']}
                // query={query(collection(firestore, "user"), where("__name__", "!=", "sNOWPTaePOQxNzwGd7lSyS9jmgP2"))}
                collection={"user"} // Ambil data dari koleksi "cashiers"
                filter={{
                    role: {
                        $ne :"superadmin"
                    }
                }} // Bisa diberikan filter
                sort={{ createdAt: -1 }} // Sortir dari terbaru
                crudAction={[{ name: "Tambah User", key: "add" }]}
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
                onClose={() => {
                    setPos([
                        { id: 1, label: "Order", name: '/order', view: true, update: false, delete: false },
                        // { id: 2, label: "Table", name: '/table', view: true, update: false, delete: false },
                    ]);
                    setManage([
                        { id: 2, label: "Table", name: '/table/manage', view: true, update: false, delete: false },
                        { id: 3, label: "Table Price", name: '/table/price-list', view: true, update: false, delete: false },
                        { id: 4, label: "Storage", name: '/storage/manage', view: true, update: false, delete: false },
                        { id: 5, label: "Storage Log", name: '/storage/log', view: true, update: false, delete: false },
                        // { id: 3, label: "Merchandise", name: '/manage-merch', view: true, update: false, delete: false },
                        { id: 6, label: "Menu", name: '/manage-menu', view: true, update: false, delete: false },
                        { id: 7, label: "Promo", name: '/manage-promo', view: true, update: false, delete: false },
                        { id: 8, label: "Member", name: '/member/manage', view: true, update: false, delete: false },
                        { id: 9, label: "Member Subscription", name: '/member/subscription', view: true, update: false, delete: false },
                    ]);
                    setNama("");
                    setDisplay(""); setRole(''); setVisible(false); setAction(null);
                }}
                aria-labelledby="actionModal"
            >
                {renderModal()}
            </CModal>

        </Suspense>
    )
}

export default ManageUser