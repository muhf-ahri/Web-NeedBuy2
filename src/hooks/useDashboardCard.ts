import { useCallback, useEffect, useState } from 'react';
import type { AxiosResponse } from 'axios';
import type { ApiResponse } from '../types';

/**
 * Satu card dashboard = satu endpoint = satu pemanggilan hook ini.
 *
 * Dipisah per card (bukan satu fetch besar) supaya card yang gagal hanya
 * menampilkan errornya sendiri, tidak mengosongkan seluruh dashboard.
 */
export function useDashboardCard<T>(
  fetcher: () => Promise<AxiosResponse<ApiResponse<T>>>,
  deps: unknown[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // fetcher dibuat inline di pemanggil, jadi identitasnya berubah tiap render —
  // deps eksplisit yang menentukan kapan benar-benar fetch ulang.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const stableFetcher = useCallback(fetcher, deps);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await stableFetcher();
      setData(response.data.data);
    } catch (err: any) {
      setError(err?.message ?? 'Gagal memuat data');
    } finally {
      setLoading(false);
    }
  }, [stableFetcher]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, refetch: load };
}
