import { useParams } from "react-router"

import ProjectSettingsUI from "./project-settings.ui"

const ProjectSettings = () => {
  const { projectId } = useParams()

  // Mock data for project settings
  const project = {
    id: projectId,
    name: "E-Commerce Platform Redesign",
    description:
      "Modernizing the core e-commerce experience with React and Node.js",
  }

  const members = [
    {
      id: 1,
      name: "Alice Johnson",
      role: "Product Manager",
      avatar: "https://i.pravatar.cc/150?u=1",
    },
    {
      id: 2,
      name: "Bob Smith",
      role: "Lead Developer",
      avatar: "https://i.pravatar.cc/150?u=2",
    },
    {
      id: 3,
      name: "Charlie Davis",
      role: "UI/UX Designer",
      avatar: "https://i.pravatar.cc/150?u=3",
    },
  ]

  const levels = [
    { id: 1, name: "High", color: "destructive" },
    { id: 2, name: "Medium", color: "warning" },
    { id: 3, name: "Low", color: "default" },
  ]

  const estimates = [
    { id: 1, points: 1, meaning: "Trivial, takes less than an hour" },
    { id: 2, points: 2, meaning: "Simple, takes a few hours" },
    { id: 3, points: 3, meaning: "Moderate, takes half a day" },
    { id: 4, points: 5, meaning: "Complex, takes a full day" },
    { id: 5, points: 8, meaning: "Very complex, takes multiple days" },
  ]

  const workflowStages = [
    {
      id: 1,
      name: "To Do",
      description: "Tasks that have not been started yet",
    },
    {
      id: 2,
      name: "In Progress",
      description: "Tasks currently being worked on",
    },
    {
      id: 3,
      name: "Code Review",
      description: "Tasks waiting for peer review",
    },
    { id: 4, name: "QA", description: "Tasks in testing phase" },
    { id: 5, name: "Done", description: "Completed tasks" },
    { id: 6, name: "Prod", description: "Deployed to production" },
  ]

  return (
    <ProjectSettingsUI
      project={project}
      members={members}
      levels={levels}
      estimates={estimates}
      workflowStages={workflowStages}
    />
  )
}

export default ProjectSettings
