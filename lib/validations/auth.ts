import { z } from "zod";

export const LoginSchema = z.object({
  identifier: z.string().trim().min(1, "Please enter your username or email"),

  password: z
    .string()
    .min(1, "Please enter your password")
    .min(8, "Password must be at least 8 characters"),
});
export const RegisterSchema = z
  .object({
    identifier: z
      .string()
      .trim()
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username must be at most 20 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores",
      ),

    name: z.string().trim().min(2, "Name must be at least 2 characters"),

    email: z.string().trim().email("Please enter a valid email"),

    password: z.string().min(8, "Password must be at least 8 characters"),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
