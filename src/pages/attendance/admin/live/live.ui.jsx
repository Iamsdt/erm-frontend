import PropTypes from "prop-types"
import { useMemo } from "react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

/**
 * Duration in minutes → "Xh Ym" string.
 * @param {number|null} minutes - Duration in minutes to format.
 * @returns {string} Formatted duration string.
 */
const formatDuration = (minutes) => {
  if (minutes == null) return "—"
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

const statusBadge = (status) => {
  const map = {
    IN_PROGRESS: "default",
    COMPLETED: "secondary",
    AUTO_EXPIRED: "outline",
    EDITED: "secondary",
    MANUAL: "secondary",
    FLAGGED: "destructive",
  }
  return <Badge variant={map[status] ?? "outline"}>{status}</Badge>
}

/**
 * LiveRow — one row of the live status table.
 * @param {object} props - Component props.
 * @param {object} props.entry - Attendance entry data.
 * @returns {JSX.Element} Table row element.
 */
const LiveRow = ({ entry }) => {
  const clockedInAt = useMemo(
    () => new Date(entry.clockedInAt),
    [entry.clockedInAt]
  )

  // Calculate elapsed time on each render - this is intentional as we want
  // the time to update on each render cycle without external dependencies

  const elapsedMinutes = Math.floor(
    (Date.now() - clockedInAt.getTime()) / 60000
  )

  const rowClassName = entry.willAutoExpire
    ? "bg-amber-50 dark:bg-amber-950/30"
    : ""

  return (
    <tr className={rowClassName}>
      <td className="px-3 py-2 text-sm font-medium">{entry.employeeName}</td>
      <td className="px-3 py-2 text-sm text-muted-foreground">
        {entry.department ?? "—"}
      </td>
      <td className="px-3 py-2 text-sm">{clockedInAt.toLocaleTimeString()}</td>
      <td className="px-3 py-2 text-sm">{formatDuration(elapsedMinutes)}</td>
      <td className="px-3 py-2 text-sm">
        {entry.willAutoExpire ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Badge
                  variant="outline"
                  className="border-amber-400 text-amber-600"
                >
                  Expiring soon
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                Auto-expiry in ~{Math.ceil((entry.expiresInSeconds ?? 0) / 60)}{" "}
                min
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        )}
      </td>
    </tr>
  )
}

LiveRow.propTypes = {
  entry: PropTypes.shape({
    employeeId: PropTypes.number,
    employeeName: PropTypes.string,
    department: PropTypes.string,
    clockedInAt: PropTypes.string,
    willAutoExpire: PropTypes.bool,
    expiresInSeconds: PropTypes.number,
  }).isRequired,
}

/**
 * AdminLiveUI — presenter for the admin live attendance status page.
 * @param {object} props - Component props.
 * @param {object} [props.liveData] - Live attendance data object.
 * @param {Array<object>} [props.liveData.active] - List of actively clocked-in employees.
 * @param {Array<object>} [props.liveData.notClocked] - List of employees not clocked in.
 * @param {boolean} [props.isLoading] - Loading state indicator.
 * @returns {JSX.Element} The rendered live attendance UI.
 */
const AdminLiveUI = ({ liveData, isLoading }) => {
  const active = liveData?.active ?? []
  const notClocked = liveData?.notClocked ?? []

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Live Attendance</h1>
          <p className="text-sm text-muted-foreground">
            Real-time view of who is currently clocked in. Refreshes every 30 s.
          </p>
        </div>
        {!isLoading && (
          <Badge variant="default">{active.length} clocked in</Badge>
        )}
      </div>

      <Separator />

      {/* Clocked-in table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Currently Clocked In</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="px-3 py-2 font-medium">Employee</th>
                  <th className="px-3 py-2 font-medium">Department</th>
                  <th className="px-3 py-2 font-medium">Clocked In At</th>
                  <th className="px-3 py-2 font-medium">Duration</th>
                  <th className="px-3 py-2 font-medium">Expiry Warning</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => {
                    const rowId = `skeleton-${Date.now()}-${index}`
                    return (
                      <tr key={rowId}>
                        {Array.from({ length: 5 }).map((__, cellIndex) => (
                          <td
                            key={`${rowId}-${cellIndex}`}
                            className="px-3 py-2"
                          >
                            <Skeleton className="h-4 w-24" />
                          </td>
                        ))}
                      </tr>
                    )
                  })
                ) : active.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-3 py-6 text-center text-sm text-muted-foreground"
                    >
                      No employees are currently clocked in.
                    </td>
                  </tr>
                ) : (
                  active.map((entry) => (
                    <LiveRow key={entry.employeeId} entry={entry} />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Not clocked in */}
      {!isLoading && notClocked.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-muted-foreground">
              Not Clocked In Today
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-xs text-muted-foreground">
                    <th className="px-3 py-2 font-medium">Employee</th>
                    <th className="px-3 py-2 font-medium">Department</th>
                    <th className="px-3 py-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {notClocked.map((emp) => (
                    <tr key={emp.id}>
                      <td className="px-3 py-2 text-sm">{emp.name}</td>
                      <td className="px-3 py-2 text-sm text-muted-foreground">
                        {emp.department ?? "—"}
                      </td>
                      <td className="px-3 py-2">
                        {statusBadge("NOT_CLOCKED")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

AdminLiveUI.propTypes = {
  liveData: PropTypes.shape({
    active: PropTypes.array,
    notClocked: PropTypes.array,
  }),
  isLoading: PropTypes.bool,
}

AdminLiveUI.defaultProps = {
  liveData: null,
  isLoading: false,
}

export default AdminLiveUI
