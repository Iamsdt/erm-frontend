import { useState } from "react"

import { useAttendanceHistory } from "@query/attendance.query"

import HistoryUI from "./history.ui"

const now = new Date()

/**
 * AttendanceHistory — container for the employee attendance history page.
 */
const AttendanceHistory = () => {
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)

  const { data, isLoading, isError } = useAttendanceHistory(year, month)

  return (
    <HistoryUI
      data={data}
      isLoading={isLoading}
      isError={isError}
      year={year}
      month={month}
      onYearChange={setYear}
      onMonthChange={setMonth}
    />
  )
}

export default AttendanceHistory
