export type PropertyMini = {
  id?: string;
  title?: string | null;
  city?: string | null;
  image?: string | null;
};

export type PaymentMini = {
  invoiceId?: string | null;
  status?: string | null;
  amount?: number | null;
  currency?: string | null;
};

export type Booking = {
  id: string;
  status?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  property?: PropertyMini | null;
  payment?: PaymentMini | null;
  createdAt?: string | null;
};

export type BookingsListResponse = {
  status: string;
  message: string;
  data: Booking[];
  meta?: {
    total?: number;
    limit?: number;
    nextCursor?: string | null;
    hasMore?: boolean;
  } | null;
};

export interface BookingRepository {
  getBookings(params?: { limit?: number; cursor?: string | null; status?: string; search?: string }): Promise<BookingsListResponse>;
  getBookingById(id: string): Promise<{ status: string; message: string; data: Booking }>;
}
