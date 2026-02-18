import {
  Building2,
  Edit,
  MoreHorizontal,
  Plus,
  Trash2,
  Users,
} from "lucide-react"
import PropTypes from "prop-types"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"

// ─── Color map ───────────────────────────────────────────────────────────────

const COLOR_MAP = {
  blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  purple:
    "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  green:
    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  yellow:
    "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
  orange:
    "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
  red: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  slate:
    "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
}

const COLOR_DOT = {
  blue: "bg-blue-500",
  purple: "bg-purple-500",
  green: "bg-emerald-500",
  yellow: "bg-yellow-400",
  orange: "bg-orange-500",
  red: "bg-red-500",
  slate: "bg-slate-400",
}

const COLORS = Object.keys(COLOR_MAP)

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const DeptCardSkeleton = () => (
  <Card className="animate-pulse">
    <CardContent className="pt-6 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <div className="space-y-1.5 flex-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-3/4" />
    </CardContent>
  </Card>
)

// ─── Department card ──────────────────────────────────────────────────────────

const DeptCard = ({ dept, onEdit, onDelete }) => {
  const colorCls = COLOR_MAP[dept.color] ?? COLOR_MAP.slate
  const dotCls = COLOR_DOT[dept.color] ?? COLOR_DOT.slate

  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardContent className="pt-5 pb-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`flex items-center justify-center h-10 w-10 rounded-lg border shrink-0 ${colorCls}`}
            >
              <Building2 className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm truncate">{dept.name}</p>
              {dept.head && (
                <p className="text-xs text-muted-foreground truncate">
                  Lead: {dept.head}
                </p>
              )}
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(dept)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => onDelete(dept.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {dept.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {dept.description}
          </p>
        )}

        <div className="flex items-center gap-2 pt-1">
          <div className={`h-2 w-2 rounded-full ${dotCls}`} />
          <Badge variant="secondary" className="text-xs gap-1">
            <Users className="h-3 w-3" />
            {dept.employeeCount} employees
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}

DeptCard.propTypes = {
  dept: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    head: PropTypes.string,
    employeeCount: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}

// ─── Add / Edit sheet ─────────────────────────────────────────────────────────

const DeptSheet = ({
  open,
  onOpenChange,
  form,
  onSubmit,
  isSubmitting,
  editingDept,
}) => (
  <Sheet open={open} onOpenChange={onOpenChange}>
    <SheetContent side="right" className="w-full sm:max-w-md">
      <SheetHeader>
        <SheetTitle>
          {editingDept ? "Edit Department" : "New Department"}
        </SheetTitle>
        <SheetDescription className="text-xs">
          {editingDept
            ? "Update department details below."
            : "Fill in the details to create a new department."}
        </SheetDescription>
      </SheetHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 mt-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Engineering" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Description{" "}
                  <span className="text-muted-foreground font-normal text-xs">
                    (optional)
                  </span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Brief description of what this department does…"
                    className="resize-none"
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="head"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Department Head{" "}
                  <span className="text-muted-foreground font-normal text-xs">
                    (optional)
                  </span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Sarah Mitchell" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Color picker */}
          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Colour</FormLabel>
                <FormControl>
                  <div className="flex gap-2 flex-wrap">
                    {COLORS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => field.onChange(c)}
                        className={`h-7 w-7 rounded-full border-2 transition-transform hover:scale-110 ${COLOR_DOT[c]} ${
                          field.value === c
                            ? "border-foreground scale-110"
                            : "border-transparent"
                        }`}
                        aria-label={c}
                      />
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving…"
                : editingDept
                  ? "Save Changes"
                  : "Create"}
            </Button>
          </div>
        </form>
      </Form>
    </SheetContent>
  </Sheet>
)

DeptSheet.propTypes = {
  open: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  editingDept: PropTypes.object,
}

// ─── Main UI ──────────────────────────────────────────────────────────────────

const DepartmentListUI = ({
  departments,
  stats,
  isLoading,
  isError,
  sheetOpen,
  onSheetOpenChange,
  editingDept,
  form,
  onSubmit,
  isSubmitting,
  onEdit,
  onDelete,
  onNew,
}) => (
  <div className="space-y-6 p-6">
    {/* Header */}
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Departments</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Manage your organisation&apos;s departments
        </p>
      </div>
      <Button size="sm" onClick={onNew}>
        <Plus className="mr-1.5 h-4 w-4" />
        New Department
      </Button>
    </div>

    {/* Stats */}
    <div className="grid grid-cols-2 gap-4">
      <Card>
        <CardContent className="flex items-center gap-3 pt-5 pb-4">
          <Building2 className="h-8 w-8 text-primary/60" />
          <div>
            {isLoading ? (
              <Skeleton className="h-7 w-8 mb-1" />
            ) : (
              <p className="text-2xl font-bold">{stats?.total ?? 0}</p>
            )}
            <p className="text-xs text-muted-foreground">Departments</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex items-center gap-3 pt-5 pb-4">
          <Users className="h-8 w-8 text-primary/60" />
          <div>
            {isLoading ? (
              <Skeleton className="h-7 w-12 mb-1" />
            ) : (
              <p className="text-2xl font-bold">{stats?.totalEmployees ?? 0}</p>
            )}
            <p className="text-xs text-muted-foreground">Total Employees</p>
          </div>
        </CardContent>
      </Card>
    </div>

    {/* Grid */}
    {isError && (
      <p className="text-sm text-center text-destructive py-10">
        Failed to load departments. Please try again.
      </p>
    )}

    {isLoading ? (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <DeptCardSkeleton key={index} />
        ))}
      </div>
    ) : (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {departments?.map((dept) => (
          <DeptCard
            key={dept.id}
            dept={dept}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
        {!departments?.length && (
          <div className="col-span-full py-16 text-center text-muted-foreground text-sm">
            No departments yet. Click &quot;New Department&quot; to get started.
          </div>
        )}
      </div>
    )}

    {/* Add / Edit Sheet */}
    <DeptSheet
      open={sheetOpen}
      onOpenChange={onSheetOpenChange}
      form={form}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      editingDept={editingDept}
    />
  </div>
)

DepartmentListUI.propTypes = {
  departments: PropTypes.array,
  stats: PropTypes.shape({
    total: PropTypes.number,
    totalEmployees: PropTypes.number,
  }),
  isLoading: PropTypes.bool.isRequired,
  isError: PropTypes.bool.isRequired,
  sheetOpen: PropTypes.bool.isRequired,
  onSheetOpenChange: PropTypes.func.isRequired,
  editingDept: PropTypes.object,
  form: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onNew: PropTypes.func.isRequired,
}

export default DepartmentListUI
