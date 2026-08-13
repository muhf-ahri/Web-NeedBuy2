import apiClient from './client';
import type { ApiResponse } from '../types';

export type CouponType = 'PERCENT' | 'FIXED' | 'FREE_SHIPPING';

/** Kategori tiket — menentukan warna kartunya. */
export type CouponCategory = 'SHIPPING' | 'CASHBACK' | 'DISCOUNT';

/**
 * Warna tiket per kategori. Ditaruh di client, bukan di database: hex itu
 * urusan tampilan, dan menyimpannya di server bikin ganti tema jadi migrasi
 * data.
 */
export const COUPON_SKIN: Record<
  CouponCategory,
  { stub: string; ink: string; edge: string; label: string }
> = {
  SHIPPING: { stub: '#e3f2ec', ink: '#0e7a5f', edge: '#b7ddcf', label: 'Gratis ongkir' },
  CASHBACK: { stub: '#efe7fb', ink: '#6b3fc7', edge: '#d6c6f2', label: 'Cashback' },
  DISCOUNT: { stub: '#fff0e9', ink: '#ff5a1f', edge: '#ffcbb5', label: 'Potongan' },
};

export interface Coupon {
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
  claimId: string | null;
  claimedAt: string | null;
  usedAt?: string | null;
  claimed: boolean;
  expired?: boolean;
  soldOut?: boolean;
}

export const getCoupons = (scope: 'available' | 'mine' = 'available') =>
  apiClient.get<ApiResponse<Coupon[]>>('/coupons', { params: { scope } });

export const claimCoupon = (id: string) =>
  apiClient.post<ApiResponse<Coupon>>(`/coupons/${id}/claim`);

export const claimCouponByCode = (code: string) =>
  apiClient.post<ApiResponse<Coupon>>('/coupons/claim', { code });

/**
 * Potongan yang didapat kalau kupon dipakai untuk belanja `subtotal`.
 *
 * Ini PERKIRAAN untuk ditampilkan saja. Angka yang benar-benar dipotong
 * dihitung ulang di server saat checkout — client tidak pernah mengirim nominal
 * potongan, cuma kode kuponnya.
 *
 * `shippingCost` wajib ikut karena kupon gratis ongkir memotong ongkir, bukan
 * harga barang.
 */
export const couponDiscount = (coupon: Coupon, subtotal: number, shippingCost = 0): number => {
  if (subtotal < Number(coupon.minSpend)) return 0;

  if (coupon.type === 'FREE_SHIPPING') return shippingCost;

  const raw =
    coupon.type === 'PERCENT' ? (subtotal * Number(coupon.value)) / 100 : Number(coupon.value);
  const capped = coupon.maxDiscount ? Math.min(raw, Number(coupon.maxDiscount)) : raw;
  return Math.min(Math.floor(capped), subtotal);
};
