// src/api/reports.ts
import apiClient from './client';
import type { ApiResponse } from '../types';

export type ReportTargetType = 'PRODUCT' | 'SELLER' | 'REVIEW';

export interface CreateReportPayload {
  targetType: ReportTargetType;
  targetId: string;
  reason: string;
  description?: string;
}

export interface Report {
  id: string;
  targetType: ReportTargetType;
  targetId: string;
  targetLabel: string;
  reason: string;
  description: string | null;
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED';
  createdAt: string;
}

/**
 * POST /reports — laporkan produk, toko, atau ulasan ke admin.
 *
 * Prioritas tidak dikirim dari sini: kalau pelapor yang menentukan, semua
 * laporan jadi HIGH. Admin yang menaikkannya.
 */
export const createReport = async (payload: CreateReportPayload): Promise<Report> => {
  const res = await apiClient.post<ApiResponse<Report>>('/reports', payload);
  return res.data.data;
};
