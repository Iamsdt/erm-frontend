import {
  Clock,
  Calendar,
  Home,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  FolderOpen,
  FileText,
  Activity,
  Trophy,
  Award,
  Target,
  Zap,
  Star,
  CheckSquare,
} from "lucide-react"
import PropTypes from "prop-types"
import { Link } from "react-router-dom"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
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

const STAT_KEYS = ["s1", "s2", "s3", "s4"]
const CHART_KEYS = ["c1", "c2", "c3"]
const CLR_BLUE = "text-blue-500"
const CLR_GREEN = "text-green-500"
const CLR_PURPLE = "text-purple-500"

const EMP_QUICK_LINKS = [
  {
    label: "My Attendance",
    icon: Clock,
    to: "/attendance",
    color: "text-indigo-500",
  },
  {
    label: "Attendance History",
    icon: Activity,
    to: "/attendance/history",
    color: CLR_BLUE,
  },
  {
    label: "Leave Dashboard",
    icon: Calendar,
    to: "/leave/employee",
    color: "text-orange-500",
  },
  {
    label: "Request Leave",
    icon: FileText,
    to: "/leave/employee/request",
    color: CLR_GREEN,
  },
  {
    label: "Leave Calendar",
    icon: CheckCircle2,
    to: "/leave/calendar",
    color: CLR_PURPLE,
  },
  {
    label: "Projects",
    icon: FolderOpen,
    to: "/projects",
    color: "text-rose-500",
  },
]

