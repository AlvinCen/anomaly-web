import React, { useEffect } from 'react'
import classNames from 'classnames'

import {
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
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
import { useAuth } from '../../AuthContext'
import Cashier from './Cashier'
import Report from './Report'
import { useNavigate } from 'react-router-dom'
import Attendance from './Attendance'
import AdminReport from './AdminReport'

const Dashboard = () => {
  const { currentUser } = useAuth()
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser?.role !== 'superadmin') {
      navigate('/dashboard'); // Redirect ke /table jika email tidak sesuai
    }
  }, [currentUser, navigate]);

  return (
    <>
      {
        currentUser?.role === "superadmin" ? <Report /> :
          <AdminReport />
      }
      {/* <Report /> */}
    </>
  )
}

export default Dashboard
