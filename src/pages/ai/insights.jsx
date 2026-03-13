import {
  AlertCircle,
  ArrowLeft,
  BarChart3,
  TrendingUp,
  Zap,
} from "lucide-react"
import PropTypes from "prop-types"
import { Link, useNavigate } from "react-router"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import ct from "@constants/"
import { useFetchInsights } from "@query/ai.query"

// ─── Icon map (icons can't be serialized in API responses) ───────────────────

const ICON_MAP = {
  TrendingUp,
  AlertCircle,
  Zap,
  BarChart3,
}

const CATEGORY_COLOR = {
  Productivity: "bg-blue-100 text-blue-800",
  Process: "bg-red-100 text-red-800",
  Resources: "bg-yellow-100 text-yellow-800",
  Quality: "bg-green-100 text-green-800",
}

const STATS_CONFIG = [
  { key: "totalInsights", label: "Active Insights", color: "text-blue-600" },
  { key: "avgConfidence", label: "Avg Confidence", color: "text-green-600" },
  {
    key: "actionableCount",
    label: "Actionable Items",
    color: "text-yellow-600",
  },
  {
    key: "updateFrequency",
    label: "Update Frequency",
    color: "text-purple-600",
  },
]

const InsightCardSkeleton = () => (
  <Card>
    <CardContent className="pt-6">
      <div className="flex gap-4">
        <Skeleton className="h-12 w-12 rounded-lg" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      </div>
    </CardContent>
  </Card>
)

// ─── InsightStatsGrid ────────────────────────────────────────────────────────

const InsightStatsGrid = ({ stats, isLoading }) => (
  <div className="grid gap-4 md:grid-cols-4">
    {STATS_CONFIG.map((stat) => (
      <Card key={stat.label}>
        <CardContent className="pt-6">
          <div className="text-center">
            {isLoading ? (
              <Skeleton className="h-8 w-12 mx-auto mb-1" />
            ) : (
              <p className={`text-3xl font-bold ${stat.color}`}>
                {stats[stat.key] ?? "\u2014"}
              </p>
            )}
            <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
)

InsightStatsGrid.propTypes = {
  stats: PropTypes.shape({
    totalInsights: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    avgConfidence: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    actionableCount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    updateFrequency: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  isLoading: PropTypes.bool,
}

InsightStatsGrid.defaultProps = {
  stats: {},
  isLoading: false,
}

// ─── InsightCard ─────────────────────────────────────────────────────────────

const InsightCard = ({ insight }) => {
  const IconComponent = ICON_MAP[insight.icon] ?? BarChart3
  const navigate = useNavigate()

  const handleTakeAction = () => {
    navigate(ct.route.ai.RECOMMENDATIONS)
    toast({
      title: "Insight flagged",
      description: `"${insight.title}" has been added to your recommendations.`,
    })
  }

  const handleLearnMore = () => {
    navigate(ct.route.ai.ANALYTICS)
  }

  return (
    <Card className="hover:shadow-lg transition-shadow overflow-hidden">
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
                <h3 className="font-semibold text-lg">{insight.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {insight.description}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <Badge
                  className={
                    CATEGORY_COLOR[insight.category] ??
                    "bg-gray-100 text-gray-800"
                  }
                >
                  {insight.category}
                </Badge>
                <p className="text-sm font-semibold text-gray-600 mt-2">
                  {insight.confidence} confident
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 pt-4 border-t">
              {insight.actionable && (
                <Button size="sm" variant="default" onClick={handleTakeAction}>
                  Take Action
                </Button>
              )}
              <Button size="sm" variant="outline" onClick={handleLearnMore}>
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

InsightCard.propTypes = {
  insight: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    icon: PropTypes.string,
    category: PropTypes.string,
    confidence: PropTypes.string,
    actionable: PropTypes.bool,
  }).isRequired,
}

// ─── InsightsList ────────────────────────────────────────────────────────────

const InsightsList = ({ insights, isLoading, isError }) => (
  <div className="space-y-4">
    <h2 className="text-xl font-semibold">Your Insights</h2>

    {isLoading && (
      <div className="grid gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <InsightCardSkeleton key={index} />
        ))}
      </div>
    )}

    {!isLoading && !isError && insights.length === 0 && (
      <p className="text-sm text-center text-muted-foreground py-6">
        No insights available yet.
      </p>
    )}

    {!isLoading && !isError && (
      <div className="grid gap-4">
        {insights.map((insight) => (
          <InsightCard key={insight.id} insight={insight} />
        ))}
      </div>
    )}
  </div>
)

InsightsList.propTypes = {
  insights: PropTypes.arrayOf(InsightCard.propTypes.insight),
  isLoading: PropTypes.bool,
  isError: PropTypes.bool,
}

InsightsList.defaultProps = {
  insights: [],
  isLoading: false,
  isError: false,
}

// ─── AIInsightsPage ──────────────────────────────────────────────────────────

const AIInsightsPage = () => {
  const { data, isLoading, isError } = useFetchInsights()
  const insights = data?.insights ?? []
  const stats = data?.stats ?? {}

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
          Machine learning-powered insights about your team&apos;s performance
          and workflows
        </p>
      </div>

      {isError && (
        <p className="text-sm text-center text-destructive py-6">
          Failed to load insights. Please try again.
        </p>
      )}

      <InsightStatsGrid stats={stats} isLoading={isLoading} />
      <InsightsList
        insights={insights}
        isLoading={isLoading}
        isError={isError}
      />
    </div>
  )
}

export default AIInsightsPage
