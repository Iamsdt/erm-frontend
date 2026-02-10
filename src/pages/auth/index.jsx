import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { z } from "zod"

import { toast } from "@/components/ui/use-toast"
import ct from "@constants/"
import { login } from "@store/slices/user.slice"

import LoginUI from "./login.ui"

const FormSchema = z.object({
  email: z.string().email().min(5, {
    message: "Username must be at least 2 characters.",
  }),
})

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
  })

  /**
   * Handles the login form submission.
   * @param {object} data - The form data containing the email.
   */
  const handleOnSubmit = async (data) => {
    dispatch(
      login({
        userName: data.email,
        userRole: "user",
      })
    )
    toast({
      title: "Login",
      description: "Login successful",
      variant: "success",
    })

    navigate(ct.route.ROOT)
  }

  return <LoginUI form={form} onSubmit={handleOnSubmit} />
}

export default Login
