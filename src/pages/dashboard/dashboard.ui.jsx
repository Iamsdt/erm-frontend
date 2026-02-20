import PropTypes from "prop-types"

import ClockStatusWidget from "@/components/attendance/clock-status-widget"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

// ─── Sub-components ───────────────────────────────────────────────────────────

/**
 * StatsWidgets — displays dashboard stat cards
 * @param {{isLoading: boolean, totalComments: number, currentPage: number}} props - Props for the stats widgets
 * @param {boolean} props.isLoading - Whether the stats data is currently loading
 * @param {number} props.totalComments - The total number of comments
 * @param {number} props.currentPage - The current page number
 */
const StatsWidgets = ({ isLoading, totalComments, currentPage }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    {/* Widget 1: Total Comments */}
    <div className="bg-white dark:bg-slate-900 shadow rounded-xl p-6 flex flex-col items-start">
      <span className="text-slate-500 dark:text-slate-400 text-xs mb-2">
        Total Comments
      </span>
      <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">
        {isLoading ? "..." : totalComments}
      </span>
    </div>
    {/* Widget 2: Active Users */}
    <div className="bg-white dark:bg-slate-900 shadow rounded-xl p-6 flex flex-col items-start">
      <span className="text-slate-500 dark:text-slate-400 text-xs mb-2">
        Active Users
      </span>
      <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">
        12
      </span>
    </div>
    {/* Widget 3: Profile */}
    <div className="bg-white dark:bg-slate-900 shadow rounded-xl p-6 flex flex-col items-start">
      <span className="text-slate-500 dark:text-slate-400 text-xs mb-2">
        Profile
      </span>
      <span className="text-slate-800 dark:text-slate-100 font-medium">
        User
      </span>
    </div>
    {/* Widget 4: Current Page */}
    <div className="bg-white dark:bg-slate-900 shadow rounded-xl p-6 flex flex-col items-start">
      <span className="text-slate-500 dark:text-slate-400 text-xs mb-2">
        Current Page
      </span>
      <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">
        {currentPage}
      </span>
    </div>
  </div>
)

StatsWidgets.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  totalComments: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
}

/**
 * CommentsSection — displays comments with pagination
 * @param {object} props - Component props.
 * @param {boolean} props.isLoading - Whether the comments are currently loading.
 * @param {boolean} props.isError - Whether there was an error loading the comments.
 * @param {Array} props.displayComments - The rendered comment components to display.
 * @param {number} props.currentPage - The current page number of comments being displayed.
 * @param {boolean} props.canGoNext - Whether there are more comments to load for the next page.
 * @param {() => void} props.onPreviousPage - Callback function to go to the previous page of comments.
 * @param {() => void} props.onNextPage - Callback function to go to the next page of comments.
 */
