// src/api/categories.ts
import apiClient from './client';
import type { ApiResponse, Category } from '../types';

export interface CreateCategoryRequest {
  name: string;
  slug?: string;
  parentId?: string;
}

export interface UpdateCategoryRequest {
  name?: string;
  slug?: string;
  parentId?: string;
}

export const getCategories = async (): Promise<Category[]> => {
  const res = await apiClient.get<ApiResponse<Category[]>>('/categories');
  return res.data.data;
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