"use client"

import React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

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

const ResetSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type ResetForm = z.infer<typeof ResetSchema>

export default function ResetPasswordPage() {
  const params = useSearchParams()
  const router = useRouter()
  const token = params.get("token")

  const form = useForm<ResetForm>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      password: "",
    },
  })

  const { handleSubmit, control, formState } = form

  const onSubmit = async (data: ResetForm) => {
    if (!token) {
      toast({
        title: "Invalid link",
        description: "Reset token is missing or invalid.",
        variant: "destructive",
      })
      return
    }

    try {
      const res = await fetch("/api/resetpassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password: data.password,
        }),
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.message)
      }

      toast({
        title: "Success",
        description: "Password reset successfully",
      })

      // ✅ redirect to login
      setTimeout(() => {
        router.push("/")
      }, 1500)
    } catch (error: unknown) {
      let message = "Something went wrong"

      if (error instanceof Error) {
        message = error.message
      }

      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      })
    }
  }

  return (
    <Section className="mt-24">
      <div className="mx-auto max-w-md">
        <Card className="rounded-2xl border border-gray-100 bg-white p-8 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="bg-gradient-to-r from-violet-500 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
              Reset Password
            </CardTitle>
            <p className="mt-4 text-sm text-gray-500">
              Enter your new password below.
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
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
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
                  disabled={formState.isSubmitting}
                  className="w-full rounded-lg bg-gradient-to-r from-violet-500 to-purple-600 py-3 font-semibold text-white transition-all duration-300 hover:from-violet-600 hover:to-purple-700"
                >
                  {formState.isSubmitting ? "Resetting..." : "Reset Password"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </Section>
  )
}
