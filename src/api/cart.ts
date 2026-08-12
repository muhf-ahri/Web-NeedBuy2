import apiClient from './client';
import type { ApiResponse } from '../types';

// ─── Types ─────────────────────────────────────────────────────────────────────
export interface CartItem {
  id: string;
  quantity: number;
  priceAtAdd: string;
  subtotal: string;
  isReplaced: boolean;
  product: {
    id: string;
    name: string;
    slug: string;
    stock: number;
    images: Array<{ url: string; isPrimary: boolean }>;
    seller: {
      id: string;
      storeName: string;
    };
  };
}

export interface Cart {
  id: string;
  budget: string | null;
  subtotal: string;
  itemCount: number;
  items: CartItem[];
  budgetCheck: {
    overBudget: boolean;
    remaining: string;
    budgetPercentage: number;
  } | null;
  unavailableItems: Array<{
    cartItemId: string;
    productId: string;
    requested: number;
    available: number;
  }>;
}

export interface CartCount {
  unreadCount: number;
  totalQuantity: number;
}

// ─── Cart Endpoints ────────────────────────────────────────────────────────────

/** GET /cart - Get user's active cart */
export const getCart = () =>
  apiClient.get<ApiResponse<Cart>>('/cart');

/** DELETE /cart - Clear entire cart */
export const clearCart = () =>
  apiClient.delete('/cart');

/** GET /cart/count - Get item count in cart */
export const getCartCount = () =>
  apiClient.get<ApiResponse<CartCount>>('/cart/count');

/** PATCH /cart/budget - Set or remove cart budget */
export const setCartBudget = (budget: number | null) =>
  apiClient.patch<ApiResponse<Cart>>('/cart/budget', { budget });

// ─── Cart Items ────────────────────────────────────────────────────────────────

/** POST /cart/items - Add item to cart */
export const addToCart = (productId: string, quantity: number = 1) =>
  apiClient.post<ApiResponse<Cart>>('/cart/items', { productId, quantity });

/** PATCH /cart/items/:id - Update cart item quantity */
export const updateCartItem = (itemId: string, quantity: number) =>
  apiClient.patch<ApiResponse<Cart>>(`/cart/items/${itemId}`, { quantity });

/** DELETE /cart/items/:id - Remove item from cart */
export const removeFromCart = (itemId: string) =>
  apiClient.delete(`/cart/items/${itemId}`);
