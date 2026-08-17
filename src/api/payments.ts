import apiClient from './client';
import type { ApiResponse } from '../types';

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

export const getPaymentForOrder = (orderId: string) =>
  apiClient.get<ApiResponse<Payment>>(`/payments/${orderId}`);

export const syncPayment = (orderId: string) =>
  apiClient.post<ApiResponse<{ synced: boolean; reason?: string }>>(`/payments/${orderId}/sync`);

export const retryPayment = (orderId: string, idempotencyKey: string) =>
  apiClient.post<ApiResponse<RetryPaymentResult>>(
    `/payments/${orderId}/retry`,
    {},
    { headers: { 'Idempotency-Key': idempotencyKey } }
  );
