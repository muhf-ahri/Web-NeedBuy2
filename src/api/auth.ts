import apiClient from './client';

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  phone?: string | null;
  role: 'BUYER' | 'SELLER' | 'ADMIN';
  authProvider: 'LOCAL' | 'GOOGLE';
  /** Null = email belum diverifikasi. */
  emailVerifiedAt?: string | null;
  createdAt: string;
}

export interface TokenPair {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

/**
 * Register selalu membuat akun BUYER — tidak ada pilihan role di sini lagi.
 * Untuk jadi penjual, user mendaftarkan tokonya dari halaman profil
 * (`createSellerStore` di api/sellers.ts), yang memang meminta data toko.
 */
export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SocialLoginPayload {
  provider: 'GOOGLE';
  idToken: string;
}

/**
 * Awal flow Google OAuth: browser diarahkan ke backend, backend yang
 * generate CSRF state lalu redirect ke consent screen Google. Tidak dipanggil
 * lewat apiClient karena ini navigasi penuh, bukan XHR — response-nya 302.
 */
export const googleAuthUrl = () => `${import.meta.env.VITE_API_BASE_URL}/auth/google`;

export const register = (data: RegisterPayload) =>
  apiClient.post<{ success: boolean; data: TokenPair }>('/auth/register', data);

export const login = (data: LoginPayload) =>
  apiClient.post<{ success: boolean; data: TokenPair }>('/auth/login', data);

export const socialLogin = (data: SocialLoginPayload) =>
  apiClient.post<{ success: boolean; data: TokenPair }>('/auth/social', data);

// ─── Verifikasi email & reset password ────────────────────────────────────────

/** Berhasil = langsung dapat sesi baru, jadi user nggak perlu login ulang. */
export const verifyEmail = (token: string) =>
  apiClient.post<{ success: boolean; data: TokenPair }>(`/auth/verify-email/${token}`);

export const resendVerification = () =>
  apiClient.post<{ success: boolean; data: { sent: boolean } }>('/auth/resend-verification');

/** Selalu sukses, termasuk buat email yang nggak terdaftar — biar nggak bisa dipakai ngecek akun. */
export const forgotPassword = (email: string) =>
  apiClient.post<{ success: boolean; data: { sent: boolean } }>('/auth/forgot-password', { email });

export const validateResetToken = (token: string) =>
  apiClient.post<{ success: boolean; data: { valid: boolean } }>(
    `/auth/validate-reset-token/${token}`
  );

export const resetPassword = (token: string, password: string, confirmPassword: string) =>
  apiClient.post<{ success: boolean; data: { reset: boolean } }>(
    `/auth/reset-password/${token}`,
    { password, confirmPassword }
  );

export const refreshToken = (refreshToken: string) =>
  apiClient.post<{ success: boolean; data: TokenPair }>('/auth/refresh', { refreshToken });

export const logout = (refreshToken: string) =>
  apiClient.post('/auth/logout', { refreshToken });

export const getCurrentUser = () =>
  apiClient.get<{ success: boolean; data: User }>('/auth/me');

export const getUserProfile = () =>
  apiClient.get<{
    success: boolean;
    data: User & {
      seller?: {
        id: string;
        storeName: string;
        rating: string;
        status: string;
      } | null;
      _count?: {
        orders: number;
        needs: number;
        addresses: number;
      };
    };
  }>('/users/me');

export const updateProfile = (data: { name?: string; phone?: string | null }) =>
  apiClient.patch<{ success: boolean; data: User }>('/users/me', data);

export const changePassword = (data: { currentPassword: string; newPassword: string }) =>
  apiClient.post<{
    success: boolean;
    data: { changed: boolean; revokedSessions: number; message: string };
  }>('/users/me/change-password', data);

const ACCESS_TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'user';

export const setAuthTokens = (tokens: TokenPair) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
  localStorage.setItem(USER_KEY, JSON.stringify(tokens.user));
};

/**
 * Redirect OAuth cuma membawa token — data user belum ikut. Token disimpan
 * duluan supaya `/auth/me` berikutnya sudah terkirim dengan Authorization.
 */
export const setSessionTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);
export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

export const getStoredUser = (): User | null => {
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

export const clearAuth = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};
