import { z } from "zod";

export const volunteerStatusEnum = z.enum([
  "New",
  "Screening",
  "Approved",
  "Rejected",
  "Closed",
]);

export const publicVolunteerSchema = z.object({
  fullName: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.email("Please enter a valid email address").trim(),
  phone: z.string().trim(),
  city: z.string().trim(),
  interests: z.string().trim(),
  availability: z.string().trim(),
  message: z.string().trim(),
});

export const volunteerAdminUpdateSchema = z.object({
  status: volunteerStatusEnum,
  adminNote: z.string().trim(),
});

export type PublicVolunteerInput = z.infer<typeof publicVolunteerSchema>;
export type VolunteerAdminUpdateInput = z.infer<typeof volunteerAdminUpdateSchema>;