import { ArrowLeft, Flame, MessageSquare, Send, Users } from "lucide-react"
import PropTypes from "prop-types"
import { useState } from "react"
import { Link } from "react-router"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { useFetchStandups, useSubmitStandup } from "@query/daily-update.query"

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

// ─── Streak Banner ───────────────────────────────────────────────────────────

/**
 * StreakBanner — displays the user's consecutive standup submission streak.
 */
const StreakBanner = ({ streak }) => {
  if (!streak || streak <= 0) return null

  return (
    <Card className="border-0 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
      <CardContent className="flex items-center gap-3 p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/40">
          <Flame className="h-5 w-5 text-amber-600 dark:text-amber-400" />
        </div>
        <div>
          <p className="text-base font-bold">{streak} day streak</p>
          <p className="text-sm text-muted-foreground">
            Keep the momentum going!
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

StreakBanner.propTypes = {
  streak: PropTypes.number,
}

StreakBanner.defaultProps = {
  streak: 0,
}

// ─── Team Completion Bar ─────────────────────────────────────────────────────

/**
 * TeamCompletionBar — segmented progress showing how many team members submitted today.
 */
const TeamCompletionBar = ({ submitted, total, completionPercent }) => {
  if (!total || total <= 0) return null

  return (
    <Card className="border-0 bg-muted/40">
      <CardContent className="p-4 space-y-2">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Users className="h-4 w-4 text-muted-foreground" />
          {submitted} of {total} team members submitted today
        </div>
        <div className="flex gap-1">
          {Array.from({ length: total }).map((_, index) => (
            <div
              // Segment index is stable for a given total count
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              className={`h-2 flex-1 rounded-full transition-colors ${index < submitted ? "bg-emerald-500" : "bg-muted-foreground/20"}`}
            />
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Your team is {completionPercent}% synced — almost there!
        </p>
      </CardContent>
    </Card>
  )
}

TeamCompletionBar.propTypes = {
  submitted: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  completionPercent: PropTypes.number.isRequired,
}

// ─── Standup List ────────────────────────────────────────────────────────────

const StandupSkeleton = () => (
  <div className="border-l-4 border-muted pl-4 py-2 space-y-2">
    <Skeleton className="h-4 w-32" />
    <Skeleton className="h-3 w-24" />
    <Skeleton className="h-3 w-64" />
  </div>
)

/**
 * Renders the list of team standups with loading, error, and empty states.
 */
const TeamStandupsList = ({ updates, isLoading, isError }) => {
  if (isError) {
    return (
      <p className="text-sm text-center text-destructive py-4">
        Failed to load standups. Please try again.
      </p>
    )
  }

  if (isLoading) {
    return Array.from({ length: 3 }).map((_, index) => (
      // eslint-disable-next-line react/no-array-index-key
      <StandupSkeleton key={index} />
    ))
  }

  if (updates.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
          <MessageSquare className="h-7 w-7 text-blue-600 dark:text-blue-400" />
        </div>
        <p className="text-base font-semibold">
          Be the first to share today&apos;s progress
        </p>
        <p className="mx-auto mt-2 max-w-xs text-sm text-muted-foreground">
          Your team is waiting to hear from you. A quick update keeps everyone
          aligned.
        </p>
      </div>
    )
  }

  return updates.map((update) => (
    <div key={update.id} className="border-l-4 border-blue-500 pl-4 py-2">
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="font-semibold">{update.name}</p>
          <p className="text-sm text-muted-foreground">{update.role}</p>
        </div>
        <Badge variant="outline" className="text-xs">
          {formatRelativeTime(update.submittedAt)}
        </Badge>
      </div>
      <div className="space-y-2 text-sm">
        <p>
          <span className="font-medium">Today:</span> {update.today}
        </p>
        <p>
          <span className="font-medium">Blockers:</span>{" "}
          {update.blockers === "None" ? (
            <Badge variant="outline" className="ml-1 bg-green-50">
              None
            </Badge>
          ) : (
            <span className="text-red-600">{update.blockers}</span>
          )}
        </p>
      </div>
    </div>
  ))
}

TeamStandupsList.propTypes = {
  updates: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
      today: PropTypes.string.isRequired,
      blockers: PropTypes.string.isRequired,
      submittedAt: PropTypes.string.isRequired,
    })
  ).isRequired,
  isLoading: PropTypes.bool.isRequired,
  isError: PropTypes.bool.isRequired,
}

// ─── Standup Form Card ───────────────────────────────────────────────────────

/**
 * StandupFormCard — the form to submit a quick standup update.
 */
const StandupFormCard = ({ standup, onChange, onSubmit, isPending }) => (
  <Card className="lg:col-span-1">
    <CardHeader>
      <CardTitle className="text-lg">Your Standup</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div>
        <label htmlFor="standup-input" className="text-sm font-medium">
          What did you accomplish today?
        </label>
        <Textarea
          id="standup-input"
          placeholder="Share your progress..."
          value={standup}
          onChange={(event) => onChange(event.target.value)}
          className="mt-2"
          rows={6}
        />
      </div>
      <Button
        onClick={onSubmit}
        disabled={!standup.trim() || isPending}
        className="w-full"
      >
        <Send className="mr-2 h-4 w-4" />
        {isPending ? "Submitting..." : "Submit Standup"}
      </Button>
    </CardContent>
  </Card>
)

StandupFormCard.propTypes = {
  standup: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isPending: PropTypes.bool.isRequired,
}

// ─── Data Derivation ─────────────────────────────────────────────────────────

const DATE_FORMAT_OPTIONS = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
}

