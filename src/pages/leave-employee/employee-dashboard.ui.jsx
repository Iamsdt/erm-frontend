import PropTypes from "prop-types"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

// ─── Helpers ─────────────────────────────────────────────────────────────────

const STATUS_STYLE = {
  approved: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
  rejected: "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30",
  pending: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
}

const STATUS_LABEL = {
  approved: "Approved",
  rejected: "Rejected",
  pending: "Pending",
}

/**
 * Circular progress ring for attendance percentage.
 */
const AttendanceRing = ({ pct }) => {
  const r = 36
  const circumference = 2 * Math.PI * r
  const filled = ((pct ?? 0) / 100) * circumference

  return (
    <div className="relative flex items-center justify-center w-24 h-24">
      <svg className="-rotate-90" width="96" height="96">
        <circle cx="48" cy="48" r={r} stroke="currentColor" strokeWidth="8" fill="none" className="text-muted/40" />
        <circle
          cx="48" cy="48" r={r}
          stroke="currentColor" strokeWidth="8" fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - filled}
          strokeLinecap="round"
          className="text-emerald-500 transition-all duration-700"
        />
      </svg>
      <span className="absolute text-lg font-bold">{pct ?? 0}%</span>
    </div>
  )
}

AttendanceRing.propTypes = { pct: PropTypes.number }

/**
 * Leave balance progress bar for a single leave type.
 */
const LeaveBalanceRow = ({ type, allocated, used, pending, remaining }) => {
  const usedPct = Math.round((used / allocated) * 100)
  const pendingPct = Math.round((pending / allocated) * 100)

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{type}</span>
        <span className="text-muted-foreground text-xs">
          <span className="text-foreground font-semibold">{remaining}</span> / {allocated} days left
        </span>
      </div>
      <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden flex gap-px">
        <div
          className="bg-red-400 rounded-l-full transition-all"
          style={{ width: `${usedPct}%` }}
          title={`Used: ${used}`}
        />
        <div
          className="bg-amber-400 transition-all"
          style={{ width: `${pendingPct}%` }}
          title={`Pending: ${pending}`}
        />
        <div
          className="bg-emerald-500 rounded-r-full transition-all"
          style={{ width: `${100 - usedPct - pendingPct}%` }}
          title={`Remaining: ${remaining}`}
        />
      </div>
      <div className="flex gap-3 text-[11px] text-muted-foreground">
        <span><span className="inline-block w-2 h-2 rounded-full bg-red-400 mr-1" />Used: {used}</span>
        {pending > 0 && <span><span className="inline-block w-2 h-2 rounded-full bg-amber-400 mr-1" />Pending: {pending}</span>}
        <span><span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-1" />Available: {remaining}</span>
      </div>
    </div>
  )
}

LeaveBalanceRow.propTypes = {
  type: PropTypes.string.isRequired,
  allocated: PropTypes.number.isRequired,
  used: PropTypes.number.isRequired,
  pending: PropTypes.number.isRequired,
  remaining: PropTypes.number.isRequired,
}

// ─── Main UI ──────────────────────────────────────────────────────────────────

