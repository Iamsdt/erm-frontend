import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  deleteDepartment,
  getDepartments,
  patchDepartment,
  postDepartment,
} from "@api/department.api"

const QUERY_KEY = "departments"

/**
 * React Query hook for fetching the department list.
 * @returns {import("@tanstack/react-query").UseQueryResult}
 */
export const useFetchDepartments = () => {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: async ({ signal }) => {
      const response = await getDepartments({ signal })
      return response.data
    },
    staleTime: 10 * 60 * 1000,
    retry: 2,
  })
}

/**
 * Mutation hook to create a department.
 * @returns {import("@tanstack/react-query").UseMutationResult}
 */
export const useCreateDepartment = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload) => postDepartment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })
}

/**
 * Mutation hook to update a department.
 * @returns {import("@tanstack/react-query").UseMutationResult}
 */
export const useUpdateDepartment = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...payload }) => patchDepartment(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })
}

/**
 * Mutation hook to delete a department.
 * @returns {import("@tanstack/react-query").UseMutationResult}
 */
export const useDeleteDepartment = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id) => deleteDepartment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })
}
