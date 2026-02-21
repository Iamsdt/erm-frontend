import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, TrendingUp, TrendingDown } from "lucide-react"
import { Link } from "react-router"

/**
 * AI Analytics Page - Advanced machine learning analytics
 */
const AIAnalyticsPage = () => {
  const metrics = [
    {
      title: "Team Velocity",
      value: "42 points/sprint",
      trend: "+8%",
      positive: true,
      metric: "last sprint vs average",
    },
    {
      title: "Code Quality Index",
      value: "8.7/10",
      trend: "+2.1%",
      positive: true,
      metric: "based on bug density",
    },
    {
      title: "Delivery Reliability",
      value: "94%",
      trend: "+3%",
      positive: true,
      metric: "on-time delivery rate",
    },
    {
      title: "Team Satisfaction",
      value: "4.5/5",
      trend: "-0.2%",
      positive: false,
      metric: "from weekly surveys",
    },
  ]

  const predictions = [
    {
      title: "Sprint 4 Velocity Prediction",
      prediction: "45-48 points",
      confidence: "91%",
      details:
        "Based on current burn-down rate and historical velocity patterns",
    },
    {
      title: "Bug Count Forecast",
      prediction: "12-15 bugs",
      confidence: "87%",
      details: "Next sprint estimated defects based on code complexity",
    },
    {
      title: "Task Completion Rate",
      prediction: "96%",
      confidence: "89%",
      details: "Predicted % of tasks completed by sprint end",
    },
  ]

  const mlModels = [
    {
      name: "Velocity Predictor",
      accuracy: "91%",
      dataPoints: "48 sprints",
      lastUpdate: "2 hours ago",
    },
    {
      name: "Bug Detection ML",
      accuracy: "87%",
      dataPoints: "1,240 bugs",
      lastUpdate: "1 hour ago",
    },
    {
      name: "Task Complexity Analyzer",
      accuracy: "89%",
      dataPoints: "5,200 tasks",
      lastUpdate: "30 mins ago",
    },
    {
      name: "Team Performance Index",
      accuracy: "85%",
      dataPoints: "2,100 data points",
      lastUpdate: "45 mins ago",
    },
  ]

  return (
    <div className="space-y-6 p-6">
      <Button variant="ghost" asChild>
        <Link to="/ai">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to AI Hub
        </Link>
      </Button>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Analytics</h1>
        <p className="mt-2 text-muted-foreground">
          Advanced machine learning analytics for data-driven decision making
        </p>
      </div>

      {/* Key Metrics */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Performance Metrics</h2>
        <div className="grid gap-4 md:grid-cols-4">
          {metrics.map((metric) => (
            <Card key={metric.title}>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{metric.title}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <p className="text-xs text-muted-foreground">
                      {metric.metric}
                    </p>
                    <div className="flex items-center gap-1">
                      {metric.positive ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                      <span
                        className={`text-sm font-semibold ${
                          metric.positive
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {metric.trend}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Predictions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">AI Predictions</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {predictions.map((pred) => (
            <Card key={pred.title} className="border-blue-200 bg-blue-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{pred.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Prediction</p>
                  <p className="text-lg font-bold text-blue-600">
                    {pred.prediction}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Confidence Level
                  </p>
                  <Badge className="bg-blue-100 text-blue-800">
                    {pred.confidence}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground italic">
                  {pred.details}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* ML Models Status */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Active ML Models</h2>
        <div className="space-y-3">
          {mlModels.map((model) => (
            <Card key={model.name}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-semibold">{model.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Trained on {model.dataPoints} • Updated {model.lastUpdate}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-green-600">
                      {model.accuracy} Accuracy
                    </p>
                    <Button size="sm" variant="outline" className="mt-2">
                      Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Data Pipeline Status */}
      <Card className="bg-gradient-to-r from-slate-900 to-slate-800 text-white border-0">
        <CardHeader>
          <CardTitle>Data Pipeline Status</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-4">
          <div>
            <p className="text-3xl font-bold">847</p>
            <p className="text-sm text-gray-300 mt-1">Data Records/Hour</p>
          </div>
          <div>
            <p className="text-3xl font-bold">99.2%</p>
            <p className="text-sm text-gray-300 mt-1">Uptime</p>
          </div>
          <div>
            <p className="text-3xl font-bold">87ms</p>
            <p className="text-sm text-gray-300 mt-1">Avg Processing Time</p>
          </div>
          <div>
            <p className="text-3xl font-bold">100%</p>
            <p className="text-sm text-gray-300 mt-1">Data Quality</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AIAnalyticsPage
