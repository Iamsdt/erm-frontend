import { ScrollText } from "lucide-react"
import PropTypes from "prop-types"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"

// ─── Constants ────────────────────────────────────────────────────────────────

const MODULE_OPTIONS = [
  { value: "all", label: "All Modules" },
  { value: "leave", label: "Leave" },
  { value: "attendance", label: "Attendance" },
  { value: "employee", label: "Employee" },
  { value: "project", label: "Project" },
  { value: "settings", label: "Settings" },
]

const ACTION_OPTIONS = [
  { value: "all", label: "All Actions" },
  { value: "created", label: "Created" },
  { value: "updated", label: "Updated" },
  { value: "deleted", label: "Deleted" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
]

const ACTION_BADGE_MAP = {
  created: { variant: "default", className: "" },
  updated: { variant: "secondary", className: "" },
  deleted: { variant: "destructive", className: "" },
  approved: {
    variant: "outline",
    className: "border-green-500 text-green-700 dark:text-green-400",
  },
  rejected: {
    variant: "outline",
    className: "border-red-500 text-red-700 dark:text-red-400",
  },
}

const MODULE_BADGE_CLASS = {
  leave: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  attendance:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  employee:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300",
  project:
    "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  settings: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Formats an ISO timestamp to a human-readable relative time string.
 * @param {string} iso - ISO 8601 timestamp
 * @returns {string} Relative time string
 */
const formatRelativeTime = (iso) => {
  const diffMs = Date.now() - new Date(iso).getTime()
  const minutes = Math.floor(diffMs / 60_000)
  if (minutes < 1) return "Just now"
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  return `${months}mo ago`
}

/**
 * Returns badge props for a given action type.
 * @param {string} action - Action type
 * @returns {{ variant: string, className: string }} Badge variant and class name
 */
const getActionBadgeProperties = (action) =>
  ACTION_BADGE_MAP[action] || { variant: "secondary", className: "" }

// ─── Sub-components ───────────────────────────────────────────────────────────

const AuditSkeleton = () => (
  <div className="flex gap-4 py-4">
    <Skeleton className="h-10 w-10 rounded-full shrink-0" />
    <div className="flex flex-col gap-2 flex-1">
      <Skeleton className="h-4 w-48" />
      <Skeleton className="h-3 w-72" />
      <div className="flex gap-2">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-20" />
      </div>
    </div>
    <Skeleton className="h-3 w-16" />
  </div>
)

const auditEntryShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  timestamp: PropTypes.string.isRequired,
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
  }).isRequired,
  module: PropTypes.string.isRequired,
  action: PropTypes.string.isRequired,
  target: PropTypes.string.isRequired,
  details: PropTypes.string.isRequired,
  ip: PropTypes.string.isRequired,
})

/**
 * AuditEntryItem — renders a single audit log entry in the timeline.
 */
const AuditEntryItem = ({ entry }) => {
  const badgeProperties = getActionBadgeProperties(entry.action)
  const moduleClass = MODULE_BADGE_CLASS[entry.module] || ""

  return (
    <div className="flex gap-4 py-4 relative">
      <div className="absolute left-5 top-14 bottom-0 w-px bg-border -z-10" />
      <Avatar className="h-10 w-10 shrink-0">
        <AvatarFallback className="text-xs font-medium">
          {entry.user.avatar}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-sm">{entry.user.name}</span>
          <Badge
            variant={badgeProperties.variant}
            className={badgeProperties.className}
          >
            {entry.action}
          </Badge>
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${moduleClass}`}
          >
            {entry.module}
          </span>
        </div>
        <p className="text-sm font-medium mt-1">{entry.target}</p>
        <p className="text-sm text-muted-foreground mt-0.5">{entry.details}</p>
      </div>
      <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0 pt-1">
        {formatRelativeTime(entry.timestamp)}
      </span>
    </div>
  )
}

AuditEntryItem.propTypes = {
  entry: auditEntryShape.isRequired,
}

/**
 * FilterBar — renders module and action filter dropdowns.
 */
const FilterBar = ({
  moduleFilter,
  actionFilter,
  onModuleFilterChange,
  onActionFilterChange,
}) => (
  <div className="flex items-center gap-3 flex-wrap">
    <Select value={moduleFilter} onValueChange={onModuleFilterChange}>
      <SelectTrigger className="w-[160px]">
        <SelectValue placeholder="Module" />
      </SelectTrigger>
      <SelectContent>
        {MODULE_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    <Select value={actionFilter} onValueChange={onActionFilterChange}>
      <SelectTrigger className="w-[160px]">
        <SelectValue placeholder="Action" />
      </SelectTrigger>
      <SelectContent>
        {ACTION_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
)

FilterBar.propTypes = {
  moduleFilter: PropTypes.string.isRequired,
  actionFilter: PropTypes.string.isRequired,
  onModuleFilterChange: PropTypes.func.isRequired,
  onActionFilterChange: PropTypes.func.isRequired,
}

/**
 * AuditList — renders appropriate content state (error, loading, empty, or list).
 */
const AuditList = ({ entries, isLoading, isError }) => {
  if (isError) {
    return (
      <p className="text-center py-8 text-sm text-destructive">
        Failed to load activity log. Please try again.
      </p>
    )
  }

  if (isLoading) {
    return (
      <div className="divide-y">
        {Array.from({ length: 5 }).map((_, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <AuditSkeleton key={index} />
        ))}
      </div>
    )
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <ScrollText className="h-12 w-12 mx-auto mb-3 opacity-40" />
        <p className="text-sm">No activity recorded yet.</p>
        <p className="text-xs mt-1">Actions across modules will appear here.</p>
      </div>
    )
  }

  return (
    <ScrollArea className="h-[600px] pr-4">
      <div className="divide-y border-l-2 border-border ml-5 pl-0">
        {entries.map((entry) => (
          <AuditEntryItem key={entry.id} entry={entry} />
        ))}
      </div>
    </ScrollArea>
  )
}

AuditList.propTypes = {
  entries: PropTypes.arrayOf(auditEntryShape).isRequired,
  isLoading: PropTypes.bool.isRequired,
  isError: PropTypes.bool.isRequired,
}

// ─── Main presenter ───────────────────────────────────────────────────────────

/**
 * AuditUI — presenter for the activity log page.
 */
const AuditUI = ({
  entries,
  isLoading,
  isError,
  moduleFilter,
  actionFilter,
  onModuleFilterChange,
  onActionFilterChange,
}) => (
  <div className="container mx-auto p-4 max-w-4xl">
    <Card>
      <CardHeader className="space-y-4">
        <div className="flex items-center gap-2">
          <ScrollText className="h-5 w-5" />
          <div>
            <CardTitle className="text-xl font-bold">Activity Log</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Track all changes across your organization
            </p>
          </div>
        </div>
        <FilterBar
          moduleFilter={moduleFilter}
          actionFilter={actionFilter}
          onModuleFilterChange={onModuleFilterChange}
          onActionFilterChange={onActionFilterChange}
        />
      </CardHeader>
      <CardContent>
        <AuditList entries={entries} isLoading={isLoading} isError={isError} />
      </CardContent>
    </Card>
  </div>
)

AuditUI.propTypes = {
  entries: PropTypes.arrayOf(auditEntryShape).isRequired,
  isLoading: PropTypes.bool.isRequired,
  isError: PropTypes.bool.isRequired,
  moduleFilter: PropTypes.string.isRequired,
  actionFilter: PropTypes.string.isRequired,
  onModuleFilterChange: PropTypes.func.isRequired,
  onActionFilterChange: PropTypes.func.isRequired,
}

export default AuditUI
