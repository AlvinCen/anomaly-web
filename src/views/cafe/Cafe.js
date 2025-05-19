import { cilMediaStop, cilPencil, cilPrint } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CBadge, CButton, CCard, CCardBody, CCardHeader, CCardImage, CCol, CContainer, CFormInput, CFormLabel, CFormSelect, CHeader, CInputGroup, CInputGroupText, CListGroup, CListGroupItem, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CPagination, CPaginationItem, CProgress, CRow, CSpinner, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import moment from 'moment';
import React, { useEffect, useState } from 'react'
// import { firestore } from '../../Firebase';
import { collection, getDocs, onSnapshot, addDoc, setDoc, doc, query, where, orderBy, deleteDoc } from 'firebase/firestore';
import Swal from 'sweetalert2'
import AppTable from '../../components/AppTable';
import { formatNumber } from 'chart.js/helpers';
import ReactSelectAsync from 'react-select/async';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';


const Cafe = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const { currentUser } = useAuth();


    const [loading, setLoading] = useState(false);

    const [detail, setDetail] = useState(null)
    const [action, setAction] = useState(null)
    const [visible, setVisible] = useState(false)
    const [harga, setHarga] = useState(0)
    const [client, setClient] = useState("")
    const [tipe, setTipe] = useState("open")
    const [cashier, setCashier] = useState("")
    const [createdAt, setCreatedAt] = useState("")

    const [data, setData] = useState([])
    const [nama, setNama] = useState("")
    const [stok, setStok] = useState(1)
    const [status, setStatus] = useState("")

    const [edit, setEdit] = useState({});
    const [hapus, setHapus] = useState({});

    var total = 0;

    useEffect(() => {
        if (Object.keys(hapus).length > 0) {
            Swal.fire({
                title: "Konfirmasi",
                html: `<p>Apakah anda yakin menghapus data <b>${hapus?.id}</b>?</p>`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Ya",
                cancelButtonText: "Batal"
            }).then(async (result) => {
                if (result.isConfirmed) {
                    await deleteDoc(doc(firestore, "cafe", hapus?.id))
                        .then(() => {
                            // Lakukan apa yang perlu dilakukan setelah data berhasil ditambahkan
                            Swal.fire({
                                title: "Deleted!",
                                text: "Data berhasil dihapus",
                                icon: "success"
                            });
                        })
                        .catch((error) => {
                            Swal.fire({
                                title: "Failed!",
                                text: "Data gagal dihapus",
                                icon: "error"
                            });
                            console.error('Error menambahkan data: ', error);
                        });
                }
            })
            setHapus({})
        }

    }, [hapus])

    const serve = async (id) => {
        try {
            const update = await setDoc(doc(firestore, "cafe", id), { status: "READY" }, { merge: true })
            Swal.fire({
                title: "Success!",
                text: "Status berhasil diubah",
                icon: "success"
            });
        } catch (err) {
            Swal.fire({
                title: "Failed!",
                text: "Status gagal diubah",
                icon: "error"
            });
        }
    }

    const finish = async (id, tipe) => {
        // console.log(id, tipe)
        try {
            const update = await setDoc(doc(firestore, "cafe", id), { status: tipe === "close" ? "CLOSE" : "PAYMENT" }, { merge: true })
            Swal.fire({
                title: "Success!",
                text: "Status berhasil diubah",
                icon: "success"
            });
        } catch (err) {
            Swal.fire({
                title: "Failed!",
                text: "Status gagal diubah",
                icon: "error"
            });
        }
        setVisible(false)
    }

    const updateHarga = async (e) => {
        // console.log(id, tipe)
        try {
            const update = await setDoc(doc(firestore, "cafe", edit?.id), { item: edit?.item }, { merge: true })
            Swal.fire({
                title: "Success!",
                text: "Data berhasil diubah",
                icon: "success"
            });
        } catch (err) {
            Swal.fire({
                title: "Failed!",
                text: "Data gagal diubah",
                icon: "error"
            });
        }
    }

    const titleCase = (str) => {
        if (str !== "" && str) {
            var splitStr = str.toLowerCase().split(' ');
            for (var i = 0; i < splitStr.length; i++) {
                // You do not need to check if i is larger than splitStr length, as your for does that for you
                // Assign it back to the array
                splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
            }
            // Directly return the joined string
            return splitStr.join(' ');
        } else return ""

    }

    useEffect(() => {
        if (action === "edit") {
            // console.log(edit)
            setCreatedAt(edit?.createdAt)
            setClient(edit?.client)
            setTipe(edit?.order)
            setCashier(edit?.cashier)
        } else if (action === "detail") {
            setEdit(detail)
            setCreatedAt(detail?.createdAt)
            setClient(detail?.client)
            setTipe(detail?.order)
            setCashier(detail?.cashier)
        }
    }, [action])

    const renderModal = () => {
        switch (action) {
            case "edit":
                return <>
                    <CModalHeader>
                        <CModalTitle id="actionModal">Ubah Order</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <CContainer>
                            <CRow className='mb-3'>
                                <CFormLabel className="col-sm-3 col-form-label">Nama Customer </CFormLabel>
                                <CCol>
                                    <CFormInput type="text"
                                        value={client}
                                        plainText
                                    />
                                </CCol>
                            </CRow>
                            <CRow className='mb-3'>
                                <CFormLabel className="col-sm-3 col-form-label">Tipe Order</CFormLabel>
                                <CCol>
                                    <CFormInput type="text"
                                        value={titleCase(tipe) + " Bill"}
                                        plainText
                                    />
                                </CCol>
                            </CRow>
                            <CRow className='mb-3'>
                                <CFormLabel className="col-sm-3 col-form-label">Nama Operator</CFormLabel>
                                <CCol>
                                    <CFormInput type="text"
                                        value={cashier}
                                        plainText />
                                </CCol>
                            </CRow>
                            <CContainer className='mt-3'>
                                <hr />
                                <h4 style={{ textAlign: "center" }}>Order List</h4>
                                <hr />
                                <CTable>
                                    <CTableHead>
                                        <CTableRow>
                                            <CTableHeaderCell style={{ width: "60px" }}>Qty</CTableHeaderCell>
                                            <CTableHeaderCell style={{ width: "25rem" }}>Item</CTableHeaderCell>
                                            <CTableHeaderCell style={{ width: "10rem" }}>Harga</CTableHeaderCell>
                                            <CTableHeaderCell style={{ width: "10rem" }}>Sub Total</CTableHeaderCell>
                                        </CTableRow>
                                    </CTableHead>
                                    <CTableBody>
                                        {edit?.item?.map((item, idx) => {
                                            // console.log(item)
                                            total = edit?.item?.reduce((total, item) => {
                                                var totalAddOn = item?.addOns ? item?.addOns?.reduce((total1, item1) => {
                                                    return total1 + Number(item1.harga);
                                                }, 0) : 0
                                                return total + totalAddOn + Number(item.harga * item.qty);
                                            }, 0)
                                            var totalAddOn = item?.addOns ? item?.addOns?.reduce((total1, item1) => {
                                                return total1 + Number(item1.harga);
                                            }, 0) : 0

                                            // setTotal(tmpTotal)
                                            var isAdmin = currentUser?.role === "superadmin"
                                            return (
                                                <CTableRow key={idx}>
                                                    <CTableDataCell>
                                                        <CFormInput type="number" value={item?.qty} readOnly plainText />
                                                    </CTableDataCell>

                                                    <CTableDataCell>
                                                        <CFormInput type="text" value={item?.name} readOnly plainText />
                                                        {item.addOns && item.addOns.length > 0 && (
                                                            <div className="mt-2">
                                                                <strong>Add-ons:</strong>
                                                                <ul className="mb-0">
                                                                    {item.addOns.map((addon, index) => (
                                                                        <li key={index} className="small">
                                                                            {addon.name} (+Rp. {formatNumber(addon.harga)})
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}
                                                        {item?.note && <div className="mt-2"> <strong>Note: </strong>{item.note}</div>}
                                                    </CTableDataCell>

                                                    <CTableDataCell><CFormInput type="text"
                                                        value={formatNumber(Number(item?.harga) + Number(totalAddOn))}
                                                        onChange={(e) => {
                                                            var tmpItem = { ...edit }
                                                            tmpItem.item[idx].harga = e.target.value.replace(/,/g, "")
                                                            setEdit(tmpItem)
                                                        }}
                                                        readOnly={!isAdmin} plainText={!isAdmin}
                                                    /></CTableDataCell>
                                                    <CTableDataCell><CFormInput type="text" value={formatNumber((Number(item?.harga) + Number(totalAddOn)) * (item?.qty ? item?.qty : 1))} readOnly plainText /></CTableDataCell>


                                                </CTableRow>
                                            )
                                        })}

                                        <CTableRow>
                                            <CTableDataCell colSpan={3} style={{ textAlign: "right" }}><b>Total</b></CTableDataCell>
                                            <CTableDataCell>{formatNumber(total)}</CTableDataCell>

                                        </CTableRow>
                                        <CTableRow>
                                            <CTableDataCell colSpan={3} style={{ textAlign: "right" }} ><b>Service Charge (10%)</b></CTableDataCell>
                                            <CTableDataCell>{formatNumber(Math.ceil(total * 0.1))}</CTableDataCell>
                                        </CTableRow>
                                        <CTableRow>
                                            <CTableDataCell colSpan={3} style={{ textAlign: "right" }} ><b>Tax Charge (10%)</b></CTableDataCell>
                                            <CTableDataCell>{formatNumber(Math.ceil(total * 0.1))}</CTableDataCell>
                                        </CTableRow>
                                        <CTableRow>
                                            <CTableDataCell colSpan={3} style={{ textAlign: "right" }} ><b>Grand Total</b></CTableDataCell>
                                            <CTableDataCell>{formatNumber(total + Math.ceil(total * 0.2))}</CTableDataCell>
                                        </CTableRow>
                                    </CTableBody>
                                </CTable>
                            </CContainer>
                        </CContainer>
                    </CModalBody>

                    <CModalFooter>
                        {currentUser?.role === "superadmin" &&
                            <CButton color="warning" onClick={(e) => {
                                updateHarga(e)
                            }}>
                                Ubah Harga
                            </CButton>}
                        <CButton color="success" onClick={(e) => {
                            sessionStorage.setItem('cartItems', JSON.stringify(edit?.item))
                            sessionStorage.setItem('tmpCartItems', JSON.stringify(edit?.item))
                            navigate(location.pathname + "/order/edit", { state: edit?.id })
                        }}>Ubah Order</CButton>
                    </CModalFooter>
                </>
            default:
                return <>
                    <CModalHeader>
                        <CModalTitle id="actionModal">Detail Order</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <CContainer>
                            <CRow className='mb-3'>
                                <CFormLabel className="col-sm-3 col-form-label">Pesanan dibuat tanggal </CFormLabel>
                                <CCol>
                                    <CFormInput type="text"
                                        value={moment(createdAt).format("dddd, DD MMMM YYYY HH:mm:ss")}
                                        plainText
                                    />
                                </CCol>
                            </CRow>
                            <CRow className='mb-3'>
                                <CFormLabel className="col-sm-3 col-form-label">Nama Customer </CFormLabel>
                                <CCol>
                                    <CFormInput type="text"
                                        value={client}
                                        plainText
                                    />
                                </CCol>
                            </CRow>
                            <CRow className='mb-3'>
                                <CFormLabel className="col-sm-3 col-form-label">Tipe Order</CFormLabel>
                                <CCol>
                                    <CFormInput type="text"
                                        value={titleCase(tipe) + " Bill"}
                                        plainText
                                    />
                                </CCol>
                            </CRow>
                            <CRow className='mb-3'>
                                <CFormLabel className="col-sm-3 col-form-label">Nama Operator</CFormLabel>
                                <CCol>
                                    <CFormInput type="text"
                                        value={cashier}
                                        plainText />
                                </CCol>
                            </CRow>
                            <CContainer className='mt-3'>
                                <hr />
                                <h4 style={{ textAlign: "center" }}>Order List</h4>
                                <hr />
                                <CTable>
                                    <CTableHead>
                                        <CTableRow>
                                            <CTableHeaderCell style={{ width: "60px" }}>Qty</CTableHeaderCell>
                                            <CTableHeaderCell style={{ width: "25rem" }}>Item</CTableHeaderCell>
                                            <CTableHeaderCell style={{ width: "10rem" }}>Harga</CTableHeaderCell>
                                            <CTableHeaderCell style={{ width: "10rem" }}>Sub Total</CTableHeaderCell>
                                        </CTableRow>
                                    </CTableHead>
                                    <CTableBody>
                                        {edit?.item?.map((item, idx) => {
                                            // console.log(item)
                                            total = edit?.item?.reduce((total, item) => {
                                                var totalAddOn = item?.addOns ? item?.addOns?.reduce((total1, item1) => {
                                                    return total1 + Number(item1.harga);
                                                }, 0) : 0
                                                return total + totalAddOn + Number(item.harga * item.qty);
                                            }, 0)
                                            var totalAddOn = item?.addOns ? item?.addOns?.reduce((total1, item1) => {
                                                return total1 + Number(item1.harga);
                                            }, 0) : 0
                                            // setTotal(tmpTotal)
                                            return (
                                                <CTableRow key={idx}>
                                                    <CTableDataCell>
                                                        <CFormInput type="number" value={item?.qty} readOnly plainText />
                                                    </CTableDataCell>

                                                    <CTableDataCell>
                                                        <CFormInput type="text" value={item?.name} readOnly plainText />
                                                        {item.addOns && item.addOns.length > 0 && (
                                                            <div className="mt-2">
                                                                <strong>Add-ons:</strong>
                                                                <ul className="mb-0">
                                                                    {item.addOns.map((addon, index) => (
                                                                        <li key={index} className="small">
                                                                            {addon.name} (+Rp. {formatNumber(addon.harga)})
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}
                                                        {item?.note && <div className="mt-2"> <strong>Note: </strong>{item.note}</div>}
                                                    </CTableDataCell>

                                                    <CTableDataCell><CFormInput type="text"
                                                        value={formatNumber(Number(item?.harga) + Number(totalAddOn))}
                                                        readOnly plainText
                                                    /></CTableDataCell>
                                                    <CTableDataCell><CFormInput type="text" value={formatNumber((Number(item?.harga) + Number(totalAddOn)) * (item?.qty ? item?.qty : 1))} readOnly plainText /></CTableDataCell>


                                                </CTableRow>
                                            )
                                        })}

                                        <CTableRow>
                                            <CTableDataCell colSpan={3} style={{ textAlign: "right" }}><b>Total</b></CTableDataCell>
                                            <CTableDataCell>{formatNumber(total)}</CTableDataCell>

                                        </CTableRow>
                                        <CTableRow>
                                            <CTableDataCell colSpan={3} style={{ textAlign: "right" }} ><b>Service Charge (10%)</b></CTableDataCell>
                                            <CTableDataCell>{formatNumber(Math.ceil(total * 0.1))}</CTableDataCell>
                                        </CTableRow>
                                        <CTableRow>
                                            <CTableDataCell colSpan={3} style={{ textAlign: "right" }} ><b>Tax Charge (10%)</b></CTableDataCell>
                                            <CTableDataCell>{formatNumber(Math.ceil(total * 0.1))}</CTableDataCell>
                                        </CTableRow>
                                        <CTableRow>
                                            <CTableDataCell colSpan={3} style={{ textAlign: "right" }} ><b>Grand Total</b></CTableDataCell>
                                            <CTableDataCell>{formatNumber(total + Math.ceil(total * 0.2))}</CTableDataCell>
                                        </CTableRow>
                                    </CTableBody>
                                </CTable>
                            </CContainer>
                        </CContainer>
                    </CModalBody>

                    <CModalFooter>
                        <CButton color="success" onClick={(e) => {
                            setVisible(false)
                        }}>Close</CButton>
                    </CModalFooter>
                </>
        }
    }

    return (
        <>
            <AppTable
                title={"History Cafe Order"}
                column={[
                    { name: "#", key: "index" },
                    { name: "Nama Customer", key: "client" },
                    { name: "Pesanan", key: "item" },
                    { name: "Tipe Order", key: "order" },
                    { name: "Status", key: "status" },
                    { name: "Action", key: "action" }
                ]}
                // headers={['#', 'Nama Customer', 'Status', 'Booking', 'Created At', 'Action']}
                collection={"cashiers"} // Ambil data dari koleksi "cashiers"
                filter={{}} // Bisa diberikan filter
                sort={{ createdAt: -1 }} // Sortir dari terbaru                
                crudAction={[{ name: "Buat Order", key: "add", href: "/order" }]}
                listStatus={[
                    { name: "ON PROCESS", color: "primary" },
                    { name: "PAYMENT", color: "warning" },
                    { name: "CLOSE", color: "black" },
                    { name: "READY", color: "success" }
                ]}
                func={serve}
                func1={finish}
                filterDate={true}
                setParentData={setData}
                setDetail={setDetail}
                setModal={setVisible}
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
                onClose={() => { setNama(""); setHarga(0); setStok(0); setStatus(""); setVisible(false); setAction(null); }}
                aria-labelledby="actionModal"
            >
                {renderModal()}
            </CModal>

        </>
    )
}

export default Cafe