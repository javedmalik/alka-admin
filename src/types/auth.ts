export type AdminUser = {
  id: number;
  fullName: string;
  email: string;
  roleName: string;
  roleCode: string;
  isActive: boolean;
};

export type AdminUserDbRow = {
  AdminUserId: number;
  FullName: string;
  Email: string;
  PasswordHash: string;
  RoleName: string;
  RoleCode: string;
  IsActive: boolean;
  LastLoginAt: Date | null;
  CreatedAt: Date;
  UpdatedAt: Date;
};