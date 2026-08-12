import apiClient from './client';
import type { ApiResponse } from '../types';

export type CouponType = 'PERCENT' | 'FIXED';

export interface Coupon {
  id: string;
  code: string;
  title: string;
  description: string | null;
  type: CouponType;
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

/** Potongan yang didapat kalau kupon dipakai untuk belanja `subtotal`. */
export const couponDiscount = (coupon: Coupon, subtotal: number): number => {
  if (subtotal < Number(coupon.minSpend)) return 0;
  const raw =
    coupon.type === 'PERCENT' ? (subtotal * Number(coupon.value)) / 100 : Number(coupon.value);
  const capped = coupon.maxDiscount ? Math.min(raw, Number(coupon.maxDiscount)) : raw;
  return Math.min(Math.round(capped), subtotal);
};
