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
import api from '../../axiosInstance';
import ReactSelectAsync from 'react-select/async';

const ManageMenu = () => {
    const [loading, setLoading] = useState(false);

    const [action, setAction] = useState(null)
    const [visible, setVisible] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const [harga, setHarga] = useState("")
    const [item, setItem] = useState([])

    const [data, setData] = useState([])
    const [nama, setNama] = useState("")

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
                if (result.isConfirmed && hapus?.status === "KOSONG") {
                    try {
                        await api.delete("/data/delete", {
                            data: {
                                collection: "table",
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
    const fetchPriceOption = async () => {
        try {
            const response = await api.post('/data', {
                collection: "tablePrice",
                filter: {},
                sort: { label: 1 }
            })
            var tmpData = []
            response.data.forEach((data) => {
                tmpData.push({ label: `${data.name} (${formatNumber(data.harga)})`, labelStruk: data?.label ? data?.label : "", value: data._id, harga: data.harga, tipe: data.tipe, duration: data.duration, id: data._id })
            })
            console.log(tmpData)
            setData(tmpData);
        } catch (error) {
            console.error('Error fetching menu reports:', error);
            // Swal.fire('Error', 'Gagal memuat laporan menu', 'error');
        }
    };

    useEffect(() => {
        if (action === "edit") {
            var tmpItem = []
            edit?.priceList.map((data) => {
                tmpItem.push({ label: data?.name, labelStruk: data.label ? data.label : "", value: data.id, harga: data.harga, tipe: data.tipe, duration: data.duration })
            })
            console.log(tmpItem)
            setNama(edit?.name)
            setItem(tmpItem)
        }
    }, [action])

    useEffect(() => {
        fetchPriceOption()
    }, [refresh])

    const extractNumber = (id) => {
        // Menggunakan regex untuk mengekstrak angka
        const match = id.match(/\d+/);
        return match ? parseInt(match[0], 10) : 0;
    };

    const tambahTable = async (e) => {
        e.preventDefault();
        const docId = (Math.max(...data.map(item => extractNumber(item.id)))) >= 1 ? "table-" + (Math.max(...data.map(item => extractNumber(item.id))) + 1) : "table-1"
        const changedItem = item.map(({ labelStruk, label, ...rest }) => ({ ...rest, name: label, label: labelStruk }))
        setLoading(true)
        var dataForm = {
            orderId: "",
            client: "",
            item: [],
            timer: "",
            createdAt: moment().format().toString(),
            harga: 0,
            priceList: changedItem,
            start: "",
            end: "",
            id: docId,
            name: nama,
            status: "KOSONG"
        }
        const response = await api.post("/data/add", {
            collection: "table",
            data: dataForm
        });
        if (response.data) {
            Swal.fire({
                title: "Success!",
                text: "Berhasil menambahkan data baru",
                icon: "success"
            });
        } else {
            console.error('Error menambahkan data: ', error);
            Swal.fire({
                title: "Error!",
                text: "Gagal mnenambahkan data baru",
                icon: "error"
            });
        }
        setRefresh(!refresh)
        setVisible(false)
        setLoading(false)
    }

    const updateTable = async (e) => {
        e.preventDefault();
        setLoading(true)
        const changedItem = item.map(({ labelStruk, label, ...rest }) => ({ ...rest, name: label, label: labelStruk }))

        var dataForm = {
            priceList: changedItem,
            name: nama
        }
        try {
            await api.put("/data/update", {
                collection: "table",
                filter: { _id: edit._id },
                update: dataForm
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
                text: "Data gagal diperbarui",
                icon: "error"
            });
        }
        setVisible(false)
        setLoading(false)
    }

    const loadOption = (inputValue, callback) => {
        const options = data
        // // console.log(options)
        callback(options)
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
            data: PropTypes.object,
            id: PropTypes.string,
            selectProps: PropTypes.object,
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
            children: PropTypes.array,
            data: PropTypes.object,
            id: PropTypes.string,
            selectProps: PropTypes.object
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
                        <CModalTitle id="actionModal">Tambah Table</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <CContainer>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-2 col-form-label">Nama Table</CFormLabel>
                                <CCol sm={10}>
                                    <CFormInput type="text" placeholder="Input Nama Meja" onChange={(e) => setNama(e.target.value)} defaultValue={nama} />
                                </CCol>
                            </CRow>
                            <CRow className='mt-3'>
                                <hr />
                                <h4 style={{ textAlign: "center" }}>Price List</h4>
                                <hr />
                                <CTable>
                                    <CTableHead>
                                        <CTableRow>
                                            <CTableHeaderCell style={{ width: "50px" }}>Action</CTableHeaderCell>
                                            <CTableHeaderCell>Item</CTableHeaderCell>
                                        </CTableRow>
                                    </CTableHead>
                                    <CTableBody>
                                        {item?.map((data, idx) => {
                                            return (
                                                <CTableRow key={idx}>
                                                    <CTableDataCell>
                                                        <CButton color='danger' className='me-1' onClick={() => {
                                                            var tmpPrice = [...item]
                                                            tmpPrice?.splice(idx, 1)
                                                            // // console.log(tmpOrder)
                                                            setItem(tmpPrice)
                                                        }}>✗</CButton>
                                                    </CTableDataCell>


                                                    <CTableDataCell>
                                                        <ReactSelectAsync
                                                            defaultOptions
                                                            loadOptions={loadOption}
                                                            styles={customStyles}
                                                            placeholder="Pilih Item"
                                                            value={data}
                                                            menuPortalTarget={document.body}
                                                            onChange={(selected) => {
                                                                var tmpOrder = [...item];
                                                                tmpOrder[idx] = {
                                                                    ...selected
                                                                };
                                                                console.log(selected)
                                                                setItem(tmpOrder);
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
                                            <CTableDataCell colSpan={2} ><CButton color='success' onClick={() => {
                                                var tmpPrice = [...item]
                                                tmpPrice?.push({ harga: 0, name: "", tipe: "", duration: "" })
                                                setItem(tmpPrice)
                                            }}>+</CButton></CTableDataCell>
                                        </CTableRow>
                                    </CTableBody>
                                </CTable>
                            </CRow>
                        </CContainer>
                    </CModalBody >

                    <CModalFooter>
                        {!loading ? <CButton color="success" onClick={(e) => { tambahTable(e) }}>Tambah</CButton>
                            : <CSpinner color="primary" className="float-end" variant="grow" />}
                    </CModalFooter>
                </>
            case "edit":
                return <>
                    <CModalHeader>
                        <CModalTitle id="actionModal">Ubah Table</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <CContainer>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-2 col-form-label">Nama Table</CFormLabel>
                                <CCol sm={10}>
                                    <CFormInput type="text" placeholder="Input Nama Meja" onChange={(e) => setNama(e.target.value)} defaultValue={edit?.name} />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <hr />
                                <h4 style={{ textAlign: "center" }}>Price List</h4>
                                <hr />
                                <CTable>
                                    <CTableHead>
                                        <CTableRow>
                                            <CTableHeaderCell style={{ width: "50px" }}>Action</CTableHeaderCell>
                                            <CTableHeaderCell>Item</CTableHeaderCell>
                                        </CTableRow>
                                    </CTableHead>
                                    <CTableBody>
                                        {item?.map((data, idx) => {
                                            return (
                                                <CTableRow key={idx}>
                                                    <CTableDataCell>
                                                        <CButton color='danger' className='me-1' onClick={() => {
                                                            var tmpPrice = [...item]
                                                            tmpPrice?.splice(idx, 1)
                                                            // // console.log(tmpOrder)
                                                            setItem(tmpPrice)
                                                        }}>✗</CButton>
                                                    </CTableDataCell>


                                                    <CTableDataCell>
                                                        <ReactSelectAsync
                                                            defaultOptions
                                                            loadOptions={loadOption}
                                                            styles={customStyles}
                                                            placeholder="Pilih Item"
                                                            value={data}
                                                            menuPortalTarget={document.body}
                                                            onChange={(selected) => {
                                                                var tmpOrder = [...item];
                                                                tmpOrder[idx] = {
                                                                    ...selected
                                                                };
                                                                console.log(selected)
                                                                setItem(tmpOrder);
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
                                            <CTableDataCell colSpan={2} ><CButton color='success' onClick={() => {
                                                var tmpPrice = [...item]
                                                tmpPrice?.push({ harga: 0, name: "", tipe: "", duration: "" })
                                                setItem(tmpPrice)
                                            }}>+</CButton></CTableDataCell>
                                        </CTableRow>
                                    </CTableBody>
                                </CTable>
                            </CRow>
                        </CContainer>
                    </CModalBody>

                    <CModalFooter>
                        {!loading ? <CButton color="success" onClick={(e) => { updateTable(e) }}>Ubah</CButton>
                            : <CSpinner color="primary" className="float-end" variant="grow" />}
                    </CModalFooter>
                </>
            default:
                return <>
                    <CModalHeader>
                        <CModalTitle id="actionModal">Tambah Table</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <CContainer>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-2 col-form-label">Nama Table</CFormLabel>
                                <CCol sm={10}>
                                    <CFormInput type="text" placeholder="Input Nama Meja" onChange={(e) => setNama(e.target.value)} defaultValue={nama} />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <hr />
                                <h4 style={{ textAlign: "center" }}>Price List</h4>
                                <hr />
                                <CTable>
                                    <CTableHead>
                                        <CTableRow>
                                            <CTableHeaderCell style={{ width: "50px" }}>Action</CTableHeaderCell>
                                            <CTableHeaderCell>Item</CTableHeaderCell>
                                        </CTableRow>
                                    </CTableHead>
                                    <CTableBody>
                                        {item?.map((data, idx) => {
                                            return (
                                                <CTableRow key={idx}>
                                                    <CTableDataCell>
                                                        <CButton color='danger' className='me-1' onClick={() => {
                                                            var tmpPrice = [...item]
                                                            tmpPrice?.splice(idx, 1)
                                                            // // console.log(tmpOrder)
                                                            setItem(tmpPrice)
                                                        }}>✗</CButton>
                                                    </CTableDataCell>


                                                    <CTableDataCell>
                                                        <ReactSelectAsync
                                                            defaultOptions
                                                            loadOptions={loadOption}
                                                            styles={customStyles}
                                                            placeholder="Pilih Item"
                                                            value={data?.label}
                                                            menuPortalTarget={document.body}
                                                            onChange={(selected) => {
                                                                var tmpOrder = [...item];
                                                                tmpOrder[idx] = {
                                                                    ...selected
                                                                };
                                                                console.log(selected)
                                                                setItem(tmpOrder);
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
                                            <CTableDataCell colSpan={2} ><CButton color='success' onClick={() => {
                                                var tmpPrice = [...item]
                                                tmpPrice?.push({ harga: 0, name: "", tipe: "", duration: "" })
                                                setItem(tmpPrice)
                                            }}>+</CButton></CTableDataCell>
                                        </CTableRow>
                                    </CTableBody>
                                </CTable>
                            </CRow>
                        </CContainer>
                    </CModalBody>

                    <CModalFooter>
                        {!loading ? <CButton color="success" onClick={(e) => { tambahTable(e) }}>Tambah</CButton>
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
                title={"Management Table"}
                column={[
                    { name: "#", key: "index" },
                    { name: "Nama", key: "name" },
                    { name: "Price List", key: "priceList" },
                    { name: "Status", key: "status" },
                    { name: "Action", key: "action" }
                ]}
                // headers={['#', 'Nama Customer', 'Status', 'Booking', 'Created At', 'Action']}
                collection={"table"} // Ambil data dari koleksi "cashiers"
                filter={{}}
                sort={{ createdAt: -1 }} // Sortir dari terbaru
                crudAction={[{ name: "Tambah Table", key: "add" }]}
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
                onClose={() => { setNama(""); setItem([]); setVisible(false); setAction(null); }}
                aria-labelledby="actionModal"
            >
                {renderModal()}
            </CModal>

        </Suspense>
    )
}

export default ManageMenu