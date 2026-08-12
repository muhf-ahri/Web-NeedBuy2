import axios from 'axios';
import type { AxiosError, AxiosRequestConfig } from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
  timeout: 10_000,
});
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
  config.headers['Pragma'] = 'no-cache';
  config.headers['Expires'] = '0';
  return config;
});

let isRefreshing = false;
let pendingQueue: Array<(token: string | null) => void> = [];

const isAuthRoute = (url?: string) => {
  if (!url) return false;
  return url.includes('/auth/refresh') || url.includes('/auth/login') || url.includes('/auth/register');
};

const RETRYABLE_REFRESH = Symbol('retryableRefreshFailure');

async function tryRefreshToken(): Promise<string | null | typeof RETRYABLE_REFRESH> {
  const refresh = localStorage.getItem('refreshToken');
  if (!refresh) return null;
  try {
    const res = await apiClient.post('/auth/refresh', { refreshToken: refresh });
    const tokens = res.data?.data;
    if (!tokens?.accessToken) return null;
    localStorage.setItem('token', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    if (tokens.user) localStorage.setItem('user', JSON.stringify(tokens.user));
    return tokens.accessToken;
  } catch (err: any) {
    // Gagal sementara (rate limit, 5xx, jaringan) bukan alasan mencabut sesi —
    // refresh akan dicoba lagi pada request berikutnya.
    const status = err?.response?.status;
    if (!status || status === 429 || status >= 500) return RETRYABLE_REFRESH;
    return null;
  }
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as (AxiosRequestConfig & { _retry?: boolean }) | undefined;
    if (error.response?.status === 401 && original && !original._retry && !isAuthRoute(original.url)) {
      original._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push((token) => {
            if (token && original.headers) {
              original.headers.Authorization = `Bearer ${token}`;
              resolve(apiClient(original));
            } else {
              reject(error);
            }
          });
        });
      }

      isRefreshing = true;
      try {
        const token = await tryRefreshToken();
        if (typeof token === 'string' && original.headers) {
          original.headers.Authorization = `Bearer ${token}`;
          pendingQueue.forEach((cb) => cb(token));
          pendingQueue = [];
          return apiClient(original);
        }
        if (token === RETRYABLE_REFRESH) {
          pendingQueue.forEach((cb) => cb(null));
          pendingQueue = [];
          return Promise.reject(error);
        }
        clearAuthState();
        pendingQueue.forEach((cb) => cb(null));
        pendingQueue = [];
        return Promise.reject(error);
      } catch (refreshError) {
        clearAuthState();
        pendingQueue.forEach((cb) => cb(null));
        pendingQueue = [];
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    const data = error.response?.data as
      | { error?: { message?: string; fields?: { path: string; message: string }[] }; message?: string }
      | undefined;
    // Tidak ada response sama sekali = permintaan tidak pernah sampai ke server
    // (server mati, tunnel putus, atau preflight CORS gagal). Browser
    // melaporkannya sebagai "Network Error"/CORS, yang tidak berarti apa pun
    // bagi user — jadi diterjemahkan ke keadaan yang sebenarnya.
    const unreachable = !error.response && error.code !== 'ECONNABORTED';
    const message = unreachable
      ? 'Nggak bisa nyambung ke server. Pastiin server-nya nyala, terus coba lagi ya.'
      : data?.error?.message ||
        data?.message ||
        error.message ||
        'Waduh, ada yang error. Coba lagi ya.';
    const err = new Error(message);
    if (data?.error?.fields?.length) {
      (err as Error & { fields?: { path: string; message: string }[] }).fields = data.error.fields;
    }
    return Promise.reject(err);
  }
);

function clearAuthState() {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  window.dispatchEvent(new Event('auth:expired'));
}

export default apiClient;