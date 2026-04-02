import { z } from "zod";

export const siteSettingsSchema = z.object({
  settingId: z.number().int(),
  organizationName: z.string().trim().min(2, "Organization name is required"),
  email: z.string().trim(),
  phone: z.string().trim(),
  address: z.string().trim(),
  websiteUrl: z.string().trim(),
  logoUrl: z.string().trim(),
  footerText: z.string().trim(),
  primaryColor: z.string().trim(),
});

export const createAdminUserSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required"),
  email: z.email("Please enter a valid email").trim(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  roleId: z.number().int(),
  isActive: z.boolean(),
});

export const updateAdminUserSchema = z.object({
  adminUserId: z.number().int(),
  roleId: z.number().int(),
  isActive: z.boolean(),
});

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;
export type CreateAdminUserInput = z.infer<typeof createAdminUserSchema>;
export type UpdateAdminUserInput = z.infer<typeof updateAdminUserSchema>;