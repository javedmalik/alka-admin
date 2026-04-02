import { campaignSchema } from "./campaigns.schema";
import type { CampaignInput } from "./campaigns.schema";
import type { Campaign, CampaignDbRow } from "./campaigns.types";
import {
  createCampaignRow,
  deleteCampaignRow,
  getAllCampaignRows,
  getCampaignRowById,
  getCampaignRowBySlug,
  updateCampaignRow,
} from "./campaigns.repo";

function toDateString(value: Date | null): string {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
}

function parseGalleryImageUrls(value: string | null): string[] {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

function mapCampaign(row: CampaignDbRow): Campaign {
  return {
    id: row.CampaignId,
    title: row.Title,
    slug: row.Slug,
    shortDescription: row.ShortDescription ?? "",
    description: row.Description ?? "",
    coverImageUrl: row.CoverImageUrl ?? "",
    galleryImageUrls: parseGalleryImageUrls(row.GalleryImageUrls),
    goalAmount: row.GoalAmount ?? null,
    raisedAmount: row.RaisedAmount,
    status: row.Status,
    isFeatured: row.IsFeatured,
    sortOrder: row.SortOrder,
    startDate: toDateString(row.StartDate),
    endDate: toDateString(row.EndDate),
  };
}

export async function getAllCampaigns() {
  const rows = await getAllCampaignRows();
  return rows.map(mapCampaign);
}

export async function getCampaignById(campaignId: number) {
  const row = await getCampaignRowById(campaignId);
  return row ? mapCampaign(row) : null;
}

export async function createCampaign(input: CampaignInput) {
  const parsed = campaignSchema.parse(input);

  const existing = await getCampaignRowBySlug(parsed.slug);
  if (existing) {
    throw new Error("A campaign with this slug already exists.");
  }

  return createCampaignRow(parsed);
}

export async function updateCampaign(campaignId: number, input: CampaignInput) {
  const parsed = campaignSchema.parse(input);

  const existing = await getCampaignRowBySlug(parsed.slug);
  if (existing && existing.CampaignId !== campaignId) {
    throw new Error("A campaign with this slug already exists.");
  }

  return updateCampaignRow(campaignId, parsed);
}

export async function deleteCampaign(campaignId: number) {
  return deleteCampaignRow(campaignId);
}