import { CalendarDays } from "lucide-react"
import { useSelector } from "react-redux"
import { Link } from "react-router"

import ModeToggle from "@/components/layout/header/theme-switch"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import ct from "@constants/"

import LanguageNav from "./language-nav"
import UserNav from "./user-nav"
// import SheetMenu from "../sidebars/sheet-menu"

/**
 * Navbar component renders the top navigation bar with user controls.
 */
const STATUS_LABEL = "Standup:"
const STATUS_DONE = "Done"
const STATUS_IN_REVIEW = "In Review"
const COLOR_DONE = "bg-green-600"
const COLOR_IN_REVIEW = "bg-blue-600"

const Navbar = () => {
  const appState = useSelector((state) => state[ct.store.APP_STORE])
  const { currentModule, standupStatus } = appState || {
    currentModule: "ERM",
    standupStatus: "Not Submitted",
  }

  const getStandupStatusBadgeVariant = () => {
    if (standupStatus === STATUS_DONE) return "default"
    if (standupStatus === STATUS_IN_REVIEW) return "secondary"
    return "outline"
  }

  const getStandupStatusColor = () => {
    if (standupStatus === STATUS_DONE) return COLOR_DONE
    if (standupStatus === STATUS_IN_REVIEW) return COLOR_IN_REVIEW
    return "bg-gray-400"
  }

  return (
    <header className="sticky top-0 z-10 w-full bg-background/95 shadow-sm backdrop-blur-sm supports-backdrop-filter:bg-background/60 dark:shadow-secondary">
      <div className="mx-4 sm:mx-8 flex h-14 items-center">
        {/* Left Side - Current Module */}
        <div className="flex items-center gap-2 text-sm">
          <span className="font-semibold text-foreground">{currentModule}</span>
        </div>

        <div className="flex-1" />

        {/* Right Side - Controls */}
        <div className="flex gap-x-5 items-center space-x-2">
          {/* Standup Status */}
          <Button
            variant="outline"
            size="sm"
            asChild
            className="hidden sm:flex gap-2"
          >
            <Link to="/daily-update/standup/new">
              <CalendarDays className="h-4 w-4" />
              Standup: {standupStatus}
            </Link>
          </Button>
          <LanguageNav />
          <ModeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  )
}

export default Navbar
