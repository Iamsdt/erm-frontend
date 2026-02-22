import { ArrowLeft, Send, Plus, Trash2 } from "lucide-react"
import { useState } from "react"
import { Link, useNavigate } from "react-router"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
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

// Mock data for projects and user stories
const MOCK_PROJECTS = [
  { id: "p1", name: "ERM Frontend Redesign" },
  { id: "p2", name: "Backend API v2" },
  { id: "p3", name: "Mobile App MVP" },
]

const MOCK_USER_STORIES = {
  p1: [
    { id: "us1", title: "ERM-101: Implement new dashboard layout" },
    { id: "us2", title: "ERM-105: Add dark mode support" },
    { id: "us3", title: "ERM-112: Refactor authentication flow" },
  ],
  p2: [
    { id: "us4", title: "API-201: Create user management endpoints" },
    { id: "us5", title: "API-205: Implement rate limiting" },
  ],
  p3: [
    { id: "us6", title: "MOB-301: Setup React Native project" },
    { id: "us7", title: "MOB-305: Implement push notifications" },
  ],
}

/**
 * CreateStandupPage - Form for developers to submit their daily standup
 */
const CreateStandupPage = () => {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // A user can work on multiple projects/stories in a day
  const [updates, setUpdates] = useState([
    {
      id: Date.now().toString(),
      projectId: "",
      userStoryId: "",
      yesterday: "",
      today: "",
      blockers: "",
    }
  ])

  const handleAddUpdate = () => {
    setUpdates([
      ...updates,
      {
        id: Date.now().toString(),
        projectId: "",
        userStoryId: "",
        yesterday: "",
        today: "",
        blockers: "",
      }
    ])
  }

  const handleRemoveUpdate = (idToRemove) => {
    if (updates.length > 1) {
      setUpdates(updates.filter(update => update.id !== idToRemove))
    }
  }

  const handleUpdateChange = (id, field, value) => {
    setUpdates(updates.map(update => {
      if (update.id === id) {
        const newUpdate = { ...update, [field]: value }
        // Reset user story if project changes
        if (field === "projectId") {
          newUpdate.userStoryId = ""
        }
        return newUpdate
      }
      return update
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Validate form (basic validation)
    const isValid = updates.every(u => u.projectId && u.today)
    if (!isValid) {
      alert("Please fill in at least the Project and Today's plan for all entries.")
      setIsSubmitting(false)
      return
    }

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      // Navigate back to the standup view or dashboard
      navigate("/daily-update/standup")
    }, 1500)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild className="h-9 w-9 rounded-full">
          <Link to="/daily-update/standup">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Post Daily Standup</h1>
          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {updates.map((update, index) => (
          <Card key={update.id} className="relative overflow-hidden">
            {updates.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
                onClick={() => handleRemoveUpdate(update.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Update #{index + 1}</CardTitle>
              <CardDescription>Select the project and story you are working on</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Project Selection */}
                <div className="space-y-2">
                  <Label htmlFor={`project-${update.id}`}>Project <span className="text-destructive">*</span></Label>
                  <Select
                    value={update.projectId}
                    onValueChange={(value) => handleUpdateChange(update.id, "projectId", value)}
                  >
                    <SelectTrigger id={`project-${update.id}`}>
                      <SelectValue placeholder="Select a project" />
                    </SelectTrigger>
                    <SelectContent>
                      {MOCK_PROJECTS.map(project => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* User Story Selection */}
                <div className="space-y-2">
                  <Label htmlFor={`story-${update.id}`}>User Story / Task</Label>
                  <Select
                    value={update.userStoryId}
                    onValueChange={(value) => handleUpdateChange(update.id, "userStoryId", value)}
                    disabled={!update.projectId}
                  >
                    <SelectTrigger id={`story-${update.id}`}>
                      <SelectValue placeholder={update.projectId ? "Select a user story" : "Select a project first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {update.projectId && MOCK_USER_STORIES[update.projectId]?.map(story => (
                        <SelectItem key={story.id} value={story.id}>
                          {story.title}
                        </SelectItem>
                      ))}
                      <SelectItem value="other">Other / General Task</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                {/* Yesterday */}
                <div className="space-y-2">
                  <Label htmlFor={`yesterday-${update.id}`}>What did you accomplish yesterday?</Label>
                  <Textarea
                    id={`yesterday-${update.id}`}
                    placeholder="Briefly describe what you completed..."
                    value={update.yesterday}
                    onChange={(e) => handleUpdateChange(update.id, "yesterday", e.target.value)}
                    rows={2}
                    className="resize-none"
                  />
                </div>

                {/* Today */}
                <div className="space-y-2">
                  <Label htmlFor={`today-${update.id}`}>What will you do today? <span className="text-destructive">*</span></Label>
                  <Textarea
                    id={`today-${update.id}`}
                    placeholder="What are your goals for today?"
                    value={update.today}
                    onChange={(e) => handleUpdateChange(update.id, "today", e.target.value)}
                    rows={2}
                    className="resize-none"
                  />
                </div>

                {/* Blockers */}
                <div className="space-y-2">
                  <Label htmlFor={`blockers-${update.id}`}>Are there any blockers in your way?</Label>
                  <Textarea
                    id={`blockers-${update.id}`}
                    placeholder="List any impediments or dependencies (leave blank if none)..."
                    value={update.blockers}
                    onChange={(e) => handleUpdateChange(update.id, "blockers", e.target.value)}
                    rows={2}
                    className="resize-none"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <div className="flex items-center justify-between pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleAddUpdate}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Another Project Update
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="gap-2 min-w-[140px]"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Submitting...
              </span>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Submit Standup
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default CreateStandupPage
