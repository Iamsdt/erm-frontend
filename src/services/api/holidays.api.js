import ct from "@constants/"

import api from "."

/**
 * Fetches the list of public holidays for the current year.
 * @returns {Promise} API response with holidays array
 */
export const getHolidays = async () => {
  const response = await api.get(ct.api.holidays.list)
  return response.data
}
