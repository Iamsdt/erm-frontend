/**
 * API Response Test Fixtures
 * 
 * Predefined API responses for mocking
 */

import { testUsers } from "./users"
import { testComments } from "./comments"

/**
 * Success responses
 */
export const successResponse = {
  status: 200,
  statusText: "OK",
  headers: {
    "content-type": "application/json",
  },
}

export const createdResponse = {
  status: 201,
  statusText: "Created",
  headers: {
    "content-type": "application/json",
  },
}

export const noContentResponse = {
  status: 204,
  statusText: "No Content",
  headers: {},
}

/**
 * Error responses
 */
export const badRequestError = {
  response: {
    status: 400,
    statusText: "Bad Request",
    data: {
      message: "Invalid request parameters",
      errors: [
        {
          field: "email",
          message: "Email is required",
        },
      ],
    },
  },
}

export const unauthorizedError = {
  response: {
    status: 401,
    statusText: "Unauthorized",
    data: {
      message: "Authentication required",
    },
  },
}

export const forbiddenError = {
  response: {
    status: 403,
    statusText: "Forbidden",
    data: {
      message: "You don't have permission to access this resource",
    },
  },
}

export const notFoundError = {
  response: {
    status: 404,
    statusText: "Not Found",
    data: {
      message: "Resource not found",
    },
  },
}

export const validationError = {
  response: {
    status: 422,
    statusText: "Unprocessable Entity",
    data: {
      message: "Validation failed",
      errors: {
        email: ["The email field is required"],
        password: ["The password must be at least 8 characters"],
      },
    },
  },
}

export const rateLimitError = {
  response: {
    status: 429,
    statusText: "Too Many Requests",
    data: {
      message: "Rate limit exceeded. Please try again later.",
      retryAfter: 60,
    },
  },
}

export const serverError = {
  response: {
    status: 500,
    statusText: "Internal Server Error",
    data: {
      message: "An unexpected error occurred",
    },
  },
}

export const networkError = {
  message: "Network Error",
  code: "ERR_NETWORK",
}

/**
 * Success data responses
 */
export const usersListResponse = {
  ...successResponse,
  data: testUsers,
}

export const userDetailResponse = {
  ...successResponse,
  data: testUsers[0],
}

export const commentsListResponse = {
  ...successResponse,
  data: testComments,
}

export const commentDetailResponse = {
  ...successResponse,
  data: testComments[0],
}

/**
 * Paginated responses
 */
export const paginatedUsersResponse = {
  ...successResponse,
  data: {
    data: testUsers,
    pagination: {
      page: 1,
      limit: 10,
      total: 50,
      totalPages: 5,
      hasNext: true,
      hasPrev: false,
    },
    meta: {
      timestamp: new Date().toISOString(),
    },
  },
}

export const paginatedCommentsResponse = {
  ...successResponse,
  data: {
    data: testComments,
    pagination: {
      page: 1,
      limit: 20,
      total: 100,
      totalPages: 5,
      hasNext: true,
      hasPrev: false,
    },
    meta: {
      timestamp: new Date().toISOString(),
    },
  },
}

/**
 * Empty responses
 */
export const emptyListResponse = {
  ...successResponse,
  data: [],
}

export const emptyPaginatedResponse = {
  ...successResponse,
  data: {
    data: [],
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
      hasNext: false,
      hasPrev: false,
    },
  },
}

/**
 * Loading states (for mocking delays)
 */
export const delayedResponse = (data, delay = 1000) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ...successResponse,
        data,
      })
    }, delay)
  })
}

export const delayedError = (error, delay = 1000) => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(error)
    }, delay)
  })
}

export default {
  // Success responses
  successResponse,
  createdResponse,
  noContentResponse,

  // Error responses
  badRequestError,
  unauthorizedError,
  forbiddenError,
  notFoundError,
  validationError,
  rateLimitError,
  serverError,
  networkError,

  // Data responses
  usersListResponse,
  userDetailResponse,
  commentsListResponse,
  commentDetailResponse,

  // Paginated responses
  paginatedUsersResponse,
  paginatedCommentsResponse,

  // Empty responses
  emptyListResponse,
  emptyPaginatedResponse,

  // Delayed responses
  delayedResponse,
  delayedError,
}
