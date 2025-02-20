"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Section from "@/components/shared/section";
import { toast } from "@/hooks/use-toast";

const LenderLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LenderLoginProps = z.infer<typeof LenderLoginSchema>;

export default function LenderLogin() {
  const router = useRouter();
  const form = useForm<LenderLoginProps>({
    resolver: zodResolver(LenderLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { handleSubmit, control } = form;

  const onSubmit = async (data: LenderLoginProps) => {
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      toast({
        title: "Error",
        description: "Invalid email or password",
        variant: "destructive",
      });
    } else {
      router.push("/lender/applications");
      router.refresh();
    }
  };

  return (
    <Section className="mt-20">
      <div className="max-w-md mx-auto">
        <Card className="p-6">
          <CardHeader className="mb-8">
            <CardTitle className="text-center text-3xl font-bold bg-gradient-to-r from-violet-500 to-purple-600 bg-clip-text text-transparent">
              Lender Login
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                <FormField
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="john@example.com" {...field} />
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
                        <Input type="password" placeholder="Enter your password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-medium py-6 rounded-lg transition-all duration-300"
                >
                  Login
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </Section>
  );
} 