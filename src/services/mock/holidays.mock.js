import { http, HttpResponse } from "msw"

const holidays = [
  { date: "2026-01-01", name: "New Year's Day" },
  { date: "2026-01-14", name: "Pongal / Makar Sankranti" },
  { date: "2026-01-26", name: "Republic Day" },
  { date: "2026-03-10", name: "Maha Shivaratri" },
  { date: "2026-03-17", name: "Holi" },
  { date: "2026-04-02", name: "Ram Navami" },
  { date: "2026-04-03", name: "Good Friday" },
  { date: "2026-05-01", name: "May Day" },
  { date: "2026-08-15", name: "Independence Day" },
  { date: "2026-10-02", name: "Gandhi Jayanti" },
  { date: "2026-10-20", name: "Dussehra" },
  { date: "2026-11-09", name: "Diwali" },
  { date: "2026-12-25", name: "Christmas" },
]

const holidayHandlers = [
  http.get("*/v1/holidays", () => {
    return HttpResponse.json({ holidays })
  }),
]

export default holidayHandlers
