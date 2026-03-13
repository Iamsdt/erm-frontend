import { useParams } from "react-router"

import {
  useGetProjectById,
  useGetSprints,
  useGetSprintAnalytics,
} from "@/services/query/project.query"

import ProjectDetailsUI from "./project-details.ui"

const STATUS_COLORS = {
  Todo: "#facc15",
  "To Do": "#facc15",
  "In Progress": "#3b82f6",
  "In Review": "#a855f7",
  Review: "#a855f7",
  Done: "#22c55e",
}

const transformBurndown = (data) =>
  data?.map((point) => ({
    day: point.day,
    remaining: point.remaining,
    ideal: point.ideal ?? point.remaining,
  }))

const transformIssueStatus = (byStatus) =>
  byStatus
    ? Object.entries(byStatus).map(([name, value]) => ({
        name,
        value,
        color: STATUS_COLORS[name] || "#94a3b8",
      }))
    : []

const ProjectDetails = () => {
  const { projectId } = useParams()
  const {
    data: project,
    isLoading: isProjectLoading,
    error: projectError,
  } = useGetProjectById(projectId)
  const {
    data: sprints,
    isLoading: isSprintsLoading,
    error: sprintsError,
  } = useGetSprints(projectId)

  const sprintsList = sprints?.results || []
  const activeSprint = sprintsList.find(
    (s) => s.status?.toLowerCase() === "active"
  )

  const { data: analytics } = useGetSprintAnalytics(
    projectId,
    activeSprint?.id?.toString()
  )

  return (
    <ProjectDetailsUI
      project={project}
      sprints={sprintsList}
      isLoading={isProjectLoading || isSprintsLoading}
      error={projectError || sprintsError}
      burndownData={transformBurndown(analytics?.burndownData)}
      issueStatusData={transformIssueStatus(
        analytics?.taskDistribution?.byStatus
      )}
    />
  )
}

export default ProjectDetails
