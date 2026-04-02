import Link from "next/link";
import { auth } from "@/auth";
import { getDashboardData } from "@/features/dashboard/dashboard.service";
import {
  TrendingUp,
  Users,
  Heart,
  DollarSign,
  Target,
  Eye,
  Calendar,
  ArrowRight,
  Award,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
  Activity,
  Zap,
  Sparkles,
  Mail,
  Phone,
  MapPin,
  Globe,
  Shield,
  UserCheck,
  Gift,
  MessageCircle,
  HandHeart,
  CreditCard,
  type LucideIcon,
} from "lucide-react";

type StatusConfig = {
  bg: string;
  text: string;
  icon: LucideIcon;
};

type Trend = {
  value: number;
  isPositive: boolean;
};

type StatCardProps = {
  title: string;
  value: string | number;
  href: string;
  icon: LucideIcon;
  trend?: Trend;
  gradient: string;
  iconBg: string;
};

type RecentItem = {
  id: string | number;
  status: string;
  createdAt?: string | Date | null;
  donorName?: string;
  fullName?: string;
  amount?: number;
  currency?: string;
  email?: string;
  phone?: string;
};

type RecentItemCardProps = {
  item: RecentItem;
  type: "donation" | "contact" | "volunteer";
  href: string;
};

function statusBadgeClass(status: string) {
  const statusMap: Record<string, StatusConfig> = {
    Published: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      icon: CheckCircle,
    },
    Resolved: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      icon: CheckCircle,
    },
    Approved: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      icon: CheckCircle,
    },
    completed: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      icon: CheckCircle,
    },
    Closed: { bg: "bg-slate-100", text: "text-slate-600", icon: XCircle },
    Rejected: { bg: "bg-slate-100", text: "text-slate-600", icon: XCircle },
    failed: { bg: "bg-slate-100", text: "text-slate-600", icon: XCircle },
    refunded: { bg: "bg-slate-100", text: "text-slate-600", icon: XCircle },
    InProgress: { bg: "bg-blue-50", text: "text-blue-700", icon: Clock },
    Screening: { bg: "bg-blue-50", text: "text-blue-700", icon: Clock },
  };

  const config: StatusConfig = statusMap[status] || {
    bg: "bg-amber-50",
    text: "text-amber-700",
    icon: AlertCircle,
  };

  const Icon = config.icon;

  return { bg: config.bg, text: config.text, Icon };
}

