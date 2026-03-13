import { ArrowLeft, TrendingDown, TrendingUp } from "lucide-react"
import PropTypes from "prop-types"
import { Link } from "react-router"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useFetchAnalytics } from "@query/ai.query"

/**
 * Formats an ISO timestamp to a relative time string.
 * @param {string} iso - ISO 8601 timestamp
 * @returns {string} Relative time (e.g. "2h ago")
 */
const formatRelativeTime = (iso) => {
  const diffMs = Date.now() - new Date(iso).getTime()
  const minutes = Math.floor(diffMs / 60_000)
  if (minutes < 1) return "Just now"
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

const SKELETON_METRICS_COUNT = 4
const SKELETON_PREDICTIONS_COUNT = 3
const SKELETON_MODELS_COUNT = 4

/**
 * Renders the Performance Metrics grid with loading skeletons.
 */
const MetricsSection = ({ metrics, isLoading }) => (
  <div>
    <h2 className="text-xl font-semibold mb-4">Performance Metrics</h2>
    <div className="grid gap-4 md:grid-cols-4">
      {isLoading
        ? Array.from({ length: SKELETON_METRICS_COUNT }).map((_, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <Card key={index}>
              <CardContent className="pt-6 space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-7 w-32" />
                <Skeleton className="h-3 w-20" />
              </CardContent>
            </Card>
          ))
        : metrics.map((metric) => (
            <Card key={metric.title}>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {metric.title}
                  </p>
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
                          metric.positive ? "text-green-600" : "text-red-600"
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
)

MetricsSection.propTypes = {
  metrics: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      metric: PropTypes.string.isRequired,
      trend: PropTypes.string.isRequired,
      positive: PropTypes.bool.isRequired,
    })
  ).isRequired,
  isLoading: PropTypes.bool.isRequired,
}

/**
 * Renders the AI Predictions grid with loading skeletons.
 */
const PredictionsSection = ({ predictions, isLoading }) => (
  <div>
    <h2 className="text-xl font-semibold mb-4">AI Predictions</h2>
    <div className="grid gap-4 md:grid-cols-3">
      {isLoading
        ? Array.from({ length: SKELETON_PREDICTIONS_COUNT }).map((_, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <Card key={index} className="border-blue-200 bg-blue-50">
              <CardHeader className="pb-3">
                <Skeleton className="h-4 w-40" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-3 w-full" />
              </CardContent>
            </Card>
          ))
        : predictions.map((prediction) => (
            <Card key={prediction.title} className="border-blue-200 bg-blue-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{prediction.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Prediction
                  </p>
                  <p className="text-lg font-bold text-blue-600">
                    {prediction.prediction}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Confidence Level
                  </p>
                  <Badge className="bg-blue-100 text-blue-800">
                    {prediction.confidence}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground italic">
                  {prediction.details}
                </p>
              </CardContent>
            </Card>
          ))}
    </div>
  </div>
)

PredictionsSection.propTypes = {
  predictions: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      prediction: PropTypes.string.isRequired,
      confidence: PropTypes.string.isRequired,
      details: PropTypes.string.isRequired,
    })
  ).isRequired,
  isLoading: PropTypes.bool.isRequired,
}

/**
 * Renders the Active ML Models list with loading skeletons.
 */
const MLModelsSection = ({ mlModels, isLoading }) => (
  <div>
    <h2 className="text-xl font-semibold mb-4">Active ML Models</h2>
    <div className="space-y-3">
      {isLoading
        ? Array.from({ length: SKELETON_MODELS_COUNT }).map((_, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <Card key={index}>
              <CardContent className="pt-6 flex items-center justify-between">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="h-4 w-20" />
              </CardContent>
            </Card>
          ))
        : mlModels.map((model) => (
            <Card key={model.name}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-semibold">{model.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Trained on {model.dataPoints} &bull; Updated{" "}
                      {formatRelativeTime(model.lastUpdate)}
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
)

MLModelsSection.propTypes = {
  mlModels: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      dataPoints: PropTypes.string.isRequired,
      lastUpdate: PropTypes.string.isRequired,
      accuracy: PropTypes.string.isRequired,
    })
  ).isRequired,
  isLoading: PropTypes.bool.isRequired,
}

/**
 * Renders the Data Pipeline dark gradient card.
 */
const PipelineStatus = ({ pipeline }) => (
  <Card className="bg-gradient-to-r from-slate-900 to-slate-800 text-white border-0">
    <CardHeader>
      <CardTitle>Data Pipeline Status</CardTitle>
    </CardHeader>
    <CardContent className="grid gap-4 md:grid-cols-4">
      <div>
        <p className="text-3xl font-bold">{pipeline.recordsPerHour ?? "—"}</p>
        <p className="text-sm text-gray-300 mt-1">Data Records/Hour</p>
      </div>
      <div>
        <p className="text-3xl font-bold">{pipeline.uptime ?? "—"}</p>
        <p className="text-sm text-gray-300 mt-1">Uptime</p>
      </div>
      <div>
        <p className="text-3xl font-bold">
          {pipeline.avgProcessingMs ?? "—"}ms
        </p>
        <p className="text-sm text-gray-300 mt-1">Avg Processing Time</p>
      </div>
      <div>
        <p className="text-3xl font-bold">{pipeline.dataQuality ?? "—"}</p>
        <p className="text-sm text-gray-300 mt-1">Data Quality</p>
      </div>
    </CardContent>
  </Card>
)

PipelineStatus.propTypes = {
  pipeline: PropTypes.shape({
    recordsPerHour: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    uptime: PropTypes.string,
    avgProcessingMs: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    dataQuality: PropTypes.string,
  }).isRequired,
}

const BackToAIHub = () => (
  <Button variant="ghost" asChild>
    <Link to="/ai">
      <ArrowLeft className="mr-2 h-4 w-4" />
      Back to AI Hub
    </Link>
  </Button>
)

const parseAnalyticsData = (data) => ({
  metrics: data?.metrics ?? [],
  predictions: data?.predictions ?? [],
  mlModels: data?.mlModels ?? [],
  pipeline: data?.pipeline ?? {},
})

/**
 * AI Analytics Page — advanced machine learning analytics.
 */
const AIAnalyticsPage = () => {
  const { data, isLoading, isError } = useFetchAnalytics()
  const { metrics, predictions, mlModels, pipeline } = parseAnalyticsData(data)

  if (isError) {
    return (
      <div className="space-y-6 p-6">
        <BackToAIHub />
        <p className="text-sm text-center text-destructive py-6">
          Failed to load analytics. Please try again.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <BackToAIHub />

      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Analytics</h1>
        <p className="mt-2 text-muted-foreground">
          Advanced machine learning analytics for data-driven decision making
        </p>
      </div>

      <MetricsSection metrics={metrics} isLoading={isLoading} />
      <PredictionsSection predictions={predictions} isLoading={isLoading} />
      <MLModelsSection mlModels={mlModels} isLoading={isLoading} />

      {!isLoading && <PipelineStatus pipeline={pipeline} />}
    </div>
  )
}

export default AIAnalyticsPage
