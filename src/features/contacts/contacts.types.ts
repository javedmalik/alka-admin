export type ContactStatus = "New" | "InProgress" | "Resolved" | "Closed";

export type ContactDbRow = {
  ContactId: number;
  FullName: string;
  Email: string;
  Phone: string | null;
  Subject: string | null;
  Message: string;
  Status: ContactStatus;
  AdminNote: string | null;
  CreatedAt: Date;
  UpdatedAt: Date;
};

export type Contact = {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: ContactStatus;
  adminNote: string;
  createdAt: string;
  updatedAt: string;
};