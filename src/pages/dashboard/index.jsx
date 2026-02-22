import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"

import CommentCard from "@/components/comments/comment-card"
import { toast } from "@/components/ui/use-toast"
import { useFetchComments } from "@query/comments.query"
import { useAttendanceStatus, useTodayAttendance, useClockIn } from "@query/attendance.query"
import { useGetProjects } from "@query/project.query"
import { useFetchAdminLeaveSummary } from "@query/leave.query"
import { useFetchEmployees } from "@query/employee-management.query"

import DashboardUI from "./dashboard.ui"

/**
 * Dashboard component that displays dashboard widgets and comments
 */
const Dashboard = () => {
  const navigate = useNavigate()

  // Fetch data
  const { data: commentsData, isError: commentsError, isLoading: commentsLoading, error } = useFetchComments()
  const { data: attendanceStatus, isLoading: statusLoading } = useAttendanceStatus()
  const { data: todayAttendance, isLoading: todayLoading } = useTodayAttendance()
  const { data: projectsData, isLoading: projectsLoading } = useGetProjects()
  const { data: leaveSummary, isLoading: leaveLoading } = useFetchAdminLeaveSummary()
  const { data: employeesData, isLoading: employeesLoading } = useFetchEmployees()

  const { mutate: clockIn } = useClockIn()

  const [currentPage, setCurrentPage] = useState(1)
  const commentsPerPage = 4

  const displayComments = useMemo(() => {
    if (!commentsData || !Array.isArray(commentsData)) {
      return (
        <p className="text-xl px-5 py-5 text-black">No Data Found for User</p>
      )
    }

    const startIndex = (currentPage - 1) * commentsPerPage
    const selectedComments = commentsData.slice(
      startIndex,
      startIndex + commentsPerPage
    )

    return selectedComments.map((comment) => (
      <div key={comment.id}>
        <CommentCard
          email={comment.email}
          body={comment.body}
          name={comment.name}
          avatar={comment.avatar}
          date={comment.date}
          likes={comment.likes}
        />
      </div>
    ))
  }, [commentsData, currentPage])

  const handleNextPage = () => {
    setCurrentPage((np) => np + 1)
  }

  const handlePreviousPage = () => {
    setCurrentPage((pp) => Math.max(pp - 1, 1))
  }

  const canGoNext =
    Array.isArray(commentsData) && currentPage * commentsPerPage < commentsData.length

  const handleClockIn = () => {
    clockIn(undefined, {
      onSuccess: () => {
        toast({ title: "Clocked in successfully" })
      },
      onError: () => {
        toast({ title: "Failed to clock in", variant: "destructive" })
      }
    })
  }

  const handleGoToAttendance = () => {
    navigate("/attendance")
  }

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      })
    }
  }, [error])

  const isLoading = commentsLoading || statusLoading || todayLoading || projectsLoading || leaveLoading || employeesLoading

  return (
    <DashboardUI
      isLoading={isLoading}
      isError={commentsError}
      displayComments={displayComments}
      currentPage={currentPage}
      onPreviousPage={handlePreviousPage}
      onNextPage={handleNextPage}
      canGoNext={canGoNext}
      
      attendanceStatus={attendanceStatus}
      todayAttendance={todayAttendance}
      onClockIn={handleClockIn}
      onGoToAttendance={handleGoToAttendance}
      
      projects={projectsData}
      leaveSummary={leaveSummary}
      employees={employeesData}
    />
  )
}

export default Dashboard
