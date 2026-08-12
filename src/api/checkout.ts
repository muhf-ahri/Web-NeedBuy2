import apiClient from './client';
import type { ApiResponse } from '../types';

// ─── Types ─────────────────────────────────────────────────────────────────────
export interface PreviewLine {
  cartItemId: string;
  productId: string;
  productName: string;
  productSlug: string;
  imageUrl: string | null;
  quantity: number;
  /** Varian yang dipilih, ikut disnapshot ke order saat checkout. */
  variant: string | null;
  price: string;
  /** Sudah memuat potongan grosir kalau jumlahnya memenuhi. */
  subtotal: string;
  bulkDiscountPercent: number;
}

export interface PreviewOrder {
  sellerId: string;
  storeName: string | null;
  items: PreviewLine[];
  subtotal: string;
  shippingCost: string;
  total: string;
}

export interface StockProblem {
  cartItemId: string;
  productId: string;
  productName?: string;
  requested: number;
  available: number;
}

export interface CheckoutPreview {
  orderCount: number;
  orders: PreviewOrder[];
  grandTotal: string;
  stockProblems: StockProblem[];
  canCheckout: boolean;
}

/** NEEDPAY memotong saldo dompet saat checkout — ordernya langsung lunas. */
export type PaymentMethod = 'MIDTRANS' | 'COD' | 'NEEDPAY';

export interface CreatedOrderPayment {
  orderId: string;
  orderNumber: string;
  paymentMethod: PaymentMethod;
  payment: {
    id: string;
    status: string;
    method: string | null;
    snapToken: string | null;
    snapRedirectUrl: string | null;
  } | null;
  paymentError?: string;
}

// ─── Checkout Endpoints ────────────────────────────────────────────────────────

/**
 * POST /checkout/preview - Preview orders (no writes).
 * `cartItemIds` kosong = seluruh isi keranjang.
 */
export const previewCheckout = (shippingCost: number = 0, cartItemIds?: string[]) =>
  apiClient.post<ApiResponse<CheckoutPreview>>('/checkout/preview', {
    shippingCost,
    ...(cartItemIds?.length ? { cartItemIds } : {}),
  });

/** POST /checkout - Confirm checkout (requires Idempotency-Key) */
export const confirmCheckout = (
  data: {
    addressId: string;
    cartItemIds?: string[];
    shippingCost?: number;
    notes?: string;
    paymentMethod?: PaymentMethod;
  },
  idempotencyKey: string
) =>
  apiClient.post<ApiResponse<{ orderCount: number; orders: CreatedOrderPayment[] }>>(
    '/checkout',
    data,
    { headers: { 'Idempotency-Key': idempotencyKey } }
  );
