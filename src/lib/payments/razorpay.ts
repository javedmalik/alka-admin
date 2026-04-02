const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || "";
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "";
const RAZORPAY_BASE_URL =
  process.env.RAZORPAY_BASE_URL || "https://api.razorpay.com/v1";

function getRazorpayAuthHeader() {
  const credentials = Buffer.from(
    `${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`
  ).toString("base64");

  return `Basic ${credentials}`;
}

async function razorpayFetch<T>(path: string): Promise<T> {
  const response = await fetch(`${RAZORPAY_BASE_URL}${path}`, {
    method: "GET",
    headers: {
      Authorization: getRazorpayAuthHeader(),
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Razorpay API error: ${response.status} ${errorText}`);
  }

  return response.json() as Promise<T>;
}

export type RazorpayPayment = {
  id: string;
  entity: string;
  amount: number;
  currency: string;
  status: string;
  order_id: string | null;
  invoice_id: string | null;
  international: boolean;
  method: string | null;
  amount_refunded: number;
  refund_status: string | null;
  captured: boolean;
  description: string | null;
  card_id?: string | null;
  bank?: string | null;
  wallet?: string | null;
  email?: string | null;
  contact?: string | null;
  fee?: number | null;
  tax?: number | null;
  error_code?: string | null;
  error_description?: string | null;
  error_source?: string | null;
  error_step?: string | null;
  error_reason?: string | null;
  notes?: Record<string, unknown>;
  created_at: number;
};

export type RazorpayPaymentCollection = {
  entity: "collection";
  count: number;
  items: RazorpayPayment[];
};

export async function getRazorpayPayments(params?: {
  count?: number;
  skip?: number;
  from?: number;
  to?: number;
}) {
  const search = new URLSearchParams();

  if (typeof params?.count === "number") {
    search.set("count", String(params.count));
  }

  if (typeof params?.skip === "number") {
    search.set("skip", String(params.skip));
  }

  if (typeof params?.from === "number") {
    search.set("from", String(params.from));
  }

  if (typeof params?.to === "number") {
    search.set("to", String(params.to));
  }

  const query = search.toString();

  return razorpayFetch<RazorpayPaymentCollection>(
    `/payments${query ? `?${query}` : ""}`
  );
}

export async function getRazorpayPaymentById(paymentId: string) {
  return razorpayFetch<RazorpayPayment>(`/payments/${paymentId}`);
}

export async function getSafeRazorpayPaymentById(paymentId: string) {
  try {
    return await getRazorpayPaymentById(paymentId);
  } catch (error) {
    console.error("Razorpay payment lookup failed:", error);
    return null;
  }
}

export async function getRazorpayPaymentsByDateRange(
  from: number,
  to: number,
  options?: {
    count?: number;
    skip?: number;
  }
) {
  return getRazorpayPayments({
    from,
    to,
    count: options?.count,
    skip: options?.skip,
  });
}