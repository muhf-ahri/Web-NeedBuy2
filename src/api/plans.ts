import apiClient from './client';
import type { ApiResponse, PaginatedResponse } from '../types';
import type { Product } from '../types';

// ─── Types ─────────────────────────────────────────────────────────────────────
export interface ShoppingPlanItem {
  id: string;
  quantity: number;
  priceAtAdd: string;
  subtotal: string;
  isReplaced: boolean;
  product: Product;
}

export interface ShoppingPlan {
  id: string;
  needId: string | null;
  budget: string;
  total: string;
  remaining: string;
  status: 'DRAFT' | 'READY' | 'NEEDS_ADJUSTMENT';
  items: ShoppingPlanItem[];
}

export interface ShoppingPlanSummary {
  id: string;
  needId: string | null;
  budget: string;
  total: string;
  remaining: string;
  status: 'DRAFT' | 'READY' | 'NEEDS_ADJUSTMENT';
  _count: { items: number };
}

export interface Alternative {
  originalItemId: string;
  originalProductId: string;
  alternatives: Array<{
    productId: string;
    name: string;
    price: string;
    rating: string;
  }>;
}

export interface AddToCartResult {
  added: number;
  failed: Array<{
    productId: string;
    reason: string;
  }>;
}

// ─── Shopping Plan Endpoints ────────────────────────────────────────────────────

export interface GetPlansParams {
  status?: ShoppingPlan['status'];
  page?: number;
  limit?: number;
}

/** GET /shopping-plans - Get user's shopping plans */
export const getPlans = async (params?: GetPlansParams): Promise<PaginatedResponse<ShoppingPlanSummary>> => {
  const res = await apiClient.get<ApiResponse<PaginatedResponse<ShoppingPlanSummary>>>('/shopping-plans', { params });
  // Backend returns { success, data: [...], meta } → normalize to { data: [...], meta }
  return { data: res.data.data as unknown as ShoppingPlanSummary[], meta: (res.data as any).meta };
};

/** GET /shopping-plans/:id - Get shopping plan detail */
export const getPlan = (id: string) =>
  apiClient.get<ApiResponse<ShoppingPlan>>(`/shopping-plans/${id}`);

/** POST /shopping-plans - Create shopping plan */
export const createPlan = (data: {
  budget: number;
  needId?: string;
  fromRecommendations?: boolean;
  maxItems?: number;
}) => apiClient.post<ApiResponse<ShoppingPlan>>('/shopping-plans', data);

/** PATCH /shopping-plans/:id - Update plan budget */
export const updatePlan = (id: string, budget: number) =>
  apiClient.patch<ApiResponse<ShoppingPlan>>(`/shopping-plans/${id}`, { budget });

/** DELETE /shopping-plans/:id - Delete shopping plan */
export const deletePlan = (id: string) =>
  apiClient.delete(`/shopping-plans/${id}`);

// ─── Plan Items ────────────────────────────────────────────────────────────────

/** POST /shopping-plans/:id/items - Add item to plan */
export const addItemToPlan = (id: string, productId: string, quantity?: number) =>
  apiClient.post<ApiResponse<ShoppingPlan>>(`/shopping-plans/${id}/items`, { productId, quantity });

/** PATCH /shopping-plans/:id/items/:itemId - Update item quantity */
export const updatePlanItem = (id: string, itemId: string, quantity: number) =>
  apiClient.patch<ApiResponse<ShoppingPlan>>(`/shopping-plans/${id}/items/${itemId}`, { quantity });

/** DELETE /shopping-plans/:id/items/:itemId - Remove item from plan */
export const removePlanItem = (id: string, itemId: string) =>
  apiClient.delete(`/shopping-plans/${id}/items/${itemId}`);

/** PUT /shopping-plans/:id/items/:itemId/replace - Replace product in plan */
export const replacePlanItem = (id: string, itemId: string, productId: string, quantity?: number) =>
  apiClient.put<ApiResponse<ShoppingPlan>>(`/shopping-plans/${id}/items/${itemId}/replace`, {
    productId,
    quantity
  });

// ─── Alternatives & Add to Cart ─────────────────────────────────────────────────

/** GET /shopping-plans/:id/alternatives - Get cheaper alternatives for over-budget items */
export const getPlanAlternatives = (id: string) =>
  apiClient.get<ApiResponse<Alternative[]>>(`/shopping-plans/${id}/alternatives`);

/** POST /shopping-plans/:id/add-to-cart - Add all plan items to cart */
export const addPlanToCart = (id: string) =>
  apiClient.post<ApiResponse<AddToCartResult>>(`/shopping-plans/${id}/add-to-cart`);
