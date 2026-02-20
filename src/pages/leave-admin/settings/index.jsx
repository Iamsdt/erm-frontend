import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { toast } from "@/components/ui/use-toast"
import {
  useFetchLeaveSettings,
  useUpdateLeaveSettings,
} from "@query/leave.query"

import LeaveSettingsUI from "./leave-settings.ui"

// ─── Constants ────────────────────────────────────────────────────────────────
const MIN_LEAVE_ERROR = "Must be 0 or more"
const MAX_LEAVE_ERROR = "Cannot exceed 365 days"
const MAX_DAYS = 365

// ─── Validation schema ────────────────────────────────────────────────────────

const schema = z.object({
  annualLeaveQuota: z
    .number()
    .int()
    .min(0, MIN_LEAVE_ERROR)
    .max(MAX_DAYS, MAX_LEAVE_ERROR),
  sickLeaveQuota: z
    .number()
    .int()
    .min(0, MIN_LEAVE_ERROR)
    .max(MAX_DAYS, MAX_LEAVE_ERROR),
  casualLeaveQuota: z
    .number()
    .int()
    .min(0, MIN_LEAVE_ERROR)
    .max(MAX_DAYS, MAX_LEAVE_ERROR),
  carryForwardEnabled: z.boolean(),
  carryForwardLimit: z
    .number()
    .int()
    .min(0, MIN_LEAVE_ERROR)
    .max(MAX_DAYS, MAX_LEAVE_ERROR),
  halfDayEnabled: z.boolean(),
  wfhEnabled: z.boolean(),
  leaveYearStart: z
    .string()
    .regex(/^\d{2}-\d{2}$/, "Format must be MM-DD (e.g. 01-01)"),
})

// ─── Container ────────────────────────────────────────────────────────────────

/**
 * LeaveSettings container — loads and saves leave management configuration.
 */
const LeaveSettings = () => {
  const { data, isLoading } = useFetchLeaveSettings()
  const { mutate: updateSettings, isPending } = useUpdateLeaveSettings()

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      annualLeaveQuota: 20,
      sickLeaveQuota: 10,
      casualLeaveQuota: 5,
      carryForwardEnabled: true,
      carryForwardLimit: 5,
      halfDayEnabled: true,
      wfhEnabled: true,
      leaveYearStart: "01-01",
    },
  })

  // Populate form once settings are fetched
  useEffect(() => {
    if (data) {
      form.reset(data)
    }
  }, [data, form])

  const handleSubmit = (values) => {
    updateSettings(values, {
      onSuccess: () => {
        toast({
          title: "Settings saved",
          description: "Leave configuration has been updated.",
        })
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to save settings. Please try again.",
          variant: "destructive",
        })
      },
    })
  }

  return (
    <LeaveSettingsUI
      form={form}
      onSubmit={handleSubmit}
      isSubmitting={isPending}
      isLoading={isLoading}
    />
  )
}

export default LeaveSettings
