import PropTypes from "prop-types"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

const MIN_LENGTH = 10

/**
 * ClockOutDialog — shown when the employee clicks "Clock Out".
 * Requires them to write a work summary (min 10 chars) before confirming.
 * @param {object} props - Component props.
 * @param {boolean} props.open - Whether the dialog is open.
 * @param {() => void} props.onClose - Callback when dialog is closed.
 * @param {(data: {workSummary: string}) => void} props.onConfirm - Called with { workSummary }.
 * @param {boolean} props.isLoading - Whether the clock-out operation is in progress.
 */
const ClockOutDialog = ({ open, onClose, onConfirm, isLoading }) => {
  const [summary, setSummary] = useState("")

  const handleConfirm = () => {
    if (summary.trim().length < MIN_LENGTH) return
    onConfirm({ workSummary: summary.trim() })
  }

  const handleOpenChange = (v) => {
    if (!v) onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Clock Out</DialogTitle>
          <DialogDescription>
            What did you work on today? This will be saved with your attendance
            record.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-1.5 py-2">
          <Textarea
            placeholder="e.g. Reviewed pull requests, fixed login bug, attended sprint planning…"
            rows={4}
            value={summary}
            onChange={(event) => setSummary(event.target.value)}
            disabled={isLoading}
            className="resize-none"
          />
          <p
            className={`text-xs ${
              summary.trim().length < MIN_LENGTH
                ? "text-muted-foreground"
                : "text-emerald-600"
            }`}
          >
            {summary.trim().length}/{MIN_LENGTH} min characters
          </p>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={summary.trim().length < MIN_LENGTH || isLoading}
          >
            {isLoading ? "Clocking out…" : "Confirm Clock Out"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

ClockOutDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
}

ClockOutDialog.defaultProps = {
  isLoading: false,
}

export default ClockOutDialog
