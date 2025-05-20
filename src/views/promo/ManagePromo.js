import { cilMediaStop, cilPencil, cilPrint } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CBadge, CButton, CCard, CCardBody, CCardHeader, CCardImage, CCol, CCollapse, CContainer, CFormCheck, CFormInput, CFormLabel, CFormSelect, CFormSwitch, CHeader, CInputGroup, CInputGroupText, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CPagination, CPaginationItem, CProgress, CRow, CSpinner, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import moment from 'moment';
import React, { Suspense, useEffect, useRef, useState } from 'react'
// import { firestore } from '../../Firebase';
import { collection, getDocs, onSnapshot, addDoc, setDoc, doc, query, where, orderBy, deleteDoc } from 'firebase/firestore';
import Swal from 'sweetalert2'
import AppTable from '../../components/AppTable';
import { formatNumber } from 'chart.js/helpers';
import Select, { components } from 'react-select';
import api from '../../axiosInstance';
import ReactSelectAsync from 'react-select/async';
import propTypes from 'prop-types';

const ManagePromo = () => {
    const [loading, setLoading] = useState(false);
    const [action, setAction] = useState(null)
    const [visible, setVisible] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const [trigger, setTrigger] = useState(false)
    const [harga, setHarga] = useState(0)
    const [mulai, setMulai] = useState(moment().format("YYYY-MM-DD"))
    const [akhir, setAkhir] = useState("")
    const [meja, setMeja] = useState([])
    const [status, setStatus] = useState("")
    const [isVariant, setIsVariant] = useState(false)

    const [totalMenu, setTotalMenu] = useState(0);
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [data, setData] = useState([])
    const [label, setLabel] = useState("")
    const [item, setItem] = useState([])
    const [menu, setMenu] = useState([])
    const [table, setTable] = useState([])
    const [filterValue, setFilterValue] = useState("")
    const [tableOptions, setTableOptions] = useState([{ value: "select-all", label: "Semua Table" }])
    const [useTable, setUseTable] = useState(true)

    const [nama, setNama] = useState("")

    const [edit, setEdit] = useState({});
    const [hapus, setHapus] = useState({});
    const [initMenu, setInitMenu] = useState(false)
    const [initTable, setInitTable] = useState(false)

    const selectRef = useRef(null);

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

    const groupBadgeStyles = {
        backgroundColor: '#EBECF0',
        borderRadius: '2em',
        color: '#172B4D',
        display: 'inline-block',
        fontSize: 12,
        fontWeight: 'normal',
        lineHeight: '1',
        minWidth: 1,
        padding: '0.16666666666667em 0.5em',
        textAlign: 'center',
        marginLeft: "10px",
        borderBottom: '1px solid'
    };

    const CustomOption = (props) => {
        const { innerRef, innerProps, isFocused, data } = props;

        const handleSelectAll = (event) => {
            event.stopPropagation();
            props.selectProps.onSelectAll();
        };

        return data.value === 'select-all' ? (
            <div
                ref={innerRef}
                {...innerProps}
                onClick={handleSelectAll}
                style={{
                    backgroundColor: isFocused ? '#e9ecef' : '#ffffff',
                    padding: '8px 10px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                }}
            >
                Select All
            </div>
        ) : (
            <components.Option {...props} />
        );
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
                                collection: "promo",
                                filter: { _id: hapus?._id }
                            }
                        });
                        setRefresh(!refresh)
                        Swal.fire({
                            title: "Deleted!",
                            text: "Data berhasil dihapus",
                            icon: "success"
                        });
                    } catch (error) {
                        console.error('Error deleting data:', error);
                        Swal.fire({
                            title: "Failed!",
                            text: "Data gagal dihapus",
                            icon: "error"
                        });
                    }
                }
            })
            setHapus({})
        }

    }, [hapus])
    // Fungsi untuk mengambil data booking
    const fetchMenu = async () => {
        try {
            const response = await api.post('/data', {
                collection: "menu",
                filter: {},
                sort: { name: 1 }
            })
            var tmpData = []
            response.data.forEach((data) => {
                tmpData.push({ id: data._id, harga: data?.harga, name: data?.name, category: data?.category, value: data._id, label: `${data?.name} (${formatNumber(data?.harga)})` })
            })
            setMenu(tmpData);
            // setInitData(true);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            // Swal.fire('Error', 'Gagal memuat data booking', 'error');
        }
    }

    const fetchTablePrice = async () => {
        try {
            const response = await api.post('/data', {
                collection: "tablePrice",
                filter: {},
                sort: { name: 1 }
            })
            var tmpData = []
            response.data.forEach((data) => {
                tmpData.push({
                    id: data._id, harga: data?.harga, duration: data?.duration,
                    name: data?.name, tipe: data?.tipe, value: data._id, label: `${data?.name} (${formatNumber(data?.harga)})`
                })
            })
            setTable(tmpData);
            // setInitData(true);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            // Swal.fire('Error', 'Gagal memuat data booking', 'error');
        }
    }


    useEffect(() => {
        fetchMenu()
        fetchTablePrice()
    }, [refresh])

    useEffect(() => {
        if (action === "edit") {
            edit?.item?.map((data) => {
                data.name = { label: `${data.name} (${data.harga})`, value: data.id, name: data.name }
                data.value = data.id
            })
            console.log(edit)
            setNama(edit?.name)
            setHarga(edit?.harga)
            setItem(edit?.item)
            setLabel(edit?.label)
        }
    }, [action])

    const handleHoursChange = (e) => {
        // console.log(e.target.value.replace(/^0+/, ""))
        const tmpVal = e.target.value.replace(/^0+/, "");
        setHours(tmpVal);
    };

    const handleMinutesChange = (e) => {
        const tmpVal = minutes !== "" ? e.target.value.replace(/^0+/, "") : e.target.value;
        setMinutes(tmpVal);
    };

    const handleChange = (selected) => {
        // Check if "Select All" option was selected
        const selectAllOption = selected?.find(option => option.value === 'select-all');
        if (selectAllOption) {
            if (meja.length === tableOptions.length) {
                setMeja([]);
            } else {
                setMeja(tableOptions);
            }
        } else {
            setMeja(selected);
        }
    };

    const handleSelectAll = () => {
        setMeja(meja.length === tableOptions.length ? [] : tableOptions);
        selectRef.current.blur();
    };

    const tambahPromo = async (e) => {
        e.preventDefault();
        setLoading(true)
        const tmpItem = item.map((item) => {
            item.name = item.name.name
            delete item.category
            delete item.isNew
            delete item.label
            delete item.value
            if (!item?.tipe) item.addOns = []
            return item
        })

        const data = {
            name: nama,
            harga: harga,
            item: tmpItem,
            label,
            createdAt: moment().format().toString(),
            status: "LISTED"
        }
        try {
            const response = await api.post("/data/add", {
                collection: "promo",
                data: data
            });
            setRefresh(!refresh)

            Swal.fire({
                title: "Success!",
                text: "Berhasil menambahkan data baru",
                icon: "success"
            });
        } catch (error) {
            console.error('Error adding item:', error);
            Swal.fire({
                title: "Error!",
                text: "Gagal menambahkan data baru",
                icon: "error"
            });
        } finally {
            setLoading(false);
            setVisible(false);
        }
    }

    const updatePromo = async (e) => {
        e.preventDefault();
        setLoading(true)
        const tmpItem = item.map((item) => {
            item.name = item.name.name
            delete item.category
            delete item.label
            delete item.value
            if (!item?.tipe) item.addOns = []
            return item
        })
        var dataForm = {
            harga: harga,
            name: nama,
            item: tmpItem,
            label,
            updatedAt: moment().format().toString(),
            status: "LISTED"
        }
        try {
            await api.put("/data/update", {
                collection: "promo",
                filter: { _id: edit?._id },
                update: dataForm
            });
            setRefresh(!refresh)

            Swal.fire({
                title: "Success!",
                text: "Berhasil memperbarui data",
                icon: "success"
            });
        } catch (error) {
            console.error('Error updating item:', error);
            Swal.fire({
                title: "Error!",
                text: "Gagal memperbarui data",
                icon: "error"
            });
        } finally {
            setLoading(false);
            setVisible(false);
        }
    }

    const loadOption = (inputValue, callback) => {
        const options = [
            { label: "Game Pass", options: table },
            { label: "Menu", options: menu },
        ]
        // // console.log(options)
        callback(options)
    }

    const filterOption = (option, inputValue) => {
        return option?.label.toLowerCase().includes(inputValue)
    }

    const formatGroupLabel = (data) => {
        // // console.log(data)
        var tmpFilter = data.options.filter((val) => { return val.label.toLowerCase().includes(filterValue) })
        if (data?.options[0]?.label === "") {
            return <div style={{ borderBottom: "1px solid #EBECF0", paddingBottom: "5px" }}>
                <span>{data.label}</span>
                <span id={data.label.replaceAll(" ", "_")} style={groupBadgeStyles}>{0}</span>
            </div>
        } else {
            return <div style={{ borderBottom: "1px solid #EBECF0", paddingBottom: "5px" }}>
                <span>{data.label}</span>
                <span id={data.label.replaceAll(" ", "_")} style={groupBadgeStyles}>{tmpFilter.length}</span>
            </div>
        }
    };

    const GroupHeading = (props) => {
        GroupHeading.propTypes = {
            data: propTypes.object,
            id: propTypes.string,
            selectProps: propTypes.object,
        };
        var key = props.data.label.replaceAll(" ", "_")
        var data = sessionStorage.getItem(key)
        return <components.GroupHeading {...props}
            onClick={() => {
                if (props.data.options[0]?.label !== "") sessionStorage.setItem(key, !(/true/).test(data))
                setTrigger(!trigger)
            }}
        />
    };

    const HideGroupChildren = (props) => {
        HideGroupChildren.propTypes = {
            children: propTypes.array,
            data: propTypes.object,
            id: propTypes.string,
            selectProps: propTypes.object
        };
        var key = props.data.label.replaceAll(" ", "_")
        var data = sessionStorage.getItem(key)
        return <components.Group {...props}>
            <CCollapse visible={(/true/).test(data)}>
                {props.children[0]?.label !== "" && props.children}
            </CCollapse>
        </components.Group>
    };

    const renderModal = () => {
        switch (action) {
            case "add":
                return <>
                    <CModalHeader>
                        <CModalTitle id="actionModal">Tambah Promo</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <CContainer>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-3 col-form-label">Nama Promo</CFormLabel>
                                <CCol sm={9}>
                                    <CFormInput type="text" placeholder="Input Nama Promo" onChange={(e) => setNama(e.target.value)} defaultValue={nama} />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-3 col-form-label">Label Struk</CFormLabel>
                                <CCol sm={9}>
                                    <CFormInput type="text"
                                        placeholder="Input Label Struk (Max 13 Char)"
                                        maxLength={13}
                                        onChange={(e) => setLabel(e.target.value.replace(/,/g, ""))}
                                        value={label}
                                    />
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
                            <CRow>
                                <hr />
                                <h4 style={{ textAlign: "center" }}>Order List</h4>
                                <hr />
                                <CTable>
                                    <CTableHead>
                                        <CTableRow>
                                            <CTableHeaderCell style={{ width: "100px" }}>Action</CTableHeaderCell>
                                            <CTableHeaderCell style={{ width: "100px" }}>Qty</CTableHeaderCell>
                                            <CTableHeaderCell style={{ width: "600px" }}>Item</CTableHeaderCell>
                                        </CTableRow>
                                    </CTableHead>
                                    <CTableBody>
                                        {item?.map((data, idx) => {
                                            return (
                                                <CTableRow key={idx}>
                                                    <CTableDataCell>
                                                        <CButton color='danger' className='me-1' onClick={() => {
                                                            var tmpItem = [...item]
                                                            tmpItem.splice(idx, 1)
                                                            // // console.log(tmpOrder)
                                                            setItem(tmpItem)
                                                        }}>✗</CButton>
                                                    </CTableDataCell>
                                                    <CTableDataCell><CFormInput type="number" min={1} value={data?.qty} onChange={(e) => {
                                                        var tmpItem = [...item]
                                                        // console.log(e.target.value)
                                                        tmpItem[idx] = { ...tmpItem[idx], qty: e.target.value };
                                                        setItem(tmpItem)
                                                    }} /></CTableDataCell>
                                                    <CTableDataCell>
                                                        <ReactSelectAsync
                                                            defaultOptions
                                                            isSearchable
                                                            loadOptions={loadOption}
                                                            filterOption={filterOption}
                                                            styles={customStyles}
                                                            placeholder="Pilih Item"
                                                            value={data?.name}
                                                            menuPortalTarget={document.body}
                                                            onChange={(selected) => {
                                                                var tmpItem = [...item]
                                                                tmpItem[idx] = {
                                                                    ...tmpItem[idx],
                                                                    ...selected,
                                                                    name: selected,
                                                                };
                                                                setItem(tmpItem);
                                                            }}
                                                            formatGroupLabel={formatGroupLabel}
                                                            components={{
                                                                GroupHeading: GroupHeading,
                                                                Group: HideGroupChildren,
                                                            }}
                                                        />
                                                    </CTableDataCell>
                                                </CTableRow>
                                            )
                                        })}
                                        <CTableRow>
                                            <CTableDataCell colSpan={5} ><CButton color='success' onClick={() => {
                                                var tmpItem = [...item]
                                                tmpItem.push({ qty: 1, harga: "", name: null, isNew: true })
                                                setItem(tmpItem)
                                            }}>+</CButton></CTableDataCell>
                                        </CTableRow>
                                    </CTableBody>
                                </CTable>
                            </CRow>
                        </CContainer>
                    </CModalBody>

                    <CModalFooter>
                        {!loading ? <CButton color="success" onClick={(e) => { tambahPromo(e) }}>Tambah</CButton>
                            : <CSpinner color="primary" className="float-end" variant="grow" />}
                    </CModalFooter>
                </>
            case "edit":
                return <>
                    <CModalHeader>
                        <CModalTitle id="actionModal">Update Promo</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <CContainer>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-3 col-form-label">Nama Promo</CFormLabel>
                                <CCol sm={9}>
                                    <CFormInput type="text" placeholder="Input Nama Promo" onChange={(e) => setNama(e.target.value)} defaultValue={nama} />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-3 col-form-label">Label Struk</CFormLabel>
                                <CCol sm={9}>
                                    <CFormInput type="text"
                                        placeholder="Input Label Struk (Max 13 Char)"
                                        maxLength={13}
                                        onChange={(e) => setLabel(e.target.value.replace(/,/g, ""))}
                                        value={label}
                                    />
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
                            <CRow>
                                <hr />
                                <h4 style={{ textAlign: "center" }}>Order List</h4>
                                <hr />
                                <CTable>
                                    <CTableHead>
                                        <CTableRow>
                                            <CTableHeaderCell style={{ width: "100px" }}>Action</CTableHeaderCell>
                                            <CTableHeaderCell style={{ width: "100px" }}>Qty</CTableHeaderCell>
                                            <CTableHeaderCell style={{ width: "600px" }}>Item</CTableHeaderCell>
                                        </CTableRow>
                                    </CTableHead>
                                    <CTableBody>
                                        {item?.map((data, idx) => {
                                            return (
                                                <CTableRow key={idx}>
                                                    <CTableDataCell>
                                                        <CButton color='danger' className='me-1' onClick={() => {
                                                            var tmpItem = [...item]
                                                            tmpItem.splice(idx, 1)
                                                            // // console.log(tmpOrder)
                                                            setItem(tmpItem)
                                                        }}>✗</CButton>
                                                    </CTableDataCell>
                                                    <CTableDataCell><CFormInput type="number" min={1} value={data?.qty} onChange={(e) => {
                                                        var tmpItem = [...item]
                                                        // console.log(e.target.value)
                                                        tmpItem[idx] = { ...tmpItem[idx], qty: e.target.value };
                                                        setItem(tmpItem)
                                                    }} /></CTableDataCell>
                                                    <CTableDataCell>
                                                        <ReactSelectAsync
                                                            defaultOptions
                                                            isSearchable
                                                            loadOptions={loadOption}
                                                            filterOption={filterOption}
                                                            styles={customStyles}
                                                            placeholder="Pilih Item"
                                                            value={data?.name}
                                                            menuPortalTarget={document.body}
                                                            onChange={(selected) => {
                                                                var tmpItem = [...item]
                                                                tmpItem[idx] = {
                                                                    ...tmpItem[idx],
                                                                    ...selected,
                                                                    name: selected,
                                                                };
                                                                setItem(tmpItem);
                                                            }}
                                                            formatGroupLabel={formatGroupLabel}
                                                            components={{
                                                                GroupHeading: GroupHeading,
                                                                Group: HideGroupChildren,
                                                            }}
                                                        />
                                                    </CTableDataCell>
                                                </CTableRow>
                                            )
                                        })}
                                        <CTableRow>
                                            <CTableDataCell colSpan={5} ><CButton color='success' onClick={() => {
                                                var tmpItem = [...item]
                                                tmpItem.push({ qty: 1, harga: "", name: null, isNew: true })
                                                setItem(tmpItem)
                                            }}>+</CButton></CTableDataCell>
                                        </CTableRow>
                                    </CTableBody>
                                </CTable>
                            </CRow>
                        </CContainer>
                    </CModalBody>

                    <CModalFooter>
                        {!loading ? <CButton color="warning" onClick={(e) => { updatePromo(e) }}>Update </CButton>
                            : <CSpinner color="primary" className="float-end" variant="grow" />}
                    </CModalFooter>
                </>

            default:
                return <>
                    <CModalHeader>
                        <CModalTitle id="actionModal">Tambah Promo</CModalTitle>
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
                                <CFormLabel className="col-sm-2 col-form-label">Harga</CFormLabel>
                                <CCol sm={10}>
                                    <CFormInput type="text"
                                        placeholder="Input Harga"
                                        onChange={(e) => setHarga(e.target.value.replace(/,/g, ""))}
                                        value={formatNumber(harga)}
                                    />
                                </CCol>
                            </CRow>
                        </CContainer>
                    </CModalBody>

                    <CModalFooter>
                        {!loading ? <CButton color="success" onClick={(e) => { tambahPromo(e) }}>Tambah</CButton>
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
                title={"Management Promo"}
                column={[
                    { name: "#", key: "index" },
                    { name: "Nama Promo", key: "name" },
                    // { name: "List Item", key: "menu" },
                    // { name: "List Table", key: "table" },
                    { name: "Harga", key: "harga" },
                    // { name: "Periode Promo", key: "date" },
                    { name: "Status", key: "status" },
                    { name: "Action", key: "action" }
                ]}
                // headers={['#', 'Nama Customer', 'Status', 'Booking', 'Created At', 'Action']}
                collection={"promo"} // Ambil data dari koleksi "cashiers"
                filter={{}} // Bisa diberikan filter
                sort={{ createdAt: -1 }} // Sortir dari terbaru
                crudAction={[{ name: "Tambah Promo", key: "add" }]}
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
                onClose={() => { setTotalMenu(0); setLabel(""); setNama(""); setHarga(0); setMeja([]); setHours(0); setMinutes(0); setItem([]); setVisible(false); setAction(null); }}
                aria-labelledby="actionModal"
            >
                {renderModal()}
            </CModal>

        </Suspense>
    )
}

export default ManagePromo