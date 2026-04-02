import { executeProcedure, executeProcedureNoResult, sql } from "@/lib/db/execute";
import type { ContactDbRow } from "./contacts.types";
import type {
  ContactAdminUpdateInput,
  PublicContactInput,
} from "./contacts.schema";

export async function getAllContactRows() {
  return executeProcedure<ContactDbRow>("sp_Contact_GetAll");
}

export async function getContactRowById(contactId: number) {
  const rows = await executeProcedure<ContactDbRow>("sp_Contact_GetById", [
    { name: "ContactId", type: sql.Int, value: contactId },
  ]);

  return rows[0] ?? null;
}

export async function createContactRow(data: PublicContactInput) {
  const rows = await executeProcedure<{ ContactId: number }>("sp_Contact_Create", [
    { name: "FullName", type: sql.NVarChar(150), value: data.fullName },
    { name: "Email", type: sql.NVarChar(255), value: data.email },
    {
      name: "Phone",
      type: sql.NVarChar(50),
      value: data.phone || null,
    },
    {
      name: "Subject",
      type: sql.NVarChar(200),
      value: data.subject || null,
    },
    {
      name: "Message",
      type: sql.NVarChar(sql.MAX),
      value: data.message,
    },
  ]);

  return rows[0]?.ContactId ?? null;
}

export async function updateContactStatusAndNoteRow(
  contactId: number,
  data: ContactAdminUpdateInput
) {
  await executeProcedureNoResult("sp_Contact_UpdateStatusAndNote", [
    { name: "ContactId", type: sql.Int, value: contactId },
    { name: "Status", type: sql.NVarChar(30), value: data.status },
    {
      name: "AdminNote",
      type: sql.NVarChar(sql.MAX),
      value: data.adminNote || null,
    },
  ]);
}