import z from "zod";

export const CreateThreadSchema = z.object({
  content: z.string().trim().min(1).max(1000),
  image: z.string().optional(),
});
