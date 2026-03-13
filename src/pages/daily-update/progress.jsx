import { AlertCircle, ArrowLeft, CheckCircle2, Clock } from "lucide-react"
import { Link } from "react-router"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useFetchProgressLog } from "@query/daily-update.query"

// ─── Status helpers ──────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  completed: {
    icon: CheckCircle2,
    color: "text-green-600",
    card: "bg-green-50 border-l-4 border-green-500",
    badge: "bg-green-100 text-green-800",
    label: "Completed",
  },
  "in-progress": {
    icon: Clock,
    color: "text-blue-600",
    card: "bg-blue-50 border-l-4 border-blue-500",
    badge: "bg-blue-100 text-blue-800",
    label: "In Progress",
  },
  "at-risk": {
    icon: AlertCircle,
    color: "text-yellow-600",
    card: "bg-yellow-50 border-l-4 border-yellow-500",
    badge: "bg-yellow-100 text-yellow-800",
    label: "At Risk",
  },
}

const DEFAULT_STATUS = {
  icon: Clock,
  color: "text-gray-600",
  card: "bg-gray-50 border-l-4 border-gray-500",
  badge: "",
  label: "Pending",
}

const ProgressSkeleton = () => (
  <div className="space-y-3">
    <Skeleton className="h-5 w-24" />
    <div className="ml-4 space-y-3">
      <Skeleton className="h-24 w-full rounded-lg" />
      <Skeleton className="h-24 w-full rounded-lg" />
    </div>
  </div>
)

/**
 * Progress Log Page — track accomplishments and milestones over time.
 */
const ProgressLogPage = () => {
  const { data, isLoading, isError } = useFetchProgressLog()
  const sections = data?.sections ?? []

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

      {isError && (
        <p className="text-sm text-center text-destructive py-6">
          Failed to load progress log. Please try again.
        </p>
      )}

      {isLoading && (
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <ProgressSkeleton key={index} />
          ))}
        </div>
      )}

      {!isLoading && !isError && sections.length === 0 && (
        <p className="text-sm text-center text-muted-foreground py-6">
          No progress entries yet.
        </p>
      )}

      {!isLoading && !isError && (
        <div className="space-y-6">
          {sections.map((section) => (
            <div key={section.id} className="space-y-3">
              <div className="sticky top-0 bg-background/95 backdrop-blur py-2">
                <h2 className="text-lg font-semibold text-gray-700">
                  {section.date}
                </h2>
              </div>

              <div className="space-y-3 ml-4">
                {section.entries.map((entry) => {
                  const config = STATUS_CONFIG[entry.status] ?? DEFAULT_STATUS
                  const IconComponent = config.icon
                  return (
                    <Card
                      key={entry.id}
                      className={`${config.card} transition-all hover:shadow-md`}
                    >
                      <CardContent className="pt-6">
                        <div className="flex gap-4">
                          <div className="flex-shrink-0">
                            <IconComponent
                              className={`h-6 w-6 ${config.color}`}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h3 className="font-semibold text-sm text-gray-900">
                                {entry.task}
                              </h3>
                              <Badge className={config.badge}>
                                {config.label}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {entry.details}
                            </p>
                            <p className="text-xs text-gray-500">
                              {entry.time}
                            </p>
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
      )}
    </div>
  )
}

export default ProgressLogPage