function StatCard({
  title,
  value,
  href,
  icon: Icon,
  trend,
  gradient,
}: StatCardProps) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl border border-gray-100"
    >
      {/* Animated gradient background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-10`}
      />

      {/* Shine effect */}
      <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent" />

      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div
            className={`rounded-2xl bg-gradient-to-br ${gradient} p-3 shadow-lg transform transition-transform duration-300 group-hover:scale-110`}
          >
            <Icon className="h-6 w-6 text-white" />
          </div>

          {trend && (
            <div
              className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium backdrop-blur-sm ${
                trend.isPositive
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-red-50 text-red-600"
              }`}
            >
              {trend.isPositive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingUp className="h-3 w-3 rotate-180" />
              )}
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>

        <h3 className="mt-4 text-sm font-medium text-gray-500">{title}</h3>
        <p className="mt-2 text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          {value}
        </p>

        <div className="absolute bottom-6 right-6 translate-x-2 transform opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
          <div className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-1.5 shadow-lg">
            <ArrowRight className="h-4 w-4 text-white" />
          </div>
        </div>
      </div>
    </Link>
  );
}

function RecentItemCard({ item, type, href }: RecentItemCardProps) {
  const { bg, text, Icon } = statusBadgeClass(item.status);
  const StatusIcon = Icon;

  const getIcon = () => {
    switch (type) {
      case "donation":
        return <Gift className="h-5 w-5 text-emerald-500" />;
      case "contact":
        return <MessageCircle className="h-5 w-5 text-blue-500" />;
      case "volunteer":
        return <HandHeart className="h-5 w-5 text-pink-500" />;
    }
  };

  const getContactIcon = () => {
    if (type === "contact") return <Mail className="h-3 w-3" />;
    if (type === "volunteer") return <Phone className="h-3 w-3" />;
    return <Calendar className="h-3 w-3" />;
  };

  return (
    <Link href={`${href}/${item.id}`} className="block group">
      <div className="rounded-xl border border-gray-100 bg-white p-4 transition-all duration-300 hover:border-purple-200 hover:shadow-xl hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-transparent">
        <div className="flex items-start gap-3">
          <div className="mt-1 rounded-lg bg-gradient-to-br from-gray-100 to-gray-50 p-2 group-hover:scale-110 transition-transform duration-300">
            {getIcon()}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <p className="font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">
                  {type === "donation" ? item.donorName : item.fullName}
                </p>
                {type === "donation" ? (
                  <p className="mt-1 text-sm font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
                    {item.currency === "INR" ? "₹" : "$"}{" "}
                    {(item.amount ?? 0).toLocaleString()} {item.currency ?? ""}
                  </p>
                ) : (
                  <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                    {getContactIcon()}
                    <span className="truncate">{item.email ?? "-"}</span>
                  </div>
                )}
              </div>
              <div
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${bg} ${text} shrink-0`}
              >
                <StatusIcon className="h-3 w-3" />
                <span>{item.status}</span>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "-"}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "-"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default async function AdminDashboardPage() {
  const session = await auth();
  const dashboard = await getDashboardData();

  const stats = [
    {
      title: "Total Campaigns",
      value: dashboard.summary.totalCampaigns,
      href: "/admin/campaigns",
      icon: Target,
      gradient: "from-purple-500 to-purple-600",
      iconBg: "bg-purple-100",
      trend: { value: 12, isPositive: true },
    },
    {
      title: "Active Contacts",
      value: dashboard.summary.totalContacts,
      href: "/admin/contacts",
      icon: MessageCircle,
      gradient: "from-blue-500 to-blue-600",
      iconBg: "bg-blue-100",
      trend: { value: 8, isPositive: true },
    },
    {
      title: "Volunteers",
      value: dashboard.summary.totalVolunteers,
      href: "/admin/volunteers",
      icon: HandHeart,
      gradient: "from-pink-500 to-pink-600",
      iconBg: "bg-pink-100",
      trend: { value: 5, isPositive: true },
    },
    {
      title: "Donations",
      value: dashboard.summary.totalDonations,
      href: "/admin/donations",
      icon: Gift,
      gradient: "from-emerald-500 to-emerald-600",
      iconBg: "bg-emerald-100",
      trend: { value: 15, isPositive: true },
    },
    {
      title: "Total Amount",
      value: `₹ ${dashboard.summary.totalDonationAmount.toLocaleString()}`,
      href: "/admin/donations",
      icon: CreditCard,
      gradient: "from-amber-500 to-amber-600",
      iconBg: "bg-amber-100",
      trend: { value: 23, isPositive: true },
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 px-6 py-4 text-white shadow-xl">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-white blur-3xl"
            style={{ animation: "pulse 4s ease-in-out infinite" }}
          />
          <div
            className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-white blur-3xl"
            style={{ animation: "pulse 4s ease-in-out infinite 1s" }}
          />
        </div>

        {/* Floating icons */}
        <div
          className="absolute top-2 right-32"
          style={{ animation: "float 6s ease-in-out infinite" }}
        >
          <Sparkles className="h-8 w-8 text-white/20" />
        </div>
        <div
          className="absolute bottom-2 left-32"
          style={{ animation: "float-delay 8s ease-in-out infinite" }}
        >
          <Zap className="h-6 w-6 text-white/20" />
        </div>

        <div className="relative z-10 flex items-center justify-between gap-4">
          {/* Left Section - Welcome & User Info */}
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-white/20 backdrop-blur-sm p-1.5">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">
                Welcome back!
              </h1>
              <p className="text-blue-100 text-xs mt-0.5">
                {session?.user?.name || "Admin"} ·{" "}
                {new Date().toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Right Section - Stats Badges */}
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-sm px-3 py-1.5 text-xs font-medium">
              <Activity className="h-3 w-3" />
              <span>{dashboard.summary.totalDonations} today</span>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-sm px-3 py-1.5 text-xs font-medium">
              <BarChart3 className="h-3 w-3" />
              <span>
                +{dashboard.summary.totalDonationAmount.toLocaleString()} this
                month
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* Recent Contacts */}
        <div className="rounded-2xl bg-white shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-shadow duration-300">
          <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-2 shadow-lg">
                  <MessageCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Recent Contacts
                  </h3>
                  <p className="text-sm text-gray-500">
                    Latest inquiries and messages
                  </p>
                </div>
              </div>
              <Link
                href="/admin/contacts"
                className="flex items-center gap-1 text-sm font-medium text-purple-600 hover:text-purple-700 transition-all hover:gap-2 group"
              >
                View all
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          <div className="max-h-[500px] overflow-y-auto p-5 space-y-3">
            {dashboard.recentContacts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <MessageCircle className="h-12 w-12 text-gray-300 mb-3" />
                <p className="text-sm text-gray-500">No recent contacts</p>
              </div>
            ) : (
              dashboard.recentContacts.map((item) => (
                <RecentItemCard
                  key={item.id}
                  item={item}
                  type="contact"
                  href="/admin/contacts"
                />
              ))
            )}
          </div>
        </div>

        {/* Recent Volunteers */}
        <div className="rounded-2xl bg-white shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-shadow duration-300">
          <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 p-2 shadow-lg">
                  <HandHeart className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Recent Volunteers
                  </h3>
                  <p className="text-sm text-gray-500">
                    New volunteer registrations
                  </p>
                </div>
              </div>
              <Link
                href="/admin/volunteers"
                className="flex items-center gap-1 text-sm font-medium text-purple-600 hover:text-purple-700 transition-all hover:gap-2 group"
              >
                View all
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          <div className="max-h-[500px] overflow-y-auto p-5 space-y-3">
            {dashboard.recentVolunteers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <HandHeart className="h-12 w-12 text-gray-300 mb-3" />
                <p className="text-sm text-gray-500">No recent volunteers</p>
              </div>
            ) : (
              dashboard.recentVolunteers.map((item) => (
                <RecentItemCard
                  key={item.id}
                  item={item}
                  type="volunteer"
                  href="/admin/volunteers"
                />
              ))
            )}
          </div>
        </div>

        {/* Recent Donations */}
        <div className="rounded-2xl bg-white shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-shadow duration-300">
          <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-2 shadow-lg">
                  <Gift className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Recent Donations
                  </h3>
                  <p className="text-sm text-gray-500">
                    Latest financial contributions
                  </p>
                </div>
              </div>
              <Link
                href="/admin/donations"
                className="flex items-center gap-1 text-sm font-medium text-purple-600 hover:text-purple-700 transition-all hover:gap-2 group"
              >
                View all
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          <div className="max-h-[500px] overflow-y-auto p-5 space-y-3">
            {dashboard.recentDonations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Gift className="h-12 w-12 text-gray-300 mb-3" />
                <p className="text-sm text-gray-500">No recent donations</p>
              </div>
            ) : (
              dashboard.recentDonations.map((item) => (
                <RecentItemCard
                  key={item.id}
                  item={item}
                  type="donation"
                  href="/admin/donations"
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* User Info Section */}
      <div className="rounded-2xl bg-gradient-to-br from-white to-gray-50 shadow-xl border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 p-2 shadow-lg">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Session Information
              </h3>
              <p className="text-sm text-gray-500">
                Current user details and permissions
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 p-5 transition-all duration-300 hover:shadow-lg hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-purple-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 p-2 shadow-lg">
                  <UserCheck className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-purple-600">
                    Name
                  </p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {session?.user?.name || "-"}
                  </p>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 p-5 transition-all duration-300 hover:shadow-lg hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-2 shadow-lg">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-blue-600">
                    Email
                  </p>
                  <p className="mt-1 text-lg font-semibold text-gray-900 break-all">
                    {session?.user?.email || "-"}
                  </p>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 p-5 transition-all duration-300 hover:shadow-lg hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-emerald-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-2 shadow-lg">
                  <Award className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-emerald-600">
                    Role
                  </p>
                  <p className="mt-1">
                    <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-semibold text-emerald-700">
                      <Sparkles className="h-4 w-4" />
                      {session?.user?.roleName || "Administrator"}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-4">
              <Globe className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Last Login</p>
                <p className="text-sm font-medium text-gray-700">
                  {new Date().toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-4">
              <MapPin className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">IP Address</p>
                <p className="text-sm font-medium text-gray-700">192.168.1.1</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add global styles for animations */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          
          @keyframes float-delay {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 0.5; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.1); }
          }
        `}
      </style>
    </div>
  );
}
