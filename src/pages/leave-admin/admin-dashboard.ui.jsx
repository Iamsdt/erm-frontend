import PropTypes from "prop-types"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

// ─── Helpers ─────────────────────────────────────────────────────────────────

const STATUS_STYLE = {
  approved:
    "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
  rejected: "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30",
  pending:
    "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
}

const LEAVE_COLOR = {
  blue: "bg-blue-500",
  red: "bg-red-500",
  purple: "bg-purple-500",
  orange: "bg-orange-500",
  cyan: "bg-cyan-500",
  yellow: "bg-yellow-400",
}

const SUBTYPE_BADGE = {
  wfh: "bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 border-cyan-500/30",
  halfday:
    "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 border-yellow-500/30",
  full: "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30",
}

const SUBTYPE_LABEL = { wfh: "WFH", halfday: "½ Day", full: "Full" }

// ─── Sub-components ───────────────────────────────────────────────────────────

const MetricCard = ({ icon, label, value, sub, accent }) => (
  <Card className={`border-0 shadow-sm overflow-hidden ${accent}`}>
    <CardContent className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {label}
          </p>
          <p className="text-3xl font-extrabold mt-1 leading-none">{value}</p>
          {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
        </div>
        <span className="text-3xl opacity-80">{icon}</span>
      </div>
    </CardContent>
  </Card>
)

MetricCard.propTypes = {
  icon: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  sub: PropTypes.string,
  accent: PropTypes.string.isRequired,
}

const DeptBar = ({ present, onLeave, absent, wfh }) => {
  const total = present + onLeave + absent + (wfh ?? 0)
  if (total === 0) return null
  return (
    <div className="flex w-full h-2 rounded-full overflow-hidden gap-px">
      <div
        className="bg-emerald-500 transition-all"
        style={{ width: `${(present / total) * 100}%` }}
      />
      <div
        className="bg-cyan-400 transition-all"
        style={{ width: `${((wfh ?? 0) / total) * 100}%` }}
      />
      <div
        className="bg-amber-400 transition-all"
        style={{ width: `${(onLeave / total) * 100}%` }}
      />
      <div
        className="bg-red-500 transition-all"
        style={{ width: `${(absent / total) * 100}%` }}
      />
    </div>
  )
}

DeptBar.propTypes = {
  present: PropTypes.number.isRequired,
  onLeave: PropTypes.number.isRequired,
  absent: PropTypes.number.isRequired,
  wfh: PropTypes.number,
}

// ─── Main UI ──────────────────────────────────────────────────────────────────

const AdminDashboardUI = ({ data, isLoading, isError }) => {
  if (isError) {
    return (
      <div className="flex items-center justify-center h-64 text-destructive">
        Failed to load admin dashboard. Please try again.
      </div>
    )
  }

  // Total requests for leave breakdown % denominator
  const totalRequests =
    data?.leaveBreakdown?.reduce((a, b) => a + b.count, 0) || 1

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Admin Leave Dashboard
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {isLoading
              ? "Loading…"
              : `${data?.month} ${data?.year} — ${data?.totalEmployees} employees`}
          </p>
        </div>
        <Badge variant="outline" className="text-xs px-3 py-1">
          🔴 Live
        </Badge>
      </div>

      {/* KPI Row 1 — core metrics */}
      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <MetricCard
            icon="🏖️"
            label="Leaves This Month"
            value={data?.thisMonth?.totalLeaves}
            sub="full-day leaves"
            accent="bg-blue-500/10"
          />
          <MetricCard
            icon="❌"
            label="Absences"
            value={data?.thisMonth?.totalAbsent}
            sub="unauthorized & unplanned"
            accent="bg-red-500/10"
          />
          <MetricCard
            icon="✅"
            label="Avg. Daily Present"
            value={data?.thisMonth?.avgDailyPresent}
            sub={`of ${data?.totalEmployees}`}
            accent="bg-emerald-500/10"
          />
          <MetricCard
            icon="⏳"
            label="Pending Approvals"
            value={data?.pendingApprovals?.length}
            sub="awaiting your action"
            accent="bg-amber-500/10"
          />
        </div>
      )}

      {/* KPI Row 2 — WFH & Half Day */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <MetricCard
            icon="🏠"
            label="Work From Home (Month)"
            value={data?.thisMonth?.totalWFH}
            sub="approved WFH days"
            accent="bg-cyan-500/10"
          />
          <MetricCard
            icon="🌗"
            label="Half Days (Month)"
            value={data?.thisMonth?.totalHalfDay}
            sub="morning & afternoon"
            accent="bg-yellow-500/10"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Leave Type Breakdown */}
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Leave Type Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 rounded-lg" />
                ))
              : data?.leaveBreakdown?.map((item) => {
                  const pct = Math.round((item.count / totalRequests) * 100)
                  return (
                    <div key={item.type}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2.5 h-2.5 rounded-full ${LEAVE_COLOR[item.color] ?? "bg-gray-400"}`}
                          />
                          <span className="text-sm font-medium">
                            {item.type}
                          </span>
                        </div>
                        <span className="text-sm font-bold">{item.count}</span>
                      </div>
                      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${LEAVE_COLOR[item.color] ?? "bg-gray-400"}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
          </CardContent>
        </Card>

        {/* Department Stats */}
        <Card className="shadow-sm lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Department Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 mb-2 rounded-lg" />
              ))
            ) : (
              <div className="space-y-3">
                {data?.departmentStats?.map((dept) => (
                  <div key={dept.department}>
                    <div className="flex items-center justify-between mb-1 text-sm">
                      <span className="font-medium w-28 truncate">
                        {dept.department}
                      </span>
                      <div className="flex gap-2 text-xs text-muted-foreground">
                        <span className="text-emerald-600 font-semibold">
                          ✓ {dept.present}
                        </span>
                        <span className="text-cyan-600 font-semibold">
                          🏠 {dept.wfh ?? 0}
                        </span>
                        <span className="text-amber-600 font-semibold">
                          ⏳ {dept.onLeave}
                        </span>
                        <span className="text-red-500 font-semibold">
                          ✗ {dept.absent}
                        </span>
                      </div>
                    </div>
                    <DeptBar
                      present={dept.present}
                      onLeave={dept.onLeave}
                      absent={dept.absent}
                      wfh={dept.wfh}
                    />
                  </div>
                ))}
                <div className="flex flex-wrap gap-3 pt-2 border-t mt-2">
                  {[
                    ["bg-emerald-500", "Present"],
                    ["bg-cyan-400", "WFH"],
                    ["bg-amber-400", "On Leave"],
                    ["bg-red-500", "Absent"],
                  ].map(([cls, lbl]) => (
                    <div key={lbl} className="flex items-center gap-1.5">
                      <div className={`w-2.5 h-2.5 rounded-full ${cls}`} />
                      <span className="text-xs text-muted-foreground">
                        {lbl}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Leave Takers */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            🏆 Top Leave Takers This Month
            <span className="text-xs text-muted-foreground font-normal">
              by total days away
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 mb-2 rounded-lg" />
            ))
          ) : (
            <div className="space-y-2">
              {data?.topLeaveTakers?.map((emp, idx) => {
                const maxDays = data?.topLeaveTakers?.[0]?.totalDays || 1
                const barW = Math.round((emp.totalDays / maxDays) * 100)
                return (
                  <div key={emp.id} className="flex items-center gap-3">
                    {/* Rank */}
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        idx === 0
                          ? "bg-yellow-400 text-yellow-900"
                          : idx === 1
                            ? "bg-slate-300 text-slate-700"
                            : idx === 2
                              ? "bg-amber-600 text-white"
                              : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {idx + 1}
                    </span>
                    {/* Name & dept */}
                    <div className="w-40 shrink-0">
                      <p className="text-sm font-semibold leading-none">
                        {emp.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {emp.department}
                      </p>
                    </div>
                    {/* Bar */}
                    <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all"
                        style={{ width: `${barW}%` }}
                      />
                    </div>
                    {/* Days + types */}
                    <div className="shrink-0 text-right">
                      <span className="text-sm font-bold">
                        {emp.totalDays}d
                      </span>
                      <div className="flex gap-1 mt-0.5 justify-end flex-wrap">
                        {emp.types.map((t) => (
                          <span
                            key={t}
                            className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Pending Approvals preview */}
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              Pending Approvals
              {!isLoading && (
                <Badge className="bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-500/30 text-xs">
                  {data?.pendingApprovals?.length}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-14 rounded-lg" />
                ))
              : data?.pendingApprovals?.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border/50 gap-2"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold leading-none truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.type} · {item.from} → {item.to}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Badge
                        variant="outline"
                        className={`text-[10px] px-1.5 ${SUBTYPE_BADGE[item.subType] ?? ""}`}
                      >
                        {SUBTYPE_LABEL[item.subType] ?? item.subType}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {item.days}d
                      </Badge>
                    </div>
                  </div>
                ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 mb-2 rounded-lg" />
              ))
            ) : (
              <div className="space-y-1">
                {data?.recentActivity?.map((item, idx) => (
                  <div key={item.id}>
                    <div className="flex items-center justify-between py-2 text-sm">
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            item.action.includes("Approved")
                              ? "bg-emerald-500"
                              : item.action.includes("Rejected")
                                ? "bg-red-500"
                                : item.action.includes("Absent")
                                  ? "bg-red-400"
                                  : "bg-blue-500"
                          }`}
                        />
                        <span className="font-medium truncate">
                          {item.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                            item.action.includes("Approved")
                              ? STATUS_STYLE.approved
                              : item.action.includes("Rejected")
                                ? STATUS_STYLE.rejected
                                : STATUS_STYLE.pending
                          }`}
                        >
                          {item.action}
                        </span>
                        <span className="text-xs text-muted-foreground hidden sm:block">
                          {item.date}
                        </span>
                      </div>
                    </div>
                    {idx < (data?.recentActivity?.length ?? 0) - 1 && (
                      <Separator />
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

AdminDashboardUI.propTypes = {
  data: PropTypes.shape({
    month: PropTypes.string,
    year: PropTypes.number,
    totalEmployees: PropTypes.number,
    thisMonth: PropTypes.shape({
      totalLeaves: PropTypes.number,
      totalAbsent: PropTypes.number,
      avgDailyPresent: PropTypes.number,
      totalWFH: PropTypes.number,
      totalHalfDay: PropTypes.number,
    }),
    leaveBreakdown: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string,
        count: PropTypes.number,
        color: PropTypes.string,
      })
    ),
    departmentStats: PropTypes.arrayOf(
      PropTypes.shape({
        department: PropTypes.string,
        onLeave: PropTypes.number,
        absent: PropTypes.number,
        present: PropTypes.number,
        wfh: PropTypes.number,
      })
    ),
    topLeaveTakers: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        department: PropTypes.string,
        totalDays: PropTypes.number,
        types: PropTypes.arrayOf(PropTypes.string),
      })
    ),
    pendingApprovals: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        type: PropTypes.string,
        subType: PropTypes.string,
        from: PropTypes.string,
        to: PropTypes.string,
        days: PropTypes.number,
      })
    ),
    recentActivity: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        action: PropTypes.string,
        type: PropTypes.string,
        date: PropTypes.string,
      })
    ),
  }),
  isLoading: PropTypes.bool.isRequired,
  isError: PropTypes.bool.isRequired,
}

export default AdminDashboardUI
