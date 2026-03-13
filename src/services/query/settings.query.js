import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { toast } from "@/components/ui/use-toast"
import { getSettings, updateSettings } from "@api/settings.api"

const QUERY_KEY = "settings"

/**
 * React Query hook to fetch user settings.
 * @returns {import("@tanstack/react-query").UseQueryResult} Query result
 */
export const useFetchSettings = () => {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: getSettings,
  })
}

/**
 * Mutation hook to update user settings.
 * @returns {import("@tanstack/react-query").UseMutationResult} Mutation result
 */
export const useUpdateSettings = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => updateSettings(data),
    onSuccess: () => {
      toast({
        title: "Settings saved",
        description: "Your preferences have been updated.",
      })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    },
  })
}
