import { useQuery } from "@tanstack/react-query"

import { getHolidays } from "@api/holidays.api"

/**
 * React Query hook to fetch public holidays.
 * @returns {import("@tanstack/react-query").UseQueryResult} Query result with holidays
 */
export const useFetchHolidays = () => {
  return useQuery({
    queryKey: ["holidays"],
    queryFn: getHolidays,
    staleTime: 24 * 60 * 60 * 1000,
  })
}
