export type DashboardSummaryRow = {
  totalCampaigns: number;
  totalContacts: number;
  totalVolunteers: number;
  totalDonations: number;
  totalDonationAmount: number;
};

export type RecentContactRow = {
  ContactId: number;
  FullName: string;
  Email: string;
  Status: string;
  CreatedAt: Date | null;
};

export type RecentVolunteerRow = {
  VolunteerId: number;
  FullName: string;
  Email: string;
  Status: string;
  CreatedAt: Date | null;
};

export type RecentDonationRow = {
  donationId: number;
  donorName: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: Date | null;
};

export type DashboardSummary = {
  totalCampaigns: number;
  totalContacts: number;
  totalVolunteers: number;
  totalDonations: number;
  totalDonationAmount: number;
};

export type RecentContact = {
  id: number;
  fullName: string;
  email: string;
  status: string;
  createdAt: string;
};

export type RecentVolunteer = {
  id: number;
  fullName: string;
  email: string;
  status: string;
  createdAt: string;
};

export type RecentDonation = {
  id: number;
  donorName: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
};

export type DashboardData = {
  summary: DashboardSummary;
  recentContacts: RecentContact[];
  recentVolunteers: RecentVolunteer[];
  recentDonations: RecentDonation[];
};