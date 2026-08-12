import apiClient from './client';
import type { ApiResponse } from '../types';

// ─── Types ─────────────────────────────────────────────────────────────────────
export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  /** Varian yang dibeli, snapshot saat order dibuat. */
  variant: string | null;
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

/**
 * Order dilihat dari sisi penjual: tahu pembelinya siapa, dan TIDAK pernah
 * membawa `snapToken`/`snapRedirectUrl` — itu kredensial pembayaran milik
 * pembeli. Server yang memangkasnya lewat skema respons terpisah.
 */
export interface SellerOrder
  extends Omit<Order, 'seller' | 'payment'> {
  user: { id: string; name: string; email: string };
  payment: { id: string; status: string; method: string | null; paidAt: string | null } | null;
}

export interface OrdersMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
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

/**
 * GET /sellers/me/orders — order yang masuk ke toko sendiri.
 *
 * Beda endpoint dari `/orders` (itu order sebagai PEMBELI). Filter `status`,
 * pencarian `q`, dan paginasi semuanya dikerjakan server; `q` juga mencari di
 * nama/email pembeli dan nama produk yang tidak seluruhnya ada di client.
 */
export const getSellerOrders = async (
  params?: GetOrdersParams
): Promise<{ items: SellerOrder[]; meta: OrdersMeta }> => {
  const res = await apiClient.get<ApiResponse<SellerOrder[]> & { meta: OrdersMeta }>(
    '/sellers/me/orders',
    { params }
  );
  return { items: res.data.data, meta: res.data.meta };
};

/** GET /sellers/me/orders/:id — detail satu order toko sendiri */
export const getSellerOrder = (id: string) =>
  apiClient.get<ApiResponse<SellerOrder>>(`/sellers/me/orders/${id}`);

/** PATCH /orders/:id/status - Update order status (SHIPPED, DELIVERED, COMPLETED) */
export const updateOrderStatus = (id: string, status: 'SHIPPED' | 'DELIVERED' | 'COMPLETED') =>
  apiClient.patch<ApiResponse<Order>>(`/orders/${id}/status`, { status });

/** POST /orders/:id/cancel - Cancel an order */
export const cancelOrder = (id: string, idempotencyKey: string) =>
  apiClient.post(`/orders/${id}/cancel`, {}, {
    headers: { 'Idempotency-Key': idempotencyKey }
  });

/** POST /orders/:orderId/items/:itemId/review - Create a review */
export const createReview = (
  orderId: string,
  itemId: string,
  data: {
    rating: number;
    comment?: string;
    /** Foto/video ulasan: URL hasil `uploadImage()`, maksimal 5. */
    media?: Array<{ url: string; kind: 'IMAGE' | 'VIDEO' }>;
  }
) =>
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
