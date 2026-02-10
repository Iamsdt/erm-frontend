import { useRouteError, useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

/**
 * RouterErrorPage displays errors from React Router
 * This catches errors in loaders, actions, and route rendering
 */
const RouterErrorPage = () => {
  const error = useRouteError()
  const navigate = useNavigate()

  const handleGoHome = () => {
    navigate("/")
  }

  const handleRetry = () => {
    window.location.reload()
  }

  // Check if it's a 404 error
  const is404 = error?.status === 404

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">
            {is404 ? "404 - Page Not Found" : "Something went wrong"}
          </CardTitle>
          <CardDescription>
            {is404
              ? "The page you're looking for doesn't exist."
              : "An error occurred while loading this page."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error?.statusText && (
            <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-md">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Error: {error.statusText}
              </p>
            </div>
          )}

          {error?.message && (
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Message:
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-mono p-2 bg-gray-100 dark:bg-gray-800 rounded">
                {error.message}
              </p>
            </div>
          )}

          {import.meta.env.DEV && error?.stack && (
            <details className="mt-4">
              <summary className="text-sm font-semibold text-gray-700 dark:text-gray-300 cursor-pointer">
                Stack Trace (Development Only)
              </summary>
              <pre className="mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded text-xs overflow-auto max-h-64">
                {error.stack}
              </pre>
            </details>
          )}

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>What you can do:</strong>
            </p>
            <ul className="list-disc list-inside text-sm text-blue-700 dark:text-blue-300 mt-2 space-y-1">
              <li>Go back to the home page</li>
              <li>Try refreshing the page</li>
              <li>Contact support if the problem persists</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button onClick={handleRetry} variant="default">
            Retry
          </Button>
          <Button onClick={handleGoHome} variant="outline">
            Go Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default RouterErrorPage
