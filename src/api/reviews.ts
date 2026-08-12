import apiClient from './client';
import type { ApiResponse, PaginatedResponse } from '../types';

// ─── Types ─────────────────────────────────────────────────────────────────────
export interface ProductReview {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
  };
}

// ─── Review Endpoints ──────────────────────────────────────────────────────────

/** GET /reviews/product/:id - List reviews for a product */
export const getProductReviews = (productId: string, params?: { page?: number; limit?: number }) =>
  apiClient.get<ApiResponse<PaginatedResponse<ProductReview>>>(
    `/reviews/product/${productId}`,
    { params }
  );
