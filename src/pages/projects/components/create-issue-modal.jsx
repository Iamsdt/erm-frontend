import { Plus, CheckCircle2, Circle, AlertCircle, Bookmark } from "lucide-react"
import PropTypes from "prop-types"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

const IssueTypeIcon = ({ type }) => {
  switch (type) {
    case "epic":
      return <Bookmark className="h-4 w-4 text-purple-500" />
    case "story":
      return <Bookmark className="h-4 w-4 text-green-500" />
    case "task":
      return <CheckCircle2 className="h-4 w-4 text-blue-500" />
    case "bug":
      return <AlertCircle className="h-4 w-4 text-red-500" />
    default:
      return <Circle className="h-4 w-4 text-gray-500" />
  }
}

IssueTypeIcon.propTypes = {
  type: PropTypes.string,
}

export const CreateIssueModal = ({
  triggerText = "Add Issue",
  variant = "outline",
  size = "sm",
  className = "",
}) => {
  const [open, setOpen] = useState(false)
  const [issueType, setIssueType] = useState("story")

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant={variant} size={size} className={`gap-2 ${className}`}>
          <Plus className="h-4 w-4" /> {triggerText}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <SheetHeader className="pb-4 border-b">
            <SheetTitle className="flex items-center gap-2">
              <IssueTypeIcon type={issueType} /> Create {issueType.charAt(0).toUpperCase() + issueType.slice(1)}
            </SheetTitle>
            <SheetDescription>
              Add a new {issueType} to your project backlog or active sprint.
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto py-4 space-y-5 pr-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Issue Type *</Label>
                <Select value={issueType} onValueChange={setIssueType}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="epic">
                      <div className="flex items-center gap-2"><IssueTypeIcon type="epic" /> Epic</div>
                    </SelectItem>
                    <SelectItem value="story">
                      <div className="flex items-center gap-2"><IssueTypeIcon type="story" /> Story</div>
                    </SelectItem>
                    <SelectItem value="task">
                      <div className="flex items-center gap-2"><IssueTypeIcon type="task" /> Task</div>
                    </SelectItem>
                    <SelectItem value="bug">
                      <div className="flex items-center gap-2"><IssueTypeIcon type="bug" /> Bug</div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select defaultValue="medium">
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="highest">Highest</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="lowest">Lowest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Summary *</Label>
              <Input id="title" placeholder="What needs to be done?" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Add more details, context, and requirements..."
                className="min-h-[150px]"
              />
            </div>

            {/* Dynamic Fields based on Type */}
            {issueType === "epic" && (
              <div className="space-y-2 border-l-4 border-purple-500 pl-4 bg-purple-500/5 p-3 rounded-r-md">
                <Label htmlFor="outcome">Expected Outcome / Value</Label>
                <Textarea
                  id="outcome"
                  placeholder="What is the high-level goal of this epic?"
                  className="min-h-[80px]"
                />
              </div>
            )}

            {issueType === "story" && (
              <div className="space-y-4 border-l-4 border-green-500 pl-4 bg-green-500/5 p-3 rounded-r-md">
                 <div className="space-y-2">
                  <Label htmlFor="acceptance">Acceptance Criteria</Label>
                  <Textarea
                    id="acceptance"
                    placeholder="- Given... When... Then..."
                    className="min-h-[100px]"
                  />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="points">Story Points</Label>
                    <Input id="points" type="number" placeholder="e.g. 5, 8, 13" min="0" />
                  </div>
                 </div>
              </div>
            )}

            {issueType === "task" && (
              <div className="grid grid-cols-2 gap-4 border-l-4 border-blue-500 pl-4 bg-blue-500/5 p-3 rounded-r-md">
                <div className="space-y-2">
                  <Label htmlFor="estimate">Original Estimate (h)</Label>
                  <Input id="estimate" type="number" placeholder="e.g. 4" min="0" />
                </div>
              </div>
            )}

             {issueType === "bug" && (
              <div className="space-y-4 border-l-4 border-red-500 pl-4 bg-red-500/5 p-3 rounded-r-md">
                 <div className="space-y-2">
                  <Label htmlFor="reproduction">Steps to Reproduce</Label>
                  <Textarea
                    id="reproduction"
                    placeholder="1. Go to...&#10;2. Click on...&#10;3. See error..."
                    className="min-h-[80px]"
                  />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="environment">Environment</Label>
                    <Input id="environment" placeholder="e.g. Production, QA, Chrome" />
                  </div>
                 </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="space-y-2">
                <Label htmlFor="assignee">Assignee</Label>
                <Select>
                  <SelectTrigger id="assignee">
                    <SelectValue placeholder="Unassigned" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    <SelectItem value="1">Current User</SelectItem>
                    <SelectItem value="2">Team Member</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="epicLink">Epic Link</Label>
                <Select disabled={issueType === "epic"}>
                  <SelectTrigger id="epicLink">
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="e1">Security Improvements</SelectItem>
                    <SelectItem value="e2">UI/UX Overhaul</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
             <div className="space-y-2">
                <Label htmlFor="sprint">Sprint</Label>
                <Select>
                  <SelectTrigger id="sprint">
                    <SelectValue placeholder="Backlog" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="backlog">Backlog</SelectItem>
                    <SelectItem value="s1">Active Sprint (Sprint 1)</SelectItem>
                    <SelectItem value="s2">Sprint 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
          </div>
          <SheetFooter className="mt-4 pt-4 border-t shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Create</Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}

CreateIssueModal.propTypes = {
  triggerText: PropTypes.string,
  variant: PropTypes.string,
  size: PropTypes.string,
  className: PropTypes.string,
}

CreateIssueModal.defaultProps = {
  triggerText: "Add Issue",
  variant: "outline",
  size: "sm",
  className: "",
}
