import apiClient from './client';
import type { ApiResponse } from '../types';

export interface PreviewLine {
  cartItemId: string;
  productId: string;
  productName: string;
  productSlug: string;
  imageUrl: string | null;
  quantity: number;
  
  variant: string | null;
  price: string;
  
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

export const previewCheckout = (shippingCost: number = 0, cartItemIds?: string[]) =>
  apiClient.post<ApiResponse<CheckoutPreview>>('/checkout/preview', {
    shippingCost,
    ...(cartItemIds?.length ? { cartItemIds } : {}),
  });

export const confirmCheckout = (
  data: {
    addressId: string;
    cartItemIds?: string[];
    shippingCost?: number;
    notes?: string;
    
    couponCode?: string;
    paymentMethod?: PaymentMethod;
  },
  idempotencyKey: string
) =>
  apiClient.post<ApiResponse<{ orderCount: number; orders: CreatedOrderPayment[] }>>(
    '/checkout',
    data,
    { headers: { 'Idempotency-Key': idempotencyKey } }
  );
