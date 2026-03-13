import { useState } from "react"

import { useFetchAuditLog } from "@query/audit.query"

import AuditUI from "./audit.ui"

/**
 * AuditPage — container for the activity log page.
 * Manages filter state and passes data to the presenter.
 */
const AuditPage = () => {
  const [moduleFilter, setModuleFilter] = useState("all")
  const [actionFilter, setActionFilter] = useState("all")

  const filters = {
    ...(moduleFilter !== "all" && { module: moduleFilter }),
    ...(actionFilter !== "all" && { action: actionFilter }),
  }

  const { data, isLoading, isError } = useFetchAuditLog(filters)

  const entries = data?.entries ?? []

  return (
    <AuditUI
      entries={entries}
      isLoading={isLoading}
      isError={isError}
      moduleFilter={moduleFilter}
      actionFilter={actionFilter}
      onModuleFilterChange={setModuleFilter}
      onActionFilterChange={setActionFilter}
    />
  )
}

export default AuditPage
