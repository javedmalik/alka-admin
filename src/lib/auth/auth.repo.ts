import { executeProcedure, executeProcedureNoResult, sql } from "@/lib/db/execute";
import type { AdminUserDbRow } from "@/types/auth";

export async function getAdminUserByEmail(email: string) {
  const rows = await executeProcedure<AdminUserDbRow>("sp_AdminUser_GetByEmail", [
    {
      name: "Email",
      type: sql.NVarChar(255),
      value: email,
    },
  ]);

  return rows[0] ?? null;
}

export async function updateAdminLastLogin(adminUserId: number) {
  await executeProcedureNoResult("sp_AdminUser_UpdateLastLogin", [
    {
      name: "AdminUserId",
      type: sql.Int,
      value: adminUserId,
    },
  ]);
}