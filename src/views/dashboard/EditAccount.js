import React, { useState } from 'react'
import classNames from 'classnames'

import { CAlert, CBadge, CButton, CCard, CCardBody, CCardHeader, CCardImage, CCol, CContainer, CForm, CFormCheck, CFormInput, CFormLabel, CFormSelect, CHeader, CInputGroup, CInputGroupText, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CPagination, CPaginationItem, CProgress, CRow, CSpinner, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'

import CIcon from '@coreui/icons-react'
import {
    cibCcAmex,
    cibCcApplePay,
    cibCcMastercard,
    cibCcPaypal,
    cibCcStripe,
    cibCcVisa,
    cibGoogle,
    cibFacebook,
    cibLinkedin,
    cifBr,
    cifEs,
    cifFr,
    cifIn,
    cifPl,
    cifUs,
    cibTwitter,
    cilCloudDownload,
    cilPeople,
    cilUser,
    cilUserFemale,
} from '@coreui/icons'
import WidgetsBrand from '../widgets/WidgetsBrand'
import WidgetsDropdown from '../widgets/WidgetsDropdown'
import MainChart from './MainChart'
import { browserName } from 'react-device-detect'
import { useAuth } from '../../AuthContext'
import Report from './Report'
// import { auth } from '../../Firebase'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2'
import api from '../../axiosInstance'

const EditAccount = () => {
    const { currentUser } = useAuth()
    const [loading, setLoading] = useState(false);

    const [display, setDisplay] = useState("")
    const [error, setError] = useState('');
    const [currPass, setCurrPass] = useState("")
    const [pass, setPass] = useState("")
    const [rePass, setRePass] = useState("")
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [validated, setValidated] = useState(false)


    const toggleShowCurrentPassword = () => {
        setShowCurrentPassword(!showCurrentPassword);
    };

    const toggleShowNewPassword = () => {
        setShowNewPassword(!showNewPassword);
    };

    const toggleShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const submit = async (event) => {
        setLoading(true)
        if (pass === rePass) {
            try {

                await api.post("/change-password", {
                    id: currentUser._id,
                    currentPassword: window.btoa(currPass),
                    newPassword: window.btoa(pass)
                });

                Swal.fire({
                    title: "Success!",
                    text: "Password berhasil diubah",
                    icon: "success"
                });
                setError("")
            } catch (err) {
                setError("Password sekarang salah")
                Swal.fire({
                    title: "Failed!",
                    text: "Gagal mengubah password",
                    icon: "error"
                });
            }
        } else {
            setError("Password baru tidak sama.")
        }
        setPass("")
        setRePass("")
        setCurrPass("")
        setLoading(false)
    }

    return (
        <CCard className='mb-3' >
            <CCardHeader><b>My Account</b></CCardHeader>
            <CCardBody>
                <CForm >
                    {error && <CAlert color="danger">{error}</CAlert>}
                    <CContainer>
                        <CRow className="mb-3">
                            <CFormLabel className="col-sm-3 col-form-label">Password Sekarang</CFormLabel>
                            <CCol sm={9}>
                                <CInputGroup>
                                    <CFormInput
                                        type={showCurrentPassword ? 'text' : 'password'}
                                        placeholder="Input Password Sekarang"
                                        value={currPass}
                                        aria-describedby="validationCustom03Feedback"
                                        id="validationCustom03"
                                        onChange={(e) => setCurrPass(e.target.value)}
                                        feedbackInvalid="Minimal 6 karakter."
                                        minLength={6}
                                        required
                                    />
                                    <CInputGroupText onClick={toggleShowCurrentPassword}>
                                        <FontAwesomeIcon icon={showCurrentPassword ? faEyeSlash : faEye} />
                                    </CInputGroupText>
                                </CInputGroup>
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel className="col-sm-3 col-form-label">Password Baru</CFormLabel>
                            <CCol sm={9}>
                                <CInputGroup>
                                    <CFormInput
                                        type={showNewPassword ? 'text' : 'password'}
                                        placeholder="Input Password Baru"
                                        value={pass}
                                        onChange={(e) => setPass(e.target.value)}
                                        feedbackInvalid="Minimal 6 karakter."
                                        minLength={6}
                                        required
                                    />
                                    <CInputGroupText onClick={toggleShowNewPassword}>
                                        <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} />
                                    </CInputGroupText>
                                </CInputGroup>
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel className="col-sm-3 col-form-label">Konfirmasi Password Baru</CFormLabel>
                            <CCol sm={9}>
                                <CInputGroup>
                                    <CFormInput
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        placeholder="Enter Konfirmasi Password Baru"
                                        value={rePass}
                                        onChange={(e) => setRePass(e.target.value)}
                                        feedbackInvalid="Password tidak sama."
                                        minLength={6}
                                        required
                                    />
                                    <CInputGroupText onClick={toggleShowConfirmPassword}>
                                        <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                                    </CInputGroupText>
                                </CInputGroup>
                            </CCol>
                        </CRow>
                        <CCol xs={12} className="d-flex justify-content-end">
                            {!loading ? <CButton color="primary" onClick={submit}>
                                Submit
                            </CButton>
                                : <CSpinner color="primary" className="float-end" variant="grow" />}

                        </CCol>
                    </CContainer>
                </CForm>
            </CCardBody>
        </CCard>
    )
}

export default EditAccount
