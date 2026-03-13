import { ArrowLeft, CheckCircle2, Clock, Lightbulb } from "lucide-react"
import PropTypes from "prop-types"
import { Link } from "react-router"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  useFetchRecommendations,
  useUpdateRecommendation,
} from "@query/ai.query"

// ─── Shared color tokens ────────────────────────────────────────────────────

const COLOR_RED = "bg-red-100 text-red-800"
const COLOR_ORANGE = "bg-orange-100 text-orange-800"
const COLOR_YELLOW = "bg-yellow-100 text-yellow-800"
const COLOR_GREEN = "bg-green-100 text-green-800"
const COLOR_GRAY = "bg-gray-100 text-gray-800"

// ─── Style maps ─────────────────────────────────────────────────────────────

const IMPACT_COLOR = {
  Critical: COLOR_RED,
  High: COLOR_ORANGE,
  Medium: COLOR_YELLOW,
  Low: COLOR_GREEN,
}

const EFFORT_COLOR = {
  Low: COLOR_GREEN,
  Medium: COLOR_YELLOW,
  High: COLOR_RED,
}

const STATUS_ICON = {
  completed: <CheckCircle2 className="h-5 w-5 text-green-600" />,
  "in-progress": <Clock className="h-5 w-5 text-blue-600" />,
  pending: <Lightbulb className="h-5 w-5 text-yellow-600" />,
}

// ─── Sub-components ─────────────────────────────────────────────────────────

const RecommendationSkeleton = () => (
  <Card>
    <CardContent className="pt-6 space-y-4">
      <div className="flex items-start gap-3">
        <Skeleton className="h-5 w-5 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-64" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-4 w-20" />
      </div>
    </CardContent>
  </Card>
)

const StatsGrid = ({ stats, isLoading }) => {
  const items = [
    { value: stats.total, label: "Total Recommendations", color: "" },
    { value: stats.implemented, label: "Implemented", color: "text-green-600" },
    { value: stats.inProgress, label: "In Progress", color: "text-blue-600" },
    { value: stats.potentialSavings, label: "Potential Savings", color: "" },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {items.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="pt-6">
            <div className="text-center">
              {isLoading ? (
                <Skeleton className="h-8 w-12 mx-auto mb-1" />
              ) : (
                <p className={`text-3xl font-bold ${stat.color}`}>
                  {stat.value ?? "—"}
                </p>
              )}
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

StatsGrid.propTypes = {
  stats: PropTypes.shape({
    total: PropTypes.number,
    implemented: PropTypes.number,
    inProgress: PropTypes.number,
    potentialSavings: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  isLoading: PropTypes.bool,
}

StatsGrid.defaultProps = {
  stats: {},
  isLoading: false,
}

const RecommendationCard = ({ recommendation, onAdopt, isPending }) => {
  const { status, title, description, impact, effort, saving, id } =
    recommendation
  const isCompleted = status === "completed"

  return (
    <Card
      key={id}
      className={`hover:shadow-lg transition-shadow ${
        isCompleted ? "opacity-75" : ""
      }`}
    >
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              {STATUS_ICON[status] ?? STATUS_ICON.pending}
              <div>
                <h3 className="font-semibold text-lg">{title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {description}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Impact</p>
              <Badge className={IMPACT_COLOR[impact] ?? COLOR_GRAY}>
                {impact}
              </Badge>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Effort</p>
              <Badge className={EFFORT_COLOR[effort] ?? COLOR_GRAY}>
                {effort}
              </Badge>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Status</p>
              <Badge variant="outline" className="capitalize">
                {status}
              </Badge>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Savings</p>
              <p className="text-sm font-semibold">{saving}</p>
            </div>
          </div>

          <div className="flex gap-2 pt-2 border-t">
            <Button
              size="sm"
              variant="default"
              disabled={isCompleted || isPending}
              onClick={() => onAdopt(recommendation)}
            >
              {isCompleted ? "Already Done" : "Adopt"}
            </Button>
            <Button size="sm" variant="outline">
              Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

RecommendationCard.propTypes = {
  recommendation: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    status: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    impact: PropTypes.string,
    effort: PropTypes.string,
    saving: PropTypes.string,
  }).isRequired,
  onAdopt: PropTypes.func.isRequired,
  isPending: PropTypes.bool,
}

RecommendationCard.defaultProps = {
  isPending: false,
}

const RecommendationList = ({
  recommendations,
  isLoading,
  isError,
  onAdopt,
  isPending,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <RecommendationSkeleton key={index} />
        ))}
      </div>
    )
  }

  if (isError) return null

  if (recommendations.length === 0) {
    return (
      <p className="text-sm text-center text-muted-foreground py-6">
        No recommendations available yet.
      </p>
    )
  }

  return (
    <div className="space-y-4">
      {recommendations.map((rec) => (
        <RecommendationCard
          key={rec.id}
          recommendation={rec}
          onAdopt={onAdopt}
          isPending={isPending}
        />
      ))}
    </div>
  )
}

RecommendationList.propTypes = {
  recommendations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    })
  ),
  isLoading: PropTypes.bool,
  isError: PropTypes.bool,
  onAdopt: PropTypes.func.isRequired,
  isPending: PropTypes.bool,
}

RecommendationList.defaultProps = {
  recommendations: [],
  isLoading: false,
  isError: false,
  isPending: false,
}

// ─── Main page ──────────────────────────────────────────────────────────────

/**
 * AI Recommendations Page — AI-generated process improvement recommendations.
 */
const AIRecommendationsPage = () => {
  const { data, isLoading, isError } = useFetchRecommendations()
  const updateMutation = useUpdateRecommendation()

  const recommendations = data?.recommendations ?? []
  const stats = data?.stats ?? {}

  const handleAdopt = (rec) => {
    if (rec.status === "completed") return
    updateMutation.mutate({
      id: rec.id,
      status: "in-progress",
      adopted: 1,
    })
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
        <h1 className="text-3xl font-bold tracking-tight">
          AI Recommendations
        </h1>
        <p className="mt-2 text-muted-foreground">
          Smart recommendations to optimize your team&apos;s processes and
          improve productivity
        </p>
      </div>

      {isError && (
        <p className="text-sm text-center text-destructive py-6">
          Failed to load recommendations. Please try again.
        </p>
      )}

      <StatsGrid stats={stats} isLoading={isLoading} />

      <RecommendationList
        recommendations={recommendations}
        isLoading={isLoading}
        isError={isError}
        onAdopt={handleAdopt}
        isPending={updateMutation.isPending}
      />
    </div>
  )
}

export default AIRecommendationsPage
