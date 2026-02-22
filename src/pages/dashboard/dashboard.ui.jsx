import {
  Users,
  FolderOpen,
  Calendar,
  Clock,
  CheckCircle2,
  TrendingUp,
  Activity,
  MessageSquare,
} from "lucide-react"
import PropTypes from "prop-types"

import AIInsightsPanel from "@/components/ai-insights-panel"
import ClockStatusWidget from "@/components/attendance/clock-status-widget"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

/**
 * StatsWidgets — displays dashboard stat cards
 */
const StatsWidgets = ({ employees, projects, leaveSummary }) => {
  const totalEmployees = employees?.length ?? 0
  const activeProjects =
    projects?.filter((p) => p.status === "Active")?.length ?? 0
  const pendingLeaves = leaveSummary?.pendingApprovals?.length ?? 0
  const todayPresent = leaveSummary?.thisMonth?.totalPresent ?? 0

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="bg-white dark:bg-slate-900 shadow-sm border-l-4 border-l-blue-500">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
              Total Employees
            </p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              {totalEmployees}
            </h3>
          </div>
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
            <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-slate-900 shadow-sm border-l-4 border-l-emerald-500">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
              Active Projects
            </p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              {activeProjects}
            </h3>
          </div>
          <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
            <FolderOpen className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-slate-900 shadow-sm border-l-4 border-l-amber-500">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
              Pending Leaves
            </p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              {pendingLeaves}
            </h3>
          </div>
          <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-full">
            <Calendar className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-slate-900 shadow-sm border-l-4 border-l-purple-500">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
              Today&apos;s Present
            </p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              {todayPresent}
            </h3>
          </div>
          <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
            <CheckCircle2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

StatsWidgets.propTypes = {
  employees: PropTypes.array,
  projects: PropTypes.array,
  leaveSummary: PropTypes.object,
}

StatsWidgets.defaultProps = {
  employees: [],
  projects: [],
  leaveSummary: {},
}

/**
 * CommentsSection — displays comments with pagination
 */
const CommentsSection = ({
  isLoading,
  isError,
  displayComments,
  currentPage,
  canGoNext,
  onPreviousPage,
  onNextPage,
}) => {
  const showPagination = !isLoading && !isError

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-amber-500" />
          Community Comments
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="text-center py-8 text-slate-600 dark:text-slate-400">
            Loading comments...
          </div>
        )}

        {isError && (
          <div className="text-center py-8 text-red-600 dark:text-red-400">
            Something went wrong
          </div>
        )}

        {showPagination && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayComments}
            </div>
            <div className="flex justify-center space-x-4 mt-6">
              <Button
                variant="outline"
                onClick={onPreviousPage}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={onNextPage}
                disabled={!canGoNext}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

CommentsSection.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  isError: PropTypes.bool.isRequired,
  displayComments: PropTypes.any,
  currentPage: PropTypes.number.isRequired,
  canGoNext: PropTypes.bool.isRequired,
  onPreviousPage: PropTypes.func.isRequired,
  onNextPage: PropTypes.func.isRequired,
}

CommentsSection.defaultProps = {
  displayComments: null,
}

/**
 * DashboardUI — main dashboard presenter component.
 */
const DashboardUI = ({
  isLoading,
  isError,
  displayComments,
  currentPage,
  onPreviousPage,
  onNextPage,
  canGoNext,
  attendanceStatus,
  todayAttendance,
  onClockIn,
  onGoToAttendance,
  projects,
  leaveSummary,
  employees,
}) => {
  // Mock AI Insights for the dashboard
  const mockInsights = {
    standupSummary:
      "Team is progressing well on the ERM Frontend Revamp. 2 blockers reported in UI components.",
    autoEstimates: [
      {
        taskId: "TASK-001",
        reason: "Similar to previous theme switcher",
        suggestedHours: 4,
        confidence: 0.85,
      },
    ],
    riskAssessment: [
      {
        issue: "High leave rate in Engineering",
        impact: "May delay Sprint 2 delivery",
        mitigation: "Reassign critical tasks",
      },
    ],
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Welcome back, Admin! 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Here&apos;s what&apos;s happening across your organization today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={onGoToAttendance}>
            <Clock className="w-4 h-4 mr-2" />
            View Attendance
          </Button>
          <Button>
            <Activity className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </header>

      <StatsWidgets
        employees={employees}
        projects={projects}
        leaveSummary={leaveSummary}
        todayAttendance={todayAttendance}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          <Tabs defaultValue="projects" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="projects">Active Projects</TabsTrigger>
              <TabsTrigger value="leaves">Recent Leave Requests</TabsTrigger>
            </TabsList>
            <TabsContent value="projects" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Project Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {projects?.slice(0, 3).map((project) => (
                    <div key={project.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{project.name}</span>
                          <Badge
                            variant={
                              project.status === "Active"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {project.status}
                          </Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {project.progress}%
                        </span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex -space-x-2">
                          {project.members?.slice(0, 3).map((member) => (
                            <Avatar
                              key={member.id}
                              className="w-6 h-6 border-2 border-background"
                            >
                              <AvatarImage src={member.avatar} />
                              <AvatarFallback>
                                {member.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                        <span>
                          Due: {new Date(project.endDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                  {(!projects || projects.length === 0) && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No active projects found.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="leaves" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Approvals</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {leaveSummary?.pendingApprovals?.slice(0, 4).map((leave) => (
                    <div
                      key={leave.id}
                      className="flex items-center justify-between p-3 rounded-lg border bg-slate-50/50 dark:bg-slate-800/50"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={leave.avatar} />
                          <AvatarFallback>
                            {leave.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{leave.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {leave.type} • {leave.days} days
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 text-xs"
                        >
                          Reject
                        </Button>
                        <Button size="sm" className="h-8 text-xs">
                          Approve
                        </Button>
                      </div>
                    </div>
                  ))}
                  {(!leaveSummary?.pendingApprovals ||
                    leaveSummary.pendingApprovals.length === 0) && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No pending leave requests.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          <ClockStatusWidget
            isClocked={attendanceStatus?.isClocked || false}
            liveElapsed={attendanceStatus?.elapsedSeconds || 0}
            willAutoExpire={attendanceStatus?.willAutoExpire || false}
            todayTotalMinutes={todayAttendance?.totalMinutes || 0}
            onClockIn={onClockIn}
            onGoToAttendance={onGoToAttendance}
          />

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              AI Organization Insights
            </h3>
            <AIInsightsPanel insights={mockInsights} isLoading={false} />
          </div>
        </div>
      </div>

      <CommentsSection
        isLoading={isLoading}
        isError={isError}
        displayComments={displayComments}
        currentPage={currentPage}
        canGoNext={canGoNext}
        onPreviousPage={onPreviousPage}
        onNextPage={onNextPage}
      />
    </div>
  )
}

DashboardUI.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  isError: PropTypes.bool.isRequired,
  displayComments: PropTypes.any,
  currentPage: PropTypes.number.isRequired,
  onPreviousPage: PropTypes.func.isRequired,
  onNextPage: PropTypes.func.isRequired,
  canGoNext: PropTypes.bool.isRequired,
  attendanceStatus: PropTypes.object,
  todayAttendance: PropTypes.object,
  onClockIn: PropTypes.func.isRequired,
  onGoToAttendance: PropTypes.func.isRequired,
  projects: PropTypes.array,
  leaveSummary: PropTypes.object,
  employees: PropTypes.array,
}

DashboardUI.defaultProps = {
  displayComments: null,
  attendanceStatus: {},
  todayAttendance: {},
  projects: [],
  leaveSummary: {},
  employees: [],
}

export default DashboardUI
