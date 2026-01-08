import * as z from "zod";

export const BecomeLenderSchema = z.object({
  name: z
    .string()
    .min(4, {
      message: "Full name is required and must be at least 4 characters long",
    })
    .max(30, { message: "Full name must not exceed 30 characters" }),
  business: z.string().min(1, { message: "Company Name is required" }),
  phone: z
    .string()
    .length(10, { message: "Phone number must be exactly 10 digits" }),
  email: z.string().email({ message: "Invalid email address" }),
  province: z.string().min(1, { message: "Province is required" }),
  investment: z.string().min(1, { message: "Investment amount is required" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
  confirmPassword: z
    .string()
    .min(8, { message: "Confirm password must be at least 8 characters long" }),
});

export type BecomeLenderProps = z.infer<typeof BecomeLenderSchema>;

export const BecomeAgentSchema = z
  .object({
    name: z
      .string()
      .min(4, {
        message: "Full name is required and must be at least 4 characters long",
      })
      .max(30, { message: "Full name must not exceed 30 characters" }),
    business: z.string(),
    phone: z
      .string()
      .regex(/^\d{10}$/, { message: "Phone number must be exactly 10 digits" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
    confirmPassword: z
      .string()
      .min(8, {
        message: "Confirm password must be at least 8 characters long",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type BecomeAgentProps = z.infer<typeof BecomeAgentSchema>;
