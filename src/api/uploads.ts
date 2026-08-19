import apiClient from './client';
import type { ApiResponse } from '../types';

export const ACCEPTED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
export const ACCEPTED_VIDEO_TYPES = ['video/mp4', 'video/webm'];
export const MAX_IMAGE_BYTES = 20 * 1024 * 1024;
export const MAX_VIDEO_BYTES = 20 * 1024 * 1024;
const COMPRESS_ABOVE_BYTES = 1024 * 1024;
const MAX_EDGE_PX = 1600;
const JPEG_QUALITY = 0.82;

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Gambarnya nggak bisa dibaca.'));
    };
    image.src = url;
  });
}

export async function prepareImageForUpload(file: File): Promise<File> {
  if (file.type === 'image/gif') return file;
  if (file.size <= COMPRESS_ABOVE_BYTES) return file;

  try {
    const image = await loadImage(file);
    const scale = Math.min(1, MAX_EDGE_PX / Math.max(image.width, image.height));
    const width = Math.round(image.width * scale);
    const height = Math.round(image.height * scale);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    if (!context) return file;
    context.drawImage(image, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', JPEG_QUALITY)
    );
    if (!blob || blob.size >= file.size) return file;

    const name = file.name.replace(/\.[^.]+$/, '') + '.jpg';
    return new File([blob], name, { type: 'image/jpeg', lastModified: Date.now() });
  } catch {
    return file;
  }
}

export const uploadImage = (file: File) =>
  apiClient.post<ApiResponse<{ url: string; bytes: number; kind: 'IMAGE' | 'VIDEO' }>>(
    '/uploads/image',
    file,
    {
      headers: { 'Content-Type': file.type },
      timeout: 60_000,
    }
  );
