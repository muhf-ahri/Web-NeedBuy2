// src/hooks/useShoppingPlans.ts
import { useEffect, useState, useCallback } from 'react';
import { getPlans, getPlan, createPlan, type ShoppingPlan, type ShoppingPlanSummary, type GetPlansParams } from '../api/plans';

export const useShoppingPlans = (params?: GetPlansParams) => {
  const [plans, setPlans] = useState<ShoppingPlanSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getPlans(params);
      setPlans(data);
    } catch (err: any) {
      console.error('[useShoppingPlans] Error:', err);
      setError(err.message ?? 'Gagal memuat rencana belanja');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  return { plans, loading, error, refetch: fetchPlans };
};

export const useShoppingPlan = (id: string | undefined) => {
  const [plan, setPlan] = useState<ShoppingPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlan = useCallback(async () => {
    if (!id) {
      setPlan(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await getPlan(id);
      setPlan(res.data.data);
    } catch (err: any) {
      console.error('[useShoppingPlan] Error:', err);
      setError(err.message ?? 'Gagal memuat detail rencana');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPlan();
  }, [fetchPlan]);

  return { plan, loading, error, refetch: fetchPlan };
};

export const useCreatePlan = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(async (data: { name?: string; budget?: number; needId?: string; fromRecommendations?: boolean; maxItems?: number }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await createPlan(data);
      return res.data.data;
    } catch (err: any) {
      console.error('[useCreatePlan] Error:', err);
      setError(err.message ?? 'Gagal membuat rencana');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { create, loading, error };
};
