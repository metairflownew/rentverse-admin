import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { bookingRepository } from "./data/booking.repository.impl";

const BookingDetail: React.FC = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    const fetchOne = async () => {
      setLoading(true);
      try {
        const res = await bookingRepository.getBookingById(id);
        if (!mounted) return;
        setBooking(res.data);
      } catch (err: unknown) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : 'Failed to load booking');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchOne();
    return () => { mounted = false };
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!booking) return <div>No booking found.</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold">Booking Detail</h2>
      <div className="mt-4 bg-white rounded shadow p-4">
        <div><strong>Property:</strong> {booking.property?.title}</div>
        <div><strong>Status:</strong> {booking.status}</div>
        <div><strong>Dates:</strong> {(booking.startDate || '').slice(0,10)} - {(booking.endDate||'').slice(0,10)}</div>
        <div className="mt-2"><strong>Payment:</strong> {booking.payment?.status} {booking.payment?.amount ? `(${booking.payment.amount})` : ''}</div>
      </div>
    </div>
  )
}

export default BookingDetail;
