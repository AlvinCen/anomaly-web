import React, { useState } from 'react';
import { CFormSelect, CButton, CFormLabel, CCol, CRow } from '@coreui/react';
import styled from 'styled-components';

const StyledSelect = styled(CFormSelect)`
  height: 150px; /* Adjust height as needed */
  background-color: #f8f9fa;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
  padding: 10px;
  margin-bottom: 20px;
  &:focus {
    border-color: #80bdff;
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
`;

const MultipleSelect = () => {
  const [selectedItems, setSelectedItems] = useState([]);

  const handleSelectChange = (e) => {
    const options = e.target.options;
    const selectedValues = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedValues.push(options[i].value);
      }
    }
    setSelectedItems(selectedValues);
  };

  const handleSubmit = () => {
    console.log('Selected Items:', selectedItems);
  };

  return (
    <CRow className="justify-content-center">
      <CCol md="6">
        <CFormLabel htmlFor="multi-select">Select Items</CFormLabel>
        <StyledSelect id="multi-select" multiple onChange={handleSelectChange}>
          <option value="item1">Item 1</option>
          <option value="item2">Item 2</option>
          <option value="item3">Item 3</option>
          <option value="item4">Item 4</option>
        </StyledSelect>
        <CButton color="primary" onClick={handleSubmit}>Submit</CButton>
      </CCol>
    </CRow>
  );
};

export default MultipleSelect;
