import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { toast } from "@/components/ui/use-toast"
import {
  deleteDepartment,
  getDepartments,
  patchDepartment,
  postDepartment,
} from "@api/department.api"

const QUERY_KEY = "departments"
const MUTATION_ERROR_DESCRIPTION = "Something went wrong. Please try again."

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
      toast({
        title: "Department created",
        description: "New department has been created.",
      })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
    onError: () => {
      toast({
        title: "Error",
        description: MUTATION_ERROR_DESCRIPTION,
        variant: "destructive",
      })
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
      toast({
        title: "Department updated",
        description: "Department has been updated.",
      })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
    onError: () => {
      toast({
        title: "Error",
        description: MUTATION_ERROR_DESCRIPTION,
        variant: "destructive",
      })
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
      toast({
        title: "Department deleted",
        description: "Department has been removed.",
      })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
    onError: () => {
      toast({
        title: "Error",
        description: MUTATION_ERROR_DESCRIPTION,
        variant: "destructive",
      })
    },
  })
}
