import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { disputeRepository } from "./data/dispute.repository.impl";
import { bookingRepository } from "../bookings/data/booking.repository.impl";

// This page loads the dispute by id (from disputes list) and enriches it with
// booking data fetched from `GET /bookings`. It then renders the combined
// object similar to the example you provided.

const DisputeDetail: React.FC = () => {
  const { id } = useParams();
  const [dispute, setDispute] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    const fetchOne = async () => {
      setLoading(true);
      try {
        // repo doesn't implement getById, so fetch list and find
        const res = await disputeRepository.getDisputes();
        if (!mounted) return;
        const found = res.data.find((x: any) => x.id === id) || null;

        // fetch bookings and try to find the booking that matches the dispute.bookingId
        let bookingMatch = null;
        try {
          const bookingsRes = await bookingRepository.getBookings({ limit: 100 });
          bookingMatch = bookingsRes.data.find((b: any) => b.id === found?.bookingId) || null;
        } catch (e) {
          // ignore booking fetch errors; we'll still render dispute
          // but log for debugging
          // console.error('Failed to fetch bookings', e);
        }

        const combined = found
          ? {
              ...found,
              booking: bookingMatch || found.booking || null,
            }
          : null;

        setDispute(combined);
      } catch (err: unknown) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : 'Failed to load dispute');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchOne();
    return () => { mounted = false };
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!dispute) return <div>Dispute not found.</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold">Dispute Detail</h2>
      <div className="mt-4 bg-white rounded shadow p-4">
        <div className="mb-4">
          <div><strong>Reason:</strong> {dispute.reason}</div>
          <div className="mt-1"><strong>Description:</strong> {dispute.description}</div>
          <div className="mt-1"><strong>Status:</strong> {dispute.status}</div>
          <div className="mt-1"><strong>Resolution:</strong> {dispute.resolution || '-'}</div>
          <div className="mt-1"><strong>Admin Notes:</strong> {dispute.adminNotes || '-'}</div>
        </div>

        <h3 className="text-lg font-medium mb-2">Matched Booking (from /bookings)</h3>
        {dispute.booking ? (
          <div className="bg-gray-50 rounded p-3 mb-4">
            <div><strong>Booking ID:</strong> {dispute.booking.id}</div>
            <div className="mt-1"><strong>Status:</strong> {dispute.booking.status || '-'}</div>
            <div className="mt-1"><strong>Property:</strong> {dispute.booking.property?.title || '-'}</div>
          </div>
        ) : (
          <div className="text-sm text-gray-500 mb-4">No booking match found in `/bookings`.</div>
        )}

        <h3 className="text-lg font-medium mb-2">Raw Combined Object</h3>
        <pre className="bg-black text-white p-3 rounded text-xs overflow-auto max-h-96">
          {JSON.stringify(dispute, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export default DisputeDetail;
