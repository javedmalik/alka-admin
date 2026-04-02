export type DonationDbRow = {
  id: number;
  donorId: number;
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

export type DonorDbRow = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export type DonationListRow = {
  donationId: number;
  donorId: number;
  donorName: string;
  donorEmail: string;
  donorPhone: string;
  amount: number;
  currency: string;
  paymentId: string;
  orderId: string;
  status: string;
  method: string;
  description: string;
  createdAt: string;
};

export type DonationDetail = DonationListRow & {
  donorAddress: string;
  donorCity: string;
  donorState: string;
  donorPincode: string;
  updatedAt: string;
};