import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'

// routes config
import routes from '../routes'
import { useAuth } from '../AuthContext'

const AppContent = () => {
  const { currentUser } = useAuth();
  console.log(currentUser)
  const generalRoute = ['/dashboard', '/edit-account']
  return (
    <CContainer className="px-4" lg>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {routes.map((route, idx) => {
            if (currentUser) {
              switch (route.path) {
                case "/manage-user":
                  if (currentUser?.role === "superadmin") {
                    return (
                      route.element && (
                        <Route
                          key={idx}
                          path={route.path}
                          exact={route.exact}
                          name={route.name}
                          element={<route.element />}
                        />
                      )
                    )
                  } else {
                    return <Route key={idx} path="*" element={<Navigate to="/" replace />} />
                  }
                case "/":
                default:
                  // console.log(firestoreUser?.hasAccessPos.find((access) => access.name === route.path && access.view))
                  var accessPos = currentUser?.hasAccessPos?.find((access) => {
                    // console.log(access.name, route.path)
                    return (route.path.includes(access.name) && route.path.startsWith(access.name))
                  })
                  var accessManage = currentUser?.hasAccessManage?.find((access) => {
                    return (route.path.includes(access.name) && route.path.startsWith(access.name))
                  })
                  if (
                    (accessPos || accessManage ||
                      generalRoute.includes(route.path)) || currentUser?.role === "superadmin"
                  ) {
                    return (
                      route.element && (
                        <Route
                          key={idx}
                          path={route.path}
                          exact={route.exact}
                          name={route.name}
                          element={<route.element />}
                        />
                      )
                    )
                  }
              }
              // if (route.path === "manage-user" && currentUser?.role !== "superadmin") {
              //   console.log("asd")
              //   return
              // } else {

              // }
            }
          })}
          <Route path="/" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)
