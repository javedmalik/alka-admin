import { NextResponse } from "next/server";
import { getRazorpayPaymentById } from "@/lib/payments/razorpay";

type RouteProps = {
  params: Promise<{
    paymentId: string;
  }>;
};

export async function GET(_: Request, { params }: RouteProps) {
  try {
    const { paymentId } = await params;
    const data = await getRazorpayPaymentById(paymentId);

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Razorpay payment fetch by id error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to fetch Razorpay payment",
      },
      { status: 500 }
    );
  }
}