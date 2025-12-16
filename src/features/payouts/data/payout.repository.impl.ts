import { apiClient } from "../../../core/api.client";
import { baseUrl } from "../../../core/api.urls";
import type { PayoutRepository, PayoutsListResponse, ProcessPayoutRequest, WalletResponse } from "../domain/payout.entity";

const PAYOUTS_BASE = `${baseUrl}/finance/admin/payouts`;
const WALLET_ENDPOINT = `${baseUrl}/finance/wallet`;

export class PayoutRepositoryImpl implements PayoutRepository {
  async getPayouts(params?: { status?: string; limit?: number; cursor?: string | null }): Promise<PayoutsListResponse> {
    const res = await apiClient.get(PAYOUTS_BASE, { params });
    return res.data as PayoutsListResponse;
  }

  async processPayout(id: string, payload: ProcessPayoutRequest): Promise<Record<string, unknown>> {
    const res = await apiClient.post(`${PAYOUTS_BASE}/${id}/process`, payload);
    return res.data as Record<string, unknown>;
  }

  async getWallet(): Promise<WalletResponse> {
    const res = await apiClient.get(WALLET_ENDPOINT);
    return res.data as WalletResponse;
  }
}

export const payoutRepository = new PayoutRepositoryImpl();
