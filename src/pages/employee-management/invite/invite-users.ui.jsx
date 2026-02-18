import { ArrowLeft, Loader2, MailPlus } from "lucide-react"
import PropTypes from "prop-types"
import { Link } from "react-router-dom"

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
  FormDescription,
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

const InviteUsersUI = ({ form, onSubmit, isSubmitting }) => (
  <div className="space-y-6 p-6 max-w-lg mx-auto">
    {/* Header */}
    <div className="flex items-center gap-3">
      <Button asChild variant="ghost" size="icon" className="h-8 w-8">
        <Link to={ct.route.employeeManagement.LIST}>
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </Button>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Invite User</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Send an invitation email to onboard a new team member
        </p>
      </div>
    </div>

    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <MailPlus className="h-5 w-5 text-primary" />
          <CardTitle className="text-base">Send Invitation</CardTitle>
        </div>
        <CardDescription className="text-xs">
          The invited user will receive a setup link to create their account.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="newmember@company.com"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    An invitation link will be sent to this address.
                  </FormDescription>
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
                  <FormLabel>Assign Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
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

            {/* Department (optional) */}
            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Department{" "}
                    <span className="text-muted-foreground font-normal text-xs">
                      (optional)
                    </span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
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

            <div className="flex justify-end gap-3 pt-2">
              <Button asChild variant="outline" type="button">
                <Link to={ct.route.employeeManagement.LIST}>Cancel</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                <MailPlus className="mr-2 h-4 w-4" />
                Send Invite
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  </div>
)

InviteUsersUI.propTypes = {
  form: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
}

export default InviteUsersUI
