import { lazy } from "react"

// Lazy load authentication pages
const Login = lazy(() => import("@/pages/auth"))

const blankRoutes = [
  {
    path: "/login",
    element: <Login />,
  },
]

export default blankRoutes
