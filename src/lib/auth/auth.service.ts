import bcrypt from "bcryptjs";
import { getAdminUserByEmail, updateAdminLastLogin } from "@/lib/auth/auth.repo";
import type { AdminUser } from "@/types/auth";

export async function authenticateAdmin(
  email: string,
  password: string
): Promise<AdminUser | null> {
  const user = await getAdminUserByEmail(email);

  if (!user) return null;
  if (!user.IsActive) return null;

  const isPasswordValid = await bcrypt.compare(password, user.PasswordHash);
  if (!isPasswordValid) return null;

  await updateAdminLastLogin(user.AdminUserId);

  return {
    id: user.AdminUserId,
    fullName: user.FullName,
    email: user.Email,
    roleName: user.RoleName,
    roleCode: user.RoleCode ?? "",
    isActive: user.IsActive,
  };
}