import { z } from "zod";

export const SignInSchema = z.object({
  email: z.email({ error: "Must be a valid email" }),
  password: z.string().min(8, { error: "Must be at least 8 characters long" }),
});

export type TsSignIn = z.infer<typeof SignInSchema>

export const SignUpSchema = z.object({
    firstName: z.string().min(1, { error: "Must be at least 1 character long" }),
    lastName: z.string().min(1, { error: "Must be at least 1 character long" }),
    email: z.email({ error: "Must be a valid email" }),
    password: z.string().min(8, { error: "Must be at least 8 characters long" }),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    error: "Passwords do not match",
    path: ["confirmPassword"],
});

export type TsSignUp = z.infer<typeof SignUpSchema>