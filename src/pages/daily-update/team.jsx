import { ArrowLeft, MessageSquare } from "lucide-react"
import { Link } from "react-router"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useFetchTeamUpdates } from "@query/daily-update.query"

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

const MemberCardSkeleton = () => (
  <Card>
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
    </CardHeader>
    <CardContent>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-3/4 mt-1" />
    </CardContent>
  </Card>
)

/**
 * Team Updates Page — view all team member updates across departments.
 */
const TeamUpdatesPage = () => {
  const { data, isLoading, isError } = useFetchTeamUpdates()
  const teams = data?.teams ?? []

  return (
    <div className="space-y-6 p-6">
      <Button variant="ghost" asChild>
        <Link to="/daily-update">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Daily Updates
        </Link>
      </Button>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Team Updates</h1>
        <p className="mt-2 text-muted-foreground">
          Real-time updates from your team members across all departments
        </p>
      </div>

      {isError && (
        <p className="text-sm text-center text-destructive py-6">
          Failed to load team updates. Please try again.
        </p>
      )}

      {isLoading && (
        <div className="space-y-6">
          {Array.from({ length: 2 }).map((_, teamIndex) => (
            // eslint-disable-next-line react/no-array-index-key
            <div key={teamIndex} className="space-y-4">
              <Skeleton className="h-6 w-40" />
              <div className="grid gap-4 md:grid-cols-2">
                {Array.from({ length: 2 }).map((__, memberIndex) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <MemberCardSkeleton key={memberIndex} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && !isError && teams.length === 0 && (
        <p className="text-sm text-center text-muted-foreground py-6">
          No team updates available.
        </p>
      )}

      {!isLoading && !isError && (
        <div className="space-y-6">
          {teams.map((team) => (
            <div key={team.id} className="space-y-4">
              <div className="border-b pb-2">
                <h2 className="text-xl font-semibold text-blue-600">
                  {team.name}
                </h2>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {team.members.map((member) => (
                  <Card
                    key={member.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-white flex items-center justify-center font-bold">
                            {member.avatar}
                          </div>
                          <div>
                            <p className="font-semibold text-sm">
                              {member.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {member.role}
                            </p>
                          </div>
                        </div>
                        <Badge className={member.statusColor}>
                          {member.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        {member.update}
                      </p>
                      <div className="flex items-center justify-between pt-2 border-t">
                        <span className="text-xs text-muted-foreground">
                          {formatRelativeTime(member.submittedAt)}
                        </span>
                        <Button variant="ghost" size="sm">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TeamUpdatesPage
