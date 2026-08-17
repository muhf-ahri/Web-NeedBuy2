import apiClient from './client';
import type { ApiResponse } from '../types';

export interface Seller {
  id: string;
  storeName: string;
  description: string | null;
  logoUrl: string | null;

  address: string | null;

  vacationMode: boolean;
  rating: string;
  status: 'ACTIVE' | 'SUSPENDED';
  createdAt: string;
  _count?: {
    products: number;
  };
}

export interface OwnSeller extends Seller {
  businessEmail: string | null;
  phone: string | null;
  updatedAt: string;
}

export interface CreateSellerPayload {
  storeName: string;
  address: string;
  phone: string;
  description?: string;
  logoUrl?: string;
  businessEmail?: string;
}

export interface UpdateSellerPayload {
  storeName?: string;
  description?: string | null;
  address?: string | null;
  phone?: string | null;
  logoUrl?: string | null;
  businessEmail?: string | null;
  vacationMode?: boolean;
}

export interface SellersMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const searchSellers = async (
  q: string,
  limit = 6
): Promise<{ items: Seller[]; meta: SellersMeta }> => {
  const res = await apiClient.get<ApiResponse<Seller[]> & { meta: SellersMeta }>('/sellers', {
    params: { q, limit },
  });
  return { items: res.data.data, meta: res.data.meta };
};

export const getSeller = (id: string) =>
  apiClient.get<ApiResponse<Seller>>(`/sellers/${id}`);

export const createSellerStore = (payload: CreateSellerPayload) =>
  apiClient.post<ApiResponse<OwnSeller>>('/sellers', payload);

export const getOwnSeller = () => apiClient.get<ApiResponse<OwnSeller>>('/sellers/me');

export const updateSellerStore = (payload: UpdateSellerPayload) =>
  apiClient.patch<ApiResponse<OwnSeller>>('/sellers/me', payload);

export interface FollowState {
  sellerId: string;
  following: boolean;
  followerCount: number;
}

export const followSeller = (sellerId: string) =>
  apiClient.post<ApiResponse<FollowState>>(`/sellers/${sellerId}/follow`);

export const unfollowSeller = (sellerId: string) =>
  apiClient.delete<ApiResponse<FollowState>>(`/sellers/${sellerId}/follow`);
