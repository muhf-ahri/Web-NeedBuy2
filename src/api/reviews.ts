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
  
  orderItem?: { variant: string | null } | null;
}

export interface ReviewMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  average: number;
  breakdown: Array<{ star: number; count: number }>;
}

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
