import apiClient from './client';
import type { ApiResponse } from '../types';

// ─── Types ─────────────────────────────────────────────────────────────────────
export interface Seller {
  id: string;
  storeName: string;
  rating: string;
  status: 'ACTIVE' | 'SUSPENDED';
  createdAt: string;
  _count?: {
    products: number;
  };
}

// ─── Seller Endpoints ──────────────────────────────────────────────────────────

/** GET /sellers/:id - Get public seller profile */
export const getSeller = (id: string) =>
  apiClient.get<ApiResponse<Seller>>(`/sellers/${id}`);

/** POST /sellers - Register own store (buyer -> seller) */
export const createSellerStore = (storeName: string) =>
  apiClient.post<ApiResponse<Seller>>('/sellers', { storeName });

/** PATCH /sellers/me - Update own store name */
export const updateSellerStore = (storeName: string) =>
  apiClient.patch<ApiResponse<Seller>>('/sellers/me', { storeName });
