import PropTypes from "prop-types"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const toDatetimeLocal = (iso) => {
  if (!iso) return ""
  return new Date(iso).toISOString().slice(0, 16)
}

/**
 * EditEntryModal — admin modal to correct clock-in/out times for an entry.
 * @param {object} props - Component props.
 * @param {object|null} props.entry - The attendance entry to edit.
 * @param {() => void} props.onClose - Callback when modal is closed.
 * @param {(data: {clockIn: string, clockOut: string, editReason: string}) => void} props.onSave - Called with { clockIn, clockOut, editReason }.
 * @param {boolean} [props.isLoading] - Whether the save operation is in progress.
 */
const EditEntryModal = ({ entry, onClose, onSave, isLoading }) => {
  const [clockIn, setClockIn] = useState("")
  const [clockOut, setClockOut] = useState("")
  const [editReason, setEditReason] = useState("")

  useEffect(() => {
    if (entry) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setClockIn(toDatetimeLocal(entry.clockIn))

      setClockOut(toDatetimeLocal(entry.clockOut))
      setEditReason("")
    }
  }, [entry])

  const canSave = clockIn && clockOut && editReason.trim().length >= 5

  const handleSave = () => {
    if (!canSave) return
    onSave({
      clockIn: new Date(clockIn).toISOString(),
      clockOut: new Date(clockOut).toISOString(),
      editReason: editReason.trim(),
    })
  }

  const handleClose = () => {
    onClose()
  }

  return (
    <Dialog open={!!entry} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Attendance Entry</DialogTitle>
          <DialogDescription>
            {entry ? `${entry.employeeName} — ${entry.date}` : ""}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-clock-in">Clock In</Label>
            <Input
              id="edit-clock-in"
              type="datetime-local"
              value={clockIn}
              onChange={(event) => setClockIn(event.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-clock-out">Clock Out</Label>
            <Input
              id="edit-clock-out"
              type="datetime-local"
              value={clockOut}
              onChange={(event) => setClockOut(event.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-reason">
              Reason <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="edit-reason"
              placeholder="e.g. Employee forgot to clock out, corrected per their verbal report"
              rows={3}
              value={editReason}
              onChange={(event) => setEditReason(event.target.value)}
              disabled={isLoading}
              className="resize-none"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!canSave || isLoading}>
            {isLoading ? "Saving…" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

EditEntryModal.propTypes = {
  entry: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
}

EditEntryModal.defaultProps = {
  entry: null,
  isLoading: false,
}

export default EditEntryModal
