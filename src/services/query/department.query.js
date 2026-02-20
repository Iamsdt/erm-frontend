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
