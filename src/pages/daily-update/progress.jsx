import { ArrowLeft, CheckCircle2, Clock, AlertCircle } from "lucide-react"
import { Link } from "react-router"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

/**
 * Progress Log Page - Track accomplishments and milestones
 */
const ProgressLogPage = () => {
  const progressEntries = [
    {
      id: 1,
      date: "Today",
      entries: [
        {
          task: "Completed sprint planning for Sprint 3",
          status: "completed",
          icon: CheckCircle2,
          time: "10:30 AM",
          details: "All team members assigned and committed to sprint goals.",
        },
        {
          task: "Fixed critical bug in payment module",
          status: "completed",
          icon: CheckCircle2,
          time: "09:15 AM",
          details: "Caused by race condition. Added mutex locks.",
        },
      ],
    },
    {
      id: 2,
      date: "Yesterday",
      entries: [
        {
          task: "Reviewed pull requests from team",
          status: "completed",
          icon: CheckCircle2,
          time: "04:45 PM",
          details: "Approved 5 PRs, requested changes on 2.",
        },
        {
          task: "Database migration testing",
          status: "in-progress",
          icon: Clock,
          time: "02:00 PM",
          details: "85% complete. Testing edge cases.",
        },
      ],
    },
    {
      id: 3,
      date: "Past Week",
      entries: [
        {
          task: "Implemented new user dashboard",
          status: "completed",
          icon: CheckCircle2,
          time: "Mar 20",
          details: "Includes analytics, notifications, and quick actions.",
        },
        {
          task: "Performance optimization",
          status: "completed",
          icon: CheckCircle2,
          time: "Mar 19",
          details: "Reduced page load time by 45%.",
        },
        {
          task: "API documentation update",
          status: "at-risk",
          icon: AlertCircle,
          time: "Mar 18",
          details: "Behind schedule. 60% complete.",
        },
      ],
    },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-50 border-l-4 border-green-500"
      case "in-progress":
        return "bg-blue-50 border-l-4 border-blue-500"
      case "at-risk":
        return "bg-yellow-50 border-l-4 border-yellow-500"
      default:
        return "bg-gray-50 border-l-4 border-gray-500"
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case "in-progress":
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
      case "at-risk":
        return <Badge className="bg-yellow-100 text-yellow-800">At Risk</Badge>
      default:
        return <Badge variant="outline">Pending</Badge>
    }
  }

  return (
    <div className="space-y-6 p-6">
      <Button variant="ghost" asChild>
        <Link to="/daily-update">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Daily Updates
        </Link>
      </Button>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Progress Log</h1>
        <p className="mt-2 text-muted-foreground">
          Track your accomplishments and milestones over time
        </p>
      </div>

      <div className="space-y-6">
        {progressEntries.map((section) => (
          <div key={section.id} className="space-y-3">
            <div className="sticky top-0 bg-background/95 backdrop-blur py-2">
              <h2 className="text-lg font-semibold text-gray-700">
                {section.date}
              </h2>
            </div>

            <div className="space-y-3 ml-4">
              {section.entries.map((entry, index) => {
                const IconComponent = entry.icon
                return (
                  <Card
                    key={index}
                    className={`${getStatusColor(entry.status)} transition-all hover:shadow-md`}
                  >
                    <CardContent className="pt-6">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <IconComponent
                            className={`h-6 w-6 ${
                              entry.status === "completed"
                                ? "text-green-600"
                                : entry.status === "in-progress"
                                  ? "text-blue-600"
                                  : "text-yellow-600"
                            }`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="font-semibold text-sm text-gray-900">
                              {entry.task}
                            </h3>
                            {getStatusBadge(entry.status)}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {entry.details}
                          </p>
                          <p className="text-xs text-gray-500">{entry.time}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProgressLogPage
