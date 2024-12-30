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
    <div className="bg-violet-200 py-12 px-4 w-full dark:bg-violet-800">
      <Section className="bg-violet-200 py-12 px-4 mx-auto lg:flex lg:items-center lg:justify-between w-full dark:bg-violet-800">
        <div className="flex flex-col text-center lg:text-start lg:items-start lg:max-w-xl w-full">
          <h2 className="text-3xl font-bold mb-4 dark:text-white">
            Stay Updated with Our Newsletter
          </h2>
          <p className="text-lg mb-8 dark:text-gray-300">
            Receive the latest news, insights, and updates directly in your
            inbox.
          </p>
        </div>

        <div className="mt-8 lg:mt-0">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:-mx-2 px-4"
          >
            <Input
              {...register("email")}
              type="email"
              required
              placeholder="Your Email"
              className="border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none dark:bg-gray-700 dark:text-white"
            />
            <Button
              color="primary"
              variant="default"
              size="lg"
              className="ml-0 md:ml-3 px-10 bg-white text-primary-800 font-bold hover:bg-secondary-50 transition duration-300 ease-in-out dark:bg-gray-600 dark:text-white"
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
