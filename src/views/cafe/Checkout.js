import { cilMediaStop, cilPencil, cilPrint } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CBadge, CButton, CCard, CCardBody, CCardHeader, CCardImage, CCol, CContainer, CForm, CFormCheck, CFormInput, CFormLabel, CFormSelect, CHeader, CInputGroup, CInputGroupText, CListGroup, CListGroupItem, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CPagination, CPaginationItem, CProgress, CRow, CSpinner, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react'
import CategoryFilter from "../../components/CategoryFilter"
import Cart from "../../components/Cart"
import ProductList from "../../components/ProductList"
// import { collection, getDocs, onSnapshot, addDoc, setDoc, doc, query, where, orderBy, deleteDoc, writeBatch, limit, getDoc } from 'firebase/firestore';
import Swal from 'sweetalert2'
import AppTable from '../../components/AppTable';
import { formatNumber } from 'chart.js/helpers';
import { useLocation, useNavigate } from 'react-router-dom';
import ReactSelectCreatable from 'react-select/creatable';
import ReactSelect from 'react-select';
import { useAuth } from '../../AuthContext';
import api from '../../axiosInstance';


const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    // const [cartItems, setCartItems] = useState([]);
    // const [selectedCategory, setSelectedCategory] = useState('all');
    const { currentUser } = useAuth();
    const [inputValue, setInputValue] = useState("");

    const [loading, setLoading] = useState(false)
    const [client, setClient] = useState("")
    const [nomor, setNomor] = useState("")
    const [tipe, setTipe] = useState("open")
    const [orderId, setOrderId] = useState("")
    const [cashier, setCashier] = useState(currentUser?.name)
    const [validated, setValidated] = useState(false)
    const [dataClient, setDataClient] = useState([])
    const [dataTable, setDataTable] = useState([])
    const [cartItems, setCartItems] = useState(location.state?.cartItems || [])
    const [table, setTable] = useState("")
    const [initTable, setInitTable] = useState(false)
    const [initClient, setInitClient] = useState(false)
    const [poolTable, setPoolTable] = useState(false)

    const [isService, setIsService] = useState(false);
    const [isTax, setIsTax] = useState(true);
    const [isDiscount, setIsDiscount] = useState(false);
    const [typeDiscount, setTypeDiscount] = useState(true);


    const [tax, setTax] = useState(10);
    const [discount, setDiscount] = useState(20);


    const [isSubmitting, setIsSubmitting] = useState(false); // Menambahkan state baru

    const isSubmittingRef = useRef(false); // Menyimpan status pengiriman antar-render

    var total = 0

    const menu = location?.state?.menu
    const cafe = location?.state?.cafe
    const tmpTable = location?.state?.table
    const poolData = location.state?.tmpTable
    // // console.log(poolData)
    const action = location?.state?.action
    // console.log(action)
    // // console.log(tmpTable)
    // // console.log(menu)

    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            border: '1px solid #dbdfe6',
            borderRadius: '4px',
            padding: '0.1rem 0.1rem',
            backgroundColor: state.isDisabled ? '#e9ecef' : '#fff', // Match disabled input color
            color: state.isDisabled ? '#6c757d' : '#495057', // Match text color for disabled input
            boxShadow: state.isFocused ? '0 0 0 0.25rem rgba(88, 86, 214, 0.25)' : 'none',
            '&:hover': {
                borderColor: state.isFocused ? '#acabeb' : '#dbdfe6',
            },
            cursor: state.isDisabled ? 'not-allowed' : 'default', // Add "not-allowed" cursor for disabled state
        }),
        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
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

    function ceilingPrice(harga) {
        const sisa = harga % 1000;

        if (sisa === 0 || sisa === 500) {
            return harga; // Sudah kelipatan 500 atau 1000, tidak dibulatkan
        }

        if (sisa < 500) {
            return harga - sisa + 500;
        } else {
            return harga - sisa + 1000;
        }
    }


    const fetchTables = async () => {
        try {
            const response = await api.post("/data", {
                collection: "table",
                filter: {},
                sort: {}
            });
            var tmpData = []
            // response.data.forEach((data) => {
            //     tmpData.push({ id: data._id, client: data?.client, category: data?.category, name: data?.name, value: data?._id, label: data?.name })
            // })
            tmpData.unshift(
                { label: "Takeaway", value: "takeaway" },
                { label: "Grabfood", value: "grabfood" },
                { label: "Go-Food", value: "gofood" },
            )
            setDataTable(tmpData);
        } catch (error) {
            console.error("Error fetching table data: ", error);
        }
    };

    const fetchMembers = async () => {
        try {
            const response = await api.post("/data", {
                collection: "member",
                filter: {},
                sort: {}
            });
            var tmpData = []
            response.data.forEach((data) => {
                tmpData.push({ id: data._id, nomor: data?.nomor, value: data._id, label: data?.name })
            })
            setDataClient(tmpData);
        } catch (error) {
            console.error("Error fetching table data: ", error);
        }
    };

    useEffect(() => {
        if (tmpTable !== null && tmpTable !== undefined) {
            // console.log(tmpTable)
            const tableOption = dataTable.find((option) => option.value === tmpTable?.id);
            // const nomorHp = dataClient.find((option) => )
            const client = tmpTable?.client?.name ? { ...tmpTable?.client, value: tmpTable?.client?.name, label: tmpTable?.client?.name } : createOption(tmpTable?.client)
            setPoolTable(true)
            setClient(client)
            setNomor(tmpTable?.client?.nomor)
            setTable(tableOption)
        }
        if (cafe !== null && cafe !== undefined && cafe?.length !== 0) {
            setIsService(cafe?.service !== undefined)
            setIsTax(cafe?.tax !== undefined)
            setIsDiscount(cafe?.discount !== undefined)
            setTax(cafe?.tax * 100)
            setService(cafe?.service * 100)
            setDiscount(cafe?.discount)
            setTipe(cafe?.order)
            setCashier(cafe?.cashier)
        }
    }, [tmpTable, cafe, dataTable])

    useEffect(() => {
        fetchTables()
        fetchMembers()
    }, [])

    useEffect(() => {
        if (table?.value !== "takeaway" && table?.value !== undefined) {
            const tmpCartItems = cartItems.map((item) => {
                // Tambah 25% ke harga utama
                var updatedHarga = 0
                var updatedAddOns = item.addOns || []
                if (item.tmpHarga === undefined) {
                    updatedHarga = ceilingPrice(Math.round(Number(item?.harga) * 1.25));
                    // Tambah 25% ke harga addOns (jika ada)
                    updatedAddOns = item.addOns?.length
                        ? item.addOns.map(addOn => ({
                            ...addOn,
                            tmpHarga: addOn.harga,
                            harga: ceilingPrice(Math.round(Number(addOn.harga) * 1.25))
                        }))
                        : item.addOns;
                }



                return {
                    ...item,
                    tmpHarga: item.tmpHarga === undefined ? item.harga : item.tmpHarga,
                    harga: item.tmpHarga === undefined ? updatedHarga : item?.harga,
                    addOns: updatedAddOns
                };
            });

            console.log("🧾 Harga dengan 25% tambahan:", tmpCartItems);
            // Jika ingin disimpan ke state:
            setCartItems(tmpCartItems)
        } else if (table?.value !== "takeaway" && table?.value !== undefined) {
            const tmpCartItems = cartItems.map((item) => {
                // Tambah 25% ke harga utama

                const updatedAddOns = item.addOns?.length
                    ? item.addOns.map(addOn => {
                        if (addOn.tmpHarga !== undefined) {
                            var tmpHarga = addOn.tmpHarga
                            delete addOn.tmpHarga
                            return {
                                ...addOn,
                                harga: tmpHarga
                            }
                        }
                    })
                    : item.addOns;
                if (item?.tmpHarga !== undefined) {
                    var tmpHarga = item.tmpHarga
                    delete item.tmpHarga
                    return {
                        ...item,
                        harga: tmpHarga,
                        addOns: updatedAddOns
                    };
                }

            });

            setCartItems(tmpCartItems)
            console.log("📦 Tidak ada tambahan harga karena takeaway.");
        }
    }, [table]);


    const submit = async (event) => {
        event.preventDefault();

        if (isSubmittingRef.current) return; // Jika sudah dalam status submitting, keluar
        isSubmittingRef.current = true; // Set status submitting agar panggilan berikutnya dicegah

        setIsSubmitting(true); // Optional: untuk feedback loading di UI
        setLoading(true);
        // delete client?.value
        // delete client?.label
        console.log('masuk')

        try {
            const form = event.currentTarget;
            console.log(form)
            // if (form.checkValidity() === false) {
            //     event.stopPropagation();
            //     isSubmittingRef.current = false; // Reset status jika validasi gagal
            //     setIsSubmitting(false);
            //     return;
            // }

            var data = {
                client: client,
                order: "close",
                cashier: currentUser?.name,
                tableName: table?.value,
                table: table?.value,
                total: total,
                tax: isTax ? tax / 100 : 0,
                service: isService ? service / 100 : 0,
                discount: isDiscount ? discount : 0,
                orderTotal: 0,
                item: cartItems,
                createdAt: moment().format().toString(),
                orderId: "",
                pauseTimes: [],
                typeDiscount,
                status: "PAYMENT"
            };

            if (table?.value === "grabfood" || table?.value === "gofood") { data.paymentMethod = table?.value }

            console.log(data)
            console.log(client)

            // console.log(nomor)
            if (action === "open") {
                sessionStorage.clear();
                navigate("/table", { state: { cafe: data, poolData: poolData, menu: menu } })
            } else {
                if (table?.value === "takeaway") {
                    if (!client?.id) {
                        const response = await api.post("/data/add", {
                            collection: "member",
                            data: {
                                name: client?.label,
                                nomor,
                                status: "AKTIF",
                                createdAt: moment().utcOffset("+07:00").format()
                            }
                        });
                        if (response.data.newData?._id) client.id = response.data.newData._id;
                        else throw new Error("Gagal membuat data member");
                    }
                    if (client?.id) {
                        const response = await api.post("/data/add", {
                            collection: "tableHistory",
                            data: data
                        });
                        delete data.table
                        data.orderId = response.data.newData._id;

                    }
                } else if (table?.value === "grabfood" || table?.value === "gofood") {
                    data.client = table?.value === "grabfood" ? { name: "GF-" + orderId, nomor: "" } : { name: "F-" + orderId, nomor: "" }
                    const response = await api.post("/data/add", {
                        collection: "tableHistory",
                        data: data
                    });
                }

                else throw new Error("Failed")

                if (tipe === "close") {
                    Swal.fire({
                        title: "Success!",
                        text: "Pesanan berhasil dibuat",
                        icon: "success"
                    });
                    // var tmpData = window.btoa(JSON.stringify({ id: docRef.id, collection: 'cafe' }));
                    // window.open(`https://twinpool.page.link/?link=https://twinpool.web.app/welcome/?data=${tmpData}&apn=com.twinpool.cafe&afl=https://twinpool.web.app/`);
                } else if (tipe === "open") {
                    Swal.fire({
                        title: "Success!",
                        text: "Pesanan berhasil dibuat",
                        icon: "success"
                    });
                }
                sessionStorage.clear();
                navigate('/order');
            }
        } catch (err) {
            console.error(err);
            Swal.fire({
                title: "Failed!",
                text: "Pesanan gagal dibuat",
                icon: "error"
            });
        } finally {
            isSubmittingRef.current = false; // Reset status setelah proses selesai
            setIsSubmitting(false);
            setLoading(false);
        }
    };

    const filteredOptions =
        inputValue !== ""
            ? dataClient.filter((option) =>
                option.label?.toLowerCase().includes(inputValue?.toLowerCase())
            )
            : []; // Return an empty array if

    const createOption = (label) => ({
        label,
        value: label.toLowerCase().replace(/\W/g, ''),
    });

    const isOptionUnique = (inputValue) => {
        // Check if the option already exists
        return !dataClient.some(
            (option) => option.id?.includes(inputValue?.id)
        );
    };

    const handleCreate = async (inputValue) => {
        // setIsLoading(true);
        const newOption = inputValue?.name ? { ...inputValue, value: inputValue?.name, label: inputValue?.name } : createOption(inputValue);
        // setPoolTable(inputValue?.name !== undefined)
        // setIsLoading(false);
        // setOptions((prev) => [...prev, newOption]);
        console.log(newOption)
        setClient(newOption);
    };

    return (
        <CRow>
            <CCol xs={12}>
                <CButton className='mb-3' color="primary" onClick={() => {
                    sessionStorage.setItem('cartItems', JSON.stringify(cartItems));
                    navigate(-1)
                }}>
                    ← Back
                </CButton>
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong >Checkout Order</strong>
                    </CCardHeader>
                    <CForm
                        className='needs-validation'
                        noValidate
                        validated={validated}
                        onSubmit={submit}
                    >
                        <CCardBody>
                            {action === undefined &&
                                (table?.value === "takeaway" || table?.value === undefined) ? <CRow className='mb-3'>
                                <CCol>
                                    <CFormLabel className="col-sm-3 col-form-label w-100">Nama Customer </CFormLabel>
                                    {/* <ReactSelectCreatable
                                        value={client} // Value to display
                                        options={dataClient}
                                        onChange={(e) => setClient(e.target.value)}
                                        placeholder='Input Nama Customer'
                                        disabled={table?.category === "pool"}
                                        styles={customStylesInput} // Custom styles to mimic CFormInput
                                        components={{ IndicatorSeparator: null }} // Optional: Remove indicator separator
                                    /> */}
                                    <ReactSelectCreatable
                                        value={client} // Match value in options
                                        options={filteredOptions}
                                        onInputChange={(value) => setInputValue(value)} // Track input value                                  
                                        onChange={(selectedOption) => {
                                            // setNomor(selectedOption?.nomor)
                                            console.log(selectedOption)
                                            if (selectedOption?.id) selectedOption.name = selectedOption?.label
                                            setClient(selectedOption)
                                        }} // Only store the value
                                        placeholder="Input Nama Customer"
                                        onCreateOption={handleCreate}

                                        isDisabled={poolTable}
                                        styles={customStylesInput}
                                        noOptionsMessage={() => (inputValue === "" ? "Start typing to search..." : "No options available")}
                                        components={{ IndicatorSeparator: null }}
                                    />

                                </CCol>
                                <CCol>
                                    <CFormLabel className="col-sm-3 col-form-label w-100">Nomor HP </CFormLabel>
                                    <CFormInput type="text"
                                        value={client?.nomor !== undefined ? client?.nomor : nomor}
                                        onChange={(e) => {
                                            if (/^\d*$/.test(e.target.value)) setNomor(e.target.value)
                                        }}
                                        disabled={client?.nomor !== undefined}
                                        placeholder='Input Nomor HP'
                                        required />
                                </CCol>
                            </CRow> :
                                <CRow className='mb-3'>
                                    <CFormLabel className="col-sm-3 col-form-label">Order ID</CFormLabel>
                                    <CCol>
                                        <CInputGroup>
                                            <CInputGroupText>{table?.value === "grabfood" ? <b>GF-</b> : <b>F-</b>}</CInputGroupText>
                                            <CFormInput type="text"
                                                value={orderId}
                                                onChange={(e) => setOrderId(e.target.value)}
                                                required />
                                        </CInputGroup>
                                    </CCol>
                                </CRow>
                            }
                            {/* <CRow className='mb-3'>
                                <CFormLabel className="col-sm-3 col-form-label">Tipe Order</CFormLabel>
                                <CCol>
                                    <CFormSelect value={tipe} onChange={(e) => {
                                        setTipe(e.target.value)
                                    }} disabled={((cafe !== null && cafe !== undefined && cafe.length !== 0) || table.value === "takeaway")}>
                                        <option value="open">Open Bill</option>
                                        <option value="close">Closed Bill</option>
                                    </CFormSelect>
                                </CCol>
                            </CRow> */}
                            {action === undefined && <CRow className='mb-3'>
                                <CFormLabel className="col-sm-3 col-form-label">Pilih Table</CFormLabel>
                                <CCol>
                                    <ReactSelect
                                        isSearchable
                                        options={dataTable}
                                        value={table}
                                        placeholder="Pilih Table"
                                        styles={customStyles}
                                        menuPortalTarget={document.body}
                                        isDisabled={poolTable}
                                        onChange={(selected) => {
                                            console.log(selected)
                                            if (selected?.value === "takeaway") {
                                                setClient("")
                                                setTipe("close")
                                            }
                                            if (selected?.client) handleCreate(selected?.client)
                                            setTable(selected)
                                        }}
                                    />
                                </CCol>
                            </CRow>}
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
                                        {cartItems?.map((item, idx) => {
                                            total = cartItems?.reduce((total, item) => {
                                                var totalAddOn = item?.addOns ? item?.addOns?.reduce((total1, item1) => {
                                                    return total1 + Number(item1.harga);
                                                }, 0) : 0
                                                return total + totalAddOn + Number(item?.harga * item?.qty);
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
                                                        {item?.addOns && item?.addOns.length > 0 && (
                                                            <div className="mt-2">
                                                                <strong>Add-ons:</strong>
                                                                <ul className="mb-0">
                                                                    {item?.addOns.map((addon, index) => (
                                                                        <li key={index} className="small">
                                                                            {addon.name} (+Rp. {formatNumber(addon.harga)})
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}
                                                        {item?.note && <div className="mt-2"> <strong>Note: </strong>{item.note}</div>}
                                                    </CTableDataCell>
                                                    <CTableDataCell><CFormInput type="text" value={formatNumber(Number(item?.harga) + Number(totalAddOn))} readOnly plainText /></CTableDataCell>
                                                    <CTableDataCell><CFormInput type="text" value={formatNumber((Number(item?.harga) + Number(totalAddOn)) * (item?.qty ? item?.qty : 1))} readOnly plainText /></CTableDataCell>


                                                </CTableRow>
                                            )
                                        })}
                                        <CTableRow>
                                            <CTableDataCell colSpan={3} style={{ textAlign: "right" }}><b>Total</b></CTableDataCell>
                                            <CTableDataCell>{formatNumber(total)}</CTableDataCell>

                                        </CTableRow>
                                        {/* <CTableRow>
                                            <CTableDataCell colSpan={3} style={{ textAlign: "right" }} >
                                                <CFormCheck inline id="service" style={{ marginRight: "10px" }}
                                                    checked={isService}
                                                    onChange={(e) => setIsService(e.target.checked)} />
                                                <b>Service Charge {<input type='number' min={0} max={20} value={service} onChange={(e) => setService(e.target.value)} />} %</b></CTableDataCell>
                                            <CTableDataCell>{isService ? formatNumber(Math.ceil(total * (service / 100))) : 0}</CTableDataCell>
                                        </CTableRow> */}
                                        <CTableRow>
                                            <CTableDataCell colSpan={2} style={{ textAlign: "right" }} >
                                                <CFormCheck inline id="discount" style={{ marginRight: "10px" }}
                                                    checked={isDiscount}
                                                    onChange={(e) => setIsDiscount(e.target.checked)} />
                                                <b>Discount</b></CTableDataCell>
                                            <CTableDataCell>
                                                <CInputGroup>
                                                    {!typeDiscount && <span class="input-group-text" id="basic-addon1" onClick={() => setTypeDiscount(!typeDiscount)}>
                                                        Rp.</span>}
                                                    <CFormInput type='text' value={formatNumber(discount)} onChange={(e) => setDiscount(e.target.value.replace(/,/g, ""))} disabled={!isDiscount} />
                                                    {typeDiscount && <span class="input-group-text" id="basic-addon1" onClick={() => setTypeDiscount(!typeDiscount)}>
                                                        %</span>}
                                                </CInputGroup>
                                            </CTableDataCell>
                                            <CTableDataCell>{formatNumber(isDiscount ? (typeDiscount ? total * (discount / 100) : discount) : 0)}</CTableDataCell>
                                        </CTableRow>
                                        <CTableRow>
                                            <CTableDataCell colSpan={3} style={{ textAlign: "right" }} >
                                                <CFormCheck inline id="tax" style={{ marginRight: "10px" }}
                                                    checked={isTax}
                                                    onChange={(e) => setIsTax(e.target.checked)} />
                                                <b>PB1 {<input type='number' min={0} max={20} value={tax} onChange={(e) => setTax(e.target.value)} />} %</b></CTableDataCell>
                                            <CTableDataCell>{isTax ? formatNumber(Math.ceil(total * (tax / 100))) : 0}</CTableDataCell>
                                        </CTableRow>
                                        <CTableRow>
                                            <CTableDataCell colSpan={3} style={{ textAlign: "right" }} ><b>Grand Total</b></CTableDataCell>
                                            <CTableDataCell>{formatNumber((total * (isDiscount && typeDiscount ? 1 - discount / 100 : 1)) + Math.ceil(total * ((isTax ? tax / 100 : 0))) - (isDiscount && !typeDiscount ? discount : 0))}</CTableDataCell>
                                        </CTableRow>
                                    </CTableBody>
                                </CTable>
                                <CRow>
                                    <CCol>
                                        <CButton color="success" className='float-end' type="submit" disabled={isSubmitting}>Submit</CButton>
                                    </CCol>
                                </CRow>
                            </CContainer>
                        </CCardBody>
                    </CForm>
                </CCard>
            </CCol>
        </CRow>
    );
}

export default Checkout