import Link from "next/link";
import { getAllContacts } from "@/features/contacts/contacts.service";
import { type Contact } from "@/features/contacts/contacts.types";
import { 
  Mail, 
  Phone, 
  User, 
  Calendar, 
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  MessageSquare,
  type LucideIcon
} from "lucide-react";

type ContactsPageProps = {
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

// Use the exact status values from your ContactStatus type
type ContactStatus = "Resolved" | "Closed" | "InProgress";

function statusBadgeClass(status: string): StatusConfig {
  const statusMap: Record<ContactStatus, StatusConfig> = {
    Resolved: { bg: "bg-emerald-50", text: "text-emerald-700", icon: CheckCircle },
    Closed: { bg: "bg-slate-100", text: "text-slate-600", icon: XCircle },
    InProgress: { bg: "bg-blue-50", text: "text-blue-700", icon: Clock },
  };

  const defaultConfig: StatusConfig = { 
    bg: "bg-amber-50", 
    text: "text-amber-700", 
    icon: AlertCircle 
  };

  // Safe cast; if status doesn't match, default is used
  return statusMap[status as ContactStatus] || defaultConfig;
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

export default async function ContactsPage({
  searchParams,
}: ContactsPageProps) {
  const contacts = (await getAllContacts()) as Contact[];
  const params = (await searchParams) ?? {};

  // Statistics using actual status values
  const totalContacts = contacts.length;
  const resolvedCount = contacts.filter((c) => c.status === "Resolved").length;
  const inProgressCount = contacts.filter((c) => c.status === "InProgress").length;
  const closedCount = contacts.filter((c) => c.status === "Closed").length;

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
              <MessageSquare className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Contacts</h1>
              <p className="mt-0.5 text-xs text-blue-100">
                Manage website contact enquiries and messages
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Messages */}
      {params.success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span>Contact {params.success} successfully.</span>
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
              <MessageSquare className="h-5 w-5 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{totalContacts}</span>
          </div>
          <p className="mt-2 text-sm text-gray-500">Total Contacts</p>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="rounded-lg bg-blue-100 p-2">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{inProgressCount}</span>
          </div>
          <p className="mt-2 text-sm text-gray-500">In Progress</p>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="rounded-lg bg-emerald-100 p-2">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{resolvedCount}</span>
          </div>
          <p className="mt-2 text-sm text-gray-500">Resolved</p>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="rounded-lg bg-slate-100 p-2">
              <XCircle className="h-5 w-5 text-slate-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{closedCount}</span>
          </div>
          <p className="mt-2 text-sm text-gray-500">Closed</p>
        </div>
      </div>

      {/* Contacts Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Contact
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Subject
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Status
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
              {contacts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="mb-3 rounded-full bg-gray-100 p-4">
                        <MessageSquare className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="font-medium text-gray-500">
                        No contact enquiries found
                      </p>
                      <p className="mt-1 text-sm text-gray-400">
                        When visitors contact you, they will appear here
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                contacts.map((contact) => {
                  const { bg, text, icon: StatusIcon } = statusBadgeClass(contact.status);
                  
                  return (
                    <tr
                      key={contact.id}
                      className="group border-b border-gray-100 transition-all hover:bg-blue-50/30"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-blue-200">
                            <User className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                              {contact.fullName}
                            </p>
                            <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-500">
                              <Mail className="h-3 w-3" />
                              <span className="truncate max-w-[150px]">{contact.email}</span>
                              {contact.phone && (
                                <>
                                  <span className="text-gray-300">•</span>
                                  <Phone className="h-3 w-3" />
                                  <span>{contact.phone}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-gray-800">
                            {contact.subject || "No subject"}
                          </p>
                          <p className="mt-0.5 text-xs text-gray-400 line-clamp-1 max-w-[200px]">
                            {contact.message?.substring(0, 60)}
                            {contact.message && contact.message.length > 60 ? "..." : ""}
                          </p>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${bg} ${text}`}>
                          <StatusIcon className="h-3 w-3" />
                          <span>{contact.status}</span>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                          <Calendar className="h-3.5 w-3.5 text-gray-400" />
                          <span className="text-xs">{formatDate(contact.createdAt)}</span>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/contacts/${contact.id}`}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-all hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View Details
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
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}