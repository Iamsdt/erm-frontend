import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { toast } from "@/components/ui/use-toast"
import {
  createTeam,
  deleteTeam,
  getTeams,
  removeTeamMember,
  updateTeamResponsibilities,
} from "@api/team.api"

const QUERY_KEY = "teams"
const ERROR_TITLE = "Error"
const ERROR_DESCRIPTION = "Something went wrong. Please try again."
const DESTRUCTIVE_VARIANT = "destructive"
const FIVE_MINUTES_MS = 5 * 60 * 1000

/**
 * React Query hook to fetch all teams.
 * @returns {import("@tanstack/react-query").UseQueryResult} Query result with teams
 */
export const useFetchTeams = () => {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: async ({ signal }) => {
      const response = await getTeams({ signal })
      return response.data
    },
    staleTime: FIVE_MINUTES_MS,
    retry: 2,
  })
}

/**
 * Mutation hook to create a new team.
 * @returns {import("@tanstack/react-query").UseMutationResult} Mutation result
 */
export const useCreateTeam = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload) => createTeam(payload),
    onSuccess: () => {
      toast({
        title: "Team created",
        description: "New team has been created.",
      })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
    onError: () => {
      toast({
        title: ERROR_TITLE,
        description: ERROR_DESCRIPTION,
        variant: DESTRUCTIVE_VARIANT,
      })
    },
  })
}

/**
 * Mutation hook to delete a team.
 * @returns {import("@tanstack/react-query").UseMutationResult} Mutation result
 */
export const useDeleteTeam = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (teamId) => deleteTeam(teamId),
    onSuccess: () => {
      toast({
        title: "Team deleted",
        description: "Team has been removed.",
      })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
    onError: () => {
      toast({
        title: ERROR_TITLE,
        description: ERROR_DESCRIPTION,
        variant: DESTRUCTIVE_VARIANT,
      })
    },
  })
}

/**
 * Mutation hook to remove a member from a team.
 * @returns {import("@tanstack/react-query").UseMutationResult} Mutation result
 */
export const useRemoveTeamMember = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ teamId, memberId }) => removeTeamMember(teamId, memberId),
    onSuccess: () => {
      toast({
        title: "Member removed",
        description: "Team member has been removed.",
      })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
    onError: () => {
      toast({
        title: ERROR_TITLE,
        description: ERROR_DESCRIPTION,
        variant: DESTRUCTIVE_VARIANT,
      })
    },
  })
}

/**
 * Mutation hook to update team responsibilities.
 * @returns {import("@tanstack/react-query").UseMutationResult} Mutation result
 */
export const useUpdateTeamResponsibilities = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, responsibilities }) =>
      updateTeamResponsibilities(id, responsibilities),
    onSuccess: () => {
      toast({
        title: "Roles updated",
        description: "Team responsibilities have been saved.",
      })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
    onError: () => {
      toast({
        title: ERROR_TITLE,
        description: ERROR_DESCRIPTION,
        variant: DESTRUCTIVE_VARIANT,
      })
    },
  })
}
