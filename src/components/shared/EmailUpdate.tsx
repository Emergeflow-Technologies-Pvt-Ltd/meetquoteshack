"use client";
import React, { useCallback } from "react";
import Section from "@/components/shared/section";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

interface FormData {
  email: string;
}

const emailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const useEmailForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(emailSchema),
  });

  const onSubmit: SubmitHandler<FormData> = useCallback(
    async (data) => {
      try {
        await axios.post("/api/newsletter", data);
        reset();
        toast({
          title: "Subscribed successfully!",
          description: "You will receive updates via email.",
        });
      } catch (error) {
        toast({
          title: "Failed to subscribe",
          description: "Please try again later.",
        });
        console.error("Failed to subscribe", error);
      }
    },
    [reset]
  );

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
  };
};

export default function EmailUpdate() {
  const { register, handleSubmit } = useEmailForm();

  return (
    <div className="w-full bg-violet-200 px-4 dark:bg-violet-800">
      <Section className="mx-auto w-full bg-violet-200 px-4 py-12 dark:bg-violet-800 lg:flex lg:items-center lg:justify-between">
        <div className="flex w-full flex-col text-center lg:max-w-xl lg:items-start lg:text-start">
          <h2 className="mb-4 text-3xl font-bold dark:text-white">
            Stay Updated with Our Newsletter
          </h2>
          <p className="mb-8 text-lg dark:text-gray-300">
            Receive the latest news, insights, and updates directly in your
            inbox.
          </p>
        </div>

        <div className="mt-8 lg:mt-0">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col space-y-4 px-4 sm:-mx-2 sm:flex-row sm:space-y-0"
          >
            <Input
              {...register("email")}
              type="email"
              required
              placeholder="Your Email"
              className="h-10 rounded-lg border-2 border-gray-300 bg-white px-5 pr-16 text-sm focus:outline-none dark:bg-gray-700 dark:text-white"
            />
            <Button
              color="primary"
              variant="default"
              size="lg"
              className="text-primary-800 hover:bg-secondary-50 ml-0 bg-white px-10 font-bold transition duration-300 ease-in-out dark:bg-gray-600 dark:text-white md:ml-3"
              type="submit"
            >
              Subscribe Now
            </Button>
          </form>
        </div>
      </Section>
    </div>
  );
}
