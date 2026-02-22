import { Plus } from "lucide-react"
import PropTypes from "prop-types"
import { useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"

const ISSUE_TYPES = [
  { value: "epic", label: "Epic", color: "bg-purple-100 text-purple-800" },
  { value: "story", label: "Story", color: "bg-blue-100 text-blue-800" },
  { value: "task", label: "Task", color: "bg-green-100 text-green-800" },
  {
    value: "subtask",
    label: "Subtask",
    color: "bg-orange-100 text-orange-800",
  },
  { value: "bug", label: "Bug", color: "bg-red-100 text-red-800" },
]

const PRIORITIES = [
  { value: "high", label: "High", color: "bg-red-100 text-red-800" },
  { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-800" },
  { value: "low", label: "Low", color: "bg-green-100 text-green-800" },
]

/**
 * CreateIssueSidebar - Sheet-based sidebar for creating tasks and subtasks.
 * Replaces the dialog-based CreateIssueModal with a more spacious sidebar layout.
 */
export const CreateIssueSidebar = ({
  triggerText = "Add Issue",
  variant = "outline",
  size = "sm",
  className = "",
  defaultStatus = "Todo",
  tasks = [],
  projectMembers = [],
  onSubmit,
}) => {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    type: "task",
    priority: "medium",
    title: "",
    description: "",
    assigneeId: "",
    epicLink: "",
    parentTaskId: "",
    status: defaultStatus,
    estimatedHours: "",
    labels: "",
  })

  const handleChange = (field, value) => {
    setFormData((previous) => ({ ...previous, [field]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const payload = {
      ...formData,
      estimatedHours: formData.estimatedHours
        ? Number(formData.estimatedHours)
        : undefined,
    }
    onSubmit?.(payload)
    // Reset form
    setFormData({
      type: "task",
      priority: "medium",
      title: "",
      description: "",
      assigneeId: "",
      epicLink: "",
      parentTaskId: "",
      status: defaultStatus,
      estimatedHours: "",
      labels: "",
    })
    setOpen(false)
  }

  const selectedType = ISSUE_TYPES.find((t) => t.value === formData.type)
  const selectedPriority = PRIORITIES.find((p) => p.value === formData.priority)
  const isSubtask = formData.type === "subtask"

  // Filter only top-level tasks (not subtasks) for parent selection
  const parentTaskOptions = tasks.filter((t) => t.type !== "subtask")

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant={variant} size={size} className={`gap-2 ${className}`}>
          <Plus className="h-4 w-4" />
          {triggerText}
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg overflow-y-auto flex flex-col"
      >
        <SheetHeader className="pb-4">
          <SheetTitle className="flex items-center gap-2 text-xl">
            <Plus className="h-5 w-5 text-primary" />
            Create Issue
          </SheetTitle>
          <p className="text-sm text-muted-foreground">
            Add a new issue, task, bug, or epic to your project.
          </p>
        </SheetHeader>

        <Separator />

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 gap-0">
          <div className="flex-1 overflow-y-auto py-4 space-y-5 pr-1">
            {/* Type & Priority Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="issue-type">Issue Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(v) => handleChange("type", v)}
                >
                  <SelectTrigger id="issue-type">
                    <SelectValue>
                      {selectedType && (
                        <span className="flex items-center gap-2">
                          <Badge
                            className={`${selectedType.color} text-[10px] px-1.5 py-0 border-0`}
                            variant="outline"
                          >
                            {selectedType.label}
                          </Badge>
                        </span>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {ISSUE_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <span className="flex items-center gap-2">
                          <Badge
                            className={`${type.color} text-[10px] px-1.5 py-0 border-0`}
                            variant="outline"
                          >
                            {type.label}
                          </Badge>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="issue-priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(v) => handleChange("priority", v)}
                >
                  <SelectTrigger id="issue-priority">
                    <SelectValue>
                      {selectedPriority && (
                        <Badge
                          className={`${selectedPriority.color} text-[10px] px-1.5 py-0 border-0`}
                          variant="outline"
                        >
                          {selectedPriority.label}
                        </Badge>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITIES.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        <Badge
                          className={`${p.color} text-[10px] px-1.5 py-0 border-0`}
                          variant="outline"
                        >
                          {p.label}
                        </Badge>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Parent Task - only for subtask */}
            {isSubtask && (
              <div className="space-y-2">
                <Label htmlFor="parent-task">
                  Parent Task <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.parentTaskId}
                  onValueChange={(v) => handleChange("parentTaskId", v)}
                  required={isSubtask}
                >
                  <SelectTrigger id="parent-task">
                    <SelectValue placeholder="Select parent task" />
                  </SelectTrigger>
                  <SelectContent>
                    {parentTaskOptions.length === 0 ? (
                      <SelectItem value="none" disabled>
                        No tasks available
                      </SelectItem>
                    ) : (
                      parentTaskOptions.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.title}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="issue-title">
                Summary <span className="text-destructive">*</span>
              </Label>
              <Input
                id="issue-title"
                placeholder="What needs to be done?"
                value={formData.title}
                onChange={(event) => handleChange("title", event.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="issue-description">Description</Label>
              <Textarea
                id="issue-description"
                placeholder="Add more details, acceptance criteria, or context..."
                value={formData.description}
                onChange={(event) => handleChange("description", event.target.value)}
                className="min-h-[120px] resize-none"
              />
            </div>

            <Separator />

            {/* Assignee & Status */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="issue-assignee">Assignee</Label>
                <Select
                  value={formData.assigneeId}
                  onValueChange={(v) => handleChange("assigneeId", v)}
                >
                  <SelectTrigger id="issue-assignee">
                    <SelectValue placeholder="Unassigned" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {projectMembers.length > 0
                      ? projectMembers.map((member) => (
                          <SelectItem key={member.id} value={String(member.id)}>
                            {member.name}
                          </SelectItem>
                        ))
                      : [
                          <SelectItem key="1" value="1">
                            Alice Johnson
                          </SelectItem>,
                          <SelectItem key="2" value="2">
                            Bob Smith
                          </SelectItem>,
                        ]}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="issue-status">Initial Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(v) => handleChange("status", v)}
                >
                  <SelectTrigger id="issue-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Todo">To Do</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="In Review">In Review</SelectItem>
                    <SelectItem value="Done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Epic Link & Estimated Hours */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="issue-epic">Epic Link</Label>
                <Select
                  value={formData.epicLink}
                  onValueChange={(v) => handleChange("epicLink", v)}
                >
                  <SelectTrigger id="issue-epic">
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="e1">Security Improvements</SelectItem>
                    <SelectItem value="e2">UI/UX Overhaul</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="issue-hours">Estimated Hours</Label>
                <Input
                  id="issue-hours"
                  type="number"
                  min="0"
                  step="0.5"
                  placeholder="e.g. 4"
                  value={formData.estimatedHours}
                  onChange={(event) =>
                    handleChange("estimatedHours", event.target.value)
                  }
                />
              </div>
            </div>

            {/* Labels */}
            <div className="space-y-2">
              <Label htmlFor="issue-labels">Labels</Label>
              <Input
                id="issue-labels"
                placeholder="frontend, api, bug-fix (comma separated)"
                value={formData.labels}
                onChange={(event) => handleChange("labels", event.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Separate multiple labels with commas
              </p>
            </div>
          </div>

          {/* Footer Actions */}
          <Separator className="my-4" />
          <div className="flex items-center justify-end gap-3 pb-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="gap-2">
              <Plus className="h-4 w-4" />
              Create Issue
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}

CreateIssueSidebar.propTypes = {
  triggerText: PropTypes.string,
  variant: PropTypes.string,
  size: PropTypes.string,
  className: PropTypes.string,
  defaultStatus: PropTypes.string,
  tasks: PropTypes.array,
  projectMembers: PropTypes.array,
  onSubmit: PropTypes.func,
}

CreateIssueSidebar.defaultProps = {
  triggerText: "Add Issue",
  variant: "outline",
  size: "sm",
  className: "",
  defaultStatus: "Todo",
  tasks: [],
  projectMembers: [],
  onSubmit: undefined,
}

export default CreateIssueSidebar
