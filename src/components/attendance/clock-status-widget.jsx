import PropTypes from "prop-types"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

/**
 * Format elapsed time in seconds to "Xh Ym" or "Ym" string.
 * @param {number} seconds - Total seconds elapsed.
 * @returns {string} Formatted duration string.
 */
const formatElapsedTime = (seconds) => {
  if (!seconds || seconds <= 0) return "0m"
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

/**
 * Format total daily minutes to "Xh Ym" string.
 * @param {number} minutes - Total minutes worked today.
 * @returns {string} Formatted duration string.
 */
const formatTotalMinutes = (minutes) => {
  if (!minutes) return "0h"
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

const ATTENDANCE_PATH = "/attendance"

/**
 * Content section when clocked in.
 */
const ClockedInContent = ({
  liveElapsed,
  willAutoExpire,
  todayTotalMinutes,
  onGoToAttendance,
}) => (
  <>
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground">Elapsed Time</p>
      <p className="text-xl font-semibold">{formatElapsedTime(liveElapsed)}</p>
    </div>
    {willAutoExpire && (
      <div className="rounded bg-amber-100 p-2 dark:bg-amber-900/20">
        <p className="text-xs font-medium text-amber-900 dark:text-amber-100">
          ⚠️ Your session will auto-close soon. Please clock out.
        </p>
      </div>
    )}
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground">Today&apos;s Total</p>
      <p className="text-sm font-medium">
        {formatTotalMinutes(todayTotalMinutes)}
      </p>
    </div>
    <Button variant="default" className="w-full" onClick={onGoToAttendance}>
      Go to Attendance →
    </Button>
  </>
)

ClockedInContent.propTypes = {
  liveElapsed: PropTypes.number.isRequired,
  willAutoExpire: PropTypes.bool.isRequired,
  todayTotalMinutes: PropTypes.number.isRequired,
  onGoToAttendance: PropTypes.func.isRequired,
}

/**
 * Content section when clocked out.
 */
const ClockedOutContent = ({ todayTotalMinutes, onClockIn }) => (
  <>
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground">Today&apos;s Total</p>
      <p className="text-lg font-semibold">
        {formatTotalMinutes(todayTotalMinutes)}
      </p>
    </div>
    <Button variant="default" className="w-full" onClick={onClockIn}>
      Clock In
    </Button>
  </>
)

ClockedOutContent.propTypes = {
  todayTotalMinutes: PropTypes.number.isRequired,
  onClockIn: PropTypes.func.isRequired,
}

/**
 * Clock Status Widget for Dashboard.
 * Shows current clock-in status, elapsed time, and today&apos;s totals.
 * Provides quick navigation to the attendance page and clock-in button.
 * @param {object} props - Component props.
 * @param {boolean} props.isClocked - Whether employee is currently clocked in.
 * @param {string|null} props.clockedInAt - ISO timestamp of clock-in time.
 * @param {number|null} props.elapsedSeconds - Seconds elapsed since clock-in.
 * @param {boolean} props.willAutoExpire - Whether session will auto-expire soon.
 * @param {number} props.todayTotalMinutes - Total minutes worked today.
 * @param {boolean} props.isLoading - Loading state flag.
 */
const ClockStatusWidget = ({
  isClocked,
  clockedInAt,
  elapsedSeconds,
  willAutoExpire,
  todayTotalMinutes,
  isLoading,
}) => {
  const navigate = useNavigate()
  const [liveElapsed, setLiveElapsed] = useState(isClocked ? elapsedSeconds : 0)

  // Update elapsed time every second if clocked in
  useEffect(() => {
    if (!isClocked || !clockedInAt) {
      return
    }

    const updateElapsedTime = () => {
      const now = new Date()
      const clockedIn = new Date(clockedInAt)
      const diffSeconds = Math.floor((now - clockedIn) / 1000)
      setLiveElapsed(diffSeconds)
    }

    updateElapsedTime()
    const interval = setInterval(updateElapsedTime, 1000)
    // eslint-disable-next-line consistent-return
    return () => {
      clearInterval(interval)
    }
  }, [isClocked, clockedInAt])

  const dotColor = willAutoExpire
    ? "bg-amber-500"
    : isClocked
      ? "bg-green-500"
      : "bg-slate-300"
  const dotLabel = willAutoExpire
    ? "Session expiring soon"
    : isClocked
      ? "Clocked In"
      : "Clocked Out"

  const handleClockInClick = () => {
    navigate(ATTENDANCE_PATH)
  }

  const handleGoToAttendance = () => {
    navigate(ATTENDANCE_PATH)
  }

  if (isLoading) {
    return (
      <Card className="border-slate-200 dark:border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Clock Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-slate-300 animate-pulse" />
            <span className="text-xs text-muted-foreground">Loading...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  const cardClassName = willAutoExpire
    ? "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30"
    : isClocked
      ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30"
      : ""

  return (
    <Card className={cardClassName}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Clock Status</CardTitle>
          <div className="flex items-center gap-2">
            <div className={`h-3 w-3 rounded-full ${dotColor}`} />
            <span className="text-xs font-medium text-muted-foreground">
              {dotLabel}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {isClocked ? (
          <ClockedInContent
            liveElapsed={liveElapsed}
            willAutoExpire={willAutoExpire}
            todayTotalMinutes={todayTotalMinutes}
            onGoToAttendance={handleGoToAttendance}
          />
        ) : (
          <ClockedOutContent
            todayTotalMinutes={todayTotalMinutes}
            onClockIn={handleClockInClick}
          />
        )}
      </CardContent>
    </Card>
  )
}

ClockStatusWidget.propTypes = {
  isClocked: PropTypes.bool,
  clockedInAt: PropTypes.string,
  elapsedSeconds: PropTypes.number,
  willAutoExpire: PropTypes.bool,
  todayTotalMinutes: PropTypes.number,
  isLoading: PropTypes.bool,
}

ClockStatusWidget.defaultProps = {
  isClocked: false,
  clockedInAt: null,
  elapsedSeconds: 0,
  willAutoExpire: false,
  todayTotalMinutes: 0,
  isLoading: false,
}

export default ClockStatusWidget
