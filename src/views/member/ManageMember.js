import { cilCash, cilMediaStop, cilPencil, cilPrint } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CBadge, CButton, CCard, CCardBody, CCardHeader, CCardImage, CCol, CContainer, CFormInput, CFormLabel, CFormSelect, CFormSwitch, CHeader, CInputGroup, CInputGroupText, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CPagination, CPaginationItem, CProgress, CRow, CSpinner, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import moment from 'moment';
import React, { Suspense, useEffect, useState } from 'react'
// import { firestore } from '../../Firebase';
// import { collection, getDocs, onSnapshot, addDoc, setDoc, doc, query, where, orderBy, deleteDoc } from 'firebase/firestore';
import Swal from 'sweetalert2'
import AppTable from '../../components/AppTable';
import { formatNumber } from 'chart.js/helpers';
import ReactSelectAsyncCreatable from 'react-select/async-creatable';
import ReactSelectCreatable from 'react-select/creatable';
import qrisIcon from '../../assets/images/qris.png'
import api from '../../axiosInstance';
import { useAuth } from '../../AuthContext';

const ManageMember = () => {
    const [loading, setLoading] = useState(false);
    const [client, setClient] = useState(null)

    const [inputValue, setInputValue] = useState("");

    const [action, setAction] = useState(null)
    const [visible, setVisible] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const [isSubscription, setIsSubscription] = useState(false)


    const [harga, setHarga] = useState(0)
    const [modal, setModal] = useState(false)
    const [detail, setDetail] = useState([])
    const [inputBayar, setInputBayar] = useState('0');


    const [data, setData] = useState([])
    const [nama, setNama] = useState("")
    const [stok, setStok] = useState(1)
    const [status, setStatus] = useState("")
    const [hp, setHp] = useState("")
    const [expired, setExpired] = useState(moment().add(7, "days").format("YYYY-MM-DD").toString())
    const [edit, setEdit] = useState({});
    const [hapus, setHapus] = useState({});
    const [cancel, setCancel] = useState({});
    const [paymentMethod, setPaymentMethod] = useState('cash');

    const { currentUser } = useAuth();


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

    const customStylesInput = {
        control: (provided, state) => ({
            ...provided,
            border: "1px solid #dbdfe6", // Warna border seperti CFormInput
            borderRadius: "8px", // Radius border
            padding: "0.1rem 0.1rem", // Padding seperti CFormInput
            backgroundColor: state.isDisabled ? "#e9ecef" : "#fff", // Warna background
            color: "#495057", // Warna teks
            boxShadow: state.isFocused ? "0 0 0 0.2rem rgba(13, 110, 253, 0.25)" : "none", // Efek fokus
            fontSize: "1rem", // Ukuran font seperti CFormInput
            lineHeight: "1.5", // Line height seperti CFormInput
            "&:hover": {
                borderColor: "#adb5bd", // Warna border saat hover
            },
        }),
        placeholder: (provided) => ({
            ...provided,
            color: "#6c757d", // Warna placeholder seperti CFormInput
            fontSize: "1rem", // Ukuran font placeholder
            lineHeight: "1.5",
        }),
        singleValue: (provided) => ({
            ...provided,
            color: "#495057", // Warna teks nilai yang dipilih
            fontSize: "1rem", // Ukuran font
            lineHeight: "1.5",
        }),
        menu: (provided) => ({
            ...provided,
            borderRadius: "4px", // Radius menu dropdown
            border: "1px solid #dbdfe6",
            zIndex: 9999,
        }),
        menuList: (provided) => ({
            ...provided,
            padding: "0", // Hapus padding default
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isFocused ? "#80bdff" : "white", // Warna opsi saat fokus
            color: state.isFocused ? "white" : "#495057", // Warna teks opsi saat fokus
            padding: "0.375rem 0.75rem", // Padding opsi
            fontSize: "1rem",
            lineHeight: "1.5",
            "&:active": {
                backgroundColor: "#0056b3", // Warna saat opsi diklik
                color: "white",
            },
        }),
        dropdownIndicator: () => ({
            display: "none", // Hide dropdown arrow
        }),
        indicatorSeparator: () => ({
            display: "none", // Hide separator
        }),
    };


    const loadOption = (inputValue, callback) => {
        const options = data
        // // console.log(options)
        callback(options)
    }

    const filterOption = (option, inputValue) => {
        return option?.value.includes(inputValue)
    }

    const createOption = (label) => ({
        label,
        value: label.toLowerCase().replace(/\W/g, ''),
    });

    const isOptionUnique = (inputValue) => {
        // Check if the option already exists
        return !data.some(
            (option) => option.label.toLowerCase().includes(inputValue.toLowerCase())
        );
    };

    const handleCreate = async (inputValue) => {
        // (true);
        const newOption = createOption(inputValue);
        // (false);
        // setOptions((prev) => [...prev, newOption]);
        setClient(newOption);
    };


    const handlePaymentChange = (value) => {
        setPaymentMethod(value);
    };

    const fetchMember = async () => {
        try {
            const response = await api.post('/data', {
                collection: "member",
                filter: {},
                sort: { label: 1 }
            })
            var tmpData = []
            response.data.forEach((data) => {
                tmpData.push({ label: `${data.name} (${data.nomor})`, value: data._id })
            })
            console.log(tmpData)
            setData(tmpData);
        } catch (error) {
            console.error('Error fetching menu reports:', error);
            // Swal.fire('Error', 'Gagal memuat laporan menu', 'error');
        }
    };

    const filteredOptions =
        inputValue !== ""
            ? data.filter((option) =>
                option.label.toLowerCase().includes(inputValue.toLowerCase())
            )
            : []; // Return an empty array if

    useEffect(() => {
        fetchMember()
    }, [refresh])

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
                                collection: "member",
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
        if (Object.keys(cancel).length > 0) {
            Swal.fire({
                title: "Konfirmasi",
                html: `<p>Apakah anda yakin menghapus subscription <b>${cancel?.name}</b>?</p>`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Ya",
                cancelButtonText: "Batal"
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        await api.put("/data/update", {
                            collection: "member",
                            filter: { _id: cancel?._id },
                            update: {
                                status: "AKTIF",
                                $unset: {
                                    subscription: {}
                                },
                                updateAt: moment().format().toString()
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
            setCancel({})
        }

    }, [cancel])

    useEffect(() => {
        if (action === "edit") {
            var harga = edit?.subscription?.harga ? edit?.subscription?.harga : "0"
            setInputBayar(harga)
            setHp(edit?.nomor)
            setNama(edit?.name)
            setHarga(harga)
            setExpired(edit?.subscription?.expired)
            setStatus(edit?.status)
        }
    }, [action])

    useEffect(() => {
        setInputBayar(detail?.subscription?.harga)
    }, [modal])

    const tambahMember = async (e) => {
        e.preventDefault();
        setLoading(true)
        var subscription = isSubscription ?
            {
                harga: harga,
                expired: expired,
                cashier: currentUser?.name,
            } : {}

        if (client?.nomor == undefined) {
            const data = {
                name: client?.label,
                nomor: hp,
                subscription: subscription,
                createdAt: moment().format().toString(),
                status: isSubscription ? "PAYMENT" : "AKTIF"
            }
            try {
                const response = await api.post("/data/add", {
                    collection: "member",
                    data: data
                });
                var memberId = response.data.newData._id;

                if (isSubscription) {
                    const response = await api.post("/data/add", {
                        collection: "memberSubscription",
                        data: {
                            name: client?.label,
                            memberId: memberId,
                            expired: expired,
                            total: harga,
                            nomor: hp,
                            createdAt: moment().format().toString(),
                            status: "PAYMENT"
                        }
                    });

                    await api.put("/data/update", {
                        collection: "member",
                        filter: { _id: memberId },
                        update: {
                            subscription: {
                                ...subscription,
                                id: response.data.newData._id
                            }
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
        } else {
            Swal.fire({
                title: "Error!",
                text: "Gagal menambahkan data",
                icon: "error"
            });
        }

        setVisible(false)
    }

    const updateMember = async (e) => {
        e.preventDefault();
        setLoading(true)
        var dataForm = {
            name: nama,
            nomor: hp,
            updatedAt: moment().format().toString(),
        }
        try {
            await api.put("/data/update", {
                collection: "member",
                filter: { _id: edit._id },
                update: dataForm
            });
            setRefresh(!refresh)

        } catch (err) {
            Swal.fire({
                title: "Error!",
                text: "Data gagal diperbarui",
                icon: "error"
            });
        }
        setVisible(false)
    }

    const subscribe = async (e) => {
        e.preventDefault();
        setLoading(true)
        var subscription =
        {
            harga: harga,
            expired: expired,
            cashier: currentUser?.name,
        }
        const data = {
            subscription: subscription,
            updatedAt: moment().format().toString(),
            status: "PAYMENT"
        }
        try {
            const response = await api.post("/data/add", {
                collection: "memberSubscription",
                data: {
                    name: detail?.name,
                    memberId: detail?._id,
                    expired: expired,
                    total: harga,
                    nomor: detail?.nomor,
                    createdAt: moment().format().toString(),
                    status: "PAYMENT"
                }
            });
            await api.put("/data/update", {
                collection: "member",
                filter: { _id: detail?._id },
                update: {
                    ...data,
                    subscription: {
                        ...subscription,
                        id: response.data.newData._id
                    }
                }
            });

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
        setVisible(false)
    }

    const pay = async (e) => {
        e.preventDefault();
        setLoading(true)
        if (window?.electron) {
            const result = await window?.electron.printReceipt({
                data: detail,
                // cafe,
                paymentMethod,
                pay: inputBayar,
                changes: detail?.subscription?.harga - inputBayar,
                action: "memberSubscription"
            });

            if (result.success) {
                try {
                    var tmpSubscription = { ...detail?.subscription }
                    var dataForm = {
                        status: "AKTIF",
                        subscription: tmpSubscription,
                        updatedAt: moment().format().toString(),
                    }

                    await api.put("/data/update", {
                        collection: "member",
                        filter: { _id: detail?._id },
                        update: dataForm
                    });
                    await api.put("/data/update", {
                        collection: "memberSubscription",
                        filter: { _id: detail?.subscription?.id },
                        update: {
                            paymentMethod: paymentMethod,
                            pay: inputBayar,
                            status: "PAID",
                            updatedAt: moment().format().toString()
                        }
                    });
                    setRefresh(!refresh)

                    Swal.fire({
                        title: "Updated!",
                        text: "Data berhasil diperbarui",
                        icon: "success"
                    });
                } catch (error) {
                    Swal.fire({
                        title: "Error!",
                        text: "Gagal menambahkan data",
                        icon: "error"
                    });
                }
            }
        } else {
            Swal.fire({
                title: "Failed!",
                text: "Pembayaran tidak dapat diproses",
                icon: "error"
            });
            console.log("Electron is not available.");
        }
        setModal(false)
    }

    const renderModal = () => {
        switch (action) {
            case "add":
                return <>
                    <CModalHeader>
                        <CModalTitle id="actionModal">Tambah Member</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <CContainer>
                            <CRow className="mb-3">
                                <CCol>
                                    <CFormLabel className="col-form-label">Nama Customer</CFormLabel>
                                </CCol>
                                <CCol sm={9}>
                                    {/* <CFormInput type="text" onChange={(e) => setNama(e.target.value)} defaultValue={nama}
                                                                    readOnly={bookingId !== "" ? true : false}
                                                                    plainText={bookingId !== "" ? true : false} /> */}

                                    <ReactSelectCreatable
                                        value={client} // Match value in options
                                        options={filteredOptions}
                                        onInputChange={(value) => setInputValue(value)} // Track input value                                  
                                        onChange={(selectedOption) => {
                                            // setNomor(selectedOption?.nomor)
                                            setClient(selectedOption)
                                        }} // Only store the value
                                        placeholder="Input Nama Customer"
                                        onCreateOption={handleCreate}

                                        styles={customStylesInput}
                                        noOptionsMessage={() => (inputValue === "" ? "Start typing to search..." : "No options available")}
                                        components={{ IndicatorSeparator: null }}
                                    />
                                </CCol>
                            </CRow>
                            <CRow className='mb-3'>
                                <CCol>
                                    <CFormLabel className="col-form-label">No. HP </CFormLabel>
                                </CCol>
                                <CCol sm={9}>
                                    <CFormInput type="text"
                                        value={client?.nomor !== undefined ? client?.nomor : hp}
                                        onChange={(e) => {
                                            if (/^\d*$/.test(e.target.value)) setHp(e.target.value)
                                        }}
                                        disabled={client?.id !== undefined}
                                        placeholder='Input Nomor HP'
                                        required />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CCol>
                                    <CInputGroup>
                                        <CFormLabel className="col-form-label">Subscription
                                            <CFormSwitch className='ms-2' style={{ display: "inline-flex" }} checked={isSubscription} onChange={(e) => setIsSubscription(e.target.checked)} />
                                        </CFormLabel>
                                    </CInputGroup>
                                </CCol>
                            </CRow>
                            {isSubscription && <>
                                <CRow className="mb-3">
                                    <CFormLabel className="col-sm-3 col-form-label">Harga</CFormLabel>
                                    <CCol sm={9}>
                                        <CFormInput type="text"
                                            placeholder="Input Harga"
                                            onChange={(e) => setHarga(e.target.value.replace(/,/g, ""))}
                                            value={formatNumber(harga)}
                                        />
                                    </CCol>
                                </CRow>
                                <CRow className="mb-3">
                                    <CFormLabel className="col-sm-3 col-form-label">Expired</CFormLabel>
                                    <CCol sm="auto">
                                        <CFormInput
                                            type="date"
                                            value={expired}
                                            onChange={(e) => setExpired(e.target.value)}
                                            placeholder="Expired Date"
                                            aria-label="Expired Date" />
                                    </CCol>
                                </CRow>
                            </>}
                        </CContainer>
                    </CModalBody>

                    <CModalFooter>
                        {!loading ? <CButton color="success" onClick={(e) => { tambahMember(e) }}>Tambah</CButton>
                            : <CSpinner color="primary" className="float-end" variant="grow" />}
                    </CModalFooter>
                </>
            case "edit":
                return <>
                    <CModalHeader>
                        <CModalTitle id="actionModal">Update Member</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <CContainer>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-3 col-form-label">Nama Customer</CFormLabel>
                                <CCol sm={9}>
                                    <CFormInput type="text" placeholder="Input Nama Customer" onChange={(e) => setNama(e.target.value)} defaultValue={nama} />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-3 col-form-label">No. HP</CFormLabel>
                                <CCol sm={9}>
                                    <CFormInput type="text" placeholder="Input No. HP" onChange={(e) => setHp(e.target.value)} defaultValue={hp} />
                                </CCol>
                            </CRow>
                        </CContainer>
                    </CModalBody>

                    <CModalFooter>
                        {!loading ? <CButton color="warning" onClick={(e) => { updateMember(e) }}>Update</CButton>
                            : <CSpinner color="primary" className="float-end" variant="grow" />}
                    </CModalFooter>
                </>
            case "subscription":
                return <>
                    <CModalHeader>
                        <CModalTitle id="actionModal">Subscription Member</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <CContainer>
                            <CRow className="mb-3">
                                <CCol>
                                    <CFormLabel className="col-form-label">Nama Customer</CFormLabel>
                                </CCol>
                                <CCol sm={9}>
                                    {detail?.name}
                                </CCol>
                            </CRow>
                            <CRow className='mb-3'>
                                <CCol>
                                    <CFormLabel className="col-form-label">No. HP </CFormLabel>
                                </CCol>
                                <CCol sm={9}>
                                    {detail?.nomor}
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-3 col-form-label">Harga</CFormLabel>
                                <CCol sm={9}>
                                    <CFormInput type="text"
                                        placeholder="Input Harga"
                                        onChange={(e) => setHarga(e.target.value.replace(/,/g, ""))}
                                        value={formatNumber(harga)}
                                    />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-3 col-form-label">Expired</CFormLabel>
                                <CCol sm="auto">
                                    <CFormInput
                                        type="date"
                                        value={expired}
                                        onChange={(e) => setExpired(e.target.value)}
                                        placeholder="Expired Date"
                                        aria-label="Expired Date" />
                                </CCol>
                            </CRow>
                        </CContainer>
                    </CModalBody>

                    <CModalFooter>
                        {!loading ? <CButton color="success" onClick={(e) => { subscribe(e) }}>Subscribe</CButton>
                            : <CSpinner color="primary" className="float-end" variant="grow" />}
                    </CModalFooter>
                </>
            default:
                return <>
                    <CModalHeader>
                        <CModalTitle id="actionModal">Tambah Member</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <CContainer>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-3 col-form-label">Nama Customer</CFormLabel>
                                <CCol sm={9}>
                                    <CFormInput type="text" placeholder="Input Nama Customer" onChange={(e) => setNama(e.target.value)} defaultValue={nama} />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-3 col-form-label">No. HP</CFormLabel>
                                <CCol sm={9}>
                                    <CFormInput type="text" placeholder="Input No. HP" onChange={(e) => setHp(e.target.value)} defaultValue={hp} />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-3 col-form-label">Harga</CFormLabel>
                                <CCol sm={9}>
                                    <CFormInput type="text"
                                        placeholder="Input Harga"
                                        onChange={(e) => setHarga(e.target.value.replace(/,/g, ""))}
                                        value={formatNumber(harga)}
                                    />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-3 col-form-label">Expired</CFormLabel>
                                <CCol sm="auto">
                                    <CFormInput
                                        type="date"
                                        value={expired}
                                        onChange={(e) => setExpired(e.target.value)}
                                        placeholder="Expired Date"
                                        aria-label="Expired Date" />
                                </CCol>
                            </CRow>
                        </CContainer>
                    </CModalBody>

                    <CModalFooter>
                        {!loading ? <CButton color="success" onClick={(e) => { tambahMember(e) }}>Tambah</CButton>
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
                title={"Management Member"}
                column={[
                    { name: "#", key: "index" },
                    { name: "Nama", key: "name" },
                    { name: "No. HP", key: "nomor" },
                    // { name: "Expired", key: "expired" },
                    { name: "Subscription", key: "subscription" },
                    { name: "Status", key: "status" },
                    { name: "Action", key: "action" }
                ]}
                collection={"member"} // Ambil data dari koleksi "cashiers"
                filter={{}} // Bisa diberikan filter
                sort={{ createdAt: -1 }} // Sortir dari terbaru
                crudAction={[{ name: "Tambah Member", key: "add" }]}
                listStatus={[{ name: "AKTIF", color: "success" }, { name: "PAYMENT", color: "warning" }, { name: "EXPIRED", color: "danger" }]}
                refresh={refresh}
                setCancel={setCancel}
                setAction={setAction}
                setVisible={setVisible}
                setDetail={setDetail}
                setModal={setModal}
                setEdit={setEdit}
                setHapus={setHapus}
            />
            <CModal
                size="lg"
                scrollable
                alignment='center'
                visible={visible}
                onClose={() => { setNama(""); setHarga(0); setHp(""); setLoading(false); setDetail([]); setStatus(""); setClient(null); setVisible(false); setAction(null); }}
                aria-labelledby="actionModal"
            >
                {renderModal()}
            </CModal>
            <CModal
                size="lg"
                scrollable
                alignment='center'
                visible={modal}
                onClose={() => { setNama(""); setHarga(0); setHp(""); setModal(false); setDetail([]); setLoading(false); setClient(null); setAction(null); }}
                aria-labelledby="actionModal"
            >
                <CModalHeader>
                    <CModalTitle id="actionModal">Pembayaran Member</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CContainer>
                        <CRow className="align-items-start mb-2">
                            <CCol xs={4} sm={5} md={3}><b>Nama </b></CCol>
                            <CCol xs="auto" sm={"auto"} md={"auto"}>:</CCol>
                            <CCol> {detail?.name}</CCol>
                        </CRow>
                        <CRow className="align-items-start mb-2">
                            <CCol xs={4} sm={5} md={3}><b>No. HP </b></CCol>
                            <CCol xs="auto" sm={"auto"} md={"auto"}>:</CCol>
                            <CCol> {detail?.nomor}</CCol>
                        </CRow>
                        <CRow className="align-items-start mb-2">
                            <CCol xs={4} sm={5} md={3}><b>Expired </b></CCol>
                            <CCol xs="auto" sm={"auto"} md={"auto"}>:</CCol>
                            <CCol> {moment(detail?.expired).format("dddd, DD MMMM YYYY")}</CCol>
                        </CRow>
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
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                <CTableRow>
                                    <CTableDataCell>1x</CTableDataCell>
                                    <CTableDataCell>MEMBER {Math.ceil(moment.duration(moment(detail?.subscription?.expired).diff(moment())).asDays())} HARI</CTableDataCell>
                                    <CTableDataCell>{formatNumber(detail?.subscription?.harga)}</CTableDataCell>
                                </CTableRow>
                                <CTableRow>
                                    <CTableDataCell style={{ textAlign: "right" }} colSpan={2}><b>Total</b></CTableDataCell>
                                    <CTableDataCell>{formatNumber(detail?.subscription?.harga)}</CTableDataCell>
                                </CTableRow>
                                <CTableRow>
                                    <CTableDataCell style={{ textAlign: "right" }} colSpan={2}><b>Bayar</b></CTableDataCell>
                                    <CTableDataCell>
                                        <CFormInput type="text"
                                            placeholder="Input Bayar"
                                            onChange={(e) => {
                                                // if (/^\d*$/.test(e.target.value)) setHarga(e.target.value)
                                                setInputBayar(e.target.value.replace(/,/g, ""))
                                            }}
                                            value={formatNumber(inputBayar)}
                                        />
                                    </CTableDataCell>
                                </CTableRow>
                                <CTableRow>
                                    <CTableDataCell style={{ textAlign: "right" }} colSpan={2}><b>Kembali</b></CTableDataCell>
                                    <CTableDataCell>{formatNumber(Math.max(0, detail?.subscription?.harga - inputBayar))}</CTableDataCell>
                                </CTableRow>
                            </CTableBody>
                        </CTable>
                    </CContainer>
                    <CContainer>
                        <CRow className="justify-content-center mt-5">
                            <CCol>
                                <CCard>
                                    <CCardHeader className="text-center">
                                        <h5>Pilih Metode Pembayaran</h5>
                                    </CCardHeader>
                                    <CCardBody>
                                        <CRow className="mb-3">
                                            <CCol md="6">
                                                <CCard
                                                    className={`p-3 ${paymentMethod === 'cash' ? 'border-primary' : ''}`}
                                                    onClick={() => handlePaymentChange('cash')}
                                                    style={{ cursor: 'pointer', height: "125px" }}
                                                >
                                                    <CFormLabel htmlFor="cash" className="font-weight-bold">
                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                            <CIcon icon={cilCash} size="3xl" />
                                                            <CFormLabel htmlFor="ccard" className="font-weight-bold" style={{ paddingTop: "10px", paddingLeft: "10px" }}>Tunai</CFormLabel>
                                                        </div>
                                                    </CFormLabel>
                                                    <p className="small text-muted">Bayar dengan menggunakan uang tunai.</p>
                                                </CCard>
                                            </CCol>
                                            <CCol md="6">
                                                <CCard
                                                    className={`p-3 ${paymentMethod === 'cashless' ? 'border-primary' : ''}`}
                                                    onClick={() => handlePaymentChange('cashless')}
                                                    style={{ cursor: 'pointer', height: "125px" }}
                                                >
                                                    <CFormLabel htmlFor="cash" className="font-weight-bold">
                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                            <img src={qrisIcon} alt="QRIS" width={80} className="mr-2" />
                                                            <CFormLabel htmlFor="ccard" className="font-weight-bold" style={{ paddingTop: "10px", paddingLeft: "10px" }}>Non Tunai</CFormLabel>
                                                        </div>
                                                    </CFormLabel>
                                                    {/* <CFormLabel htmlFor="cash" className="font-weight-bold">Non Tunai</CFormLabel> */}
                                                    <p className="small text-muted">Bayar dengan menggunakan uang non tunai.</p>
                                                </CCard>
                                            </CCol>
                                        </CRow>
                                    </CCardBody>
                                </CCard>
                            </CCol>
                        </CRow>
                    </CContainer>
                    <CModalFooter>
                        <CButton color="primary" onClick={(e) => { pay(e) }}>Bayar</CButton>
                        <CButton color="danger" onClick={() => setModal(false)}>Close</CButton>
                    </CModalFooter>
                </CModalBody>
            </CModal>
        </Suspense>
    )
}

export default ManageMember