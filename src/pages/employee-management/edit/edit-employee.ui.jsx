import { ArrowLeft, Loader2 } from "lucide-react"
import PropTypes from "prop-types"
import { Link } from "react-router-dom"

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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import ct from "@constants/"

const DEPARTMENTS = [
  "Engineering",
  "Design",
  "Product",
  "HR",
  "Finance",
  "Marketing",
  "Operations",
  "Sales",
]

const EMPLOYEE_ROLES = [
  { value: "employee", label: "Employee" },
  { value: "manager", label: "Manager" },
  { value: "admin", label: "Admin" },
]

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
]

// ─── Loading skeleton ─────────────────────────────────────────────────────────

const EditFormSkeleton = () => (
  <Card>
    <CardHeader>
      <Skeleton className="h-5 w-36" />
      <Skeleton className="h-3 w-56 mt-1" />
    </CardHeader>
    <CardContent className="space-y-5">
      {Array.from({ length: 5 }).map((_, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={index} className="space-y-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-9 w-full" />
        </div>
      ))}
    </CardContent>
  </Card>
)

// ─── Form component ──────────────────────────────────────────────────────────
/**
 * EditEmployeeForm — renders the employee edit form
 * @param {{form: object, onSubmit: Function, isSubmitting: boolean}} props
 */
const EditEmployeeForm = ({ form, onSubmit, isSubmitting }) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-base">Employee Details</CardTitle>
      <CardDescription className="text-xs">
        Make changes and save to update the employee record.
      </CardDescription>
    </CardHeader>

    <CardContent>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* Full name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Alice Johnson" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Work Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="alice@company.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="+1 555 000 0000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-5 sm:grid-cols-2">
            {/* Department */}
            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {DEPARTMENTS.map((d) => (
                        <SelectItem key={d} value={d}>
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Role */}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {EMPLOYEE_ROLES.map((r) => (
                        <SelectItem key={r.value} value={r.value}>
                          {r.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {/* Join date */}
            <FormField
              control={form.control}
              name="joinDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Join Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {STATUS_OPTIONS.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button asChild variant="outline" type="button">
              <Link to={ct.route.employeeManagement.LIST}>Cancel</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Changes
            </Button>
          </div>
        </form>
      </Form>
    </CardContent>
  </Card>
)

EditEmployeeForm.propTypes = {
  form: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
}

// ─── Main UI ──────────────────────────────────────────────────────────────────

const EditEmployeeUI = ({
  form,
  onSubmit,
  isSubmitting,
  isLoading,
  employeeId,
}) => (
  <div className="space-y-6 p-6 max-w-2xl mx-auto">
    {/* Header */}
    <div className="flex items-center gap-3">
      <Button asChild variant="ghost" size="icon" className="h-8 w-8">
        <Link to={ct.route.employeeManagement.LIST}>
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </Button>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Edit Employee</h1>
          {employeeId && (
            <Badge variant="outline" className="text-xs font-mono">
              #{employeeId}
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-0.5">
          Update employee profile information
        </p>
      </div>
    </div>

    {isLoading ? (
      <EditFormSkeleton />
    ) : (
      <EditEmployeeForm
        form={form}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
      />
    )}
  </div>
)

EditEmployeeUI.propTypes = {
  form: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  employeeId: PropTypes.string.isRequired,
}

export default EditEmployeeUI
