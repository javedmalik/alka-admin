import Link from "next/link";
import { getAllDonations } from "@/features/donations/donations.service";
import {
  syncDonationFromRazorpayAction,
  syncDonationsByDateRangeAction,
} from "./actions";
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  Calendar, 
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  CreditCard,
  Banknote,
  Wallet,
  Search,
  type LucideIcon
} from "lucide-react";

type DonationsPageProps = {
  searchParams?: Promise<{
    success?: string;
    error?: string;
  }>;
};

type StatusConfig = {
  bg: string;
  text: string;
  icon: LucideIcon;
};

type DonationStatus = "completed" | "failed" | "refunded" | "pending";

function getStatusBadge(status: string): StatusConfig {
  const statusMap: Record<DonationStatus, StatusConfig> = {
    completed: { bg: "bg-emerald-50", text: "text-emerald-700", icon: CheckCircle },
    failed: { bg: "bg-red-50", text: "text-red-700", icon: XCircle },
    refunded: { bg: "bg-slate-100", text: "text-slate-600", icon: AlertCircle },
    pending: { bg: "bg-amber-50", text: "text-amber-700", icon: AlertCircle },
  };

  const defaultConfig: StatusConfig = { 
    bg: "bg-amber-50", 
    text: "text-amber-700", 
    icon: AlertCircle 
  };

  return statusMap[status as DonationStatus] || defaultConfig;
}

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatDate(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - d.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return "Today";
  } else if (diffDays === 1) {
    return "Yesterday";
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }
}

function getSuccessMessage(success?: string): string {
  if (!success) return "";

  if (success === "synced") {
    return "Donation synced successfully.";
  }

  if (success.startsWith("synced-")) {
    const count = success.replace("synced-", "");
    return `${count} donation(s) synced successfully.`;
  }

  return "Operation completed successfully.";
}

export default async function DonationsPage({
  searchParams,
}: DonationsPageProps) {
  const donations = await getAllDonations();
  const params = (await searchParams) ?? {};
  const successMessage = getSuccessMessage(params.success);

  // Calculate statistics with proper type checking
  const totalDonations = donations.length;
  const totalAmount = donations.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
  const completedCount = donations.filter((d) => d.status === "completed").length;
  const pendingCount = donations.filter((d) => d.status === "pending").length;

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
            <div className="rounded-xl bg-white/20 p-2 backdrop-blur-sm">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Donations</h1>
              <p className="mt-0.5 text-xs text-blue-100">
                View local donation records and sync Razorpay payments
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Messages */}
      {successMessage && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span>{successMessage}</span>
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
            <div className="rounded-lg bg-blue-100 p-2">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{totalDonations}</span>
          </div>
          <p className="mt-2 text-sm text-gray-500">Total Donations</p>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="rounded-lg bg-emerald-100 p-2">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {formatCurrency(totalAmount, "INR")}
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-500">Total Amount</p>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="rounded-lg bg-emerald-100 p-2">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{completedCount}</span>
          </div>
          <p className="mt-2 text-sm text-gray-500">Successful</p>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="rounded-lg bg-amber-100 p-2">
              <AlertCircle className="h-5 w-5 text-amber-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{pendingCount}</span>
          </div>
          <p className="mt-2 text-sm text-gray-500">Pending</p>
        </div>
      </div>

      {/* Sync Cards */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Sync by ID Card */}
        {/* <div className="rounded-2xl border border-gray-100 bg-white shadow-xl overflow-hidden">
          <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-6 py-4">
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Sync by Payment ID</h3>
            </div>
            <p className="mt-1 text-sm text-gray-500">Sync a single Razorpay payment by its ID</p>
          </div>

          <form action={syncDonationFromRazorpayAction} className="p-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-600">Payment ID</label>
              <input
                type="text"
                name="paymentId"
                placeholder="Enter Razorpay payment id e.g. pay_xxxxx"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
              />
              <p className="mt-1 text-xs text-gray-400">Example: pay_1234567890abcdef</p>
            </div>
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 text-sm font-medium text-white transition-all hover:from-blue-700 hover:to-blue-800"
            >
              <RefreshCw className="h-4 w-4" />
              Sync Payment
            </button>
          </form>
        </div> */}

        {/* Sync by Date Range Card */}
        {/* <div className="rounded-2xl border border-gray-100 bg-white shadow-xl overflow-hidden">
          <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-6 py-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Sync by Date Range</h3>
            </div>
            <p className="mt-1 text-sm text-gray-500">Sync multiple Razorpay payments within a date range</p>
          </div>

          <form action={syncDonationsByDateRangeAction} className="p-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-600">From Date</label>
                <input
                  type="date"
                  name="fromDate"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-600">To Date</label>
                <input
                  type="date"
                  name="toDate"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-600">Max Payments to Fetch</label>
              <input
                type="number"
                name="count"
                defaultValue={50}
                min={1}
                max={100}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
              />
              <p className="mt-1 text-xs text-gray-400">Razorpay allows up to 100 per request</p>
            </div>

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 text-sm font-medium text-white transition-all hover:from-blue-700 hover:to-blue-800"
            >
              <RefreshCw className="h-4 w-4" />
              Sync Date Range
            </button>
          </form>
        </div> */}
      </div>

      {/* Donations Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Donor
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Amount
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Payment ID
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Status
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Method
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Date
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Actions
                </th>
               </tr>
            </thead>

            <tbody>
              {donations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="mb-3 rounded-full bg-gray-100 p-4">
                        <DollarSign className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="font-medium text-gray-500">No donations found</p>
                      <p className="mt-1 text-sm text-gray-400">
                        Sync Razorpay payments to view donations
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                donations.map((donation) => {
                  const { bg, text, icon: StatusIcon } = getStatusBadge(donation.status);
                  
                  return (
                    <tr
                      key={donation.donationId}
                      className="group border-b border-gray-100 transition-all hover:bg-blue-50/30"
                    >
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                            {donation.donorName}
                          </p>
                          <p className="mt-0.5 text-xs text-gray-500">{donation.donorEmail}</p>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <DollarSign className="h-3.5 w-3.5 text-gray-400" />
                          <span className="font-semibold text-emerald-600">
                            {formatCurrency(donation.amount, donation.currency)}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <code className="text-xs bg-gray-50 px-2 py-1 rounded border border-gray-200 font-mono">
                          {donation.paymentId}
                        </code>
                      </td>

                      <td className="px-4 py-3">
                        <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${bg} ${text}`}>
                          <StatusIcon className="h-3 w-3" />
                          <span>{donation.status}</span>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          {donation.method === "card" ? (
                            <CreditCard className="h-3.5 w-3.5 text-gray-400" />
                          ) : donation.method === "upi" ? (
                            <Wallet className="h-3.5 w-3.5 text-gray-400" />
                          ) : (
                            <Banknote className="h-3.5 w-3.5 text-gray-400" />
                          )}
                          <span className="text-sm text-gray-700 capitalize">
                            {donation.method || "-"}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                          <Calendar className="h-3.5 w-3.5 text-gray-400" />
                          <span className="text-xs">
                            {donation.createdAt ? formatDate(donation.createdAt) : "-"}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/donations/${donation.donationId}`}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-all hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}