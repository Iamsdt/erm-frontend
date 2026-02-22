import PropTypes from "prop-types"
import { Link } from "react-router"
import { ArrowLeft, Calendar, Clock, Users, Target, Activity, ChevronRight } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

/**
 * ProjectDetailsUI - Displays detailed information about a project and its sprints.
 */
const ProjectDetailsUI = ({ project, sprints, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="space-y-6 p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/projects">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Link>
        </Button>
        <Card className="border-destructive bg-destructive/10">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Error Loading Project
            </CardTitle>
            <CardDescription className="text-destructive/80">
              We couldn't load the project details. Please try again later.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active": return "bg-green-100 text-green-800 hover:bg-green-100/80 border-green-200"
      case "completed": return "bg-blue-100 text-blue-800 hover:bg-blue-100/80 border-blue-200"
      case "on hold": return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80 border-yellow-200"
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-100/80 border-gray-200"
    }
  }

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild className="h-10 w-10 rounded-full">
            <Link to="/projects">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">{project.name}</h1>
              <Badge variant="outline" className={getStatusColor(project.status)}>
                {project.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Project ID: PRJ-{project.id}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button>Edit Project</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description Card */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Project Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {project.description || "No description provided for this project."}
              </p>
            </CardContent>
          </Card>

          {/* Sprints Section */}
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Sprints
              </CardTitle>
              <Button variant="outline" size="sm">
                Create Sprint
              </Button>
            </CardHeader>
            <CardContent>
              {sprints.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-lg bg-muted/30">
                  <Target className="h-10 w-10 text-muted-foreground mb-4 opacity-50" />
                  <h3 className="text-lg font-medium">No sprints yet</h3>
                  <p className="text-sm text-muted-foreground max-w-sm mt-1">
                    Get started by creating your first sprint to organize tasks and track progress.
                  </p>
                  <Button className="mt-4">Create First Sprint</Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {sprints.map((sprint) => (
                    <Link 
                      key={sprint.id} 
                      to={`/projects/${project.id}/sprints/${sprint.id}`}
                      className="block group"
                    >
                      <div className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                              {sprint.name}
                            </h4>
                            <Badge variant="secondary" className="text-xs font-normal">
                              {sprint.status}
                            </Badge>
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground gap-4">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(sprint.startDate).toLocaleDateString()} - {new Date(sprint.endDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="hidden sm:block text-right">
                            <div className="text-sm font-medium">{sprint.progress}%</div>
                            <div className="text-xs text-muted-foreground">Completed</div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          {/* Progress Card */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">Overall Completion</span>
                  <span className="text-2xl font-bold text-primary">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2.5" />
              </div>
              
              <div className="pt-4 border-t space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Start Date
                  </span>
                  <span className="font-medium">{new Date(project.startDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Target className="h-4 w-4" /> Target Date
                  </span>
                  <span className="font-medium">{new Date(project.endDate).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team Card */}
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Team
              </CardTitle>
              <Badge variant="secondary">{project.members?.length || 0}</Badge>
            </CardHeader>
            <CardContent>
              {project.members && project.members.length > 0 ? (
                <div className="space-y-4 mt-4">
                  {project.members.map((member) => (
                    <div key={member.id} className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                          {member.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium leading-none">{member.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">Team Member</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No team members assigned.</p>
              )}
              <Button variant="outline" className="w-full mt-6">Manage Team</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

ProjectDetailsUI.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    progress: PropTypes.number.isRequired,
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
    members: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        avatar: PropTypes.string.isRequired,
      })
    ),
  }),
  sprints: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      progress: PropTypes.number.isRequired,
      startDate: PropTypes.string.isRequired,
      endDate: PropTypes.string.isRequired,
    })
  ).isRequired,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.oneOf([PropTypes.bool, PropTypes.object]),
}

export default ProjectDetailsUI
