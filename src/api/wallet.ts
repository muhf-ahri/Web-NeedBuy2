import apiClient from './client';
import type { ApiResponse, PaginatedResponse } from '../types';

export interface Wallet {
  id: string;

  balance: string;
  /** Nomor rekening NeedPay, disebut orang lain saat mau transfer ke sini. */
  accountNumber: string;
  hasPin: boolean;
}

export type WalletTxType =
  | 'TOPUP'
  | 'PAYMENT'
  | 'REFUND'
  | 'WITHDRAWAL'
  | 'EARNING'
  | 'TRANSFER_OUT'
  | 'TRANSFER_IN';
export type WalletTxStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'EXPIRED';

export interface WalletTransaction {
  id: string;
  type: WalletTxType;
  status: WalletTxStatus;

  amount: string;
  balanceAfter: string | null;
  orderId: string | null;

  bankName?: string | null;
  bankAccount?: string | null;
  bankAccountName?: string | null;
  handledAt?: string | null;
  note: string | null;
  snapToken: string | null;
  snapRedirectUrl: string | null;
  midtransOrderId: string | null;
  createdAt: string;
}

export const MIN_TOPUP = 10_000;
export const MAX_TOPUP = 10_000_000;

export const getWallet = async (): Promise<Wallet> => {
  const res = await apiClient.get<ApiResponse<Wallet>>('/wallet');
  return res.data.data;
};

export const getWalletTransactions = async (params?: {
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<WalletTransaction>> => {
  const res = await apiClient.get<ApiResponse<PaginatedResponse<WalletTransaction>>>(
    '/wallet/transactions',
    { params }
  );
  return { data: res.data.data as unknown as WalletTransaction[], meta: (res.data as any).meta };
};

export const startTopup = async (amount: number): Promise<WalletTransaction> => {
  const res = await apiClient.post<ApiResponse<WalletTransaction>>('/wallet/topup', { amount });
  return res.data.data;
};

export interface TopupSyncResult {
  synced: boolean;
  reason?: string;
  status?: WalletTxStatus;
  balance?: string;
}

export const syncTopup = async (topupId: string): Promise<TopupSyncResult> => {
  const res = await apiClient.post<ApiResponse<TopupSyncResult>>(
    `/wallet/topup/${topupId}/sync`
  );
  return res.data.data;
};

export const MIN_WITHDRAWAL = 50_000;
export const MAX_WITHDRAWAL = 100_000_000;

export interface WithdrawalPayload {
  amount: number;
  bankName: string;
  bankAccount: string;
  bankAccountName: string;
}

export const requestWithdrawal = async (
  payload: WithdrawalPayload
): Promise<WalletTransaction> => {
  const res = await apiClient.post<ApiResponse<WalletTransaction>>('/wallet/withdrawals', payload);
  return res.data.data;
};

// ── PIN & transfer ───────────────────────────────────────────────────────────

export const getPinStatus = async (): Promise<{ hasPin: boolean }> => {
  const res = await apiClient.get<ApiResponse<{ hasPin: boolean }>>('/wallet/pin');
  return res.data.data;
};

export const setWalletPin = async (newPin: string, currentPin?: string) => {
  const res = await apiClient.post<ApiResponse<{ hasPin: boolean }>>('/wallet/pin', {
    newPin,
    ...(currentPin ? { currentPin } : {}),
  });
  return res.data.data;
};

export interface AccountLookup {
  accountNumber: string;
  name: string;
}

export const lookupAccount = async (accountNumber: string): Promise<AccountLookup> => {
  const res = await apiClient.get<ApiResponse<AccountLookup>>('/wallet/lookup', {
    params: { accountNumber },
  });
  return res.data.data;
};

export interface TransferResult {
  transferred: boolean;
  amount: string;
  balance: string;
  to: AccountLookup;
}

export const transferBalance = async (
  input: { toAccountNumber: string; amount: number; pin: string; note?: string },
  idempotencyKey: string
): Promise<TransferResult> => {
  const res = await apiClient.post<ApiResponse<TransferResult>>('/wallet/transfer', input, {
    headers: { 'Idempotency-Key': idempotencyKey },
  });
  return res.data.data;
};