const EmployeeDashboardUI = ({ data, isLoading, isError, onRequestLeave }) => {
  const emp = data?.employee
  const balance = data?.leaveBalance ?? []
  const thisMonth = data?.thisMonth
  const history = data?.leaveHistory ?? []
  const upcoming = data?.upcoming ?? []

  const totalUsed = balance.reduce((acc, b) => acc + b.used, 0)
  const totalAllocated = balance.reduce((acc, b) => acc + b.allocated, 0)
  const totalPending = balance.reduce((acc, b) => acc + b.pending, 0)
  const totalRemaining = balance.reduce((acc, b) => acc + b.remaining, 0)

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64 text-destructive">
        Failed to load your leave profile. Please try again.
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 space-y-6">

      {/* Header / Employee Profile Card */}
      <Card className="shadow-sm border-0 bg-gradient-to-r from-blue-600/10 via-indigo-500/10 to-purple-600/10">
        <CardContent className="p-5">
          {isLoading ? (
            <div className="flex items-center gap-4">
              <Skeleton className="w-16 h-16 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-36" />
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-4">
              <Avatar className="w-16 h-16 border-2 border-white/30 shadow">
                <AvatarImage src={emp?.avatar} alt={emp?.name} />
                <AvatarFallback className="text-lg font-bold">
                  {emp?.name?.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-bold tracking-tight">{emp?.name}</h1>
                <p className="text-sm text-muted-foreground">{emp?.role} · {emp?.department}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  ID: {emp?.id} · Manager: {emp?.manager} · Joined {emp?.joinDate}
                </p>
              </div>
              <div className="shrink-0 flex flex-col items-center gap-2">
                <AttendanceRing pct={thisMonth?.attendancePct} />
                <p className="text-xs text-center text-muted-foreground">This month</p>
                <Button size="sm" onClick={onRequestLeave} className="w-full">
                  + Request Leave
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: "📅", label: "Total Allocated", value: totalAllocated, accent: "bg-blue-500/10" },
            { icon: "✅", label: "Days Used", value: totalUsed, accent: "bg-red-500/10" },
            { icon: "⏳", label: "Pending Approval", value: totalPending, accent: "bg-amber-500/10" },
            { icon: "🎯", label: "Days Remaining", value: totalRemaining, accent: "bg-emerald-500/10" },
          ].map(({ icon, label, value, accent }) => (
            <Card key={label} className={`border-0 shadow-sm ${accent}`}>
              <CardContent className="flex items-center gap-3 p-4">
                <span className="text-2xl">{icon}</span>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">{label}</p>
                  <p className="text-2xl font-extrabold leading-none mt-0.5">{value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Leave Balance */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Leave Balance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 rounded-lg" />)
              : balance.map((b) => (
                  <LeaveBalanceRow
                    key={b.type}
                    type={b.type}
                    allocated={b.allocated}
                    used={b.used}
                    pending={b.pending}
                    remaining={b.remaining}
                  />
                ))}
          </CardContent>
        </Card>

        {/* This Month Snapshot + Upcoming */}
        <div className="space-y-4">

          {/* This Month */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">This Month</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-8 rounded-lg" />)}
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3 text-center">
                  {[
                    { label: "Present", value: thisMonth?.presentDays, cls: "text-emerald-600" },
                    { label: "On Leave", value: thisMonth?.leaveDays, cls: "text-amber-600" },
                    { label: "Absent", value: thisMonth?.absentDays, cls: "text-red-500" },
                  ].map(({ label, value, cls }) => (
                    <div key={label} className="p-3 rounded-xl bg-muted/40">
                      <p className={`text-2xl font-bold ${cls}`}>{value}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Upcoming</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {isLoading
                ? Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-12 rounded-lg" />)
                : upcoming.length === 0
                  ? <p className="text-sm text-muted-foreground">No upcoming leaves or holidays.</p>
                  : upcoming.map((u) => (
                      <div key={u.label} className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border/50">
                        <div>
                          <p className="text-sm font-semibold">{u.label}</p>
                          <p className="text-xs text-muted-foreground">{u.date}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          in {u.daysUntil}d
                        </Badge>
                      </div>
                    ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Leave History */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Leave History</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 rounded-lg" />)}
            </div>
          ) : (
            <div className="space-y-1">
              {history.map((item, idx) => (
                <div key={item.id}>
                  <div className="flex items-center justify-between py-2.5 text-sm">
                    <div className="min-w-0">
                      <p className="font-medium">{item.type}</p>
                      <p className="text-xs text-muted-foreground">{item.from} → {item.to} · {item.days} day{item.days > 1 ? "s" : ""}</p>
                    </div>
                    <Badge variant="outline" className={`text-xs shrink-0 ml-3 ${STATUS_STYLE[item.status]}`}>
                      {STATUS_LABEL[item.status]}
                    </Badge>
                  </div>
                  {idx < history.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

EmployeeDashboardUI.propTypes = {
  data: PropTypes.shape({
    employee: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      role: PropTypes.string,
      department: PropTypes.string,
      avatar: PropTypes.string,
      joinDate: PropTypes.string,
      manager: PropTypes.string,
    }),
    leaveBalance: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string,
        allocated: PropTypes.number,
        used: PropTypes.number,
        pending: PropTypes.number,
        remaining: PropTypes.number,
      })
    ),
    thisMonth: PropTypes.shape({
      presentDays: PropTypes.number,
      absentDays: PropTypes.number,
      leaveDays: PropTypes.number,
      workingDays: PropTypes.number,
      attendancePct: PropTypes.number,
    }),
    leaveHistory: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        type: PropTypes.string,
        from: PropTypes.string,
        to: PropTypes.string,
        days: PropTypes.number,
        status: PropTypes.string,
      })
    ),
    upcoming: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        date: PropTypes.string,
        daysUntil: PropTypes.number,
      })
    ),
  }),
  isLoading: PropTypes.bool.isRequired,
  isError: PropTypes.bool.isRequired,
  onRequestLeave: PropTypes.func.isRequired,
}

export default EmployeeDashboardUI
