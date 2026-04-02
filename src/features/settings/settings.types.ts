export type AdminRoleRow = {
  RoleId: number;
  RoleName: string;
  RoleCode: string;
  Description: string | null;
  IsActive: boolean;
  CreatedAt: Date;
  UpdatedAt: Date;
};

export type AdminUserRow = {
  AdminUserId: number;
  FullName: string;
  Email: string;
  IsActive: boolean;
  LastLoginAt: Date | null;
  CreatedAt: Date;
  UpdatedAt: Date;
  RoleId: number | null;
  RoleName: string | null;
  RoleCode: string | null;
};

export type SiteSettingsRow = {
  SettingId: number;
  OrganizationName: string;
  Email: string | null;
  Phone: string | null;
  Address: string | null;
  WebsiteUrl: string | null;
  LogoUrl: string | null;
  FooterText: string | null;
  PrimaryColor: string | null;
  CreatedAt: Date;
  UpdatedAt: Date;
};

export type AdminRole = {
  roleId: number;
  roleName: string;
  roleCode: string;
  description: string;
};

export type AdminUserSetting = {
  adminUserId: number;
  fullName: string;
  email: string;
  isActive: boolean;
  lastLoginAt: string;
  roleId: number | null;
  roleName: string;
  roleCode: string;
};

export type SiteSetting = {
  settingId: number;
  organizationName: string;
  email: string;
  phone: string;
  address: string;
  websiteUrl: string;
  logoUrl: string;
  footerText: string;
  primaryColor: string;
};