export type CampaignStatus = "Draft" | "Published" | "Archived";

export type CampaignDbRow = {
  CampaignId: number;
  Title: string;
  Slug: string;
  ShortDescription: string | null;
  Description: string | null;
  CoverImageUrl: string | null;
  GalleryImageUrls: string | null;
  GoalAmount: number | null;
  RaisedAmount: number;
  Status: CampaignStatus;
  IsFeatured: boolean;
  SortOrder: number;
  StartDate: Date | null;
  EndDate: Date | null;
  CreatedAt: Date;
  UpdatedAt: Date;
};

export type Campaign = {
  id: number;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  coverImageUrl: string;
  galleryImageUrls: string[];
  goalAmount: number | null;
  raisedAmount: number;
  status: CampaignStatus;
  isFeatured: boolean;
  sortOrder: number;
  startDate: string;
  endDate: string;
};