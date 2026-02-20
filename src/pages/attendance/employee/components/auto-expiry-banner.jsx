import PropTypes from "prop-types"

import { Button } from "@/components/ui/button"

const pad = (n) => String(n).padStart(2, "0")

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${pad(m)}:${pad(s)}`
}

/**
 * AutoExpiryBanner — shown when willAutoExpire = true (< 30 min left).
 * Urges the employee to clock out manually before auto-expiry.
 * @param {object} props - Component props.
 * @param {number} props.expiresInSeconds - Seconds until auto-expiry.
 * @param {() => void} props.onClockOut - Callback to trigger the clock-out dialog.
 */
const AutoExpiryBanner = ({ expiresInSeconds, onClockOut }) => {
  if (!expiresInSeconds || expiresInSeconds <= 0) return null

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-amber-800 dark:text-amber-300">
      <div className="flex items-center gap-2 text-sm font-medium">
        <span className="text-base">⚠️</span>
        <span>
          Your session will auto-close in{" "}
          <strong>{formatTime(expiresInSeconds)}</strong>. Please clock out
          manually with your work summary.
        </span>
      </div>
      <Button
        size="sm"
        variant="outline"
        className="shrink-0 border-amber-500/60 text-amber-800 hover:bg-amber-500/20 dark:text-amber-300"
        onClick={onClockOut}
      >
        Clock Out Now
      </Button>
    </div>
  )
}

AutoExpiryBanner.propTypes = {
  expiresInSeconds: PropTypes.number,
  onClockOut: PropTypes.func.isRequired,
}

AutoExpiryBanner.defaultProps = {
  expiresInSeconds: null,
}

export default AutoExpiryBanner
