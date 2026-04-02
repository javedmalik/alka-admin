import { notFound } from "next/navigation";
import Link from "next/link";
import { getDonationById } from "@/features/donations/donations.service";
import { getSafeRazorpayPaymentById } from "@/lib/payments/razorpay";
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  DollarSign, 
  CreditCard, 
  Hash, 
  Tag, 
  Calendar, 
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Wallet,
  Banknote,
  FileText,
  Eye,
  type LucideIcon
} from "lucide-react";

type DonationDetailPageProps = {
  params: Promise<{
    id: string;
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
    pending: { bg: "bg-amber-50", text: "text-amber-700", icon: Clock },
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

function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatLocalDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getPaymentMethodIcon(method: string | undefined): LucideIcon {
  if (method === "card") return CreditCard;
  if (method === "upi") return Wallet;
  if (method === "netbanking") return Banknote;
  return CreditCard;
}

export default async function DonationDetailPage({
  params,
}: DonationDetailPageProps) {
  const { id } = await params;
  const donationId = Number(id);

  if (!Number.isFinite(donationId)) {
    notFound();
  }

  const donation = await getDonationById(donationId);

  if (!donation) {
    notFound();
  }

  // Handle null paymentId by converting to undefined or skipping
  const razorpayPayment = donation.paymentId 
    ? await getSafeRazorpayPaymentById(donation.paymentId)
    : null;

  const statusConfig = getStatusBadge(donation.status);
  const StatusIcon = statusConfig.icon;

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
              href="/admin/donations"
              className="rounded-xl bg-white/20 p-2 backdrop-blur-sm transition-all hover:bg-white/30 hover:scale-105"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white/20 p-2 backdrop-blur-sm">
                <DollarSign className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">Donation Details</h1>
                <p className="mt-0.5 text-xs text-blue-100">
                  Local donation record and live Razorpay payment details
                </p>
              </div>
            </div>
          </div>

          <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
            <StatusIcon className="h-3 w-3" />
            <span>{donation.status}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Local Record Card */}
        <div className="rounded-2xl border border-gray-100 bg-white shadow-xl overflow-hidden">
          <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-6 py-4">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Local Record</h3>
            </div>
            <p className="mt-1 text-sm text-gray-500">Stored donation information</p>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="group rounded-xl bg-gradient-to-br from-gray-50 to-white p-4 transition-all hover:shadow-md">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-100 p-2">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Donor Name</p>
                  <p className="mt-1 text-base font-semibold text-gray-900">{donation.donorName}</p>
                </div>
              </div>
            </div>

            <div className="group rounded-xl bg-gradient-to-br from-gray-50 to-white p-4 transition-all hover:shadow-md">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-100 p-2">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Email Address</p>
                  <a 
                    href={`mailto:${donation.donorEmail}`}
                    className="mt-1 text-base font-medium text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    {donation.donorEmail}
                  </a>
                </div>
              </div>
            </div>

            {donation.donorPhone && (
              <div className="group rounded-xl bg-gradient-to-br from-gray-50 to-white p-4 transition-all hover:shadow-md">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-emerald-100 p-2">
                    <Phone className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Phone Number</p>
                    <a 
                      href={`tel:${donation.donorPhone}`}
                      className="mt-1 text-base font-medium text-gray-900 hover:text-emerald-600 hover:underline"
                    >
                      {donation.donorPhone}
                    </a>
                  </div>
                </div>
              </div>
            )}

            <div className="group rounded-xl bg-gradient-to-br from-gray-50 to-white p-4 transition-all hover:shadow-md">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-emerald-100 p-2">
                  <DollarSign className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Amount</p>
                  <p className="mt-1 text-2xl font-bold text-emerald-600">
                    {formatCurrency(donation.amount, donation.currency)}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="group rounded-xl bg-gradient-to-br from-gray-50 to-white p-4 transition-all hover:shadow-md">
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-gray-400" />
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Payment ID</p>
                </div>
                <p className="mt-1 font-mono text-sm text-gray-900 break-all">
                  {donation.paymentId || "-"}
                </p>
              </div>

              <div className="group rounded-xl bg-gradient-to-br from-gray-50 to-white p-4 transition-all hover:shadow-md">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-gray-400" />
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Order ID</p>
                </div>
                <p className="mt-1 font-mono text-sm text-gray-900 break-all">
                  {donation.orderId || "-"}
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="group rounded-xl bg-gradient-to-br from-gray-50 to-white p-4 transition-all hover:shadow-md">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-gray-400" />
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Payment Method</p>
                </div>
                <p className="mt-1 text-sm font-medium text-gray-900 capitalize">
                  {donation.method || "-"}
                </p>
              </div>

              <div className="group rounded-xl bg-gradient-to-br from-gray-50 to-white p-4 transition-all hover:shadow-md">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Date</p>
                </div>
                <p className="mt-1 text-sm font-medium text-gray-900">
                  {donation.createdAt ? formatLocalDate(donation.createdAt) : "-"}
                </p>
              </div>
            </div>

            {donation.description && (
              <div className="group rounded-xl bg-gradient-to-br from-gray-50 to-white p-4 transition-all hover:shadow-md">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-blue-100 p-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Description</p>
                    <p className="mt-1 text-sm text-gray-700">{donation.description}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Razorpay Payment Card */}
        <div className="rounded-2xl border border-gray-100 bg-white shadow-xl overflow-hidden">
          <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-6 py-4">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Razorpay Payment</h3>
            </div>
            <p className="mt-1 text-sm text-gray-500">Live payment details from Razorpay</p>
          </div>

          <div className="p-6">
            {!razorpayPayment ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-6 text-center">
                <AlertCircle className="mx-auto h-8 w-8 text-amber-600 mb-2" />
                <p className="text-sm text-amber-700 font-medium">
                  Live Razorpay payment details are not available
                </p>
                <p className="mt-1 text-xs text-amber-600">
                  This donation might have been recorded manually or the payment ID is invalid
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="group rounded-xl bg-gradient-to-br from-gray-50 to-white p-4 transition-all hover:shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-blue-100 p-2">
                      <Hash className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Payment ID</p>
                      <p className="mt-1 font-mono text-sm text-gray-900 break-all">{razorpayPayment.id}</p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="group rounded-xl bg-gradient-to-br from-gray-50 to-white p-4 transition-all hover:shadow-md">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Amount</p>
                    </div>
                    <p className="mt-1 text-xl font-bold text-emerald-600">
                      {formatCurrency(razorpayPayment.amount / 100, razorpayPayment.currency)}
                    </p>
                  </div>

                  <div className="group rounded-xl bg-gradient-to-br from-gray-50 to-white p-4 transition-all hover:shadow-md">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-gray-400" />
                      <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Status</p>
                    </div>
                    <div className="mt-1">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        razorpayPayment.status === "captured" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                      }`}>
                        {razorpayPayment.status === "captured" ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                        {razorpayPayment.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="group rounded-xl bg-gradient-to-br from-gray-50 to-white p-4 transition-all hover:shadow-md">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-gray-400" />
                      <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Payment Method</p>
                    </div>
                    <div className="mt-1 flex items-center gap-1.5">
                      {(() => {
                        const MethodIcon = getPaymentMethodIcon(razorpayPayment.method || undefined);
                        return <MethodIcon className="h-4 w-4 text-gray-500" />;
                      })()}
                      <span className="text-sm font-medium text-gray-900 capitalize">
                        {razorpayPayment.method || "-"}
                      </span>
                    </div>
                  </div>

                  <div className="group rounded-xl bg-gradient-to-br from-gray-50 to-white p-4 transition-all hover:shadow-md">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Created At</p>
                    </div>
                    <p className="mt-1 text-sm font-medium text-gray-900">
                      {formatDate(razorpayPayment.created_at)}
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {razorpayPayment.email && (
                    <div className="group rounded-xl bg-gradient-to-br from-gray-50 to-white p-4 transition-all hover:shadow-md">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Email</p>
                      </div>
                      <p className="mt-1 text-sm text-gray-900 break-all">{razorpayPayment.email}</p>
                    </div>
                  )}

                  {razorpayPayment.contact && (
                    <div className="group rounded-xl bg-gradient-to-br from-gray-50 to-white p-4 transition-all hover:shadow-md">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Contact</p>
                      </div>
                      <p className="mt-1 text-sm text-gray-900">{razorpayPayment.contact}</p>
                    </div>
                  )}
                </div>

                {razorpayPayment.description && (
                  <div className="group rounded-xl bg-gradient-to-br from-gray-50 to-white p-4 transition-all hover:shadow-md">
                    <div className="flex items-start gap-2">
                      <FileText className="h-4 w-4 text-gray-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Description</p>
                        <p className="mt-1 text-sm text-gray-700">{razorpayPayment.description}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
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