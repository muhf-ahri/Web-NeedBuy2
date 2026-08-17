import apiClient from './client';
import type { ApiResponse } from '../types';

export interface CartItem {
  id: string;
  quantity: number;

  variant: string | null;
  priceAtAdd: string;

  bulkDiscountPercent: number;
  subtotal: string;
  isReplaced: boolean;
  product: {
    id: string;
    name: string;
    slug: string;
    stock: number;
    images: Array<{ url: string; isPrimary: boolean }>;
    bulkMinQty?: number | null;
    bulkDiscountPercent?: number | null;
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

export const getCart = () =>
  apiClient.get<ApiResponse<Cart>>('/cart');

export const clearCart = () =>
  apiClient.delete('/cart');

export const getCartCount = () =>
  apiClient.get<ApiResponse<CartCount>>('/cart/count');

export const setCartBudget = (budget: number | null) =>
  apiClient.patch<ApiResponse<Cart>>('/cart/budget', { budget });

export const addToCart = (productId: string, quantity: number = 1, variant?: string | null) =>
  apiClient.post<ApiResponse<Cart>>('/cart/items', {
    productId,
    quantity,

    ...(variant ? { variant } : {}),
  });

export const updateCartItem = (itemId: string, quantity: number) =>
  apiClient.patch<ApiResponse<Cart>>(`/cart/items/${itemId}`, { quantity });

export const removeFromCart = (itemId: string) =>
  apiClient.delete(`/cart/items/${itemId}`);
