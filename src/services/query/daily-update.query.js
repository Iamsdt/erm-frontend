import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { toast } from "@/components/ui/use-toast"
import {
  getProgressLog,
  getStandupProjects,
  getStandups,
  getTeamUpdates,
  getUserStories,
  submitAiReview,
  submitStandup,
} from "@api/daily-update.api"

const KEY_STANDUPS = "daily-standups"
const KEY_TEAM_UPDATES = "daily-team-updates"
const KEY_PROGRESS_LOG = "daily-progress-log"
const KEY_PROJECTS = "daily-standup-projects"
const KEY_STORIES = "daily-user-stories"

/**
 * React Query hook to fetch today's standup updates.
 * @returns {import("@tanstack/react-query").UseQueryResult} Query result with standups
 */
export const useFetchStandups = () => {
  return useQuery({
    queryKey: [KEY_STANDUPS],
    queryFn: async ({ signal }) => {
      const response = await getStandups({ signal })
      return response.data
    },
    staleTime: 60 * 1000,
    retry: 2,
  })
}

/**
 * Mutation hook to submit a daily standup.
 * @returns {import("@tanstack/react-query").UseMutationResult} Mutation result
 */
export const useSubmitStandup = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload) => submitStandup(payload),
    onSuccess: () => {
      toast({
        title: "Standup submitted",
        description: "Your daily standup has been submitted.",
      })
      queryClient.invalidateQueries({ queryKey: [KEY_STANDUPS] })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    },
  })
}

/**
 * React Query hook to fetch team updates across departments.
 * @returns {import("@tanstack/react-query").UseQueryResult} Query result with team updates
 */
export const useFetchTeamUpdates = () => {
  return useQuery({
    queryKey: [KEY_TEAM_UPDATES],
    queryFn: async ({ signal }) => {
      const response = await getTeamUpdates({ signal })
      return response.data
    },
    staleTime: 60 * 1000,
    retry: 2,
  })
}

/**
 * React Query hook to fetch progress log entries.
 * @returns {import("@tanstack/react-query").UseQueryResult} Query result with progress log
 */
export const useFetchProgressLog = () => {
  return useQuery({
    queryKey: [KEY_PROGRESS_LOG],
    queryFn: async ({ signal }) => {
      const response = await getProgressLog({ signal })
      return response.data
    },
    staleTime: 60 * 1000,
    retry: 2,
  })
}

/**
 * React Query hook to fetch available projects for standup form.
 * @returns {import("@tanstack/react-query").UseQueryResult} Query result with projects
 */
export const useFetchStandupProjects = () => {
  return useQuery({
    queryKey: [KEY_PROJECTS],
    queryFn: async ({ signal }) => {
      const response = await getStandupProjects({ signal })
      return response.data
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
}

/**
 * React Query hook to fetch user stories for a specific project.
 * @param {string} projectId - Project ID to fetch stories for
 * @returns {import("@tanstack/react-query").UseQueryResult} Query result with user stories
 */
export const useFetchUserStories = (projectId) => {
  return useQuery({
    queryKey: [KEY_STORIES, projectId],
    queryFn: async ({ signal }) => {
      const response = await getUserStories(projectId, { signal })
      return response.data
    },
    enabled: Boolean(projectId),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
}

/**
 * Mutation hook to submit standup for AI review.
 * @returns {import("@tanstack/react-query").UseMutationResult} Mutation result with AI feedback
 */
export const useAiReview = () => {
  return useMutation({
    mutationFn: (payload) => submitAiReview(payload),
    onError: () => {
      toast({
        title: "AI Review failed",
        description: "Could not get AI feedback. Please try again.",
        variant: "destructive",
      })
    },
  })
}
