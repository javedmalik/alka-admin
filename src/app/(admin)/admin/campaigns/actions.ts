"use server";

import { ZodError } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createCampaign,
  deleteCampaign,
  updateCampaign,
} from "@/features/campaigns/campaigns.service";
import {
  campaignSchema,
  type CampaignFormInput,
} from "@/features/campaigns/campaigns.schema";

function toNumberOrNull(value: FormDataEntryValue | null): number | null {
  const text = String(value || "").trim();
  if (!text) return null;

  const parsed = Number(text);
  return Number.isNaN(parsed) ? null : parsed;
}

function toNumber(value: FormDataEntryValue | null): number {
  const parsed = Number(String(value || "0"));
  return Number.isNaN(parsed) ? 0 : parsed;
}

function parseGalleryImageUrls(value: FormDataEntryValue | null): string[] {
  const raw = String(value || "[]").trim();

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

function buildCampaignInput(formData: FormData): CampaignFormInput {
  return {
    title: String(formData.get("title") || ""),
    slug: String(formData.get("slug") || ""),
    shortDescription: String(formData.get("shortDescription") || ""),
    description: String(formData.get("description") || ""),
    coverImageUrl: String(formData.get("coverImageUrl") || ""),
    galleryImageUrls: parseGalleryImageUrls(formData.get("galleryImageUrls")),
    goalAmount: toNumberOrNull(formData.get("goalAmount")),
    status: String(formData.get("status") || "Draft") as CampaignFormInput["status"],
    isFeatured: String(formData.get("isFeatured") || "") === "on",
    sortOrder: toNumber(formData.get("sortOrder")),
    startDate: String(formData.get("startDate") || ""),
    endDate: String(formData.get("endDate") || ""),
  };
}

function getErrorMessage(error: unknown): string {
  if (error instanceof ZodError) {
    return error.issues[0]?.message || "Invalid form data";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
}

export async function createCampaignAction(formData: FormData): Promise<void> {
  try {
    const rawInput = buildCampaignInput(formData);
    const input = campaignSchema.parse(rawInput);

    await createCampaign(input);
  } catch (error) {
    const message = getErrorMessage(error);
    redirect(`/admin/campaigns/create?error=${encodeURIComponent(message)}`);
  }

  revalidatePath("/admin/campaigns");
  redirect("/admin/campaigns?success=created");
}

export async function updateCampaignAction(
  campaignId: number,
  formData: FormData
): Promise<void> {
  try {
    const rawInput = buildCampaignInput(formData);
    const input = campaignSchema.parse(rawInput);

    await updateCampaign(campaignId, input);
  } catch (error) {
    const message = getErrorMessage(error);
    redirect(
      `/admin/campaigns/${campaignId}/edit?error=${encodeURIComponent(message)}`
    );
  }

  revalidatePath("/admin/campaigns");
  redirect("/admin/campaigns?success=updated");
}

export async function deleteCampaignAction(formData: FormData): Promise<void> {
  const campaignId = Number(formData.get("campaignId"));

  if (!Number.isFinite(campaignId)) {
    redirect("/admin/campaigns?error=Invalid%20campaign%20id");
  }

  try {
    await deleteCampaign(campaignId);
  } catch (error) {
    const message = getErrorMessage(error);
    redirect(`/admin/campaigns?error=${encodeURIComponent(message)}`);
  }

  revalidatePath("/admin/campaigns");
  redirect("/admin/campaigns?success=deleted");
}