import { Activity, CheckSquare, Plus, CheckCircle2, Circle } from "lucide-react"
import PropTypes from "prop-types"
import { useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet"

const PRIORITY_COLORS = {
  high: "bg-red-100 text-red-800 border-red-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  low: "bg-green-100 text-green-800 border-green-200",
}

const DEFAULT_PRIORITY_COLOR = "bg-gray-100 text-gray-800 border-gray-200"

const getPriorityColor = (priority) =>
  PRIORITY_COLORS[priority?.toLowerCase()] || DEFAULT_PRIORITY_COLOR

const ACTIVITY_LOG = [
  {
    id: 1,
    actor: "John Doe",
    action: "created this issue",
    timestamp: "3 days ago",
  },
  {
    id: 2,
    actor: "Sarah Smith",
    action: "assigned to",
    timestamp: "2 days ago",
  },
]

const IssueHeaderInfo = ({ issue }) => (
  <div className="space-y-2">
    <div className="flex items-center gap-3 mb-4">
      <Badge variant="outline" className="text-xs font-mono">
        {issue.id}
      </Badge>
      <Badge
        variant="outline"
        className={`${getPriorityColor(issue.priority)}`}
      >
        {issue.priority} Priority
      </Badge>
    </div>
    <h2 className="text-xl font-bold">{issue.title}</h2>
  </div>
)

IssueHeaderInfo.propTypes = {
  issue: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    priority: PropTypes.string.isRequired,
  }).isRequired,
}

const IssueMetadata = ({ issue }) => (
  <div className="grid grid-cols-3 gap-3">
    <div className="space-y-1">
      <p className="text-xs font-medium text-muted-foreground">Epic</p>
      <Badge variant="secondary" className="w-full justify-center">
        {issue.epic}
      </Badge>
    </div>
    <div className="space-y-1">
      <p className="text-xs font-medium text-muted-foreground">Points</p>
      <Badge variant="secondary" className="w-full justify-center">
        {issue.points} pts
      </Badge>
    </div>
    <div className="space-y-1">
      <p className="text-xs font-medium text-muted-foreground">Status</p>
      <Badge variant="secondary" className="w-full justify-center">
        To Do
      </Badge>
    </div>
  </div>
)

IssueMetadata.propTypes = {
  issue: PropTypes.shape({
    epic: PropTypes.string.isRequired,
    points: PropTypes.number.isRequired,
  }).isRequired,
}

const IssueDescription = ({ description }) => (
  <div className="space-y-2">
    <p className="font-semibold text-sm">Description</p>
    <p className="text-sm text-muted-foreground leading-relaxed">
      {description ||
        "No description provided for this issue. Add details to help your team understand the requirements."}
    </p>
  </div>
)

IssueDescription.propTypes = {
  description: PropTypes.string,
}

IssueDescription.defaultProps = {
  description: "",
}

const AcceptanceCriteria = () => (
  <div className="space-y-2">
    <p className="font-semibold text-sm">Acceptance Criteria</p>
    <ul className="text-sm text-muted-foreground space-y-2">
      <li className="flex items-start gap-2">
        <span className="text-primary mt-1">&#10003;</span>
        <span>User can authenticate using OAuth2</span>
      </li>
      <li className="flex items-start gap-2">
        <span className="text-primary mt-1">&#10003;</span>
        <span>Tokens are securely stored</span>
      </li>
      <li className="flex items-start gap-2">
        <span className="text-primary mt-1">&#10003;</span>
        <span>Error handling is implemented</span>
      </li>
    </ul>
  </div>
)

const SubtaskItem = ({ subtask, onToggle, onRemove }) => (
  <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors">
    <button onClick={() => onToggle(subtask.id)} className="shrink-0">
      {subtask.completed ? (
        <CheckCircle2 className="h-4 w-4 text-green-600" />
      ) : (
        <Circle className="h-4 w-4 text-muted-foreground" />
      )}
    </button>
    <span
      className={`text-sm flex-1 ${
        subtask.completed ? "line-through text-muted-foreground" : ""
      }`}
    >
      {subtask.title}
    </span>
    <Button
      variant="ghost"
      size="sm"
      className="h-5 w-5 p-0 opacity-0 hover:opacity-100 transition-opacity"
      onClick={() => onRemove(subtask.id)}
    >
      &times;
    </Button>
  </div>
)

SubtaskItem.propTypes = {
  subtask: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    completed: PropTypes.bool,
  }).isRequired,
  onToggle: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
}

const SubtasksSection = ({
  subtasks,
  issueId,
  onCreateSubtask,
  onToggle,
  onRemove,
}) => (
  <div className="space-y-3">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <CheckSquare className="h-4 w-4 text-primary" />
        <p className="font-semibold text-sm">
          Subtasks ({subtasks.filter((st) => st.completed).length}/
          {subtasks.length})
        </p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="h-6 px-2"
        onClick={() => onCreateSubtask?.(issueId)}
      >
        <Plus className="h-3.5 w-3.5 mr-1" />
        Add
      </Button>
    </div>

    {subtasks.length === 0 ? (
      <p className="text-xs text-muted-foreground text-center py-3">
        No subtasks yet
      </p>
    ) : (
      <div className="space-y-2">
        {subtasks.map((subtask) => (
          <SubtaskItem
            key={subtask.id}
            subtask={subtask}
            onToggle={onToggle}
            onRemove={onRemove}
          />
        ))}
      </div>
    )}
  </div>
)

