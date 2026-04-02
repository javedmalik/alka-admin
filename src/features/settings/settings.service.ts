import bcrypt from "bcryptjs";
import {
  createAdminUserSchema,
  siteSettingsSchema,
  updateAdminUserSchema,
} from "./settings.schema";
import {
  createAdminUserRow,
  getAdminRolesRows,
  getAdminUsersRows,
  getSiteSettingsRow,
  updateAdminUserRoleStatusRow,
  updateSiteSettingsRow,
} from "./settings.repo";

export async function getSettingsPageData() {
  const [siteRow, rolesRows, usersRows] = await Promise.all([
    getSiteSettingsRow(),
    getAdminRolesRows(),
    getAdminUsersRows(),
  ]);

  return {
    siteSettings: {
      settingId: siteRow?.SettingId ?? 1,
      organizationName: siteRow?.OrganizationName ?? "",
      email: siteRow?.Email ?? "",
      phone: siteRow?.Phone ?? "",
      address: siteRow?.Address ?? "",
      websiteUrl: siteRow?.WebsiteUrl ?? "",
      logoUrl: siteRow?.LogoUrl ?? "",
      footerText: siteRow?.FooterText ?? "",
      primaryColor: siteRow?.PrimaryColor ?? "",
    },
    roles: rolesRows.map((role) => ({
      roleId: role.RoleId,
      roleName: role.RoleName,
      roleCode: role.RoleCode,
      description: role.Description ?? "",
    })),
    users: usersRows.map((user) => ({
      adminUserId: user.AdminUserId,
      fullName: user.FullName,
      email: user.Email,
      isActive: user.IsActive,
      lastLoginAt: user.LastLoginAt
        ? new Date(user.LastLoginAt).toISOString()
        : "",
      roleId: user.RoleId ?? null,
      roleName: user.RoleName ?? "",
      roleCode: user.RoleCode ?? "",
    })),
  };
}

export async function updateSiteSettings(input: {
  settingId: number;
  organizationName: string;
  email: string;
  phone: string;
  address: string;
  websiteUrl: string;
  logoUrl: string;
  footerText: string;
  primaryColor: string;
}) {
  const parsed = siteSettingsSchema.parse(input);
  return updateSiteSettingsRow(parsed);
}

export async function createAdminUser(input: {
  fullName: string;
  email: string;
  password: string;
  roleId: number;
  isActive: boolean;
}) {
  const parsed = createAdminUserSchema.parse(input);
  const passwordHash = await bcrypt.hash(parsed.password, 10);

  return createAdminUserRow({
    fullName: parsed.fullName,
    email: parsed.email,
    passwordHash,
    roleId: parsed.roleId,
    isActive: parsed.isActive,
  });
}

export async function updateAdminUserRoleStatus(input: {
  adminUserId: number;
  roleId: number;
  isActive: boolean;
}) {
  const parsed = updateAdminUserSchema.parse(input);
  return updateAdminUserRoleStatusRow(parsed);
}