import { executeProcedure, executeProcedureNoResult, sql } from "@/lib/db/execute";
import type { AdminRoleRow, AdminUserRow, SiteSettingsRow } from "./settings.types";

export async function getSiteSettingsRow() {
  const rows = await executeProcedure<SiteSettingsRow>("dbo.sp_SiteSettings_Get");
  return rows[0] ?? null;
}

export async function updateSiteSettingsRow(data: {
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
  await executeProcedureNoResult("dbo.sp_SiteSettings_Update", [
    { name: "SettingId", type: sql.Int, value: data.settingId },
    { name: "OrganizationName", type: sql.NVarChar(200), value: data.organizationName },
    { name: "Email", type: sql.NVarChar(255), value: data.email || null },
    { name: "Phone", type: sql.NVarChar(50), value: data.phone || null },
    { name: "Address", type: sql.NVarChar(500), value: data.address || null },
    { name: "WebsiteUrl", type: sql.NVarChar(255), value: data.websiteUrl || null },
    { name: "LogoUrl", type: sql.NVarChar(500), value: data.logoUrl || null },
    { name: "FooterText", type: sql.NVarChar(300), value: data.footerText || null },
    { name: "PrimaryColor", type: sql.NVarChar(20), value: data.primaryColor || null },
  ]);
}

export async function getAdminRolesRows() {
  return executeProcedure<AdminRoleRow>("dbo.sp_AdminRole_GetAll");
}

export async function getAdminUsersRows() {
  return executeProcedure<AdminUserRow>("dbo.sp_AdminUser_GetAll");
}

export async function createAdminUserRow(data: {
  fullName: string;
  email: string;
  passwordHash: string;
  roleId: number;
  isActive: boolean;
}) {
  const rows = await executeProcedure<{ AdminUserId: number }>("dbo.sp_AdminUser_Create", [
    { name: "FullName", type: sql.NVarChar(150), value: data.fullName },
    { name: "Email", type: sql.NVarChar(255), value: data.email },
    { name: "PasswordHash", type: sql.NVarChar(255), value: data.passwordHash },
    { name: "RoleId", type: sql.Int, value: data.roleId },
    { name: "IsActive", type: sql.Bit, value: data.isActive },
  ]);

  return rows[0]?.AdminUserId ?? null;
}

export async function updateAdminUserRoleStatusRow(data: {
  adminUserId: number;
  roleId: number;
  isActive: boolean;
}) {
  await executeProcedureNoResult("dbo.sp_AdminUser_UpdateRoleStatus", [
    { name: "AdminUserId", type: sql.Int, value: data.adminUserId },
    { name: "RoleId", type: sql.Int, value: data.roleId },
    { name: "IsActive", type: sql.Bit, value: data.isActive },
  ]);
}