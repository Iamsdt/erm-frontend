import { useParams } from "react-router"

import {
  useGetProjectById,
  useGetProjectSettings,
} from "@/services/query/project.query"

import ProjectSettingsUI from "./project-settings.ui"

const buildProjectSummary = (project, projectId) =>
  project
    ? { id: project.id, name: project.name, description: project.description }
    : { id: projectId, name: "", description: "" }

const ProjectSettings = () => {
  const { projectId } = useParams()

  const { data: project, isLoading: isProjectLoading } =
    useGetProjectById(projectId)
  const { data: settings, isLoading: isSettingsLoading } =
    useGetProjectSettings(projectId)

  return (
    <ProjectSettingsUI
      project={buildProjectSummary(project, projectId)}
      members={settings?.members ?? []}
      levels={settings?.levels ?? []}
      estimates={settings?.estimates ?? []}
      workflowStages={settings?.workflowStages ?? []}
      isLoading={isProjectLoading || isSettingsLoading}
    />
  )
}

export default ProjectSettings
