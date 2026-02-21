import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, Avatar as AvatarComponent } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, MessageSquare } from "lucide-react"
import { Link } from "react-router"

/**
 * Team Updates Page - View all team member updates
 */
const TeamUpdatesPage = () => {
  const teams = [
    {
      id: 1,
      name: "Frontend Team",
      members: [
        {
          id: 1,
          name: "Alice Smith",
          avatar: "A",
          role: "Lead Frontend Dev",
          update:
            "Completed responsive design for dashboard. Working on animations next.",
          status: "On Track",
          statusColor: "bg-green-100 text-green-800",
          time: "30 mins ago",
        },
        {
          id: 2,
          name: "Carol Davis",
          avatar: "C",
          role: "Frontend Dev",
          update:
            "Fixed dashboard layout issues. Coordinating with backend on API integration.",
          status: "Blocked",
          statusColor: "bg-yellow-100 text-yellow-800",
          time: "1 hour ago",
        },
      ],
    },
    {
      id: 2,
      name: "Backend Team",
      members: [
        {
          id: 3,
          name: "Bob Jones",
          avatar: "B",
          role: "Senior Backend Dev",
          update:
            "Implemented user authentication system. All tests passing. Ready for deployment.",
          status: "On Track",
          statusColor: "bg-green-100 text-green-800",
          time: "45 mins ago",
        },
        {
          id: 4,
          name: "David Wilson",
          avatar: "D",
          role: "Backend Dev",
          update:
            "Working on database optimization. Performance improved by 40%.",
          status: "On Track",
          statusColor: "bg-green-100 text-green-800",
          time: "2 hours ago",
        },
      ],
    },
  ]

  return (
    <div className="space-y-6 p-6">
      <Button variant="ghost" asChild>
        <Link to="/daily-update">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Daily Updates
        </Link>
      </Button>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Team Updates</h1>
        <p className="mt-2 text-muted-foreground">
          Real-time updates from your team members across all departments
        </p>
      </div>

      <div className="space-y-6">
        {teams.map((team) => (
          <div key={team.id} className="space-y-4">
            <div className="border-b pb-2">
              <h2 className="text-xl font-semibold text-blue-600">{team.name}</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {team.members.map((member) => (
                <Card key={member.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-white flex items-center justify-center font-bold">
                          {member.avatar}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{member.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {member.role}
                          </p>
                        </div>
                      </div>
                      <Badge className={member.statusColor}>
                        {member.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-gray-700">{member.update}</p>
                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-xs text-muted-foreground">
                        {member.time}
                      </span>
                      <Button variant="ghost" size="sm">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TeamUpdatesPage
