import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { toast } from "@/components/ui/use-toast"
import {
  deletePolicy,
  getPolicies,
  getPolicy,
  patchPolicy,
  postPolicy,
} from "@api/policy.api"

const QUERY_KEY_POLICIES = "policies-list"
const QUERY_KEY_POLICY_DETAIL = "policy-detail"
const ERROR_DESCRIPTION = "Something went wrong. Please try again."

/**
 * React Query hook to fetch all policies.
 * @returns {import("@tanstack/react-query").UseQueryResult} Query result with policies array
 */
export const useFetchPolicies = () => {
  return useQuery({
    queryKey: [QUERY_KEY_POLICIES],
    queryFn: async ({ signal }) => {
      const response = await getPolicies({ signal })
      return response.data
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
}

/**
 * React Query hook to fetch a single policy by ID.
 * @param {string|number} id - Policy ID
 * @returns {import("@tanstack/react-query").UseQueryResult} Query result with policy data
 */
export const useFetchPolicy = (id) => {
  return useQuery({
    queryKey: [QUERY_KEY_POLICY_DETAIL, id],
    queryFn: async ({ signal }) => {
      const response = await getPolicy(id, { signal })
      return response.data
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
    enabled: Boolean(id),
  })
}

/**
 * Mutation hook to create a new policy.
 * @returns {import("@tanstack/react-query").UseMutationResult} Mutation result
 */
export const useCreatePolicy = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload) => postPolicy(payload),
    onSuccess: () => {
      toast({
        title: "Policy created",
        description: "New policy has been created.",
      })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY_POLICIES] })
    },
    onError: () => {
      toast({
        title: "Error",
        description: ERROR_DESCRIPTION,
        variant: "destructive",
      })
    },
  })
}

/**
 * Mutation hook to update an existing policy.
 * @returns {import("@tanstack/react-query").UseMutationResult} Mutation result
 */
export const useUpdatePolicy = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...payload }) => patchPolicy(id, payload),
    onSuccess: (_, { id }) => {
      toast({
        title: "Policy updated",
        description: "Policy has been updated.",
      })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY_POLICIES] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY_POLICY_DETAIL, id] })
    },
    onError: () => {
      toast({
        title: "Error",
        description: ERROR_DESCRIPTION,
        variant: "destructive",
      })
    },
  })
}

/**
 * Mutation hook to delete a policy.
 * @returns {import("@tanstack/react-query").UseMutationResult} Mutation result
 */
export const useDeletePolicy = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id) => deletePolicy(id),
    onSuccess: () => {
      toast({
        title: "Policy deleted",
        description: "Policy has been removed.",
      })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY_POLICIES] })
    },
    onError: () => {
      toast({
        title: "Error",
        description: ERROR_DESCRIPTION,
        variant: "destructive",
      })
    },
  })
}
