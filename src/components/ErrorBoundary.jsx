import { useMemo } from "react"
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary"

import { reportError } from "@/lib/utils/error-handler"
import ErrorPage from "@/pages/misc/error-found"

/**
 * Error Boundary Component
 *
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of crashing.
 *
 * Uses react-error-boundary library for modern functional component API.
 * (The library uses a class component internally, but we use it functionally)
 *
 * Usage:
 *   <ErrorBoundary>
 *     <YourComponent />
 *   </ErrorBoundary>
 */
const ErrorBoundary = ({ children }) => {
  const handleError = (error, errorInfo) => {
    // Generate unique error ID
    const errorId = `ERR-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`

    // Log error to error reporting service
    const errorData = {
      error,
      errorInfo: {
        ...errorInfo,
        componentStack: errorInfo?.componentStack,
      },
      errorId,
      componentStack: errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    }

    // Report to error monitoring service
    reportError(errorData)

    // Log to console in development
    if (import.meta.env.DEV) {
      console.error("Error caught by boundary:", error, errorInfo)
    }
  }

  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={handleError}
      onReset={() => {
        // Reset error state - the library handles this automatically
        window.location.reload()
      }}
    >
      {children}
    </ReactErrorBoundary>
  )
}

/**
 * Error Fallback Component
 * Wrapper to pass error details to our ErrorPage component
 */
const ErrorFallback = ({ error, resetErrorBoundary }) => {
  // Generate error ID once
  const errorId = useMemo(
    () => `ERR-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
    []
  )

  const errorInfo = useMemo(
    () => ({
      error: error?.message,
      stack: error?.stack,
      name: error?.name,
    }),
    [error]
  )

  return (
    <ErrorPage
      error={error}
      errorInfo={errorInfo}
      errorId={errorId}
      onReset={resetErrorBoundary}
    />
  )
}

export default ErrorBoundary
