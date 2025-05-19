import { cilMediaStop, cilPencil, cilPrint } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CBadge, CButton, CCard, CCardBody, CCardHeader, CCardImage, CCol, CContainer, CFormInput, CFormLabel, CFormSelect, CHeader, CInputGroup, CInputGroupText, CListGroup, CListGroupItem, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CPagination, CPaginationItem, CProgress, CRow, CSpinner, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import CategoryFilter from "../../components/CategoryFilter"
import Cart from "../../components/Cart"
import ProductList from "../../components/ProductList"
// import { firestore } from '../../Firebase';
import { collection, getDocs, onSnapshot, addDoc, setDoc, doc, query, where, orderBy, deleteDoc, writeBatch } from 'firebase/firestore';
import Swal from 'sweetalert2'
import AppTable from '../../components/AppTable';
import { formatNumber } from 'chart.js/helpers';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../axiosInstance';

const OrderCafe = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const action = location.state?.action
    const tmpTable = location.state?.tmpTable
    const poolData = location.state?.table
    var storage = JSON.parse(sessionStorage.getItem('cartItems'))

    const [cartItems, setCartItems] = useState((storage !== undefined && storage !== "" && storage !== null) ? storage : []);
    const [inventory, setInventory] = useState([])
    const [init, setInit] = useState(false);
    const [initMenu, setInitMenu] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [search, setSearch] = useState('');

    const handleAddToCart = (newItem) => {
        delete newItem.category
        delete newItem.photoURL
        delete newItem.status
        delete newItem.createdAt

        console.log(newItem)

        const compareAddons = (addons1, addons2) => {
            if (addons1.length !== addons2.length) return false;
            return addons1.every((addon) => addons2.some((a) => a.name === addon.name && a.harga === addon.harga));
        };

        const existingItem = cartItems.find((item) => item.id === newItem.id 
        && compareAddons(item.addOns, newItem.addOns) && item.note === note);

        if (existingItem) {
            // Jika item dengan kombinasi add-ons yang sama sudah ada, tambahkan kuantitasnya
            setCartItems(cartItems.map((item) =>
                item === existingItem ? { ...item, qty: item.qty + 1 } : item
            ));
        } else {
            // Jika item dengan kombinasi add-ons yang berbeda, tambahkan sebagai item baru
            setCartItems([...cartItems, { ...newItem, qty: 1 }]);
        }
        // setInventory(inventory.map((item) =>
        //     item?.id === newItem?.id ? { ...item, stok: item.stok - 1 } : item
        // ))
    };

    const removeFromCart = (id) => {
        // setInventory(inventory.map((item) =>
        //     item?.id === cartItems[id]?.id ? { ...item, stok: item.stok + cartItems[id]?.qty } : item
        // ))
        setCartItems(cartItems.filter((_, index) => index !== id));
    };

    const updateQuantity = (id, tmpQty, qty) => {
        qty = parseInt(qty) < 0 || isNaN(qty) ? 0 : qty

        // if (Math.sign(tmpQty - qty) === 0) {
        //     setInventory(inventory.map((item) =>
        //         item?.id === cartItems[id]?.id ? { ...item, stok: item.stok + (tmpQty - qty) } : item
        //     ))
        // } else {
        //     setInventory(inventory.map((item) =>
        //         item?.id === cartItems[id]?.id ? { ...item, stok: item.stok - (qty - tmpQty) } : item
        //     ))
        // }
        setCartItems(cartItems.map((item, index) =>
            index === id ? { ...item, qty } : item
        ));
    };

    const updateNote = (id, note) => {
        setCartItems(cartItems.map((item, index) =>
            index === id ? { ...item, note } : item
        ));
    };


    const update = async (event, total) => {
        event.preventDefault()
        console.log(total)
        const tmpCart = JSON.parse(sessionStorage.getItem("tmpCartItems"))

        try {
            const data = {
                total: total,
                grandTotal: total + Math.ceil(total * 0.2),
                item: cartItems,
            }
            // console.log(data)
            const updateItem = tmpCart.map(oldItem => {
                const newItem = cartItems.find(item => item.id === oldItem.id);

                // Jika item di oldArray tidak ada di newArray, dianggap qty berbeda (karena hilang)
                if (!newItem) {
                    return {
                        ...oldItem,
                        oldQty: oldItem.qty,
                        newQty: 0 // Asumsikan newQty = 0 jika item hilang di newArray
                    };
                }

                // Jika qty berbeda, simpan perbedaan qty
                if (oldItem.qty !== newItem.qty) {
                    return {
                        ...oldItem,
                        oldQty: oldItem.qty,
                        newQty: newItem.qty
                    };
                }

                return null; // Jika qty sama, kembalikan null
            }).filter(item => item !== null); // Filter untuk menghapus item yang qty-nya sama

            // const docRef = await setDoc(doc(firestore, "cafe", location?.state), data, { merge: true })
            // const batch = writeBatch(firestore);
            // updateItem.forEach((data) => {
            //     var tmpMenu = inventory.find((menu) => menu?.id === data?.id)
            //     const docRef = doc(firestore, "menu", data?.id);
            //     // if (data?.oldQty < data?.newQty) batch.update(docRef, { stok: tmpMenu?.stok - (data?.newQty - data?.oldQty) });
            //     // else batch.update(docRef, { stok: tmpMenu?.stok + (data?.oldQty - data?.newQty) });
            //     batch.update(docRef, { stok: tmpMenu?.stok + (data?.oldQty - data?.newQty) })
            // });

            // // Melakukan commit pada batch
            // await batch.commit();
            Swal.fire({
                title: "Success!",
                text: "Berhasil mengubah pesanan",
                icon: "success"
            });
            sessionStorage.clear()
            navigate('/cafe')

        } catch (err) {
            console.log(err)
            Swal.fire({
                title: "Failed!",
                text: "Pesanan gagal diubah",
                icon: "error"
            });
        }

    }

    // Fungsi untuk mengambil data booking
    const fetchMenu = async () => {
        try {
            const response = await api.post('/data', {
                collection: "menu",
                filter: {},
                sort: { name: 1 }
            })
            var tmpData = response.data?.map((data) => ({ ...data, id: data._id?.toString() }))
            setInventory(tmpData);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            // Swal.fire('Error', 'Gagal memuat data booking', 'error');
        }
    }


    useEffect(() => {
        fetchMenu()
        sessionStorage.removeItem('cartItems');
    }, [])


    useEffect(() => {
        sessionStorage.setItem("cartItems", JSON.stringify(cartItems))
    }, [cartItems])

    return (
        <CContainer fluid>
            <Cart cartItems={cartItems} updateOrder={update} removeFromCart={removeFromCart} updateQuantity={updateQuantity} updateNote={updateNote} inventory={inventory} />
            <CRow>
                <CButton className='mb-3' color="primary" onClick={() => {
                    sessionStorage.setItem('cartItems', JSON.stringify(cartItems));
                    if (action === "open") {
                        sessionStorage.setItem("isBack", true)
                        sessionStorage.setItem("tmpTable", JSON.stringify(tmpTable));
                    }
                    else if (action === "detail") {
                        sessionStorage.setItem("isBack", true)
                        sessionStorage.setItem("poolData", JSON.stringify(poolData));
                    }
                    navigate(-1)
                }}>
                    ← Back
                </CButton>
                <CCol>
                    <CategoryFilter setSelectedCategory={setSelectedCategory} />

                    <CCol>
                        <CInputGroup style={{ width: "100%" }}>
                            <CFormLabel style={{ padding: "5px" }}><b>Search : </b></CFormLabel>
                            <CFormInput
                                type="text"
                                placeholder="Search..."
                                className='mb-3'
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <CInputGroupText className="mb-3 close-btn" style={{ backgroundColor: "#e74c3c", color: "white", border: "none", cursor: "pointer" }} onClick={() => setSearch("")}><b>x</b></CInputGroupText>
                        </CInputGroup>
                    </CCol>
                    <ProductList addToCart={handleAddToCart} selectedCategory={selectedCategory} data={inventory} search={search} />
                </CCol>
            </CRow>
        </CContainer>
    );
}

export default OrderCafe