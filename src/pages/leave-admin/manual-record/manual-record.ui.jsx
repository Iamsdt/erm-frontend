import PropTypes from "prop-types"

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
import { Textarea } from "@/components/ui/textarea"

const RECORD_TYPES = [
  { value: "present", label: "✅ Present" },
  { value: "absent", label: "❌ Absent" },
  { value: "leave", label: "🏖️ On Leave" },
  { value: "wfh", label: "🏠 Work From Home" },
  { value: "halfday", label: "🌗 Half Day" },
]

const LEAVE_TYPES = [
  "Annual Leave",
  "Sick Leave",
  "Casual Leave",
  "Unpaid Leave",
  "Maternity/Paternity",
  "Compensatory",
]

const HALF_DAY_SLOTS = [
  { value: "morning", label: "🌅 Morning (AM)" },
  { value: "afternoon", label: "🌇 Afternoon (PM)" },
]

const ManualInfoCallout = () => (
  <div className="flex gap-2 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-sm text-blue-700 dark:text-blue-400">
    <span className="shrink-0 mt-0.5">ℹ️</span>
    <p>
      This action will override the employee&apos;s attendance record for the
      selected date. The employee will be notified automatically.
    </p>
  </div>
)

/* eslint-disable react/jsx-handler-names */
/**
 * ManualRecordUI — form for admin to manually record an employee attendance status.
 */
const ManualRecordUI = ({
  form,
  employees,
  isLoadingEmps,
  isSubmitting,
  recordType,
  onSubmit,
}) => {
  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Manual Attendance Record
        </h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Override or manually record an employee&apos;s attendance status for a
          specific date.
        </p>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Record Details</CardTitle>
          <CardDescription className="text-xs">
            All fields marked with * are required. Records overwrite the
            existing status for that date.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-4">
              {/* Employee selector */}
              <FormField
                control={form.control}
                name="employeeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employee *</FormLabel>
                    {isLoadingEmps ? (
                      <Skeleton className="h-10 rounded-md" />
                    ) : (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select employee…" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {employees.map((emp) => (
                            <SelectItem key={emp.id} value={emp.id}>
                              {emp.name} — {emp.department}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Date */}
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date *</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        max={new Date().toISOString().split("T")[0]}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Record type */}
              <FormField
                control={form.control}
                name="recordType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Record Type *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type…" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {RECORD_TYPES.map((rt) => (
                          <SelectItem key={rt.value} value={rt.value}>
                            {rt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Leave type — shown only when recordType === "leave" */}
              {recordType === "leave" && (
                <FormField
                  control={form.control}
                  name="leaveType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Leave Type *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select leave type…" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {LEAVE_TYPES.map((lt) => (
                            <SelectItem key={lt} value={lt}>
                              {lt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Half day slot — shown only when recordType === "halfday" */}
              {recordType === "halfday" && (
                <FormField
                  control={form.control}
                  name="halfDaySlot"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Half Day Slot *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select slot…" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {HALF_DAY_SLOTS.map((slot) => (
                            <SelectItem key={slot.value} value={slot.value}>
                              {slot.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Admin note */}
              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Admin Note</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Reason for manual override (optional)…"
                        className="resize-none"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Info callout */}
              <ManualInfoCallout />

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Saving…" : "Save Record"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
/* eslint-enable react/jsx-handler-names */

ManualRecordUI.propTypes = {
  form: PropTypes.object.isRequired,
  employees: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      department: PropTypes.string.isRequired,
    })
  ).isRequired,
  isLoadingEmps: PropTypes.bool.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  recordType: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
}

export default ManualRecordUI
