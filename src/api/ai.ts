import apiClient from './client';
import type { ApiResponse } from '../types';

export interface AIRequirement {
  key: string;
  value: string;
  isHardRequirement: boolean;
}

export interface AIPreference {
  key: string;
  value: string;
  weight?: number;
}

export interface NeedInterpretation {
  interpretation: {
    goal: string | null;
    budget: number | null;
    location: string | null;
    category: string | null;
    requirements: AIRequirement[];
    preferences: AIPreference[];
  };
  needsClarification: boolean;
  clarificationQuestions: Array<{ field: string; question: string; context: string }>;
  confidenceScore: number;
  absurdityDetected: boolean;
  absurdityNotes: string[];
  issues: Array<{ message: string; suggestion?: string }>;
}

export interface GeneratedPlanItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  reason: string;
}

export interface GeneratedPlan {
  strategy: string;
  totalPrice: number;
  score: number;
  items: GeneratedPlanItem[];
}
export const interpretWithAI = (rawInput: string) =>
  apiClient.post<ApiResponse<NeedInterpretation>>('/ai/needs/interpret', { rawInput });

export const generatePlansWithAI = (payload: {
  need_id: string;
  budget: number;
  requirements?: AIRequirement[];
  preferences?: AIPreference[];
  products?: Array<{ id: string; name: string; price: number; rating: number | null }>;
}) => apiClient.post<ApiResponse<{ plans: GeneratedPlan[] }>>('/ai/plans/generate', payload);

export const getInsightsWithAI = (payload: {
  need_goal?: string;
  budget?: number;
  product_count?: number;
}) => apiClient.post<ApiResponse<{ insight: { summary: string; recommendationReason: string; confidenceScore: number } }>>('/ai/insights', payload);
