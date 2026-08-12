import apiClient from './client';
import type { ApiResponse } from '../types';

export type DashboardPeriod = 'day' | 'week' | 'month' | 'year';

export interface TotalSales {
  period: DashboardPeriod;
  value: number;
  formatted: string;
  periodValue: number;
  periodFormatted: string;
  orderCount: number;
  periodOrderCount: number;
  growthPercentage: number;
}

export interface PendingOrders {
  value: number;
  breakdown: { waitingPayment: number; processing: number };
}

export interface CustomerRating {
  value: number;
  scale: number;
  reviewCount: number;
  distribution: Record<string, number>;
}

export interface ProductViews {
  period: DashboardPeriod;
  value: number;
  uniqueVisitors: number;
  growthPercentage: number;
  dateRange: { startDate: string; endDate: string };
}

export interface SalesPoint {
  bucket: string;
  items: number;
  orders: number;
  revenue: number;
}

export interface SalesPerformance {
  period: DashboardPeriod;
  granularity: 'hour' | 'day' | 'month';
  dateRange: { startDate: string; endDate: string };
  totals: { items: number; orders: number; revenue: number };
  points: SalesPoint[];
}

export interface InventoryAlerts {
  threshold: number;
  outOfStockCount: number;
  lowStockCount: number;
  items: {
    productId: string;
    productName: string;
    slug: string;
    stock: number;
    price: number;
    level: 'LOW_STOCK' | 'OUT_OF_STOCK';
  }[];
}

export interface ActiveOrders {
  value: number;
  items: {
    orderId: string;
    orderNumber: string;
    customer: string;
    amount: number;
    status: string;
    statusLabel: string;
    orderType: string | null;
    itemCount: number;
    products: string[];
    createdAt: string;
  }[];
}

// Satu endpoint per card: card yang lambat atau gagal tidak menahan card lain.

export const getTotalSales = (period?: DashboardPeriod) =>
  apiClient.get<ApiResponse<TotalSales>>('/dashboard/total-sales', { params: { period } });

export const getPendingOrders = () =>
  apiClient.get<ApiResponse<PendingOrders>>('/dashboard/pending-orders');

export const getCustomerRating = () =>
  apiClient.get<ApiResponse<CustomerRating>>('/dashboard/customer-rating');

export const getProductViews = (period: DashboardPeriod = 'week') =>
  apiClient.get<ApiResponse<ProductViews>>('/dashboard/product-views', { params: { period } });

export const getSalesPerformance = (period: DashboardPeriod = 'week') =>
  apiClient.get<ApiResponse<SalesPerformance>>('/dashboard/sales-performance', {
    params: { period },
  });

export const getInventoryAlerts = (params?: { threshold?: number; limit?: number }) =>
  apiClient.get<ApiResponse<InventoryAlerts>>('/dashboard/inventory-alerts', { params });

export const getActiveOrders = (limit?: number) =>
  apiClient.get<ApiResponse<ActiveOrders>>('/dashboard/active-orders', { params: { limit } });
