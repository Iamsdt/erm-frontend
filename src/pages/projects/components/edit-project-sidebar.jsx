import { Edit, Trash2 } from "lucide-react"
import { useState } from "react"
import PropTypes from "prop-types"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

/**
 * EditProjectSidebar - Sheet-based sidebar for editing an existing project
 */
export const EditProjectSidebar = ({
  project,
  triggerText = "Edit Project",
  variant = "default",
  className = "",
  onSubmit = undefined,
  onDelete = undefined,
}) => {
  const [open, setOpen] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isOngoing, setIsOngoing] = useState(!project?.endDate)
  const [formData, setFormData] = useState({
    name: project?.name || "",
    description: project?.description || "",
    startDate: project?.startDate || "",
    endDate: project?.endDate || "",
  })

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const submitData = {
      ...formData,
      isOngoing,
      endDate: isOngoing ? null : formData.endDate,
    }
    onSubmit?.(submitData)
    setOpen(false)
  }

  const handleDelete = () => {
    onDelete?.()
    setShowDeleteDialog(false)
    setOpen(false)
  }

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button className={className} variant={variant}>
            <Edit className="h-4 w-4 mr-2" />
            {triggerText}
          </Button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="w-full sm:max-w-lg overflow-y-auto flex flex-col"
        >
          <SheetHeader className="pb-4">
            <SheetTitle className="flex items-center gap-2 text-xl">
              <Edit className="h-5 w-5 text-primary" />
              Edit Project
            </SheetTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Update your project details. Changes will be saved immediately.
            </p>
          </SheetHeader>

          <Separator />

          <form onSubmit={handleSubmit} className="flex flex-col flex-1 gap-0">
            <div className="flex-1 overflow-y-auto py-4 space-y-5 pr-1">
              {/* Project Name */}
              <div className="space-y-2">
                <Label htmlFor="edit-name">Project Name *</Label>
                <Input
                  id="edit-name"
                  placeholder="e.g. E-Commerce Redesign"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  placeholder="Brief description of the project"
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className="resize-none"
                  rows={4}
                />
              </div>

              {/* Dates */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-startDate">Start Date *</Label>
                  <Input
                    id="edit-startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleChange("startDate", e.target.value)}
                    required
                  />
                </div>

                {/* Ongoing Project Toggle */}
                <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/40">
                  <div className="space-y-0.5">
                    <Label
                      htmlFor="edit-ongoing"
                      className="text-sm font-medium cursor-pointer"
                    >
                      Ongoing Project
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {isOngoing
                        ? "No end date - never-ending project"
                        : "Project has a target date"}
                    </p>
                  </div>
                  <Switch
                    id="edit-ongoing"
                    checked={isOngoing}
                    onCheckedChange={setIsOngoing}
                  />
                </div>

                {/* Target Date - Only show if not ongoing */}
                {!isOngoing && (
                  <div className="space-y-2">
                    <Label htmlFor="edit-endDate">Target Date *</Label>
                    <Input
                      id="edit-endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => handleChange("endDate", e.target.value)}
                      required
                    />
                  </div>
                )}
              </div>

              {/* Danger Zone */}
              {onDelete && (
                <>
                  <Separator className="my-2" />
                  <div className="space-y-3 pt-2">
                    <h3 className="text-sm font-semibold text-destructive">
                      Danger Zone
                    </h3>
                    <Button
                      type="button"
                      variant="destructive"
                      className="w-full gap-2"
                      onClick={() => setShowDeleteDialog(true)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete Project
                    </Button>
                  </div>
                </>
              )}
            </div>

            <Separator className="my-4" />

            {/* Footer Actions */}
            <div className="flex gap-2 mt-auto">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Save Changes
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{formData.name}"? This action
              cannot be undone. All sprints, issues, and data associated with
              this project will be permanently deleted.
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
              Delete Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

EditProjectSidebar.propTypes = {
  project: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
  }).isRequired,
  triggerText: PropTypes.string,
  variant: PropTypes.string,
  className: PropTypes.string,
  onSubmit: PropTypes.func,
  onDelete: PropTypes.func,
}

EditProjectSidebar.defaultProps = {
  triggerText: "Edit Project",
  variant: "default",
  className: "",
  onSubmit: undefined,
  onDelete: undefined,
}
