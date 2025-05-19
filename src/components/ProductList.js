import React, { useEffect, useState } from 'react';
import { CRow, CCol, CInputGroup, CFormLabel, CFormInput, CInputGroupText } from '@coreui/react';
import ProductCard from './ProductCard';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
// import { firestore } from '../Firebase';

const ProductList = ({ addToCart, selectedCategory, data, search }) => {
  const filteredProducts = selectedCategory === 'all' && search === ""
    ? data
    : data?.filter(product => (selectedCategory !== "all" && product.category?.value === selectedCategory && product?.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())) ||
      (selectedCategory === "all" && product?.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())));

  return (
    <CRow>
      {filteredProducts?.map(product => (
        <CCol className='mb-3 justify-content-center' key={product.id}>
          <ProductCard product={product} addToCart={addToCart} />
        </CCol>
      ))}
    </CRow>
  );
};

export default ProductList;
