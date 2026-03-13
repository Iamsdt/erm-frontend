import {
  AlertCircle,
  ArrowLeft,
  Check,
  CheckCircle2,
  Clock,
  Lightbulb,
  Plus,
  Send,
  Sparkles,
  Trash2,
} from "lucide-react"
import PropTypes from "prop-types"
import { useRef, useState } from "react"
import { useDispatch } from "react-redux"
import { Link } from "react-router"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { setStandupStatus } from "@/services/store/slices/app.slice"
import {
  useAiReview,
  useFetchStandupProjects,
  useFetchUserStories,
  useSubmitStandup,
} from "@query/daily-update.query"

// ─── Constants ───────────────────────────────────────────────────────────────

const STANDUP_NOT_SUBMITTED = "Not Submitted"

const STATUS_MAP = {
  pending: {
    icon: Clock,
    iconColor: "text-yellow-600",
    bg: "bg-yellow-50 border-yellow-200",
    label: "Pending Submission",
  },
  reviewing: {
    icon: Sparkles,
    iconColor: "text-blue-600",
    bg: "bg-blue-50 border-blue-200",
    label: "AI Reviewing",
  },
  approved: {
    icon: Check,
    iconColor: "text-green-600",
    bg: "bg-green-50 border-green-200",
    label: "Approved",
  },
  rejected: {
    icon: AlertCircle,
    iconColor: "text-red-600",
    bg: "bg-red-50 border-red-200",
    label: "Needs Revision",
  },
}

const EMPTY_UPDATE_FIELDS = {
  projectId: "",
  userStoryIds: [],
  yesterday: "",
  today: "",
  blockers: "",
}

const createEmptyUpdate = () => ({
  ...EMPTY_UPDATE_FIELDS,
  id: globalThis.crypto.randomUUID(),
})

// ─── Submission Status Component ──────────────────────────────────────────────

/**
 * Renders the approved state with a success celebration card and optional suggestions.
 */
