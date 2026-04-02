import {
  publicVolunteerSchema,
  volunteerAdminUpdateSchema,
} from "./volunteers.schema";
import type {
  PublicVolunteerInput,
  VolunteerAdminUpdateInput,
} from "./volunteers.schema";
import type { Volunteer, VolunteerDbRow } from "./volunteers.types";
import {
  createVolunteerRow,
  getAllVolunteerRows,
  getVolunteerRowById,
  updateVolunteerStatusAndNoteRow,
} from "./volunteers.repo";

function toIsoString(value: Date): string {
  return new Date(value).toISOString();
}

function mapVolunteer(row: VolunteerDbRow): Volunteer {
  return {
    id: row.VolunteerId,
    fullName: row.FullName,
    email: row.Email,
    phone: row.Phone ?? "",
    city: row.City ?? "",
    interests: row.Interests ?? "",
    availability: row.Availability ?? "",
    message: row.Message ?? "",
    status: row.Status,
    adminNote: row.AdminNote ?? "",
    createdAt: toIsoString(row.CreatedAt),
    updatedAt: toIsoString(row.UpdatedAt),
  };
}

export async function getAllVolunteers() {
  const rows = await getAllVolunteerRows();
  return rows.map(mapVolunteer);
}

export async function getVolunteerById(volunteerId: number) {
  const row = await getVolunteerRowById(volunteerId);
  return row ? mapVolunteer(row) : null;
}

export async function createVolunteer(input: PublicVolunteerInput) {
  const parsed = publicVolunteerSchema.parse(input);
  return createVolunteerRow(parsed);
}

export async function updateVolunteerStatusAndNote(
  volunteerId: number,
  input: VolunteerAdminUpdateInput
) {
  const parsed = volunteerAdminUpdateSchema.parse(input);
  return updateVolunteerStatusAndNoteRow(volunteerId, parsed);
}