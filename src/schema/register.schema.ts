import * as z from "zod";

import { getPasswordStrength } from "@/lib/formatters";

export const signUpSchema = z
  .object({
    firstName: z
      .string()
      .transform((str) => str.trim()) // trim white spaces
      .pipe(
        // use  pipe, you can first remove the white spaces and then perform additional validations
        z
          .string()
          .min(2, "First name cannot be empty")
          .max(72, "First name must be less than 72 characters")
          .regex(/^[A-Za-z\s]+$/, "First name can only contain letters and spaces"),
      ),
    lastName: z
      .string()
      .transform((str) => str.trim()) // trim white spaces
      .pipe(
        // use  pipe, you can first remove the white spaces and then perform additional validations
        z
          .string()
          .min(2, "Last name must be at least 2 characters")
          .max(72, "Last name must be less than 72 characters")
          .regex(/^[A-Za-z\s]+$/, "Last name can only contain letters and spaces"),
      ),
    email: z.email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .refine((val) => /[A-Z]/.test(val), {
        message: "Password must contain at least one uppercase letter",
      })
      .refine((val) => getPasswordStrength(val) >= 3, {
        message:
          "Password must include at least 3 of the following: uppercase, lowercase, number, special character, length ≥ 8",
      }),

    confirmPassword: z.string(),
    terms: z.boolean().refine((val) => val === true, "You must agree to the terms and conditions"),
    profileImage: z.array(z.instanceof(File)).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type SignUpFormDataType = z.infer<typeof signUpSchema>;
export type SignUpFormPayload = Omit<
  SignUpFormDataType,
  "profileImage" | "confirmPassword" | "terms"
> & {
  imageId?: number;
};
