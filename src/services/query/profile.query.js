import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  getMyProfile,
  patchMyProfile,
  postChangePassword,
} from "@api/profile.api"

const QUERY_KEY_PROFILE = "my-profile"

/**
 * React Query hook to fetch the current user's profile.
 * @returns {import("@tanstack/react-query").UseQueryResult} Query result with profile data
 */
export const useFetchMyProfile = () => {
  return useQuery({
    queryKey: [QUERY_KEY_PROFILE],
    queryFn: async ({ signal }) => {
      const response = await getMyProfile({ signal })
      return response.data
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
}

/**
 * Mutation hook to update the current user's profile.
 * Invalidates the profile query on success.
 * @returns {import("@tanstack/react-query").UseMutationResult} Mutation result
 */
export const useUpdateMyProfile = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload) => patchMyProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY_PROFILE] })
    },
  })
}

/**
 * Mutation hook to change the current user's password.
 * @returns {import("@tanstack/react-query").UseMutationResult} Mutation result
 */
export const useChangePassword = () => {
  return useMutation({
    mutationFn: (payload) => postChangePassword(payload),
  })
}
