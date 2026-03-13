import { useMemo, useState } from "react"

import { toast } from "@/components/ui/use-toast"
import useDebounce from "@/hooks/use-debounce"
import { resetPassword } from "@/lib/firebase"
import {
  useBulkUpdateDepartment,
  useBulkUpdateStatus,
  useDeleteEmployee,
  useFetchEmployees,
} from "@query/employee-management.query"

import EmployeeListUI from "./employee-list.ui"

/**
 * EmployeeList container — fetches the employee list and handles search/delete/bulk ops.
 */
const EmployeeList = () => {
  const [search, setSearch] = useState("")
  const [selectedIds, setSelectedIds] = useState([])
  const debouncedSearch = useDebounce(search, 300)

  const { data, isLoading, isError, error } = useFetchEmployees()
  const { mutate: deleteEmployee } = useDeleteEmployee()
  const { mutate: bulkUpdateStatus } = useBulkUpdateStatus()
  const { mutate: bulkUpdateDepartment } = useBulkUpdateDepartment()

  const employees = useMemo(() => {
    const list = data?.employees ?? []
    if (!debouncedSearch.trim()) return list
    const lower = debouncedSearch.toLowerCase()
    return list.filter(
      (employee) =>
        employee.name.toLowerCase().includes(lower) ||
        employee.email.toLowerCase().includes(lower)
    )
  }, [data, debouncedSearch])

  const handleSendInvite = async (email) => {
    try {
      await resetPassword(email)
      toast({
        title: "Invite sent",
        description: `Password setup email sent to ${email}.`,
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to send invite email. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = (id) => {
    deleteEmployee(id, {
      onSuccess: () => {
        toast({ title: "Employee removed", description: "Record deleted." })
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to remove employee.",
          variant: "destructive",
        })
      },
    })
  }

  const handleBulkStatusChange = (status) => {
    bulkUpdateStatus(
      { ids: selectedIds, status },
      { onSuccess: () => setSelectedIds([]) }
    )
  }

  const handleBulkDepartmentChange = (department) => {
    bulkUpdateDepartment(
      { ids: selectedIds, department },
      { onSuccess: () => setSelectedIds([]) }
    )
  }

  return (
    <EmployeeListUI
      employees={employees}
      stats={data?.stats}
      isLoading={isLoading}
      isError={isError || Boolean(error)}
      search={search}
      onSearchChange={setSearch}
      onSendInvite={handleSendInvite}
      onDelete={handleDelete}
      selectedIds={selectedIds}
      onSelectedIdsChange={setSelectedIds}
      onBulkStatusChange={handleBulkStatusChange}
      onBulkDepartmentChange={handleBulkDepartmentChange}
    />
  )
}

export default EmployeeList
