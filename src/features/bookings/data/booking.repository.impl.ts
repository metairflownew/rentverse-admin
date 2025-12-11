import { apiClient } from "../../../core/api.client";
import { baseUrl } from "../../../core/api.urls";
import type { BookingRepository, BookingsListResponse } from "../domain/booking.entity";

const BOOKINGS_BASE = `${baseUrl}/bookings`;

export class BookingRepositoryImpl implements BookingRepository {
  async getBookings(params?: { limit?: number; cursor?: string | null; status?: string; search?: string }): Promise<BookingsListResponse> {
    const res = await apiClient.get(BOOKINGS_BASE, { params });
    return res.data as BookingsListResponse;
  }

  async getBookingById(id: string): Promise<{ status: string; message: string; data: any }> {
    const res = await apiClient.get(`${BOOKINGS_BASE}/${id}`);
    return res.data as { status: string; message: string; data: any };
  }
}

export const bookingRepository = new BookingRepositoryImpl();
