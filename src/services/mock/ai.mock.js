import { http, HttpResponse } from "msw"

// ─── Seed data ────────────────────────────────────────────────────────────────

const insights = [
  {
    id: 1,
    title: "Team Productivity Peak",
    icon: "TrendingUp",
    description:
      "Your team's productivity peaks on Tuesday and Wednesday mornings. Consider scheduling critical tasks during these times.",
    confidence: "92%",
    category: "Productivity",
    actionable: true,
  },
  {
    id: 2,
    title: "Bottleneck Detected",
    icon: "AlertCircle",
    description:
      "Code review process is taking longer than usual. Average time increased by 35%. Consider pairing reviewers to speed up.",
    confidence: "88%",
    category: "Process",
    actionable: true,
  },
  {
    id: 3,
    title: "Resource Allocation Opportunity",
    icon: "Zap",
    description:
      "Backend team is operating at 65% capacity. Frontend team at 95%. Recommend task rebalancing.",
    confidence: "85%",
    category: "Resources",
    actionable: true,
  },
  {
    id: 4,
    title: "Quality Trend Analysis",
    icon: "BarChart3",
    description:
      "Code quality metrics improved by 22% over the last sprint. Bug detection rate up by 15%.",
    confidence: "91%",
    category: "Quality",
    actionable: false,
  },
]

const recommendations = [
  {
    id: 1,
    title: "Implement Daily Standup Time Optimization",
    description:
      "Shift daily standups from 4 PM to 10 AM. Data shows team is more engaged and productive in the mornings.",
    impact: "High",
    effort: "Low",
    status: "pending",
    saving: "2.5 hours/week",
    adopted: 0,
  },
  {
    id: 2,
    title: "Code Review Pairing Program",
    description:
      "Pair senior developers with junior developers for code reviews. Will improve code quality by 18% and reduce review time.",
    impact: "High",
    effort: "Medium",
    status: "in-progress",
    saving: "4 hours/week",
    adopted: 0,
  },
  {
    id: 3,
    title: "Automate Repetitive Testing Tasks",
    description:
      "70% of manual testing can be automated. Implement test automation framework to reduce testing cycle time.",
    impact: "Critical",
    effort: "High",
    status: "pending",
    saving: "8 hours/week",
    adopted: 0,
  },
  {
    id: 4,
    title: "Team Skill Development Plan",
    description:
      "Three team members identified as having high potential for leadership roles. Recommend mentorship program.",
    impact: "Medium",
    effort: "Medium",
    status: "pending",
    saving: "Future leadership pipeline",
    adopted: 0,
  },
  {
    id: 5,
    title: "Documentation Automation",
    description:
      "Auto-generate API documentation from codebase. Reduces manual effort and keeps docs always in sync.",
    impact: "Medium",
    effort: "Low",
    status: "completed",
    saving: "3 hours/week",
    adopted: 1,
  },
]

