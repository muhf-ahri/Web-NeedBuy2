import apiClient from './client';
import type { ApiResponse } from '../types';

export type CouponType = 'PERCENT' | 'FIXED' | 'FREE_SHIPPING';

export type CouponCategory = 'SHIPPING' | 'CASHBACK' | 'DISCOUNT';

export const COUPON_SKIN: Record<
  CouponCategory,
  { stub: string; ink: string; edge: string; label: string }
> = {
  SHIPPING: { stub: '#e6f4ee', ink: '#12805c', edge: '#e0e3e5', label: 'Gratis ongkir' },
  CASHBACK: { stub: '#dbe1ff', ink: '#004ac6', edge: '#e0e3e5', label: 'Cashback' },
  DISCOUNT: { stub: '#fff0e9', ink: '#ff5a1f', edge: '#e0e3e5', label: 'Potongan' },
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

export const couponDiscount = (coupon: Coupon, subtotal: number, shippingCost = 0): number => {
  if (subtotal < Number(coupon.minSpend)) return 0;

  if (coupon.type === 'FREE_SHIPPING') return shippingCost;

  const raw =
    coupon.type === 'PERCENT' ? (subtotal * Number(coupon.value)) / 100 : Number(coupon.value);
  const capped = coupon.maxDiscount ? Math.min(raw, Number(coupon.maxDiscount)) : raw;
  return Math.min(Math.floor(capped), subtotal);
};
