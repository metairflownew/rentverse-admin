export type PayoutUser = {
	name?: string | null;
	email?: string | null;
};

export type PayoutWallet = {
	user?: PayoutUser | null;
};

export type Payout = {
	id: string;
	walletId: string;
	amount: number | string;
	status: string; // PENDING, COMPLETED, REJECTED
	bankName?: string | null;
	accountNo?: string | null;
	accountName?: string | null;
	processedAt?: string | null;
	notes?: string | null;
	createdAt?: string | null;
	updatedAt?: string | null;
	wallet?: PayoutWallet | null;
};

export type PayoutsListMeta = {
	total?: number;
	limit?: number;
	nextCursor?: string | null;
	hasMore?: boolean;
};

export type PayoutsListResponse = {
	status: string;
	message: string;
	meta?: PayoutsListMeta | null;
	data: Payout[];
};

export type ProcessPayoutRequest = {
	action: "APPROVE" | "REJECT";
	notes?: string;
};

export type WalletTransaction = {
	id: string;
	walletId: string;
	amount: number | string;
	type: string; // CREDIT/DEBIT
	category?: string | null;
	description?: string | null;
	referenceId?: string | null;
	balanceAfter?: number | string | null;
	createdAt?: string | null;
};

export type Wallet = {
	id: string;
	userId: string;
	balance: number | string;
	currency?: string | null;
	updatedAt?: string | null;
	transactions?: WalletTransaction[];
};

export type WalletResponse = {
	status: string;
	message: string;
	data: Wallet;
};

export interface PayoutRepository {
	getPayouts(params?: { status?: string; limit?: number; cursor?: string | null }): Promise<PayoutsListResponse>;
	processPayout(id: string, payload: ProcessPayoutRequest): Promise<Record<string, unknown>>;
	getWallet(): Promise<WalletResponse>;
}

