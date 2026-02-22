import { Plus } from "lucide-react"
import { useState } from "react"

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

/**
 * CreateProjectSidebar - Sheet-based sidebar for creating new projects
 */
export const CreateProjectSidebar = ({
  triggerText = "Create Project",
  variant = "default",
  className = "",
}) => {
  const [open, setOpen] = useState(false)
  const [isOngoing, setIsOngoing] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
  })

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission with isOngoing flag
    const submitData = {
      ...formData,
      isOngoing,
      endDate: isOngoing ? null : formData.endDate,
    }
    console.log("Creating project:", submitData)
    // Reset form
    setFormData({ name: "", description: "", startDate: "", endDate: "" })
    setIsOngoing(false)
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className={`gap-2 shadow-sm ${className}`} variant={variant}>
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
            Create Project
          </SheetTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Add a new project to your workspace to organize your team's work and
            track progress.
          </p>
        </SheetHeader>

        <Separator />

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 gap-0">
          <div className="flex-1 overflow-y-auto py-4 space-y-5 pr-1">
            {/* Project Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Project Name *</Label>
              <Input
                id="name"
                placeholder="e.g. E-Commerce Redesign"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
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
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
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
                    htmlFor="ongoing"
                    className="text-sm font-medium cursor-pointer"
                  >
                    Ongoing Project
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {isOngoing
                      ? "No end date - never-ending project"
                      : "Project will have a target date"}
                  </p>
                </div>
                <Switch
                  id="ongoing"
                  checked={isOngoing}
                  onCheckedChange={setIsOngoing}
                />
              </div>

              {/* Target Date - Only show if not ongoing */}
              {!isOngoing && (
                <div className="space-y-2">
                  <Label htmlFor="endDate">Target Date *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleChange("endDate", e.target.value)}
                    required
                  />
                </div>
              )}
            </div>
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
              Create Project
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}

// For backwards compatibility
export const CreateProjectModal = CreateProjectSidebar
