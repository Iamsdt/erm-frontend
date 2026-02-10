import { useQuery } from "@tanstack/react-query"

import { getComments } from "@api/comments.api"

/**
 * Fetch comments with automatic request cancellation
 * React Query automatically cancels the request if:
 * - The component unmounts
 * - The query is refetched before the previous request completes
 * - The query key changes
 */
export const useFetchComments = () => {
  return useQuery({
    queryKey: ["comments"],
    queryFn: async ({ signal }) => {
      // Pass the signal from React Query to the API call
      // This enables automatic request cancellation
      const response = await getComments({ signal })
      return response.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    // Additional options for better UX
    retry: 3, // Retry failed requests 3 times
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  })
}
