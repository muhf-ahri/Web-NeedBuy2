import apiClient from './client';
import type { ApiResponse } from '../types';

// ─── Types ─────────────────────────────────────────────────────────────────────
export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: string;
  subtotal: string;
  review: {
    id: string;
    rating: number;
  } | null;
}

export interface OrderPayment {
  id: string;
  status: string;
  method: string | null;
  snapToken: string | null;
  snapRedirectUrl: string | null;
  paidAt: string | null;
}

export interface OrderAddress {
  recipientName: string;
  phone: string;
  fullAddress: string;
  city: string;
  province: string;
  postalCode: string;
}

export interface Address extends OrderAddress {
  id: string;
  label: string | null;
  isDefault: boolean;
}

export type OrderStatus = 'WAITING_PAYMENT' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'COMPLETED' | 'CANCELLED';

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  subtotal: string;
  shippingCost: string;
  total: string;
  deliveredAt: string | null;
  completedAt: string | null;
  createdAt: string;
  address: OrderAddress | null;
  items: OrderItem[];
  totalBarang: number;
  statusPembayaranLabel: string;
  statusPengirimanLabel: string;
  seller: {
    id: string;
    storeName: string;
  };
  payment: OrderPayment | null;
}

export interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
}

// ─── Order Endpoints ────────────────────────────────────────────────────────────

export interface GetOrdersParams {
  status?: OrderStatus;
  q?: string;
  page?: number;
  limit?: number;
}

/** GET /orders - Get user's orders */
export const getOrders = (params?: GetOrdersParams) =>
  apiClient.get<ApiResponse<Order[]>>('/orders', { params });

/** GET /orders/:id - Get order detail */
export const getOrder = (id: string) =>
  apiClient.get<ApiResponse<Order>>(`/orders/${id}`);

/** PATCH /orders/:id/status - Update order status (SHIPPED, DELIVERED, COMPLETED) */
export const updateOrderStatus = (id: string, status: 'SHIPPED' | 'DELIVERED' | 'COMPLETED') =>
  apiClient.patch<ApiResponse<Order>>(`/orders/${id}/status`, { status });

/** POST /orders/:id/cancel - Cancel an order */
export const cancelOrder = (id: string, idempotencyKey: string) =>
  apiClient.post(`/orders/${id}/cancel`, {}, {
    headers: { 'Idempotency-Key': idempotencyKey }
  });

/** POST /orders/:orderId/items/:itemId/review - Create a review */
export const createReview = (orderId: string, itemId: string, data: { rating: number; comment?: string }) =>
  apiClient.post<ApiResponse<Review>>(`/orders/${orderId}/items/${itemId}/review`, data);

// ─── Addresses ─────────────────────────────────────────────────────────────────

/** GET /addresses - Get user's addresses */
export const getAddresses = () =>
  apiClient.get<ApiResponse<Address[]>>('/addresses');

/** POST /addresses - Create new address */
export const createAddress = (data: {
  label?: string;
  recipientName: string;
  phone: string;
  fullAddress: string;
  city: string;
  province: string;
  postalCode: string;
  isDefault?: boolean;
}) => apiClient.post<ApiResponse<Address>>('/addresses', data);

/** PATCH /addresses/:id - Update address */
export const updateAddress = (id: string, data: Partial<{
  label: string;
  recipientName: string;
  phone: string;
  fullAddress: string;
  city: string;
  province: string;
  postalCode: string;
  isDefault: boolean;
}>) => apiClient.patch<ApiResponse<Address>>(`/addresses/${id}`, data);

/** DELETE /addresses/:id - Delete address */
export const deleteAddress = (id: string) =>
  apiClient.delete(`/addresses/${id}`);
