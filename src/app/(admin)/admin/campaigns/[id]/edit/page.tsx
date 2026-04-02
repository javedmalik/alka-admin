import { notFound } from "next/navigation";
import { getCampaignById } from "@/features/campaigns/campaigns.service";
import { updateCampaignAction } from "../../actions";
import CampaignForm from "./CampaignForm";
import { ArrowLeft, Edit, Calendar, Target, Globe } from "lucide-react";
import Link from "next/link";

type EditCampaignPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams?: Promise<{
    error?: string;
    success?: string;
  }>;
};

export default async function EditCampaignPage({
  params,
  searchParams,
}: EditCampaignPageProps) {
  const { id } = await params;
  const query = (await searchParams) ?? {};
  const campaignId = Number(id);

  if (!Number.isFinite(campaignId)) {
    notFound();
  }

  const campaign = await getCampaignById(campaignId);

  if (!campaign) {
    notFound();
  }

  const boundUpdateAction = updateCampaignAction.bind(null, campaignId);

  // Format dates for display
  const formatDateForInput = (date: Date | null | undefined) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 px-6 py-4 text-white shadow-xl">
        <div className="absolute inset-0 opacity-10">
          <div 
            className="absolute -top-40 -right-40 h-80 w-80 animate-pulse rounded-full bg-white blur-3xl"
            style={{ animation: "pulse 4s ease-in-out infinite" }}
          />
          <div 
            className="absolute -bottom-40 -left-40 h-80 w-80 animate-pulse rounded-full bg-white blur-3xl"
            style={{ animation: "pulse 4s ease-in-out infinite 1s" }}
          />
        </div>

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/campaigns"
              className="rounded-xl bg-white/20 p-2 backdrop-blur-sm transition-all hover:bg-white/30 hover:scale-105"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white/20 p-2 backdrop-blur-sm">
                <Edit className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">Edit Campaign</h1>
                <p className="mt-0.5 text-xs text-blue-100">
                  Update campaign details and manage your fundraising initiative
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-white/20 px-3 py-1 text-xs backdrop-blur-sm">
              ID: {campaign.id}
            </div>
          </div>
        </div>
      </div>

      {/* Alert Messages */}
      {query.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{query.error}</span>
          </div>
        </div>
      )}

      {query.success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Campaign updated successfully!</span>
          </div>
        </div>
      )}

      {/* Campaign Info Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-blue-100 p-2">
              <Target className="h-4 w-4 text-blue-600" />
            </div>
            <p className="text-xs text-gray-500">Goal Amount</p>
          </div>
          <p className="mt-2 text-lg font-semibold text-gray-900">
            {campaign.goalAmount ? `₹ ${campaign.goalAmount.toLocaleString()}` : "Not set"}
          </p>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-emerald-100 p-2">
              <Calendar className="h-4 w-4 text-emerald-600" />
            </div>
            <p className="text-xs text-gray-500">Start Date</p>
          </div>
          <p className="mt-2 text-lg font-semibold text-gray-900">
            {campaign.startDate ? new Date(campaign.startDate).toLocaleDateString() : "Not set"}
          </p>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-amber-100 p-2">
              <Calendar className="h-4 w-4 text-amber-600" />
            </div>
            <p className="text-xs text-gray-500">End Date</p>
          </div>
          <p className="mt-2 text-lg font-semibold text-gray-900">
            {campaign.endDate ? new Date(campaign.endDate).toLocaleDateString() : "Not set"}
          </p>
        </div>
      </div>

      {/* Campaign Form */}
      <CampaignForm
        defaultValues={{
          title: campaign.title,
          slug: campaign.slug,
          shortDescription: campaign.shortDescription || "",
          description: campaign.description || "",
          galleryImageUrls: campaign.galleryImageUrls,
          coverImageUrl: campaign.coverImageUrl || "",
          goalAmount: campaign.goalAmount,
          status: campaign.status as "Draft" | "Published" | "Archived",
          isFeatured: campaign.isFeatured,
          sortOrder: campaign.sortOrder,
          startDate: campaign.startDate,
          endDate: campaign.endDate,
        }}
        formAction={boundUpdateAction}
        submitLabel="Update Campaign"
      />
    </div>
  );
}