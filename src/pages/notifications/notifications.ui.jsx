import { AlertTriangle, Bell, Check, CheckCircle2, Trash2 } from "lucide-react"
import PropTypes from "prop-types"
import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ct from "@constants/"

// ─── Constants ───────────────────────────────────────────────────────────────

const NOTIFICATION_ROUTES = {
  leave: ct.route.leave.EMPLOYEE_DASHBOARD,
  project: ct.route.project.LIST,
  reminder: ct.route.dailyUpdate.STANDUP,
  system: null,
}

const PRIORITY_URGENT = "urgent"
const PRIORITY_MEDIUM = "medium"
const PRIORITY_NORMAL = "normal"
const PRIORITY_LOW = "low"

const FILTER_ALL = "all"
const FILTER_ACTION_REQUIRED = "action_required"
const FILTER_UPDATES = "updates"
const FILTER_READ = "read"

const PRIORITY_BORDER_CLASSES = {
  [PRIORITY_URGENT]: "border-l-4 border-l-red-500",
  [PRIORITY_MEDIUM]: "border-l-4 border-l-amber-500",
  [PRIORITY_NORMAL]: "border-l-4 border-l-blue-500",
  [PRIORITY_LOW]: "border-l-4 border-l-gray-300",
}

const PRIORITY_DOT_CLASSES = {
  [PRIORITY_URGENT]: "bg-red-500",
  [PRIORITY_MEDIUM]: "bg-amber-500",
  [PRIORITY_NORMAL]: "bg-blue-500",
  [PRIORITY_LOW]: "bg-gray-400",
}

// ─── Priority Derivation ─────────────────────────────────────────────────────

/**
 * Derives a priority level from the notification type and action fields.
 * Leave notifications with pending/request actions are urgent; reminders
 * are medium; leave approved/rejected and project updates are normal;
 * system notifications are low priority.
 */
const derivePriority = (notification) => {
  const { type, action } = notification
  const actionLower = (action ?? "").toLowerCase()

  if (type === "leave") {
    const isPending =
      actionLower.includes("pending") || actionLower.includes("request")
    return isPending ? PRIORITY_URGENT : PRIORITY_NORMAL
  }

  if (type === "reminder") return PRIORITY_MEDIUM
  if (type === "project") return PRIORITY_NORMAL
  return PRIORITY_LOW
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Formats an ISO timestamp to a human-readable relative time string.
 * @param {string} iso - ISO 8601 timestamp
 * @returns {string} Relative time string (e.g. "2 hours ago")
 */
const formatRelativeTime = (iso) => {
  const diffMs = Date.now() - new Date(iso).getTime()
  const minutes = Math.floor(diffMs / 60_000)
  if (minutes < 1) return "Just now"
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

/**
 * Filters notifications based on the active tab selection.
 */
const filterNotifications = (notifications, activeFilter) => {
  switch (activeFilter) {
    case FILTER_ACTION_REQUIRED: {
      return notifications.filter(
        (item) => derivePriority(item) === PRIORITY_URGENT
      )
    }
    case FILTER_UPDATES: {
      return notifications.filter(
        (item) => derivePriority(item) !== PRIORITY_URGENT && !item.read
      )
    }
    case FILTER_READ: {
      return notifications.filter((item) => item.read)
    }
    default: {
      return notifications
    }
  }
}

// ─── Sub-components ──────────────────────────────────────────────────────────

const NotificationSkeleton = () => (
  <div className="flex items-start justify-between p-4 rounded-lg border">
    <div className="flex flex-col gap-2 flex-1">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-3 w-64" />
      <Skeleton className="h-3 w-16" />
    </div>
    <Skeleton className="h-8 w-8 rounded" />
  </div>
)

const notificationPropertyType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  read: PropTypes.bool.isRequired,
  type: PropTypes.string.isRequired,
  action: PropTypes.string,
})

/**
 * PriorityIndicator — renders the colored dot and optional badge
 * that signals the urgency level of a notification.
 */
const PriorityIndicator = ({ priority }) => {
  const dotClass =
    PRIORITY_DOT_CLASSES[priority] ?? PRIORITY_DOT_CLASSES[PRIORITY_LOW]

  return (
    <div className="flex items-center gap-1.5">
      <span className={`h-2 w-2 rounded-full shrink-0 ${dotClass}`} />
      {priority === PRIORITY_URGENT && (
        <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
          Action needed
        </Badge>
      )}
    </div>
  )
}

PriorityIndicator.propTypes = {
  priority: PropTypes.oneOf([
    PRIORITY_URGENT,
    PRIORITY_MEDIUM,
    PRIORITY_NORMAL,
    PRIORITY_LOW,
  ]).isRequired,
}

/**
 * UrgencySummaryBanner — displayed when there are urgent notifications
 * requiring user action. Hidden when no urgent items exist.
 */
const UrgencySummaryBanner = ({ urgentCount }) => {
  if (urgentCount === 0) return null

  const label =
    urgentCount === 1
      ? "1 notification needs your attention"
      : `${urgentCount} notifications need your attention`

  return (
    <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg p-3 mb-4">
      <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
        <AlertTriangle className="h-4 w-4 shrink-0" />
        <span className="text-sm font-medium">{label}</span>
      </div>
    </div>
  )
}

UrgencySummaryBanner.propTypes = {
  urgentCount: PropTypes.number,
}

UrgencySummaryBanner.defaultProps = {
  urgentCount: 0,
}

/**
 * NotificationItem — renders a single notification row with priority
 * indicators, colored border, and action buttons.
 */
