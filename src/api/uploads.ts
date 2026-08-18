import apiClient from './client';
import type { ApiResponse } from '../types';

export const ACCEPTED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];

export const ACCEPTED_VIDEO_TYPES = ['video/mp4', 'video/webm'];

export const MAX_IMAGE_BYTES = 3 * 1024 * 1024;

export const MAX_VIDEO_BYTES = 20 * 1024 * 1024;

export const uploadImage = (file: File) =>
  apiClient.post<ApiResponse<{ url: string; bytes: number; kind: 'IMAGE' | 'VIDEO' }>>(
    '/uploads/image',
    file,
    {
      headers: { 'Content-Type': file.type },
      timeout: 60_000,
    }
  );
