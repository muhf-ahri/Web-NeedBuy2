import apiClient from './client';
import type { ApiResponse, PaginatedResponse } from '../types';

// ─── Types ─────────────────────────────────────────────────────────────────────
export interface Wallet {
  id: string;
  /** Decimal dari API, dikirim sebagai string. */
  balance: string;
}

export type WalletTxType = 'TOPUP' | 'PAYMENT' | 'REFUND' | 'WITHDRAWAL';
export type WalletTxStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'EXPIRED';

export interface WalletTransaction {
  id: string;
  type: WalletTxType;
  status: WalletTxStatus;
  /** Selalu positif — arahnya dari `type`, bukan dari tanda angkanya. */
  amount: string;
  balanceAfter: string | null;
  orderId: string | null;
  /** Hanya terisi untuk WITHDRAWAL. */
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

/** Batas nominal top-up, disamakan dengan validasi server (lib/needpay.ts). */
export const MIN_TOPUP = 10_000;
export const MAX_TOPUP = 10_000_000;

// ─── Endpoints ─────────────────────────────────────────────────────────────────

/** GET /wallet — saldo NeedPay milik user yang login. */
export const getWallet = async (): Promise<Wallet> => {
  const res = await apiClient.get<ApiResponse<Wallet>>('/wallet');
  return res.data.data;
};

/** GET /wallet/transactions — riwayat saldo, terbaru dulu. */
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

/**
 * POST /wallet/topup — terbitkan pembayaran top-up.
 *
 * Saldo TIDAK bertambah dari sini. Server baru menambah saldo setelah menerima
 * notifikasi Midtrans yang signature-nya terverifikasi, jadi menutup popup
 * pembayaran tidak pernah menghasilkan saldo palsu.
 */
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

/**
 * POST /wallet/topup/:id/sync — tarik status pembayaran langsung dari Midtrans.
 *
 * Dipakai kalau notifikasi Midtrans tidak sampai ke server (server sempat mati,
 * tunnel dev ganti URL, URL notifikasi belum didaftarkan). Tanpa ini, top-up
 * yang sudah dibayar bisa menggantung "menunggu pembayaran" selamanya.
 */
export const syncTopup = async (topupId: string): Promise<TopupSyncResult> => {
  const res = await apiClient.post<ApiResponse<TopupSyncResult>>(
    `/wallet/topup/${topupId}/sync`
  );
  return res.data.data;
};

/** Batas nominal penarikan, disamakan dengan validasi server (lib/needpay.ts). */
export const MIN_WITHDRAWAL = 50_000;
export const MAX_WITHDRAWAL = 100_000_000;

export interface WithdrawalPayload {
  amount: number;
  bankName: string;
  bankAccount: string;
  bankAccountName: string;
}

/**
 * POST /wallet/withdrawals — ajukan pencairan saldo ke rekening bank.
 *
 * Saldo langsung dipotong saat pengajuan dibuat (bukan saat admin menyetujui),
 * supaya satu saldo tidak bisa dijanjikan ke beberapa pengajuan sekaligus.
 * Kalau admin menolak, saldonya dikembalikan.
 */
export const requestWithdrawal = async (
  payload: WithdrawalPayload
): Promise<WalletTransaction> => {
  const res = await apiClient.post<ApiResponse<WalletTransaction>>('/wallet/withdrawals', payload);
  return res.data.data;
};
