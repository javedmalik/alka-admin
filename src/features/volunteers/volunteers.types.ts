export type VolunteerStatus = "New" | "Screening" | "Approved" | "Rejected" | "Closed";

export type VolunteerDbRow = {
  VolunteerId: number;
  FullName: string;
  Email: string;
  Phone: string | null;
  City: string | null;
  Interests: string | null;
  Availability: string | null;
  Message: string | null;
  Status: VolunteerStatus;
  AdminNote: string | null;
  CreatedAt: Date;
  UpdatedAt: Date;
};

export type Volunteer = {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  interests: string;
  availability: string;
  message: string;
  status: VolunteerStatus;
  adminNote: string;
  createdAt: string;
  updatedAt: string;
};