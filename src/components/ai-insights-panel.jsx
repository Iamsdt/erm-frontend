import PropTypes from "prop-types"
import { AlertCircle, Lightbulb, TrendingUp, Zap } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

/**
 * AIInsightsPanel - Displays AI-powered insights for sprint management
 */
const AIInsightsPanel = ({ insights, isLoading }) => {

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    )
  }

  if (!insights) {
    return (
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="text-sm">AI Insights Unavailable</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">
            Unable to load AI insights at this time
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Standup Summary */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Zap className="h-4 w-4 text-blue-600" />
              AI Standup Summary
            </CardTitle>
            <Badge variant="outline" className="text-xs">
              Auto-generated
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-700">{insights.standupSummary}</p>
        </CardContent>
      </Card>

      {/* Auto Estimates */}
      {insights.autoEstimates && insights.autoEstimates.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-yellow-600" />
              Auto-Estimation Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {insights.autoEstimates.map((est) => (
              <div
                key={est.taskId}
                className="flex items-start justify-between rounded-lg border p-2"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium">{est.taskId}</p>
                  <p className="text-xs text-muted-foreground">{est.reason}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">{est.suggestedHours}h</p>
                  <p className="text-xs text-green-600">
                    {(est.confidence * 100).toFixed(0)}% confident
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Risk Assessment */}
      {insights.riskAssessment && insights.riskAssessment.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              Risk Assessment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {insights.riskAssessment.map((risk) => (
              <div
                key={risk.issue}
                className="rounded-lg border border-red-200 bg-red-50 p-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-900">
                      {risk.issue}
                    </p>
                    <p className="text-xs text-red-700 mt-1">
                      {risk.recommendation}
                    </p>
                  </div>
                  <Badge
                    variant={
                      risk.severity === "high" ? "destructive" : "outline"
                    }
                    className="text-xs whitespace-nowrap"
                  >
                    {risk.severity}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {insights.recommendations && insights.recommendations.length > 0 && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              AI Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {insights.recommendations.map((rec) => (
                <li key={rec} className="flex gap-2 text-sm">
                  <span className="text-green-600 font-bold">•</span>
                  <span className="text-gray-700">{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Velocity Trend */}
      {insights.velocityTrend && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Velocity Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-1 h-12">
              {insights.velocityTrend.map((velocity, sprintIndex) => (
                <div
                  key={`velocity-${sprintIndex}`}
                  className="flex-1 bg-blue-200 rounded-t"
                  style={{
                    height: `${(velocity / Math.max(...insights.velocityTrend)) * 100}%`,
                  }}
                  title={`Sprint ${sprintIndex + 1}: ${velocity} points`}
                />
              ))}
            </div>
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>Last 4 sprints</span>
              <span>Predicted completion: {insights.predictedCompletion}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

AIInsightsPanel.propTypes = {
  insights: PropTypes.shape({
    sprintId: PropTypes.number,
    autoEstimates: PropTypes.array,
    standupSummary: PropTypes.string,
    riskAssessment: PropTypes.array,
    recommendations: PropTypes.array,
    velocityTrend: PropTypes.array,
    predictedCompletion: PropTypes.string,
  }),
  isLoading: PropTypes.bool.isRequired,
}

AIInsightsPanel.defaultProps = {
  insights: null,
}

export default AIInsightsPanel
