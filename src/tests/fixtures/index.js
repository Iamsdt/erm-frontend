/**
 * Test Fixtures Index
 * 
 * Central export point for all test fixtures
 */

export * from "./users"
export * from "./comments"
export * from "./api-responses"

// Re-export everything as a single object
import users from "./users"
import comments from "./comments"
import apiResponses from "./api-responses"

export default {
  ...users,
  ...comments,
  ...apiResponses,
}
