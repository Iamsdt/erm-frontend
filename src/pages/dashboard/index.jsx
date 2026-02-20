import { useEffect, useMemo, useState } from "react"

import CommentCard from "@/components/comments/comment-card"
import { toast } from "@/components/ui/use-toast"
import { useAttendanceStatus } from "@query/attendance.query"
import { useFetchComments } from "@query/comments.query"

import DashboardUI from "./dashboard.ui"

/**
 * Dashboard component that displays dashboard widgets and comments
 */
const Dashboard = () => {
  const { data, isError, isLoading, error } = useFetchComments()
  const { data: attendanceStatus, isLoading: attendanceLoading } =
    useAttendanceStatus()

  const [currentPage, setCurrentPage] = useState(1)
  const commentsPerPage = 4

  const displayComments = useMemo(() => {
    if (!data || !Array.isArray(data)) {
      return (
        <p className="text-xl px-5 py-5 text-black">No Data Found for User</p>
      )
    }

    const startIndex = (currentPage - 1) * commentsPerPage
    const selectedComments = data.slice(
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
  }, [data, currentPage])

  const handleNextPage = () => {
    setCurrentPage((np) => np + 1)
  }

  const handlePreviousPage = () => {
    setCurrentPage((pp) => Math.max(pp - 1, 1))
  }

  const canGoNext =
    Array.isArray(data) && currentPage * commentsPerPage < data.length

  const totalComments = Array.isArray(data) ? data.length : 0

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      })
    }
  }, [error])

  return (
    <DashboardUI
      isLoading={isLoading}
      isError={isError}
      displayComments={displayComments}
      currentPage={currentPage}
      onPreviousPage={handlePreviousPage}
      onNextPage={handleNextPage}
      canGoNext={canGoNext}
      totalComments={totalComments}
      attendanceStatus={attendanceStatus}
      attendanceLoading={attendanceLoading}
    />
  )
}

export default Dashboard
