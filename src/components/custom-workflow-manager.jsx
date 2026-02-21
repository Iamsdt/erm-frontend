import PropTypes from "prop-types"
import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

/**
 * Custom Workflow Manager - Define and manage kanban columns
 */
const CustomWorkflowManager = ({ workflow, onSave, isLoading, isSaving }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [columns, setColumns] = useState(workflow?.columns || [])
  const [newColumn, setNewColumn] = useState({ title: "", color: "bg-gray-100" })

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    )
  }

  const colors = [
    "bg-gray-100",
    "bg-blue-100",
    "bg-purple-100",
    "bg-pink-100",
    "bg-yellow-100",
    "bg-green-100",
    "bg-red-100",
    "bg-orange-100",
  ]

  const handleAddColumn = () => {
    if (!newColumn.title.trim()) return

    const column = {
      id: newColumn.title.replace(/\s+/g, "_").toUpperCase(),
      title: newColumn.title,
      color: newColumn.color,
    }

    setColumns([...columns, column])
    setNewColumn({ title: "", color: "bg-gray-100" })
    setIsDialogOpen(false)
  }

  const handleRemoveColumn = (id) => {
    setColumns(columns.filter((c) => c.id !== id))
  }

  const handleSaveWorkflow = () => {
    if (columns.length < 2) {
      alert("Workflow must have at least 2 columns")
      return
    }

    onSave?.({
      ...workflow,
      columns,
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Custom Workflow</CardTitle>
          {workflow?.isActive && (
            <Badge variant="outline" className="text-xs">
              Active
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Columns */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-2">
            Kanban Columns ({columns.length})
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {columns.map((col) => (
              <div
                key={col.id}
                className={`${col.color} px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium`}
              >
                <span>{col.title}</span>
                <button
                  onClick={() => handleRemoveColumn(col.id)}
                  className="ml-2 opacity-0 hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Add Column Button */}
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => setIsDialogOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Column
        </Button>

        {/* Save Button */}
        <Button
          size="sm"
          className="w-full"
          onClick={handleSaveWorkflow}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save Workflow"}
        </Button>
      </CardContent>

      {/* Add Column Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Column</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Column Title */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Column Title</label>
              <Input
                value={newColumn.title}
                onChange={(e) =>
                  setNewColumn({ ...newColumn, title: e.target.value })
                }
                placeholder="e.g., Testing, Reviewed, Merged"
              />
            </div>

            {/* Color Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Column Color</label>
              <div className="grid grid-cols-4 gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    className={`${color} h-8 rounded-lg border-2 transition-all ${
                      newColumn.color === color
                        ? "border-black"
                        : "border-transparent"
                    }`}
                    onClick={() => setNewColumn({ ...newColumn, color })}
                  />
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddColumn} disabled={!newColumn.title.trim()}>
              Add Column
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

CustomWorkflowManager.propTypes = {
  workflow: PropTypes.shape({
    projectId: PropTypes.number,
    name: PropTypes.string,
    columns: PropTypes.array,
    isActive: PropTypes.bool,
  }),
  onSave: PropTypes.func,
  isLoading: PropTypes.bool.isRequired,
  isSaving: PropTypes.bool,
}

export default CustomWorkflowManager
