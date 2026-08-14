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

// ─── Analytics ─────────────────────────────────────────────────────────────────

/**
 * Semua angka di sini adalah jendela 30 hari terakhir dibanding 30 hari
 * sebelumnya. `changes` bernilai null kalau periode sebelumnya nol — jangan
 * ditampilkan sebagai 0%, itu klaim yang berbeda.
 */
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

// ─── Orders ────────────────────────────────────────────────────────────────────

export type OrderStatus =
  | 'WAITING_PAYMENT'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'CANCELLED';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'EXPIRED' | 'REFUNDED';

/**
 * Nilai uang datang sebagai string: backend menyimpannya `Decimal` dan
 * mengirim apa adanya supaya tidak ada pembulatan diam-diam di JSON.
 * Konversi ke number cuma dilakukan tepat sebelum diformat.
 */
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

// ─── Products ──────────────────────────────────────────────────────────────────

export interface AdminProduct {
  id: string;
  name: string;
  sku: string | null;
  price: string;
  stock: number;
  /** Skema ini nggak punya alur approval terpisah: belum aktif = antrean itu sendiri. */
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

/** Moderasi katalog lintas toko. `reason` ikut tercatat di audit log. */
export const setProductActive = (productId: string, isActive: boolean, reason?: string) =>
  apiClient.patch<ApiResponse<{ changed: boolean; isActive: boolean }>>(
    `/admin/products/${productId}/active`,
    { isActive, ...(reason ? { reason } : {}) }
  );

// ─── Reviews ───────────────────────────────────────────────────────────────────

export interface AdminReview {
  id: string;
  rating: number;
  comment: string | null;
  /** Disembunyikan, bukan dihapus — rating produk dihitung dari yang tampil. */
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

// ─── Payments ──────────────────────────────────────────────────────────────────

/** Cuma dua metode yang mungkin ada di skema ini: Snap Midtrans dan COD. */
export type PaymentMethod = 'MIDTRANS' | 'COD';

export interface AdminPayment {
  id: string;
  status: PaymentStatus;
  method: string | null;
  /** ID yang dikirim ke Midtrans — ini "ID transaksi" versi kita. */
  midtransOrderId: string;
  /** Diisi Midtrans setelah transaksi benar-benar dibuat; null untuk COD. */
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

// ─── Coupons ───────────────────────────────────────────────────────────────────

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

/** Kode kupon nggak bisa diubah setelah terbit — pembeli sudah memegangnya. */
export const updateCoupon = (id: string, data: Partial<Omit<CreateCouponPayload, 'code'>>) =>
  apiClient.patch<ApiResponse<AdminCoupon>>(`/admin/coupons/${id}`, data);

// ─── Withdrawals ───────────────────────────────────────────────────────────────

/**
 * Penarikan bukan tabel sendiri di backend — dia baris mutasi dompet bertipe
 * WITHDRAWAL, jadi statusnya memakai status transaksi dompet:
 * PENDING = menunggu admin, SUCCESS = dana sudah ditransfer, FAILED = ditolak
 * (saldo penjual sudah dikembalikan otomatis).
 */
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

/** APPROVE nggak menyentuh saldo — nominalnya sudah dipotong saat diajukan. */
export const decideWithdrawal = (id: string, action: 'APPROVE' | 'REJECT', reason?: string) =>
  apiClient.patch<ApiResponse<AdminWithdrawal>>(`/admin/withdrawals/${id}`, {
    action,
    ...(reason ? { reason } : {}),
  });

// ─── Reports ───────────────────────────────────────────────────────────────────

export type ReportTargetType = 'PRODUCT' | 'SELLER' | 'REVIEW';
export type ReportPriority = 'LOW' | 'MEDIUM' | 'HIGH';
export type ReportStatus = 'OPEN' | 'INVESTIGATING' | 'RESOLVED';

export interface AdminReport {
  id: string;
  targetType: ReportTargetType;
  targetId: string;
  /** Nama sasaran saat dilaporkan — snapshot, jadi tetap terbaca walau produknya dihapus. */
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

// ─── Configs ───────────────────────────────────────────────────────────────────

/** Key yang diterima backend. Bebas-bikin-key ditolak 422. */
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

/** Simpan beberapa key sekaligus. Backend hanya punya endpoint per-key. */
export const setConfigs = async (entries: Partial<Record<ConfigKey, string>>) => {
  for (const [key, value] of Object.entries(entries)) {
    await setConfig(key as ConfigKey, value ?? '');
  }
};

/** Branding publik — dipakai buat judul tab & favicon, tidak butuh login. */
export const getPublicSettings = () =>
  apiClient.get<ApiResponse<Record<string, string>>>('/public/settings');
