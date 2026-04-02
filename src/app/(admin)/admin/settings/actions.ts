"use server";

import { ZodError } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createAdminUser,
  updateAdminUserRoleStatus,
  updateSiteSettings,
} from "@/features/settings/settings.service";

function getErrorMessage(error: unknown): string {
  if (error instanceof ZodError) {
    return error.issues[0]?.message || "Invalid form data";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
}

export async function updateSiteSettingsAction(formData: FormData): Promise<void> {
  try {
    await updateSiteSettings({
      settingId: Number(formData.get("settingId") || "1"),
      organizationName: String(formData.get("organizationName") || ""),
      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || ""),
      address: String(formData.get("address") || ""),
      websiteUrl: String(formData.get("websiteUrl") || ""),
      logoUrl: String(formData.get("logoUrl") || ""),
      footerText: String(formData.get("footerText") || ""),
      primaryColor: String(formData.get("primaryColor") || ""),
    });
  } catch (error) {
    redirect(`/admin/settings?error=${encodeURIComponent(getErrorMessage(error))}`);
  }

  revalidatePath("/admin/settings");
  redirect("/admin/settings?success=site-updated");
}

export async function createAdminUserAction(formData: FormData): Promise<void> {
  try {
    await createAdminUser({
      fullName: String(formData.get("fullName") || ""),
      email: String(formData.get("email") || ""),
      password: String(formData.get("password") || ""),
      roleId: Number(formData.get("roleId") || "0"),
      isActive: String(formData.get("isActive") || "") === "on",
    });
  } catch (error) {
    redirect(`/admin/settings?error=${encodeURIComponent(getErrorMessage(error))}`);
  }

  revalidatePath("/admin/settings");
  redirect("/admin/settings?success=user-created");
}

export async function updateAdminUserAction(formData: FormData): Promise<void> {
  try {
    await updateAdminUserRoleStatus({
      adminUserId: Number(formData.get("adminUserId") || "0"),
      roleId: Number(formData.get("roleId") || "0"),
      isActive: String(formData.get("isActive") || "") === "on",
    });
  } catch (error) {
    redirect(`/admin/settings?error=${encodeURIComponent(getErrorMessage(error))}`);
  }

  revalidatePath("/admin/settings");
  redirect("/admin/settings?success=user-updated");
}