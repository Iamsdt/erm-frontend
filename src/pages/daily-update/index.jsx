import { ArrowLeft } from "lucide-react"
import { Link } from "react-router"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

/**
 * Daily Update Hub - Landing page for daily updates
 */
const DailyUpdateHub = () => {
  const sections = [
    {
      title: "Daily Standup",
      description: "Share your daily progress and blockers",
      url: "/daily-update/standup",
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Team Updates",
      description: "View updates from your team members",
      url: "/daily-update/team",
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Progress Log",
      description: "Track your progress and accomplishments",
      url: "/daily-update/progress",
      color: "from-green-500 to-green-600",
    },
  ]

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" asChild>
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Daily Updates</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your team's daily progress, standups, and updates
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {sections.map((section) => (
          <Card
            key={section.title}
            className="cursor-pointer hover:shadow-lg transition-shadow"
          >
            <CardHeader
              className={`bg-gradient-to-r ${section.color} text-white`}
            >
              <CardTitle className="text-lg">{section.title}</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-sm text-muted-foreground mb-4">
                {section.description}
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link to={section.url}>Open</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default DailyUpdateHub
