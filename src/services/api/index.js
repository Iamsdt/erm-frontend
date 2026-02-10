import axios from "axios"

// import { firebaseAuth } from '../lib/firebase'
// See src/docs/AUTHENTICATION_PATTERNS.md for authentication implementation examples
import { config } from "@/lib/config"
import { reportApiError } from "@/lib/utils/error-handler"

const instance = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: config.apiTimeout,
  headers: {
    "Content-Type": "application/json",
  },
})

// AbortController management for request cancellation
const pendingRequests = new Map()

/**
 * Generate a unique key for each request
 * @param {object} config - Axios request config
 * @returns {string} Unique request key
 */
const generateRequestKey = (config) => {
  const { method, url, params, data } = config
  return `${method}:${url}:${JSON.stringify(params)}:${JSON.stringify(data)}`
}

/**
 * Cancel pending request if exists
 * @param {string} requestKey - Request key
 */
const cancelPendingRequest = (requestKey) => {
  if (pendingRequests.has(requestKey)) {
    const controller = pendingRequests.get(requestKey)
    controller.abort()
    pendingRequests.delete(requestKey)
  }
}

/**
 * Cancel all pending requests
 */
export const cancelAllRequests = () => {
  pendingRequests.forEach((controller) => {
    controller.abort()
  })
  pendingRequests.clear()
}

/**
 * Get current number of pending requests
 * @returns {number}
 */
export const getPendingRequestsCount = () => pendingRequests.size

// Request interceptor with AbortController support
instance.interceptors.request.use(
  (request) => {
    // Generate request key for tracking
    const requestKey = generateRequestKey(request)

    // Cancel duplicate pending requests (optional - can be disabled)
    // Uncomment the line below to enable automatic duplicate request cancellation
    // cancelPendingRequest(requestKey)

    // Create new AbortController for this request
    const controller = new AbortController()
    request.signal = controller.signal

    // Store controller for later cancellation
    pendingRequests.set(requestKey, controller)

    // Add cleanup metadata
    request._requestKey = requestKey
    request._startTime = Date.now()

    // Add your authentication token here
    // Example: request.headers.Authorization = `Bearer ${token}`
    // See src/docs/AUTHENTICATION_PATTERNS.md for Firebase and JWT examples

    return request
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor with error handling and cleanup
instance.interceptors.response.use(
  (response) => {
    // Clean up pending request tracking
    const requestKey = response.config._requestKey
    if (requestKey) {
      pendingRequests.delete(requestKey)
    }

    // Log request duration in development
    if (config.isDevelopment && response.config._startTime) {
      const duration = Date.now() - response.config._startTime
      console.log(
        `✅ ${response.config.method.toUpperCase()} ${response.config.url} (${duration}ms)`
      )
    }

    return response
  },
  async (error) => {
    const originalRequest = error.config

    // Clean up pending request tracking
    if (originalRequest?._requestKey) {
      pendingRequests.delete(originalRequest._requestKey)
    }

    // Handle request cancellation (don't report to monitoring)
    if (axios.isCancel(error)) {
      console.log("Request cancelled:", originalRequest?.url)
      return Promise.reject(error)
    }

    // Report API error to monitoring service
    reportApiError({
      url: error.config?.url || error.request?.responseURL,
      status: error.response?.status,
      response: error.response,
      request: error.request,
      config: error.config,
    })

    // Handle specific HTTP status codes
    if (!error.response) {
      // Network error or server not reachable
      console.error("Network error:", error.message)
      // Optionally redirect to maintenance page
      // if (window.location.pathname !== '/misc/maintenance/') {
      //   window.location.href = '/misc/maintenance/'
      // }
    } else {
      const { status } = error.response

      switch (status) {
        case 400:
          // Bad Request - validation errors
          console.error("Bad request:", error.response.data)
          break

        case 401:
          // Unauthorized - token expired or invalid
          // Handle authentication - redirect to login or refresh token
          // See src/docs/AUTHENTICATION_PATTERNS.md for auth handling
          if (window.location.pathname !== "/login") {
            // Uncomment to redirect to login
            // window.location.href = "/login"
          }
          break

        case 403:
          // Forbidden - user doesn't have permission
          if (window.location.pathname !== "/misc/not-authorized/") {
            window.location.href = "/misc/not-authorized/"
          }
          break

        case 404:
          // Not Found
          console.error("Resource not found:", error.config?.url)
          break

        case 429:
          // Too Many Requests - rate limiting
          console.error("Rate limit exceeded")
          break

        case 500:
        case 502:
        case 503:
        case 504:
          // Server errors
          console.error(`Server error (${status}):`, error.response.data)
          // Optionally redirect to maintenance page
          // if (window.location.pathname !== '/misc/maintenance/') {
          //   window.location.href = '/misc/maintenance/'
          // }
          break

        default:
          console.error(`API error (${status}):`, error.response.data)
      }
    }

    return Promise.reject(error)
  }
)

// const firebaseAuthPromise = new Promise((resolve) => {
//     const unsubscribe = firebaseAuth.onAuthStateChanged((user) => {
//         unsubscribe()
//         resolve(user)
//     })
// })

// const timeoutPromise = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         reject(new Error('Firebase app initialization timed out'))
//     }, 5000) // Adjust the timeout duration as needed
// })

// instance.interceptors.request.use(async function (config) {
//     console.log('I am intercepting', config)

//     // const firebase = useContext(FirebaseContext)

//     try {
//         await Promise.race([firebaseAuthPromise, timeoutPromise]) // Wait for the Firebase app to initialize or time out
//         const idToken = (await firebaseAuth.currentUser?.getIdToken()) ?? ''
//         if (idToken.length !== 0) {
//             config.headers.Authorization = idToken
//         }
//     } catch (error) {
//         // toast.error("Session Expired, Please Login Again");
//         // window.location.href = "/login";
//         console.log('DEBUG: I am rejecting', error)
//         // throw error; // Propagate the error to the caller of the interceptor
//         return ''
//     }

//     console.log(config)

//     return config
// })

// // added interceptors to the response
// // easy to debug
// instance.interceptors.response.use(
//     (response) => {
//         console.log('api response,', response)
//         // Edit response config
//         return response
//     },
//     (error) => {
//         if (error.response === null) {
//             if (window.location.pathname !== '/misc/maintenance/') {
//                 window.location.href = '/misc/maintenance/'
//             }
//         } else if (Number(error.response?.status) === 400) {
//         } else if (Number(error.response?.status) === 401) {
//             if (window.location.pathname !== '/misc/not-authorized/') {
//                 window.location.href = '/misc/not-authorized/'
//             }
//             // window.location.href = "/misc/not-authorized/";
//             // handle 502
//         } else if (Number(error.response?.status) === 502) {
//             if (window.location.pathname !== '/misc/maintenance/') {
//                 window.location.href = '/misc/maintenance/'
//             }
//         }
//         return Promise.reject(error)
//     }
// )

export default instance
