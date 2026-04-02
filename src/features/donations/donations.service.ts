import {
  createDonation,
  createDonor,
  getAllDonationRows,
  getDonationRowById,
  getDonationRowByPaymentId,
  getDonorRowByEmail,
  updateDonationByPaymentId,
} from "./donations.repo";
import type { DonationDetail, DonationListRow } from "./donations.types";
import type { RazorpayPayment } from "@/lib/payments/razorpay";

function toIsoString(value: Date | null) {
  return value ? new Date(value).toISOString() : "";
}

function mapRazorpayStatusToLocal(status: string): string {
  if (status === "captured") return "completed";
  if (status === "failed") return "failed";
  if (status === "refunded") return "refunded";
  return "pending";
}

function mapListRow(row: {
  donationId: number;
  donorId: number;
  donorName: string;
  donorEmail: string;
  donorPhone: string | null;
  amount: number;
  currency: string;
  paymentId: string;
  orderId: string;
  status: string;
  method: string | null;
  description: string | null;
  createdAt: Date | null;
}): DonationListRow {
  return {
    donationId: row.donationId,
    donorId: row.donorId,
    donorName: row.donorName,
    donorEmail: row.donorEmail,
    donorPhone: row.donorPhone ?? "",
    amount: row.amount,
    currency: row.currency,
    paymentId: row.paymentId,
    orderId: row.orderId,
    status: row.status,
    method: row.method ?? "",
    description: row.description ?? "",
    createdAt: toIsoString(row.createdAt),
  };
}

export async function getAllDonations() {
  const rows = await getAllDonationRows();
  return rows.map(mapListRow);
}

export async function getDonationById(
  donationId: number
): Promise<DonationDetail | null> {
  const row = await getDonationRowById(donationId);
  if (!row) return null;

  return {
    donationId: row.donationId,
    donorId: row.donorId,
    donorName: row.donorName,
    donorEmail: row.donorEmail,
    donorPhone: row.donorPhone ?? "",
    donorAddress: row.donorAddress ?? "",
    donorCity: row.donorCity ?? "",
    donorState: row.donorState ?? "",
    donorPincode: row.donorPincode ?? "",
    amount: row.amount,
    currency: row.currency,
    paymentId: row.paymentId,
    orderId: row.orderId,
    status: row.status,
    method: row.method ?? "",
    description: row.description ?? "",
    createdAt: toIsoString(row.createdAt),
    updatedAt: toIsoString(row.updatedAt),
  };
}

export async function syncRazorpayPaymentToLocal(payment: RazorpayPayment) {
  const email = payment.email || `${payment.id}@razorpay.local`;
  const contact = payment.contact || null;
  const donorName =
    typeof payment.notes?.donor_name === "string"
      ? payment.notes.donor_name
      : payment.email || payment.contact || "Razorpay Donor";

  let donor = await getDonorRowByEmail(email);

  if (!donor) {
    const donorId = await createDonor({
      name: donorName,
      email,
      phone: contact,
    });

    if (!donorId) {
      throw new Error("Unable to create donor");
    }

    donor = {
      id: donorId,
      name: donorName,
      email,
      phone: contact,
      address: null,
      city: null,
      state: null,
      pincode: null,
      createdAt: null,
      updatedAt: null,
    };
  }

  const existingDonation = await getDonationRowByPaymentId(payment.id);

  const amountInMajorUnits = Number((payment.amount / 100).toFixed(2));

  const donationData = {
    donorId: donor.id,
    amount: amountInMajorUnits,
    currency: payment.currency || "INR",
    paymentId: payment.id,
    orderId: payment.order_id || "",
    status: mapRazorpayStatusToLocal(payment.status || "created"),
    method: payment.method || null,
    description: payment.description || null,
  };

  if (existingDonation) {
    await updateDonationByPaymentId({
      paymentId: donationData.paymentId,
      amount: donationData.amount,
      currency: donationData.currency,
      orderId: donationData.orderId,
      status: donationData.status,
      method: donationData.method,
      description: donationData.description,
    });

    return existingDonation.id;
  }

  return createDonation(donationData);
}

export async function syncRazorpayPaymentsBatchToLocal(
  payments: RazorpayPayment[]
) {
  let syncedCount = 0;

  for (const payment of payments) {
    await syncRazorpayPaymentToLocal(payment);
    syncedCount += 1;
  }

  return {
    syncedCount,
  };
}