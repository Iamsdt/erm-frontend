import PropTypes from "prop-types"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const MONTH_NAMES = [
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

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

/**
 * Returns Tailwind background gradient classes based on attendance percentages.
 */
const getDayColorClass = (record) => {
  if (record.isWeekend) return "bg-muted/40 border-muted"
  const presentPct = record.present / record.total
  if (presentPct >= 0.85)
    return "bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/20"
  if (presentPct >= 0.7)
    return "bg-yellow-500/10 border-yellow-500/30 hover:bg-yellow-500/20"
  return "bg-red-500/10 border-red-500/30 hover:bg-red-500/20"
}

/**
 * Mini horizontal bar showing present / onLeave / absent proportions.
 */
const AttendanceBar = ({ present, onLeave, absent, total }) => {
  if (total === 0) return null
  const presentW = Math.round((present / total) * 100)
  const leaveW = Math.round((onLeave / total) * 100)
  const absentW = 100 - presentW - leaveW

  return (
    <div className="flex w-full h-1.5 rounded-full overflow-hidden mt-1.5 gap-px">
      <div
        className="bg-emerald-500 rounded-l-full transition-all"
        style={{ width: `${presentW}%` }}
      />
      <div
        className="bg-amber-400 transition-all"
        style={{ width: `${leaveW}%` }}
      />
      <div
        className="bg-red-500 rounded-r-full transition-all"
        style={{ width: `${absentW}%` }}
      />
    </div>
  )
}

AttendanceBar.propTypes = {
  present: PropTypes.number.isRequired,
  onLeave: PropTypes.number.isRequired,
  absent: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
}

/**
 * Summary stat card at the top.
 */
const StatCard = ({ label, value, color, icon }) => (
  <Card className={`border-0 shadow-sm ${color}`}>
    <CardContent className="flex items-center gap-3 p-4">
      <div className="text-2xl">{icon}</div>
      <div>
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
          {label}
        </p>
        <p className="text-2xl font-bold leading-none mt-0.5">{value}</p>
      </div>
    </CardContent>
  </Card>
)

StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  color: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
}

/**
 * LeaveCalendarUI — presentational component for the calendar view.
 */
