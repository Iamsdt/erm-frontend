import { Clock, Loader2, UserX } from "lucide-react"
import PropTypes from "prop-types"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

/* eslint-disable complexity, react/no-array-index-key */

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

const getDayColorClass = (record) => {
  if (record.isWeekend) return "bg-muted/40 border-muted"
  const presentPct = record.present / record.total
  if (presentPct >= 0.85) {
    return "bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/20"
  }
  if (presentPct >= 0.7) {
    return "bg-yellow-500/10 border-yellow-500/30 hover:bg-yellow-500/20"
  }
  return "bg-red-500/10 border-red-500/30 hover:bg-red-500/20"
}

const AttendanceBar = ({ present, leaveCount, total }) => {
  if (total === 0) return null
  const presentW = Math.round((present / total) * 100)
  const leaveW = Math.round((leaveCount / total) * 100)
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
  leaveCount: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
}

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

// ─── Avatar helper ────────────────────────────────────────────────────────────

const initials = (name) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

// ─── Day Detail Sheet ─────────────────────────────────────────────────────────

const DayDetailSheet = ({ open, onClose, date, dayDetail, isLoading }) => {
  const formatted = date
    ? new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : ""

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md flex flex-col p-0"
      >
        <SheetHeader className="px-5 pt-5 pb-4 border-b shrink-0">
          <SheetTitle className="text-base font-bold">{formatted}</SheetTitle>

          {/* Mini summary pills */}
          {isLoading ? (
            <div className="flex gap-2 mt-2">
              {[1, 2, 3].map((index) => (
                <Skeleton key={index} className="h-6 w-20 rounded-full" />
              ))}
            </div>
          ) : dayDetail ? (
            <div className="flex gap-2 flex-wrap mt-1">
              <Badge className="gap-1.5 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
                {dayDetail.summary.present} Present
              </Badge>
              <Badge className="gap-1.5 bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 inline-block" />
                {dayDetail.summary.onLeave} On Leave
              </Badge>
              <Badge className="gap-1.5 bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/20 hover:bg-red-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 inline-block" />
                {dayDetail.summary.absent} Absent
              </Badge>
            </div>
          ) : null}
        </SheetHeader>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Tabs defaultValue="present" className="flex-1 flex flex-col min-h-0">
            <TabsList className="mx-5 mt-4 grid grid-cols-3 shrink-0">
              <TabsTrigger value="present" className="gap-1.5 text-xs">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Present ({dayDetail?.present?.length ?? 0})
              </TabsTrigger>
              <TabsTrigger value="leave" className="gap-1.5 text-xs">
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                Leave ({dayDetail?.onLeave?.length ?? 0})
              </TabsTrigger>
              <TabsTrigger value="absent" className="gap-1.5 text-xs">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                Absent ({dayDetail?.absent?.length ?? 0})
              </TabsTrigger>
            </TabsList>

            {/* ── Present tab ──────────────────────────────────── */}
            <TabsContent
              value="present"
              className="flex-1 min-h-0 mt-0 data-[state=inactive]:hidden"
            >
              <ScrollArea className="h-full px-5 py-4">
                <div className="space-y-2">
                  {dayDetail?.present?.map((emp) => (
                    <div
                      key={emp.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/15 hover:bg-emerald-500/10 transition-colors"
                    >
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarFallback className="text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                          {initials(emp.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {emp.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {emp.department}
                        </p>
                      </div>
                      {emp.checkIn && (
                        <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium shrink-0">
                          <Clock className="h-3 w-3" />
                          {emp.checkIn}
                        </div>
                      )}
                    </div>
                  ))}
                  {!dayDetail?.present?.length && (
                    <EmptyState label="No employees present" />
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            {/* ── On Leave tab ─────────────────────────────────── */}
            <TabsContent
              value="leave"
              className="flex-1 min-h-0 mt-0 data-[state=inactive]:hidden"
            >
              <ScrollArea className="h-full px-5 py-4">
                <div className="space-y-2">
                  {dayDetail?.onLeave?.map((emp) => (
                    <div
                      key={emp.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-amber-500/5 border border-amber-500/15 hover:bg-amber-500/10 transition-colors"
                    >
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarFallback className="text-xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                          {initials(emp.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {emp.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {emp.department}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-[10px] shrink-0 border-amber-400/40 text-amber-600 dark:text-amber-400"
                      >
                        {emp.leaveType}
                      </Badge>
                    </div>
                  ))}
                  {!dayDetail?.onLeave?.length && (
                    <EmptyState label="Nobody on leave" />
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            {/* ── Absent tab ───────────────────────────────────── */}
            <TabsContent
              value="absent"
              className="flex-1 min-h-0 mt-0 data-[state=inactive]:hidden"
            >
              <ScrollArea className="h-full px-5 py-4">
                <div className="space-y-2">
                  {dayDetail?.absent?.map((emp) => (
                    <div
                      key={emp.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-red-500/5 border border-red-500/15 hover:bg-red-500/10 transition-colors"
                    >
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarFallback className="text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">
                          {initials(emp.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {emp.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {emp.department}
                        </p>
                      </div>
                      <UserX className="h-4 w-4 text-red-400 shrink-0" />
                    </div>
                  ))}
                  {!dayDetail?.absent?.length && (
                    <EmptyState label="No absences recorded" />
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        )}
      </SheetContent>
    </Sheet>
  )
}

const EmptyState = ({ label }) => (
  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-2">
    <span className="text-3xl">🌿</span>
    <p className="text-sm">{label}</p>
  </div>
)
EmptyState.propTypes = { label: PropTypes.string.isRequired }

DayDetailSheet.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  date: PropTypes.string,
  dayDetail: PropTypes.object,
  isLoading: PropTypes.bool.isRequired,
}

// ─── Main calendar UI ─────────────────────────────────────────────────────────

// eslint-disable-next-line max-lines-per-function
const LeaveCalendarUI = ({
  year,
  month,
  data,
  isLoading,
  isError,
  onPrevMonth,
  onNextMonth,
  canGoNext,
  selectedDate,
  dayDetail,
  isDayLoading,
  onDayClick,
  onSheetClose,
}) => {
  const today = new Date()
  const [todayString] = today.toISOString().split("T")

  const computeMonthTotals = (records) =>
    (records ?? []).reduce(
      (accumulator, r) => {
        if (!r.isWeekend) {
          accumulator.present += r.present
          accumulator.absent += r.absent
          accumulator.onLeave += r.onLeave
          accumulator.workdays += 1
        }
        return accumulator
      },
      { present: 0, absent: 0, onLeave: 0, workdays: 0 }
    )

  const monthTotals = computeMonthTotals(data?.records)

  const firstDayOfWeek = new Date(year, month, 1).getDay()
  const recordMap = Object.fromEntries(
    (data?.records ?? []).map((r) => [r.date, r])
  )
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const gridCells = []
  for (let index = 0; index < firstDayOfWeek; index++) gridCells.push(null)
  for (let d = 1; d <= daysInMonth; d++) {
    const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`
    gridCells.push(
      recordMap[dateString] ?? {
        date: dateString,
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
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Leave &amp; Attendance Calendar
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Click any weekday to see who&apos;s present, on leave, or absent.
        </p>
      </div>

      {/* Stats */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={`stat-${index}`} className="h-20 rounded-xl" />
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

      {/* Calendar */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
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

          {isLoading ? (
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 35 }).map((_, index) => (
                <Skeleton key={`sk-${index}`} className="h-16 rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-1">
              {gridCells.map((record, index) => {
                if (!record) {
                  return <div key={`empty-${index}`} className="h-16 md:h-20" />
                }

                const dayNumber = parseInt(record.date.split("-")[2])
                const isToday = record.date === todayString
                const isSelected = record.date === selectedDate
                const isClickable = !record.isWeekend && record.total > 0

                return (
                  <div
                    key={record.date}
                    onClick={() => isClickable && onDayClick(record)}
                    className={`
                      relative border rounded-lg p-1.5 md:p-2 h-16 md:h-20 transition-all
                      ${getDayColorClass(record)}
                      ${isToday ? "ring-2 ring-primary ring-offset-1" : ""}
                      ${isSelected ? "ring-2 ring-offset-1 ring-foreground/50 scale-[0.97]" : ""}
                      ${isClickable ? "cursor-pointer active:scale-95" : "cursor-default"}
                    `}
                  >
                    <span
                      className={`text-xs font-semibold leading-none ${isToday ? "text-primary" : record.isWeekend ? "text-muted-foreground/50" : "text-foreground"}`}
                    >
                      {dayNumber}
                    </span>

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

                    {!record.isWeekend && record.total > 0 && (
                      <AttendanceBar
                        present={record.present}
                        leaveCount={record.onLeave}
                        total={record.total}
                      />
                    )}

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
            {[
              { color: "bg-emerald-500", label: "Present" },
              { color: "bg-amber-400", label: "On Leave" },
              { color: "bg-red-500", label: "Absent" },
              { color: "bg-muted rounded-sm", label: "Weekend" },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className={`w-3 h-3 rounded-full ${color}`} />
                <span className="text-xs text-muted-foreground">{label}</span>
              </div>
            ))}
            <div className="flex items-center gap-1.5 ml-auto">
              <div className="w-3 h-3 rounded-full ring-2 ring-primary bg-transparent" />
              <span className="text-xs text-muted-foreground">Today</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Color key */}
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

      {/* Day Detail Sheet */}
      <DayDetailSheet
        open={Boolean(selectedDate)}
        onClose={onSheetClose}
        date={selectedDate}
        dayDetail={dayDetail}
        isLoading={isDayLoading}
      />
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
  selectedDate: PropTypes.string,
  dayDetail: PropTypes.object,
  isDayLoading: PropTypes.bool.isRequired,
  onDayClick: PropTypes.func.isRequired,
  onSheetClose: PropTypes.func.isRequired,
}

export default LeaveCalendarUI
