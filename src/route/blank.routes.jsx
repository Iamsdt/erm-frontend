import { lazy } from "react"

// Lazy load authentication pages
const Login = lazy(() => import("@/pages/auth"))
const ForgotPassword = lazy(() => import("@/pages/auth/forgot-password"))

const blankRoutes = [
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
]

export default blankRoutes