const LeaveCalendarUI = ({
  year,
  month,
  data,
  isLoading,
  isError,
  onPrevMonth,
  onNextMonth,
  canGoNext,
}) => {
  const today = new Date()
  const todayStr = today.toISOString().split("T")[0]

  // Compute aggregated monthly totals (weekdays only)
  const monthTotals = data?.records?.reduce(
    (acc, r) => {
      if (!r.isWeekend) {
        acc.present += r.present
        acc.absent += r.absent
        acc.onLeave += r.onLeave
        acc.workdays += 1
      }
      return acc
    },
    { present: 0, absent: 0, onLeave: 0, workdays: 0 }
  ) ?? { present: 0, absent: 0, onLeave: 0, workdays: 0 }

  // Build calendar grid: leading empty cells + day records
  const firstDayOfWeek = new Date(year, month, 1).getDay()
  const recordMap = Object.fromEntries(
    (data?.records ?? []).map((r) => [r.date, r])
  )
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const gridCells = []
  for (let i = 0; i < firstDayOfWeek; i++) {
    gridCells.push(null)
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`
    gridCells.push(
      recordMap[dateStr] ?? {
        date: dateStr,
        isWeekend: false,
        present: 0,
        absent: 0,
        onLeave: 0,
        total: 0,
      }
    )
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64 text-destructive">
        <p>Failed to load attendance data. Please try again.</p>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Leave &amp; Attendance Calendar
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Monthly overview of employee attendance, leave, and absences.
        </p>
      </div>

      {/* Summary Stats */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard
            label="Total Employees"
            value={data?.totalEmployees ?? 0}
            color="bg-blue-500/10"
            icon="👥"
          />
          <StatCard
            label="Avg. Present / Day"
            value={
              monthTotals.workdays
                ? Math.round(monthTotals.present / monthTotals.workdays)
                : 0
            }
            color="bg-emerald-500/10"
            icon="✅"
          />
          <StatCard
            label="Avg. On Leave / Day"
            value={
              monthTotals.workdays
                ? Math.round(monthTotals.onLeave / monthTotals.workdays)
                : 0
            }
            color="bg-amber-500/10"
            icon="🏖️"
          />
          <StatCard
            label="Avg. Absent / Day"
            value={
              monthTotals.workdays
                ? Math.round(monthTotals.absent / monthTotals.workdays)
                : 0
            }
            color="bg-red-500/10"
            icon="❌"
          />
        </div>
      )}

      {/* Calendar Card */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            {/* Prev */}
            <button
              onClick={onPrevMonth}
              className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              aria-label="Previous month"
            >
              ←
            </button>

            <CardTitle className="text-lg font-semibold">
              {MONTH_NAMES[month]} {year}
            </CardTitle>

            {/* Next */}
            <button
              onClick={onNextMonth}
              disabled={!canGoNext}
              className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Next month"
            >
              →
            </button>
          </div>
        </CardHeader>

        <CardContent>
          {/* Day-of-week headers */}
          <div className="grid grid-cols-7 mb-2">
            {DAY_LABELS.map((label) => (
              <div
                key={label}
                className="text-center text-xs font-semibold text-muted-foreground py-1"
              >
                {label}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          {isLoading ? (
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 35 }).map((_, i) => (
                <Skeleton key={i} className="h-16 rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-1">
              {gridCells.map((record, idx) => {
                if (!record) {
                  return <div key={`empty-${idx}`} className="h-16 md:h-20" />
                }

                const dayNum = parseInt(record.date.split("-")[2])
                const isToday = record.date === todayStr

                return (
                  <div
                    key={record.date}
                    className={`
                      relative border rounded-lg p-1.5 md:p-2 h-16 md:h-20 transition-colors cursor-default
                      ${getDayColorClass(record)}
                      ${isToday ? "ring-2 ring-primary ring-offset-1" : ""}
                    `}
                  >
                    {/* Day number */}
                    <span
                      className={`
                        text-xs font-semibold leading-none
                        ${isToday ? "text-primary" : record.isWeekend ? "text-muted-foreground/50" : "text-foreground"}
                      `}
                    >
                      {dayNum}
                    </span>

                    {/* Counts (visible on non-weekends) */}
                    {!record.isWeekend && record.total > 0 && (
                      <div className="mt-1 space-y-0.5 hidden md:block">
                        <p className="text-[10px] text-emerald-600 font-medium leading-none">
                          ✓ {record.present}
                        </p>
                        <p className="text-[10px] text-amber-600 font-medium leading-none">
                          ⏳ {record.onLeave}
                        </p>
                        <p className="text-[10px] text-red-500 font-medium leading-none">
                          ✗ {record.absent}
                        </p>
                      </div>
                    )}

                    {/* Mini bar (mobile & desktop) */}
                    {!record.isWeekend && record.total > 0 && (
                      <AttendanceBar
                        present={record.present}
                        onLeave={record.onLeave}
                        absent={record.absent}
                        total={record.total}
                      />
                    )}

                    {/* Weekend label */}
                    {record.isWeekend && (
                      <p className="text-[9px] text-muted-foreground/40 mt-0.5 hidden md:block">
                        Weekend
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t">
            <span className="text-xs font-medium text-muted-foreground">
              Legend:
            </span>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-xs text-muted-foreground">Present</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <span className="text-xs text-muted-foreground">On Leave</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-xs text-muted-foreground">Absent</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-muted" />
              <span className="text-xs text-muted-foreground">Weekend</span>
            </div>
            <div className="flex items-center gap-1.5 ml-auto">
              <div className="w-3 h-3 rounded-full ring-2 ring-primary bg-transparent" />
              <span className="text-xs text-muted-foreground">Today</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Color-coded key explanation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
        <div className="flex items-start gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <span className="text-lg mt-0.5">🟢</span>
          <div>
            <p className="font-semibold text-emerald-700 dark:text-emerald-400">
              High Attendance
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              85%+ of employees present
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
          <span className="text-lg mt-0.5">🟡</span>
          <div>
            <p className="font-semibold text-yellow-700 dark:text-yellow-400">
              Moderate Attendance
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              70–84% of employees present
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
          <span className="text-lg mt-0.5">🔴</span>
          <div>
            <p className="font-semibold text-red-700 dark:text-red-400">
              Low Attendance
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Below 70% of employees present
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

LeaveCalendarUI.propTypes = {
  year: PropTypes.number.isRequired,
  month: PropTypes.number.isRequired,
  data: PropTypes.shape({
    totalEmployees: PropTypes.number,
    records: PropTypes.arrayOf(
      PropTypes.shape({
        date: PropTypes.string,
        isWeekend: PropTypes.bool,
        present: PropTypes.number,
        absent: PropTypes.number,
        onLeave: PropTypes.number,
        total: PropTypes.number,
      })
    ),
  }),
  isLoading: PropTypes.bool.isRequired,
  isError: PropTypes.bool.isRequired,
  onPrevMonth: PropTypes.func.isRequired,
  onNextMonth: PropTypes.func.isRequired,
  canGoNext: PropTypes.bool.isRequired,
}

export default LeaveCalendarUI
