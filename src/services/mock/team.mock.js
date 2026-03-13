import { http, HttpResponse } from "msw"

// ─── Constants ───────────────────────────────────────────────────────────────

const TEAM_API_PATH = "*/v1/teams"

// ─── Seed data ───────────────────────────────────────────────────────────────

let teams = [
  {
    id: "team-core-engineering",
    name: "Core Engineering",
    leadId: "",
    memberIds: [],
    responsibilities: {
      attendance: "manager",
      leaveManagement: "manager",
      employeeManagement: "viewer",
      projectManagement: "admin",
      policyManagement: "editor",
      rewardsManagement: "editor",
    },
  },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Generates a URL-friendly team ID from a team name.
 * @param {string} name - The team name
 * @returns {string} Generated team ID
 */
const generateTeamId = (name) => {
  const normalized = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
  return `team-${normalized || "new-team"}`
}

// ─── Handlers ────────────────────────────────────────────────────────────────

const teamHandlers = [
  // GET /api/v1/teams
  http.get(TEAM_API_PATH, () => {
    return HttpResponse.json({ teams })
  }),

  // POST /api/v1/teams
  http.post(TEAM_API_PATH, async ({ request }) => {
    const body = await request.json()
    const newTeam = {
      id: generateTeamId(body.name),
      name: body.name,
      leadId: body.leadId || "",
      memberIds: body.memberIds || [],
      responsibilities: {
        attendance: "viewer",
        leaveManagement: "viewer",
        employeeManagement: "none",
        projectManagement: "viewer",
        policyManagement: "viewer",
        rewardsManagement: "viewer",
      },
    }
    teams = [...teams, newTeam]
    return HttpResponse.json({ team: newTeam }, { status: 201 })
  }),

  // DELETE /api/v1/teams/:id
  http.delete(`${TEAM_API_PATH}/:id`, ({ params }) => {
    const index = teams.findIndex((team) => team.id === params.id)
    if (index === -1) {
      return new HttpResponse(null, { status: 404 })
    }
    teams.splice(index, 1)
    return new HttpResponse(null, { status: 204 })
  }),

  // DELETE /api/v1/teams/:id/members/:memberId
  http.delete(`${TEAM_API_PATH}/:id/members/:memberId`, ({ params }) => {
    const team = teams.find((t) => t.id === params.id)
    if (!team) {
      return new HttpResponse(null, { status: 404 })
    }
    team.memberIds = team.memberIds.filter((m) => m !== params.memberId)
    return HttpResponse.json({ team })
  }),

  // PATCH /api/v1/teams/:id/responsibilities
  http.patch(
    `${TEAM_API_PATH}/:id/responsibilities`,
    async ({ params, request }) => {
      const body = await request.json()
      const index = teams.findIndex((team) => team.id === params.id)
      if (index === -1) {
        return new HttpResponse(null, { status: 404 })
      }
      teams[index] = {
        ...teams[index],
        responsibilities: { ...teams[index].responsibilities, ...body },
      }
      return HttpResponse.json({ team: teams[index] })
    }
  ),
]

export default teamHandlers