const ApprovedFeedback = ({ feedback }) => (
  <div className="space-y-3">
    <Card className="border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30">
      <CardContent className="flex items-start gap-3 p-4">
        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
            Great update! Your standup has been reviewed and looks good.
          </p>
          {feedback && (
            <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-400">
              {feedback}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
    <Button variant="outline" size="sm" asChild className="w-full gap-2">
      <Link to="/ai/recommendations">
        <Sparkles className="h-4 w-4" />
        View AI Recommendations
      </Link>
    </Button>
  </div>
)

ApprovedFeedback.propTypes = {
  feedback: PropTypes.string,
}

ApprovedFeedback.defaultProps = {
  feedback: null,
}

/**
 * Renders the rejected state with suggestions in an amber card.
 */
const RejectedFeedback = ({ feedback }) => (
  <div className="space-y-3">
    {feedback && (
      <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30">
        <CardContent className="flex items-start gap-3 p-4">
          <Lightbulb className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
              Suggestions for improvement
            </p>
            <p className="mt-1 text-sm text-amber-700 dark:text-amber-400">
              {feedback}
            </p>
          </div>
        </CardContent>
      </Card>
    )}
    <Button variant="outline" size="sm" className="w-full">
      Edit &amp; Resubmit
    </Button>
  </div>
)

RejectedFeedback.propTypes = {
  feedback: PropTypes.string,
}

RejectedFeedback.defaultProps = {
  feedback: null,
}

const SubmissionStatus = ({ status, feedback }) => {
  const config = STATUS_MAP[status] ?? STATUS_MAP.pending
  const StatusIcon = config.icon

  return (
    <Card className={`border ${config.bg}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <StatusIcon className={`h-4 w-4 ${config.iconColor}`} />
          Submission Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Status</span>
            <Badge
              variant={
                status === "approved"
                  ? "default"
                  : status === "rejected"
                    ? "destructive"
                    : "secondary"
              }
            >
              {config.label}
            </Badge>
          </div>
          {status === "reviewing" && (
            <p className="text-xs text-muted-foreground">
              AI is analyzing your standup for completeness and quality...
            </p>
          )}
        </div>

        {status === "approved" && <ApprovedFeedback feedback={feedback} />}

        {status === "rejected" && <RejectedFeedback feedback={feedback} />}

        {status !== "pending" && (
          <Button variant="outline" size="sm" asChild className="w-full gap-2">
            <Link to="/ai/insights">
              <Sparkles className="h-4 w-4" />
              View AI Insights
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

SubmissionStatus.propTypes = {
  status: PropTypes.oneOf(["pending", "reviewing", "approved", "rejected"])
    .isRequired,
  feedback: PropTypes.string,
}

SubmissionStatus.defaultProps = {
  feedback: null,
}

// ─── User Story Picker ───────────────────────────────────────────────────────

const UserStoryPicker = ({ projectId, selectedIds, onToggle }) => {
  const { data, isLoading } = useFetchUserStories(projectId)
  const stories = data?.stories ?? []

  if (isLoading) {
    return (
      <div className="border rounded-md p-4 text-sm text-muted-foreground">
        Loading stories...
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <Label>User Stories / Tasks (Select Multiple)</Label>
      <div className="border rounded-md p-4 space-y-2">
        {stories.map((story) => (
          <div key={story.id} className="flex items-center space-x-2">
            <Checkbox
              id={`story-${projectId}-${story.id}`}
              checked={selectedIds.includes(story.id)}
              onCheckedChange={() => onToggle(story.id)}
            />
            <Label
              htmlFor={`story-${projectId}-${story.id}`}
              className="cursor-pointer text-sm font-normal"
            >
              {story.title}
            </Label>
          </div>
        ))}
        <div className="flex items-center space-x-2 pt-2">
          <Checkbox
            id={`story-${projectId}-other`}
            checked={selectedIds.includes("other")}
            onCheckedChange={() => onToggle("other")}
          />
          <Label
            htmlFor={`story-${projectId}-other`}
            className="cursor-pointer text-sm font-normal"
          >
            Other / General Task
          </Label>
        </div>
      </div>
      {selectedIds.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedIds.map((storyId) => (
            <Badge key={storyId} variant="outline" className="text-xs">
              {storyId === "other"
                ? "Other"
                : stories.find((s) => s.id === storyId)?.title || storyId}
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}

UserStoryPicker.propTypes = {
  projectId: PropTypes.string.isRequired,
  selectedIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  onToggle: PropTypes.func.isRequired,
}

// ─── Standup Update Card ─────────────────────────────────────────────────────

const StandupUpdateCard = ({
  update,
  index,
  projects,
  showRemove,
  onRemove,
  onChange,
  onStoryToggle,
}) => (
  <Card className="relative overflow-hidden">
    {showRemove && (
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
        onClick={() => onRemove(update.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    )}
    <CardHeader className="pb-4">
      <CardTitle className="text-lg">Update #{index + 1}</CardTitle>
      <CardDescription>
        Select the project and stories you are working on
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor={`project-${update.id}`}>
          Project <span className="text-destructive">*</span>
        </Label>
        <Select
          value={update.projectId}
          onValueChange={(value) => onChange(update.id, "projectId", value)}
        >
          <SelectTrigger id={`project-${update.id}`}>
            <SelectValue placeholder="Select a project" />
          </SelectTrigger>
          <SelectContent>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {update.projectId && (
        <UserStoryPicker
          projectId={update.projectId}
          selectedIds={update.userStoryIds}
          onToggle={(storyId) => onStoryToggle(update.id, storyId)}
        />
      )}

      <Separator />

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`yesterday-${update.id}`}>
            What did you accomplish yesterday?
          </Label>
          <Textarea
            id={`yesterday-${update.id}`}
            placeholder="Briefly describe what you completed..."
            value={update.yesterday}
            onChange={(event) =>
              onChange(update.id, "yesterday", event.target.value)
            }
            rows={2}
            className="resize-none"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`today-${update.id}`}>
            What will you do today? <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id={`today-${update.id}`}
            placeholder="What are your goals for today?"
            value={update.today}
            onChange={(event) =>
              onChange(update.id, "today", event.target.value)
            }
            rows={2}
            className="resize-none"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`blockers-${update.id}`}>
            Are there any blockers in your way?
          </Label>
          <Textarea
            id={`blockers-${update.id}`}
            placeholder="List any impediments or dependencies (leave blank if none)..."
            value={update.blockers}
            onChange={(event) =>
              onChange(update.id, "blockers", event.target.value)
            }
            rows={2}
            className="resize-none"
          />
        </div>
      </div>
    </CardContent>
  </Card>
)

const updatePropertyType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  projectId: PropTypes.string.isRequired,
  userStoryIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  yesterday: PropTypes.string.isRequired,
  today: PropTypes.string.isRequired,
  blockers: PropTypes.string.isRequired,
})

const projectPropertyType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
})

StandupUpdateCard.propTypes = {
  update: updatePropertyType.isRequired,
  index: PropTypes.number.isRequired,
  projects: PropTypes.arrayOf(projectPropertyType).isRequired,
  showRemove: PropTypes.bool.isRequired,
  onRemove: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onStoryToggle: PropTypes.func.isRequired,
}

// ─── Main Page ───────────────────────────────────────────────────────────────

/**
 * CreateStandupPage — form for developers to submit their daily standup.
 */
const CreateStandupPage = () => {
  const dispatch = useDispatch()
  const { data: projectsData } = useFetchStandupProjects()
  const submitMutation = useSubmitStandup()
  const aiReviewMutation = useAiReview()

  const projects = projectsData?.projects ?? []

  const [submissionStatus, setSubmissionStatus] = useState("pending")
  const [aiFeedback, setAiFeedback] = useState(null)
  const [updates, setUpdates] = useState(() => [createEmptyUpdate()])

  const idCounterReference = useRef(0)
  const generateId = () => {
    idCounterReference.current += 1
    return globalThis.crypto.randomUUID()
  }

  const handleAddUpdate = () => {
    setUpdates((previous) => [
      ...previous,
      { ...EMPTY_UPDATE_FIELDS, id: generateId() },
    ])
  }

  const handleRemoveUpdate = (idToRemove) => {
    setUpdates((previous) => {
      if (previous.length <= 1) return previous
      return previous.filter((update) => update.id !== idToRemove)
    })
  }

  const handleUpdateChange = (id, field, value) => {
    setUpdates((previous) =>
      previous.map((update) => {
        if (update.id !== id) return update
        const newUpdate = { ...update, [field]: value }
        if (field === "projectId") {
          newUpdate.userStoryIds = []
        }
        return newUpdate
      })
    )
  }

  const handleUserStoryToggle = (updateId, storyId) => {
    setUpdates((previous) =>
      previous.map((update) => {
        if (update.id !== updateId) return update
        const newUserStoryIds = update.userStoryIds.includes(storyId)
          ? update.userStoryIds.filter((id) => id !== storyId)
          : [...update.userStoryIds, storyId]
        return { ...update, userStoryIds: newUserStoryIds }
      })
    )
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const isValid = updates.every((u) => u.projectId && u.today?.trim())
    if (!isValid) return

    setSubmissionStatus("reviewing")
    dispatch(setStandupStatus("In Review"))

    submitMutation.mutate({ updates })

    aiReviewMutation.mutate(
      { updates },
      {
        onSuccess: (response) => {
          const result = response.data
          if (result.approved) {
            setSubmissionStatus("approved")
            dispatch(setStandupStatus("Done"))
          } else {
            setSubmissionStatus("rejected")
            dispatch(setStandupStatus(STANDUP_NOT_SUBMITTED))
          }
          setAiFeedback(result.feedback)
        },
        onError: () => {
          setSubmissionStatus("rejected")
          dispatch(setStandupStatus(STANDUP_NOT_SUBMITTED))
          setAiFeedback("AI review failed. Please try resubmitting.")
        },
      }
    )
  }

  const dateLabel = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const isSubmitting = submitMutation.isPending || aiReviewMutation.isPending

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/daily-update">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold tracking-tight">
              Post Daily Standup
            </h1>
            <p className="text-sm text-muted-foreground">{dateLabel}</p>
          </div>
          {submissionStatus !== "pending" && (
            <Badge
              className={
                submissionStatus === "approved"
                  ? "bg-green-600"
                  : submissionStatus === "reviewing"
                    ? "bg-blue-600"
                    : "bg-red-600"
              }
            >
              {submissionStatus.charAt(0).toUpperCase() +
                submissionStatus.slice(1)}
            </Badge>
          )}
        </div>

        <Separator />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {updates.map((update, index) => (
                <StandupUpdateCard
                  key={update.id}
                  update={update}
                  index={index}
                  projects={projects}
                  showRemove={updates.length > 1}
                  onRemove={handleRemoveUpdate}
                  onChange={handleUpdateChange}
                  onStoryToggle={handleUserStoryToggle}
                />
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
                  disabled={isSubmitting || submissionStatus !== "pending"}
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

          <div className="lg:col-span-1">
            <SubmissionStatus status={submissionStatus} feedback={aiFeedback} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateStandupPage
