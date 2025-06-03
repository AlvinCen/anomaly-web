import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  CCardImage,
  CCloseButton,
  CNav,
  CNavGroup,
  CNavItem,
  CNavLink,
  CNavTitle,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarNav,
  CSidebarToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'

import logo from 'src/assets/brand/logo.png'
// import { sygnet } from 'src/assets/brand/sygnet'

// sidebar nav config
import { _nav, _privateNav } from '../_nav'
import { cilAccountLogout, cilExitToApp, cilPencil, cilSpeedometer, cilUser } from '@coreui/icons'
import { useAuth } from '../AuthContext'
import SimpleBar from 'simplebar-react'
import { NavLink } from 'react-router-dom'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const { currentUser, logout } = useAuth();
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const generalRoute = ['/dashboard', '/edit-account']

  // const newNav = _nav.filter((nav) => (
  //   currentUser?.hasAccessPos?.find((access) => access.name === nav.to && access.view) ||
  //   currentUser?.hasAccessManage?.find((access) => access.name === nav.to && access.view)
  //   || generalRoute.includes(nav.to)) || ["POS", "Management"].includes(nav.name))

  // Gabungkan semua akses user dalam bentuk array
  const userAccessList = [
    ...(currentUser?.hasAccessPos || []),
    ...(currentUser?.hasAccessManage || [])
  ];

  // Fungsi pengecekan apakah `to` ada dalam daftar akses `view: true`
  const hasAccess = (route) =>
    userAccessList.some((access) => access.name === route && access.view);

  // Fungsi utama filter
  const newNav = _nav.map((navItem) => {
    // Jika nav item punya sub-items
    if (navItem.items) {
      const filteredItems = navItem.items.filter((subItem) =>
        hasAccess(subItem.to)
      );

      // Kalau masih ada item yang boleh diakses, tampilkan nav nya
      if (filteredItems.length > 0) {
        return {
          ...navItem,
          items: filteredItems
        };
      }
      return null;
    }

    // Untuk item tanpa children
    if (
      hasAccess(navItem.to) ||
      generalRoute.includes(navItem.to) ||
      ["Cashier", "Management"].includes(navItem.name) // tetap tampilkan header/group label
    ) {
      return navItem;
    }

    return null;
  }).filter(Boolean); // Hapus null dari hasil akhir

  // console.log(newNav)

  // console.log(newNav)
  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand to="/">
          {/* <CCardImage className="sidebar-brand-full" src={logo} height={200} width={400}/> */}
          {/* <CIcon customClassName="sidebar-brand-narrow" icon={sygnet} height={32} /> */}
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>
      <CSidebarNav as={SimpleBar} className='border-bottom' style={{ maxHeight: "200px" }}>
        <CNavTitle>
          <CIcon icon={cilUser} className="me-2" />
          <span>{currentUser ? `Hi, ${currentUser.name}` : 'Guest'}</span>
        </CNavTitle>
        <CNavItem>
          <NavLink to="/dashboard" className='nav-link'>
            <CIcon icon={cilSpeedometer} className="me-2" />
            Dashboard
          </NavLink>
        </CNavItem>
        <CNavGroup toggler={<><CIcon icon={cilUser} className="me-2" />Account</>}>
          <CNavItem>
            <NavLink to="/edit-account" className='nav-link'>
              <CIcon icon={cilPencil} className="me-2" />
              Edit Account
            </NavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink onClick={() => logout()}>
              <CIcon icon={cilAccountLogout} className="me-2" />
              Logout
            </CNavLink>
          </CNavItem>
        </CNavGroup>

      </CSidebarNav>
      <AppSidebarNav items={currentUser?.role === "superadmin" ? _privateNav : newNav} />
      {/* <AppSidebarNav items={_privateNav} /> */}
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
