import apiClient from './client';
import type { ApiResponse, Product, PaginatedResponse, ProductDetail } from '../types';

export interface GetProductsParams {
  page?: number;
  limit?: number;
  // categorySlug goes in URL path, not here
  q?: string;
  /**
   * Filter kategori jamak, slug dipisah koma. Turunannya dimekarkan di server
   * (produk cuma menempel di kategori daun).
   *
   * Dikirim ke server, bukan disaring di client, karena paginasinya server-side
   * — filter client cuma menyaring halaman berjalan sementara jumlah halamannya
   * masih menghitung seluruh katalog.
   */
  categorySlugs?: string;
  /** Filter kondisi barang, dipisah koma. Alasannya sama dengan categorySlugs. */
  conditions?: string;
  /** Batasi ke produk satu toko — dipakai saat membuka toko dari hasil pencarian. */
  sellerId?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'rating' | 'sold';
  onSale?: boolean;
}

export const getProducts = async (params?: GetProductsParams): Promise<PaginatedResponse<Product>> => {
  const res = await apiClient.get<ApiResponse<PaginatedResponse<Product>>>('/products', { params });
  // Backend returns { success, data: [...], meta } → normalize to { data: [...], meta }
  return { data: res.data.data as unknown as Product[], meta: (res.data as any).meta };
};

export const getProductBySlug = async (slug: string): Promise<ProductDetail> => {
  const res = await apiClient.get<ApiResponse<ProductDetail>>(`/products/${slug}`);
  return res.data.data;
};

export const getProductsByCategory = async (
  categorySlug: string,
  params?: Omit<GetProductsParams, 'categorySlug'>
): Promise<PaginatedResponse<Product>> => {
  const res = await apiClient.get<ApiResponse<PaginatedResponse<Product>>>(`/products/category/${categorySlug}`, { params });
  // Backend returns { success, data: [...], meta } → normalize to { data: [...], meta }
  return { data: res.data.data as unknown as Product[], meta: (res.data as any).meta };
};

/**
 * POST /products/:id/view — catat satu kunjungan produk.
 * Sumber data card "Product Views" di dashboard seller. Boleh dipanggil tanpa
 * login; kalau ada token, pengunjungnya ikut tercatat sebagai unique visitor.
 */
export const recordProductView = (id: string) =>
  apiClient.post<ApiResponse<{ recorded: boolean }>>(`/products/${id}/view`);
