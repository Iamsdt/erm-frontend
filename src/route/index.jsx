import { Suspense } from "react"
import { createBrowserRouter } from "react-router-dom"

import BlankLayout from "@/components/layout/blank-layout"
import MainLayout from "@/components/layout/main-layout"
import RouteErrorFallback from "@/components/route-error-fallback"
import NotFoundPage from "@/pages/misc/not-found"
import RouterErrorPage from "@/pages/misc/router-error"
import ct from "@constants/"

import blankRoutes from "./blank.routes"
import dashboardRoutes from "./main.routes"

// Loading fallback component for lazy-loaded routes
const RouteLoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
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

/**
 * Groups an array of flat routes into nested route objects with per-group
 * error boundaries so that a crash in one module (e.g. AI) does not bring
 * down the entire layout.
 */
const withGroupErrorBoundary = (routes) =>
  routes.map((route) => ({
    ...route,
    errorElement: <RouteErrorFallback />,
  }))

const router = createBrowserRouter([
  {
    path: ct.route.ROOT,
    element: <MainLayout />,
    errorElement: <RouterErrorPage />,
    children: withGroupErrorBoundary(withSuspense(dashboardRoutes)),
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
