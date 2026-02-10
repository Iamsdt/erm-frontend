import { useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

/**
 * ErrorPage component displays a user-friendly error page
 * with error details, retry functionality, and support information
 * 
 * @param {Error} error - The error object
 * @param {object} errorInfo - Additional error information
 * @param {string} errorId - Unique error ID for tracking
 * @param {function} onReset - Callback to reset error state
 */
const ErrorPage = ({ error, errorInfo, errorId, onReset }) => {
  const navigate = useNavigate()

  const handleRetry = () => {
    if (onReset) {
      onReset()
    } else {
      // Fallback: reload the page
      window.location.reload()
    }
  }

  const handleGoHome = () => {
    navigate("/")
  }

  const handleReportError = () => {
    // Copy error details to clipboard
    const errorDetails = {
      errorId,
      message: error?.message || "Unknown error",
      stack: error?.stack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
    }

    const errorText = JSON.stringify(errorDetails, null, 2)
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(errorText).then(() => {
        alert("Error details copied to clipboard. Please contact support with this information.")
      })
    } else {
      // Fallback for browsers without clipboard API
      const textarea = document.createElement("textarea")
      textarea.value = errorText
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand("copy")
      document.body.removeChild(textarea)
      alert("Error details copied to clipboard. Please contact support with this information.")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">Something went wrong</CardTitle>
          <CardDescription>
            We're sorry, but something unexpected happened. Our team has been notified.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {errorId && (
            <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-md">
              <p className="text-sm font-mono text-gray-600 dark:text-gray-400">
                Error ID: <span className="font-bold">{errorId}</span>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                Please include this ID when contacting support
              </p>
            </div>
          )}

          {error?.message && (
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Error Message:
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-mono p-2 bg-gray-100 dark:bg-gray-800 rounded">
                {error.message}
              </p>
            </div>
          )}

          {import.meta.env.DEV && errorInfo && (
            <details className="mt-4">
              <summary className="text-sm font-semibold text-gray-700 dark:text-gray-300 cursor-pointer">
                Technical Details (Development Only)
              </summary>
              <pre className="mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded text-xs overflow-auto max-h-64">
                {JSON.stringify(errorInfo, null, 2)}
              </pre>
            </details>
          )}

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>What you can do:</strong>
            </p>
            <ul className="list-disc list-inside text-sm text-blue-700 dark:text-blue-300 mt-2 space-y-1">
              <li>Try refreshing the page</li>
              <li>Go back to the home page</li>
              <li>Contact support if the problem persists</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2">
          <Button onClick={handleRetry} variant="default">
            Try Again
          </Button>
          <Button onClick={handleGoHome} variant="outline">
            Go Home
          </Button>
          <Button onClick={handleReportError} variant="outline">
            Copy Error Details
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default ErrorPage