SubtasksSection.propTypes = {
  subtasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
      completed: PropTypes.bool,
    })
  ).isRequired,
  issueId: PropTypes.string.isRequired,
  onCreateSubtask: PropTypes.func,
  onToggle: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
}

SubtasksSection.defaultProps = {
  onCreateSubtask: undefined,
}

const ActivityLog = () => (
  <div className="px-6 py-4 space-y-4">
    <div className="flex items-center gap-2">
      <Activity className="h-4 w-4 text-primary" />
      <h3 className="font-semibold">Activity Log</h3>
    </div>
    <div className="space-y-3">
      {ACTIVITY_LOG.map((activity) => (
        <div key={activity.id} className="flex gap-3 text-sm">
          <div className="mt-1">
            <div className="h-2 w-2 rounded-full bg-primary mt-1" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium">
              <span className="text-muted-foreground">{activity.actor}</span>
              {` ${activity.action}`}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {activity.timestamp}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
)

const DeleteConfirmDialog = ({ open, onOpenChange, issueTitle, onConfirm }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Delete Issue?</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete &ldquo;{issueTitle}&rdquo;? This
          action cannot be undone.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter className="gap-2 sm:gap-0">
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
        >
          Cancel
        </Button>
        <Button type="button" variant="destructive" onClick={onConfirm}>
          Delete Issue
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
)

DeleteConfirmDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  issueTitle: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
}

/**
 * IssueDetailsSidebar - Shows issue details, activity logs, and subtasks (view only)
 */
export const IssueDetailsSidebar = ({
  issue,
  open = false,
  onOpenChange,
  onEdit = undefined,
  onDelete = undefined,
  onCreateSubtask = undefined,
  onSubtaskToggle = undefined,
  onSubtaskDelete = undefined,
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [subtasks, setSubtasks] = useState(issue?.subtasks || [])

  const toggleSubtaskComplete = (subtaskId) => {
    const updated = subtasks.map((st) =>
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    )
    setSubtasks(updated)
    const toggled = updated.find((st) => st.id === subtaskId)
    onSubtaskToggle?.(subtaskId, toggled?.completed)
  }

  const removeSubtask = (subtaskId) => {
    setSubtasks(subtasks.filter((st) => st.id !== subtaskId))
    onSubtaskDelete?.(subtaskId)
  }

  const handleDelete = () => {
    onDelete?.(issue.id)
    setShowDeleteDialog(false)
    onOpenChange?.(false)
  }

  if (!issue) return null

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-2xl flex flex-col p-0 overflow-hidden"
        >
          <SheetHeader className="px-6 py-4 border-b sticky top-0 flex flex-row items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-primary" />
              Issue Details
            </SheetTitle>
            <SheetClose />
          </SheetHeader>

          <div className="flex-1 overflow-y-auto">
            <div className="px-6 py-4 space-y-4">
              <IssueHeaderInfo issue={issue} />
              <IssueMetadata issue={issue} />

              <IssueDescription description={issue.description} />

              <AcceptanceCriteria />

              <SubtasksSection
                subtasks={subtasks}
                issueId={issue.id}
                onCreateSubtask={onCreateSubtask}
                onToggle={toggleSubtaskComplete}
                onRemove={removeSubtask}
              />
            </div>

            <Separator className="my-4" />
            <ActivityLog />
          </div>

          <div className="px-6 py-4 border-t sticky bottom-0 bg-background gap-2 flex">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onEdit?.(issue)}
            >
              Edit Issue
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={() => setShowDeleteDialog(true)}
            >
              Delete
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <DeleteConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        issueTitle={issue.title}
        onConfirm={handleDelete}
      />
    </>
  )
}

IssueDetailsSidebar.propTypes = {
  issue: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    epic: PropTypes.string.isRequired,
    points: PropTypes.number.isRequired,
    priority: PropTypes.string.isRequired,
    description: PropTypes.string,
    subtasks: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        title: PropTypes.string,
        completed: PropTypes.bool,
      })
    ),
  }),
  open: PropTypes.bool,
  onOpenChange: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onCreateSubtask: PropTypes.func,
  onSubtaskToggle: PropTypes.func,
  onSubtaskDelete: PropTypes.func,
}

IssueDetailsSidebar.defaultProps = {
  issue: null,
  open: false,
  onOpenChange: undefined,
  onEdit: undefined,
  onDelete: undefined,
  onCreateSubtask: undefined,
  onSubtaskToggle: undefined,
  onSubtaskDelete: undefined,
}
