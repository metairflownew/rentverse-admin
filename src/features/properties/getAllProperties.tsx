import React, { useEffect, useState } from "react";
import { propertyRepository } from "./data/property.repository.impl";
import type { Property, VerifyPropertyRequest } from "./domain/property.entity";

const PropertiesList: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PENDING" | "VERIFIED">("ALL");
  const [search, setSearch] = useState("");
  const [meta, setMeta] = useState<{ page?: number; totalPages?: number; hasNextPage?: boolean; hasPrevPage?: boolean } | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<Property | null>(null);
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchProperties = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await propertyRepository.getProperties({
        page,
        limit,
        search: search.trim() || undefined,
        status: statusFilter === "ALL" ? undefined : statusFilter,
      });
      setProperties(res.data || []);
      setMeta(res.meta || null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [page, limit, statusFilter, search]);

  const openVerify = (p: Property, preset?: { isVerified?: boolean | null; rejectionReason?: string | null }) => {
    setSelected(p);
    setIsVerified(preset?.isVerified ?? (p.isVerified ?? null));
    setRejectionReason(preset?.rejectionReason ?? "");
    setShowModal(true);
  };

  const doVerify = async () => {
    if (!selected || isVerified === null) return alert("Please choose approve or reject");
    if (isVerified === false && (!rejectionReason || rejectionReason.trim().length < 5)) return alert("Rejection reason is required (min 5 chars)");

    setSubmitting(true);
    const payload: VerifyPropertyRequest = {
      isVerified: Boolean(isVerified),
      rejectionReason: rejectionReason?.trim() || undefined,
    };

    try {
      await propertyRepository.verifyProperty(selected.id, payload);
      await fetchProperties();
      setShowModal(false);
      alert("Property verification updated");
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to verify property");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <h2 className="text-xl font-semibold">Properties (Admin)</h2>

        <div className="flex flex-col md:flex-row gap-2">
          <input
            value={search}
            onChange={(e) => { setPage(1); setSearch(e.target.value); }}
            placeholder="Search title or city"
            className="rounded border px-3 py-2"
          />
          <select
            value={statusFilter}
            onChange={(e) => { setPage(1); setStatusFilter(e.target.value as typeof statusFilter); }}
            className="rounded border px-3 py-2"
          >
            <option value="ALL">ALL</option>
            <option value="PENDING">PENDING</option>
            <option value="VERIFIED">VERIFIED</option>
          </select>
        </div>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">City</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Submitted</th>
              <th className="px-4 py-3">Landlord</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((p) => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">{p.title}</td>
                <td className="px-4 py-3">{p.city}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded text-sm font-medium ${p.status === 'VERIFIED' || p.isVerified ? 'bg-green-100 text-green-800' : p.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-700'}`}>
                    {p.status || (p.isVerified ? 'VERIFIED' : 'PENDING')}
                  </span>
                </td>
                <td className="px-4 py-3">{(p.submittedAt || p.createdAt || '').slice(0,10)}</td>
                <td className="px-4 py-3">{p.landlord?.name || p.landlord?.email || '-'}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => openVerify(p)} className="px-3 py-1 rounded bg-blue-600 text-white text-sm">Verify</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-600">{meta ? `Page ${meta.page || page} / ${meta.totalPages || '-'}` : ''}</div>
        <div className="flex gap-2">
          <button
            disabled={!meta?.hasPrevPage && page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1 rounded border bg-white disabled:opacity-50"
          >
            Prev
          </button>
          <button
            disabled={!meta?.hasNextPage}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 rounded border bg-white disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {showModal && selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded p-4">
            <h3 className="text-lg font-semibold mb-2">Verify Property</h3>

            <div className="space-y-3">
              <div>
                <div className="text-sm font-medium">Property</div>
                <div className="text-sm text-gray-700">{selected.title} — {selected.city}</div>
              </div>

              <div>
                <label className="block text-sm font-medium">Decision</label>
                <div className="flex gap-3 mt-2">
                  <label className={`px-3 py-1 rounded border ${isVerified === true ? 'bg-green-50 border-green-400' : ''}`}>
                    <input type="radio" name="verify" checked={isVerified === true} onChange={() => setIsVerified(true)} /> Approve
                  </label>
                  <label className={`px-3 py-1 rounded border ${isVerified === false ? 'bg-red-50 border-red-400' : ''}`}>
                    <input type="radio" name="verify" checked={isVerified === false} onChange={() => setIsVerified(false)} /> Reject
                  </label>
                </div>
              </div>

              {isVerified === false && (
                <div>
                  <label className="block text-sm font-medium">Rejection Reason</label>
                  <textarea value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} className="w-full rounded border px-3 py-2 mt-1" rows={3} />
                </div>
              )}
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setShowModal(false)} className="px-3 py-1 rounded border">Cancel</button>
              <button onClick={doVerify} disabled={submitting} className="px-3 py-1 rounded bg-green-600 text-white">{submitting ? 'Submitting...' : 'Submit'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertiesList;
