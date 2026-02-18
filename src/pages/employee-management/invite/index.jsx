import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { z } from "zod"

import { toast } from "@/components/ui/use-toast"
import ct from "@constants/"
import { useInviteUser } from "@query/employee-management.query"

import InviteUsersUI from "./invite-users.ui"

// ─── Validation schema ────────────────────────────────────────────────────────

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
  role: z.string().min(1, "Please select a role"),
  department: z.string().optional(),
})

// ─── Container ────────────────────────────────────────────────────────────────

/**
 * InviteUsers container — sends an invitation email via the API.
 */
const InviteUsers = () => {
  const navigate = useNavigate()
  const { mutate: inviteUser, isPending } = useInviteUser()

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      role: "",
      department: "",
    },
  })

  const handleSubmit = (values) => {
    inviteUser(values, {
      onSuccess: () => {
        toast({
          title: "Invitation sent",
          description: `An invite has been sent to ${values.email}.`,
        })
        navigate(ct.route.employeeManagement.LIST)
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to send invitation. Please try again.",
          variant: "destructive",
        })
      },
    })
  }

  return (
    <InviteUsersUI
      form={form}
      onSubmit={handleSubmit}
      isSubmitting={isPending}
    />
  )
}

export default InviteUsers
