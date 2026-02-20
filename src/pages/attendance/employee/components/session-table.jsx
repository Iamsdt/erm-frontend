import PropTypes from "prop-types"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtTime = (iso) =>
  iso
    ? new Date(iso).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—"

const fmtDuration = (mins) => {
  if (!mins) return "—"
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

const STATUS_BADGE = {
  IN_PROGRESS:
    "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
  COMPLETED:
    "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30",
  AUTO_EXPIRED:
    "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
  EDITED:
    "bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/30",
  MANUAL: "bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 border-cyan-500/30",
}

const STATUS_LABEL = {
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  AUTO_EXPIRED: "Auto-Expired",
  EDITED: "Edited",
  MANUAL: "Manual",
}

// ─── Row sub-component ────────────────────────────────────────────────────────

/** @param {{ entry: object }} props - The attendance entry to render. */
const SessionRow = ({ entry }) => {
  const isAutoExpired = entry.status === "AUTO_EXPIRED"
  return (
    <tr
      className={`border-b last:border-0 ${isAutoExpired ? "bg-amber-500/5" : ""}`}
    >
      <td className="px-4 py-3 tabular-nums">{fmtTime(entry.clockIn)}</td>
      <td className="px-4 py-3 tabular-nums">
        {isAutoExpired ? (
          <span className="text-amber-600 dark:text-amber-400">
            {fmtTime(entry.clockOut)}
          </span>
        ) : (
          fmtTime(entry.clockOut)
        )}
      </td>
      <td className="px-4 py-3 tabular-nums">
        {fmtDuration(entry.durationMinutes)}
      </td>
      <td className="px-4 py-3 max-w-xs">
        {entry.workSummary ? (
          <span
            className="text-muted-foreground truncate block max-w-50"
            title={entry.workSummary}
          >
            {entry.workSummary}
          </span>
        ) : (
          <span className="text-muted-foreground/50 italic text-xs">—</span>
        )}
      </td>
      <td className="px-4 py-3">
        <Badge
          className={`text-xs ${STATUS_BADGE[entry.status] ?? STATUS_BADGE.COMPLETED}`}
          variant="outline"
        >
          {STATUS_LABEL[entry.status] ?? entry.status}
        </Badge>
        {isAutoExpired && (
          <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-0.5">
            Auto-closed after 4h
          </p>
        )}
      </td>
    </tr>
  )
}

SessionRow.propTypes = {
  entry: PropTypes.shape({
    id: PropTypes.number,
    clockIn: PropTypes.string,
    clockOut: PropTypes.string,
    durationMinutes: PropTypes.number,
    workSummary: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * SessionTable — shows today's attendance entries below the ClockCard.
 * @param {{ todayData: object, isLoading: boolean }} props - Component props.
 */
const SessionTable = ({ todayData, isLoading }) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Today&apos;s Sessions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {[1, 2].map((index) => (
            <Skeleton key={index} className="h-10 w-full" />
          ))}
        </CardContent>
      </Card>
    )
  }

  const entries = todayData?.entries ?? []

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Today&apos;s Sessions</CardTitle>
          {todayData?.hasAutoExpiredEntry && (
            <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
              ⚠️ Auto-expired entry
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {entries.length === 0 ? (
          <p className="px-6 py-4 text-sm text-muted-foreground">
            No sessions recorded today.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="px-4 py-2 text-left font-medium text-muted-foreground">
                    Clock In
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-muted-foreground">
                    Clock Out
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-muted-foreground">
                    Duration
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-muted-foreground">
                    Work Summary
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-muted-foreground">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <SessionRow key={entry.id} entry={entry} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

SessionTable.propTypes = {
  todayData: PropTypes.shape({
    entries: PropTypes.array,
    hasAutoExpiredEntry: PropTypes.bool,
  }),
  isLoading: PropTypes.bool,
}

SessionTable.defaultProps = {
  todayData: null,
  isLoading: false,
}

export default SessionTable
