import React, { Suspense, useCallback, useEffect, useState } from 'react'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'
import { useAuth } from './AuthContext'

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme = useSelector((state) => state.theme)

  useEffect(() => {
    sessionStorage.removeItem("isBack")
    sessionStorage.removeItem("tmpTable")
    sessionStorage.removeItem("poolData")
    sessionStorage.removeItem("cartItems")

    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
    if (theme) {
      setColorMode(theme)
    }

    if (isColorModeSet()) {
      return
    }

    setColorMode(storedTheme)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <HashRouter>
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <Routes>
          <Route exact path="/login" element={<LoginRedirect />} />
          <Route exact path="/register" name="Register Page" element={<Register />} />
          <Route exact path="/404" name="Page 404" element={<Page404 />} />
          <Route exact path="/500" name="Page 500" element={<Page500 />} />
          <Route path="*" element={<PrivateRoute element={<DefaultLayout />} />} />
        </Routes>
      </Suspense>
    </HashRouter>
  )
}

// 🔥 Redirect langsung ke "/" jika user sudah login
function LoginRedirect() {
  const { currentUser } = useAuth();
  return currentUser ? <Navigate to="/" replace /> : <Login />;
}

// 🔒 Private route: Cegah akses jika belum login
function PrivateRoute({ element }) {
  const { currentUser } = useAuth();
  return currentUser ? element : <Navigate to="/login" replace />;
}
export default App
