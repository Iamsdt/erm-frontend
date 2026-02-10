import { useEffect } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { toast } from "@/components/ui/use-toast"
import { useFetchAdminEmployees, usePostManualRecord } from "@query/leave.query"

import ManualRecordUI from "./manual-record.ui"

const schema = z.object({
  employeeId: z.string().min(1, "Select an employee"),
  date: z.string().min(1, "Date is required"),
  recordType: z.enum(["present", "absent", "leave", "wfh", "halfday"], {
    required_error: "Select a record type",
  }),
  leaveType: z.string().optional(),
  halfDaySlot: z.enum(["morning", "afternoon"]).optional(),
  note: z.string().max(300).optional(),
})

/**
 * ManualRecordPage container — handles employee attendance override form.
 */
const ManualRecordPage = () => {
  const { data: employees, isLoading: isLoadingEmps, error: empsError } = useFetchAdminEmployees()
  const { mutate: submitRecord, isPending: isSubmitting, isSuccess, reset: resetMutation } = usePostManualRecord()

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      employeeId: "",
      date: new Date().toISOString().split("T")[0],
      recordType: "",
      leaveType: "",
      halfDaySlot: "",
      note: "",
    },
  })

  const recordType = form.watch("recordType")

  useEffect(() => {
    if (empsError) {
      toast({ title: "Error", description: "Failed to load employee list.", variant: "destructive" })
    }
  }, [empsError])

  useEffect(() => {
    if (isSuccess) {
      toast({ title: "Record Saved ✓", description: "Attendance record has been updated." })
      form.reset({ date: new Date().toISOString().split("T")[0], employeeId: "", recordType: "", leaveType: "", halfDaySlot: "", note: "" })
      resetMutation()
    }
  }, [isSuccess, form, resetMutation])

  const onSubmit = (values) => {
    submitRecord(values, {
      onError: () => {
        toast({ title: "Error", description: "Failed to save record. Please try again.", variant: "destructive" })
      },
    })
  }

  return (
    <ManualRecordUI
      form={form}
      employees={employees ?? []}
      isLoadingEmps={isLoadingEmps}
      isSubmitting={isSubmitting}
      recordType={recordType}
      onSubmit={form.handleSubmit(onSubmit)}
    />
  )
}

export default ManualRecordPage
