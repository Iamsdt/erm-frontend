import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { toast } from "@/components/ui/use-toast"
import {
  getAnalytics,
  getInsights,
  getRecommendations,
  sendAiChat,
  updateRecommendation,
} from "@api/ai.api"

const KEY_INSIGHTS = "ai-insights"
const KEY_RECOMMENDATIONS = "ai-recommendations"
const KEY_ANALYTICS = "ai-analytics"

/**
 * React Query hook to fetch AI insights.
 * @returns {import("@tanstack/react-query").UseQueryResult} Query result with insights + stats
 */
export const useFetchInsights = () => {
  return useQuery({
    queryKey: [KEY_INSIGHTS],
    queryFn: async ({ signal }) => {
      const response = await getInsights({ signal })
      return response.data
    },
    staleTime: 3 * 60 * 1000,
    retry: 2,
  })
}

/**
 * React Query hook to fetch AI recommendations.
 * @returns {import("@tanstack/react-query").UseQueryResult} Query result with recommendations + stats
 */
export const useFetchRecommendations = () => {
  return useQuery({
    queryKey: [KEY_RECOMMENDATIONS],
    queryFn: async ({ signal }) => {
      const response = await getRecommendations({ signal })
      return response.data
    },
    staleTime: 3 * 60 * 1000,
    retry: 2,
  })
}

/**
 * React Query hook to fetch AI analytics (metrics, predictions, models, pipeline).
 * @returns {import("@tanstack/react-query").UseQueryResult} Query result with analytics data
 */
export const useFetchAnalytics = () => {
  return useQuery({
    queryKey: [KEY_ANALYTICS],
    queryFn: async ({ signal }) => {
      const response = await getAnalytics({ signal })
      return response.data
    },
    staleTime: 3 * 60 * 1000,
    retry: 2,
  })
}

/**
 * Mutation hook to update a recommendation status (adopt, dismiss, etc.).
 * @returns {import("@tanstack/react-query").UseMutationResult} Mutation result
 */
/**
 * Mutation hook to send a message to the AI chat assistant.
 * @returns {import("@tanstack/react-query").UseMutationResult} Mutation result with AI reply
 */
export const useAiChat = () => {
  return useMutation({
    mutationFn: (payload) => sendAiChat(payload),
  })
}

export const useUpdateRecommendation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...payload }) => updateRecommendation(id, payload),
    onSuccess: () => {
      toast({
        title: "Recommendation updated",
        description: "Recommendation status has been updated.",
      })
      queryClient.invalidateQueries({ queryKey: [KEY_RECOMMENDATIONS] })
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