const NotificationItem = ({ notification, onMarkAsRead, onDelete }) => {
  const navigate = useNavigate()
  const targetRoute = NOTIFICATION_ROUTES[notification.type]
  const priority = derivePriority(notification)
  const borderClass = PRIORITY_BORDER_CLASSES[priority]

  const handleClick = () => {
    if (!notification.read) onMarkAsRead(notification.id)
    if (targetRoute) navigate(targetRoute)
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(event) => event.key === "Enter" && handleClick()}
      className={`flex items-start justify-between p-4 rounded-lg border transition-colors cursor-pointer hover:bg-muted/30 ${borderClass} ${
        notification.read ? "bg-background" : "bg-muted/50 border-primary/20"
      }`}
    >
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold">{notification.title}</span>
          <PriorityIndicator priority={priority} />
        </div>
        <p className="text-sm text-muted-foreground">{notification.message}</p>
        <span className="text-xs text-muted-foreground mt-1">
          {formatRelativeTime(notification.time)}
        </span>
      </div>
      <div className="flex items-center gap-2 shrink-0 ml-2">
        {!notification.read && (
          <Button
            variant="ghost"
            size="icon"
            onClick={(event) => {
              event.stopPropagation()
              onMarkAsRead(notification.id)
            }}
            title="Mark as read"
          >
            <Check className="h-4 w-4" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={(event) => {
            event.stopPropagation()
            onDelete(notification.id)
          }}
          title="Delete notification"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

NotificationItem.propTypes = {
  notification: notificationPropertyType.isRequired,
  onMarkAsRead: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}

/**
 * NotificationFilterTabs — tab bar for filtering notifications by category.
 * Shows a count badge on the "Action Required" tab when urgent items exist.
 */
const NotificationFilterTabs = ({
  activeFilter,
  onFilterChange,
  actionRequiredCount,
}) => (
  <Tabs value={activeFilter} onValueChange={onFilterChange} className="mb-4">
    <TabsList className="w-full justify-start">
      <TabsTrigger value={FILTER_ALL}>All</TabsTrigger>
      <TabsTrigger value={FILTER_ACTION_REQUIRED} className="gap-1.5">
        Action Required
        {actionRequiredCount > 0 && (
          <Badge variant="destructive" className="text-[10px] px-1.5 py-0 ml-1">
            {actionRequiredCount}
          </Badge>
        )}
      </TabsTrigger>
      <TabsTrigger value={FILTER_UPDATES}>Updates</TabsTrigger>
      <TabsTrigger value={FILTER_READ}>Read</TabsTrigger>
    </TabsList>
  </Tabs>
)

NotificationFilterTabs.propTypes = {
  activeFilter: PropTypes.string.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  actionRequiredCount: PropTypes.number,
}

NotificationFilterTabs.defaultProps = {
  actionRequiredCount: 0,
}

/**
 * NotificationList — renders the appropriate content state
 * (error, loading, empty, or the scrollable list).
 */
const NotificationList = ({
  notifications,
  isLoading,
  isError,
  onMarkAsRead,
  onDelete,
}) => {
  if (isError) {
    return (
      <p className="text-center py-8 text-sm text-destructive">
        Failed to load notifications. Please try again.
      </p>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <NotificationSkeleton key={index} />
        ))}
      </div>
    )
  }

  if (notifications.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
          <CheckCircle2 className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
        </div>
        <p className="text-lg font-semibold">You&apos;re all caught up!</p>
        <p className="mx-auto mt-2 max-w-xs text-sm text-muted-foreground">
          No new notifications. We&apos;ll let you know when something needs
          your attention.
        </p>
      </div>
    )
  }

  return (
    <ScrollArea className="h-[600px] pr-4">
      <div className="space-y-4">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onMarkAsRead={onMarkAsRead}
            onDelete={onDelete}
          />
        ))}
      </div>
    </ScrollArea>
  )
}

NotificationList.propTypes = {
  notifications: PropTypes.arrayOf(notificationPropertyType).isRequired,
  isLoading: PropTypes.bool.isRequired,
  isError: PropTypes.bool.isRequired,
  onMarkAsRead: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}

/**
 * NotificationsUI — presenter for the notifications page.
 * Includes priority indicators, filter tabs, and an urgency summary banner.
 */
const NotificationsUI = ({
  notifications,
  isLoading,
  isError,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
}) => {
  const [activeFilter, setActiveFilter] = useState(FILTER_ALL)

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length

  const urgentCount = useMemo(
    () =>
      notifications.filter(
        (notification) => derivePriority(notification) === PRIORITY_URGENT
      ).length,
    [notifications]
  )

  const filteredNotifications = useMemo(
    () => filterNotifications(notifications, activeFilter),
    [notifications, activeFilter]
  )

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <CardTitle className="text-xl font-bold">Notifications</CardTitle>
            {unreadCount > 0 && (
              <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={onMarkAllAsRead}>
              <Check className="mr-2 h-4 w-4" />
              Mark all as read
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <NotificationFilterTabs
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            actionRequiredCount={urgentCount}
          />
          <UrgencySummaryBanner urgentCount={urgentCount} />
          <NotificationList
            notifications={filteredNotifications}
            isLoading={isLoading}
            isError={isError}
            onMarkAsRead={onMarkAsRead}
            onDelete={onDelete}
          />
        </CardContent>
      </Card>
    </div>
  )
}

NotificationsUI.propTypes = {
  notifications: PropTypes.arrayOf(notificationPropertyType).isRequired,
  isLoading: PropTypes.bool.isRequired,
  isError: PropTypes.bool.isRequired,
  onMarkAsRead: PropTypes.func.isRequired,
  onMarkAllAsRead: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}

export default NotificationsUI
