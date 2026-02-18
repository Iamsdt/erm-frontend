import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { toast } from "@/components/ui/use-toast"
import {
  useCreateDepartment,
  useDeleteDepartment,
  useFetchDepartments,
  useUpdateDepartment,
} from "@query/department.query"

import DepartmentListUI from "./department-list.ui"

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(60, "Name is too long"),
  description: z.string().max(200, "Too long").optional().or(z.literal("")),
  head: z.string().max(100, "Too long").optional().or(z.literal("")),
  color: z.string().min(1, "Pick a colour"),
})

// ─── Container ────────────────────────────────────────────────────────────────

/**
 * DepartmentList container — CRUD for departments via a side sheet.
 */
const DepartmentList = () => {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingDept, setEditingDept] = useState(null)

  const { data, isLoading, isError } = useFetchDepartments()
  const { mutate: createDept, isPending: isCreating } = useCreateDepartment()
  const { mutate: updateDept, isPending: isUpdating } = useUpdateDepartment()
  const { mutate: deleteDept } = useDeleteDepartment()

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: "", description: "", head: "", color: "blue" },
  })

  // When editing, populate the form
  useEffect(() => {
    if (editingDept) {
      form.reset({
        name: editingDept.name ?? "",
        description: editingDept.description ?? "",
        head: editingDept.head ?? "",
        color: editingDept.color ?? "blue",
      })
    } else {
      form.reset({ name: "", description: "", head: "", color: "blue" })
    }
  }, [editingDept, form])

  const handleNew = () => {
    setEditingDept(null)
    setSheetOpen(true)
  }

  const handleEdit = (dept) => {
    setEditingDept(dept)
    setSheetOpen(true)
  }

  const handleSheetOpenChange = (open) => {
    setSheetOpen(open)
    if (!open) setEditingDept(null)
  }

  const handleSubmit = (values) => {
    const action = editingDept ? updateDept : createDept
    const payload = editingDept ? { id: editingDept.id, ...values } : values

    action(payload, {
      onSuccess: () => {
        toast({
          title: editingDept ? "Department updated" : "Department created",
          description: `"${values.name}" has been ${editingDept ? "updated" : "created"}.`,
        })
        setSheetOpen(false)
        setEditingDept(null)
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to save department. Please try again.",
          variant: "destructive",
        })
      },
    })
  }

  const handleDelete = (id) => {
    deleteDept(id, {
      onSuccess: () =>
        toast({
          title: "Department deleted",
          description: "Department removed.",
        }),
      onError: () =>
        toast({
          title: "Error",
          description: "Failed to delete department.",
          variant: "destructive",
        }),
    })
  }

  return (
    <DepartmentListUI
      departments={data?.departments}
      stats={{ total: data?.total, totalEmployees: data?.totalEmployees }}
      isLoading={isLoading}
      isError={isError}
      sheetOpen={sheetOpen}
      onSheetOpenChange={handleSheetOpenChange}
      editingDept={editingDept}
      form={form}
      onSubmit={handleSubmit}
      isSubmitting={isCreating || isUpdating}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onNew={handleNew}
    />
  )
}

export default DepartmentList
