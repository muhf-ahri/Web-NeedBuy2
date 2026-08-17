import apiClient from './client';
import type { ApiResponse } from '../types';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;

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

export interface GetOrdersParams {
  status?: OrderStatus;
  q?: string;
  page?: number;
  limit?: number;
}

export const getOrders = (params?: GetOrdersParams) =>
  apiClient.get<ApiResponse<Order[]>>('/orders', { params });

export const getOrder = (id: string) =>
  apiClient.get<ApiResponse<Order>>(`/orders/${id}`);

export const getSellerOrders = async (
  params?: GetOrdersParams
): Promise<{ items: SellerOrder[]; meta: OrdersMeta }> => {
  const res = await apiClient.get<ApiResponse<SellerOrder[]> & { meta: OrdersMeta }>(
    '/sellers/me/orders',
    { params }
  );
  return { items: res.data.data, meta: res.data.meta };
};

export const getSellerOrder = (id: string) =>
  apiClient.get<ApiResponse<SellerOrder>>(`/sellers/me/orders/${id}`);

export const updateOrderStatus = (id: string, status: 'SHIPPED' | 'DELIVERED' | 'COMPLETED') =>
  apiClient.patch<ApiResponse<Order>>(`/orders/${id}/status`, { status });

export const cancelOrder = (id: string, idempotencyKey: string) =>
  apiClient.post(`/orders/${id}/cancel`, {}, {
    headers: { 'Idempotency-Key': idempotencyKey }
  });

export const createReview = (
  orderId: string,
  itemId: string,
  data: {
    rating: number;
    comment?: string;
    media?: Array<{ url: string; kind: 'IMAGE' | 'VIDEO' }>;
  }
) =>
  apiClient.post<ApiResponse<Review>>(`/orders/${orderId}/items/${itemId}/review`, data);


export const getAddresses = () =>
  apiClient.get<ApiResponse<Address[]>>('/addresses');

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

export const deleteAddress = (id: string) =>
  apiClient.delete(`/addresses/${id}`);
