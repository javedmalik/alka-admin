import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { createContact } from "@/features/contacts/contacts.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const contactId = await createContact({
      fullName: String(body.fullName || ""),
      email: String(body.email || ""),
      phone: String(body.phone || ""),
      subject: String(body.subject || ""),
      message: String(body.message || ""),
    });

    return NextResponse.json({
      success: true,
      message: "Contact submitted successfully",
      contactId,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: error.issues[0]?.message || "Invalid form data",
        },
        { status: 400 }
      );
    }

    console.error("Contact create error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to submit contact form",
      },
      { status: 500 }
    );
  }
}