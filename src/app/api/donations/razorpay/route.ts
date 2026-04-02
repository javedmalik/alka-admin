import { NextResponse } from "next/server";
import {
  getRazorpayPayments,
  getRazorpayPaymentsByDateRange,
} from "@/lib/payments/razorpay";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const from = url.searchParams.get("from");
    const to = url.searchParams.get("to");
    const count = url.searchParams.get("count");
    const skip = url.searchParams.get("skip");

    if (from && to) {
      const data = await getRazorpayPaymentsByDateRange(
        Number(from),
        Number(to),
        {
          count: count ? Number(count) : undefined,
          skip: skip ? Number(skip) : undefined,
        }
      );

      return NextResponse.json({ success: true, data });
    }

    const data = await getRazorpayPayments({
      count: count ? Number(count) : undefined,
      skip: skip ? Number(skip) : undefined,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Razorpay payments fetch error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to fetch Razorpay payments",
      },
      { status: 500 }
    );
  }
}