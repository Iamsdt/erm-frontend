import { ArrowLeft, Plus, LayoutDashboard, Sparkles, BarChart3, Settings, Clock, CheckCircle2, CircleDashed, AlertCircle } from "lucide-react"
import PropTypes from "prop-types"
import { useState } from "react"
import { Link } from "react-router"
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd"

import TaskModal from "@/components/task-modal"
import AIInsightsPanel from "@/components/ai-insights-panel"
import AnalyticsDashboard from "@/components/analytics-dashboard"
import CustomWorkflowManager from "@/components/custom-workflow-manager"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

/**
 * TaskCard - Individual task card component for kanban board
 */
const TaskCard = ({ task, onClick }) => {
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

  return (
    <Card
      className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50 active:scale-[0.98] bg-card"
      onClick={onClick}
    >
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-medium text-sm leading-tight line-clamp-2">{task.title}</h4>
        </div>

        <div className="flex items-center gap-2">
          <Badge className={getPriorityColor(task.priority)} variant="outline" size="sm">
            {task.priority || "No Priority"}
          </Badge>
          {task.type && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
              {task.type}
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border/50 mt-2">
          <div className="flex items-center gap-2">
            {task.assignee ? (
              <Avatar className="h-6 w-6 border">
                <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
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
                {task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length}
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
    assignee: PropTypes.object,
    estimatedHours: PropTypes.number,
    subtasks: PropTypes.array,
  }).isRequired,
  onClick: PropTypes.func,
}

/**
 * KanbanColumn - Reusable kanban column component
 */
const KanbanColumn = ({ title, tasks, columnId, onTaskClick, onAddTask }) => {
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
              <Badge variant="secondary" className="h-5 px-1.5 text-xs font-medium bg-background">
                {tasks.length}
              </Badge>
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground" onClick={() => onAddTask?.(columnId)}>
              <Plus className="h-4 w-4" />
            </Button>
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
              tasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`transition-all ${
                        snapshot.isDragging ? "opacity-70 scale-105 shadow-xl z-50" : ""
                      }`}
                      style={{
                        ...provided.draggableProps.style,
                      }}
                    >
                      <TaskCard
                        task={task}
                        onClick={() => onTaskClick?.(task)}
                      />
                    </div>
                  )}
                </Draggable>
              ))
            )}
            {provided.placeholder}
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-background/80 border border-transparent hover:border-border/50"
            onClick={() => onAddTask?.(columnId)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </div>
      )}
    </Droppable>
  )
}

KanbanColumn.propTypes = {
  title: PropTypes.string.isRequired,
  tasks: PropTypes.array.isRequired,
  columnId: PropTypes.string.isRequired,
  onTaskClick: PropTypes.func,
  onAddTask: PropTypes.func,
}

/**
 * SprintBoardUI - Main kanban board for sprint management
 */
