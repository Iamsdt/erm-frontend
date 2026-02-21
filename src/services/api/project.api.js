import apiConstant from "@/lib/constants/api.constant"

import api from "./index"

export const getProjects = async (parameters) => {
    const response = await api.get(apiConstant.project.list, {
        params: parameters,
    })
    return response.data
}

export const getProjectById = async (id) => {
    const response = await api.get(`${apiConstant.project.detail}${id}/`)
    return response.data
}

export const getSprints = async (projectId, parameters) => {
    const response = await api.get(apiConstant.project.sprints(projectId), {
        params: parameters,
    })
    return response.data
}

export const getSprintById = async (projectId, sprintId) => {
    const response = await api.get(
        apiConstant.project.sprintDetail(projectId, sprintId)
    )
    return response.data
}

export const getTasks = async (projectId, sprintId, parameters) => {
    const response = await api.get(
        apiConstant.project.tasks(projectId, sprintId),
        { params: parameters }
    )
    return response.data
}
export const getTaskById = async (projectId, sprintId, taskId) => {
    const response = await api.get(
        `${apiConstant.project.tasks(projectId, sprintId)}${taskId}/`
    )
    return response.data
}

export const updateTask = async (projectId, sprintId, taskId, data) => {
    const response = await api.patch(
        `${apiConstant.project.tasks(projectId, sprintId)}${taskId}/`,
        data
    )
    return response.data
}
export const getAIInsights = async (projectId, sprintId) => {
    const response = await api.get(
        `projects/${projectId}/sprints/${sprintId}/ai-insights/`
    )
    return response.data
}

export const getWorkflows = async (projectId) => {
    const response = await api.get(`projects/${projectId}/workflows/`)
    return response.data
}

export const getWorkflowById = async (projectId, workflowId) => {
    const response = await api.get(
        `projects/${projectId}/workflows/${workflowId}/`
    )
    return response.data
}

export const updateWorkflow = async (projectId, workflowId, data) => {
    const response = await api.patch(
        `projects/${projectId}/workflows/${workflowId}/`,
        data
    )
    return response.data
}

export const getSprintAnalytics = async (projectId, sprintId) => {
    const response = await api.get(
        `projects/${projectId}/sprints/${sprintId}/analytics/`
    )
    return response.data
}
export const addTaskComment = async (projectId, sprintId, taskId, data) => {
    const response = await api.post(
        `${apiConstant.project.tasks(projectId, sprintId)}${taskId}/comments/`,
        data
    )
    return response.data
}