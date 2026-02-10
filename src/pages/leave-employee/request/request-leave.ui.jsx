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
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"

// ─── Constants ────────────────────────────────────────────────────────────────

const LEAVE_TYPES = [
  {
    value: "Annual Leave",
    icon: "🏖️",
    desc: "Planned vacation / personal time",
  },
  { value: "Sick Leave", icon: "🤒", desc: "Illness or medical needs" },
  { value: "Casual Leave", icon: "🎲", desc: "Short unplanned leave" },
  { value: "Compensatory", icon: "⚖️", desc: "In lieu of overtime worked" },
  { value: "Unpaid Leave", icon: "💰", desc: "Leave without pay" },
  { value: "Maternity/Paternity", icon: "👶", desc: "Parental leave" },
]

const SUB_TYPES = [
  {
    value: "full",
    icon: "📅",
    label: "Full Day(s)",
    desc: "One or more full working days",
  },
  {
    value: "halfday",
    icon: "🌗",
    label: "Half Day",
    desc: "Morning or afternoon only",
  },
  {
    value: "wfh",
    icon: "🏠",
    label: "Work From Home",
    desc: "Working remotely (requires approval)",
  },
]

const HALF_DAY_SLOTS = [
  { value: "morning", label: "🌅 Morning (until 1 PM)" },
  { value: "afternoon", label: "🌇 Afternoon (from 1 PM)" },
]

const TODAY = new Date().toISOString().split("T")[0]

// ─── Main UI ──────────────────────────────────────────────────────────────────

const RequestLeaveUI = ({
  form,
  subType,
  estimatedDays,
  isSubmitting,
  onSubmit,
}) => {
  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Request Leave</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Submit a leave, WFH, or half-day request for your manager's approval.
        </p>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Leave Request Form</CardTitle>
          <CardDescription className="text-xs">
            Fields marked with * are required. Requests are usually reviewed
            within 1–2 business days.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-5">
              {/* Request type (Full / Half / WFH) */}
              <FormField
                control={form.control}
                name="subType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Request Type *</FormLabel>
                    <div className="grid grid-cols-3 gap-2">
                      {SUB_TYPES.map((st) => (
                        <button
                          key={st.value}
                          type="button"
                          onClick={() => field.onChange(st.value)}
                          className={`p-3 rounded-xl border-2 text-left transition-all ${
                            field.value === st.value
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/40"
                          }`}
                        >
                          <div className="text-xl">{st.icon}</div>
                          <p className="text-sm font-semibold mt-1">
                            {st.label}
                          </p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            {st.desc}
                          </p>
                        </button>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Leave category */}
              <FormField
                control={form.control}
                name="leaveType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Leave Category *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select leave category…" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {LEAVE_TYPES.map((lt) => (
                          <SelectItem key={lt.value} value={lt.value}>
                            {lt.icon} {lt.value} —{" "}
                            <span className="text-muted-foreground">
                              {lt.desc}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Date range */}
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="fromDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>From Date *</FormLabel>
                      <FormControl>
                        <Input type="date" min={TODAY} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="toDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>To Date *</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          min={form.watch("fromDate") || TODAY}
                          disabled={subType === "wfh" || subType === "halfday"}
                          {...field}
                        />
                      </FormControl>
                      {(subType === "wfh" || subType === "halfday") && (
                        <FormDescription className="text-xs">
                          Auto-set to same day
                        </FormDescription>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Half day slot */}
              {subType === "halfday" && (
                <FormField
                  control={form.control}
                  name="halfDaySlot"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Half Day Slot *</FormLabel>
                      <div className="grid grid-cols-2 gap-2">
                        {HALF_DAY_SLOTS.map((slot) => (
                          <button
                            key={slot.value}
                            type="button"
                            onClick={() => field.onChange(slot.value)}
                            className={`p-3 rounded-xl border-2 text-center text-sm font-medium transition-all ${
                              field.value === slot.value
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/40"
                            }`}
                          >
                            {slot.label}
                          </button>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Estimated days chip */}
              {estimatedDays > 0 && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <span className="text-emerald-600 font-semibold text-sm">
                    📊 Estimated:
                  </span>
                  <Badge className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-500/30">
                    {estimatedDays} working{" "}
                    {estimatedDays === 1 ? "day" : "days"}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    (weekends excluded)
                  </span>
                </div>
              )}

              <Separator />

              {/* Reason */}
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Briefly explain your reason for this leave request…"
                        className="resize-none"
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      {field.value?.length ?? 0}/500 characters
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Optional fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="handoverTo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Handover To</FormLabel>
                      <FormControl>
                        <Input placeholder="Colleague's name…" {...field} />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Who covers your work?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactDuringLeave"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency Contact</FormLabel>
                      <FormControl>
                        <Input placeholder="Phone or email…" {...field} />
                      </FormControl>
                      <FormDescription className="text-xs">
                        If urgent contact needed
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Policy reminder */}
              <div className="flex gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-sm text-amber-700 dark:text-amber-400">
                <span className="shrink-0">⚠️</span>
                <p>
                  Requests must be submitted at least{" "}
                  <strong>2 working days</strong> in advance (except sick
                  leave). WFH requests require manager approval.
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting…" : "Submit Request"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

RequestLeaveUI.propTypes = {
  form: PropTypes.object.isRequired,
  subType: PropTypes.string,
  estimatedDays: PropTypes.number.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
}

export default RequestLeaveUI
