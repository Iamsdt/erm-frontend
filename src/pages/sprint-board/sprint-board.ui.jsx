import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import {
  ArrowLeft,
  LayoutDashboard,
  Sparkles,
  BarChart3,
  Clock,
  CheckCircle2,
  CircleDashed,
  Filter,
  X,
  Send,
  ChevronRight,
  CalendarDays,
  Users,
} from "lucide-react"
import PropTypes from "prop-types"
import { useState } from "react"
import { Link } from "react-router"

import AIInsightsPanel from "@/components/ai-insights-panel"
import AnalyticsDashboard from "@/components/analytics-dashboard"
import TaskModal from "@/components/task-modal"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

import { CreateIssueSidebar } from "../projects/components/create-issue-sidebar"

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const getPriorityColor = (priority) => {
  switch (priority?.toLowerCase()) {
    case "high":
      return "bg-red-100 text-red-800 border-red-200"
    case "medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "low":
      return "bg-green-100 text-green-800 border-green-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

/**
 * TaskCard - Individual task card for the kanban board.
 * Supports both tasks and subtasks with visual distinction.
 */
const TaskCard = ({ task, onClick, parentTitle }) => {
  const isSubtask = task.type === "subtask" || !!task.parentId

  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md hover:border-primary/50 active:scale-[0.98] bg-card ${
        isSubtask ? "border-l-4 border-l-orange-400 ml-2" : ""
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4 space-y-3">
        {isSubtask && parentTitle && (
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <ChevronRight className="h-3 w-3" />
            <span className="line-clamp-1">{parentTitle}</span>
          </div>
        )}

        <div className="flex items-start justify-between gap-2">
          <h4 className="font-medium text-sm leading-tight line-clamp-2">
            {task.title}
          </h4>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Badge
            className={getPriorityColor(task.priority)}
            variant="outline"
            size="sm"
          >
            {task.priority || "No Priority"}
          </Badge>
          {isSubtask ? (
            <Badge
              className="bg-orange-100 text-orange-800 border-orange-200 text-[10px] px-1.5 py-0"
              variant="outline"
            >
              Subtask
            </Badge>
          ) : task.type ? (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
              {task.type}
            </Badge>
          ) : null}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border/50 mt-2">
          <div className="flex items-center gap-2">
            {task.assignee ? (
              <Avatar className="h-6 w-6 border">
                <AvatarImage
                  src={task.assignee.avatar}
                  alt={task.assignee.name}
                />
                <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-medium">
                  {task.assignee.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            ) : (
              <div className="h-6 w-6 rounded-full bg-muted border border-dashed flex items-center justify-center text-muted-foreground text-[10px]">
                ?
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {task.subtasks && task.subtasks.length > 0 && (
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                {task.subtasks.filter((s) => s.completed).length}/
                {task.subtasks.length}
              </span>
            )}
            {task.estimatedHours && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {task.estimatedHours}h
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

TaskCard.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    priority: PropTypes.string,
    type: PropTypes.string,
    parentId: PropTypes.string,
    assignee: PropTypes.object,
    estimatedHours: PropTypes.number,
    subtasks: PropTypes.array,
  }).isRequired,
  onClick: PropTypes.func,
  parentTitle: PropTypes.string,
}

TaskCard.defaultProps = {
  onClick: undefined,
  parentTitle: undefined,
}

/**
 * KanbanColumn - Reusable kanban column with drop support.
 */
const KanbanColumn = ({ title, tasks, allTasks, columnId, onTaskClick, projectMembers }) => {
  return (
    <Droppable droppableId={columnId}>
      {(provided, snapshot) => (
        <div
          className={`flex min-h-125 flex-col gap-3 rounded-xl border bg-muted/40 p-3 transition-colors ${
            snapshot.isDraggingOver ? "bg-primary/5 border-primary/30" : ""
          }`}
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          <div className="flex items-center justify-between px-1 pb-2 border-b border-border/50">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm text-foreground">{title}</h3>
              <Badge
                variant="secondary"
                className="h-5 px-1.5 text-xs font-medium bg-background"
              >
                {tasks.length}
              </Badge>
            </div>
            <CreateIssueSidebar
              triggerText=""
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-muted-foreground hover:text-foreground"
              defaultStatus={columnId}
              tasks={allTasks}
              projectMembers={projectMembers}
            />
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto py-1 custom-scrollbar">
            {tasks.length === 0 ? (
              <div className="flex h-32 flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/20 bg-background/50">
                <CircleDashed className="h-6 w-6 text-muted-foreground/40 mb-2" />
                <p className="text-center text-xs text-muted-foreground font-medium">
                  Drop tasks here
                </p>
              </div>
            ) : (
              tasks.map((task, index) => {
                const parent = task.parentId
                  ? allTasks.find((t) => t.id === task.parentId)
                  : null
                return (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`transition-all ${
                          snapshot.isDragging
                            ? "opacity-70 scale-105 shadow-xl z-50"
                            : ""
                        }`}
                        style={{ ...provided.draggableProps.style }}
                      >
                        <TaskCard
                          task={task}
                          parentTitle={parent?.title}
                          onClick={() => onTaskClick?.(task)}
                        />
                      </div>
                    )}
                  </Draggable>
                )
              })
            )}
            {provided.placeholder}
          </div>

          <CreateIssueSidebar
            triggerText="Add Task"
            variant="ghost"
            size="sm"
            className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-background/80 border border-transparent hover:border-border/50"
            defaultStatus={columnId}
            tasks={allTasks}
            projectMembers={projectMembers}
          />
        </div>
      )}
    </Droppable>
  )
}

KanbanColumn.propTypes = {
  title: PropTypes.string.isRequired,
  tasks: PropTypes.array.isRequired,
  allTasks: PropTypes.array.isRequired,
  columnId: PropTypes.string.isRequired,
  onTaskClick: PropTypes.func,
  projectMembers: PropTypes.array,
}

KanbanColumn.defaultProps = {
  onTaskClick: undefined,
  projectMembers: undefined,
}

// ---------------------------------------------------------------------------
// BoardFilters
// ---------------------------------------------------------------------------

/**
 * BoardFilters - Filter bar for type, priority, and assignee.
 */
const BoardFilters = ({ filters, onChange, projectMembers, tasks }) => {
  const hasActiveFilters =
    filters.type !== "all" || filters.priority !== "all" || filters.assignee !== "all"

  const handleClear = () => onChange({ type: "all", priority: "all", assignee: "all" })

  const seen = new Set()
  const assignees = []
  for (const task of tasks) {
    if (task.assignee && !seen.has(task.assignee.id)) {
      seen.add(task.assignee.id)
      assignees.push(task.assignee)
    }
  }
  const members =
    projectMembers?.length > 0
      ? projectMembers.map((m) => ({ id: m.id, name: m.name }))
      : assignees

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground mr-1">
        <Filter className="h-3.5 w-3.5" />
        <span className="font-medium text-xs">Filters:</span>
      </div>

      <Select value={filters.type} onValueChange={(v) => onChange({ ...filters, type: v })}>
        <SelectTrigger className="h-7 text-xs px-2 w-auto min-w-[90px] bg-background">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="task">Tasks Only</SelectItem>
          <SelectItem value="subtask">Subtasks Only</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.priority}
        onValueChange={(v) => onChange({ ...filters, priority: v })}
      >
        <SelectTrigger className="h-7 text-xs px-2 w-auto min-w-[105px] bg-background">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Priorities</SelectItem>
          <SelectItem value="high">High</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="low">Low</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.assignee}
        onValueChange={(v) => onChange({ ...filters, assignee: v })}
      >
        <SelectTrigger className="h-7 text-xs px-2 w-auto min-w-[115px] bg-background">
          <SelectValue placeholder="Assignee" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Members</SelectItem>
          <SelectItem value="unassigned">Unassigned</SelectItem>
          {members.map((m) => (
            <SelectItem key={m.id} value={String(m.id)}>
              {m.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs gap-1 text-muted-foreground hover:text-foreground"
          onClick={handleClear}
        >
          <X className="h-3 w-3" />
          Clear
        </Button>
      )}
    </div>
  )
}

BoardFilters.propTypes = {
  filters: PropTypes.shape({
    type: PropTypes.string,
    priority: PropTypes.string,
    assignee: PropTypes.string,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  projectMembers: PropTypes.array,
  tasks: PropTypes.array,
}

BoardFilters.defaultProps = {
  projectMembers: undefined,
  tasks: undefined,
}

// ---------------------------------------------------------------------------
// DailyUpdatesTab
// ---------------------------------------------------------------------------

const MOCK_TEAM_UPDATES = [
  {
    id: 1,
    name: "Alice Smith",
    avatar: "https://i.pravatar.cc/150?u=1",
    today: "Completed UI component library setup and theme design review.",
    blockers: "None",
    time: "2 hours ago",
  },
  {
    id: 2,
    name: "Bob Jones",
    avatar: "https://i.pravatar.cc/150?u=2",
    today: "Implemented API authentication and token refresh flow.",
    blockers: "Waiting for design specs for the mobile screen",
    time: "1 hour ago",
  },
]

/**
 * DailyUpdatesTab - Embedded standup and team updates view for the sprint.
 */
const DailyUpdatesTab = ({ sprintId }) => {
  const [standup, setStandup] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const dateLabel = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!standup.trim()) {
      return
    }
    setSubmitted(true)
    setTimeout(() => {
      setStandup("")
      setSubmitted(false)
    }, 2500)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Daily Updates</h2>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
            <CalendarDays className="h-4 w-4" />
            {dateLabel}
            {sprintId && (
              <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                Sprint {sprintId}
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Send className="h-4 w-4 text-primary" />
              Post Your Standup
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="standup-input"
                  className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
                >
                  What did you accomplish?
                </label>
                <Textarea
                  id="standup-input"
                  placeholder="Share your blockers, progress, and what you are working on today..."
                  value={standup}
                  onChange={(event) => setStandup(event.target.value)}
                  rows={5}
                  className="resize-none text-sm"
                />
              </div>
              {submitted ? (
                <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 rounded-lg px-3 py-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  Update posted successfully!
                </div>
              ) : (
                <Button
                  type="submit"
                  className="w-full gap-2"
                  disabled={!standup.trim()}
                >
                  <Send className="h-4 w-4" />
                  Post Update
                </Button>
              )}
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Team Updates
              <Badge variant="secondary" className="ml-auto text-xs">
                {MOCK_TEAM_UPDATES.length} updates
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {MOCK_TEAM_UPDATES.map((update, _index) => (
              <div key={update.id}>
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8 shrink-0 mt-0.5">
                    <AvatarImage src={update.avatar} alt={update.name} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      {update.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-medium text-sm">{update.name}</span>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {update.time}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {update.today}
                    </p>
                    {update.blockers && update.blockers !== "None" && (
                      <div className="mt-1.5 flex items-start gap-1.5">
                        <Badge
                          variant="outline"
                          className="text-[10px] px-1.5 py-0 border-orange-300 text-orange-700 bg-orange-50 shrink-0"
                        >
                          Blocker
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {update.blockers}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                {_index < MOCK_TEAM_UPDATES.length - 1 && (
                  <Separator className="mt-4" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

DailyUpdatesTab.propTypes = {
  sprintId: PropTypes.string,
}

DailyUpdatesTab.defaultProps = {
  sprintId: undefined,
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const COLUMNS = [
  { id: "Todo", title: "To Do" },
  { id: "In Progress", title: "In Progress" },
  { id: "In Review", title: "In Review" },
  { id: "Done", title: "Done" },
]

const DEFAULT_FILTERS = { type: "all", priority: "all", assignee: "all" }

/**
 * SprintBoardUI - Main kanban board for sprint management.
 * Tabs: Board (with task/subtask filters), Daily Updates, AI Insights, Analytics.
 * Workflow tab removed. Issue creation moved to a sidebar sheet.
 */
const SprintBoardUI = ({
  project,
  tasks,
  sprintId,
  insights,
  analytics,
  isLoading,
  isInsightsLoading,
  isAnalyticsLoading,
  error,
  selectedTask,
  onSelectTask,
  onSaveTask,
  isSavingTask,
}) => {
  const [activeTab, setActiveTab] = useState("kanban")
  const [filters, setFilters] = useState(DEFAULT_FILTERS)

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-12 w-32" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="p-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link to={`/projects/${project?.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Project
          </Link>
        </Button>
        <Card className="border-destructive bg-destructive/10">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent className="text-destructive/80">
            Failed to load sprint board. Please try again later.
          </CardContent>
        </Card>
      </div>
    )
  }

  // Apply filters to tasks
  const filteredTasks = tasks.filter((task) => {
    const isSubtask = task.type === "subtask" || !!task.parentId

    if (filters.type === "task" && isSubtask) return false
    if (filters.type === "subtask" && !isSubtask) return false

    if (
      filters.priority !== "all" &&
      task.priority?.toLowerCase() !== filters.priority
    ) {
      return false
    }

    if (filters.assignee === "unassigned" && task.assignee) {
      return false
    }
    if (
      filters.assignee !== "all" &&
      filters.assignee !== "unassigned" &&
      String(task.assignee?.id) !== filters.assignee
    ) {
      return false
    }

    return true
  })

  // Group filtered tasks by status
  const tasksByStatus = COLUMNS.reduce((accumulator, col) => {
    accumulator[col.id] = filteredTasks.filter((t) => t.status === col.id)
    return accumulator
  }, {})

  const handleDragEnd = (result) => {
    const { source, destination, draggableId } = result
    if (!destination) {
      return
    }
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return
    }

    const draggedTask = tasks.find((t) => t.id === draggableId)
    if (!draggedTask) {
      return
    }

    if (source.droppableId !== destination.droppableId) {
      onSaveTask?.({ ...draggedTask, status: destination.droppableId })
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden bg-background">
      {/* Header Area */}
      <div className="flex-none border-b bg-card/50 backdrop-blur-sm px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              asChild
              className="h-9 w-9 rounded-full"
            >
              <Link to={`/projects/${project.id}`}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  Sprint {sprintId}
                </h1>
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary hover:bg-primary/20"
                >
                  Active Sprint
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                <LayoutDashboard className="h-4 w-4" />
                {project.name}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2 mr-4">
              {project.members?.slice(0, 4).map((member, index) => (
                <Avatar
                  key={index}
                  className="h-8 w-8 border-2 border-background"
                >
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback className="bg-muted text-xs">
                    {member.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              ))}
              {project.members?.length > 4 && (
                <div className="h-8 w-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium text-muted-foreground z-10">
                  +{project.members.length - 4}
                </div>
              )}
            </div>
            <CreateIssueSidebar
              triggerText="Create Issue"
              variant="default"
              size="default"
              tasks={tasks}
              projectMembers={project.members || []}
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-transparent border-b border-border/50 w-full justify-start h-auto p-0 rounded-none space-x-6">
            <TabsTrigger
              value="kanban"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-2.5 font-medium text-muted-foreground data-[state=active]:text-foreground transition-all"
            >
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Board
            </TabsTrigger>
            <TabsTrigger
              value="daily-updates"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-2.5 font-medium text-muted-foreground data-[state=active]:text-foreground transition-all"
            >
              <CalendarDays className="h-4 w-4 mr-2" />
              Daily Updates
            </TabsTrigger>
            <TabsTrigger
              value="insights"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-2.5 font-medium text-muted-foreground data-[state=active]:text-foreground transition-all"
            >
              <Sparkles className="h-4 w-4 mr-2 text-amber-500" />
              AI Insights
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-2.5 font-medium text-muted-foreground data-[state=active]:text-foreground transition-all"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden bg-muted/10">
        {/* Kanban Tab */}
        {activeTab === "kanban" && (
          <div className="h-full p-6 overflow-x-auto flex flex-col">
            <div className="mb-6">
              <BoardFilters
                filters={filters}
                onFilterChange={(key, value) => {
                  setFilters((previous) => ({ ...previous, [key]: value }))
                }}
                allTasks={tasks}
                projectMembers={project?.members || []}
              />
            </div>

            <DragDropContext onDragEnd={handleDragEnd}>
              <div className="flex gap-6 flex-1 min-w-max pb-4 overflow-x-auto">
                {COLUMNS.map((col) => (
                  <div key={col.id} className="w-[320px] shrink-0">
                    <KanbanColumn
                      title={col.title}
                      tasks={tasksByStatus[col.id] || []}
                      columnId={col.id}
                      onTaskClick={(task) => onSelectTask?.(task)}
                      onAddTask={() => {
                        // Create issue sidebar will be triggered via button
                      }}
                      allTasks={tasks}
                      projectMembers={project?.members || []}
                    />
                  </div>
                ))}
              </div>
            </DragDropContext>
          </div>
        )}

        {/* Daily Updates Tab */}
        {activeTab === "daily-updates" && (
          <div className="h-full p-6 overflow-y-auto">
            <DailyUpdatesTab projectMembers={project?.members || []} />
          </div>
        )}

        {/* AI Insights Tab */}
        {activeTab === "insights" && (
          <div className="h-full p-6 overflow-y-auto">
            <div className="max-w-5xl mx-auto">
              <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm">
                <CardHeader className="border-b bg-muted/20">
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-amber-500" />
                    AI-Powered Sprint Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <AIInsightsPanel
                    insights={insights}
                    isLoading={isInsightsLoading}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="h-full p-6 overflow-y-auto">
            <div className="max-w-5xl mx-auto">
              <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm">
                <CardHeader className="border-b bg-muted/20">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Sprint Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <AnalyticsDashboard
                    analytics={analytics}
                    isLoading={isAnalyticsLoading}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={!!selectedTask}
        task={selectedTask}
        projectId={project?.id}
        sprintId={sprintId}
        onClose={() => onSelectTask?.(null)}
        onSave={onSaveTask}
        isLoading={isSavingTask}
        projectMembers={project?.members || []}
      />
    </div>
  )
}

SprintBoardUI.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    members: PropTypes.array,
  }),
  tasks: PropTypes.array.isRequired,
  sprintId: PropTypes.string,
  insights: PropTypes.object,
  analytics: PropTypes.object,
  isLoading: PropTypes.bool.isRequired,
  isInsightsLoading: PropTypes.bool,
  isAnalyticsLoading: PropTypes.bool,
  error: PropTypes.object,
  selectedTask: PropTypes.object,
  onSelectTask: PropTypes.func,
  onSaveTask: PropTypes.func,
  isSavingTask: PropTypes.bool,
}

SprintBoardUI.defaultProps = {
  project: undefined,
  sprintId: undefined,
  insights: undefined,
  analytics: undefined,
  isInsightsLoading: false,
  isAnalyticsLoading: false,
  error: undefined,
  selectedTask: undefined,
  onSelectTask: undefined,
  onSaveTask: undefined,
  isSavingTask: false,
}

export default SprintBoardUI