const SprintBoardUI = ({
  project,
  tasks,
  sprintId,
  insights,
  analytics,
  workflows,
  isLoading,
  isInsightsLoading,
  isAnalyticsLoading,
  isWorkflowsLoading,
  error,
  selectedTask,
  onSelectTask,
  onSaveTask,
  isSavingTask,
  onSaveWorkflow,
  isSavingWorkflow,
}) => {
  const [activeTab, setActiveTab] = useState("kanban")
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

  // Group tasks by status
  const columns = [
    { id: "Todo", title: "To Do" },
    { id: "In Progress", title: "In Progress" },
    { id: "In Review", title: "In Review" },
    { id: "Done", title: "Done" },
  ]

  const tasksByStatus = columns.reduce((acc, col) => {
    acc[col.id] = tasks?.filter((t) => t.status === col.id) || []
    return acc
  }, {})

  const handleTaskClick = (task) => {
    onSelectTask?.(task)
  }

  const handleAddTask = (columnId) => {
    // TODO: Open create task modal with status pre-filled
  }

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

    // Get the task that was dragged
    const draggedTask = tasks.find((t) => t.id === draggableId)
    if (!draggedTask) return

    // If task was moved to a different column (status), update it
    if (source.droppableId !== destination.droppableId) {
      onSaveTask?.({
        ...draggedTask,
        status: destination.droppableId,
      })
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden bg-background">
      {/* Header Area */}
      <div className="flex-none border-b bg-card/50 backdrop-blur-sm px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild className="h-9 w-9 rounded-full">
              <Link to={`/projects/${project.id}`}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  Sprint {sprintId}
                </h1>
                <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
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
              {project.members?.slice(0, 4).map((member, i) => (
                <Avatar key={i} className="h-8 w-8 border-2 border-background">
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback className="bg-muted text-xs">{member.name?.charAt(0)}</AvatarFallback>
                </Avatar>
              ))}
              {project.members?.length > 4 && (
                <div className="h-8 w-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium text-muted-foreground z-10">
                  +{project.members.length - 4}
                </div>
              )}
            </div>
            <Button variant="outline" className="gap-2">
              <Settings className="h-4 w-4" />
              Board Settings
            </Button>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Issue
            </Button>
          </div>
        </div>

        {/* Tabs Navigation */}
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
            <TabsTrigger 
              value="workflow" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-2.5 font-medium text-muted-foreground data-[state=active]:text-foreground transition-all"
            >
              <Settings className="h-4 w-4 mr-2" />
              Workflow
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden bg-muted/10">
        {/* Kanban Tab */}
        <div className={`h-full p-6 overflow-x-auto ${activeTab === 'kanban' ? 'block' : 'hidden'}`}>
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="flex gap-6 h-full min-w-max pb-4">
              {columns.map((col) => (
                <div key={col.id} className="w-[320px] shrink-0">
                  <KanbanColumn
                    title={col.title}
                    tasks={tasksByStatus[col.id] || []}
                    columnId={col.id}
                    onTaskClick={handleTaskClick}
                    onAddTask={handleAddTask}
                  />
                </div>
              ))}
            </div>
          </DragDropContext>
        </div>

        {/* Other Tabs */}
        <div className={`h-full p-6 overflow-y-auto ${activeTab !== 'kanban' ? 'block' : 'hidden'}`}>
          <div className="max-w-5xl mx-auto">
            {activeTab === 'insights' && (
              <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm">
                <CardHeader className="border-b bg-muted/20">
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-amber-500" />
                    AI-Powered Sprint Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <AIInsightsPanel insights={insights} isLoading={isInsightsLoading} />
                </CardContent>
              </Card>
            )}

            {activeTab === 'analytics' && (
              <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm">
                <CardHeader className="border-b bg-muted/20">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Sprint Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <AnalyticsDashboard analytics={analytics} isLoading={isAnalyticsLoading} />
                </CardContent>
              </Card>
            )}

            {activeTab === 'workflow' && (
              <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm max-w-3xl mx-auto">
                <CardHeader className="border-b bg-muted/20">
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-primary" />
                    Workflow Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <CustomWorkflowManager
                    workflow={workflows?.find((w) => w.isActive)}
                    onSave={onSaveWorkflow}
                    isLoading={isWorkflowsLoading}
                    isSaving={isSavingWorkflow}
                  />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
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
  workflows: PropTypes.array,
  isLoading: PropTypes.bool.isRequired,
  isInsightsLoading: PropTypes.bool,
  isAnalyticsLoading: PropTypes.bool,
  isWorkflowsLoading: PropTypes.bool,
  error: PropTypes.object,
  selectedTask: PropTypes.object,
  onSelectTask: PropTypes.func,
  onSaveTask: PropTypes.func,
  isSavingTask: PropTypes.bool,
  onSaveWorkflow: PropTypes.func,
  isSavingWorkflow: PropTypes.bool,
}

export default SprintBoardUI
