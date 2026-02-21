import PropTypes from "prop-types"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const STATUS_OPTIONS = [
  { value: "ALL", label: "All Statuses" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
  { value: "AUTO_EXPIRED", label: "Auto-Expired" },
  { value: "EDITED", label: "Edited" },
  { value: "MANUAL", label: "Manual Entry" },
  { value: "FLAGGED", label: "Flagged" },
]

/**
 * LogsFilters — the filter bar above the admin attendance logs table.
 * @param {object} props - Component props.
 * @param {object} props.filters - Current filter values.
 * @param {(key: string, value: string | undefined) => void} props.onChange - Called with (key, value).
 * @param {() => void} props.onReset - Callback to clear filters.
 * @param {() => void} props.onAddManualEntry - Opens the manual entry modal.
 */
const LogsFilters = ({ filters, onChange, onReset, onAddManualEntry }) => {
  const handleDateChange = (event) => {
    onChange("date", event.target.value || undefined)
  }

  const handleStatusChange = (value) => {
    onChange("status", value === "ALL" ? undefined : value)
  }

  const handleReset = () => {
    onReset()
  }

  const handleAddManualEntry = () => {
    onAddManualEntry()
  }

  return (
    <div className="flex flex-wrap items-end gap-3">
      {/* Date */}
      <div className="flex flex-col gap-1">
        <label
          htmlFor="date-filter"
          className="text-xs font-medium text-muted-foreground"
        >
          Date
        </label>
        <Input
          id="date-filter"
          type="date"
          className="h-9 w-40"
          value={filters.date ?? ""}
          onChange={handleDateChange}
        />
      </div>

      {/* Status */}
      <div className="flex flex-col gap-1">
        <label
          htmlFor="status-filter"
          className="text-xs font-medium text-muted-foreground"
        >
          Status
        </label>
        <Select
          value={filters.status ?? "ALL"}
          onValueChange={handleStatusChange}
        >
          <SelectTrigger id="status-filter" className="h-9 w-44">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Active filters summary */}
      <div className="flex items-center gap-2 mt-4">
        {Object.entries(filters).some(([, v]) => v !== undefined) && (
          <Badge
            variant="outline"
            className="cursor-pointer hover:bg-destructive/10 hover:text-destructive"
            onClick={handleReset}
          >
            Clear filters ✕
          </Badge>
        )}
      </div>

      {/* Add Manual Entry — pushed to right */}
      <Button size="sm" className="ml-auto" onClick={handleAddManualEntry}>
        + Add Manual Entry
      </Button>
    </div>
  )
}

LogsFilters.propTypes = {
  filters: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  onAddManualEntry: PropTypes.func.isRequired,
}

export default LogsFilters
