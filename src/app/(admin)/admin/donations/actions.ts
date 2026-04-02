"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  getRazorpayPaymentById,
  getRazorpayPaymentsByDateRange,
} from "@/lib/payments/razorpay";
import {
  syncRazorpayPaymentToLocal,
  syncRazorpayPaymentsBatchToLocal,
} from "@/features/donations/donations.service";

function toUnixSeconds(dateValue: string, endOfDay = false) {
  if (!dateValue) return null;

  const isoValue = endOfDay
    ? `${dateValue}T23:59:59`
    : `${dateValue}T00:00:00`;

  const timestamp = Math.floor(new Date(isoValue).getTime() / 1000);
  return Number.isFinite(timestamp) ? timestamp : null;
}

export async function syncDonationFromRazorpayAction(
  formData: FormData
): Promise<void> {
  const paymentId = String(formData.get("paymentId") || "").trim();

  if (!paymentId) {
    redirect("/admin/donations?error=Payment%20ID%20is%20required");
  }

  try {
    const payment = await getRazorpayPaymentById(paymentId);
    await syncRazorpayPaymentToLocal(payment);
  } catch (error) {
    console.error("Donation sync error:", error);
    redirect("/admin/donations?error=Unable%20to%20sync%20donation");
  }

  revalidatePath("/admin/donations");
  redirect("/admin/donations?success=synced");
}

export async function syncDonationsByDateRangeAction(
  formData: FormData
): Promise<void> {
  const fromDate = String(formData.get("fromDate") || "").trim();
  const toDate = String(formData.get("toDate") || "").trim();
  const countValue = String(formData.get("count") || "50").trim();

  const from = toUnixSeconds(fromDate, false);
  const to = toUnixSeconds(toDate, true);
  const count = Number(countValue);

  if (!from || !to) {
    redirect("/admin/donations?error=Please%20select%20valid%20from%20and%20to%20dates");
  }

  if (from > to) {
    redirect("/admin/donations?error=From%20date%20must%20be%20before%20to%20date");
  }

  if (!Number.isFinite(count) || count < 1 || count > 100) {
    redirect("/admin/donations?error=Count%20must%20be%20between%201%20and%20100");
  }

  try {
    const result = await getRazorpayPaymentsByDateRange(from, to, {
      count,
      skip: 0,
    });

    const syncResult = await syncRazorpayPaymentsBatchToLocal(result.items);

    revalidatePath("/admin/donations");
    redirect(
      `/admin/donations?success=synced-${encodeURIComponent(
        String(syncResult.syncedCount)
      )}`
    );
  } catch (error) {
    console.error("Donation date range sync error:", error);
    redirect("/admin/donations?error=Unable%20to%20sync%20donations%20for%20selected%20date%20range");
  }
}