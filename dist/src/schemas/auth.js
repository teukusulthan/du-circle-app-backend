"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatchProfileSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z
    .object({
    username: zod_1.z
        .string()
        .trim()
        .min(3, "Username must be at least 3 characters")
        .max(30, "Username must be at most 30 characters")
        .regex(/^[a-zA-Z0-9._]+$/, "Username may only contain letters, numbers, dots, and underscores"),
    name: zod_1.z
        .string()
        .trim()
        .min(3, "Full name must be at least 3 characters")
        .max(100, "Full name must be at most 100 characters"),
    email: zod_1.z.string().trim().toLowerCase().email("Invalid email format"),
    password: zod_1.z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(100, "Password must be at most 100 characters"),
})
    .strict();
exports.loginSchema = zod_1.z
    .object({
    identifier: zod_1.z
        .string()
        .trim()
        .min(3, "Identifier (email or username) is required")
        .max(100, "Identifier must be at most 100 characters"),
    password: zod_1.z.string().min(1, "Password is required"),
})
    .strict();
const emptyToUndef = (v) => typeof v === "string" ? (v.trim() === "" ? undefined : v.trim()) : v;
exports.PatchProfileSchema = zod_1.z.object({
    name: zod_1.z
        .preprocess(emptyToUndef, zod_1.z
        .string()
        .min(3, "Full name cannot be empty")
        .max(100, "Full name too long"))
        .optional(),
    username: zod_1.z
        .preprocess(emptyToUndef, zod_1.z.string().min(3, "Username min 3 chars").max(20, "Username max 30 chars"))
        .optional(),
    bio: zod_1.z.string().max(200).optional(),
});
