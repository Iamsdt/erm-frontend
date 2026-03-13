import {
  Users,
  FolderOpen,
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
  Activity,
  CheckCircle2,
  AlertCircle,
  Building2,
  BarChart2,
  ArrowRight,
  UserCheck,
  Home,
  Sparkles,
  X,
  UserPlus,
  FileBarChart,
  ClipboardList,
} from "lucide-react"
import PropTypes from "prop-types"
import { Link } from "react-router-dom"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

import ClockStatusWidget from "@/components/attendance/clock-status-widget"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import routes from "@constants/route.constant"

const CHART_COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"]
const CLR_GREEN = "text-green-500"
const CLR_GREEN_600 = "text-green-600"
const CLR_RED = CLR_RED
const CLR_ORANGE = "text-orange-500"
const STAT_KEYS = ["s1", "s2", "s3", "s4", "s5", "s6"]
const CHART_KEYS = ["c1", "c2", "c3"]

const QUICK_LINKS = [
  {
    label: "Employees",
    icon: Users,
    to: "/employee-management",
    color: "text-indigo-500",
  },
  {
    label: "Departments",
    icon: Building2,
    to: "/employee-management/departments",
    color: "text-purple-500",
  },
  {
    label: "Live Attendance",
    icon: Activity,
    to: "/attendance/admin/live",
    color: CLR_GREEN,
  },
  {
    label: "Attendance Logs",
    icon: Clock,
    to: "/attendance/admin/logs",
    color: "text-blue-500",
  },
  {
    label: "Attendance Summary",
    icon: BarChart2,
    to: "/attendance/admin/summary",
    color: "text-cyan-500",
  },
  {
    label: "Leave Dashboard",
    icon: Calendar,
    to: "/leave/admin",
    color: CLR_ORANGE,
  },
  {
    label: "Leave Approvals",
    icon: CheckCircle2,
    to: "/leave/admin/approvals",
    color: "text-emerald-500",
  },
  {
    label: "Projects",
    icon: FolderOpen,
    to: "/projects",
    color: "text-rose-500",
  },
]

/* ─── Trend Indicator ───────────────────────────────────────── */
const TrendIndicator = ({ trend, trendPositive }) => {
  if (!trend) return null
  const TrendIcon = trendPositive ? TrendingUp : TrendingDown
  const colorClass = trendPositive ? CLR_GREEN_600 : CLR_RED
  return (
    <span
      className={`flex items-center gap-0.5 text-xs font-medium ${colorClass}`}
    >
      <TrendIcon className="h-3 w-3" />
      {trend}
    </span>
  )
}

TrendIndicator.propTypes = {
  trend: PropTypes.string,
  trendPositive: PropTypes.bool,
}
TrendIndicator.defaultProps = { trend: null, trendPositive: true }

