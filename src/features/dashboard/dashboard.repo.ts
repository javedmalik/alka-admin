import { executeProcedure } from "@/lib/db/execute";
import type {
  DashboardSummaryRow,
  RecentContactRow,
  RecentDonationRow,
  RecentVolunteerRow,
} from "./dashboard.types";

export async function getDashboardSummaryRow() {
  const rows = await executeProcedure<DashboardSummaryRow>(
    "dbo.sp_Dashboard_GetSummary"
  );

  return rows[0] ?? null;
}

export async function getRecentContactRows() {
  return executeProcedure<RecentContactRow>(
    "dbo.sp_Dashboard_GetRecentContacts"
  );
}

export async function getRecentVolunteerRows() {
  return executeProcedure<RecentVolunteerRow>(
    "dbo.sp_Dashboard_GetRecentVolunteers"
  );
}

export async function getRecentDonationRows() {
  return executeProcedure<RecentDonationRow>(
    "dbo.sp_Dashboard_GetRecentDonations"
  );
}