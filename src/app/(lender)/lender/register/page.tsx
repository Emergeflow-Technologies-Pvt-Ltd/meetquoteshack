"use client";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BecomeLenderSchema, BecomeLenderProps } from "@/lib/schema";
import { investRanges, provinces } from "@/lib/constants";
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
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import Section from "@/components/shared/section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { redirect, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function RegisterAsLender() {
  const { status } = useSession();
  const router = useRouter();

  if (status === "authenticated") {
    redirect("/lender/dashboard");
  }

  const form = useForm<BecomeLenderProps>({
    resolver: zodResolver(BecomeLenderSchema),
    defaultValues: {
      name: "",
      business: "",
      phone: "",
      email: "",
      province: "",
      investment: "",
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

  const onSubmit: SubmitHandler<BecomeLenderProps> = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    axios
      .post("/api/lender/register", data)
      .then(() => {
        toast({
          title: "Success",
          description: "Your account was created successfully",
          variant: "default",
        });
        router.push("/lender/login");
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
    <Section className="mt-20 ">
      <div className="max-w-3xl mx-auto">
        <Card className="p-6">
          {" "}
          {/* Wrapping the form in a Card component */}
          <CardHeader className="mb-8">
            <CardTitle className="text-center text-3xl font-bold bg-gradient-to-r from-violet-500 to-purple-600 bg-clip-text text-transparent">
              Become a Lender
            </CardTitle>
            <p className="text-center mt-2 text-muted-foreground">
              Join our network of trusted lenders and start investing today
            </p>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-6"
              >
                <div className="grid md:grid-cols-2 gap-6">
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
                        <FormLabel>Business/Company Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Example Corp" {...field} />
                        </FormControl>
                        <FormMessage>{errors.business?.message}</FormMessage>
                      </FormItem>
                    )}
                    name="business"
                    control={control}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
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

                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Province</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a province" />
                            </SelectTrigger>
                            <SelectContent>
                              {provinces.map((province, idx) => (
                                <SelectItem key={idx} value={province}>
                                  {province}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage>{errors.province?.message}</FormMessage>
                      </FormItem>
                    )}
                    name="province"
                    control={control}
                  />
                  <FormField
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Investment Range</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select investment range" />
                            </SelectTrigger>
                            <SelectContent>
                              {investRanges.map((range) => (
                                <SelectItem
                                  key={range.value}
                                  value={range.value}
                                >
                                  {range.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage>{errors.investment?.message}</FormMessage>
                      </FormItem>
                    )}
                    name="investment"
                    control={control}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
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
                  <p className="text-sm text-gray-600 bg-gray-100 border border-gray-300 p-3 rounded-md">
                    <strong className="text-purple-700">Important:</strong>{" "}
                    Please make sure to remember the <strong>email</strong> and{" "}
                    <strong>password</strong> you just entered. You’ll need them
                    to log in.
                  </p>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-medium py-6 rounded-lg transition-all duration-300"
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
