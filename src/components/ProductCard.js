import React, { useState } from 'react';
import { CButton, CCard, CCardBody, CCardImage, CCardTitle, CCardText, CFormCheck, CRow, CCol } from '@coreui/react';
import { formatNumber } from 'chart.js/helpers';

const ProductCard = ({ product, addToCart }) => {
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  // Fungsi untuk menangani perubahan pada checklist add-on
  const handleAddonChange = (addon) => {
    setSelectedAddons((prevSelectedAddons) =>
      prevSelectedAddons.includes(addon)
        ? prevSelectedAddons.filter((item) => item !== addon)
        : [...prevSelectedAddons, addon]
    );
  };

  const handleAddToCart = () => {
    const itemWithAddons = {
      ...product,
      addOns: selectedAddons,
    };
    addToCart(itemWithAddons); // Mengirim item dengan add-ons ke cart
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <CCard style={{ width: '18rem' }}>
      <CCardImage orientation="top" width={150} height={150} src={product.photoURL} />
      <CCardBody>
        <CCardTitle>{product.name}</CCardTitle>
        <CCardText>Rp. {formatNumber(product.harga)}</CCardText>

        {/* Conditional rendering for add-ons */}
        {isExpanded && (
          <CRow className="mt-3">
            <CCol xs={12}>
              <h6>Select Add-ons</h6>
              {product.addOns && product.addOns.map((addon, index) => (
                <CFormCheck
                  key={index}
                  label={`${addon.name} (+Rp. ${formatNumber(addon.harga)})`}
                  checked={selectedAddons.includes(addon)}
                  onChange={() => handleAddonChange(addon)}
                />
              ))}
            </CCol>
          </CRow>
        )}
        {/* Expand/Collapse Add-ons */}
        <CRow>
          <CCol xs="6">
            <CButton color="secondary" onClick={toggleExpand}>
              Add-on
            </CButton>
          </CCol>
          <CCol xs="6">
            <CButton color="primary" onClick={handleAddToCart}>Tambah</CButton>
          </CCol>
        </CRow>


      </CCardBody>
    </CCard>
  );
};

export default ProductCard;
