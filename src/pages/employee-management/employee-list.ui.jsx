import {
  Download,
  Edit,
  Mail,
  MailPlus,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  UserCheck,
  UserRound,
  Users,
  X,
} from "lucide-react"
import PropTypes from "prop-types"
import { useState } from "react"
import { Link } from "react-router-dom"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import ConfirmDialog from "@/components/ui/confirm-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
  exportEmployeesToCSV,
  exportEmployeesToJSON,
} from "@/lib/utils/employee-export"
import ct from "@constants/"
import { useFetchDepartments } from "@query/department.query"

// ─── Constants ───────────────────────────────────────────────────────────────

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
]

const STATUS_VARIANT_MAP = {
  active: "default",
  inactive: "secondary",
  invited: "outline",
}

// ─── Status badge helper ─────────────────────────────────────────────────────

const StatusBadge = ({ status }) => (
  <Badge
    variant={STATUS_VARIANT_MAP[status] ?? "secondary"}
    className="capitalize"
  >
    {status}
  </Badge>
)

StatusBadge.propTypes = { status: PropTypes.string.isRequired }

// ─── Loading skeleton ────────────────────────────────────────────────────────

const EmployeeRowSkeleton = () => (
  <div className="flex items-center gap-4 px-4 py-3 border-b last:border-0">
    <Skeleton className="h-4 w-4 rounded" />
    <Skeleton className="h-9 w-9 rounded-full" />
    <div className="flex-1 space-y-1.5">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-3 w-28" />
    </div>
    <Skeleton className="h-5 w-16 rounded-full" />
    <Skeleton className="h-8 w-8 rounded" />
  </div>
)

// ─── Stats card ──────────────────────────────────────────────────────────────

const StatsCard = ({ icon: Icon, label, value, isLoading }) => (
  <Card>
    <CardContent className="flex items-center gap-4 pt-6">
      <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        {isLoading ? (
          <Skeleton className="h-7 w-12 mb-1" />
        ) : (
          <p className="text-2xl font-bold">{value}</p>
        )}
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </CardContent>
  </Card>
)

StatsCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  isLoading: PropTypes.bool.isRequired,
}

// ─── Employee row ────────────────────────────────────────────────────────────

const EmployeeRow = ({
  employee,
  isSelected,
  onToggleSelect,
  onDelete,
  onSendInvite,
}) => {
  const initials = employee.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="flex items-center gap-4 px-4 py-3 border-b last:border-0 hover:bg-muted/30 transition-colors">
      <Checkbox
        checked={isSelected}
        onCheckedChange={() => onToggleSelect(employee.id)}
        aria-label={`Select ${employee.name}`}
      />

      <Avatar className="h-9 w-9">
        <AvatarFallback className="text-sm font-semibold bg-primary/10 text-primary">
          {initials}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{employee.name}</p>
        <p className="text-xs text-muted-foreground truncate">
          {employee.email}
        </p>
      </div>

      <div className="hidden sm:block text-xs text-muted-foreground w-28 truncate">
        {employee.department ?? "\u2014"}
      </div>

      <StatusBadge status={employee.status} />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link
              to={ct.route.employeeManagement.EDIT.replace(":id", employee.id)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSendInvite(employee.email)}>
            <Mail className="mr-2 h-4 w-4" />
            Send Invite Email
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => onDelete(employee.id)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Remove
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

EmployeeRow.propTypes = {
  employee: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    department: PropTypes.string,
    status: PropTypes.string.isRequired,
  }).isRequired,
  isSelected: PropTypes.bool.isRequired,
  onToggleSelect: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onSendInvite: PropTypes.func.isRequired,
}

// ─── Bulk action bar ─────────────────────────────────────────────────────────

