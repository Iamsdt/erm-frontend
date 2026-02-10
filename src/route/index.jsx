import { Suspense } from "react"
import { createBrowserRouter } from "react-router-dom"

import BlankLayout from "@/components/layout/blank-layout"
import MainLayout from "@/components/layout/main-layout"
import NotFoundPage from "@/pages/misc/not-found"
import RouterErrorPage from "@/pages/misc/router-error"
import ct from "@constants/"

import blankRoutes from "./blank.routes"
import dashboardRoutes from "./main.routes"

// Loading fallback component for lazy-loaded routes
const RouteLoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
)

// Wrap routes with Suspense for lazy loading
const withSuspense = (routes) =>
  routes.map((route) => ({
    ...route,
    element: (
      <Suspense fallback={<RouteLoadingFallback />}>{route.element}</Suspense>
    ),
  }))

const router = createBrowserRouter([
  {
    path: ct.route.ROOT,
    element: <MainLayout />,
    errorElement: <RouterErrorPage />,
    children: withSuspense(dashboardRoutes),
  },
  {
    element: <BlankLayout />,
    errorElement: <RouterErrorPage />,
    children: withSuspense(blankRoutes),
  },
  {
    // 404 catch-all route - must be last
    path: "*",
    element: <NotFoundPage />,
  },
])

export default router
