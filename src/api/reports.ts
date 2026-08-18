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

export const createReport = async (payload: CreateReportPayload): Promise<Report> => {
  const res = await apiClient.post<ApiResponse<Report>>('/reports', payload);
  return res.data.data;
};
