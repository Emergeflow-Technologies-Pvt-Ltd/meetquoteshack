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
import axios from "axios";
import { toast } from "@/hooks/use-toast";

export default function RegisterAsLender() {
  const form = useForm<BecomeLenderProps>({
    resolver: zodResolver(BecomeLenderSchema),
    defaultValues: {
      name: "",
      business: "",
      phone: "",
      email: "",
      province: "",
      investment: "",
    }
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit: SubmitHandler<BecomeLenderProps> = async (data) => {
    axios.post("/api/lender/register", data)
      .then((res) => {
        toast({
          title: "Success",
          description: res.data,
          variant: "default",
        });
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });
        console.error(error);
      });
    reset();
  };

  return (
    <Section className="mt-20">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg">
        <div className="bg-violet-500 text-white p-8 rounded-t-xl">
          <h1 className="text-center text-3xl font-bold">
            Become a Lender
          </h1>
          <p className="text-center mt-2 text-violet-100">
            Join our network of trusted lenders and start investing today
          </p>
        </div>
        
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6 p-8"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" className="focus:ring-2 focus:ring-violet-500" {...field} />
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
                    <FormLabel className="text-sm font-medium">Business/Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Example Corp" className="focus:ring-2 focus:ring-violet-500" {...field} />
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
                    <FormLabel className="text-sm font-medium">Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="(XXX) XXX-XXXX" className="focus:ring-2 focus:ring-violet-500" {...field} />
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
                    <FormLabel className="text-sm font-medium">Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder="john@example.com" className="focus:ring-2 focus:ring-violet-500" {...field} />
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
                    <FormLabel className="text-sm font-medium">Your Province</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="focus:ring-2 focus:ring-violet-500">
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
                    <FormLabel className="text-sm font-medium">Investment Range</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="focus:ring-2 focus:ring-violet-500">
                          <SelectValue placeholder="Select investment range" />
                        </SelectTrigger>
                        <SelectContent>
                          {investRanges.map((range) => (
                            <SelectItem key={range.value} value={range.value}>
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

            <div className="mt-6">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-violet-500 hover:bg-violet-600 text-white font-medium py-3 rounded-lg transition-colors"
              >
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Section>
  );
}
