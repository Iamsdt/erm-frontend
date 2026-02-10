import ct from "@constants/"

import api from "./index"

/**
 * Fetches comments from the API.
 *
 * Makes a GET request to the comments endpoint defined in the constants.
 * @async
 * @function
 * @param {Object} options - Request options
 * @param {AbortSignal} options.signal - AbortSignal for request cancellation
 * @returns {Promise} The response from the API containing the comments data.
 */
export const getComments = async (options = {}) => {
  const { signal } = options

  const config = {
    headers: {
      "Content-Type": "application/json",
    },
    signal, // Pass the abort signal to axios
  }
  return api.get(ct.api.comment.comment, config)
}
