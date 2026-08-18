import apiClient from './client';
import type { ApiResponse } from '../types';

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

export interface AdminDashboard {
  users: { total: number };
  sellers: { total: number; active: number; suspended: number };
  products: { total: number; active: number; inactive: number };
  needs: { total: number; completed: number };
  orders: { total: number; paid: number };
  revenue: {
    commissionPercent: number;

    gmv: number;

    platform: number;
  };

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

  pendingProducts: {
    total: number;
    items: { id: string; name: string; store: string }[];
  };
}

export const getDashboard = () =>
  apiClient.get<ApiResponse<AdminDashboard>>('/admin/dashboard');

export interface AdminAnalytics {
  windowDays: number;
  totals: { revenue: number; orders: number; activeUsers: number; conversionRate: number };
  changes: {
    revenue: number | null;
    orders: number | null;
    activeUsers: number | null;
    conversionRate: number | null;
  };
  revenueSeries: { month: string; revenue: number }[];
  topCategories: { name: string; revenue: number; percentage: number }[];
  topStores: { name: string; sales: number; growth: number | null }[];
  ordersByStatus: { status: OrderStatus; count: number; percentage: number }[];
}

export const getAnalytics = () =>
  apiClient.get<ApiResponse<AdminAnalytics>>('/admin/analytics');

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

export interface AdminStore {
  id: string;
  storeName: string;
  owner: string;
  ownerEmail: string;
  products: number;
  orders: number;

  revenue: number;

  commission: number;

