import PropTypes from "prop-types"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

/**
 * Format minutes to "Xh Ym" string.
 * @param {number|null} minutes - Total minutes to format.
 * @returns {string} Formatted duration string.
 */
const formatDuration = (minutes) => {
  if (minutes == null) return "—"
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

const colorMap = {
  green: "text-green-600 dark:text-green-400",
  amber: "text-amber-600 dark:text-amber-400",
  red: "text-red-600 dark:text-red-400",
  blue: "text-blue-600 dark:text-blue-400",
  default: "text-foreground",
}

/**
 * Stat card widget.
 * @param {object} props - Component props.
 * @param {string} props.title - Card title.
 * @param {string|number} props.value - Displayed value.
 * @param {string} props.variant - Color variant key.
 */
const StatCard = ({ title, value, variant }) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <span className={`text-3xl font-bold ${colorMap[variant ?? "default"]}`}>
        {value}
      </span>
    </CardContent>
  </Card>
)

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  variant: PropTypes.oneOf(["green", "amber", "red", "blue", "default"]),
}

StatCard.defaultProps = {
  variant: "default",
}

/**
 * Daily bar chart — a minimal CSS-driven bar chart for the week view.
 * @param {object} props - Component props.
 * @param {Array<{date: string, count: number}>} props.days - Daily attendance data.
 */
const DailyBarChart = ({ days }) => {
  if (!days || days.length === 0) return null
  const max = Math.max(...days.map((d) => d.count), 1)
  return (
    <div className="flex items-end gap-2 h-32">
      {days.map((day) => (
        <div key={day.date} className="flex flex-col items-center gap-1 flex-1">
          <span className="text-xs text-muted-foreground">{day.count}</span>
          <div
            className="w-full rounded-t bg-primary/70"
            style={{ height: `${(day.count / max) * 96}px` }}
          />
          <span className="text-xs text-muted-foreground truncate w-full text-center">
            {new Date(day.date).toLocaleDateString(undefined, {
              weekday: "short",
            })}
          </span>
        </div>
      ))}
    </div>
  )
}

DailyBarChart.propTypes = {
  days: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
    })
  ),
}

DailyBarChart.defaultProps = {
  days: [],
}

/**
 * Metric row in the employee metrics table.
 * @param {object} props - Component props.
 * @param {object} props.employee - Employee metric data.
 */
const MetricRow = ({ employee }) => (
  <tr className="border-b last:border-0">
    <td className="px-3 py-2 text-sm font-medium">{employee.employeeName}</td>
    <td className="px-3 py-2 text-sm text-center">
      {employee.daysPresent ?? "—"}
    </td>
    <td className="px-3 py-2 text-sm text-center">
      {formatDuration(employee.avgMinutesPerDay)}
    </td>
    <td className="px-3 py-2 text-sm text-center">
      {employee.lateArrivals > 0 ? (
        <Badge variant="outline" className="text-amber-600 border-amber-400">
          {employee.lateArrivals}
        </Badge>
      ) : (
        <span className="text-muted-foreground">0</span>
      )}
    </td>
    <td className="px-3 py-2 text-sm text-center">
      {employee.earlyDepartures > 0 ? (
        <Badge variant="outline" className="text-red-600 border-red-400">
          {employee.earlyDepartures}
        </Badge>
      ) : (
        <span className="text-muted-foreground">0</span>
      )}
    </td>
  </tr>
)

MetricRow.propTypes = {
  employee: PropTypes.shape({
    employeeId: PropTypes.number,
    employeeName: PropTypes.string.isRequired,
    daysPresent: PropTypes.number,
    avgMinutesPerDay: PropTypes.number,
    lateArrivals: PropTypes.number,
    earlyDepartures: PropTypes.number,
  }).isRequired,
}

const SKELETON_COUNT = 4

/**
 * Skeleton state for the summary page.
 */
const SummarySkeleton = () => (
  <div className="p-6 space-y-6">
    <Skeleton className="h-8 w-48" />
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <Skeleton key={index} className="h-24" />
      ))}
    </div>
    <Skeleton className="h-48" />
    <Skeleton className="h-64" />
  </div>
)

/**
 * Top stat cards row.
 * @param {object} props - Component props.
 * @param {object} props.stats - Summary stats object.
 */
const StatCards = ({ stats }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    <StatCard
      title="Present Today"
      value={stats.presentToday ?? 0}
      variant="green"
    />
    <StatCard
      title="Auto-Expired"
      value={stats.autoExpiredToday ?? 0}
      variant="amber"
    />
    <StatCard
      title="Absent Today"
      value={stats.absentToday ?? 0}
      variant="red"
    />
    <StatCard
      title="Flagged Entries"
      value={stats.flaggedEntries ?? 0}
      variant="blue"
    />
  </div>
)

