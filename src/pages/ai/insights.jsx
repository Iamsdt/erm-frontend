import {
  ArrowLeft,
  TrendingUp,
  AlertCircle,
  Zap,
  BarChart3,
} from "lucide-react"
import { Link } from "react-router"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

/**
 * AI Insights Page - AI-powered insights and predictions
 */
const AIInsightsPage = () => {
  const insights = [
    {
      id: 1,
      title: "Team Productivity Peak",
      icon: TrendingUp,
      description:
        "Your team's productivity peaks on Tuesday and Wednesday mornings. Consider scheduling critical tasks during these times.",
      confidence: "92%",
      category: "Productivity",
      actionable: true,
    },
    {
      id: 2,
      title: "Bottleneck Detected",
      icon: AlertCircle,
      description:
        "Code review process is taking longer than usual. Average time increased by 35%. Consider pairing reviewers to speed up.",
      confidence: "88%",
      category: "Process",
      actionable: true,
    },
    {
      id: 3,
      title: "Resource Allocation Opportunity",
      icon: Zap,
      description:
        "Backend team is operating at 65% capacity. Frontend team at 95%. Recommend task rebalancing.",
      confidence: "85%",
      category: "Resources",
      actionable: true,
    },
    {
      id: 4,
      title: "Quality Trend Analysis",
      icon: BarChart3,
      description:
        "Code quality metrics improved by 22% over the last sprint. Bug detection rate up by 15%.",
      confidence: "91%",
      category: "Quality",
      actionable: false,
    },
  ]

  const getCategoryColor = (category) => {
    switch (category) {
      case "Productivity":
        return "bg-blue-100 text-blue-800"
      case "Process":
        return "bg-red-100 text-red-800"
      case "Resources":
        return "bg-yellow-100 text-yellow-800"
      case "Quality":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
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
        <h1 className="text-3xl font-bold tracking-tight">AI Insights</h1>
        <p className="mt-2 text-muted-foreground">
          Machine learning-powered insights about your team's performance and
          workflows
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">4</p>
              <p className="text-sm text-muted-foreground mt-1">
                Active Insights
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">89%</p>
              <p className="text-sm text-muted-foreground mt-1">
                Avg Confidence
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-600">3</p>
              <p className="text-sm text-muted-foreground mt-1">
                Actionable Items
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">Last 24h</p>
              <p className="text-sm text-muted-foreground mt-1">
                Update Frequency
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights Cards */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your Insights</h2>
        <div className="grid gap-4">
          {insights.map((insight) => {
            const IconComponent = insight.icon
            return (
              <Card
                key={insight.id}
                className="hover:shadow-lg transition-shadow overflow-hidden"
              >
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100">
                        <IconComponent className="h-6 w-6 text-slate-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">
                            {insight.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {insight.description}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <Badge className={getCategoryColor(insight.category)}>
                            {insight.category}
                          </Badge>
                          <p className="text-sm font-semibold text-gray-600 mt-2">
                            {insight.confidence} confident
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center gap-2 pt-4 border-t">
                        {insight.actionable && (
                          <Button size="sm" variant="default">
                            Take Action
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          Learn More
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default AIInsightsPage
