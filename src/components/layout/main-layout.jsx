import { useEffect } from "react"
import { useSelector } from "react-redux"
import { Outlet, useNavigate } from "react-router-dom"

import { SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/toaster"
import ct from "@constants/"
import { useUpdateModule } from "@hooks/use-update-module"

import AppSidebar from "./app-sidebar"
import Navbar from "./header"

/**
 * MainLayout component renders the main application layout with sidebar, header, and content area.
 */
const MainLayout = () => {
  const store = useSelector((st) => st[ct.store.USER_STORE])
  const navigate = useNavigate()

  // Update current module based on route
  useUpdateModule()

  useEffect(() => {
    if (!store.isAuthenticated) {
      // route to login page
      navigate(`/${ct.route.auth.LOGIN}`, { replace: true })
    }
  }, [store.isAuthenticated, navigate])

  // Don't render the layout if user is not authenticated
  if (!store.isAuthenticated) {
    return null
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="min-h-screen w-full">
        <Navbar />
        <div className="p-6 dark:bg-[#020817]">
          <Toaster />
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  )
}

export default MainLayout
