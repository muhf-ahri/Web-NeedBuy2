// src/utils/snap.ts
// Helper untuk integrasi Midtrans Snap (sandbox). Memuat script Snap.js sekali,
// lalu menampilkan popup pembayaran untuk token yang diberikan.

const CLIENT_KEY = import.meta.env.VITE_MIDTRANS_CLIENT_KEY as string | undefined;

let loadPromise: Promise<boolean> | null = null;

declare global {
  interface Window {
    snap?: {
      pay: (
        token: string,
        opts: {
          onSuccess?: (result: unknown) => void;
          onPending?: (result: unknown) => void;
          onError?: (result: unknown) => void;
          onClose?: () => void;
        }
      ) => void;
    };
  }
}

export function loadSnap(): Promise<boolean> {
  if (window.snap) return Promise.resolve(true);
  if (loadPromise) return loadPromise;
  if (!CLIENT_KEY) {
    loadPromise = Promise.reject(new Error('VITE_MIDTRANS_CLIENT_KEY belum diatur.'));
    return loadPromise;
  }

  loadPromise = new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
    script.setAttribute('data-client-key', CLIENT_KEY);
    script.onload = () => resolve(true);
    script.onerror = () => {
      loadPromise = null;
      resolve(false);
    };
    document.head.appendChild(script);
  });

  return loadPromise;
}

export async function payWithSnap(
  snapToken: string,
  handlers: {
    onSuccess?: (result: unknown) => void;
    onPending?: (result: unknown) => void;
    onError?: (result: unknown) => void;
    onClose?: () => void;
  }
): Promise<void> {
  await loadSnap();
  if (!window.snap) {
    throw new Error('Gagal muat halaman pembayaran. Coba lagi ya.');
  }
  window.snap.pay(snapToken, handlers);
}