/* ─── Stat Card ─────────────────────────────────────────────── */
const StatCard = ({ label, value, sub, icon: Icon, color, to }) => (
  <Card className="hover:shadow-md transition-shadow">
    <CardContent className="pt-5 pb-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
          {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
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
}
StatCard.defaultProps = { sub: null, to: null }

/* ─── Employee Stats Grid ────────────────────────────────────── */
const formatWorkHours = (minutes) => {
  if (!minutes) return "0h 0m"
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`
}

const getEmployeeStats = (leaveProfile, todayAttendance) => ({
  month: leaveProfile?.thisMonth,
  totalRemaining: (leaveProfile?.leaveBalance ?? []).reduce(
    (sum, b) => sum + (b.remaining ?? 0),
    0
  ),
  todayHours: formatWorkHours(todayAttendance?.totalWorkMinutes ?? 0),
})

const EmployeeStatsGrid = ({ leaveProfile, todayAttendance }) => {
  const { month, totalRemaining, todayHours } = getEmployeeStats(
    leaveProfile,
    todayAttendance
  )

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard
        label="Today's Hours"
        value={todayHours}
        icon={Clock}
        color="bg-indigo-100 text-indigo-600"
        to="/attendance"
      />
      <StatCard
        label="Present This Month"
        value={month?.presentDays ?? 0}
        sub="days"
        icon={CheckCircle2}
        color="bg-green-100 text-green-600"
        to="/attendance/history"
      />
      <StatCard
        label="Leave Remaining"
        value={totalRemaining}
        sub="days available"
        icon={Calendar}
        color="bg-orange-100 text-orange-600"
        to="/leave/employee"
      />
      <StatCard
        label="WFH Days"
        value={month?.wfhDays ?? 0}
        sub="this month"
        icon={Home}
        color="bg-cyan-100 text-cyan-600"
      />
    </div>
  )
}

EmployeeStatsGrid.propTypes = {
  leaveProfile: PropTypes.object,
  todayAttendance: PropTypes.object,
}
EmployeeStatsGrid.defaultProps = { leaveProfile: null, todayAttendance: null }

/* ─── Leave Balance Bar Chart ────────────────────────────────── */
const LeaveBalanceChart = ({ leaveProfile }) => {
  const data = (leaveProfile?.leaveBalance ?? []).map((b) => ({
    type: b.type,
    allocated: b.allocated,
    used: b.used,
    remaining: b.remaining,
  }))

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center justify-between">
          Leave Balance
          <Link
            to="/leave/employee"
            className="text-xs text-primary font-normal flex items-center gap-1 hover:underline"
          >
            Full details <ArrowRight className="h-3 w-3" />
          </Link>
        </CardTitle>
        <CardDescription>Allocated vs used vs remaining</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="type" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="allocated" fill="#e0e7ff" radius={[4, 4, 0, 0]} />
            <Bar dataKey="used" fill="#ef4444" radius={[4, 4, 0, 0]} />
            <Bar dataKey="remaining" fill="#22c55e" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

LeaveBalanceChart.propTypes = { leaveProfile: PropTypes.object }
LeaveBalanceChart.defaultProps = { leaveProfile: null }

/* ─── Monthly Attendance Radar ───────────────────────────────── */
const MonthlyAttendanceRadar = ({ leaveProfile }) => {
  const month = leaveProfile?.thisMonth
  const data = [
    { subject: "Present", value: month?.presentDays ?? 0 },
    { subject: "Absent", value: month?.absentDays ?? 0 },
    { subject: "Leave", value: month?.leaveDays ?? 0 },
    { subject: "WFH", value: month?.wfhDays ?? 0 },
  ]

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">This Month Summary</CardTitle>
        <CardDescription>
          Attendance breakdown for current month
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <RadarChart data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
            <PolarRadiusAxis angle={30} tick={{ fontSize: 10 }} />
            <Radar
              dataKey="value"
              stroke="#6366f1"
              fill="#6366f1"
              fillOpacity={0.35}
            />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

MonthlyAttendanceRadar.propTypes = { leaveProfile: PropTypes.object }
MonthlyAttendanceRadar.defaultProps = { leaveProfile: null }

/* ─── Leave Balance Detail Table ─────────────────────────────── */
const LeaveBalanceTable = ({ leaveProfile }) => {
  const balance = leaveProfile?.leaveBalance ?? []
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Leave Entitlement Details</CardTitle>
        <CardDescription>Annual leave balance breakdown</CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 text-muted-foreground font-medium">
                Type
              </th>
              <th className="text-right py-2 text-muted-foreground font-medium">
                Allocated
              </th>
              <th className="text-right py-2 text-muted-foreground font-medium">
                Used
              </th>
              <th className="text-right py-2 text-muted-foreground font-medium">
                Pending
              </th>
              <th className="text-right py-2 text-muted-foreground font-medium">
                Remaining
              </th>
              <th className="text-right py-2 text-muted-foreground font-medium">
                Usage
              </th>
            </tr>
          </thead>
          <tbody>
            {balance.map((row) => {
              const usagePct =
                row.allocated > 0
                  ? Math.round((row.used / row.allocated) * 100)
                  : 0
              return (
                <tr key={row.type} className="border-b last:border-0">
                  <td className="py-2 font-medium">{row.type}</td>
                  <td className="py-2 text-right">{row.allocated}</td>
                  <td className="py-2 text-right text-red-500">{row.used}</td>
                  <td className="py-2 text-right text-yellow-600">
                    {row.pending}
                  </td>
                  <td className="py-2 text-right text-green-600 font-semibold">
                    {row.remaining}
                  </td>
                  <td className="py-2 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Progress value={usagePct} className="h-1.5 w-16" />
                      <span className="text-xs w-8">{usagePct}%</span>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}

LeaveBalanceTable.propTypes = { leaveProfile: PropTypes.object }
LeaveBalanceTable.defaultProps = { leaveProfile: null }

/* ─── Active Projects ────────────────────────────────────────── */
const ActiveProjects = ({ projects }) => {
  const list = (projects ?? []).filter((p) => p.status === "Active").slice(0, 4)
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center justify-between">
          My Projects
          <Link
            to="/projects"
            className="text-xs text-primary font-normal flex items-center gap-1 hover:underline"
          >
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {list.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No active projects
          </p>
        )}
        {list.map((project) => (
          <div key={project.id} className="space-y-1">
            <div className="flex items-center justify-between">
              <Link
                to={`/projects/${project.id}`}
                className="text-sm font-medium hover:underline truncate max-w-[60%]"
              >
                {project.name}
              </Link>
              <span className="text-xs text-muted-foreground">
                {project.progress ?? 0}%
              </span>
            </div>
            <Progress value={project.progress ?? 0} className="h-1.5" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

ActiveProjects.propTypes = { projects: PropTypes.array }
ActiveProjects.defaultProps = { projects: [] }

/* ─── Employee Profile Card ──────────────────────────────────── */
const EmployeeProfileCard = ({ leaveProfile }) => {
  const emp = leaveProfile?.employee
  if (!emp) return null

  return (
    <Card>
      <CardContent className="pt-5 pb-4 flex items-center gap-4">
        <Avatar className="h-14 w-14">
          <AvatarImage src={emp.avatar} alt={emp.name} />
          <AvatarFallback className="text-lg">
            {emp.name?.[0] ?? "E"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-base truncate">{emp.name}</p>
          <p className="text-sm text-muted-foreground">{emp.role}</p>
          <p className="text-xs text-muted-foreground">{emp.department}</p>
        </div>
        <div className="text-right shrink-0">
          <Badge variant="secondary">Employee</Badge>
          <p className="text-xs text-muted-foreground mt-1">
            Manager: {emp.manager}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

EmployeeProfileCard.propTypes = { leaveProfile: PropTypes.object }
EmployeeProfileCard.defaultProps = { leaveProfile: null }

/* ─── Quick Links ────────────────────────────────────────────── */
const QuickLinks = () => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-base">Quick Navigation</CardTitle>
    </CardHeader>
    <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {EMP_QUICK_LINKS.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          className="flex flex-col items-center gap-2 p-3 rounded-xl border hover:bg-muted transition-colors group"
        >
          <link.icon
            className={`h-5 w-5 ${link.color} group-hover:scale-110 transition-transform`}
          />
          <span className="text-xs font-medium text-center">{link.label}</span>
        </Link>
      ))}
    </CardContent>
  </Card>
)

/* ─── Header ─────────────────────────────────────────────────── */
const EmployeeHeader = ({ userName }) => {
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
          {greeting}, {userName ?? "User"} 👋
        </h1>
        <p className="text-muted-foreground text-sm mt-0.5">{dateString}</p>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="gap-1">
          <TrendingUp className="h-3 w-3" /> Employee View
        </Badge>
        <Button asChild size="sm" variant="outline">
          <Link to="/attendance">
            <Clock className="h-4 w-4 mr-1" /> Clock In/Out
          </Link>
        </Button>
        <Button asChild size="sm">
          <Link to="/leave/employee/request">
            <Calendar className="h-4 w-4 mr-1" /> Request Leave
          </Link>
        </Button>
      </div>
    </div>
  )
}

EmployeeHeader.propTypes = { userName: PropTypes.string }
EmployeeHeader.defaultProps = { userName: null }

/* ─── Sprint Task Stats Block ────────────────────────────────── */
const SPRINT_TASK_KEYS = [
  { key: "completed", label: "Completed", color: "text-green-600 bg-green-50" },
  {
    key: "inProgress",
    label: "In Progress",
    color: "text-blue-600 bg-blue-50",
  },
  { key: "pending", label: "Pending", color: "text-orange-600 bg-orange-50" },
  {
    key: "allocated",
    label: "Allocated",
    color: "text-indigo-600 bg-indigo-50",
  },
]

const SprintTaskStats = ({ currentSprint }) => (
  <div className="grid grid-cols-4 gap-3">
    {SPRINT_TASK_KEYS.map(({ key, label, color }) => (
      <div
        key={key}
        className={`rounded-xl p-3 text-center ${color.split(" ")[1]}`}
      >
        <p className={`text-2xl font-bold ${color.split(" ")[0]}`}>
          {currentSprint?.[key] ?? 0}
        </p>
        <p className="text-xs mt-0.5 text-muted-foreground">{label}</p>
      </div>
    ))}
  </div>
)

SprintTaskStats.propTypes = { currentSprint: PropTypes.object }
SprintTaskStats.defaultProps = { currentSprint: null }

/* ─── Sprint History Chart ───────────────────────────────────── */
const SprintHistoryChart = ({ sprintHistory }) => {
  const data = sprintHistory ?? []
  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} barGap={2}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="sprint" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip />
        <Legend />
        <Bar
          dataKey="allocated"
          fill="#e0e7ff"
          radius={[4, 4, 0, 0]}
          name="Allocated"
        />
        <Bar
          dataKey="completed"
          fill="#6366f1"
          radius={[4, 4, 0, 0]}
          name="Completed"
        />
      </BarChart>
    </ResponsiveContainer>
  )
}

SprintHistoryChart.propTypes = { sprintHistory: PropTypes.array }
SprintHistoryChart.defaultProps = { sprintHistory: [] }

/* ─── Performance Score Gauges ───────────────────────────────── */
const SCORE_METRICS = [
  { key: "velocityScore", label: "Velocity", icon: Zap, color: CLR_BLUE },
  {
    key: "qualityScore",
    label: "Quality",
    icon: Star,
    color: "text-yellow-500",
  },
  {
    key: "collaborationScore",
    label: "Team Play",
    icon: CheckSquare,
    color: CLR_GREEN,
  },
  { key: "overallScore", label: "Overall", icon: Trophy, color: CLR_PURPLE },
]

const PerformanceScoreBar = ({ label, value, icon: Icon, color }) => (
  <div className="space-y-1.5">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1.5">
        <Icon className={`h-3.5 w-3.5 ${color}`} />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <span className={`text-xs font-bold ${color}`}>{value}/100</span>
    </div>
    <Progress value={value ?? 0} className="h-2" />
  </div>
)

PerformanceScoreBar.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number,
  icon: PropTypes.elementType.isRequired,
  color: PropTypes.string.isRequired,
}
PerformanceScoreBar.defaultProps = { value: 0 }

const extractSprintData = (performance) => ({
  sprint: performance?.currentSprint,
  history: performance?.sprintHistory,
  scores: performance?.performance,
})

const toPercent = (value) => Math.round((value ?? 0) * 100)

const getSprintDescription = (sprint) => {
  const project = sprint?.projectName ?? "\u2014"
  const name = sprint?.name ?? "No active sprint"
  return `${project} \u00b7 ${name}`
}

/* ─── Sprint Performance Card ────────────────────────────────── */
const SprintPerformance = ({ performance }) => {
  const { sprint, history, scores } = extractSprintData(performance)
  const efficiencyPct = toPercent(sprint?.efficiency)
  const onTimePct = toPercent(sprint?.onTimeRate)

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Target className="h-4 w-4 text-indigo-500" />
          Sprint Task Performance
        </CardTitle>
        <CardDescription>{getSprintDescription(sprint)}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <SprintTaskStats currentSprint={sprint} />

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border p-3 text-center">
            <p className="text-xl font-bold text-green-600">{efficiencyPct}%</p>
            <p className="text-xs text-muted-foreground mt-0.5">Efficiency</p>
            <Progress value={efficiencyPct} className="h-1.5 mt-2" />
          </div>
          <div className="rounded-xl border p-3 text-center">
            <p className="text-xl font-bold text-blue-600">{onTimePct}%</p>
            <p className="text-xs text-muted-foreground mt-0.5">On-Time Rate</p>
            <Progress value={onTimePct} className="h-1.5 mt-2" />
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">
            Sprint History
          </p>
          <SprintHistoryChart sprintHistory={history} />
        </div>

        {scores && (
          <div className="space-y-2.5 pt-1">
            <p className="text-xs font-medium text-muted-foreground">
              Performance Scores
            </p>
            {SCORE_METRICS.map((m) => (
              <PerformanceScoreBar
                key={m.key}
                label={m.label}
                value={scores[m.key]}
                icon={m.icon}
                color={m.color}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

SprintPerformance.propTypes = { performance: PropTypes.object }
SprintPerformance.defaultProps = { performance: null }

/* ─── Recognition Card ───────────────────────────────────────── */
const RecognitionCard = ({ item }) => (
  <div
    className={`rounded-xl border p-3 flex items-start gap-3 ${item.color ?? "bg-gray-50 border-gray-200"}`}
  >
    <span className="text-3xl leading-none mt-0.5" aria-hidden="true">
      {item.emoji}
    </span>
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold truncate">{item.title}</p>
        <Badge variant="outline" className="text-xs shrink-0">
          {item.type}
        </Badge>
      </div>
      <p className="text-xs text-muted-foreground mt-0.5">
        From <span className="font-medium">{item.givenBy}</span> · {item.date}
      </p>
      <p className="text-xs mt-1 italic">&ldquo;{item.message}&rdquo;</p>
    </div>
  </div>
)

RecognitionCard.propTypes = { item: PropTypes.object.isRequired }

/* ─── Recognition Wall ───────────────────────────────────────── */
const RecognitionWall = ({ recognition }) => {
  const list = recognition ?? []
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Award className="h-4 w-4 text-yellow-500" />
          Recognition & Kudos
        </CardTitle>
        <CardDescription>
          {list.length} recognition{list.length !== 1 ? "s" : ""} received
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {list.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-6">
            No recognitions yet — keep up the great work! 💪
          </p>
        )}
        {list.map((item) => (
          <RecognitionCard key={item.id} item={item} />
        ))}
      </CardContent>
    </Card>
  )
}

RecognitionWall.propTypes = { recognition: PropTypes.array }
RecognitionWall.defaultProps = { recognition: [] }
const getClockProperties = (status) => {
  const s = status ?? {}
  return {
    isClocked: s.isClocked ?? false,
    clockedInAt: s.clockedInAt ?? null,
    elapsedSeconds: s.elapsedSeconds ?? 0,
    willAutoExpire: s.willAutoExpire ?? false,
    todayTotalMinutes: s.todayTotalMinutes ?? 0,
  }
}

const EmployeeDashboardUI = ({
  userName,
  projects,
  leaveProfile,
  attendanceStatus,
  todayAttendance,
  performance,
  isLoading,
}) => {
  const clockProperties = getClockProperties(attendanceStatus)
  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="h-12 bg-muted rounded-lg animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <EmployeeHeader userName={userName} />
      <Separator />

      <EmployeeProfileCard leaveProfile={leaveProfile} />

      <EmployeeStatsGrid
        leaveProfile={leaveProfile}
        todayAttendance={todayAttendance}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <LeaveBalanceChart leaveProfile={leaveProfile} />
        </div>
        <MonthlyAttendanceRadar leaveProfile={leaveProfile} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-4">
          <ClockStatusWidget
            isClocked={clockProperties.isClocked}
            clockedInAt={clockProperties.clockedInAt}
            elapsedSeconds={clockProperties.elapsedSeconds}
            willAutoExpire={clockProperties.willAutoExpire}
            todayTotalMinutes={clockProperties.todayTotalMinutes}
            isLoading={false}
          />
          <ActiveProjects projects={projects} />
        </div>
        <div className="md:col-span-2">
          <LeaveBalanceTable leaveProfile={leaveProfile} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SprintPerformance performance={performance} />
        <RecognitionWall recognition={performance?.recognition} />
      </div>

      <QuickLinks />
    </div>
  )
}

EmployeeDashboardUI.propTypes = {
  userName: PropTypes.string,
  projects: PropTypes.array,
  leaveProfile: PropTypes.object,
  attendanceStatus: PropTypes.object,
  todayAttendance: PropTypes.object,
  performance: PropTypes.object,
  isLoading: PropTypes.bool,
}
EmployeeDashboardUI.defaultProps = {
  userName: null,
  projects: [],
  leaveProfile: null,
  attendanceStatus: null,
  todayAttendance: null,
  performance: null,
  isLoading: false,
}

export default EmployeeDashboardUI
