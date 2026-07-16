import { getPasswordStrength } from "@/lib/formatters";
import * as z from "zod";

export const signInSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .refine((val) => getPasswordStrength(val) >= 3, {
      message:
        "Password must include at least 3 of the following: uppercase, lowercase, number, special character, length ≥ 8",
    }),
});

export type SignInFormDataType = z.infer<typeof signInSchema>;
