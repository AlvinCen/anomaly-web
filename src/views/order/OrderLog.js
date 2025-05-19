import { cilPencil } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CButton, CCol, CContainer, CFormInput, CFormLabel, CFormTextarea, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CRow, CSpinner, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react';
import moment from 'moment';
import React, { Suspense, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import AppTable from '../../components/AppTable.js';
import ReactSelectAsyncCreatable from 'react-select/async-creatable';
import { useAuth } from '../../AuthContext.js';
import api from '../../axiosInstance.js';

const OrderLog = () => {
    const { currentUser } = useAuth();

    const [loading, setLoading] = useState(false);

    const [init, setInit] = useState(false);

    const [action, setAction] = useState(null);
    const [visible, setVisible] = useState(false);
    const [refresh, setRefresh] = useState(false)
    const [index, setIndex] = useState(0);
    const [expired, setExpired] = useState(moment().add(7, "days").format("YYYY-MM-DD").toString());

    const [data, setData] = useState([]);
    const [nama, setNama] = useState("");
    const [stok, setStok] = useState(1);
    const [comment, setComment] = useState("");
    const [status, setStatus] = useState("");

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

    // Fetch storage logs from MongoDB
    const fetchtableLogs = async () => {
        (true);
        try {
            const response = await api.post('/data', {
                collection: "tableLog",
                filter: {},
                sort: {}
            })
            setData(response.data);
            setInit(true);
        } catch (error) {
            console.error('Error fetching storage logs:', error);
            // Swal.fire('Error', 'Gagal memuat data log storage', 'error');
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
                        await api.delete("/data/delete", {
                            data: {
                                collection: "tableLog",
                                filter: { _id: hapus?.id }
                            }
                        });
                        setRefresh(!refresh)

                        Swal.fire({
                            title: "Deleted!",
                            text: "Data berhasil dihapus",
                            icon: "success"
                        });
                        fetchtableLogs(); // Refresh data
                    } catch (error) {
                        console.error('Error deleting log:', error);
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
        fetchtableLogs();
    }, [refresh]);

    const tambahItem = async (e) => {
        e.preventDefault();
        setLoading(true);

        const logData = {
            name: nama?.value || nama,
            stok: Number(stok),
            comment,
            expired,
            event: "add",
            createdBy: currentUser.name || currentUser.username
        };

        if (nama?.id) logData.storageId = nama?.id;

        try {
            const response = await api.post("/data/add", {
                collection: "tableLog",
                data: logData
            });
            setRefresh(!refresh)

            Swal.fire({
                title: "Success!",
                text: "Berhasil menambahkan log baru",
                icon: "success"
            });
            fetchtableLogs(); // Refresh data
        } catch (error) {
            console.error('Error adding log:', error);
            Swal.fire({
                title: "Error!",
                text: "Gagal menambahkan log baru",
                icon: "error"
            });
        } finally {
            setLoading(false);
            setVisible(false);
        }
    };

    const updateItem = async (e) => {
        e.preventDefault();
        setLoading(true);

        const updateData = {
            storageId: detail?._id,
            name: detail?.name,
            stok: Number(stok),
            comment,
            expired,
            event: edit?.qty - Number(stok) === 0 ? "delete" : "update",
            createdBy: currentUser.name || currentUser.username
        };

        try {
            await api.put("/data/update", {
                collection: "tableLog",
                filter: { _id: detail?.id },
                update: updateData
            });
            setRefresh(!refresh)

            Swal.fire({
                title: "Success!",
                text: "Berhasil memperbarui log",
                icon: "success"
            });
            fetchtableLogs(); // Refresh data
        } catch (error) {
            console.error('Error updating log:', error);
            Swal.fire({
                title: "Error!",
                text: "Gagal memperbarui log",
                icon: "error"
            });
        } finally {
            setLoading(false);
            setVisible(false);
        }
    };

    const createOption = (label) => ({
        label,
        value: label.toLowerCase().replace(/\W/g, ''),
    });

    const loadOption = (inputValue, callback) => {
        const options = [{ options: data }];
        callback(options);
    };

    const filterOption = (option, inputValue) => {
        return option?.value.includes(inputValue);
    };

    const isOptionUnique = (inputValue) => {
        return !data.some(
            (option) => option.label.toLowerCase().includes(inputValue.toLowerCase())
        );
    };

    const handleCreate = async (inputValue) => {
        (true);
        setTimeout(() => {
            const newOption = createOption(inputValue);
            (false);
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
                                            isValidNewOption={isOptionUnique}
                                            value={nama}
                                            placeholder="Nama Barang"
                                        />
                                    </CCol>
                                </CRow>
                                <CRow className="mb-3">
                                    <CFormLabel className="col-sm-2 col-form-label">Stok</CFormLabel>
                                    <CCol sm={10}>
                                        <CFormInput
                                            type="number"
                                            min={1}
                                            value={stok}
                                            onChange={(e) => setStok(e.target.value)}
                                        />
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
                                            aria-label="Expired Date"
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
                                            aria-label="Input Comment"
                                        />
                                    </CCol>
                                </CRow>
                            </CContainer>
                        </CModalBody>
                        <CModalFooter>
                            {!loading ? (
                                <CButton color="success" onClick={tambahItem}>
                                    Tambah
                                </CButton>
                            ) : (
                                <CSpinner color="primary" className="float-end" variant="grow" />
                            )}
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
                                        <CFormInput
                                            type="number"
                                            min={1}
                                            max={edit?.qty}
                                            value={stok}
                                            onChange={(e) => setStok(e.target.value)}
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
                                            aria-label="Input Comment"
                                        />
                                    </CCol>
                                </CRow>
                            </CContainer>
                        </CModalBody>
                        <CModalFooter>
                            <CButton color="primary" onClick={() => { setAction("detail"); setVisible(true) }}>
                                ← Kembali
                            </CButton>
                            <CButton color="warning" onClick={updateItem}>
                                Update
                            </CButton>
                            <CButton color="danger" onClick={() => { setVisible(false) }}>
                                Tutup
                            </CButton>
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
                                        <CTableHeaderCell className="bg-body">Qty</CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body">Expired</CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body">Action</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {detail?.stok?.length > 0 ? (
                                        detail.stok.map((data, idx) => (
                                            <CTableRow key={idx}>
                                                <CTableDataCell>{idx + 1}</CTableDataCell>
                                                <CTableDataCell>{data?.qty}</CTableDataCell>
                                                <CTableDataCell>
                                                    {moment(data?.expired).format("DD MMMM YYYY")}
                                                </CTableDataCell>
                                                <CTableDataCell>
                                                    <CButton
                                                        className='me-2'
                                                        size="sm"
                                                        color="warning"
                                                        onClick={() => {
                                                            setEdit(data);
                                                            setAction("edit");
                                                            setIndex(idx);
                                                            setVisible(true);
                                                        }}
                                                    >
                                                        <CIcon icon={cilPencil} /> Edit
                                                    </CButton>
                                                </CTableDataCell>
                                            </CTableRow>
                                        ))
                                    ) : (
                                        <CTableRow>
                                            <CTableDataCell colSpan={8}>
                                                <h4 style={{ textAlign: "center", color: "#9f9f9f" }}>
                                                    Data tidak ditemukan
                                                </h4>
                                            </CTableDataCell>
                                        </CTableRow>
                                    )}
                                </CTableBody>
                            </CTable>
                        </CModalBody>
                        <CModalFooter>
                            <CButton color="danger" onClick={() => { setVisible(false) }}>
                                Tutup
                            </CButton>
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
                                            isValidNewOption={isOptionUnique}
                                            value={nama}
                                            placeholder="Nama Barang"
                                        />
                                    </CCol>
                                </CRow>
                                <CRow className="mb-3">
                                    <CFormLabel className="col-sm-2 col-form-label">Stok</CFormLabel>
                                    <CCol sm={10}>
                                        <CFormInput
                                            type="number"
                                            min={1}
                                            value={stok}
                                            onChange={(e) => setStok(e.target.value)}
                                        />
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
                                            aria-label="Expired Date"
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
                                            aria-label="Input Comment"
                                        />
                                    </CCol>
                                </CRow>
                            </CContainer>
                        </CModalBody>
                        <CModalFooter>
                            {!loading ? (
                                <CButton color="success" onClick={tambahItem}>
                                    Tambah
                                </CButton>
                            ) : (
                                <CSpinner color="primary" className="float-end" variant="grow" />
                            )}
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
                title={"Order Log"}
                column={[
                    { name: "#", key: "index" },
                    // { name: "Action", key: "action" },
                    { name: "Order Id", key: "orderId" },
                    { name: "Event Type", key: "event" },
                    { name: "Nama Customer", key: "customer" },
                    { name: "Table", key: "table" },
                    { name: "Created At", key: "createdAt" },
                    { name: "User", key: "user" }
                ]}
                collection="tableLog"
                filter={{}}
                sort={{ createdAt: -1 }}
                listStatus={[
                    { name: "add", color: "success" },
                    { name: "update", color: "warning" },
                    { name: "delete", color: "danger" }
                ]}
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
                onClose={() => {
                    setNama("");
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

export default OrderLog;