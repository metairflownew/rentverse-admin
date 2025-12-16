import React, { useEffect, useState } from "react";
import { payoutRepository } from "./data/payout.repository.impl";
import type { Payout, ProcessPayoutRequest } from "./domain/payout.entity";

const STATUS_OPTIONS = ["ALL", "PENDING", "COMPLETED", "REJECTED"] as const;

const PayoutsList: React.FC = () => {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [status, setStatus] = useState<typeof STATUS_OPTIONS[number]>("ALL");
  const [limit] = useState(10);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<Payout | null>(null);
  const [action, setAction] = useState<"APPROVE" | "REJECT" | "">("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchPayouts = async (nextCursor?: string | null) => {
    setLoading(true);
    setError(null);
    try {
      const res = await payoutRepository.getPayouts({
        status: status === "ALL" ? undefined : status,
        limit,
        cursor: nextCursor,
      });
      setPayouts(res.data || []);
      setHasMore(Boolean(res.meta?.hasMore));
      setCursor(res.meta?.nextCursor ?? null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load payouts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayouts(null);
  }, [status]);

  const openProcess = (p: Payout, presetAction?: "APPROVE" | "REJECT") => {
    setSelected(p);
    setAction(presetAction ?? (p.status === "PENDING" ? "" : ""));
    setNotes("");
    setShowModal(true);
  };

  const doProcess = async () => {
    if (!selected) return;
    if (!action) return alert("Choose APPROVE or REJECT");
    setSubmitting(true);
    const payload: ProcessPayoutRequest = {
      action,
      notes: notes?.trim() || undefined,
    };
    try {
      await payoutRepository.processPayout(selected.id, payload);
      await fetchPayouts(null);
      setShowModal(false);
      alert("Payout processed");
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to process payout");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <h2 className="text-xl font-semibold">Payout Requests</h2>
        <div className="flex gap-2">
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value as typeof status); setCursor(null); }}
            className="rounded border px-3 py-2"
          >
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-3">Requester</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Bank</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {payouts.map((p) => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">{p.wallet?.user?.name || p.wallet?.user?.email || '-'}</td>
                <td className="px-4 py-3">{p.amount} </td>
                <td className="px-4 py-3">{p.bankName} / {p.accountNo}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded text-sm font-medium ${p.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : p.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-3">{(p.createdAt || '').slice(0,10)}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => openProcess(p, "APPROVE")} disabled={p.status !== 'PENDING'} className="px-3 py-1 rounded bg-green-600 text-white text-sm disabled:opacity-50">Approve</button>
                    <button onClick={() => openProcess(p, "REJECT")} disabled={p.status !== 'PENDING'} className="px-3 py-1 rounded bg-red-600 text-white text-sm disabled:opacity-50">Reject</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mt-4">
        <button disabled={!hasMore} onClick={() => fetchPayouts(cursor)} className="px-3 py-1 rounded border bg-white disabled:opacity-50">Load more</button>
      </div>

      {showModal && selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded p-4">
            <h3 className="text-lg font-semibold mb-2">Process Payout</h3>
            <div className="text-sm text-gray-700 mb-3">
              <div><strong>Requester:</strong> {selected.wallet?.user?.name || selected.wallet?.user?.email || '-'}</div>
              <div><strong>Amount:</strong> {selected.amount}</div>
              <div><strong>Bank:</strong> {selected.bankName} / {selected.accountNo}</div>
            </div>

            <div className="space-y-3">
              <div className="flex gap-3">
                <label className={`px-3 py-1 rounded border ${action === 'APPROVE' ? 'bg-green-50 border-green-400' : ''}`}>
                  <input type="radio" name="action" checked={action === 'APPROVE'} onChange={() => setAction('APPROVE')} /> Approve
                </label>
                <label className={`px-3 py-1 rounded border ${action === 'REJECT' ? 'bg-red-50 border-red-400' : ''}`}>
                  <input type="radio" name="action" checked={action === 'REJECT'} onChange={() => setAction('REJECT')} /> Reject
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium">Notes (optional)</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full rounded border px-3 py-2 mt-1" rows={3} />
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setShowModal(false)} className="px-3 py-1 rounded border">Cancel</button>
              <button onClick={doProcess} disabled={submitting} className="px-3 py-1 rounded bg-blue-600 text-white">{submitting ? 'Processing...' : 'Submit'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayoutsList;
