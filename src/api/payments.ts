import apiClient from './client';
import type { ApiResponse } from '../types';

// ─── Types ─────────────────────────────────────────────────────────────────────
export interface Payment {
  id: string;
  status: 'PENDING' | 'PAID' | 'FAILED' | 'EXPIRED' | 'REFUNDED';
  method: string | null;
  snapToken: string | null;
  snapRedirectUrl: string | null;
  midtransOrderId: string | null;
  paidAt: string | null;
  createdAt: string;
}

export interface RetryPaymentResult {
  orderId: string;
  orderNumber: string;
  payment: {
    id: string;
    status: string;
    snapToken: string | null;
    snapRedirectUrl: string | null;
    midtransOrderId: string | null;
  };
}

// ─── Payment Endpoints ─────────────────────────────────────────────────────────

/** GET /payments/:orderId - Get payment for an order */
export const getPaymentForOrder = (orderId: string) =>
  apiClient.get<ApiResponse<Payment>>(`/payments/${orderId}`);

/**
 * POST /payments/:orderId/sync - Tarik status dari Midtrans.
 * Dipakai sebagai jaring pengaman kalau notifikasi webhook tidak sampai.
 */
export const syncPayment = (orderId: string) =>
  apiClient.post<ApiResponse<{ synced: boolean; reason?: string }>>(`/payments/${orderId}/sync`);

/** POST /payments/:orderId/retry - Retry Snap for an order (requires Idempotency-Key) */
export const retryPayment = (orderId: string, idempotencyKey: string) =>
  apiClient.post<ApiResponse<RetryPaymentResult>>(
    `/payments/${orderId}/retry`,
    {},
    { headers: { 'Idempotency-Key': idempotencyKey } }
  );
