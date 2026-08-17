import apiClient from './client';
import type { ApiResponse } from '../types';

export type TrackingStage =
  | 'PACKING'
  | 'PICKED_UP'
  | 'IN_TRANSIT'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'RETURNED'
  | 'CANCELLED';

export interface TrackingEvent {
  id: string;
  stage: TrackingStage;
  description: string;
  location: string | null;

  createdById: string | null;
  createdAt: string;
}

export interface OrderTracking {
  orderId: string;
  orderNumber: string;
  orderStatus: string;
  storeName: string;
  destination: string;

  currentStage: TrackingStage | null;

  finished: boolean;
  stageOrder: TrackingStage[];
  events: TrackingEvent[];
}

export const STAGE_LABEL: Record<TrackingStage, string> = {
  PACKING: 'Disiapkan',
  PICKED_UP: 'Dijemput kurir',
  IN_TRANSIT: 'Dalam perjalanan',
  OUT_FOR_DELIVERY: 'Diantar ke alamat',
  DELIVERED: 'Sampai tujuan',
  RETURNED: 'Dikembalikan',
  CANCELLED: 'Dibatalkan',
};

export const getTracking = async (orderId: string): Promise<OrderTracking> => {
  const res = await apiClient.get<ApiResponse<OrderTracking>>(`/orders/${orderId}/tracking`);
  return res.data.data;
};

export const addTracking = async (
  orderId: string,
  body: { stage: TrackingStage; description: string; location?: string }
): Promise<TrackingEvent> => {
  const res = await apiClient.post<ApiResponse<TrackingEvent>>(`/orders/${orderId}/tracking`, body);
  return res.data.data;
};
