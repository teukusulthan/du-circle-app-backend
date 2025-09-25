import { z } from "zod";

export const registerSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username must be at most 30 characters")
      .regex(
        /^[a-zA-Z0-9._]+$/,
        "Username may only contain letters, numbers, dots, and underscores"
      ),
    name: z
      .string()
      .trim()
      .min(3, "Full name must be at least 3 characters")
      .max(100, "Full name must be at most 100 characters"),
    email: z.string().trim().toLowerCase().email("Invalid email format"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password must be at most 100 characters"),
  })
  .strict();

export type RegisterBody = z.infer<typeof registerSchema>;

export const loginSchema = z
  .object({
    identifier: z
      .string()
      .trim()
      .min(3, "Identifier (email or username) is required")
      .max(100, "Identifier must be at most 100 characters"),
    password: z.string().min(1, "Password is required"),
  })
  .strict();

export type LoginBody = z.infer<typeof loginSchema>;

const emptyToUndef = (v: unknown) =>
  typeof v === "string" ? (v.trim() === "" ? undefined : v.trim()) : v;

export const PatchProfileSchema = z.object({
  name: z
    .preprocess(
      emptyToUndef,
      z
        .string()
        .min(3, "Full name cannot be empty")
        .max(100, "Full name too long")
    )
    .optional(),
  username: z
    .preprocess(
      emptyToUndef,
      z.string().min(3, "Username min 3 chars").max(20, "Username max 30 chars")
    )
    .optional(),
});

export type PatchProfileInput = z.infer<typeof PatchProfileSchema>;
