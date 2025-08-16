import { z } from "zod";

export const signInSchema = z.object({
  email: z.email().min(1, "Email is required"),
  password: z
    .string({ error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters long"),
});

export type SignInSchema = z.infer<typeof signInSchema>;

export const signUpSchema = signInSchema
  .extend({
    name: z
      .string({ error: "Name is required" })
      .min(1, "Name is required")
      .max(255, "Name cannot be longer than 255 characters"),
    confirmPassword: z
      .string({ error: "Confirm password is required" })
      .min(1, "Confirm password is required")
      .min(8, "Password must be at least 8 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type SignUpSchema = z.infer<typeof signUpSchema>;
