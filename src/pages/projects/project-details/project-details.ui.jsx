import {
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  Target,
  Activity,
  ChevronRight,
  Sparkles,
  BookOpen,
  ListTodo,
  TrendingUp,
  FileText,
  Lightbulb,
  Settings,
  Layers,
  Trash2,
} from "lucide-react"
import PropTypes from "prop-types"
import { Link } from "react-router"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const VELOCITY_DATA = [
  { name: 'Sprint 1', points: 45 },
  { name: 'Sprint 2', points: 52 },
  { name: 'Sprint 3', points: 48 },
  { name: 'Sprint 4', points: 61 },
  { name: 'Sprint 5', points: 59 },
  { name: 'Sprint 6', points: 68 },
];

const BURNDOWN_DATA = [
  { day: 'Day 1', remaining: 100, ideal: 100 },
  { day: 'Day 2', remaining: 90, ideal: 90 },
  { day: 'Day 3', remaining: 85, ideal: 80 },
  { day: 'Day 4', remaining: 70, ideal: 70 },
  { day: 'Day 5', remaining: 65, ideal: 60 },
  { day: 'Day 6', remaining: 50, ideal: 50 },
  { day: 'Day 7', remaining: 45, ideal: 40 },
  { day: 'Day 8', remaining: 30, ideal: 30 },
  { day: 'Day 9', remaining: 15, ideal: 20 },
  { day: 'Day 10', remaining: 5, ideal: 10 },
];

const ISSUE_STATUS_DATA = [
  { name: 'To Do', value: 15, color: '#facc15' },
  { name: 'In Progress', value: 25, color: '#3b82f6' },
  { name: 'Review', value: 10, color: '#a855f7' },
  { name: 'Done', value: 50, color: '#22c55e' },
];

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { CreateIssueModal } from "../components/create-issue-modal"
import { CreateSprintModal } from "../components/create-sprint-modal"

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "active":
      return "bg-green-100 text-green-800 hover:bg-green-100/80 border-green-200"
    case "completed":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100/80 border-blue-200"
    case "on hold":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80 border-yellow-200"
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100/80 border-gray-200"
  }
}

const LoadingState = () => (
  <div className="space-y-6 p-6 max-w-7xl mx-auto">
    <div className="flex items-center gap-4 mb-8">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
      <div className="space-y-6">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    </div>
  </div>
)

const ErrorState = () => (
  <div className="p-6 max-w-7xl mx-auto">
    <Button variant="ghost" asChild className="mb-4">
      <Link to="/projects">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Projects
      </Link>
    </Button>
    <Card className="border-destructive bg-destructive/10">
      <CardHeader>
        <CardTitle className="text-destructive flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Error Loading Project
        </CardTitle>
        <CardDescription className="text-destructive/80">
          We couldn&apos;t load the project details. Please try again later.
        </CardDescription>
      </CardHeader>
    </Card>
  </div>
)

