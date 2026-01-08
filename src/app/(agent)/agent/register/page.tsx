"use client";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BecomeAgentSchema, BecomeAgentProps } from "@/lib/schema";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Section from "@/components/shared/section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { redirect, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function RegisterAsagent() {
  const { status } = useSession();
  const router = useRouter();

  if (status === "authenticated") {
    redirect("/agent/dashboard");
  }

  const form = useForm<BecomeAgentProps>({
    resolver: zodResolver(BecomeAgentSchema),
    defaultValues: {
      name: "",
      business: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit: SubmitHandler<BecomeAgentProps> = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    axios
      .post("/api/agent/register", data)
      .then(() => {
        toast({
          title: "Success",
          description: "Your account was created successfully",
          variant: "default",
        });
        router.push("/agent/login");
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: error.response.data,
          variant: "destructive",
        });
        console.error(error);
      });
    reset();
  };

  return (
    <Section className="mt-20">
      <div className="mx-auto max-w-3xl">
        <Card className="p-6">
          {" "}
          {/* Wrapping the form in a Card component */}
          <CardHeader className="mb-8">
            <CardTitle className="bg-gradient-to-r from-violet-500 to-purple-600 bg-clip-text text-center text-3xl font-bold text-transparent">
              Become a agent
            </CardTitle>
            <p className="mt-2 text-center text-muted-foreground">
              Join our network of trusted agents and start investing today
            </p>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-6"
              >
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage>{errors.name?.message}</FormMessage>
                      </FormItem>
                    )}
                    name="name"
                    control={control}
                  />

                  <FormField
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Company Name" {...field} />
                        </FormControl>
                        <FormMessage>{errors.name?.message}</FormMessage>
                      </FormItem>
                    )}
                    name="business"
                    control={control}
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="(XXX) XXX-XXXX" {...field} />
                        </FormControl>
                        <FormMessage>{errors.phone?.message}</FormMessage>
                      </FormItem>
                    )}
                    name="phone"
                    control={control}
                  />
                  <FormField
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input placeholder="john@example.com" {...field} />
                        </FormControl>
                        <FormMessage>{errors.email?.message}</FormMessage>
                      </FormItem>
                    )}
                    name="email"
                    control={control}
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Enter your password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage>{errors.password?.message}</FormMessage>
                      </FormItem>
                    )}
                    name="password"
                    control={control}
                  />
                  <FormField
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Confirm your password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage>
                          {errors.confirmPassword?.message}
                        </FormMessage>
                      </FormItem>
                    )}
                    name="confirmPassword"
                    control={control}
                  />
                </div>

                <div className="mt-6 space-y-4">
                  <p className="rounded-md border border-gray-300 bg-gray-100 p-3 text-sm text-gray-600">
                    <strong className="text-purple-700">Important:</strong>{" "}
                    Please make sure to remember the <strong>email</strong> and{" "}
                    <strong>password</strong> you just entered. You’ll need them
                    to log in.
                  </p>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-lg bg-gradient-to-r from-violet-500 to-purple-600 py-6 font-medium text-white transition-all duration-300 hover:from-violet-600 hover:to-purple-700"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>{" "}
        {/* Closing Card component */}
      </div>
    </Section>
  );
}
