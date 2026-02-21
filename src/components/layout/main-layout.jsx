import { useEffect } from "react"
import { useSelector } from "react-redux"
import { Outlet, useNavigate } from "react-router-dom"

import ModeToggle from "@/components/layout/header/theme-switch"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/toaster"
import ct from "@constants/"

import AppSidebar from "./app-sidebar"
import AppBarClock from "./header/app-bar-clock"
import LanguageNav from "./header/language-nav"
import UserNav from "./header/user-nav"

/**
 * MainLayout component renders the main application layout with sidebar, header, and content area.
 */
const MainLayout = () => {
  const store = useSelector((st) => st[ct.store.USER_STORE])
  const navigate = useNavigate()

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
        <div className="sticky top-0 z-50 w-full dark:shadow-secondary flex items-center justify-between p-4 bg-white dark:bg-[#020817] border-b dark:border-slate-800">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <AppBarClock />
            <LanguageNav />
            <ModeToggle />
            <UserNav />
          </div>
        </div>
        <div className="p-6 dark:bg-[#020817]">
          <Toaster />
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  )
}

export default MainLayout
