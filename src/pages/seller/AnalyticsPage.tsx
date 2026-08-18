import React, { useState } from 'react';

import SellerLayout from './SellerLayout';
import Reveal from '../../components/ui/Reveal';

import AnalyticsHeader from '../../components/seller_analytics/AnalyticsHeader';
import RevenueChart from '../../components/seller_analytics/RevenueChart';
import ConversionCard from '../../components/seller_analytics/ConversionCard';
import TopProductsCard from '../../components/seller_analytics/TopProductsCard';
import ShopInsightsCard from '../../components/seller_analytics/ShopInsightsCard';
import AnalyticsErrorState from '../../components/seller_analytics/AnalyticsErrorState';

import { useDashboardCard } from '../../hooks/useDashboardCard';
import {
  getSalesPerformance,
  type DashboardPeriod,
} from '../../api/dashboard';
import {
  getShopConversion,
  getShopInsights,
  getShopTopProducts,
} from '../../api/shopAnalytics';

const AnalyticsPage: React.FC = () => {
  const [period, setPeriod] = useState<DashboardPeriod>('month');
  const [reloadKey, setReloadKey] = useState(0);
  const retry = () => setReloadKey((k) => k + 1);

  const revenue = useDashboardCard(() => getSalesPerformance(period), [period, reloadKey]);
  const conversion = useDashboardCard(() => getShopConversion(period), [period, reloadKey]);
  const topProducts = useDashboardCard(() => getShopTopProducts(period, 5), [period, reloadKey]);
  const insights = useDashboardCard(() => getShopInsights(period), [period, reloadKey]);

  const cards = [revenue, conversion, topProducts, insights];
  const anyLoading = cards.some((c) => c.loading);
  const allFailed = cards.every((c) => Boolean(c.error));
  const showFatalError = !anyLoading && allFailed;

  return (
    <SellerLayout>
      <div className="space-y-5 sm:space-y-6">
        
        <Reveal direction="up">
          <AnalyticsHeader period={period} onPeriodChange={setPeriod} />
        </Reveal>

        {showFatalError ? (
          <Reveal direction="up">
            <AnalyticsErrorState onRetry={retry} />
          </Reveal>
        ) : (
          <>
            
            <Reveal direction="up" delay={80}>
              <div
                className="
                  relative overflow-hidden rounded-[24px] border border-white/80
                  bg-white/95 p-5 shadow-[0_8px_24px_rgba(32,36,45,0.06)]
                  backdrop-blur-sm sm:p-6
                "
              >
                
                <span
                  className="
                    pointer-events-none absolute -right-16 -top-16 h-40 w-40
                    rounded-full border border-[#538CDB]/10
                  "
                />
                <span
                  className="
                    pointer-events-none absolute right-8 top-8 h-1.5 w-1.5
                    rounded-full bg-[#FFD500]
                  "
                />

                <div className="relative mb-4 flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#538CDB]/10">
                    <svg
                      width={15}
                      height={15}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-[#538CDB]"
                    >
                      <line x1="18" y1="20" x2="18" y2="10" />
                      <line x1="12" y1="20" x2="12" y2="4" />
                      <line x1="6" y1="20" x2="6" y2="14" />
                    </svg>
                  </span>
                  <div>
                    <h3 className="text-[14px] font-bold text-[#20242D] sm:text-[15px]">
                      Pertumbuhan Omzet
                    </h3>
                    <p className="text-[10px] text-[#737A87]">
                      Pendapatan per periode waktu
                    </p>
                  </div>
                </div>

                {revenue.loading ? (
                  <div className="h-60 animate-pulse rounded-2xl bg-[#F5F7FB] sm:h-64" />
                ) : revenue.error ? (
                  <div className="rounded-xl border border-[#FF4646]/20 bg-[#FFF0F0] px-3 py-2 text-[12px] font-medium text-[#C73535]">
                    {revenue.error}
                  </div>
                ) : (
                  <RevenueChart
                    points={revenue.data?.points ?? []}
                    granularity={revenue.data?.granularity ?? 'day'}
                    total={revenue.data?.totals}
                  />
                )}
              </div>
            </Reveal>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 sm:gap-5">
              <Reveal direction="up" delay={160}>
                <ConversionCard
                  loading={conversion.loading}
                  error={conversion.error}
                  conversionRate={conversion.data?.conversionRate ?? 0}
                  orders={conversion.data?.orders ?? 0}
                  views={conversion.data?.views ?? 0}
                  changePoint={conversion.data?.changePoint ?? 0}
                  previousRate={conversion.data?.previous.conversionRate ?? 0}
                  previousViews={conversion.data?.previous.views ?? 0}
                />
              </Reveal>

              <Reveal direction="up" delay={240}>
                <TopProductsCard
                  loading={topProducts.loading}
                  error={topProducts.error}
                  products={topProducts.data ?? []}
                />
              </Reveal>
            </div>

            <Reveal direction="up" delay={320}>
              <ShopInsightsCard
                loading={insights.loading}
                error={insights.error}
                insights={insights.data?.insights ?? []}
              />
            </Reveal>
          </>
        )}
      </div>
    </SellerLayout>
  );
};

export default AnalyticsPage;