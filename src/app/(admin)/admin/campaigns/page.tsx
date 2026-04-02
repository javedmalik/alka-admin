import Image from "next/image";
import Link from "next/link";
import { getAllCampaigns } from "@/features/campaigns/campaigns.service";
import { type Campaign } from "@/features/campaigns/campaigns.types";
import DeleteButton from "./DeleteButton";
import {
  Plus,
  Edit,
  TrendingUp,
  Target,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
  AlertCircle,
  Globe,
  Star,
  type LucideIcon,
} from "lucide-react";

type CampaignsPageProps = {
  searchParams?: Promise<{
    success?: string;
    error?: string;
  }>;
};

type StatusBadgeConfig = {
  bg: string;
  text: string;
  Icon: LucideIcon;
};

function statusBadgeClass(status: string): StatusBadgeConfig {
  const statusMap: Record<string, StatusBadgeConfig> = {
    Published: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      Icon: CheckCircle,
    },
    Archived: { bg: "bg-slate-100", text: "text-slate-600", Icon: XCircle },
    Draft: { bg: "bg-amber-50", text: "text-amber-700", Icon: AlertCircle },
    Completed: { bg: "bg-blue-50", text: "text-blue-700", Icon: CheckCircle },
  };

  const defaultConfig: StatusBadgeConfig = {
    bg: "bg-amber-50",
    text: "text-amber-700",
    Icon: AlertCircle,
  };

  return statusMap[status] || defaultConfig;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function calculateProgress(raised: number, goal: number): number {
  if (!goal || goal === 0) return 0;
  return Math.min(Math.round((raised / goal) * 100), 100);
}

export default async function CampaignsPage({
  searchParams,
}: CampaignsPageProps) {
  const campaigns = await getAllCampaigns();
  const params = (await searchParams) ?? {};

  const activeCampaignCount = campaigns.filter(
    (c) => c.status === "Published",
  ).length;

  const totalGoalAmount = campaigns.reduce(
    (sum, c) => sum + (c.goalAmount || 0),
    0,
  );
  const totalRaisedAmount = campaigns.reduce(
    (sum, c) => sum + (c.raisedAmount || 0),
    0,
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 px-6 py-4 text-white shadow-xl">
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
            <div className="rounded-xl bg-white/20 p-2 backdrop-blur-sm">
              <Globe className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Campaigns</h1>
              <p className="mt-0.5 text-xs text-purple-100">
                Manage NGO initiatives and fundraising campaigns
              </p>
            </div>
          </div>

          <Link
            href="/admin/campaigns/create"
            className="inline-flex items-center gap-2 rounded-xl bg-white/20 px-4 py-2 text-sm font-medium text-white transition-all hover:scale-105 hover:bg-white/30"
          >
            <Plus className="h-4 w-4" />
            Add Campaign
          </Link>
        </div>
      </div>

      {/* Alert Messages */}
      {params.success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span>Campaign {params.success} successfully.</span>
          </div>
        </div>
      )}

      {params.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>{params.error}</span>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="rounded-lg bg-purple-100 p-2">
              <Globe className="h-5 w-5 text-purple-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {campaigns.length}
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-500">Total Campaigns</p>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="rounded-lg bg-emerald-100 p-2">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {activeCampaignCount}
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-500">Active Campaigns</p>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="rounded-lg bg-amber-100 p-2">
              <Target className="h-5 w-5 text-amber-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {formatCurrency(totalGoalAmount)}
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-500">Total Goal Amount</p>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="rounded-lg bg-blue-100 p-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {formatCurrency(totalRaisedAmount)}
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-500">Total Raised Amount</p>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Image
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Title
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Status
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Progress
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Goal
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Raised
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Featured
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {campaigns.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="mb-3 rounded-full bg-gray-100 p-4">
                        <ImageIcon className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="font-medium text-gray-500">
                        No campaigns found
                      </p>
                      <p className="mt-1 text-sm text-gray-400">
                        Create your first campaign to get started
                      </p>
                      <Link
                        href="/admin/campaigns/create"
                        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700"
                      >
                        <Plus className="h-4 w-4" />
                        Create Campaign
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                campaigns.map((campaign) => {
                  const {
                    bg,
                    text,
                    Icon: StatusIcon,
                  } = statusBadgeClass(campaign.status);
                  const progress = calculateProgress(
                    campaign.raisedAmount || 0,
                    campaign.goalAmount || 0,
                  );

                  return (
                    <tr
                      key={campaign.id}
                      className="group border-b border-gray-100 transition-all hover:bg-purple-50/30"
                    >
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-2">
                          {/* Main banner image */}
                          <div className="relative h-16 w-28 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 shadow-sm">
                            {campaign.coverImageUrl ? (
                              <Image
                                src={campaign.coverImageUrl}
                                alt={campaign.title}
                                fill
                                className="object-cover"
                                sizes="112px"
                              />
                            ) : (
                              <div className="flex h-full w-full flex-col items-center justify-center">
                                <ImageIcon className="h-5 w-5 text-gray-300" />
                                <span className="mt-0.5 text-[10px] text-gray-400">
                                  No Image
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Gallery images below banner */}
                          {campaign.galleryImageUrls &&
                          campaign.galleryImageUrls.length > 0 ? (
                            <div className="flex items-center -space-x-2">
                              {campaign.galleryImageUrls
                                .slice(0, 3)
                                .map((url, index) => (
                                  <div
                                    key={`${campaign.id}-gallery-${index}`}
                                    className="relative h-9 w-9 overflow-hidden rounded-full border-2 border-white bg-gray-100 shadow-sm"
                                  >
                                    <img
                                      src={url}
                                      alt={`${campaign.title} gallery ${index + 1}`}
                                      className="h-full w-full object-cover"
                                    />
                                  </div>
                                ))}

                              {campaign.galleryImageUrls.length > 3 ? (
                                <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-gray-800 text-[10px] font-semibold text-white shadow-sm">
                                  +{campaign.galleryImageUrls.length - 3}
                                </div>
                              ) : null}
                            </div>
                          ) : null}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div>
                          <p className="font-semibold text-gray-900 transition-colors group-hover:text-purple-700">
                            {campaign.title}
                          </p>
                          <p className="mt-0.5 text-xs text-gray-500">
                            {campaign.slug}
                          </p>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${bg} ${text}`}
                        >
                          <StatusIcon className="h-3 w-3" />
                          <span>{campaign.status}</span>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="min-w-[120px]">
                          <div className="mb-1 flex items-center justify-between text-xs">
                            <span className="text-gray-600">{progress}%</span>
                            <span className="text-gray-400">
                              {formatCurrency(campaign.raisedAmount || 0)} /{" "}
                              {formatCurrency(campaign.goalAmount || 0)}
                            </span>
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-500"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <span className="font-medium text-gray-900">
                          {campaign.goalAmount
                            ? formatCurrency(campaign.goalAmount)
                            : "-"}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <span className="font-semibold text-emerald-600">
                          {campaign.raisedAmount
                            ? formatCurrency(campaign.raisedAmount)
                            : "₹ 0"}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        {campaign.isFeatured ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                            <Star className="h-3 w-3" />
                            Featured
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">No</span>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/campaigns/${campaign.id}/edit`}
                            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-all hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700"
                          >
                            <Edit className="h-3.5 w-3.5" />
                            Edit
                          </Link>

                          <DeleteButton
                            campaignId={String(campaign.id)}
                            campaignTitle={campaign.title}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Global Styles for Animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  );
}