const analytics = {
  metrics: [
    {
      title: "Team Velocity",
      value: "42 points/sprint",
      trend: "+8%",
      positive: true,
      metric: "last sprint vs average",
    },
    {
      title: "Code Quality Index",
      value: "8.7/10",
      trend: "+2.1%",
      positive: true,
      metric: "based on bug density",
    },
    {
      title: "Delivery Reliability",
      value: "94%",
      trend: "+3%",
      positive: true,
      metric: "on-time delivery rate",
    },
    {
      title: "Team Satisfaction",
      value: "4.5/5",
      trend: "-0.2%",
      positive: false,
      metric: "from weekly surveys",
    },
  ],
  predictions: [
    {
      title: "Sprint 4 Velocity Prediction",
      prediction: "45-48 points",
      confidence: "91%",
      details:
        "Based on current burn-down rate and historical velocity patterns",
    },
    {
      title: "Bug Count Forecast",
      prediction: "12-15 bugs",
      confidence: "87%",
      details: "Next sprint estimated defects based on code complexity",
    },
    {
      title: "Task Completion Rate",
      prediction: "96%",
      confidence: "89%",
      details: "Predicted % of tasks completed by sprint end",
    },
  ],
  mlModels: [
    {
      name: "Velocity Predictor",
      accuracy: "91%",
      dataPoints: "48 sprints",
      lastUpdate: "2026-03-13T08:00:00Z",
    },
    {
      name: "Bug Detection ML",
      accuracy: "87%",
      dataPoints: "1,240 bugs",
      lastUpdate: "2026-03-13T09:00:00Z",
    },
    {
      name: "Task Complexity Analyzer",
      accuracy: "89%",
      dataPoints: "5,200 tasks",
      lastUpdate: "2026-03-13T09:30:00Z",
    },
    {
      name: "Team Performance Index",
      accuracy: "85%",
      dataPoints: "2,100 data points",
      lastUpdate: "2026-03-13T09:15:00Z",
    },
  ],
  pipeline: {
    recordsPerHour: 847,
    uptime: "99.2%",
    avgProcessingMs: 87,
    dataQuality: "100%",
  },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const computeInsightStats = () => ({
  totalInsights: insights.length,
  avgConfidence:
    Math.round(
      insights.reduce(
        (sum, i) => sum + Number.parseFloat(i.confidence),
        0
      ) / insights.length
    ) + "%",
  actionableCount: insights.filter((i) => i.actionable).length,
  updateFrequency: "Last 24h",
})

const computeRecommendationStats = () => ({
  total: recommendations.length,
  implemented: recommendations.filter((r) => r.status === "completed").length,
  inProgress: recommendations.filter((r) => r.status === "in-progress").length,
  potentialSavings: "17.5h",
})

// ─── Handlers ─────────────────────────────────────────────────────────────────

const aiHandlers = [
  // GET /api/v1/ai/insights
  http.get("*/v1/ai/insights", () => {
    return HttpResponse.json({
      insights,
      stats: computeInsightStats(),
    })
  }),

  // GET /api/v1/ai/recommendations
  http.get("*/v1/ai/recommendations", () => {
    return HttpResponse.json({
      recommendations,
      stats: computeRecommendationStats(),
    })
  }),

  // GET /api/v1/ai/analytics
  http.get("*/v1/ai/analytics", () => {
    return HttpResponse.json(analytics)
  }),

  // PATCH /api/v1/ai/recommendations/:id
  http.patch("*/v1/ai/recommendations/:id", async ({ params, request }) => {
    const body = await request.json()
    const rec = recommendations.find(
      (r) => r.id === Number(params.id)
    )
    if (!rec) return new HttpResponse(null, { status: 404 })
    Object.assign(rec, body)
    return HttpResponse.json(rec)
  }),
  // AI Chat
  http.post("*/v1/ai/chat", async ({ request }) => {
    const body = await request.json()
    const userMessage = (body.message || "").toLowerCase()

    let reply =
      "I've analyzed the sprint data. Based on current progress, the team is on track to complete 85% of planned story points."
    if (userMessage.includes("blocker")) {
      reply =
        "I found 2 blockers: 1) Design specs pending for mobile screens (assigned to Bob). 2) API rate limit issue affecting integration tests. Recommend escalating both in today's standup."
    } else if (userMessage.includes("standup") || userMessage.includes("summarize")) {
      reply =
        "Standup Summary: 3/5 team members submitted updates. Alice completed the UI library setup. Bob is blocked on design specs. Charlie fixed the profile page bug. No updates from Dave and Eve yet."
    } else if (userMessage.includes("estimate") || userMessage.includes("velocity")) {
      reply =
        "Based on the last 3 sprints, average velocity is 52 points. Current sprint has 45 points planned with 60% completion at the midpoint — slightly ahead of pace."
    } else if (userMessage.includes("risk")) {
      reply =
        "Risk Assessment: 2 tasks are at risk. 'API Authentication' (8 pts) has been in progress for 4 days with no subtask completion. 'Mobile Layout' (5 pts) is blocked on design specs."
    }

    return HttpResponse.json({ reply })
  }),
]

export default aiHandlers
