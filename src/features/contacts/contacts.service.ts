import { contactAdminUpdateSchema, publicContactSchema } from "./contacts.schema";
import type {
  ContactAdminUpdateInput,
  PublicContactInput,
} from "./contacts.schema";
import type { Contact, ContactDbRow } from "./contacts.types";
import {
  createContactRow,
  getAllContactRows,
  getContactRowById,
  updateContactStatusAndNoteRow,
} from "./contacts.repo";

function toIsoString(value: Date): string {
  return new Date(value).toISOString();
}

function mapContact(row: ContactDbRow): Contact {
  return {
    id: row.ContactId,
    fullName: row.FullName,
    email: row.Email,
    phone: row.Phone ?? "",
    subject: row.Subject ?? "",
    message: row.Message,
    status: row.Status,
    adminNote: row.AdminNote ?? "",
    createdAt: toIsoString(row.CreatedAt),
    updatedAt: toIsoString(row.UpdatedAt),
  };
}

export async function getAllContacts() {
  const rows = await getAllContactRows();
  return rows.map(mapContact);
}

export async function getContactById(contactId: number) {
  const row = await getContactRowById(contactId);
  return row ? mapContact(row) : null;
}

export async function createContact(input: PublicContactInput) {
  const parsed = publicContactSchema.parse(input);
  return createContactRow(parsed);
}

export async function updateContactStatusAndNote(
  contactId: number,
  input: ContactAdminUpdateInput
) {
  const parsed = contactAdminUpdateSchema.parse(input);
  return updateContactStatusAndNoteRow(contactId, parsed);
}