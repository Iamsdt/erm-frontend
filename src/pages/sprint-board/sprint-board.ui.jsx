import { ArrowLeft, Plus } from "lucide-react"
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

/**
 * TaskCard - Individual task card component for kanban board
 */
const TaskCard = ({ task, onClick }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card
      className="cursor-pointer transition-all hover:shadow-md active:scale-95"
      onClick={onClick}
    >
      <CardContent className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-medium text-sm line-clamp-2">{task.title}</h4>
          <Badge className={getPriorityColor(task.priority)} variant="outline">
            {task.priority}
          </Badge>
        </div>

        {task.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            {task.assignee ? (
              <div
                className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-white text-xs flex items-center justify-center font-bold"
                title={task.assignee.name}
              >
                {task.assignee.name.charAt(0)}
              </div>
            ) : (
              <div className="h-6 w-6 rounded-full bg-gray-200 text-gray-600 text-xs flex items-center justify-center font-bold">
                ?
              </div>
            )}
          </div>
          {task.estimatedHours && (
            <span className="text-xs text-muted-foreground">
              {task.estimatedHours}h
            </span>
          )}
        </div>

        {task.subtasks && task.subtasks.length > 0 && (
          <div className="text-xs text-muted-foreground">
            {task.subtasks.filter((s) => s.completed).length}/
            {task.subtasks.length} done
          </div>
        )}
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
          className={`flex min-h-96 flex-col gap-4 rounded-lg border bg-muted/30 p-4 transition-colors ${
            snapshot.isDraggingOver ? "bg-blue-50" : ""
          }`}
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">{title}</h3>
              <p className="text-xs text-muted-foreground">{tasks.length} tasks</p>
            </div>
            <Badge variant="outline">{tasks.length}</Badge>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto">
            {tasks.length === 0 ? (
              <div className="flex h-32 items-center justify-center rounded border border-dashed">
                <p className="text-center text-xs text-muted-foreground">
                  No tasks yet
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
                        snapshot.isDragging ? "opacity-50" : ""
                      }`}
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
            variant="outline"
            size="sm"
            className="w-full"
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
  const tasksByStatus = {
    Todo: tasks.filter((t) => t.status === "Todo"),
    "In Progress": tasks.filter((t) => t.status === "In Progress"),
    "In Review": tasks.filter((t) => t.status === "In Review"),
    Done: tasks.filter((t) => t.status === "Done"),
  }

  const handleTaskClick = (task) => {
    onSelectTask?.(task)
  }

  const handleAddTask = (columnId) => {
    // TODO: Open create task modal with status pre-filled
  }

  const handleDragEnd = (result) => {
    const { source, destination, draggableId } = result

    // If dropped outside a valid droppable area
    if (!destination) {
      return
    }

    // If dropped in the same position
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
    <div className="space-y-6 p-6">
      <Button variant="ghost" asChild>
        <Link to={`/projects/${project.id}`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Project
        </Link>
      </Button>

      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Sprint {sprintId}
          </h1>
          <p className="mt-2 text-muted-foreground">
            Manage tasks for {project.name}
          </p>
        </div>

        {/* Quick stats */}
        <div className="grid gap-4 md:grid-cols-4">
          {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
            <Card key={status}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">{status}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statusTasks.length}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Tabs View */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="workflow">Workflow Config</TabsTrigger>
        </TabsList>

        {/* Kanban Tab */}
        <TabsContent value="kanban" className="mt-6 space-y-4">
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
                <KanbanColumn
                  key={status}
                  title={status}
                  tasks={statusTasks}
                  columnId={status}
                  onTaskClick={handleTaskClick}
                  onAddTask={handleAddTask}
                />
              ))}
            </div>
          </DragDropContext>
        </TabsContent>

        {/* AI Insights Tab */}
        <TabsContent value="insights" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Sprint Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <AIInsightsPanel
                insights={insights}
                isLoading={isInsightsLoading}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Sprint Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <AnalyticsDashboard
                analytics={analytics}
                isLoading={isAnalyticsLoading}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Workflow Config Tab */}
        <TabsContent value="workflow" className="mt-6 max-w-2xl">
          <CustomWorkflowManager
            workflow={workflows?.find((w) => w.isActive)}
            onSave={onSaveWorkflow}
            isLoading={isWorkflowsLoading}
            isSaving={isSavingWorkflow}
          />
        </TabsContent>
      </Tabs>

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