const OverviewTab = ({ project, activeSprint }) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div className="lg:col-span-2 space-y-6">
      {activeSprint ? (
        <Card className="shadow-md border-primary/20 bg-gradient-to-br from-card to-primary/5">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-primary" />
                Active Sprint: {activeSprint.name}
              </CardTitle>
              <Badge variant="default" className="bg-primary">
                In Progress
              </Badge>
            </div>
            <CardDescription className="flex items-center gap-2 mt-2">
              <Calendar className="h-4 w-4" />
              {new Date(activeSprint.startDate).toLocaleDateString()} -{" "}
              {new Date(activeSprint.endDate).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-background/50 rounded-lg p-3 border">
                <div className="text-2xl font-bold text-primary">
                  {activeSprint.progress}%
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Completion
                </div>
              </div>
              <div className="bg-background/50 rounded-lg p-3 border">
                <div className="text-2xl font-bold text-blue-600">12</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Tasks Done
                </div>
              </div>
              <div className="bg-background/50 rounded-lg p-3 border">
                <div className="text-2xl font-bold text-amber-600">5</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Days Left
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>Sprint Progress</span>
                <span>{activeSprint.progress}%</span>
              </div>
              <Progress value={activeSprint.progress} className="h-3" />
            </div>

            <Button asChild className="w-full mt-4">
              <Link to={`/projects/${project.id}/sprints/${activeSprint.id}`}>
                Go to Sprint Board <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-sm border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Target className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No Active Sprint</h3>
            <p className="text-muted-foreground max-w-md mb-6">
              Start a new sprint to track your team&apos;s progress here.
            </p>
            <CreateSprintModal />
          </CardContent>
        </Card>
      )}

      <Card className="shadow-sm border-amber-200 bg-amber-50/30 dark:bg-amber-950/10">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-amber-700 dark:text-amber-500">
            <Sparkles className="h-5 w-5" />
            AI Overview & Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm leading-relaxed">
            Based on recent activity, the project is <strong>on track</strong>{" "}
            to meet its target date. Velocity has increased by 15% compared to
            the last sprint.
          </p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <Lightbulb className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
              <span>
                Consider breaking down the &quot;User Authentication Epic&quot;
                as it currently contains tasks with high estimation variance.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Lightbulb className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
              <span>
                Team member workload is well-balanced, but QA review times are
                slightly bottlenecking the &quot;Done&quot; column.
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>

    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            About Project
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {project.description || "No description provided for this project."}
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Overall Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                Completion
              </span>
              <span className="text-2xl font-bold text-primary">
                {project.progress}%
              </span>
            </div>
            <Progress value={project.progress} className="h-2.5" />
          </div>

          <div className="pt-4 border-t space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Start Date
              </span>
              <span className="font-medium">
                {new Date(project.startDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-2">
                <Target className="h-4 w-4" /> Target Date
              </span>
              <span className="font-medium">
                {new Date(project.endDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Team
          </CardTitle>
          <Badge variant="secondary">{project.members?.length || 0}</Badge>
        </CardHeader>
        <CardContent>
          {project.members && project.members.length > 0 ? (
            <div className="space-y-4 mt-4">
              {project.members.map((member) => (
                <div key={member.id} className="flex items-center gap-3">
                  <Avatar className="h-9 w-9 border">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {member.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none">
                      {member.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Team Member
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No team members assigned.
            </p>
          )}
          <Button variant="outline" className="w-full mt-6">
            Manage Team
          </Button>
        </CardContent>
      </Card>
    </div>

    {/* Analytics Section Integrated */}
    <div className="lg:col-span-3 space-y-4 mt-8">
      <h3 className="text-xl font-semibold flex items-center gap-2 mb-4">
        <TrendingUp className="h-5 w-5 text-primary" /> Project Analytics
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm border-0 bg-background/50 backdrop-blur-xl ring-1 ring-white/10">
          <CardHeader>
             <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Velocity Chart
             </CardTitle>
             <CardDescription>Story points completed across sprints</CardDescription>
          </CardHeader>
          <CardContent className="h-72 w-full mt-4">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={VELOCITY_DATA} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground) / 0.2)" />
                 <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                 <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                 <RechartsTooltip 
                   contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))', color: 'hsl(var(--foreground))' }}
                   itemStyle={{ color: 'hsl(var(--foreground))' }}
                 />
                 <Bar dataKey="points" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={40} />
               </BarChart>
             </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-0 bg-background/50 backdrop-blur-xl ring-1 ring-white/10">
          <CardHeader>
             <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Burndown Chart
             </CardTitle>
             <CardDescription>Remaining effort in active sprint</CardDescription>
          </CardHeader>
          <CardContent className="h-72 w-full mt-4">
             <ResponsiveContainer width="100%" height="100%">
               <LineChart data={BURNDOWN_DATA} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground) / 0.2)" />
                 <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                 <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                 <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))', color: 'hsl(var(--foreground))' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                 />
                 <Legend verticalAlign="top" height={36} iconType="circle" />
                 <Line type="monotone" name="Actual Remaining" dataKey="remaining" stroke="hsl(var(--destructive))" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                 <Line type="monotone" name="Ideal Burn" dataKey="ideal" stroke="hsl(var(--muted-foreground))" strokeWidth={2} strokeDasharray="5 5" dot={false} />
               </LineChart>
             </ResponsiveContainer>
          </CardContent>
        </Card>

         <Card className="shadow-sm border-0 bg-background/50 backdrop-blur-xl ring-1 ring-white/10 lg:col-span-2">
          <CardHeader>
             <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Issue Breakdown
             </CardTitle>
             <CardDescription>Current status of all project issues</CardDescription>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ISSUE_STATUS_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                    fill="hsl(var(--foreground))"
                  >
                    {ISSUE_STATUS_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                     contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))', color: 'hsl(var(--foreground))' }}
                     itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
             </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
)

