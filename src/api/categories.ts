import apiClient from './client';
import type { ApiResponse, Category } from '../types';

export interface CreateCategoryRequest {
  name: string;
  slug?: string;
  description?: string | null;
  isActive?: boolean;
  parentId?: string | null;
}

export interface UpdateCategoryRequest {
  name?: string;
  slug?: string;
  description?: string | null;
  isActive?: boolean;
  parentId?: string | null;
}

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  parentId: string | null;
  createdAt: string;
  _count: { products: number; children: number };
}

export const getAdminCategories = async (): Promise<AdminCategory[]> => {
  const res = await apiClient.get<ApiResponse<AdminCategory[]>>('/categories/admin/all');
  return Array.isArray(res.data?.data) ? res.data.data : [];
};

export const getCategories = async (): Promise<Category[]> => {
  const res = await apiClient.get<ApiResponse<Category[]>>('/categories');
  return Array.isArray(res.data?.data) ? res.data.data : [];
};

export const createCategory = async (data: CreateCategoryRequest): Promise<Category> => {
  const res = await apiClient.post<ApiResponse<Category>>('/categories', data);
  return res.data.data;
};

export const getCategoryBySlug = async (slug: string): Promise<Category> => {
  const res = await apiClient.get<ApiResponse<Category>>(`/categories/${slug}`);
  return res.data.data;
};

export const updateCategory = async (id: string, data: UpdateCategoryRequest): Promise<Category> => {
  const res = await apiClient.patch<ApiResponse<Category>>(`/categories/${id}`, data);
  return res.data.data;
};

export const deleteCategory = async (id: string): Promise<void> => {
  await apiClient.delete<ApiResponse<null>>(`/categories/${id}`);
};