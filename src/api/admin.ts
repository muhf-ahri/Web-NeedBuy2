import apiClient from './client';
import type { ApiResponse } from '../types';

// Envelope admin selalu membawa `meta` untuk endpoint berhalaman — `ApiResponse`
// yang umum tidak punya field itu, jadi dilebarkan di sini saja.
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface Paginated<T> extends ApiResponse<T[]> {
  meta: PaginationMeta;
}

export type SellerStatus = 'ACTIVE' | 'SUSPENDED';

// ─── Dashboard ─────────────────────────────────────────────────────────────────

export interface AdminDashboard {
  users: { total: number };
  sellers: { total: number; active: number; suspended: number };
  products: { total: number; active: number; inactive: number };
  needs: { total: number; completed: number };
  orders: { total: number; paid: number };
  revenue: {
    /** Potongan platform per order yang dibayar, dari AdminConfig. */
    commissionPercent: number;
    /** Omzet kotor semua toko — uang yang berputar, bukan pendapatan aplikasi. */
    gmv: number;
    /** Bagian pemilik aplikasi. Ini yang tampil sebagai "Total Pendapatan". */
    platform: number;
  };
  /** `revenue` per bulan sudah berupa komisi platform; `gmv` omzet mentahnya. */
  revenueSeries: { month: string; gmv: number; revenue: number }[];
  topCategories: { name: string; revenue: number; percentage: number }[];
  recentOrders: {
    id: string;
    orderNumber: string;
    customer: string;
    store: string;
    amount: number;
    status: string;
    createdAt: string;
  }[];
  /** Listing yang belum diaktifkan. Skema belum punya alur approval terpisah. */
  pendingProducts: {
    total: number;
    items: { id: string; name: string; store: string }[];
  };
}

export const getDashboard = () =>
  apiClient.get<ApiResponse<AdminDashboard>>('/admin/dashboard');

// ─── Users ─────────────────────────────────────────────────────────────────────

export interface AdminUser {
  id: string;
  username: string;
  name: string;
  email: string;
  phone: string | null;
  role: 'BUYER' | 'SELLER' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
  totalOrders: number;
  totalSpent: number;
  seller: {
    id: string;
    storeName: string;
    status: SellerStatus;
    rating: number;
    products: number;
    orders: number;
    revenue: number;
  } | null;
}

export const getUsers = (params: {
  role?: 'BUYER' | 'SELLER' | 'ADMIN';
  q?: string;
  page?: number;
  limit?: number;
}) => apiClient.get<Paginated<AdminUser>>('/admin/users', { params });

// ─── Stores ────────────────────────────────────────────────────────────────────

export interface AdminStore {
  id: string;
  storeName: string;
  owner: string;
  ownerEmail: string;
  products: number;
  orders: number;
  /** Omzet kotor toko, sebelum potongan platform. */
  revenue: number;
  /** Potongan platform — dijumlahkan dari komisi yang dibekukan per order. */
  commission: number;
  /** Yang jadi hak penjual: revenue - commission. */
  netRevenue: number;
  rating: number;
  status: SellerStatus;
  /** Libur yang diatur penjual — bukan pembekuan oleh admin. */
  vacationMode: boolean;
  createdAt: string;
}

export const getStores = (params: {
  status?: SellerStatus;
  minRating?: number;
  q?: string;
  page?: number;
  limit?: number;
}) => apiClient.get<Paginated<AdminStore>>('/admin/stores', { params });

/** Bekukan atau aktifkan kembali toko. `reason` ikut tercatat di audit log. */
export const setStoreStatus = (sellerId: string, status: SellerStatus, reason?: string) =>
  apiClient.patch<ApiResponse<{ changed: boolean }>>(`/admin/sellers/${sellerId}/status`, {
    status,
    ...(reason ? { reason } : {}),
  });
