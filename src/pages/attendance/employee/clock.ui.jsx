import PropTypes from "prop-types"

import AutoExpiryBanner from "./components/auto-expiry-banner"
import ClockCard from "./components/clock-card"
import ClockOutDialog from "./components/clock-out-dialog"
import SessionTable from "./components/session-table"

/**
 * ClockUI — Presenter layer for the employee attendance clock page.
 * @param {object} props
 * @param {object} [props.status]
 * @param {boolean} props.statusLoading
 * @param {object} [props.todayData]
 * @param {boolean} props.todayLoading
 * @param {boolean} props.clockOutDialogOpen
 * @param {boolean} props.isMutating
 * @param {Function} props.onClockIn
 * @param {Function} props.onOpenClockOutDialog
 * @param {Function} props.onCloseClockOutDialog
 * @param {Function} props.onClockOutConfirm
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
