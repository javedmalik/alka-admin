import {
  getDashboardSummaryRow,
  getRecentContactRows,
  getRecentDonationRows,
  getRecentVolunteerRows,
} from "./dashboard.repo";
import type {
  DashboardData,
  RecentContact,
  RecentDonation,
  RecentVolunteer,
} from "./dashboard.types";

function toIsoString(value: Date | null) {
  return value ? new Date(value).toISOString() : "";
}

function mapRecentContact(row: {
  ContactId: number;
  FullName: string;
  Email: string;
  Status: string;
  CreatedAt: Date | null;
}): RecentContact {
  return {
    id: row.ContactId,
    fullName: row.FullName,
    email: row.Email,
    status: row.Status,
    createdAt: toIsoString(row.CreatedAt),
  };
}

function mapRecentVolunteer(row: {
  VolunteerId: number;
  FullName: string;
  Email: string;
  Status: string;
  CreatedAt: Date | null;
}): RecentVolunteer {
  return {
    id: row.VolunteerId,
    fullName: row.FullName,
    email: row.Email,
    status: row.Status,
    createdAt: toIsoString(row.CreatedAt),
  };
}

function mapRecentDonation(row: {
  donationId: number;
  donorName: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: Date | null;
}): RecentDonation {
  return {
    id: row.donationId,
    donorName: row.donorName,
    amount: row.amount,
    currency: row.currency,
    status: row.status,
    createdAt: toIsoString(row.createdAt),
  };
}

export async function getDashboardData(): Promise<DashboardData> {
  const [summaryRow, recentContactRows, recentVolunteerRows, recentDonationRows] =
    await Promise.all([
      getDashboardSummaryRow(),
      getRecentContactRows(),
      getRecentVolunteerRows(),
      getRecentDonationRows(),
    ]);

  return {
    summary: {
      totalCampaigns: summaryRow?.totalCampaigns ?? 0,
      totalContacts: summaryRow?.totalContacts ?? 0,
      totalVolunteers: summaryRow?.totalVolunteers ?? 0,
      totalDonations: summaryRow?.totalDonations ?? 0,
      totalDonationAmount: summaryRow?.totalDonationAmount ?? 0,
    },
    recentContacts: recentContactRows.map(mapRecentContact),
    recentVolunteers: recentVolunteerRows.map(mapRecentVolunteer),
    recentDonations: recentDonationRows.map(mapRecentDonation),
  };
}