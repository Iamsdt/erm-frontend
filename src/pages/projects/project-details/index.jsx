import { useParams } from "react-router"

import {
  useGetProjectById,
  useGetSprints,
} from "@/services/query/project.query"

import ProjectDetailsUI from "./project-details.ui"

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

  return (
    <ProjectDetailsUI
      project={project}
      sprints={sprints?.results || []}
      isLoading={isProjectLoading || isSprintsLoading}
      error={projectError || sprintsError}
    />
  )
}

export default ProjectDetails
