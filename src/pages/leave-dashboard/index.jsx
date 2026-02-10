import { useEffect, useState } from "react"

import { toast } from "@/components/ui/use-toast"
import { useFetchMonthlyAttendance } from "@query/leave.query"

import LeaveCalendarUI from "./leave-calendar.ui"

/**
 * LeaveCalendar container — manages month navigation and fetches attendance data.
 */
const LeaveCalendar = () => {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())

  const { data, isLoading, isError, error } = useFetchMonthlyAttendance(year, month)

  const handlePrevMonth = () => {
    if (month === 0) {
      setMonth(11)
      setYear((y) => y - 1)
    } else {
      setMonth((m) => m - 1)
    }
  }

  const handleNextMonth = () => {
    const now = new Date()
    const isCurrentOrFuture =
      year > now.getFullYear() ||
      (year === now.getFullYear() && month >= now.getMonth())
    if (isCurrentOrFuture) return

    if (month === 11) {
      setMonth(0)
      setYear((y) => y + 1)
    } else {
      setMonth((m) => m + 1)
    }
  }

  const canGoNext = (() => {
    const now = new Date()
    return !(
      year > now.getFullYear() ||
      (year === now.getFullYear() && month >= now.getMonth())
    )
  })()

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load attendance data.",
        variant: "destructive",
      })
    }
  }, [error])

  return (
    <LeaveCalendarUI
      year={year}
      month={month}
      data={data}
      isLoading={isLoading}
      isError={isError}
      onPrevMonth={handlePrevMonth}
      onNextMonth={handleNextMonth}
      canGoNext={canGoNext}
    />
  )
}

export default LeaveCalendar
