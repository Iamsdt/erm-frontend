import { Bell } from "lucide-react"
import { Link } from "react-router"

import { Button } from "@/components/ui/button"

const NotificationNav = () => {
  // In a real app, this would come from a store or API
  const unreadCount = 2

  return (
    <Button variant="ghost" size="icon" asChild className="relative">
      <Link to="/notifications">
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-destructive">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
          </span>
        )}
        <span className="sr-only">Notifications</span>
      </Link>
    </Button>
  )
}

export default NotificationNav
