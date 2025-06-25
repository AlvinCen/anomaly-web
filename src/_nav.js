import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilApplications,
  cilBell,
  cilBook,
  cilCalculator,
  cilCart,
  cilCash,
  cilChartPie,
  cilCoffee,
  cilCreditCard,
  cilCursor,
  cilDescription,
  cilDrop,
  cilGroup,
  cilNotes,
  cilPencil,
  cilPeople,
  cilPuzzle,
  cilShareBoxed,
  cilSpeedometer,
  cilStar,
  cilStorage,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
import { faNewspaper, faPercent } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const _nav = [
  {
    component: CNavTitle,
    name: 'Cashier',
  },
  {
    component: CNavItem,
    name: 'Order',
    to: '/order',
    icon: <CIcon icon={cilCart} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Order Log',
    to: '/order-log',
    icon: <CIcon icon={cilApplications} customClassName="nav-icon" />,
  },
  // {
  //   component: CNavItem,
  //   name: 'Table',
  //   to: '/table',
  //   icon: <CIcon icon={cilStorage} customClassName="nav-icon" />,
  // },
  {
    component: CNavTitle,
    name: 'Management',
  },
  {
    component: CNavGroup, // 🔥 Gunakan CNavGroup untuk grup menu
    name: 'Table',
    icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Manage Table',
        to: '/table/manage',
      },
      {
        component: CNavItem,
        name: 'Manage Price List',
        to: '/table/price-list',
      }
    ],
  },
  // {
  //   component: CNavItem,
  //   name: 'Table',
  //   to: '/manage-table',
  //   icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
  // },
  // {
  //   component: CNavGroup, // 🔥 Gunakan CNavGroup untuk grup menu
  //   name: 'Recipe',
  //   icon: <FontAwesomeIcon icon={faNewspaper} className="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'Manage Recipe',
  //       to: '/recipe/manage',
  //     },
  //     // {
  //     //   component: CNavItem,
  //     //   name: 'Storage Log',
  //     //   to: '/storage/log',
  //     // }
  //   ],
  // },
  {
    component: CNavGroup, // 🔥 Gunakan CNavGroup untuk grup menu
    name: 'Storage',
    icon: <CIcon icon={cilStorage} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Manage Storage',
        to: '/storage/manage',
      },
      {
        component: CNavItem,
        name: 'Storage Report',
        to: '/storage/report',
      },
      {
        component: CNavItem,
        name: 'Storage Expense',
        to: '/storage/expense',
      },
      {
        component: CNavItem,
        name: 'Storage Log',
        to: '/storage/log',
      }
    ],
  },
  {
    component: CNavItem,
    name: 'Menu',
    to: '/manage-menu',
    icon: <CIcon icon={cilBook} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Promo',
    to: '/manage-promo',
    icon: <FontAwesomeIcon icon={faPercent} className="nav-icon" />
  },
  {
    component: CNavGroup, // 🔥 Gunakan CNavGroup untuk grup menu
    name: 'Member',
    icon: <CIcon icon={cilCreditCard} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Manage Member',
        to: '/member/manage',
      },
      {
        component: CNavItem,
        name: 'Manage Subscription',
        to: '/member/subscription',
      }
    ],
  },

]

const _privateNav = [
  ..._nav,
  {
    component: CNavItem,
    name: 'User',
    to: '/manage-user',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
  },
]

export { _nav, _privateNav }