StatCards.propTypes = {
  stats: PropTypes.shape({
    presentToday: PropTypes.number,
    autoExpiredToday: PropTypes.number,
    absentToday: PropTypes.number,
    flaggedEntries: PropTypes.number,
  }).isRequired,
}

/**
 * Employee metrics table.
 * @param {object} props - Component props.
 * @param {Array} props.employeeMetrics - List of employee metric objects.
 */
const EmployeeMetricsTable = ({ employeeMetrics }) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-base">Employee Metrics (This Month)</CardTitle>
    </CardHeader>
    <CardContent className="p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b bg-muted/40">
              <th className="px-3 py-2 text-xs font-semibold text-muted-foreground">
                Employee
              </th>
              <th className="px-3 py-2 text-xs font-semibold text-muted-foreground text-center">
                Days Present
              </th>
              <th className="px-3 py-2 text-xs font-semibold text-muted-foreground text-center">
                Avg Hours/Day
              </th>
              <th className="px-3 py-2 text-xs font-semibold text-muted-foreground text-center">
                Late Arrivals
              </th>
              <th className="px-3 py-2 text-xs font-semibold text-muted-foreground text-center">
                Early Departures
              </th>
            </tr>
          </thead>
          <tbody>
            {employeeMetrics.map((emp) => (
              <MetricRow
                key={emp.employeeId ?? emp.employeeName}
                employee={emp}
              />
            ))}
          </tbody>
        </table>
      </div>
    </CardContent>
  </Card>
)

EmployeeMetricsTable.propTypes = {
  employeeMetrics: PropTypes.arrayOf(
    PropTypes.shape({
      employeeId: PropTypes.number,
      employeeName: PropTypes.string.isRequired,
    })
  ).isRequired,
}

const summaryShape = PropTypes.shape({
  stats: PropTypes.shape({
    presentToday: PropTypes.number,
    autoExpiredToday: PropTypes.number,
    absentToday: PropTypes.number,
    flaggedEntries: PropTypes.number,
  }),
  dailyAttendance: PropTypes.arrayOf(
    PropTypes.shape({ date: PropTypes.string, count: PropTypes.number })
  ),
  employeeMetrics: PropTypes.arrayOf(
    PropTypes.shape({
      employeeId: PropTypes.number,
      employeeName: PropTypes.string,
      daysPresent: PropTypes.number,
      avgMinutesPerDay: PropTypes.number,
      lateArrivals: PropTypes.number,
      earlyDepartures: PropTypes.number,
    })
  ),
})

/**
 * Summary content body (rendered when data is available).
 * @param {object} props - Component props.
 * @param {object} props.stats - Stat counts object.
 * @param {Array} props.dailyData - Daily attendance data for bar chart.
 * @param {Array} props.employeeMetrics - Per-employee metrics list.
 */
const SummaryContent = ({ stats, dailyData, employeeMetrics }) => (
  <div className="p-6 space-y-6">
    <h1 className="text-2xl font-semibold">Attendance Summary</h1>

    <StatCards stats={stats} />

    {dailyData.length > 0 && (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Daily Attendance (Last 7 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DailyBarChart days={dailyData} />
        </CardContent>
      </Card>
    )}

    {employeeMetrics.length > 0 && (
      <EmployeeMetricsTable employeeMetrics={employeeMetrics} />
    )}

    {!dailyData.length && !employeeMetrics.length && (
      <p className="text-muted-foreground text-sm">
        No summary data available.
      </p>
    )}
  </div>
)

SummaryContent.propTypes = {
  stats: PropTypes.object.isRequired,
  dailyData: PropTypes.array.isRequired,
  employeeMetrics: PropTypes.array.isRequired,
}

/**
 * Admin Attendance Summary page UI.
 * Displays stat cards, daily bar chart, and employee metrics table.
 * @param {object} props - Component props.
 * @param {object|null} props.summary - API response from GET attendance/admin/summary/.
 * @param {boolean} props.isLoading - Loading state flag.
 */
const AdminSummaryUI = ({ summary, isLoading }) => {
  if (isLoading) return <SummarySkeleton />

  return (
    <SummaryContent
      stats={summary?.stats ?? {}}
      dailyData={summary?.dailyAttendance ?? []}
      employeeMetrics={summary?.employeeMetrics ?? []}
    />
  )
}

AdminSummaryUI.propTypes = {
  summary: summaryShape,
  isLoading: PropTypes.bool.isRequired,
}

AdminSummaryUI.defaultProps = {
  summary: null,
}

export default AdminSummaryUI
