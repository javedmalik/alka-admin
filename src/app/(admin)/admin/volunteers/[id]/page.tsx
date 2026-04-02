import { notFound } from "next/navigation";
import Link from "next/link";
import { getVolunteerById } from "@/features/volunteers/volunteers.service";
import { updateVolunteerAction } from "../actions";
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Calendar, 
  Save,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  AlertCircle,
  Heart,
  MessageSquare,
  Edit,
  Eye,
  Briefcase,
  type LucideIcon
} from "lucide-react";

type VolunteerDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams?: Promise<{
    error?: string;
    success?: string;
  }>;
};

type StatusConfig = {
  bg: string;
  text: string;
  icon: LucideIcon;
};

type VolunteerStatus = "New" | "Screening" | "Approved" | "Rejected" | "Closed";

function getStatusBadge(status: string): StatusConfig {
  const statusMap: Record<VolunteerStatus, StatusConfig> = {
    New: { bg: "bg-blue-50", text: "text-blue-700", icon: AlertCircle },
    Screening: { bg: "bg-blue-50", text: "text-blue-700", icon: ClockIcon },
    Approved: { bg: "bg-emerald-50", text: "text-emerald-700", icon: CheckCircle },
    Rejected: { bg: "bg-slate-100", text: "text-slate-600", icon: XCircle },
    Closed: { bg: "bg-slate-100", text: "text-slate-600", icon: XCircle },
  };

  const defaultConfig: StatusConfig = { 
    bg: "bg-amber-50", 
    text: "text-amber-700", 
    icon: AlertCircle 
  };

  return statusMap[status as VolunteerStatus] || defaultConfig;
}

function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function VolunteerDetailPage({
  params,
  searchParams,
}: VolunteerDetailPageProps) {
  const { id } = await params;
  const query = (await searchParams) ?? {};
  const volunteerId = Number(id);

  if (!Number.isFinite(volunteerId)) {
    notFound();
  }

  const volunteer = await getVolunteerById(volunteerId);

  if (!volunteer) {
    notFound();
  }

  const boundUpdateAction = updateVolunteerAction.bind(null, volunteerId);
  const statusConfig = getStatusBadge(volunteer.status);
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
              href="/admin/volunteers"
              className="rounded-xl bg-white/20 p-2 backdrop-blur-sm transition-all hover:bg-white/30 hover:scale-105"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white/20 p-2 backdrop-blur-sm">
                <Heart className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">Volunteer Details</h1>
                <p className="mt-0.5 text-xs text-blue-100">
                  Review and manage this volunteer application
                </p>
              </div>
            </div>
          </div>

          <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
            <StatusIcon className="h-3 w-3" />
            <span>{volunteer.status}</span>
          </div>
        </div>
      </div>

      {/* Alert Messages */}
      {query.success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span>Volunteer application updated successfully!</span>
          </div>
        </div>
      )}

      {query.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>{query.error}</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        {/* Volunteer Information Card */}
        <div className="rounded-2xl border border-gray-100 bg-white shadow-xl overflow-hidden">
          <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-6 py-4">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Volunteer Information</h3>
            </div>
            <p className="mt-1 text-sm text-gray-500">Personal details from the application form</p>
          </div>
          
          <div className="p-6 space-y-5">
            <div className="group rounded-xl bg-gradient-to-br from-gray-50 to-white p-4 transition-all hover:shadow-md">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-100 p-2">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Full Name</p>
                  <p className="mt-1 text-base font-semibold text-gray-900">{volunteer.fullName}</p>
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
                    href={`mailto:${volunteer.email}`}
                    className="mt-1 text-base font-medium text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    {volunteer.email}
                  </a>
                </div>
              </div>
            </div>

            {volunteer.phone && (
              <div className="group rounded-xl bg-gradient-to-br from-gray-50 to-white p-4 transition-all hover:shadow-md">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-emerald-100 p-2">
                    <Phone className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Phone Number</p>
                    <a 
                      href={`tel:${volunteer.phone}`}
                      className="mt-1 text-base font-medium text-gray-900 hover:text-emerald-600 hover:underline"
                    >
                      {volunteer.phone}
                    </a>
                  </div>
                </div>
              </div>
            )}

            {volunteer.city && (
              <div className="group rounded-xl bg-gradient-to-br from-gray-50 to-white p-4 transition-all hover:shadow-md">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-amber-100 p-2">
                    <MapPin className="h-5 w-5 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-500">City</p>
                    <p className="mt-1 text-base font-medium text-gray-900">{volunteer.city}</p>
                  </div>
                </div>
              </div>
            )}

            {volunteer.availability && (
              <div className="group rounded-xl bg-gradient-to-br from-gray-50 to-white p-4 transition-all hover:shadow-md">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-indigo-100 p-2">
                    <Clock className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Availability</p>
                    <p className="mt-1 text-base font-medium text-gray-900">{volunteer.availability}</p>
                  </div>
                </div>
              </div>
            )}

            {volunteer.interests && (
              <div className="group rounded-xl bg-gradient-to-br from-gray-50 to-white p-4 transition-all hover:shadow-md">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-pink-100 p-2">
                    <Heart className="h-5 w-5 text-pink-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Areas of Interest</p>
                    <p className="mt-1 text-base font-medium text-gray-900">{volunteer.interests}</p>
                  </div>
                </div>
              </div>
            )}

            {volunteer.message && (
              <div className="group rounded-xl bg-gradient-to-br from-gray-50 to-white p-4 transition-all hover:shadow-md">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-blue-100 p-2">
                    <MessageSquare className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Message / Motivation</p>
                    <div className="mt-2 rounded-lg bg-white p-4 text-sm text-gray-700 leading-relaxed border border-gray-100">
                      {volunteer.message}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="group rounded-xl bg-gradient-to-br from-gray-50 to-white p-4 transition-all hover:shadow-md">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-slate-100 p-2">
                  <Calendar className="h-5 w-5 text-slate-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Submitted On</p>
                  <p className="mt-1 text-base font-medium text-gray-900">{formatDate(volunteer.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Update Form Card */}
        <div className="rounded-2xl border border-gray-100 bg-white shadow-xl overflow-hidden">
          <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-6 py-4">
            <div className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Update Application</h3>
            </div>
            <p className="mt-1 text-sm text-gray-500">Manage application status and add internal notes</p>
          </div>

          <form action={boundUpdateAction} className="p-6 space-y-5">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-600">Status</label>
              <select
                name="status"
                defaultValue={volunteer.status}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
              >
                <option value="New">New</option>
                <option value="Screening">Screening</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-600">Admin Note</label>
              <textarea
                name="adminNote"
                defaultValue={volunteer.adminNote || ""}
                rows={6}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
                placeholder="Add internal notes about this volunteer..."
              />
              <p className="mt-1 text-xs text-gray-400">These notes are only visible to admins</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
              <Link
                href="/admin/volunteers"
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-all hover:border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 text-sm font-medium text-white transition-all hover:from-blue-700 hover:to-blue-800"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </button>
            </div>
          </form>
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