const EMPTY_STANDUP_DATA = {
  teamUpdates: [],
  streak: 0,
  teamTotalMembers: 0,
  teamSubmittedCount: 0,
  teamCompletionPercent: 0,
}

/**
 * Derives display values from the standups API response.
 * @param {object|null} data - Raw API response.
 * @returns {object} Derived standup page data.
 */
const deriveStandupData = (data) => {
  if (!data) return EMPTY_STANDUP_DATA
  return {
    teamUpdates: data.standups || [],
    streak: data.streak || 0,
    teamTotalMembers: data.teamTotalMembers || 0,
    teamSubmittedCount: data.teamSubmittedCount || 0,
    teamCompletionPercent: data.teamCompletionPercent || 0,
  }
}

// ─── Gamification Banners ─────────────────────────────────────────────────────

/**
 * GamificationBanners — streak and team completion banners shown when data is loaded.
 */
const GamificationBanners = ({ standupData }) => (
  <div className="grid gap-4 sm:grid-cols-2">
    <StreakBanner streak={standupData.streak} />
    <TeamCompletionBar
      submitted={standupData.teamSubmittedCount}
      total={standupData.teamTotalMembers}
      completionPercent={standupData.teamCompletionPercent}
    />
  </div>
)

GamificationBanners.propTypes = {
  standupData: PropTypes.shape({
    streak: PropTypes.number.isRequired,
    teamSubmittedCount: PropTypes.number.isRequired,
    teamTotalMembers: PropTypes.number.isRequired,
    teamCompletionPercent: PropTypes.number.isRequired,
  }).isRequired,
}

// ─── Main Page ───────────────────────────────────────────────────────────────

/**
 * Daily Standup Page — team members share their daily progress.
 */
const DailyStandupPage = () => {
  const [standup, setStandup] = useState("")
  const { data, isLoading, isError } = useFetchStandups()
  const submitMutation = useSubmitStandup()

  const standupData = deriveStandupData(data)

  const handleSubmit = () => {
    submitMutation.mutate(
      { today: standup, blockers: "None" },
      { onSuccess: () => setStandup("") }
    )
  }

  const dateLabel = new Date().toLocaleDateString("en-US", DATE_FORMAT_OPTIONS)

  return (
    <div className="space-y-6 p-6">
      <Button variant="ghost" asChild>
        <Link to="/daily-update">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Daily Updates
        </Link>
      </Button>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Daily Standup</h1>
        <p className="mt-2 text-muted-foreground">{dateLabel}</p>
      </div>

      {!isLoading && <GamificationBanners standupData={standupData} />}

      <div className="grid gap-6 lg:grid-cols-3">
        <StandupFormCard
          standup={standup}
          onChange={setStandup}
          onSubmit={handleSubmit}
          isPending={submitMutation.isPending}
        />

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Team Standups</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <TeamStandupsList
              updates={standupData.teamUpdates}
              isLoading={isLoading}
              isError={isError}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default DailyStandupPage
