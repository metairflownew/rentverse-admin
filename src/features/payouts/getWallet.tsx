import React, { useEffect, useState } from "react";
import { payoutRepository } from "./data/payout.repository.impl";
import type { Wallet } from "./domain/payout.entity";

const WalletView: React.FC = () => {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWallet = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await payoutRepository.getWallet();
      setWallet(res.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load wallet");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Wallet</h2>
        <button onClick={fetchWallet} className="px-3 py-1 rounded border bg-white">Refresh</button>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}

      {wallet && (
        <div className="bg-white rounded shadow p-4 mb-4">
          <div className="text-sm text-gray-700">
            <div><span className="font-medium">Wallet ID:</span> {wallet.id}</div>
            <div><span className="font-medium">Balance:</span> {wallet.balance} {wallet.currency || ''}</div>
            <div><span className="font-medium">Updated:</span> {(wallet.updatedAt || '').slice(0,19).replace('T',' ')}</div>
          </div>
        </div>
      )}

      <h3 className="text-lg font-semibold mb-2">Transactions</h3>
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Balance After</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Created</th>
            </tr>
          </thead>
          <tbody>
            {(wallet?.transactions || []).map((tx) => (
              <tr key={tx.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">{tx.type}</td>
                <td className="px-4 py-3">{tx.category || '-'}</td>
                <td className="px-4 py-3">{tx.amount}</td>
                <td className="px-4 py-3">{tx.balanceAfter || '-'}</td>
                <td className="px-4 py-3">{tx.description || '-'}</td>
                <td className="px-4 py-3">{(tx.createdAt || '').slice(0,19).replace('T',' ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WalletView;
