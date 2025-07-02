import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
// const EditAccount = React.lazy(() => import('./views/dashboard/EditAccount'))
const Table = React.lazy(() => import('./views/table/Table'))
const Order = React.lazy(() => import('./views/order/Order'))
const Cafe = React.lazy(() => import('./views/cafe/Cafe'))
const Storage = React.lazy(() => import('./views/storage/StorageList'))
const OrderCafe = React.lazy(() => import('./views/cafe/OrderCafe'))
const Checkout = React.lazy(() => import('./views/cafe/Checkout'))
// const ManageRecipe = React.lazy(() => import('./views/recipe/ManageRecipe'))
const ExpenseStorage = React.lazy(() => import('./views/storage/ExpenseStorage'))
const ReportStorage = React.lazy(() => import('./views/storage/ReportStorage'))

const ManageMenu = React.lazy(() => import('./views/menu/ManageMenu'))
const ManageMerch = React.lazy(() => import('./views/merchandise/ManageMerch'))
const ManageMember = React.lazy(() => import('./views/member/ManageMember'))
const ManageSubscription = React.lazy(() => import('./views/member/ManageSubscription'))
const ManageTable = React.lazy(() => import('./views/table/ManageTable'))
const ManagePromo = React.lazy(() => import('./views/promo/ManagePromo'))
const ManageUser = React.lazy(() => import('./views/user/ManageUser'))
const ManageMemberPrice = React.lazy(() => import('./views/member/PriceList'))
const ManageTablePrice = React.lazy(() => import('./views/table/PriceList'))
const StorageLog = React.lazy(() => import('./views/storage/StorageLog'))
const OrderLog = React.lazy(() => import('./views/order/OrderLog'))
const Charts = React.lazy(() => import('./views/charts/Charts'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/chart', exact: true, name: 'Home', element: Charts },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/cafe', name: 'Cafe', element: Cafe },
  { path: '/cafe/order', name: 'Order Cafe', element: OrderCafe },
  { path: '/cafe/order/edit', name: 'Edit Order Cafe', element: OrderCafe },
  { path: '/cafe/order/checkout', name: 'Checkout', element: Checkout },
  { path: '/table', name: 'Table', element: Table },
  { path: '/table/manage', name: 'Manage Table', element: ManageTable },
  { path: '/table/price-list', name: 'Manage Table Price List', element: ManageTablePrice },
  // { path: '/recipe/manage', name: 'Manage Recipe', element: ManageRecipe },
  { path: '/storage/expense', name: 'Expense Storage', element: ExpenseStorage },
  { path: '/storage/report', name: 'Report Storage', element: ReportStorage },
  { path: '/storage/manage', name: 'Manage Storage', element: Storage },
  { path: '/storage/log', name: 'Storage Log', element: StorageLog },
  { path: '/member/manage', name: 'Manage Member', element: ManageMember },
  { path: '/member/subscription', name: 'Manage Subscription', element: ManageSubscription },
  { path: '/order', name: 'Order', element: Table },
  { path: '/order/add', name: 'Order Add', element: OrderCafe },
  { path: '/order/edit', name: 'Order Edit', element: OrderCafe },
  { path: '/order/checkout', name: 'Order Checkout', element: Checkout },
  { path: '/order-log', name: 'Order Log', element: OrderLog },
  // { path: '/edit-account', name: 'Edit Account', element: EditAccount },
  // { path: '/manage-member', name: 'Manage Member', element: ManageMember },
  { path: '/manage-menu', name: 'Management Menu Cafe', element: ManageMenu },
  { path: '/manage-merch', name: 'Management Merchandise', element: ManageMerch },
  { path: '/manage-promo', name: 'Management Promo', element: ManagePromo },
  { path: '/manage-user', name: 'Management User', element: ManageUser },
]

export default routes
