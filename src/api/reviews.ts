// src/api/reviews.ts
import apiClient from './client';
import type { ApiResponse } from '../types';

export interface ReviewMedia {
  id: string;
  url: string;
  kind: 'IMAGE' | 'VIDEO';
}

export interface ProductReview {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user?: { name: string } | null;
  media?: ReviewMedia[];
  /** Varian yang dibeli — bintang 3 pada model termurah beda arti. */
  orderItem?: { variant: string | null } | null;
}

/**
 * `average` dan `breakdown` dihitung server dari SELURUH ulasan produk, bukan
 * dari halaman yang sedang tampil, jadi bar sebaran bintangnya tidak berubah
 * saat pindah halaman.
 */
export interface ReviewMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  average: number;
  breakdown: Array<{ star: number; count: number }>;
}

/** GET /reviews/product/:id — ulasan sebuah produk (publik). */
export const getProductReviews = async (
  productId: string,
  params?: { page?: number; limit?: number }
): Promise<{ items: ProductReview[]; meta: ReviewMeta }> => {
  const res = await apiClient.get<ApiResponse<ProductReview[]> & { meta: ReviewMeta }>(
    `/reviews/product/${productId}`,
    { params }
  );
  return { items: res.data.data, meta: res.data.meta };
};