const CommentsSection = ({
  isLoading,
  isError,
  displayComments,
  currentPage,
  canGoNext,
  onPreviousPage,
  onNextPage,
}) => {
  const showPagination = !isLoading && !isError

  return (
    <div>
      <div className="flex flex-col items-center py-8">
        <div className="flex items-center gap-3">
          <svg
            className="w-8 h-8 text-amber-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 8h2a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8a2 2 0 012-2h2M12 12v.01M12 16h.01M8 12h.01M16 12h.01M12 8h.01"
            />
          </svg>
          <h2 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100 tracking-tight">
            Community Comments
          </h2>
        </div>
        <span className="mt-2 text-base text-gray-500 dark:text-gray-400">
          See what others are saying and join the conversation!
        </span>
        <div className="w-24 h-1 mt-4 rounded-full bg-linear-to-r from-amber-400 via-amber-500 to-yellow-400" />
      </div>

      {isLoading && (
        <div className="text-center py-8 text-slate-600 dark:text-slate-400">
          Loading comments...
        </div>
      )}

      {isError && (
        <div className="text-center py-8 text-red-600 dark:text-red-400">
          Something went wrong
        </div>
      )}

      {showPagination && (
        <>
          <div className="flex flex-wrap justify-center">{displayComments}</div>
          <div className="flex justify-center space-x-4 mt-5">
            <Button
              className="m-5"
              onClick={onPreviousPage}
              disabled={currentPage === 1}
            >
              Prev
            </Button>
            <Button className="m-5" onClick={onNextPage} disabled={!canGoNext}>
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

CommentsSection.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  isError: PropTypes.bool.isRequired,
  displayComments: PropTypes.any,
  currentPage: PropTypes.number.isRequired,
  canGoNext: PropTypes.bool.isRequired,
  onPreviousPage: PropTypes.func.isRequired,
  onNextPage: PropTypes.func.isRequired,
}

CommentsSection.defaultProps = {
  displayComments: null,
}

// ─── Main component ───────────────────────────────────────────────────────────

/**
 * DashboardUI — main dashboard presenter component.
 * Displays clock status widget, stats, and community comments with pagination.
 * @param {object} props - Component props.
 * @param {boolean} props.isLoading - Whether comment data is loading.
 * @param {boolean} props.isError - Whether there was an error loading comments.
 * @param {Array} props.displayComments - Rendered comment components.
 * @param {number} props.currentPage - Current page of comments.
 * @param {() => void} props.onPreviousPage - Callback to go to previous page.
 * @param {() => void} props.onNextPage - Callback to go to next page.
 * @param {boolean} props.canGoNext - Whether more comments exist for next page.
 * @param {number} props.totalComments - Total number of comments.
 * @param {object} props.attendanceStatus - Current attendance/clock status.
 * @param {boolean} props.attendanceStatus.isClocked - Whether currently clocked in.
 * @param {string} props.attendanceStatus.clockedInAt - ISO timestamp of clock-in.
 * @param {number} props.attendanceStatus.elapsedSeconds - Seconds since clock-in.
 * @param {boolean} props.attendanceStatus.willAutoExpire - Whether session will auto-expire soon.
 * @param {number} props.attendanceStatus.todayTotalMinutes - Total work minutes today.
 * @param {boolean} props.attendanceLoading - Whether attendance status is loading.
 */

const DashboardUI = ({
  isLoading,
  isError,
  displayComments,
  currentPage,
  onPreviousPage,
  onNextPage,
  canGoNext,
  totalComments,
  attendanceStatus,
  attendanceLoading,
}) => {
  return (
    <div className="bg-linear-to-br from-slate-100 to-slate-300 dark:from-slate-900 dark:to-slate-800 p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
            Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Overview & quick stats
          </p>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Clock Status Widget */}
          <div className="lg:col-span-2">
            <ClockStatusWidget
              isClocked={attendanceStatus?.isClocked ?? false}
              clockedInAt={attendanceStatus?.clockedInAt}
              elapsedSeconds={attendanceStatus?.elapsedSeconds}
              willAutoExpire={attendanceStatus?.willAutoExpire ?? false}
              todayTotalMinutes={attendanceStatus?.todayTotalMinutes ?? 0}
              isLoading={attendanceLoading}
            />
          </div>
          <StatsWidgets
            isLoading={isLoading}
            totalComments={totalComments}
            currentPage={currentPage}
          />
        </div>

        <Separator className="my-8" />

        {/* Comments Section */}
        <CommentsSection
          isLoading={isLoading}
          isError={isError}
          displayComments={displayComments}
          currentPage={currentPage}
          canGoNext={canGoNext}
          onPreviousPage={onPreviousPage}
          onNextPage={onNextPage}
        />
      </div>
    </div>
  )
}

DashboardUI.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  isError: PropTypes.bool.isRequired,
  displayComments: PropTypes.node,
  currentPage: PropTypes.number.isRequired,
  onPreviousPage: PropTypes.func.isRequired,
  onNextPage: PropTypes.func.isRequired,
  canGoNext: PropTypes.bool.isRequired,
  totalComments: PropTypes.number.isRequired,
  attendanceStatus: PropTypes.shape({
    isClocked: PropTypes.bool,
    clockedInAt: PropTypes.string,
    elapsedSeconds: PropTypes.number,
    willAutoExpire: PropTypes.bool,
    todayTotalMinutes: PropTypes.number,
  }),
  attendanceLoading: PropTypes.bool,
}

DashboardUI.defaultProps = {
  displayComments: null,
  attendanceStatus: null,
  attendanceLoading: false,
}

export default DashboardUI
