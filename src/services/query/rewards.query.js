import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { getMyRewards, getRewards, postReward } from "@api/rewards.api"

const QUERY_KEY_REWARDS = "rewards-list"
const QUERY_KEY_MY_REWARDS = "my-rewards"

/**
 * React Query hook to fetch all rewards (admin).
 * @returns {import("@tanstack/react-query").UseQueryResult} Query result with all rewards
 */
export const useFetchRewards = () => {
  return useQuery({
    queryKey: [QUERY_KEY_REWARDS],
    queryFn: async ({ signal }) => {
      const response = await getRewards({ signal })
      return response.data
    },
    staleTime: 3 * 60 * 1000,
    retry: 2,
  })
}

/**
 * React Query hook to fetch the current user's rewards.
 * @returns {import("@tanstack/react-query").UseQueryResult} Query result with user's rewards
 */
export const useFetchMyRewards = () => {
  return useQuery({
    queryKey: [QUERY_KEY_MY_REWARDS],
    queryFn: async ({ signal }) => {
      const response = await getMyRewards({ signal })
      return response.data
    },
    staleTime: 3 * 60 * 1000,
    retry: 2,
  })
}

/**
 * Mutation hook to grant a reward to an employee (admin only).
 * @returns {import("@tanstack/react-query").UseMutationResult} Mutation result
 */
export const useGrantReward = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload) => postReward(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY_REWARDS] })
    },
  })
}
