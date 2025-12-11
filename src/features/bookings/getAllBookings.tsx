import React, { useEffect, useState } from "react";
import { bookingRepository } from "./data/booking.repository.impl";
import type { Booking } from "./domain/booking.entity";
import { Link } from "react-router-dom";

const BookingsList: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [limit] = useState(10);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const fetchBookings = async (cursorParam?: string | null) => {
    setLoading(true);
    setError(null);
    try {
      const res = await bookingRepository.getBookings({ limit, cursor: cursorParam });
      setBookings(res.data || []);
      setHasMore(Boolean(res.meta?.hasMore));
      setCursor(res.meta?.nextCursor ?? null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings(null);
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Bookings</h2>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-3">Property</th>
              <th className="px-4 py-3">Dates</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">{b.property?.title || '-'}</td>
                <td className="px-4 py-3">{(b.startDate || '')?.slice(0,10)} - {(b.endDate || '')?.slice(0,10)}</td>
                <td className="px-4 py-3">{b.payment?.status || '-'} {b.payment?.amount ? `(${b.payment.amount})` : ''}</td>
                <td className="px-4 py-3">{b.status || '-'}</td>
                <td className="px-4 py-3">
                  <Link to={`/bookings/${b.id}`} className="text-blue-600 hover:underline text-sm">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mt-4">
        <button disabled={!hasMore} onClick={() => fetchBookings(cursor)} className="px-3 py-1 rounded border bg-white disabled:opacity-50">Load more</button>
      </div>
    </div>
  );
};

export default BookingsList;
