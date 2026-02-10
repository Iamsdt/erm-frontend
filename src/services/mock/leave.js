import { http, HttpResponse } from "msw"

/**
 * Generates realistic attendance data for every day of a given month/year.
 * @param {number} year
 * @param {number} month - 0-indexed (0=Jan)
 * @returns {Array}
 */
const generateMonthAttendance = (year, month) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const totalEmployees = 65
  const records = []

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day)
    const dayOfWeek = date.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

    if (isWeekend) {
      records.push({
        date: date.toISOString().split("T")[0],
        isWeekend: true,
        present: 0,
        absent: 0,
        onLeave: 0,
        total: totalEmployees,
      })
      continue
    }

    // Simulate variance across days
    const onLeave = Math.floor(Math.random() * 12) + 3
    const absent = Math.floor(Math.random() * 6) + 1
    const present = totalEmployees - onLeave - absent

    records.push({
      date: date.toISOString().split("T")[0],
      isWeekend: false,
      present,
      absent,
      onLeave,
      total: totalEmployees,
    })
  }

  return records
}

const leaveAttendanceMock = http.get("*/leave/attendance/", ({ request }) => {
  const url = new URL(request.url)
  const year =
    parseInt(url.searchParams.get("year")) || new Date().getFullYear()
  const month = parseInt(url.searchParams.get("month")) || new Date().getMonth()

  const records = generateMonthAttendance(year, month)

  return HttpResponse.json({
    year,
    month,
    totalEmployees: 65,
    records,
  })
})

const handlers = [leaveAttendanceMock]

export default handlers
