import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react"
import { useNavigate, useRouteError } from "react-router-dom"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

/**
 * Inline error fallback for route groups — renders inside the main layout
 * instead of replacing the entire page like RouterErrorPage.
 */
const RouteErrorFallback = () => {
  const error = useRouteError()
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-center p-8">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <AlertTriangle className="h-10 w-10 text-destructive mx-auto mb-2" />
          <CardTitle>Something went wrong</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            This section encountered an error. The rest of the app is still
            available.
          </p>
        </CardHeader>
        <CardContent>
          {import.meta.env.DEV && error?.message && (
            <pre className="text-xs p-3 bg-muted rounded overflow-auto max-h-40">
              {error.message}
            </pre>
          )}
        </CardContent>
        <CardFooter className="flex gap-2 justify-center">
          <Button
            variant="default"
            size="sm"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default RouteErrorFallback
