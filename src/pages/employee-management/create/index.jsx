import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { z } from "zod"

import { toast } from "@/components/ui/use-toast"
import ct from "@constants/"
import { useCreateEmployee } from "@query/employee-management.query"

import CreateEmployeeUI from "./create-employee.ui"

// ─── Validation schema ────────────────────────────────────────────────────────

const schema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  email: z.string().email("Enter a valid email address"),
  phone: z
    .string()
    .min(7, "Phone number is too short")
    .max(20, "Phone number is too long")
    .optional()
    .or(z.literal("")),
  department: z.string().min(1, "Please select a department"),
  role: z.string().min(1, "Please select a role"),
  joinDate: z.string().min(1, "Join date is required"),
})

// ─── Container ────────────────────────────────────────────────────────────────

/**
 * CreateEmployee container — handles form state and submission via the API.
 */
const CreateEmployee = () => {
  const navigate = useNavigate()
  const { mutate: createEmployee, isPending } = useCreateEmployee()

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      department: "",
      role: "",
      joinDate: "",
    },
  })

  const handleSubmit = (values) => {
    createEmployee(values, {
      onSuccess: () => {
        toast({
          title: "Employee created",
          description: `${values.name} has been added successfully.`,
        })
        navigate(ct.route.employeeManagement.LIST)
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to create employee. Please try again.",
          variant: "destructive",
        })
      },
    })
  }

  return (
    <CreateEmployeeUI
      form={form}
      onSubmit={handleSubmit}
      isSubmitting={isPending}
    />
  )
}

export default CreateEmployee
