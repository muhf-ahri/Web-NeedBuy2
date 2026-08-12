import apiClient from './client';
import type { ApiResponse } from '../types';

/** Jenis yang diterima server (SVG sengaja tidak termasuk — vektor XSS). */
export const ACCEPTED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];

export const MAX_IMAGE_BYTES = 3 * 1024 * 1024;

/**
 * POST /uploads/image — kirim berkas MENTAH sebagai body, bukan multipart.
 *
 * Server memakai `express.raw()`, jadi tidak perlu FormData. Header
 * Content-Type dipakai server hanya sebagai penyaring kasar; jenis berkas yang
 * sebenarnya ditentukan dari magic bytes di sisi server.
 *
 * Timeout dinaikkan dari default 10 detik: unggahan beberapa MB lewat tunnel
 * ngrok gampang melewatinya, dan gagal karena timeout terlihat seperti berkas
 * ditolak padahal tidak.
 */
export const uploadImage = (file: File) =>
  apiClient.post<ApiResponse<{ url: string; bytes: number }>>('/uploads/image', file, {
    headers: { 'Content-Type': file.type },
    timeout: 60_000,
  });
