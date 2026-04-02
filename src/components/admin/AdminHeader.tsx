import { auth } from "@/auth";
import LogoutButton from "./LogoutButton";
import {
  LayoutDashboard,
  User,
  Mail,
  Shield,
  ChevronDown,
  Settings,
  Bell,
  HelpCircle,
} from "lucide-react";
import Image from "next/image";

interface SessionUser {
  name?: string | null;
  email?: string | null;
  roleName?: string | null;
  image?: string | null;
}

interface Session {
  user?: SessionUser;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0] ?? "")
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getRoleColor(roleName?: string | null): string {
  switch (roleName?.toLowerCase()) {
    case "super admin":
      return "bg-purple-100 text-purple-700";
    case "admin":
      return "bg-blue-100 text-blue-700";
    case "editor":
      return "bg-green-100 text-green-700";
    case "viewer":
      return "bg-gray-100 text-gray-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

function getRoleIcon(roleName?: string | null) {
  switch (roleName?.toLowerCase()) {
    case "super admin":
      return <Shield className="h-3 w-3" />;
    case "admin":
      return <LayoutDashboard className="h-3 w-3" />;
    case "editor":
      return <User className="h-3 w-3" />;
    default:
      return <User className="h-3 w-3" />;
  }
}

export default async function AdminHeader() {
  const session = (await auth()) as Session | null;
  const userName = session?.user?.name || "Admin";
  const userEmail = session?.user?.email || "-";
  const userRole = session?.user?.roleName || "-";
  const userImage = session?.user?.image || null;

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-white/95 backdrop-blur">
      <div className="flex min-h-[72px] items-center justify-between gap-3 px-4 py-3 sm:px-6">
        {/* Left */}
        <div className="flex min-w-0 items-center gap-3">
          <div className="hidden h-10 w-10 items-center justify-center rounded-2xl bg-[var(--primary)] text-white shadow-sm sm:flex">
            <LayoutDashboard className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <h1 className="truncate text-base font-semibold text-slate-900 sm:text-lg">
              ALKA Admin
            </h1>
            <p className="hidden text-xs text-slate-500 sm:block">
              Dashboard Management
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-shrink-0 items-center gap-1 sm:gap-2 md:gap-3">
          {/* Notification */}
          <button
            type="button"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
            </span>
          </button>

          {/* Help */}
          <button
            type="button"
            className="hidden h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 sm:inline-flex"
            aria-label="Help"
          >
            <HelpCircle className="h-5 w-5" />
          </button>

          {/* Profile */}
          <details className="group relative">
            <summary className="flex list-none cursor-pointer items-center gap-2 rounded-xl p-1.5 transition hover:bg-slate-100 sm:gap-3 sm:p-2">
              {/* Avatar */}
              <div className="relative shrink-0">
                {userImage ? (
                  <Image
                    src={userImage}
                    alt={userName}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-slate-200"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary)] text-white shadow-sm">
                    <span className="text-sm font-semibold">
                      {getInitials(userName)}
                    </span>
                  </div>
                )}

                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
              </div>

              {/* User text */}
              <div className="hidden min-w-0 text-left lg:block">
                <p className="truncate text-sm font-semibold text-slate-900">
                  {userName}
                </p>
                <div className="flex items-center gap-1 text-slate-500">
                  <Mail className="h-3 w-3 shrink-0" />
                  <p className="max-w-[180px] truncate text-xs">{userEmail}</p>
                </div>
              </div>

              {/* Role */}
              {/* <div className="hidden xl:block">
                <div
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${getRoleColor(
                    userRole
                  )}`}
                >
                  {getRoleIcon(userRole)}
                  <span className="truncate">{userRole}</span>
                </div>
              </div> */}

              <ChevronDown className="hidden h-4 w-4 text-slate-400 transition group-open:rotate-180 sm:block" />
            </summary>

            {/* Dropdown */}
            <div className="absolute right-0 top-full z-50 mt-2 w-[260px] rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
              <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-3">
                <div className="flex items-center gap-3">
                  {userImage ? (
                    <Image
                      src={userImage}
                      alt={userName}
                      width={36}
                      height={36}
                      className="h-9 w-9 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--primary)] text-white">
                      <span className="text-xs font-semibold">
                        {getInitials(userName)}
                      </span>
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {userName}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {userEmail}
                    </p>
                  </div>
                </div>

                <div className="mt-3">
                  <div
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${getRoleColor(
                      userRole
                    )}`}
                  >
                    {getRoleIcon(userRole)}
                    <span>{userRole}</span>
                  </div>
                </div>
              </div>

              <div className="mt-2 space-y-1">
                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-slate-700 transition hover:bg-slate-100"
                >
                  <User className="h-4 w-4" />
                  Profile Settings
                </button>

                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-slate-700 transition hover:bg-slate-100"
                >
                  <Settings className="h-4 w-4" />
                  Account Settings
                </button>
              </div>

              <div className="my-2 border-t border-slate-100" />

              <LogoutButton variant="menu-item" />
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}