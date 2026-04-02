"use server";

import { ZodError } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  contactAdminUpdateSchema,
  type ContactAdminUpdateInput,
} from "@/features/contacts/contacts.schema";
import { updateContactStatusAndNote } from "@/features/contacts/contacts.service";

function buildAdminUpdateInput(formData: FormData): ContactAdminUpdateInput {
  return {
    status: String(formData.get("status") || "New") as ContactAdminUpdateInput["status"],
    adminNote: String(formData.get("adminNote") || ""),
  };
}

function getErrorMessage(error: unknown): string {
  if (error instanceof ZodError) {
    return error.issues[0]?.message || "Invalid form data";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
}

export async function updateContactAction(
  contactId: number,
  formData: FormData
): Promise<void> {
  try {
    const rawInput = buildAdminUpdateInput(formData);
    const input = contactAdminUpdateSchema.parse(rawInput);

    await updateContactStatusAndNote(contactId, input);
  } catch (error) {
    const message = getErrorMessage(error);
    redirect(`/admin/contacts/${contactId}?error=${encodeURIComponent(message)}`);
  }

  revalidatePath("/admin/contacts");
  revalidatePath(`/admin/contacts/${contactId}`);
  redirect("/admin/contacts?success=updated");
}