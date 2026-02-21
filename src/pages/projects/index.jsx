import { useGetProjects } from "@/services/query/project.query"

import ProjectsUI from "./projects.ui"

const Projects = () => {
  const { data, isLoading, error } = useGetProjects()

  return (
    <ProjectsUI
      data={data?.results || []}
      isLoading={isLoading}
      error={error}
    />
  )
}

export default Projects
