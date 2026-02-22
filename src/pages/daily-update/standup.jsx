import { ArrowLeft, Send } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

/**
 * Daily Standup Page - Team members share their daily progress
 */
const DailyStandupPage = () => {
  const [standup, setStandup] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const teamUpdates = [
    {
      name: "Alice Smith",
      role: "Frontend Developer",
      today: "Completed UI components library setup",
      blockers: "None",
      time: "2 hours ago",
    },
    {
      name: "Bob Jones",
      role: "Backend Developer",
      today: "Implemented API authentication",
      blockers: "Waiting for design specs",
      time: "1 hour ago",
    },
  ]

  const handleSubmit = () => {
    setSubmitted(true)
    setTimeout(() => {
      setStandup("")
      setSubmitted(false)
    }, 2000)
  }

  return (
    <div className="space-y-6 p-6">
      <Button variant="ghost" asChild>
        <Link to="/daily-update">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Daily Updates
        </Link>
      </Button>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Daily Standup</h1>
        <p className="mt-2 text-muted-foreground">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Standup Input */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Your Standup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">
                What did you accomplish today?
              </label>
              <Textarea
                placeholder="Share your progress..."
                value={standup}
                onChange={(e) => setStandup(e.target.value)}
                className="mt-2"
                rows={6}
              />
            </div>
            <Button
              onClick={handleSubmit}
              disabled={!standup.trim() || submitted}
              className="w-full"
            >
              <Send className="mr-2 h-4 w-4" />
              {submitted ? "Submitted!" : "Submit Standup"}
            </Button>
          </CardContent>
        </Card>

        {/* Team Updates */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Team Standups</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {teamUpdates.map((update) => (
              <div
                key={update.name}
                className="border-l-4 border-blue-500 pl-4 py-2"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-semibold">{update.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {update.role}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {update.time}
                  </Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Today:</span> {update.today}
                  </p>
                  <p>
                    <span className="font-medium">Blockers:</span>{" "}
                    {update.blockers === "None" ? (
                      <Badge variant="outline" className="ml-1 bg-green-50">
                        None
                      </Badge>
                    ) : (
                      <span className="text-red-600">{update.blockers}</span>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default DailyStandupPage
