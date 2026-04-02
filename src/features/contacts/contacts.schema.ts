import { z } from "zod";

export const contactStatusEnum = z.enum([
  "New",
  "InProgress",
  "Resolved",
  "Closed",
]);

export const publicContactSchema = z.object({
  fullName: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.email("Please enter a valid email address").trim(),
  phone: z.string().trim(),
  subject: z.string().trim(),
  message: z.string().trim().min(10, "Message must be at least 10 characters"),
});

export const contactAdminUpdateSchema = z.object({
  status: contactStatusEnum,
  adminNote: z.string().trim(),
});

export type PublicContactInput = z.infer<typeof publicContactSchema>;
export type ContactAdminUpdateInput = z.infer<typeof contactAdminUpdateSchema>;