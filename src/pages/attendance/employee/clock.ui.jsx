import PropTypes from "prop-types"

import AutoExpiryBanner from "./components/auto-expiry-banner"
import ClockCard from "./components/clock-card"
import ClockOutDialog from "./components/clock-out-dialog"
import SessionTable from "./components/session-table"

/**
/**
 * ClockUI — Presenter layer for the employee attendance clock page.
 * @param {object} props - Component props.
 * @param {object} [props.status] - Current attendance status object.
 * @param {boolean} props.statusLoading - Whether status is loading.
 * @param {object} [props.todayData] - Today's attendance data.
 * @param {boolean} props.todayLoading - Whether today's data is loading.
 * @param {boolean} props.clockOutDialogOpen - Whether the clock out dialog is open.
 * @param {boolean} props.isMutating - Whether a clock in/out operation is in progress.
 * @param {() => void} props.onClockIn - Callback to clock in.
 * @param {() => void} props.onOpenClockOutDialog - Callback to open clock out dialog.
 * @param {() => void} props.onCloseClockOutDialog - Callback to close clock out dialog.
 * @param {(summary: string) => void} props.onClockOutConfirm - Callback to confirm clock out with summary.
 */
const ClockUI = ({
  status,
  statusLoading,
  todayData,
  todayLoading,
  clockOutDialogOpen,
  isMutating,
  onClockIn,
  onOpenClockOutDialog,
  onCloseClockOutDialog,
  onClockOutConfirm,
}) => {
  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-4 p-4 md:p-6">
      <h1 className="text-2xl font-bold">Attendance</h1>

      {/* Auto-expiry warning banner */}
      {status?.isClocked && status?.willAutoExpire && (
        <AutoExpiryBanner
          expiresInSeconds={status.expiresInSeconds}
          onClockOut={onOpenClockOutDialog}
        />
      )}

      {/* Primary clock card */}
      <ClockCard
        status={status}
        isLoading={statusLoading}
        onClockIn={onClockIn}
        onClockOut={onOpenClockOutDialog}
        isMutating={isMutating}
      />

      {/* Today's sessions */}
      <SessionTable todayData={todayData} isLoading={todayLoading} />

      {/* Clock-out dialog with work summary */}
      <ClockOutDialog
        open={clockOutDialogOpen}
        onClose={onCloseClockOutDialog}
        onConfirm={onClockOutConfirm}
        isLoading={isMutating}
      />
    </div>
  )
}

ClockUI.propTypes = {
  status: PropTypes.object,
  statusLoading: PropTypes.bool.isRequired,
  todayData: PropTypes.object,
  todayLoading: PropTypes.bool.isRequired,
  clockOutDialogOpen: PropTypes.bool.isRequired,
  isMutating: PropTypes.bool.isRequired,
  onClockIn: PropTypes.func.isRequired,
  onOpenClockOutDialog: PropTypes.func.isRequired,
  onCloseClockOutDialog: PropTypes.func.isRequired,
  onClockOutConfirm: PropTypes.func.isRequired,
}

ClockUI.defaultProps = {
  status: null,
  todayData: null,
}

export default ClockUI
