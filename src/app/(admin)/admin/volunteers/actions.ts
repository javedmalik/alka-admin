"use server";

import { ZodError } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  volunteerAdminUpdateSchema,
  type VolunteerAdminUpdateInput,
} from "@/features/volunteers/volunteers.schema";
import { updateVolunteerStatusAndNote } from "@/features/volunteers/volunteers.service";

function buildAdminUpdateInput(formData: FormData): VolunteerAdminUpdateInput {
  return {
    status: String(formData.get("status") || "New") as VolunteerAdminUpdateInput["status"],
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

export async function updateVolunteerAction(
  volunteerId: number,
  formData: FormData
): Promise<void> {
  try {
    const rawInput = buildAdminUpdateInput(formData);
    const input = volunteerAdminUpdateSchema.parse(rawInput);

    await updateVolunteerStatusAndNote(volunteerId, input);
  } catch (error) {
    const message = getErrorMessage(error);
    redirect(`/admin/volunteers/${volunteerId}?error=${encodeURIComponent(message)}`);
  }

  revalidatePath("/admin/volunteers");
  revalidatePath(`/admin/volunteers/${volunteerId}`);
  redirect("/admin/volunteers?success=updated");
}