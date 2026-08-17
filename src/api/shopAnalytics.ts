import apiClient from './client';
import type { ApiResponse } from '../types';
import type { DashboardPeriod } from './dashboard';

export interface ShopConversion {
  period: DashboardPeriod;
  dateRange: { startDate: string; endDate: string };
  views: number;
  orders: number;
  conversionRate: number;
  previous: { views: number; orders: number; conversionRate: number };
  
  changePoint: number;
}

export interface TopProduct {
  rank: number;
  productId: string;
  productName: string;
  slug: string | null;
  stock: number;
  isActive: boolean;
  quantitySold: number;
  revenue: number;
}

export type InsightSeverity = 'critical' | 'warning' | 'positive' | 'info';

export interface ShopInsight {
  code: string;
  severity: InsightSeverity;
  message: string;
}

export interface ShopInsights {
  period: DashboardPeriod;
  dateRange: { startDate: string; endDate: string };
  insights: ShopInsight[];
}

export const getShopConversion = (period: DashboardPeriod = 'month') =>
  apiClient.get<ApiResponse<ShopConversion>>('/analytics/shop/conversion', { params: { period } });

export const getShopTopProducts = (period: DashboardPeriod = 'month', limit = 5) =>
  apiClient.get<ApiResponse<TopProduct[]>>('/analytics/shop/top-products', {
    params: { period, limit },
  });

export const getShopInsights = (period: DashboardPeriod = 'month') =>
  apiClient.get<ApiResponse<ShopInsights>>('/analytics/shop/insights', { params: { period } });
