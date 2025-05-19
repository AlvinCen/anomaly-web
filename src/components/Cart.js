import React, { useState } from 'react';
import { CButton, COffcanvas, COffcanvasHeader, COffcanvasBody, CListGroup, CListGroupItem, CRow, CCol, CFormInput, CCard, CCardBody, CCardText, CCloseButton, CFormLabel } from '@coreui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { formatNumber } from 'chart.js/helpers';
import { doc, setDoc } from 'firebase/firestore';

const SidebarCart = ({ cartItems, updateOrder, removeFromCart, updateQuantity, updateNote, inventory }) => {
    const [visible, setVisible] = useState(false);
    const location = useLocation();
    const isEdit = location.pathname?.split('/')[location.pathname?.split('/').length - 1]
    const navigate = useNavigate();
    const table = location.state?.table;
    const cafe = location.state?.cafe;
    const poolData = location.state?.tmpTable;
    const action = location.state?.action
    console.log(action)

    const toggleSidebar = () => {
        setVisible(!visible);
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            const addonsTotal = item.addOns ? item.addOns.reduce((sum, addon) => Number(sum) + (Number(addon.harga) * item.qty), 0) : 0;
            return total + ((Number(item.harga) * item.qty) + Number(addonsTotal));
        }, 0);
    };

    const calculateTotalItems = () => {
        return cartItems.reduce((total, item) => total + item.qty, 0);
    };


    return (
        <>
            {/* Offcanvas/Sidebar for Cart */}
            <COffcanvas placement="end" visible={visible}>
                <COffcanvasHeader>
                    <h5>List Order</h5>
                    <CCloseButton onClick={toggleSidebar} />
                </COffcanvasHeader>
                <COffcanvasBody>
                    <CListGroup>
                        {cartItems.map((item, index) => (
                            <>
                                <CListGroupItem key={index} className="align-items-center justify-content-between">
                                    <CRow className="w-100 align-items-center">
                                        <CCol xs={2} className="d-flex align-items-center">
                                            <CButton color="danger" size="sm" onClick={() => removeFromCart(index)}>
                                                𝗫
                                            </CButton>
                                        </CCol>

                                        <CCol xs={7}>
                                            <span>{item.name}</span>
                                            <br />
                                            <span>Rp. {formatNumber(item.harga)}</span>
                                            {/* Menampilkan Add-ons jika tersedia */}
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
                                        </CCol>

                                        <CCol xs={2} className="d-flex align-items-center justify-content-between">
                                            <CFormInput
                                                type="number"
                                                value={item.qty}
                                                onChange={(e) => updateQuantity(index, item.qty, parseInt(e.target.value))}
                                                min={1}
                                                style={{ width: '60px', marginRight: '10px' }}
                                            />
                                        </CCol>
                                    </CRow>
                                    <CRow>
                                        <CFormLabel className="col-sm-3 col-form-label">Note : </CFormLabel>
                                        <CCol>
                                            <CFormInput type="text"
                                                placeholder='Note'
                                                value={item?.note}
                                                onChange={(e) => updateNote(index, e.target.value)} />
                                        </CCol>
                                    </CRow>
                                </CListGroupItem>

                            </>

                        ))}
                    </CListGroup>
                    <div className="mt-3">
                        <h5>Total: Rp. {formatNumber(calculateTotal())}</h5>
                        {isEdit === "edit" ? <CButton color="success" className="w-100" onClick={(e) => { updateOrder(e, calculateTotal()) }}>Update</CButton> :
                            <CButton color="success" className="w-100" onClick={() => {
                                setVisible(false)
                                if (poolData) setTimeout(() => navigate("/order", { state: { cafe: { item: cartItems }, poolData: poolData, action: action } }), 1)
                                else setTimeout(() => navigate("/order/checkout", { state: { cartItems: cartItems, poolData: poolData } }), 1)
                            }}>Checkout</CButton>}
                    </div>
                </COffcanvasBody>
            </COffcanvas>

            {/* Floating Card to Show Cart */}
            <CCard className="fixed-bottom-cart bg-primary text-white m-3 float-right" style={{ maxWidth: '350px', margin: 'auto', borderRadius: '10px', zIndex: '1050' }}>
                <CCardBody className="d-flex justify-content-between align-items-center">
                    <CCardText className="mb-0">
                        {`Items: ${calculateTotalItems()} | Total: ${formatNumber(calculateTotal())}`}
                    </CCardText>
                    <CButton color="light" onClick={toggleSidebar}>
                        Lihat Order
                    </CButton>
                </CCardBody>
            </CCard>
        </>
    );
};

export default SidebarCart;
