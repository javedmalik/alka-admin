import { executeProcedure, executeProcedureNoResult, sql } from "@/lib/db/execute";
import type { VolunteerDbRow } from "./volunteers.types";
import type {
  PublicVolunteerInput,
  VolunteerAdminUpdateInput,
} from "./volunteers.schema";

export async function getAllVolunteerRows() {
  return executeProcedure<VolunteerDbRow>("sp_Volunteer_GetAll");
}

export async function getVolunteerRowById(volunteerId: number) {
  const rows = await executeProcedure<VolunteerDbRow>("sp_Volunteer_GetById", [
    { name: "VolunteerId", type: sql.Int, value: volunteerId },
  ]);

  return rows[0] ?? null;
}

export async function createVolunteerRow(data: PublicVolunteerInput) {
  const rows = await executeProcedure<{ VolunteerId: number }>(
    "sp_Volunteer_Create",
    [
      { name: "FullName", type: sql.NVarChar(150), value: data.fullName },
      { name: "Email", type: sql.NVarChar(255), value: data.email },
      { name: "Phone", type: sql.NVarChar(50), value: data.phone || null },
      { name: "City", type: sql.NVarChar(100), value: data.city || null },
      { name: "Interests", type: sql.NVarChar(300), value: data.interests || null },
      {
        name: "Availability",
        type: sql.NVarChar(100),
        value: data.availability || null,
      },
      {
        name: "Message",
        type: sql.NVarChar(sql.MAX),
        value: data.message || null,
      },
    ]
  );

  return rows[0]?.VolunteerId ?? null;
}

export async function updateVolunteerStatusAndNoteRow(
  volunteerId: number,
  data: VolunteerAdminUpdateInput
) {
  await executeProcedureNoResult("sp_VolunteerUpdateStatusAndNote", [
    { name: "VolunteerId", type: sql.Int, value: volunteerId },
    { name: "Status", type: sql.NVarChar(30), value: data.status },
    {
      name: "AdminNote",
      type: sql.NVarChar(sql.MAX),
      value: data.adminNote || null,
    },
  ]);
}