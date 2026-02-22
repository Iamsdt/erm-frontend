import { Edit, Trash2, X, Activity, Zap, Calendar } from "lucide-react"
import { useState } from "react"
import PropTypes from "prop-types"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

// Sample activity log data
const SAMPLE_ACTIVITY = [
  {
    id: 1,
    type: "status_change",
    actor: "John Doe",
    action: "changed status to",
    details: "In Progress",
    timestamp: "2 hours ago",
  },
  {
    id: 2,
    type: "sprint_added",
    actor: "Sarah Smith",
    action: "added to sprint",
    details: "Sprint 5",
    timestamp: "1 day ago",
  },
  {
    id: 3,
    type: "created",
    actor: "Mike Johnson",
    action: "created epic",
    details: "",
    timestamp: "3 days ago",
  },
]

// Sample sprint connections
const SAMPLE_SPRINTS = [
  { id: 1, name: "Sprint 4", status: "Completed", progress: 100 },
  { id: 2, name: "Sprint 5", status: "Active", progress: 65 },
]

/**
 * EpicDetailsSidebar - Shows epic details, activity logs, and sprint connections
 */
export const EpicDetailsSidebar = ({
  epic,
  open = false,
  onOpenChange,
  onEdit = undefined,
  onDelete = undefined,
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "to do":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "in progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "done":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handleDelete = () => {
    onDelete?.(epic.id)
    setShowDeleteDialog(false)
    onOpenChange?.(false)
  }

  if (!epic) return null

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-2xl flex flex-col p-0 overflow-hidden"
        >
          <SheetHeader className="px-6 py-4 border-b sticky top-0 flex flex-row items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Epic Details
            </SheetTitle>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    ⋮
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit?.(epic)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Epic
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setShowDeleteDialog(true)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Epic
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <SheetClose />
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto">
            {/* Epic Header Info */}
            <div className="px-6 py-4 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold">{epic.title}</h2>
                    <p className="text-sm text-muted-foreground">{epic.id}</p>
                  </div>
                </div>
              </div>

              {/* Status and Metadata */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    Status
                  </p>
                  <Badge
                    variant="outline"
                    className={`${getStatusColor(epic.status)} w-full justify-center`}
                  >
                    {epic.status}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    Progress
                  </p>
                  <Badge variant="secondary" className="w-full justify-center">
                    {epic.progress}%
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    Sprints
                  </p>
                  <Badge variant="secondary" className="w-full justify-center">
                    {SAMPLE_SPRINTS.length}
                  </Badge>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Completion</span>
                  <span className="text-muted-foreground">
                    {epic.progress}%
                  </span>
                </div>
                <Progress value={epic.progress} className="h-2.5" />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <p className="font-semibold text-sm">Description</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {epic.description ||
                    "No description provided for this epic. Add a detailed description to help your team understand the epic's goals and scope."}
                </p>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Connected Sprints */}
            <div className="px-6 py-4 space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <h3 className="font-semibold">Connected Sprints</h3>
              </div>
              {SAMPLE_SPRINTS.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No sprints connected to this epic
                </p>
              ) : (
                <div className="space-y-2">
                  {SAMPLE_SPRINTS.map((sprint) => (
                    <div
                      key={sprint.id}
                      className="p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium text-sm">{sprint.name}</p>
                          <Badge variant="outline" className="text-xs mt-1">
                            {sprint.status}
                          </Badge>
                        </div>
                        <span className="text-sm font-semibold text-primary">
                          {sprint.progress}%
                        </span>
                      </div>
                      <Progress value={sprint.progress} className="h-1.5" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Separator className="my-4" />

            {/* Activity Log */}
            <div className="px-6 py-4 space-y-4">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                <h3 className="font-semibold">Activity Log</h3>
              </div>
              <div className="space-y-3">
                {SAMPLE_ACTIVITY.map((activity) => (
                  <div key={activity.id} className="flex gap-3 text-sm">
                    <div className="mt-1">
                      <div className="h-2 w-2 rounded-full bg-primary mt-1" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">
                        <span className="text-muted-foreground">
                          {activity.actor}
                        </span>
                        {" " + activity.action + " "}
                        <span className="font-semibold text-foreground">
                          {activity.details}
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {activity.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Epic?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{epic.title}"? This action cannot
              be undone. All tasks associated with this epic will be unlinked.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={handleDelete}>
              Delete Epic
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

EpicDetailsSidebar.propTypes = {
  epic: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    progress: PropTypes.number.isRequired,
    description: PropTypes.string,
  }),
  open: PropTypes.bool,
  onOpenChange: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
}

EpicDetailsSidebar.defaultProps = {
  epic: null,
  open: false,
  onOpenChange: undefined,
  onEdit: undefined,
  onDelete: undefined,
}
