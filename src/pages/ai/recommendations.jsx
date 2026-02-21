import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CheckCircle2, Clock, Lightbulb } from "lucide-react"
import { Link } from "react-router"

/**
 * AI Recommendations Page - AI-generated process improvement recommendations
 */
const AIRecommendationsPage = () => {
  const recommendations = [
    {
      id: 1,
      title: "Implement Daily Standup Time Optimization",
      description:
        "Shift daily standups from 4 PM to 10 AM. Data shows team is more engaged and productive in the mornings.",
      impact: "High",
      effort: "Low",
      status: "pending",
      saving: "2.5 hours/week",
      adopted: 0,
    },
    {
      id: 2,
      title: "Code Review Pairing Program",
      description:
        "Pair senior developers with junior developers for code reviews. Will improve code quality by 18% and reduce review time.",
      impact: "High",
      effort: "Medium",
      status: "in-progress",
      saving: "4 hours/week",
      adopted: 0,
    },
    {
      id: 3,
      title: "Automate Repetitive Testing Tasks",
      description:
        "70% of manual testing can be automated. Implement test automation framework to reduce testing cycle time.",
      impact: "Critical",
      effort: "High",
      status: "pending",
      saving: "8 hours/week",
      adopted: 0,
    },
    {
      id: 4,
      title: "Team Skill Development Plan",
      description:
        "Three team members identified as having high potential for leadership roles. Recommend mentorship program.",
      impact: "Medium",
      effort: "Medium",
      status: "pending",
      saving: "Future leadership pipeline",
      adopted: 0,
    },
    {
      id: 5,
      title: "Documentation Automation",
      description:
        "Auto-generate API documentation from codebase. Reduces manual effort and keeps docs always in sync.",
      impact: "Medium",
      effort: "Low",
      status: "completed",
      saving: "3 hours/week",
      adopted: 1,
    },
  ]

  const getImpactColor = (impact) => {
    switch (impact) {
      case "Critical":
        return "bg-red-100 text-red-800"
      case "High":
        return "bg-orange-100 text-orange-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getEffortColor = (effort) => {
    switch (effort) {
      case "Low":
        return "bg-green-100 text-green-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "High":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />
      case "in-progress":
        return <Clock className="h-5 w-5 text-blue-600" />
      default:
        return <Lightbulb className="h-5 w-5 text-yellow-600" />
    }
  }

  return (
    <div className="space-y-6 p-6">
      <Button variant="ghost" asChild>
        <Link to="/ai">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to AI Hub
        </Link>
      </Button>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Recommendations</h1>
        <p className="mt-2 text-muted-foreground">
          Smart recommendations to optimize your team's processes and improve productivity
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold">5</p>
              <p className="text-sm text-muted-foreground mt-1">Total Recommendations</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">1</p>
              <p className="text-sm text-muted-foreground mt-1">Implemented</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">1</p>
              <p className="text-sm text-muted-foreground mt-1">In Progress</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold">17.5h</p>
              <p className="text-sm text-muted-foreground mt-1">Potential Savings</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations List */}
      <div className="space-y-4">
        {recommendations.map((rec) => (
          <Card
            key={rec.id}
            className={`hover:shadow-lg transition-shadow ${
              rec.status === "completed" ? "opacity-75" : ""
            }`}
          >
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    {getStatusIcon(rec.status)}
                    <div>
                      <h3 className="font-semibold text-lg">{rec.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {rec.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Impact</p>
                    <Badge className={getImpactColor(rec.impact)}>
                      {rec.impact}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Effort</p>
                    <Badge className={getEffortColor(rec.effort)}>
                      {rec.effort}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Status</p>
                    <Badge variant="outline" className="capitalize">
                      {rec.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Savings</p>
                    <p className="text-sm font-semibold">{rec.saving}</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t">
                  <Button size="sm" variant="default">
                    {rec.status === "completed" ? "Already Done" : "Adopt"}
                  </Button>
                  <Button size="sm" variant="outline">
                    Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default AIRecommendationsPage