  netRevenue: number;
  rating: number;
  status: SellerStatus;

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

export const setStoreStatus = (sellerId: string, status: SellerStatus, reason?: string) =>
  apiClient.patch<ApiResponse<{ changed: boolean }>>(`/admin/sellers/${sellerId}/status`, {
    status,
    ...(reason ? { reason } : {}),
  });


export type OrderStatus =
  | 'WAITING_PAYMENT'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'CANCELLED';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'EXPIRED' | 'REFUNDED';

export interface AdminOrder {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  subtotal: string;
  shippingCost: string;
  total: string;
  createdAt: string;
  user: { id: string; name: string; email: string };
  seller: { id: string; storeName: string };
  items: { id: string; productName: string; quantity: number; subtotal: string }[];
  payment: { id: string; status: PaymentStatus; method: string | null; paidAt: string | null } | null;
}

export const getOrders = (params: {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  page?: number;
  limit?: number;
}) => apiClient.get<Paginated<AdminOrder>>('/admin/orders', { params });


export interface AdminProduct {
  id: string;
  name: string;
  sku: string | null;
  price: string;
  stock: number;
  isActive: boolean;
  createdAt: string;
  category: { id: string; name: string };
  seller: { id: string; storeName: string };
}

export const getProducts = (params: {
  isActive?: boolean;
  categoryId?: string;
  sellerId?: string;
  q?: string;
  page?: number;
  limit?: number;
}) => apiClient.get<Paginated<AdminProduct>>('/admin/products', { params });

export const setProductActive = (productId: string, isActive: boolean, reason?: string) =>
  apiClient.patch<ApiResponse<{ changed: boolean; isActive: boolean }>>(
    `/admin/products/${productId}/active`,
    { isActive, ...(reason ? { reason } : {}) }
  );


export interface AdminReview {
  id: string;
  rating: number;
  comment: string | null;
  isHidden: boolean;
  createdAt: string;
  user: { id: string; name: string };
  product: {
    id: string;
    name: string;
    category: { name: string };
    seller: { storeName: string };
  };
}

export const getReviews = (params: {
  isHidden?: boolean;
  rating?: number;
  page?: number;
  limit?: number;
}) => apiClient.get<Paginated<AdminReview>>('/admin/reviews', { params });

export const setReviewHidden = (reviewId: string, isHidden: boolean, reason?: string) =>
  apiClient.patch<ApiResponse<{ changed: boolean; isHidden: boolean }>>(
    `/admin/reviews/${reviewId}/hidden`,
    { isHidden, ...(reason ? { reason } : {}) }
  );


export type PaymentMethod = 'MIDTRANS' | 'COD';

export interface AdminPayment {
  id: string;
  status: PaymentStatus;
  method: string | null;
  midtransOrderId: string;
  midtransTransactionId: string | null;
  paidAt: string | null;
  createdAt: string;
  order: {
    id: string;
    orderNumber: string;
    total: string;
    user: { id: string; name: string; email: string };
    seller: { storeName: string };
  };
}

export const getPayments = (params: {
  status?: PaymentStatus;
  method?: PaymentMethod;
  page?: number;
  limit?: number;
}) => apiClient.get<Paginated<AdminPayment>>('/admin/payments', { params });


export type CouponType = 'PERCENT' | 'FIXED' | 'FREE_SHIPPING';
export type CouponCategory = 'SHIPPING' | 'CASHBACK' | 'DISCOUNT';

export interface AdminCoupon {
  id: string;
  code: string;
  title: string;
  description: string | null;
  type: CouponType;
  category: CouponCategory;
  value: string;
  minSpend: string;
  maxDiscount: string | null;
  quota: number | null;
  usedCount: number;
  startsAt: string | null;
  expiresAt: string | null;
  isActive: boolean;
  isReward: boolean;
  createdAt: string;
  _count: { claims: number };
}

export const getCoupons = (params: { isActive?: boolean; page?: number; limit?: number }) =>
  apiClient.get<Paginated<AdminCoupon>>('/admin/coupons', { params });

export interface CreateCouponPayload {
  code: string;
  title: string;
  description?: string | null;
  type: CouponType;
  category?: CouponCategory;
  value: number;
  minSpend?: number;
  maxDiscount?: number | null;
  quota?: number | null;
  startsAt?: string | null;
  expiresAt?: string | null;
  isActive?: boolean;
}

export const createCoupon = (data: CreateCouponPayload) =>
  apiClient.post<ApiResponse<AdminCoupon>>('/admin/coupons', data);

export const updateCoupon = (id: string, data: Partial<Omit<CreateCouponPayload, 'code'>>) =>
  apiClient.patch<ApiResponse<AdminCoupon>>(`/admin/coupons/${id}`, data);


export type WithdrawalStatus = 'PENDING' | 'SUCCESS' | 'FAILED';

export interface AdminWithdrawal {
  id: string;
  status: WithdrawalStatus;
  amount: string;
  balanceAfter: string | null;
  note: string | null;
  bankName: string | null;
  bankAccount: string | null;
  bankAccountName: string | null;
  handledAt: string | null;
  createdAt: string;
  wallet: {
    user: {
      id: string;
      name: string;
      email: string;
      seller: { id: string; storeName: string } | null;
    };
  };
}

export const getWithdrawals = (params: {
  status?: WithdrawalStatus;
  page?: number;
  limit?: number;
}) => apiClient.get<Paginated<AdminWithdrawal>>('/admin/withdrawals', { params });

export const decideWithdrawal = (id: string, action: 'APPROVE' | 'REJECT', reason?: string) =>
  apiClient.patch<ApiResponse<AdminWithdrawal>>(`/admin/withdrawals/${id}`, {
    action,
    ...(reason ? { reason } : {}),
  });


export type ReportTargetType = 'PRODUCT' | 'SELLER' | 'REVIEW';
export type ReportPriority = 'LOW' | 'MEDIUM' | 'HIGH';
export type ReportStatus = 'OPEN' | 'INVESTIGATING' | 'RESOLVED';

export interface AdminReport {
  id: string;
  targetType: ReportTargetType;
  targetId: string;
  targetLabel: string;
  reason: string;
  description: string | null;
  priority: ReportPriority;
  status: ReportStatus;
  resolution: string | null;
  resolvedAt: string | null;
  createdAt: string;
  reporter: { id: string; name: string; email: string };
}

export const getReports = (params: {
  status?: ReportStatus;
  priority?: ReportPriority;
  targetType?: ReportTargetType;
  page?: number;
  limit?: number;
}) => apiClient.get<Paginated<AdminReport>>('/admin/reports', { params });

export const updateReport = (
  id: string,
  data: { status?: ReportStatus; priority?: ReportPriority; resolution?: string }
) => apiClient.patch<ApiResponse<AdminReport>>(`/admin/reports/${id}`, data);


export const CONFIG_KEYS = {
  MARKETPLACE_NAME: 'MARKETPLACE_NAME',
  MARKETPLACE_DESCRIPTION: 'MARKETPLACE_DESCRIPTION',
  BRAND_LOGO_URL: 'BRAND_LOGO_URL',
  BRAND_FAVICON_URL: 'BRAND_FAVICON_URL',
  TIMEZONE: 'MARKETPLACE_TIMEZONE',
} as const;

export type ConfigKey = (typeof CONFIG_KEYS)[keyof typeof CONFIG_KEYS];

export interface AdminConfigs {
  simulatedPaymentGateway: boolean;
  configs: Record<string, string>;
}

export const getConfigs = () => apiClient.get<ApiResponse<AdminConfigs>>('/admin/configs');

export const setConfig = (key: ConfigKey, value: string) =>
  apiClient.post<ApiResponse<{ success: boolean }>>('/admin/configs', { key, value });

export const setConfigs = async (entries: Partial<Record<ConfigKey, string>>) => {
  for (const [key, value] of Object.entries(entries)) {
    await setConfig(key as ConfigKey, value ?? '');
  }
};

export const getPublicSettings = () =>
  apiClient.get<ApiResponse<Record<string, string>>>('/public/settings');
