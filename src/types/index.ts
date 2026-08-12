// src/types/index.ts

// ─── API Response wrapper ──────────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  requestId?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    fields?: { path: string; message: string }[];
  };
  requestId?: string;
}

// ─── Category ──────────────────────────────────────────────────────────────────
export interface Category {
  id: string;         // UUID dari backend
  name: string;
  slug: string;
  parentId?: string | null;
  children?: Category[];
  description?: string;
}

// ─── Product (from backend API) ───────────────────────────────────────
export interface Product {
  id: string;
  name: string;
  slug: string;
  price: string; // API returns string
  stock: number;
  rating: string; // API returns string
  soldCount: number;
  /** 0 = tidak sedang promo. Harga coret = price / (1 - discountPercent/100). */
  discountPercent: number;
  /** Diskon grosir: minimal beli agar potongannya berlaku. null = tidak ada penawaran. */
  bulkMinQty: number | null;
  /** Potongan grosir dalam persen. Selalu sepasang dengan bulkMinQty. */
  bulkDiscountPercent: number | null;
  /** Hanya ada di response list. Produk tanpa atribut `kondisi` dikirim sebagai "Baru". */
  condition?: string;
  isActive: boolean;
  createdAt: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  seller: {
    id: string;
    storeName: string;
    rating: string;
    status: string;
  };
  images: Array<{
    url: string;
    isPrimary: boolean;
    sortOrder: number;
  }>;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Additional product detail fields (from /products/:slug)
export interface ProductAttribute {
  id: string;
  attrKey: string;
  attrValue: string;
}

/** Profil toko di halaman produk — lebih lengkap dari `Product['seller']`. */
export interface ProductDetailSeller {
  id: string;
  storeName: string;
  rating: string;
  status: string;
  logoUrl: string | null;
  description: string | null;
  address: string | null;
  vacationMode: boolean;
  createdAt: string;
  following: boolean;
  _count?: { products: number; followers: number };
}

export interface ProductDetail extends Omit<Product, 'seller'> {
  description: string | null;
  attributes: ProductAttribute[];
  reviewCount: number;
  seller: ProductDetailSeller;
  _count?: { reviews: number };
}
