import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, Mail } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import { z } from "zod"

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
import { toast } from "@/components/ui/use-toast"
import { resetPassword } from "@/lib/firebase"

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

/**
 * ForgotPasswordPage — sends a Firebase password reset email.
 */
const ForgotPasswordPage = () => {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  })

  const handleSubmit = async ({ email }) => {
    setLoading(true)
    try {
      await resetPassword(email)
      setSent(true)
      toast({
        title: "Email sent",
        description: "Check your inbox for a password reset link.",
      })
    } catch {
      toast({
        title: "Error",
        description:
          "Could not send reset email. Please check the address and try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-100 to-slate-300 dark:from-slate-900 dark:to-slate-800">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Reset Password</CardTitle>
          <CardDescription>
            {sent
              ? "A reset link has been sent to your email."
              : "Enter your email to receive a password reset link."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sent ? (
            <div className="space-y-4 text-center">
              <Mail className="h-12 w-12 text-primary mx-auto" />
              <p className="text-sm text-muted-foreground">
                Didn&apos;t receive it? Check your spam folder or try again.
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setSent(false)}
              >
                Try another email
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="you@company.com"
                          disabled={loading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>
            </Form>
          )}

          <div className="mt-4 text-center">
            <Button variant="link" asChild className="text-sm">
              <Link to="/login">
                <ArrowLeft className="mr-1 h-3 w-3" />
                Back to login
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ForgotPasswordPage
