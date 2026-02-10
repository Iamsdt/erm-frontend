import { lazy } from "react"
import ct from "@constants/"

// Lazy load route components for code splitting
const Dashboard = lazy(() => import("@pages/dashboard"))
const Comments = lazy(() => import("@pages/comments"))

const mainRoutes = [
  { path: ct.route.ROOT, element: <Dashboard /> },
  { path: "/comments", element: <Comments /> },
]

export default mainRoutes