const BulkActionBar = ({
  selectedCount,
  departments,
  onStatusChange,
  onDepartmentChange,
  onClearSelection,
}) => (
  <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 flex flex-wrap items-center gap-3 transition-all duration-200">
    <Badge variant="secondary" className="font-medium">
      {selectedCount} selected
    </Badge>

    <Select onValueChange={onStatusChange}>
      <SelectTrigger className="w-[160px] h-8 text-sm">
        <SelectValue placeholder="Change Status" />
      </SelectTrigger>
      <SelectContent>
        {STATUS_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>

    <Select onValueChange={onDepartmentChange}>
      <SelectTrigger className="w-[180px] h-8 text-sm">
        <SelectValue placeholder="Change Department" />
      </SelectTrigger>
      <SelectContent>
        {departments.map((department) => (
          <SelectItem key={department.id} value={department.name}>
            {department.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>

    <Button variant="ghost" size="sm" onClick={onClearSelection}>
      <X className="mr-1.5 h-3.5 w-3.5" />
      Clear Selection
    </Button>
  </div>
)

BulkActionBar.propTypes = {
  selectedCount: PropTypes.number.isRequired,
  departments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  onStatusChange: PropTypes.func.isRequired,
  onDepartmentChange: PropTypes.func.isRequired,
  onClearSelection: PropTypes.func.isRequired,
}

// ─── Employee list content ───────────────────────────────────────────────────

const EmployeeListContent = ({
  isLoading,
  isError,
  employees,
  hasSearch,
  selectedIds,
  onToggleSelect,
  onDelete,
  onSendInvite,
}) => {
  if (isError) {
    return (
      <p className="px-4 py-6 text-sm text-center text-destructive">
        Failed to load employees. Please try again.
      </p>
    )
  }

  if (isLoading) {
    return Array.from({ length: 5 }).map((_, index) => (
      // eslint-disable-next-line react/no-array-index-key
      <EmployeeRowSkeleton key={index} />
    ))
  }

  if (employees?.length === 0) {
    if (hasSearch) {
      return (
        <div className="text-center py-12">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <Search className="h-7 w-7 text-muted-foreground" />
          </div>
          <p className="text-base font-semibold">No matches found</p>
          <p className="mx-auto mt-2 max-w-xs text-sm text-muted-foreground">
            Try a different name or email
          </p>
        </div>
      )
    }

    return (
      <div className="text-center py-12">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <Users className="h-7 w-7 text-primary" />
        </div>
        <p className="text-base font-semibold">Your team starts here</p>
        <p className="mx-auto mt-2 max-w-xs text-sm text-muted-foreground">
          Add your first team member to get started.
        </p>
        <Button asChild size="sm" className="mt-5">
          <Link to={ct.route.employeeManagement.CREATE}>
            <Plus className="mr-1.5 h-4 w-4" />
            New Employee
          </Link>
        </Button>
      </div>
    )
  }

  const selectedIdSet = new Set(selectedIds)

  return employees?.map((emp) => (
    <EmployeeRow
      key={emp.id}
      employee={emp}
      isSelected={selectedIdSet.has(emp.id)}
      onToggleSelect={onToggleSelect}
      onDelete={onDelete}
      onSendInvite={onSendInvite}
    />
  ))
}

EmployeeListContent.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  isError: PropTypes.bool.isRequired,
  employees: PropTypes.array.isRequired,
  hasSearch: PropTypes.bool.isRequired,
  selectedIds: PropTypes.array.isRequired,
  onToggleSelect: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onSendInvite: PropTypes.func.isRequired,
}

// ─── Select All header ──────────────────────────────────────────────────────

const SelectAllHeader = ({ employees, selectedIds, onSelectedIdsChange }) => {
  const allSelected =
    employees.length > 0 && selectedIds.length === employees.length
  const someSelected = selectedIds.length > 0 && !allSelected

  const handleToggleAll = () => {
    if (allSelected) {
      onSelectedIdsChange([])
    } else {
      onSelectedIdsChange(employees.map((emp) => emp.id))
    }
  }

  return (
    <div className="flex items-center gap-2 px-4 py-2 border-b bg-muted/20">
      <Checkbox
        checked={allSelected || (someSelected && "indeterminate")}
        onCheckedChange={handleToggleAll}
        aria-label="Select all employees"
      />
      <span className="text-xs text-muted-foreground">Select all</span>
    </div>
  )
}

SelectAllHeader.propTypes = {
  employees: PropTypes.array.isRequired,
  selectedIds: PropTypes.array.isRequired,
  onSelectedIdsChange: PropTypes.func.isRequired,
}

// ─── Page header ─────────────────────────────────────────────────────────────

const PageHeader = ({ employees }) => (
  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Employee Management</h1>
      <p className="text-sm text-muted-foreground mt-0.5">
        Manage your organisation&apos;s employees
      </p>
    </div>
    <div className="flex gap-2 flex-wrap">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Download className="mr-1.5 h-4 w-4" />
            Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => exportEmployeesToCSV(employees)}>
            Export as CSV
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => exportEmployeesToJSON(employees)}>
            Export as JSON
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button asChild variant="outline" size="sm">
        <Link to={ct.route.employeeManagement.INVITE}>
          <MailPlus className="mr-1.5 h-4 w-4" />
          Invite User
        </Link>
      </Button>
      <Button asChild size="sm">
        <Link to={ct.route.employeeManagement.CREATE}>
          <Plus className="mr-1.5 h-4 w-4" />
          New Employee
        </Link>
      </Button>
    </div>
  </div>
)

PageHeader.propTypes = {
  employees: PropTypes.array.isRequired,
}

// ─── Stats row ───────────────────────────────────────────────────────────────

const StatsRow = ({ stats, isLoading }) => (
  <div className="grid gap-4 grid-cols-2 sm:grid-cols-3">
    <StatsCard
      icon={Users}
      label="Total Employees"
      value={stats?.total}
      isLoading={isLoading}
    />
    <StatsCard
      icon={UserCheck}
      label="Active"
      value={stats?.active}
      isLoading={isLoading}
    />
    <StatsCard
      icon={UserRound}
      label="Pending Invite"
      value={stats?.invited}
      isLoading={isLoading}
    />
  </div>
)

StatsRow.propTypes = {
  stats: PropTypes.shape({
    total: PropTypes.number,
    active: PropTypes.number,
    invited: PropTypes.number,
  }),
  isLoading: PropTypes.bool.isRequired,
}

StatsRow.defaultProps = {
  stats: undefined,
}

// ─── List card header ────────────────────────────────────────────────────────

const ListCardHeader = ({
  employeeCount,
  isLoading,
  search,
  onSearchChange,
  hasSelection,
  selectedIds,
  departments,
  onBulkStatusChange,
  onBulkDepartmentChange,
  onClearSelection,
}) => {
  const recordLabel = isLoading ? "Loading\u2026" : `${employeeCount} records`

  return (
    <CardHeader className="pb-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="text-base">All Employees</CardTitle>
          <CardDescription className="text-xs mt-0.5">
            {recordLabel}
          </CardDescription>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search by name or email\u2026"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            className="pl-8 h-8 text-sm"
          />
        </div>
      </div>

      {hasSelection && (
        <BulkActionBar
          selectedCount={selectedIds.length}
          departments={departments}
          onStatusChange={onBulkStatusChange}
          onDepartmentChange={onBulkDepartmentChange}
          onClearSelection={onClearSelection}
        />
      )}
    </CardHeader>
  )
}

ListCardHeader.propTypes = {
  employeeCount: PropTypes.number.isRequired,
  isLoading: PropTypes.bool.isRequired,
  search: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  hasSelection: PropTypes.bool.isRequired,
  selectedIds: PropTypes.array.isRequired,
  departments: PropTypes.array.isRequired,
  onBulkStatusChange: PropTypes.func.isRequired,
  onBulkDepartmentChange: PropTypes.func.isRequired,
  onClearSelection: PropTypes.func.isRequired,
}

// ─── Main UI ─────────────────────────────────────────────────────────────────

const EmployeeListUI = ({
  employees,
  stats,
  isLoading,
  isError,
  search,
  onSearchChange,
  onSendInvite,
  onDelete,
  selectedIds,
  onSelectedIdsChange,
  onBulkStatusChange,
  onBulkDepartmentChange,
}) => {
  const [pendingDeleteId, setPendingDeleteId] = useState(null)
  const { data: departmentData } = useFetchDepartments()
  const departments = departmentData?.departments ?? []
  const hasSelection = selectedIds.length > 0
  const showSelectAll = !isLoading && !isError && employees?.length > 0

  const handleToggleSelect = (id) => {
    onSelectedIdsChange((previous) =>
      previous.includes(id)
        ? previous.filter((selectedId) => selectedId !== id)
        : [...previous, id]
    )
  }

  return (
    <div className="space-y-6 p-6">
      <PageHeader employees={employees} />
      <StatsRow stats={stats} isLoading={isLoading} />

      <Card>
        <ListCardHeader
          employeeCount={employees?.length ?? 0}
          isLoading={isLoading}
          search={search}
          onSearchChange={onSearchChange}
          hasSelection={hasSelection}
          selectedIds={selectedIds}
          departments={departments}
          onBulkStatusChange={onBulkStatusChange}
          onBulkDepartmentChange={onBulkDepartmentChange}
          onClearSelection={() => onSelectedIdsChange([])}
        />

        <CardContent className="p-0">
          {showSelectAll && (
            <SelectAllHeader
              employees={employees}
              selectedIds={selectedIds}
              onSelectedIdsChange={onSelectedIdsChange}
            />
          )}
          <EmployeeListContent
            isLoading={isLoading}
            isError={isError}
            employees={employees}
            hasSearch={Boolean(search.trim())}
            selectedIds={selectedIds}
            onToggleSelect={handleToggleSelect}
            onDelete={setPendingDeleteId}
            onSendInvite={onSendInvite}
          />
        </CardContent>
      </Card>

      <ConfirmDialog
        open={Boolean(pendingDeleteId)}
        onOpenChange={(open) => !open && setPendingDeleteId(null)}
        title="Remove employee?"
        description="This action cannot be undone. The employee record will be permanently deleted."
        confirmLabel="Remove"
        onConfirm={() => onDelete(pendingDeleteId)}
        isDestructive
      />
    </div>
  )
}

EmployeeListUI.propTypes = {
  employees: PropTypes.array.isRequired,
  stats: PropTypes.shape({
    total: PropTypes.number,
    active: PropTypes.number,
    invited: PropTypes.number,
  }).isRequired,
  isLoading: PropTypes.bool.isRequired,
  isError: PropTypes.bool.isRequired,
  search: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  onSendInvite: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  selectedIds: PropTypes.array.isRequired,
  onSelectedIdsChange: PropTypes.func.isRequired,
  onBulkStatusChange: PropTypes.func.isRequired,
  onBulkDepartmentChange: PropTypes.func.isRequired,
}

export default EmployeeListUI