/* ─── Stat Card ─────────────────────────────────────────────── */
const StatCard = ({
  label,
  value,
  sub,
  icon: Icon,
  color,
  to,
  trend,
  trendPositive,
}) => (
  <Card className="hover:shadow-md transition-shadow">
    <CardContent className="pt-5 pb-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
          {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
          <TrendIndicator trend={trend} trendPositive={trendPositive} />
        </div>
        <div className={`rounded-xl p-3 ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {to && (
        <Link
          to={to}
          className="mt-3 flex items-center gap-1 text-xs text-primary hover:underline"
        >
          View details <ArrowRight className="h-3 w-3" />
        </Link>
      )}
    </CardContent>
  </Card>
)

StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  sub: PropTypes.string,
  icon: PropTypes.elementType.isRequired,
  color: PropTypes.string.isRequired,
  to: PropTypes.string,
  trend: PropTypes.string,
  trendPositive: PropTypes.bool,
}
StatCard.defaultProps = {
  sub: null,
  to: null,
  trend: null,
  trendPositive: true,
}

/* ─── Admin Stats Grid ──────────────────────────────────────── */
const countActive = (list) =>
  Array.isArray(list) ? list.filter((p) => p.status === "Active").length : 0

const safeLength = (array) => (Array.isArray(array) ? array.length : 0)

const extractMonthStat = (summary, key) => summary?.thisMonth?.[key] ?? 0

const getAdminStats = (employees, projects, leaveSummary) => ({
  totalEmp: safeLength(employees),
  activeProjects: countActive(projects),
  pending: safeLength(leaveSummary?.pendingApprovals),
  avgPresent: extractMonthStat(leaveSummary, "avgDailyPresent"),
  wfh: extractMonthStat(leaveSummary, "totalWFH"),
  onLeave: extractMonthStat(leaveSummary, "avgDailyOnLeave"),
})

const buildStatCards = (stats) => [
  {
    label: "Total Employees",
    value: stats.totalEmp,
    icon: Users,
    color: "bg-indigo-100 text-indigo-600",
    to: routes.employeeManagement.LIST,
    trend: "+12% vs last month",
    trendPositive: true,
  },
  {
    label: "Active Projects",
    value: stats.activeProjects,
    icon: FolderOpen,
    color: "bg-purple-100 text-purple-600",
    to: routes.project.LIST,
    trend: "+3% vs last month",
    trendPositive: true,
  },
  {
    label: "Pending Leaves",
    value: stats.pending,
    icon: AlertCircle,
    color: "bg-orange-100 text-orange-600",
    to: routes.leave.ADMIN_APPROVALS,
    trend: "-5% vs last month",
    trendPositive: false,
  },
  {
    label: "Avg Daily Present",
    value: stats.avgPresent,
    icon: UserCheck,
    color: "bg-green-100 text-green-600",
    to: routes.attendance.ADMIN_SUMMARY,
    trend: "+8% vs last month",
    trendPositive: true,
  },
  {
    label: "WFH This Month",
    value: stats.wfh,
    icon: Home,
    color: "bg-cyan-100 text-cyan-600",
    trend: "+2% vs last month",
    trendPositive: true,
  },
  {
    label: "Avg On Leave",
    value: stats.onLeave,
    icon: Calendar,
    color: "bg-rose-100 text-rose-600",
    to: routes.leave.ADMIN_DASHBOARD,
    trend: "-3% vs last month",
    trendPositive: false,
  },
]

const AdminStatsGrid = ({ employees, projects, leaveSummary }) => {
  const stats = getAdminStats(employees, projects, leaveSummary)
  const cards = buildStatCards(stats)

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </div>
  )
}

AdminStatsGrid.propTypes = {
  employees: PropTypes.array,
  projects: PropTypes.array,
  leaveSummary: PropTypes.object,
}
AdminStatsGrid.defaultProps = {
  employees: [],
  projects: [],
  leaveSummary: null,
}

/* ─── Attendance Trend Chart ─────────────────────────────────── */
const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"]
const PRESENT_ADJ = [0, 1, -1, 0, 1]
const WFH_ADJ = [0, -1, 0, -1, 0]

const getTrendBase = (summary) => ({
  present: summary?.thisMonth?.avgDailyPresent ?? 18,
  onLeave: summary?.thisMonth?.avgDailyOnLeave ?? 3,
  wfh: summary?.thisMonth?.totalWFH ?? 5,
})

const buildAttendanceTrend = (leaveSummary) => {
  const base = getTrendBase(leaveSummary)
  return WEEK_DAYS.map((day, index) => ({
    day,
    present: Math.max(base.present + PRESENT_ADJ[index], 0),
    onLeave: Math.max(base.onLeave - (index === 0 ? 1 : 0), 0),
    wfh: Math.max(base.wfh + WFH_ADJ[index], 0),
  }))
}

const AttendanceTrendChart = ({ leaveSummary }) => {
  const data = buildAttendanceTrend(leaveSummary)
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center justify-between">
          Weekly Attendance Trend
          <Link
            to="/attendance/admin/summary"
            className="text-xs text-primary font-normal flex items-center gap-1 hover:underline"
          >
            Full report <ArrowRight className="h-3 w-3" />
          </Link>
        </CardTitle>
        <CardDescription>Present / WFH / On Leave this week</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="gradPresent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradWfh" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="present"
              stroke="#6366f1"
              fill="url(#gradPresent)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="wfh"
              stroke="#22c55e"
              fill="url(#gradWfh)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="onLeave"
              stroke="#f59e0b"
              fill="none"
              strokeWidth={2}
              strokeDasharray="4 2"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

AttendanceTrendChart.propTypes = { leaveSummary: PropTypes.object }
AttendanceTrendChart.defaultProps = { leaveSummary: null }

/* ─── Leave Breakdown Pie ────────────────────────────────────── */
const LeaveBreakdownChart = ({ leaveSummary }) => {
  const data = leaveSummary?.leaveBreakdown ?? []
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Leave Breakdown</CardTitle>
        <CardDescription>By leave type this month</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="type"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ type, percent }) =>
                `${type} ${(percent * 100).toFixed(0)}%`
              }
              labelLine={false}
            >
              {data.map((entry) => (
                <Cell key={entry.type} fill={entry.color ?? CHART_COLORS[0]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

LeaveBreakdownChart.propTypes = { leaveSummary: PropTypes.object }
LeaveBreakdownChart.defaultProps = { leaveSummary: null }

/* ─── Department Stats Bar Chart ─────────────────────────────── */
const DepartmentStatsChart = ({ leaveSummary }) => {
  const data = leaveSummary?.departmentStats ?? []
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Department Overview</CardTitle>
        <CardDescription>
          Present / On Leave / WFH per department
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="department" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="present" fill="#6366f1" radius={[4, 4, 0, 0]} />
            <Bar dataKey="onLeave" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            <Bar dataKey="wfh" fill="#22c55e" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

DepartmentStatsChart.propTypes = { leaveSummary: PropTypes.object }
DepartmentStatsChart.defaultProps = { leaveSummary: null }

/* ─── Project Progress Chart ─────────────────────────────────── */
const ProjectProgressChart = ({ projects }) => {
  const data = (projects ?? []).slice(0, 6).map((p) => ({
    name: p.name?.length > 14 ? `${p.name.slice(0, 14)}…` : p.name,
    progress: p.progress ?? 0,
  }))
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center justify-between">
          Project Progress
          <Link
            to="/projects"
            className="text-xs text-primary font-normal flex items-center gap-1 hover:underline"
          >
            All projects <ArrowRight className="h-3 w-3" />
          </Link>
        </CardTitle>
        <CardDescription>Completion % for active projects</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart layout="vertical" data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
            <YAxis
              dataKey="name"
              type="category"
              width={110}
              tick={{ fontSize: 11 }}
            />
            <Tooltip formatter={(value) => [`${value}%`, "Progress"]} />
            <Bar
              dataKey="progress"
              fill="#6366f1"
              radius={[0, 4, 4, 0]}
              background={{ fill: "#f3f4f6", radius: [0, 4, 4, 0] }}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

ProjectProgressChart.propTypes = { projects: PropTypes.array }
ProjectProgressChart.defaultProps = { projects: [] }

/* ─── Pending Approvals ─────────────────────────────────────── */
const PendingApprovals = ({ leaveSummary }) => {
  const approvals = leaveSummary?.pendingApprovals ?? []
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center justify-between">
          Pending Leave Approvals
          <Link
            to="/leave/admin/approvals"
            className="text-xs text-primary font-normal flex items-center gap-1 hover:underline"
          >
            Approve all <ArrowRight className="h-3 w-3" />
          </Link>
        </CardTitle>
        <CardDescription>
          {approvals.length} requests awaiting review
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 max-h-72 overflow-y-auto">
        {approvals.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-6">
            No pending approvals
          </p>
        )}
        {approvals.map((approval) => (
          <div
            key={approval.id}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={approval.avatar} alt={approval.name} />
              <AvatarFallback>{approval.name?.[0] ?? "?"}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{approval.name}</p>
              <p className="text-xs text-muted-foreground">
                {approval.type} · {approval.days} day
                {approval.days !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="text-right shrink-0">
              <Badge variant="outline" className="text-xs">
                {approval.from}
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

PendingApprovals.propTypes = { leaveSummary: PropTypes.object }
PendingApprovals.defaultProps = { leaveSummary: null }

/* ─── Recent Activity ────────────────────────────────────────── */
const RecentActivity = ({ leaveSummary }) => {
  const activity = leaveSummary?.recentActivity ?? []
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Recent Activity</CardTitle>
        <CardDescription>Latest leave & attendance events</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 max-h-72 overflow-y-auto">
        {activity.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-6">
            No recent activity
          </p>
        )}
        {activity.map((item) => (
          <div key={item.id} className="flex items-start gap-3">
            <div className="mt-1 h-2 w-2 rounded-full bg-primary shrink-0" />
            <div>
              <p className="text-sm">
                <span className="font-medium">{item.name}</span>{" "}
                <span className="text-muted-foreground">{item.action}</span>
              </p>
              <p className="text-xs text-muted-foreground">
                {item.date} · {item.type}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

RecentActivity.propTypes = { leaveSummary: PropTypes.object }
RecentActivity.defaultProps = { leaveSummary: null }

/* ─── Top Leave Takers ───────────────────────────────────────── */
const TopLeaveTakers = ({ leaveSummary }) => {
  const takers = leaveSummary?.topLeaveTakers ?? []
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Top Leave Takers</CardTitle>
        <CardDescription>Employees with most leave this month</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {takers.slice(0, 5).map((person, index) => (
          <div key={person.id} className="flex items-center gap-3">
            <span className="text-sm font-bold text-muted-foreground w-4">
              {index + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{person.name}</p>
              <p className="text-xs text-muted-foreground">
                {person.department}
              </p>
            </div>
            <div className="w-24">
              <Progress
                value={Math.min((person.totalDays / 5) * 100, 100)}
                className="h-1.5"
              />
            </div>
            <span className="text-sm font-semibold w-10 text-right">
              {person.totalDays}d
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

TopLeaveTakers.propTypes = { leaveSummary: PropTypes.object }
TopLeaveTakers.defaultProps = { leaveSummary: null }

/* ─── Projects List ──────────────────────────────────────────── */
const ProjectsList = ({ projects }) => {
  const list = (projects ?? []).slice(0, 5)
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center justify-between">
          Active Projects
          <Link
            to="/projects"
            className="text-xs text-primary font-normal flex items-center gap-1 hover:underline"
          >
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {list.map((project) => (
          <div key={project.id} className="space-y-1">
            <div className="flex items-center justify-between">
              <Link
                to={`/projects/${project.id}`}
                className="text-sm font-medium hover:underline truncate max-w-[60%]"
              >
                {project.name}
              </Link>
              <Badge
                variant={project.status === "Active" ? "default" : "secondary"}
                className="text-xs shrink-0"
              >
                {project.status}
              </Badge>
            </div>
            <Progress value={project.progress ?? 0} className="h-1.5" />
            <p className="text-xs text-muted-foreground text-right">
              {project.progress ?? 0}% complete
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

ProjectsList.propTypes = { projects: PropTypes.array }
ProjectsList.defaultProps = { projects: [] }

/* ─── Quick Links ────────────────────────────────────────────── */
const QuickLinks = () => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-base">Quick Navigation</CardTitle>
      <CardDescription>Jump to any module</CardDescription>
    </CardHeader>
    <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {QUICK_LINKS.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          className="flex flex-col items-center gap-2 p-3 rounded-xl border hover:bg-muted transition-colors group"
        >
          <link.icon
            className={`h-6 w-6 ${link.color} group-hover:scale-110 transition-transform`}
          />
          <span className="text-xs font-medium text-center">{link.label}</span>
        </Link>
      ))}
    </CardContent>
  </Card>
)

/* ─── Header ─────────────────────────────────────────────────── */
const AdminHeader = ({ userName }) => {
  const now = new Date()
  const hour = now.getHours()
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening"
  const dateString = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold">
          {greeting}, {userName ?? "Admin"} 👋
        </h1>
        <p className="text-muted-foreground text-sm mt-0.5">{dateString}</p>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="gap-1">
          <TrendingUp className="h-3 w-3" /> Admin View
        </Badge>
        <Button asChild size="sm" variant="outline">
          <Link to="/attendance/admin/live">
            <Activity className="h-4 w-4 mr-1" /> Live Attendance
          </Link>
        </Button>
        <Button asChild size="sm">
          <Link to="/leave/admin/approvals">
            <CheckCircle2 className="h-4 w-4 mr-1" /> Approvals
          </Link>
        </Button>
      </div>
    </div>
  )
}

AdminHeader.propTypes = { userName: PropTypes.string }
AdminHeader.defaultProps = { userName: null }

/* ─── Welcome Card ──────────────────────────────────────────── */
const formatCurrentDate = () =>
  new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })

const WelcomeCard = ({
  userName,
  pendingLeaves,
  activeProjects,
  onDismiss,
}) => (
  <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border">
    <CardContent className="pt-5 pb-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <Sparkles className="h-6 w-6 text-primary mt-0.5 shrink-0" />
          <div>
            <h2 className="text-lg font-semibold">
              Welcome back, {userName ?? "Admin"}!
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Here&apos;s what needs your attention today
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge variant="secondary" className="text-xs">
                {pendingLeaves} leaves pending
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {activeProjects} active projects
              </Badge>
              <Badge variant="outline" className="text-xs">
                {formatCurrentDate()}
              </Badge>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 shrink-0"
          onClick={onDismiss}
          aria-label="Dismiss welcome card"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </CardContent>
  </Card>
)

WelcomeCard.propTypes = {
  userName: PropTypes.string,
  pendingLeaves: PropTypes.number,
  activeProjects: PropTypes.number,
  onDismiss: PropTypes.func.isRequired,
}
WelcomeCard.defaultProps = {
  userName: null,
  pendingLeaves: 0,
  activeProjects: 0,
}

/* ─── Quick Actions ─────────────────────────────────────────── */
const QUICK_ACTIONS = [
  {
    label: "Approve Leaves",
    icon: CheckCircle2,
    to: routes.leave.ADMIN_APPROVALS,
    color: "text-emerald-600",
    badgeKey: "pendingLeaves",
  },
  {
    label: "Add Employee",
    icon: UserPlus,
    to: routes.employeeManagement.CREATE,
    color: "text-indigo-600",
  },
  {
    label: "View Reports",
    icon: FileBarChart,
    to: routes.ai.ANALYTICS,
    color: "text-blue-600",
  },
  {
    label: "Activity Log",
    icon: ClipboardList,
    to: routes.audit.LOG,
    color: "text-purple-600",
  },
]

const QuickActionButton = ({ action, pendingLeaves }) => (
  <Button
    asChild
    variant="outline"
    className="h-auto py-3 px-4 justify-start gap-3"
  >
    <Link to={action.to}>
      <action.icon className={`h-5 w-5 ${action.color}`} />
      <span className="text-sm font-medium">{action.label}</span>
      {action.badgeKey && pendingLeaves > 0 && (
        <Badge className="ml-auto text-xs" variant="destructive">
          {pendingLeaves}
        </Badge>
      )}
    </Link>
  </Button>
)

QuickActionButton.propTypes = {
  action: PropTypes.shape({
    label: PropTypes.string.isRequired,
    icon: PropTypes.elementType.isRequired,
    to: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    badgeKey: PropTypes.string,
  }).isRequired,
  pendingLeaves: PropTypes.number,
}
QuickActionButton.defaultProps = { pendingLeaves: 0 }

const QuickActionsRow = ({ pendingLeaves }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
    {QUICK_ACTIONS.map((action) => (
      <QuickActionButton
        key={action.label}
        action={action}
        pendingLeaves={pendingLeaves}
      />
    ))}
  </div>
)

QuickActionsRow.propTypes = { pendingLeaves: PropTypes.number }
QuickActionsRow.defaultProps = { pendingLeaves: 0 }

/* ─── Clock + Summary Cards Row ─────────────────────────────── */
const AttendanceSummaryCards = ({ leaveSummary }) => {
  const stats = leaveSummary?.thisMonth
  const items = [
    {
      label: "Total Leaves",
      value: stats?.totalLeaves ?? 0,
      color: CLR_ORANGE,
    },
    {
      label: "Total Absent",
      value: stats?.totalAbsent ?? 0,
      color: CLR_RED,
    },
    {
      label: "Total Present",
      value: stats?.totalPresent ?? 0,
      color: CLR_GREEN,
    },
    {
      label: "Half Days",
      value: stats?.totalHalfDay ?? 0,
      color: "text-yellow-500",
    },
  ]
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {items.map((item) => (
        <Card key={item.label} className="text-center">
          <CardContent className="pt-4 pb-3">
            <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{item.label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

AttendanceSummaryCards.propTypes = { leaveSummary: PropTypes.object }
AttendanceSummaryCards.defaultProps = { leaveSummary: null }

/* ─── Loading Skeleton ───────────────────────────────────────── */
const AdminDashboardSkeleton = () => (
  <div className="p-6 space-y-6">
    <div className="h-12 bg-muted rounded-lg animate-pulse" />
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
      {STAT_KEYS.map((key) => (
        <div key={key} className="h-28 bg-muted rounded-xl animate-pulse" />
      ))}
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {CHART_KEYS.map((key) => (
        <div key={key} className="h-64 bg-muted rounded-xl animate-pulse" />
      ))}
    </div>
  </div>
)

/* ─── Main Admin Dashboard UI ────────────────────────────────── */
const CLOCK_DEFAULTS = {
  isClocked: false,
  clockedInAt: null,
  elapsedSeconds: 0,
  willAutoExpire: false,
  todayTotalMinutes: 0,
}

const getClockProperties = (status) => ({
  ...CLOCK_DEFAULTS,
  ...status,
})

const AdminDashboardUI = ({
  userName,
  employees,
  projects,
  leaveSummary,
  attendanceStatus,
  showWelcome,
  onDismissWelcome,
  isLoading,
}) => {
  const clockProperties = getClockProperties(attendanceStatus)
  const pendingLeaves = leaveSummary?.pendingApprovals?.length ?? 0
  const activeProjects = countActive(projects)

  if (isLoading) {
    return <AdminDashboardSkeleton />
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <AdminHeader userName={userName} />
      <Separator />

      {showWelcome && (
        <WelcomeCard
          userName={userName}
          pendingLeaves={pendingLeaves}
          activeProjects={activeProjects}
          onDismiss={onDismissWelcome}
        />
      )}

      <QuickActionsRow pendingLeaves={pendingLeaves} />

      <AdminStatsGrid
        employees={employees}
        projects={projects}
        leaveSummary={leaveSummary}
      />

      <AttendanceSummaryCards leaveSummary={leaveSummary} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <AttendanceTrendChart leaveSummary={leaveSummary} />
        </div>
        <LeaveBreakdownChart leaveSummary={leaveSummary} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <DepartmentStatsChart leaveSummary={leaveSummary} />
        </div>
        <ProjectProgressChart projects={projects} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <PendingApprovals leaveSummary={leaveSummary} />
          <RecentActivity leaveSummary={leaveSummary} />
        </div>
        <div className="space-y-4">
          <ClockStatusWidget
            isClocked={clockProperties.isClocked}
            clockedInAt={clockProperties.clockedInAt}
            elapsedSeconds={clockProperties.elapsedSeconds}
            willAutoExpire={clockProperties.willAutoExpire}
            todayTotalMinutes={clockProperties.todayTotalMinutes}
            isLoading={false}
          />
          <TopLeaveTakers leaveSummary={leaveSummary} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ProjectsList projects={projects} />
        <QuickLinks />
      </div>
    </div>
  )
}

AdminDashboardUI.propTypes = {
  userName: PropTypes.string,
  employees: PropTypes.array,
  projects: PropTypes.array,
  leaveSummary: PropTypes.object,
  attendanceStatus: PropTypes.object,
  showWelcome: PropTypes.bool,
  onDismissWelcome: PropTypes.func,
  isLoading: PropTypes.bool,
}
AdminDashboardUI.defaultProps = {
  userName: null,
  employees: [],
  projects: [],
  leaveSummary: null,
  attendanceStatus: null,
  showWelcome: false,
  onDismissWelcome: () => {},
  isLoading: false,
}

export default AdminDashboardUI
