import React, { useEffect, useState } from "react";
import { disputeRepository } from "./data/dispute.repository.impl";
import type { Dispute, ResolveDisputeRequest } from "./domain/dispute.entity";
import { Link } from "react-router-dom";
import { bookingRepository } from "../bookings/data/booking.repository.impl";

const RESOLUTION_OPTIONS = ["REFUND_TENANT", "PAYOUT_LANDLORD", "REJECT_DISPUTE"] as const;

const DisputesList: React.FC = () => {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<Dispute | null>(null);
  const [resolution, setResolution] = useState<typeof RESOLUTION_OPTIONS[number] | "">("");
  const [adminNotes, setAdminNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [pageView, setPageView] = useState<"list" | "bookingDetail">("list");

  const fetchDisputes = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await disputeRepository.getDisputes();
      setDisputes(res.data || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load disputes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisputes();
    (async () => {
      try {
        const res = await bookingRepository.getBookings({ limit: 200 });
        setBookings(res.data || []);
      } catch (e) {
        // ignore booking fetch errors
      }
    })();
  }, []);

  const openResolve = (d: Dispute) => {
    setSelected(d);
    setResolution("");
    setAdminNotes("");
    setShowModal(true);
  };

  const doResolve = async () => {
    if (!selected) return;
    if (!resolution) return alert("Please choose a resolution");
    if (!adminNotes || adminNotes.trim().length < 5) return alert("Admin notes must be at least 5 characters");

    setSubmitting(true);
    const payload: ResolveDisputeRequest = {
      resolution: resolution as ResolveDisputeRequest["resolution"],
      adminNotes: adminNotes.trim(),
    };

    try {
      await disputeRepository.resolveDispute(selected.id, payload);
      // refetch list to reflect changes
      await fetchDisputes();
      setShowModal(false);
      alert("Dispute resolved successfully");
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to resolve dispute");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Disputes</h2>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-3">Reason</th>
              <th className="px-4 py-3">Property</th>
              <th className="px-4 py-3">Initiator</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {disputes.map((d) => (
              <tr key={d.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="text-sm font-medium">{d.reason}</div>
                  <div className="text-xs text-gray-600">{d.description}</div>
                </td>
                <td className="px-4 py-3">{d.booking?.property?.title || "-"}</td>
                <td className="px-4 py-3">{d.initiator?.name || d.initiator?.email || "-"}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded text-sm font-medium ${d.status === 'RESOLVED' ? 'bg-green-100 text-green-800' : d.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-700'}`}>
                    {d.status || "-"}
                  </span>
                </td>
                <td className="px-4 py-3">{(d.createdAt || "").slice(0, 10)}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {d.status === 'RESOLVED' ? (
                      <Link to={`/disputes/${d.id}`} className="px-3 py-1 rounded border text-sm">Update</Link>
                    ) : (
                      <button
                        onClick={() => openResolve(d)}
                        className="px-3 py-1 rounded bg-blue-600 text-white text-sm"
                      >
                        Resolve
                      </button>
                    )}

                    <button
                      onClick={() => {
                        const b = bookings.find((x) => x.id === d.bookingId) || d.booking || null;
                        setSelectedBooking(b);
                        setSelected(d);
                        setPageView("bookingDetail");
                      }}
                      className="px-3 py-1 rounded border text-sm"
                    >
                      Booking
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Booking detail view (replaces list) */}
      {pageView === "bookingDetail" && selectedBooking && selected && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Booking / Dispute Detail</h2>
            <div>
              <button onClick={() => { setPageView("list"); setSelectedBooking(null); setSelected(null); }} className="px-3 py-1 rounded border">Back</button>
            </div>
          </div>

          <div className="bg-white rounded shadow p-4 mb-4">
            <h3 className="font-medium">Dispute</h3>
            <div className="mt-2"><strong>Reason:</strong> {selected.reason}</div>
            <div className="mt-1"><strong>Status:</strong> {selected.status}</div>
            <div className="mt-1"><strong>Resolution:</strong> {selected.resolution || '-'}</div>
            <div className="mt-1"><strong>Admin Notes:</strong> {selected.adminNotes || '-'}</div>
          </div>

          <div className="bg-white rounded shadow p-4 mb-4">
            <h3 className="font-medium">Booking</h3>
            <div className="mt-2"><strong>Booking ID:</strong> {selectedBooking.id}</div>
            <div className="mt-1"><strong>Status:</strong> {selectedBooking.status || '-'}</div>
            <div className="mt-1"><strong>Property:</strong> {selectedBooking.property?.title || '-'}</div>
            <div className="mt-1"><strong>Payment:</strong> {selectedBooking.payment?.status || '-'}</div>
          </div>

          <h3 className="text-lg font-medium mb-2">Summary</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded p-4">
              <h4 className="font-semibold mb-2">Dispute Details</h4>
              <div className="text-sm text-gray-700 space-y-2">
                <div><span className="font-medium">ID:</span> {selected.id}</div>
                <div><span className="font-medium">Booking ID:</span> {selected.bookingId}</div>
                <div><span className="font-medium">Initiator:</span> {selected.initiator?.name || selected.initiator?.email || '-'}</div>
                <div><span className="font-medium">Reason:</span> {selected.reason || '-'}</div>
                <div><span className="font-medium">Description:</span> {selected.description || '-'}</div>
                <div><span className="font-medium">Status:</span> <span className={`inline-flex items-center px-2 py-1 rounded text-sm font-medium ${selected.status === 'RESOLVED' ? 'bg-green-100 text-green-800' : selected.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-700'}`}>{selected.status || '-'}</span></div>
                <div><span className="font-medium">Resolution:</span> {selected.resolution || '-'}</div>
                <div><span className="font-medium">Admin Notes:</span> {selected.adminNotes || '-'}</div>
                <div className="text-xs text-gray-500"><span className="font-medium">Created:</span> {(selected.createdAt || '').slice(0,19).replace('T',' ') || '-'}</div>
                <div className="text-xs text-gray-500"><span className="font-medium">Resolved At:</span> {(selected.resolvedAt || '').slice(0,19).replace('T',' ') || '-'}</div>
                <div className="text-xs text-gray-500"><span className="font-medium">Resolved By:</span> {selected.resolvedBy || '-'}</div>
              </div>
            </div>

            <div className="bg-white rounded p-4">
              <h4 className="font-semibold mb-2">Booking Details</h4>
              {selectedBooking ? (
                <div className="text-sm text-gray-700 space-y-2">
                  <div><span className="font-medium">ID:</span> {selectedBooking.id}</div>
                  <div><span className="font-medium">Status:</span> {selectedBooking.status || '-'}</div>
                  <div><span className="font-medium">Property:</span> {selectedBooking.property?.title || '-'}</div>
                  <div><span className="font-medium">City:</span> {selectedBooking.property?.city || '-'}</div>
                  <div><span className="font-medium">Start:</span> {(selectedBooking.startDate || '').slice(0,10) || '-'}</div>
                  <div><span className="font-medium">End:</span> {(selectedBooking.endDate || '').slice(0,10) || '-'}</div>
                  <div><span className="font-medium">Payment:</span> {selectedBooking.payment?.status || '-'} {selectedBooking.payment?.amount ? `(${selectedBooking.payment.amount})` : ''}</div>
                  <div className="text-xs text-gray-500"><span className="font-medium">Booked At:</span> {(selectedBooking.createdAt || '').slice(0,19).replace('T',' ') || '-'}</div>
                </div>
              ) : (
                <div className="text-sm text-gray-500">No booking data available for this dispute.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded p-4">
            <h3 className="text-lg font-semibold mb-2">Resolve Dispute</h3>
            <div className="text-sm text-gray-700 mb-4">
              <div><strong>Reason:</strong> {selected.reason}</div>
              <div className="mt-1"><strong>Property:</strong> {selected.booking?.property?.title || '-'}</div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium">Resolution</label>
                <select value={resolution} onChange={(e) => setResolution(e.target.value as any)} className="w-full rounded border px-3 py-2 mt-1">
                  <option value="">Select</option>
                  {RESOLUTION_OPTIONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium">Admin Notes</label>
                <textarea value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} className="w-full rounded border px-3 py-2 mt-1" rows={4} />
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setShowModal(false)} className="px-3 py-1 rounded border">Cancel</button>
              <button onClick={doResolve} disabled={submitting} className="px-3 py-1 rounded bg-green-600 text-white">{submitting ? 'Submitting...' : 'Submit'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisputesList;
