import { useState } from "react"
import { useParams } from "react-router"

import { useFetchStandups } from "@/services/query/daily-update.query"
import {
  useGetProjectById,
  useGetTasks,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
  useGetAIInsights,
  useGetSprintAnalytics,
} from "@/services/query/project.query"

import SprintBoardUI from "./sprint-board.ui"

/**
 * Groups flat standup entries by date for the StandupTab.
 * @param {Array} standups - Flat array of standup entries from API
 * @returns {Array} Grouped by date with label and updates
 */
const groupStandupsByDate = (standups) => {
  if (!standups?.length) return []
  const grouped = {}
  for (const standup of standups) {
    const date = standup.submittedAt?.split("T")[0] || "unknown"
    if (!grouped[date]) {
      grouped[date] = { id: date, date, label: date, updates: [] }
    }
    grouped[date].updates.push({
      id: standup.id,
      name: standup.name,
      avatar: `https://i.pravatar.cc/150?u=${standup.id}`,
      today: standup.today,
      blockers: standup.blockers || "None",
      time: standup.submittedAt,
    })
  }
  return Object.values(grouped).sort((a, b) => b.date.localeCompare(a.date))
}

const SprintBoard = () => {
  const { projectId, sprintId } = useParams()
  const [selectedTask, setSelectedTask] = useState(null)

  const {
    data: project,
    isLoading: isProjectLoading,
    error: projectError,
  } = useGetProjectById(projectId)
  const {
    data: tasks,
    isLoading: isTasksLoading,
    error: tasksError,
  } = useGetTasks(projectId, sprintId)
  const { data: insights, isLoading: isInsightsLoading } = useGetAIInsights(
    projectId,
    sprintId
  )
  const { data: analytics, isLoading: isAnalyticsLoading } =
    useGetSprintAnalytics(projectId, sprintId)

  const { data: standupData } = useFetchStandups()
  const standupDates = groupStandupsByDate(standupData?.standups)

  const createTaskMutation = useCreateTask()
  const updateTaskMutation = useUpdateTask()
  const deleteTaskMutation = useDeleteTask()

  const handleCreateTask = (formData) => {
    createTaskMutation.mutate(
      { projectId, sprintId, data: formData },
      { onSuccess: () => setSelectedTask(null) }
    )
  }

  const handleSaveTask = (formData) => {
    if (!selectedTask) return
    updateTaskMutation.mutate(
      {
        projectId,
        sprintId,
        taskId: selectedTask.id,
        data: formData,
      },
      { onSuccess: () => setSelectedTask(null) }
    )
  }

  const handleDeleteTask = (taskId) => {
    deleteTaskMutation.mutate(
      { projectId, sprintId, taskId },
      { onSuccess: () => setSelectedTask(null) }
    )
  }

  return (
    <SprintBoardUI
      project={project}
      tasks={tasks?.results || []}
      sprintId={sprintId}
      insights={insights}
      analytics={analytics}
      isLoading={isProjectLoading || isTasksLoading}
      isInsightsLoading={isInsightsLoading}
      isAnalyticsLoading={isAnalyticsLoading}
      error={projectError || tasksError}
      selectedTask={selectedTask}
      onSelectTask={setSelectedTask}
      onCreateTask={handleCreateTask}
      onSaveTask={handleSaveTask}
      onDeleteTask={handleDeleteTask}
      standupDates={standupDates}
      isSavingTask={updateTaskMutation.isPending}
    />
  )
}

export default SprintBoard
