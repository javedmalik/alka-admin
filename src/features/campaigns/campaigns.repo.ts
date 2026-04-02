import { executeProcedure, executeProcedureNoResult, sql } from "@/lib/db/execute";
import type { CampaignDbRow } from "./campaigns.types";
import type { CampaignInput } from "./campaigns.schema";

export async function getAllCampaignRows() {
  return executeProcedure<CampaignDbRow>("sp_Campaign_GetAll");
}

export async function getCampaignRowById(campaignId: number) {
  const rows = await executeProcedure<CampaignDbRow>("sp_Campaign_GetById", [
    { name: "CampaignId", type: sql.Int, value: campaignId },
  ]);

  return rows[0] ?? null;
}

export async function getCampaignRowBySlug(slug: string) {
  const rows = await executeProcedure<CampaignDbRow>("sp_Campaign_GetBySlug", [
    { name: "Slug", type: sql.NVarChar(220), value: slug },
  ]);

  return rows[0] ?? null;
}

export async function createCampaignRow(data: CampaignInput) {
  const rows = await executeProcedure<{ CampaignId: number }>("sp_Campaign_Create", [
    { name: "Title", type: sql.NVarChar(200), value: data.title },
    { name: "Slug", type: sql.NVarChar(220), value: data.slug },
    {
      name: "ShortDescription",
      type: sql.NVarChar(500),
      value: data.shortDescription || null,
    },
    {
      name: "Description",
      type: sql.NVarChar(sql.MAX),
      value: data.description || null,
    },
    {
      name: "CoverImageUrl",
      type: sql.NVarChar(500),
      value: data.coverImageUrl || null,
    },
    {
      name: "GalleryImageUrls",
      type: sql.NVarChar(sql.MAX),
      value: JSON.stringify(data.galleryImageUrls || []),
    },
    {
      name: "GoalAmount",
      type: sql.Decimal(18, 2),
      value: data.goalAmount,
    },
    { name: "Status", type: sql.NVarChar(30), value: data.status },
    { name: "IsFeatured", type: sql.Bit, value: data.isFeatured },
    { name: "SortOrder", type: sql.Int, value: data.sortOrder },
    {
      name: "StartDate",
      type: sql.Date,
      value: data.startDate ? new Date(data.startDate) : null,
    },
    {
      name: "EndDate",
      type: sql.Date,
      value: data.endDate ? new Date(data.endDate) : null,
    },
  ]);

  return rows[0]?.CampaignId ?? null;
}

export async function updateCampaignRow(campaignId: number, data: CampaignInput) {
  await executeProcedureNoResult("sp_Campaign_Update", [
    { name: "CampaignId", type: sql.Int, value: campaignId },
    { name: "Title", type: sql.NVarChar(200), value: data.title },
    { name: "Slug", type: sql.NVarChar(220), value: data.slug },
    {
      name: "ShortDescription",
      type: sql.NVarChar(500),
      value: data.shortDescription || null,
    },
    {
      name: "Description",
      type: sql.NVarChar(sql.MAX),
      value: data.description || null,
    },
    {
      name: "CoverImageUrl",
      type: sql.NVarChar(500),
      value: data.coverImageUrl || null,
    },
    {
      name: "GalleryImageUrls",
      type: sql.NVarChar(sql.MAX),
      value: JSON.stringify(data.galleryImageUrls || []),
    },
    {
      name: "GoalAmount",
      type: sql.Decimal(18, 2),
      value: data.goalAmount,
    },
    { name: "Status", type: sql.NVarChar(30), value: data.status },
    { name: "IsFeatured", type: sql.Bit, value: data.isFeatured },
    { name: "SortOrder", type: sql.Int, value: data.sortOrder },
    {
      name: "StartDate",
      type: sql.Date,
      value: data.startDate ? new Date(data.startDate) : null,
    },
    {
      name: "EndDate",
      type: sql.Date,
      value: data.endDate ? new Date(data.endDate) : null,
    },
  ]);
}

export async function deleteCampaignRow(campaignId: number) {
  await executeProcedureNoResult("sp_Campaign_Delete", [
    { name: "CampaignId", type: sql.Int, value: campaignId },
  ]);
}