OverviewTab.propTypes = {
  project: PropTypes.object.isRequired,
  activeSprint: PropTypes.object,
}

OverviewTab.defaultProps = {
  activeSprint: null,
}

const SprintsTab = ({ project, sprints }) => (
  <Card className="shadow-sm">
    <CardHeader className="flex flex-row items-center justify-between">
      <CardTitle className="text-lg flex items-center gap-2">
        <Clock className="h-5 w-5 text-primary" />
        All Sprints
      </CardTitle>
      <CreateSprintModal />
    </CardHeader>
    <CardContent>
      {sprints.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-lg bg-muted/30">
          <Target className="h-10 w-10 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-lg font-medium">No sprints yet</h3>
          <p className="text-sm text-muted-foreground max-w-sm mt-1">
            Get started by creating your first sprint to organize tasks and
            track progress.
          </p>
          <div className="mt-4">
            <CreateSprintModal />
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {sprints.map((sprint) => (
            <Link
              key={sprint.id}
              to={`/projects/${project.id}/sprints/${sprint.id}`}
              className="block group"
            >
              <div className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {sprint.name}
                    </h4>
                    <Badge
                      variant={
                        sprint.status?.toLowerCase() === "active"
                          ? "default"
                          : "secondary"
                      }
                      className="text-xs font-normal"
                    >
                      {sprint.status}
                    </Badge>
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground gap-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(sprint.startDate).toLocaleDateString()} -{" "}
                      {new Date(sprint.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="hidden sm:block w-32">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Progress</span>
                      <span className="font-medium">{sprint.progress}%</span>
                    </div>
                    <Progress value={sprint.progress} className="h-1.5" />
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </CardContent>
  </Card>
)

SprintsTab.propTypes = {
  project: PropTypes.object.isRequired,
  sprints: PropTypes.array.isRequired,
}

const PlanningTab = () => (
  <Card className="shadow-sm">
    <CardHeader className="flex flex-row items-center justify-between">
      <CardTitle className="text-lg flex items-center gap-2">
        <ListTodo className="h-5 w-5 text-primary" />
        Plans & Upcoming User Stories
      </CardTitle>
      <CreateIssueModal triggerText="Add Issue" />
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {[
          {
            id: "US-101",
            title: "Implement OAuth2 Authentication",
            epic: "Security",
            points: 8,
            priority: "High",
          },
          {
            id: "US-102",
            title: "Design new Dashboard Layout",
            epic: "UI/UX",
            points: 5,
            priority: "Medium",
          },
          {
            id: "US-103",
            title: "Setup CI/CD Pipeline for Staging",
            epic: "DevOps",
            points: 13,
            priority: "High",
          },
          {
            id: "US-104",
            title: "User Profile Settings Page",
            epic: "Features",
            points: 3,
            priority: "Low",
          },
        ].map((story) => (
          <div
            key={story.id}
            className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-xs font-mono">
                {story.id}
              </Badge>
              <div>
                <p className="text-sm font-medium">{story.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Epic: {story.epic}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="text-xs">
                {story.points} pts
              </Badge>
              <Badge
                variant={story.priority === "High" ? "destructive" : "outline"}
                className="text-xs"
              >
                {story.priority}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
)

const EpicsTab = () => (
  <Card className="shadow-sm">
    <CardHeader className="flex flex-row items-center justify-between">
      <CardTitle className="text-lg flex items-center gap-2">
        <Layers className="h-5 w-5 text-primary" />
        Project Epics
      </CardTitle>
      <CreateIssueModal triggerText="Create Epic" />
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {[
          {
            id: "EPIC-1",
            title: "Security Improvements",
            status: "In Progress",
            progress: 65,
          },
          {
            id: "EPIC-2",
            title: "UI/UX Overhaul",
            status: "To Do",
            progress: 0,
          },
          {
            id: "EPIC-3",
            title: "Performance Optimization",
            status: "Done",
            progress: 100,
          },
        ].map((epic) => (
          <div
            key={epic.id}
            className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Layers className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{epic.title}</p>
                  <Badge variant="outline" className="text-xs font-mono">
                    {epic.id}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Status: {epic.status}
                </p>
              </div>
            </div>
            <div className="w-32">
              <div className="flex justify-between text-xs mb-1">
                <span>Progress</span>
                <span className="font-medium">{epic.progress}%</span>
              </div>
              <Progress value={epic.progress} className="h-1.5" />
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
)

const NotesTab = ({ projectId }) => {
  const SAMPLE_NOTES = [
    {
      id: 1,
      title: "Database Schema Design",
      category: "architecture",
      createdAt: "2 days ago",
      content:
        "Updated schema for user management with new fields for compliance tracking and audit logs.",
    },
    {
      id: 2,
      title: "API Integration Guide",
      category: "guide",
      createdAt: "5 days ago",
      content:
        "Step-by-step guide for integrating third-party APIs with examples and error handling strategies.",
    },
    {
      id: 3,
      title: "Frontend Architecture Decision",
      category: "documentation",
      createdAt: "1 week ago",
      content:
        "Decided to adopt the Container/Presenter pattern for all feature components to improve testability.",
    },
  ]

  return (
    <Card className="shadow-sm border-0 bg-background/50 backdrop-blur-xl supports-[backdrop-filter]:bg-background/20 ring-1 ring-white/10">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Project Notes
          </CardTitle>
          <CardDescription className="mt-1">
            Create and manage project documentation and notes
          </CardDescription>
        </div>
        <Button size="sm" asChild>
          <Link to={`/projects/${projectId}/notes/new`}>
             <FileText className="h-4 w-4 mr-2" />
             Create Note
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {SAMPLE_NOTES.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed rounded-lg bg-muted/30">
            <FileText className="h-10 w-10 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-medium">No notes yet</h3>
            <p className="text-sm text-muted-foreground max-w-sm mt-1 mb-4">
              Start documenting your project by creating your first note.
            </p>
            <Button asChild>
               <Link to={`/projects/${projectId}/notes/new`}>Create First Note</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {SAMPLE_NOTES.map((note) => (
              <Card
                key={note.id}
                className="shadow-sm border hover:shadow-md transition-shadow cursor-pointer group bg-card"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-sm font-semibold leading-tight pr-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {note.title}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 -mt-1 -mr-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive transition-colors" />
                    </Button>
                  </div>
                  <CardDescription className="text-xs flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {note.createdAt}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                    {note.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

NotesTab.propTypes = {
  projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
}

/**
 * ProjectDetailsUI - Displays detailed information about a project and its sprints.
 */
const ProjectDetailsUI = ({ project, sprints, isLoading, error }) => {
  if (isLoading) return <LoadingState />
  if (error || !project) return <ErrorState />

  const activeSprint =
    sprints?.find((s) => s.status?.toLowerCase() === "active") || sprints?.[0]

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            asChild
            className="h-10 w-10 rounded-full"
          >
            <Link to="/projects">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                {project.name}
              </h1>
              <Badge
                variant="outline"
                className={getStatusColor(project.status)}
              >
                {project.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Project ID: PRJ-{project.id}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link to={`/projects/${project.id}/settings`}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </Button>
          <Button>Edit Project</Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-6 bg-muted/50 p-1 backdrop-blur-md rounded-xl">
          <TabsTrigger value="overview" className="rounded-lg">Overview</TabsTrigger>
          <TabsTrigger value="sprints" className="rounded-lg">Sprints</TabsTrigger>
          <TabsTrigger value="epics" className="rounded-lg">Epics</TabsTrigger>
          <TabsTrigger value="planning" className="rounded-lg">Plans & Backlog</TabsTrigger>
          <TabsTrigger value="notes" className="rounded-lg">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <OverviewTab project={project} activeSprint={activeSprint} />
        </TabsContent>

        <TabsContent value="sprints" className="space-y-6">
          <SprintsTab project={project} sprints={sprints} />
        </TabsContent>

        <TabsContent value="epics" className="space-y-6">
          <EpicsTab />
        </TabsContent>

        <TabsContent value="planning" className="space-y-6">
          <PlanningTab />
        </TabsContent>

        <TabsContent value="notes" className="space-y-6">
          <NotesTab projectId={project.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

ProjectDetailsUI.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    progress: PropTypes.number.isRequired,
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
    members: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        avatar: PropTypes.string.isRequired,
      })
    ),
  }),
  sprints: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      progress: PropTypes.number.isRequired,
      startDate: PropTypes.string.isRequired,
      endDate: PropTypes.string.isRequired,
    })
  ).isRequired,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.oneOf([PropTypes.bool, PropTypes.object]),
}

ProjectDetailsUI.defaultProps = {
  project: null,
  error: null,
}

export default ProjectDetailsUI
