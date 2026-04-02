import { executeProcedure, executeProcedureNoResult, sql } from "@/lib/db/execute";
import type { DonationDbRow, DonorDbRow } from "./donations.types";

type DonationJoinRow = {
  donationId: number;
  donorId: number;
  donorName: string;
  donorEmail: string;
  donorPhone: string | null;
  donorAddress: string | null;
  donorCity: string | null;
  donorState: string | null;
  donorPincode: string | null;
  amount: number;
  currency: string;
  paymentId: string;
  orderId: string;
  status: string;
  method: string | null;
  description: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export async function getAllDonationRows() {
  return executeProcedure<DonationJoinRow>("dbo.sp_Donation_GetAll");
}

export async function getDonationRowById(donationId: number) {
  const rows = await executeProcedure<DonationJoinRow>("dbo.sp_Donation_GetById", [
    {
      name: "DonationId",
      type: sql.Int,
      value: donationId,
    },
  ]);

  return rows[0] ?? null;
}

export async function getDonationRowByPaymentId(paymentId: string) {
  const rows = await executeProcedure<DonationDbRow>(
    "dbo.sp_Donation_GetByPaymentId",
    [
      {
        name: "PaymentId",
        type: sql.NVarChar(255),
        value: paymentId,
      },
    ]
  );

  return rows[0] ?? null;
}

export async function getDonorRowByEmail(email: string) {
  const rows = await executeProcedure<DonorDbRow>("dbo.sp_Donor_GetByEmail", [
    {
      name: "Email",
      type: sql.NVarChar(255),
      value: email,
    },
  ]);

  return rows[0] ?? null;
}

export async function createDonor(data: {
  name: string;
  email: string;
  phone?: string | null;
}) {
  const rows = await executeProcedure<{ id: number }>("dbo.sp_Donor_Create", [
    {
      name: "Name",
      type: sql.NVarChar(100),
      value: data.name,
    },
    {
      name: "Email",
      type: sql.NVarChar(255),
      value: data.email,
    },
    {
      name: "Phone",
      type: sql.NVarChar(20),
      value: data.phone || null,
    },
  ]);

  return rows[0]?.id ?? null;
}

export async function createDonation(data: {
  donorId: number;
  amount: number;
  currency: string;
  paymentId: string;
  orderId: string;
  status: string;
  method?: string | null;
  description?: string | null;
}) {
  const rows = await executeProcedure<{ id: number }>("dbo.sp_Donation_Create", [
    {
      name: "DonorId",
      type: sql.Int,
      value: data.donorId,
    },
    {
      name: "Amount",
      type: sql.Decimal(10, 2),
      value: data.amount,
    },
    {
      name: "Currency",
      type: sql.NVarChar(3),
      value: data.currency,
    },
    {
      name: "PaymentId",
      type: sql.NVarChar(255),
      value: data.paymentId,
    },
    {
      name: "OrderId",
      type: sql.NVarChar(255),
      value: data.orderId,
    },
    {
      name: "Status",
      type: sql.NVarChar(50),
      value: data.status,
    },
    {
      name: "Method",
      type: sql.NVarChar(50),
      value: data.method || null,
    },
    {
      name: "Description",
      type: sql.NVarChar(sql.MAX),
      value: data.description || null,
    },
  ]);

  return rows[0]?.id ?? null;
}

export async function updateDonationByPaymentId(data: {
  paymentId: string;
  amount: number;
  currency: string;
  orderId: string;
  status: string;
  method?: string | null;
  description?: string | null;
}) {
  await executeProcedureNoResult("dbo.sp_Donation_UpdateByPaymentId", [
    {
      name: "PaymentId",
      type: sql.NVarChar(255),
      value: data.paymentId,
    },
    {
      name: "Amount",
      type: sql.Decimal(10, 2),
      value: data.amount,
    },
    {
      name: "Currency",
      type: sql.NVarChar(3),
      value: data.currency,
    },
    {
      name: "OrderId",
      type: sql.NVarChar(255),
      value: data.orderId,
    },
    {
      name: "Status",
      type: sql.NVarChar(50),
      value: data.status,
    },
    {
      name: "Method",
      type: sql.NVarChar(50),
      value: data.method || null,
    },
    {
      name: "Description",
      type: sql.NVarChar(sql.MAX),
      value: data.description || null,
    },
  ]);
}