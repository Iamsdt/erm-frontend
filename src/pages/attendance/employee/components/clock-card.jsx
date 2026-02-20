import PropTypes from "prop-types"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

// ─── Helpers ──────────────────────────────────────────────────────────────────

const pad = (n) => String(n).padStart(2, "0")

/**
 * Formats elapsed seconds as "Xh Ym" or "Ym".
 * @param {number} seconds - Total seconds elapsed.
 * @returns {string} Human-readable duration.
 */
const formatElapsed = (seconds) => {
  if (!seconds || seconds <= 0) return "0m"
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) return `${h}h ${pad(m)}m`
  return `${m}m`
}

/**
 * Formats total minutes as "Xh Ym".
 * @param {number} minutes - Total minutes worked.
 * @returns {string} Human-readable duration.
 */
const formatMinutes = (minutes) => {
  if (!minutes || minutes <= 0) return "0m"
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h > 0) return `${h}h ${pad(m)}m`
  return `${m}m`
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/** @param {{ elapsed: number, clockedInAt: string|null, willAutoExpire: boolean, isMutating: boolean, onClockOut: () => void }} props - Sub-component props. */
const ClockedInBody = ({
  elapsed,
  clockedInAt,
  willAutoExpire,
  isMutating,
  onClockOut,
}) => {
  const handleClockOut = () => onClockOut()
  return (
    <>
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-full shrink-0 bg-emerald-500 animate-pulse" />
        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
          {clockedInAt ? `Clocked in since ${clockedInAt}` : "Clocked In"}
        </span>
        {willAutoExpire && (
          <Badge className="ml-auto bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30">
            Expiring soon
          </Badge>
        )}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-extrabold tabular-nums">
          {formatElapsed(elapsed)}
        </span>
        <span className="text-sm text-muted-foreground">elapsed today</span>
      </div>
      <Button
        variant="destructive"
        size="lg"
        className="w-full text-base"
        onClick={handleClockOut}
        disabled={isMutating}
      >
        {isMutating ? "Clocking out…" : "🔴  Clock Out"}
      </Button>
    </>
  )
}

ClockedInBody.propTypes = {
  elapsed: PropTypes.number.isRequired,
  clockedInAt: PropTypes.string,
  willAutoExpire: PropTypes.bool,
  isMutating: PropTypes.bool.isRequired,
  onClockOut: PropTypes.func.isRequired,
}

ClockedInBody.defaultProps = {
  clockedInAt: null,
  willAutoExpire: false,
}

/** @param {{ todayMinutes: number, isMutating: boolean, onClockIn: () => void }} props - Sub-component props. */
const ClockedOutBody = ({ todayMinutes, isMutating, onClockIn }) => {
  const handleClockIn = () => onClockIn()
  return (
    <>
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-full shrink-0 bg-muted-foreground/40" />
        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
          Not Clocked In
        </span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-extrabold tabular-nums">
          {formatMinutes(todayMinutes)}
        </span>
        <span className="text-sm text-muted-foreground">
          {todayMinutes > 0 ? "worked today" : "no sessions today"}
        </span>
      </div>
      <Button
        size="lg"
        className="w-full text-base bg-emerald-600 hover:bg-emerald-700"
        onClick={handleClockIn}
        disabled={isMutating}
      >
        {isMutating ? "Clocking in…" : "🟢  Clock In"}
      </Button>
    </>
  )
}

ClockedOutBody.propTypes = {
  todayMinutes: PropTypes.number.isRequired,
  isMutating: PropTypes.bool.isRequired,
  onClockIn: PropTypes.func.isRequired,
}

/**
 * Derives display state from raw status data object.
 * @param {object|null} status - Raw status from useAttendanceStatus().
 * @returns {{ isClocked: boolean, elapsed: number, todayMinutes: number, clockedInAt: string|null, willAutoExpire: boolean }} Derived state.
 */
const deriveState = (status) => {
  if (!status) {
    return {
      isClocked: false,
      elapsed: 0,
      todayMinutes: 0,
      clockedInAt: null,
      willAutoExpire: false,
    }
  }

  const clockedInAt = status.clockedInAt
    ? new Date(status.clockedInAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null

  return {
    isClocked: status.isClocked ?? false,
    elapsed: status.elapsedSeconds ?? 0,
    todayMinutes: status.todayTotalMinutes ?? 0,
    clockedInAt,
    willAutoExpire: status.willAutoExpire ?? false,
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * ClockCard — the primary clock-in/out widget for the employee attendance page.
 * @param {{ status: object, isLoading: boolean, onClockIn: () => void, onClockOut: () => void, isMutating: boolean }} props - Component props.
 */
const ClockCard = ({
  status,
  isLoading,
  onClockIn,
  onClockOut,
  isMutating,
}) => {
  const handleClockIn = () => onClockIn()
  const handleClockOut = () => onClockOut()

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 flex flex-col gap-4">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-4 w-24" />
        </CardContent>
      </Card>
    )
  }

  const { isClocked, elapsed, todayMinutes, clockedInAt, willAutoExpire } =
    deriveState(status)

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex flex-col gap-4">
          {isClocked ? (
            <ClockedInBody
              elapsed={elapsed}
              clockedInAt={clockedInAt}
              willAutoExpire={willAutoExpire}
              isMutating={isMutating}
              onClockOut={handleClockOut}
            />
          ) : (
            <ClockedOutBody
              todayMinutes={todayMinutes}
              isMutating={isMutating}
              onClockIn={handleClockIn}
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}

ClockCard.propTypes = {
  status: PropTypes.shape({
    isClocked: PropTypes.bool,
    clockedInAt: PropTypes.string,
    elapsedSeconds: PropTypes.number,
    expiresInSeconds: PropTypes.number,
    willAutoExpire: PropTypes.bool,
    todayTotalMinutes: PropTypes.number,
  }),
  isLoading: PropTypes.bool.isRequired,
  onClockIn: PropTypes.func.isRequired,
  onClockOut: PropTypes.func.isRequired,
  isMutating: PropTypes.bool,
}

ClockCard.defaultProps = {
  status: null,
  isMutating: false,
}

export default ClockCard
