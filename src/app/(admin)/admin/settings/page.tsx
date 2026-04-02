import { auth } from "@/auth";
import { redirect } from "next/navigation";
import {
  createAdminUserAction,
  updateAdminUserAction,
  updateSiteSettingsAction,
} from "./actions";
import { getSettingsPageData } from "@/features/settings/settings.service";
import { 
  Settings, 
  UserPlus, 
  Users, 
  Shield, 
  Save, 
  CheckCircle,
  AlertCircle,
  Mail,
  Phone,
  MapPin,
  Globe,
  Image,
  Palette,
  FileText,
  Building2,
  Key,
  UserCheck,
  Clock,
  Edit,
  type LucideIcon
} from "lucide-react";

type SettingsPageProps = {
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

function getStatusBadge(isActive: boolean): StatusConfig {
  return isActive 
    ? { bg: "bg-emerald-50", text: "text-emerald-700", icon: CheckCircle }
    : { bg: "bg-slate-100", text: "text-slate-600", icon: AlertCircle };
}

function successMessage(value?: string): string {
  if (value === "site-updated") return "Site settings updated successfully.";
  if (value === "user-created") return "Admin user created successfully.";
  if (value === "user-updated") return "Admin user updated successfully.";
  return "";
}

export default async function SettingsPage({
  searchParams,
}: SettingsPageProps) {
  const session = await auth();

  if (session?.user?.roleCode !== "SUPER_ADMIN") {
    redirect("/admin/profile");
  }

  const params = (await searchParams) ?? {};
  const data = await getSettingsPageData();

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

        <div className="relative z-10 flex items-center gap-3">
          <div className="rounded-xl bg-white/20 p-2 backdrop-blur-sm">
            <Settings className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Settings</h1>
            <p className="mt-0.5 text-xs text-blue-100">
              Manage organization settings, users, and roles
            </p>
          </div>
        </div>
      </div>

      {/* Alert Messages */}
      {params.success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span>{successMessage(params.success)}</span>
          </div>
        </div>
      )}

      {params.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>{params.error}</span>
          </div>
        </div>
      )}

        {/* Admin Users Table */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-xl overflow-hidden">
        <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-6 py-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Admin Users</h3>
          </div>
          <p className="mt-1 text-sm text-gray-500">Manage existing administrators</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Role</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Last Login</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Actions</th>
               </tr>
            </thead>
            <tbody>
              {data.users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Users className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-gray-500 font-medium">No admin users found</p>
                      <p className="text-sm text-gray-400">Create your first admin user using the form</p>
                    </div>
                  </td>
                </tr>
              ) : (
                data.users.map((user) => {
                  const { bg, text, icon: StatusIcon } = getStatusBadge(user.isActive);
                  return (
                    <tr key={user.adminUserId} className="border-b border-gray-100 hover:bg-blue-50/30 transition-all">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-blue-200">
                            <UserCheck className="h-4 w-4 text-blue-600" />
                          </div>
                          <span className="font-medium text-gray-900">{user.fullName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{user.email}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                          {user.roleName || "No Role"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${bg} ${text}`}>
                          <StatusIcon className="h-3 w-3" />
                          <span>{user.isActive ? "Active" : "Inactive"}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 text-sm text-gray-500">
                          <Clock className="h-3.5 w-3.5 text-gray-400" />
                          <span className="text-xs">
                            {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : "Never"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <form action={updateAdminUserAction} className="flex items-center gap-2">
                          <input type="hidden" name="adminUserId" value={user.adminUserId} />
                          <select
                            name="roleId"
                            defaultValue={user.roleId ?? ""}
                            className="rounded-lg border border-gray-200 px-2 py-1.5 text-xs focus:border-blue-500 focus:outline-none"
                          >
                            <option value="">Select role</option>
                            {data.roles.map((role) => (
                              <option key={role.roleId} value={role.roleId}>
                                {role.roleName}
                              </option>
                            ))}
                          </select>
                          <label className="flex cursor-pointer items-center gap-1.5 text-xs">
                            <input
                              type="checkbox"
                              name="isActive"
                              defaultChecked={user.isActive}
                              className="h-3.5 w-3.5 rounded border-gray-300"
                            />
                            Active
                          </label>
                          <button
                            type="submit"
                            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-600 transition-all hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                          >
                            <Edit className="h-3 w-3" />
                            Save
                          </button>
                        </form>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Roles Section */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-xl overflow-hidden">
        <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-6 py-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Available Roles</h3>
          </div>
          <p className="mt-1 text-sm text-gray-500">System roles and their permissions</p>
        </div>

        <div className="p-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data.roles.map((role) => (
              <div
                key={role.roleId}
                className="group rounded-xl border border-gray-100 bg-gradient-to-br from-gray-50 to-white p-4 transition-all hover:shadow-md hover:border-blue-200"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-blue-500" />
                  <p className="font-semibold text-gray-900">{role.roleName}</p>
                </div>
                <p className="text-xs text-gray-500 font-mono">{role.roleCode}</p>
                <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                  {role.description || "No description available"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alert Messages */}
      {params.success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span>{successMessage(params.success)}</span>
          </div>
        </div>
      )}

      {params.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>{params.error}</span>
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        {/* General Settings Card */}
        <div className="rounded-2xl border border-gray-100 bg-white shadow-xl overflow-hidden">
          <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-6 py-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">General Settings</h3>
            </div>
            <p className="mt-1 text-sm text-gray-500">Configure your organization details</p>
          </div>

          <form action={updateSiteSettingsAction} className="p-6 space-y-4">
            <input type="hidden" name="settingId" value={data.siteSettings.settingId} />

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-600">Organization Name</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    name="organizationName"
                    defaultValue={data.siteSettings.organizationName}
                    className="w-full rounded-lg border border-gray-200 pl-9 pr-3 py-2 text-sm text-gray-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-600">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    name="email"
                    defaultValue={data.siteSettings.email}
                    className="w-full rounded-lg border border-gray-200 pl-9 pr-3 py-2 text-sm text-gray-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-600">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    name="phone"
                    defaultValue={data.siteSettings.phone}
                    className="w-full rounded-lg border border-gray-200 pl-9 pr-3 py-2 text-sm text-gray-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-600">Website URL</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    name="websiteUrl"
                    defaultValue={data.siteSettings.websiteUrl}
                    className="w-full rounded-lg border border-gray-200 pl-9 pr-3 py-2 text-sm text-gray-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-600">Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <textarea
                  name="address"
                  defaultValue={data.siteSettings.address}
                  rows={2}
                  className="w-full rounded-lg border border-gray-200 pl-9 pr-3 py-2 text-sm text-gray-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-600">Logo URL</label>
                <div className="relative">
                  <Image className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    name="logoUrl"
                    defaultValue={data.siteSettings.logoUrl}
                    className="w-full rounded-lg border border-gray-200 pl-9 pr-3 py-2 text-sm text-gray-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-600">Primary Color</label>
                <div className="relative">
                  <Palette className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    name="primaryColor"
                    defaultValue={data.siteSettings.primaryColor}
                    className="w-full rounded-lg border border-gray-200 pl-9 pr-3 py-2 text-sm text-gray-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-600">Footer Text</label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  name="footerText"
                  defaultValue={data.siteSettings.footerText}
                  className="w-full rounded-lg border border-gray-200 pl-9 pr-3 py-2 text-sm text-gray-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 text-sm font-medium text-white transition-all hover:from-blue-700 hover:to-blue-800"
              >
                <Save className="h-4 w-4" />
                Save Settings
              </button>
            </div>
          </form>
        </div>

        {/* Create Admin User Card */}
        <div className="rounded-2xl border border-gray-100 bg-white shadow-xl overflow-hidden">
          <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-6 py-4">
            <div className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Create Admin User</h3>
            </div>
            <p className="mt-1 text-sm text-gray-500">Add new administrators to the system</p>
          </div>

          <form action={createAdminUserAction} className="p-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-600">Full Name</label>
              <input
                name="fullName"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-600">Email</label>
              <input
                name="email"
                type="email"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-600">Password</label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  name="password"
                  type="password"
                  className="w-full rounded-lg border border-gray-200 pl-9 pr-3 py-2 text-sm text-gray-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-600">Role</label>
              <select
                name="roleId"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
              >
                <option value="">Select a role</option>
                {data.roles.map((role) => (
                  <option key={role.roleId} value={role.roleId}>
                    {role.roleName}
                  </option>
                ))}
              </select>
            </div>

            <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" name="isActive" defaultChecked className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span>Active user</span>
            </label>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 text-sm font-medium text-white transition-all hover:from-blue-700 hover:to-blue-800"
              >
                <UserPlus className="h-4 w-4" />
                Create User
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
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-in {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}