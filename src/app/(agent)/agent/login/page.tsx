"use client"

import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Section from "@/components/shared/section"
import { toast } from "@/hooks/use-toast"

const AgentLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

type AgentLoginProps = z.infer<typeof AgentLoginSchema>

export default function AgentLogin() {
  const router = useRouter()
  const { status } = useSession()
  const [showForgot, setShowForgot] = React.useState(false)
  const [forgotEmail, setForgotEmail] = React.useState("")
  const [confirmEmail, setConfirmEmail] = React.useState("")
  const [isResetLoading, setIsResetLoading] = React.useState(false)

  React.useEffect(() => {
    if (status === "authenticated") {
      router.push("/agent/dashboard")
    }
  }, [status, router])

  const form = useForm<AgentLoginProps>({
    resolver: zodResolver(AgentLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const { handleSubmit, control } = form

  const onSubmit = async (data: AgentLoginProps) => {
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    })

    if (result?.error) {
      toast({
        title: "Login Failed",
        description: "Invalid email or password.",
        variant: "destructive",
      })
    } else if (result?.ok) {
      window.location.href = "/agent/dashboard"
    }
  }

  const handleForgotPassword = async () => {
    if (!forgotEmail) {
      toast({
        title: "Email required",
        description: "Please enter your email.",
        variant: "destructive",
      })
      return
    }

    if (!confirmEmail) {
      toast({
        title: "Confirmation required",
        description: "Please confirm your email.",
        variant: "destructive",
      })
      return
    }

    if (forgotEmail !== confirmEmail) {
      toast({
        title: "Emails do not match",
        description: "Please make sure both emails are the same.",
        variant: "destructive",
      })
      return
    }

    setIsResetLoading(true)

    try {
      const res = await fetch("/api/forgotpassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: forgotEmail }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast({
          title: "Error",
          description: data.message,
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Check your email",
        description: data.message,
      })

      setForgotEmail("")
      setConfirmEmail("")
      setShowForgot(false)
    } catch {
      toast({
        title: "Network Error",
        description: "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsResetLoading(false) // 👈 stops loader AFTER toast
    }
  }

  return (
    <Section className="mt-24">
      <div className="mx-auto max-w-md">
        <Card className="rounded-2xl border border-gray-100 bg-white p-8 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="bg-gradient-to-r from-violet-500 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
              Agent Login
            </CardTitle>
            <p className="mt-4 text-sm text-gray-500">
              Sign in to manage loan applications and offers.
            </p>
          </CardHeader>

          <CardContent className="mt-6">
            <Form {...form}>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-5"
              >
                <FormField
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="you@example.com"
                          {...field}
                          className="h-10"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                          className="h-10"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full rounded-lg bg-gradient-to-r from-violet-500 to-purple-600 py-3 font-semibold text-white transition-all duration-300 hover:from-violet-600 hover:to-purple-700"
                >
                  Login
                </Button>

                {/* ✅ Improved Forgot Password */}
                <div className="mt-1 text-right">
                  {!showForgot ? (
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => setShowForgot(true)}
                      className="h-auto p-0 text-sm text-violet-600 hover:underline"
                    >
                      Forgot Password?
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => setShowForgot(false)}
                      className="h-auto p-0 text-sm text-gray-500 hover:underline"
                    >
                      Back to Login
                    </Button>
                  )}
                </div>
              </form>
              {showForgot && (
                <div className="mt-4 space-y-3 border-t pt-4">
                  <p className="text-sm text-gray-600">
                    Enter and confirm your email to reset password
                  </p>

                  {/* Email */}
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="h-10"
                  />

                  {/* Confirm Email */}
                  <Input
                    type="email"
                    placeholder="Confirm your email"
                    value={confirmEmail}
                    onChange={(e) => setConfirmEmail(e.target.value)}
                    className="h-10"
                  />

                  <Button
                    type="button"
                    onClick={handleForgotPassword}
                    disabled={isResetLoading}
                    className="flex w-full items-center justify-center gap-2 bg-violet-600 text-white hover:bg-violet-700"
                  >
                    {isResetLoading && (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    )}
                    {isResetLoading ? "Sending..." : "Send Reset Link"}
                  </Button>
                </div>
              )}
            </Form>
          </CardContent>
        </Card>
      </div>
    </Section>
  )
}
