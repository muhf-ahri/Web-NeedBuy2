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
  /** Selisih poin persen, bukan pertumbuhan relatif. */
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

/** GET /analytics/shop/conversion — konversi kunjungan → order untuk toko sendiri */
export const getShopConversion = (period: DashboardPeriod = 'month') =>
  apiClient.get<ApiResponse<ShopConversion>>('/analytics/shop/conversion', { params: { period } });

/** GET /analytics/shop/top-products — produk terlaris pada rentang waktu terpilih */
export const getShopTopProducts = (period: DashboardPeriod = 'month', limit = 5) =>
  apiClient.get<ApiResponse<TopProduct[]>>('/analytics/shop/top-products', {
    params: { period, limit },
  });

/** GET /analytics/shop/insights — observasi berbasis aturan (deterministik, bukan LLM) */
export const getShopInsights = (period: DashboardPeriod = 'month') =>
  apiClient.get<ApiResponse<ShopInsights>>('/analytics/shop/insights', { params: { period } });
