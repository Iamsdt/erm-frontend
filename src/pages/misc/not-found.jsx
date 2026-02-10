import { useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

/**
 * NotFoundPage displays a 404 error message when a page is not found.
 * This is shown when no route matches the current URL.
 */
const NotFoundPage = () => {
  const navigate = useNavigate()

  const handleGoHome = () => {
    navigate("/")
  }

  const handleGoBack = () => {
    navigate(-1)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-lg text-center">
        <CardHeader>
          <CardTitle className="text-6xl font-bold">404</CardTitle>
          <CardDescription className="text-lg mt-4">
            Page not found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-400">
            Sorry, we couldn't find the page you're looking for.
            The page may have been moved or deleted.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center gap-2">
          <Button onClick={handleGoBack} variant="outline">
            Go Back
          </Button>
          <Button onClick={handleGoHome} variant="default">
            Go Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default NotFoundPage
