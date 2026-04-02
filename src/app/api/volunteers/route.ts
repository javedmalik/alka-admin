import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { createVolunteer } from "@/features/volunteers/volunteers.service";

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Volunteers API is working",
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const volunteerId = await createVolunteer({
      fullName: String(body.fullName || ""),
      email: String(body.email || ""),
      phone: String(body.phone || ""),
      city: String(body.city || ""),
      interests: String(body.interests || ""),
      availability: String(body.availability || ""),
      message: String(body.message || ""),
    });

    return NextResponse.json({
      success: true,
      message: "Volunteer application submitted successfully",
      volunteerId,
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

    console.error("Volunteer create error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to submit volunteer form",
      },
      { status: 500 }
    );
  }
}