/**
 * Error Handler Utility
 *
 * Centralized error handling and reporting functionality.
 * Supports integration with error monitoring services like Sentry.
 */

/**
 * Error reporting configuration
 * Set VITE_SENTRY_DSN in .env to enable Sentry integration
 */
const ERROR_REPORTING_CONFIG = {
  enabled: !!import.meta.env.VITE_SENTRY_DSN,
  sentryDsn: import.meta.env.VITE_SENTRY_DSN || null,
  environment: import.meta.env.MODE || "development",
}

/**
 * Error storage for offline error reporting
 */
const errorQueue = []

/**
 * Reports an error to the error monitoring service
 * @param {object} errorData - Error data to report
 * @param {Error} errorData.error - The error object
 * @param {object} errorData.errorInfo - Additional error information
 * @param {string} errorData.errorId - Unique error ID
 * @param {string} errorData.componentStack - React component stack
 * @param {string} errorData.timestamp - Error timestamp
 * @param {string} errorData.userAgent - User agent string
 * @param {string} errorData.url - Current URL
 */
export const reportError = (errorData) => {
  const errorReport = {
    ...errorData,
    timestamp: errorData.timestamp || new Date().toISOString(),
    userAgent: errorData.userAgent || navigator.userAgent,
    url: errorData.url || window.location.href,
    environment: ERROR_REPORTING_CONFIG.environment,
  }

  // Log to console in development
  if (import.meta.env.DEV) {
    console.error("Error Report:", errorReport)
  }

  // Store error for potential later reporting
  errorQueue.push(errorReport)

  // If Sentry is configured, report to Sentry
  // Note: Sentry integration is currently disabled
  // To enable: install @sentry/react and uncomment the code below
  // if (ERROR_REPORTING_CONFIG.enabled && ERROR_REPORTING_CONFIG.sentryDsn) {
  //   reportToSentry(errorReport)
  // }

  // In production, you might want to send to your own API
  if (import.meta.env.PROD && errorQueue.length > 0) {
    // Optionally send to your own error tracking endpoint
    // sendToErrorEndpoint(errorReport)
  }
}

/**
 * Reports error to Sentry (if configured)
 *
 * CURRENTLY DISABLED - Sentry integration is commented out
 *
 * To enable Sentry:
 * 1. Install: npm install `@sentry/react`
 * 2. Configure: Set VITE_SENTRY_DSN in your .env file
 * 3. Uncomment the code in reportError() function
 * 4. Uncomment this function
 * @param {object} errorReport - Error report data
 */
// const reportToSentry = async (errorReport) => {
//   try {
//     const Sentry = await import("@sentry/react")
//
//     Sentry.captureException(errorReport.error, {
//       tags: {
//         errorId: errorReport.errorId,
//         environment: errorReport.environment,
//       },
//       extra: {
//         errorInfo: errorReport.errorInfo,
//         componentStack: errorReport.componentStack,
//         url: errorReport.url,
//         userAgent: errorReport.userAgent,
//       },
//       contexts: {
//         react: {
//           componentStack: errorReport.componentStack,
//         },
//       },
//     })
//   } catch (error) {
//     console.error("Failed to report to Sentry:", error)
//   }
// }

/**
 * Reports API error
 * @param {object} apiError - API error data
 * @param {string} apiError.url - API endpoint URL
 * @param {number} apiError.status - HTTP status code
 * @param {object} apiError.response - Response data
 * @param {object} apiError.request - Request data
 */
export const reportApiError = (apiError) => {
  const errorData = {
    error: new Error(`API Error: ${apiError.status || "Network Error"}`),
    errorInfo: {
      type: "API_ERROR",
      url: apiError.url,
      status: apiError.status,
      response: apiError.response?.data,
      request: {
        method: apiError.config?.method,
        url: apiError.config?.url,
        data: apiError.config?.data,
      },
    },
    errorId: `API-ERR-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
    timestamp: new Date().toISOString(),
  }

  reportError(errorData)
}

/**
 * Gets queued errors (for debugging or manual reporting)
 * @returns {Array} Array of queued errors
 */
export const getQueuedErrors = () => {
  return [...errorQueue]
}

/**
 * Clears queued errors
 */
export const clearErrorQueue = () => {
  errorQueue.length = 0
}

/**
 * Initializes global error handlers
 * Call this in main.jsx
 */
export const initGlobalErrorHandlers = () => {
  // Handle JavaScript errors
  window.addEventListener("error", (event) => {
    const errorData = {
      error: event.error || new Error(event.message),
      errorInfo: {
        type: "JAVASCRIPT_ERROR",
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      },
      errorId: `JS-ERR-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
      timestamp: new Date().toISOString(),
    }

    reportError(errorData)
  })

  // Handle unhandled promise rejections
  window.addEventListener("unhandledrejection", (event) => {
    const errorData = {
      error:
        event.reason instanceof Error
          ? event.reason
          : new Error(String(event.reason)),
      errorInfo: {
        type: "UNHANDLED_REJECTION",
        reason: event.reason,
      },
      errorId: `PROMISE-ERR-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
      timestamp: new Date().toISOString(),
    }

    reportError(errorData)

    // Prevent default browser behavior (logging to console)
    // Uncomment if you want to suppress console errors
    // event.preventDefault()
  })

  // Handle resource loading errors
  window.addEventListener(
    "error",
    (event) => {
      // Only handle resource errors (not JavaScript errors)
      if (event.target && event.target !== window) {
        const errorData = {
          error: new Error(
            `Resource loading error: ${event.target.src || event.target.href}`
          ),
          errorInfo: {
            type: "RESOURCE_ERROR",
            tagName: event.target.tagName,
            src: event.target.src || event.target.href,
          },
          errorId: `RES-ERR-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
          timestamp: new Date().toISOString(),
        }

        reportError(errorData)
      }
    },
    true // Use capture phase
  )
}
