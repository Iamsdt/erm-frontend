/* eslint-disable react/jsx-handler-names */
import PropTypes from "prop-types"

import ClockStatusWidget from "@/components/attendance/clock-status-widget"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

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

        <Separator className="my-8" />

        {/* Comments Section */}
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

          {!isLoading && !isError && (
            <>
              <div className="flex flex-wrap justify-center">
                {displayComments}
              </div>
              <div className="flex justify-center space-x-4 mt-5">
                <Button
                  className="m-5"
                  onClick={onPreviousPage}
                  disabled={currentPage === 1}
                >
                  Prev
                </Button>
                <Button
                  className="m-5"
                  onClick={onNextPage}
                  disabled={!canGoNext}
                >
                  Next
                </Button>
              </div>
            </>
          )}
        </div>
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
