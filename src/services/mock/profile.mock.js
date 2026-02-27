import { http, HttpResponse } from "msw"

// ─── Seed data ────────────────────────────────────────────────────────────────

let profile = {
    id: 1,
    name: "Alice Johnson",
    email: "alice@example.com",
    phone: "+1 555 000 0001",
    bio: "Senior software engineer with a passion for building great products.",
    jobTitle: "Senior Software Engineer",
    department: "Engineering",
    role: "employee",
    joinDate: "2022-03-01",
    avatarUrl: null,
}

// ─── Handlers ─────────────────────────────────────────────────────────────────

const profileHandlers = [
    // GET /api/profile/me/
    http.get("*/profile/me/", () => {
        return HttpResponse.json(profile)
    }),

    // PATCH /api/profile/me/
    http.patch("*/profile/me/", async ({ request }) => {
        const body = await request.json()
        profile = { ...profile, ...body }
        return HttpResponse.json(profile)
    }),

    // POST /api/profile/change-password/
    http.post("*/profile/change-password/", async ({ request }) => {
        const { currentPassword, newPassword } = await request.json()
        if (!currentPassword || !newPassword) {
            return HttpResponse.json(
                { error: "Both fields are required." },
                { status: 400 }
            )
        }
        return HttpResponse.json({ message: "Password changed successfully." })
    }),
]

export default profileHandlers
