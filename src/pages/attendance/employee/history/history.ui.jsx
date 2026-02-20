import PropTypes from "prop-types"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

// ─── Helpers ──────────────────────────────────────────────────────────────────

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

const fmtTime = (iso) =>
  iso
    ? new Date(iso).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—"

const fmtMins = (mins) => {
  if (!mins) return "0m"
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

const STATUS_BADGE = {
  COMPLETED:
    "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30",
  AUTO_EXPIRED:
    "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
  EDITED:
    "bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/30",
  MANUAL: "bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 border-cyan-500/30",
  IN_PROGRESS:
    "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
}

const STATUS_LABEL = {
  COMPLETED: "Completed",
  AUTO_EXPIRED: "Auto-Expired",
  EDITED: "Edited",
  MANUAL: "Manual",
  IN_PROGRESS: "In Progress",
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const SummaryCard = ({ label, value, accent }) => (
  <Card className={`border-0 shadow-sm ${accent}`}>
    <CardContent className="p-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p className="text-2xl font-extrabold mt-1">{value}</p>
    </CardContent>
  </Card>
)

SummaryCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  accent: PropTypes.string.isRequired,
}

// ─── Component ────────────────────────────────────────────────────────────────

/** @param {{ entries: Array }} props - Table rows data. */
const HistoryTableBody = ({ entries }) => (
  <tbody>
    {entries.map((day) => {
      if (!day.entries?.length) return null
      return day.entries.map((entry) => (
        <tr
          key={entry.id}
          className={`border-b last:border-0 ${entry.status === "AUTO_EXPIRED" ? "bg-amber-500/5" : ""}`}
        >
          <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
            {day.date}
          </td>
          <td className="px-4 py-3 tabular-nums">{fmtTime(entry.clockIn)}</td>
          <td className="px-4 py-3 tabular-nums">{fmtTime(entry.clockOut)}</td>
          <td className="px-4 py-3 tabular-nums">
            {fmtMins(entry.durationMinutes)}
          </td>
          <td className="px-4 py-3 max-w-50">
            <span
              className="text-muted-foreground truncate block"
              title={entry.workSummary ?? "—"}
            >
              {entry.workSummary ?? "—"}
            </span>
          </td>
          <td className="px-4 py-3">
            <Badge
              className={`text-xs ${STATUS_BADGE[entry.status] ?? STATUS_BADGE.COMPLETED}`}
              variant="outline"
            >
              {STATUS_LABEL[entry.status] ?? entry.status}
            </Badge>
          </td>
        </tr>
      ))
    })}
  </tbody>
)

HistoryTableBody.propTypes = {
  entries: PropTypes.array.isRequired,
}

/**
 * Derives summary stats from history API data.
 * @param {object|null} data - Raw data from useAttendanceHistory().
 * @returns {{ entries: Array, totalDays: number, totalMins: number, avgMins: number }} Derived stats.
 */
const deriveHistory = (data) => ({
  entries: data?.entries ?? [],
  totalDays: data?.totalDaysWorked ?? 0,
  totalMins: data?.totalWorkMinutes ?? 0,
  avgMins: data?.avgMinutesPerDay ?? 0,
})

/**
 * HistoryUI — presenter for the employee attendance history page.
 * @param {{ data: object, isLoading: boolean, year: number, month: number, onYearChange: (y: number) => void, onMonthChange: (m: number) => void }} props - Component props.
 */
const HistoryUI = ({
  data,
  isLoading,
  year,
  month,
  onYearChange,
  onMonthChange,
}) => {
  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto p-4 md:p-6 flex flex-col gap-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((index) => (
            <Skeleton key={index} className="h-20 w-full" />
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  const { entries, totalDays, totalMins, avgMins } = deriveHistory(data)

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-2xl font-bold">My History</h1>

        {/* Month / Year picker */}
        <div className="flex items-center gap-2">
          <select
            className="h-9 rounded-md border bg-background px-3 py-1 text-sm"
            value={month}
            onChange={(event) => onMonthChange(Number(event.target.value))}
          >
            {MONTHS.map((m, index) => (
              <option key={m} value={index + 1}>
                {m}
              </option>
            ))}
          </select>
          <select
            className="h-9 rounded-md border bg-background px-3 py-1 text-sm"
            value={year}
            onChange={(event) => onYearChange(Number(event.target.value))}
          >
            {[2024, 2025, 2026].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        <SummaryCard
          label="Days Worked"
          value={String(totalDays)}
          accent="bg-emerald-500/5"
        />
        <SummaryCard
          label="Total Hours"
          value={fmtMins(totalMins)}
          accent="bg-blue-500/5"
        />
        <SummaryCard
          label="Avg / Day"
          value={fmtMins(avgMins)}
          accent="bg-purple-500/5"
        />
      </div>

      {/* Entries table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">
            {MONTHS[month - 1]} {year}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {entries.length === 0 ? (
            <p className="px-6 py-4 text-sm text-muted-foreground">
              No entries for this period.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/40">
                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">
                      Date
                    </th>
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
                      Summary
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">
                      Status
                    </th>
                  </tr>
                </thead>
                <HistoryTableBody entries={entries} />
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

HistoryUI.propTypes = {
  data: PropTypes.object,
  isLoading: PropTypes.bool.isRequired,
  year: PropTypes.number.isRequired,
  month: PropTypes.number.isRequired,
  onYearChange: PropTypes.func.isRequired,
  onMonthChange: PropTypes.func.isRequired,
}

HistoryUI.defaultProps = {
  data: null,
}

export default HistoryUI
