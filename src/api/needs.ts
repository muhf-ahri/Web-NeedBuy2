import apiClient from './client';
import type { ApiResponse, PaginatedResponse } from '../types';

export interface Need {
  id: string;
  rawInput: string;
  goal: string | null;
  budget: string;
  location: string | null;
  status: 'DRAFT' | 'PROCESSING' | 'COMPLETED';
  createdAt: string;
}

export interface Requirement {
  id: string;
  requirementKey: string;
  requirementValue: string;
  isHardRequirement: boolean;
}

export interface Preference {
  id: string;
  preferenceKey: string;
  preferenceValue: string;
  weight: string;
}

export interface ClarificationQuestion {
  id: string;
  ordinal: number;
  field: 'budget' | 'category' | 'goal' | 'requirement';
  question: string;
  context: string | null;
  answer: string | null;
  answeredAt: string | null;
  createdAt: string;
}

export interface ClarificationItem {
  field: string;
  question: string;
  context: string | null;
}

export interface ParsedNeed {
  goal: string | null;
  budget: number | null;
  location: string | null;
  categoryId: string | null;
  categorySlug: string | null;
  requirements: Array<{ key: string; value: string; isHard: boolean }>;
  preferences: Array<{ key: string; value: string; weight: number }>;
  needsClarification: boolean;
  clarificationQuestions: ClarificationItem[];
}

export interface NeedDetail extends Need {
  requirements?: Requirement[];
  preferences?: Preference[];
}

export interface GetNeedsParams {
  status?: Need['status'];
  page?: number;
  limit?: number;
}

export const getNeeds = async (params?: GetNeedsParams): Promise<PaginatedResponse<Need>> => {
  const res = await apiClient.get<ApiResponse<PaginatedResponse<Need>>>('/needs', { params });
  // Backend returns { success, data: [...], meta } → normalize to { data: [...], meta }
  return { data: res.data.data as unknown as Need[], meta: (res.data as any).meta };
};

export const getNeed = (id: string) =>
  apiClient.get<ApiResponse<NeedDetail>>(`/needs/${id}`);

export const createNeed = (rawInput: string) =>
  apiClient.post<ApiResponse<{
    need: Need;
    interpreted: boolean;
    parsed: ParsedNeed;
    needsClarification: boolean;
    clarificationQuestions: ClarificationItem[];
  }>>('/needs', { rawInput });

export const updateNeed = (id: string, data: { goal?: string; budget?: number; location?: string }) =>
  apiClient.patch<ApiResponse<Need>>(`/needs/${id}`, data);

export const deleteNeed = (id: string) =>
  apiClient.delete(`/needs/${id}`);

export const addRequirement = (id: string, data: { key: string; value: string; isHard: boolean }) =>
  apiClient.post<ApiResponse<Requirement>>(`/needs/${id}/requirements`, data);

export const removeRequirement = (id: string, reqId: string) =>
  apiClient.delete(`/needs/${id}/requirements/${reqId}`);

export const addPreference = (id: string, data: { key: string; value: string; weight?: number }) =>
  apiClient.post<ApiResponse<Preference>>(`/needs/${id}/preferences`, data);

export const removePreference = (id: string, prefId: string) =>
  apiClient.delete(`/needs/${id}/preferences/${prefId}`);

export const confirmNeed = (id: string, data: {
  goal?: string;
  budget?: number;
  location?: string;
  categoryId?: string;
  requirements?: Array<{ key: string; value: string; isHard: boolean }>;
  preferences?: Array<{ key: string; value: string; weight?: number }>;
}) => apiClient.post(`/needs/${id}/confirm`, data);

export const processNeed = (id: string, categoryId?: string) =>
  apiClient.post<ApiResponse<{ total: number; evaluated: number }>>(`/needs/${id}/process`, { categoryId });

export const getClarifications = (id: string) =>
  apiClient.get<ApiResponse<{
    items: ClarificationQuestion[];
    nextQuestion: ClarificationQuestion | null;
    turnsUsed: number;
    turnsRemaining: number;
  }>>(`/needs/${id}/clarifications`);

export const clarifyNeed = (id: string, questionId: string, answer: string) =>
  apiClient.post<ApiResponse<{
    need: Need;
    nextQuestion: ClarificationQuestion | null;
    complete: boolean;
    turnsUsed: number;
    turnsRemaining: number;
    history: Array<{
      field: string;
      question: string;
      answer: string | null;
      answeredAt: string | null;
    }>;
  }>>(`/needs/${id}/clarify`, { questionId, answer });

export interface Recommendation {
  id: string;
  matchScore: string;
  categoryScore: string;
  budgetScore: string;
  requirementScore: string;
  preferenceScore: string;
  qualityScore: string;
  sellerScore: string;
  label: 'BEST_MATCH' | 'GOOD_MATCH' | 'ALTERNATIVE';
  ranking: number;
  explanation: string | null;
  product: {
    id: string;
    name: string;
    slug: string;
    price: string;
    stock: number;
    rating: string;
    images: Array<{ url: string; isPrimary: boolean }>;
    seller: { id: string; storeName: string; rating: string };
  };
}
export const getRecommendations = async (id: string, page?: number, limit?: number): Promise<PaginatedResponse<Recommendation>> => {
  const res = await apiClient.get<ApiResponse<PaginatedResponse<Recommendation>>>(`/needs/${id}/recommendations`, {
    params: { page, limit }
  });
  // Backend returns { success, data: [...], meta } → normalize to { data: [...], meta }
  return { data: res.data.data as unknown as Recommendation[], meta: (res.data as any).meta };
};