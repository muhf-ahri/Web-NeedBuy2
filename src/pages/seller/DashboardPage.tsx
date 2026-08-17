import React, { useState } from 'react';

import SellerLayout from './SellerLayout';
import Reveal from '../../components/ui/Reveal';

import StatCard from '../../components/seller_dashboard/StatCard';
import PeriodFilter from '../../components/seller_dashboard/PeriodFilter';
import SalesChart from '../../components/seller_dashboard/SalesChart';
import InventoryAlerts from '../../components/seller_dashboard/InventoryAlerts';
import ActiveOrders from '../../components/seller_dashboard/ActiveOrders';
import DashboardErrorState from '../../components/seller_dashboard/DashboardErrorState';

import { formatRupiah } from '../../utils/currency';
import { useAuth } from '../../contexts/AuthContext';
import { useDashboardCard } from '../../hooks/useDashboardCard';
import {
  getActiveOrders,
  getCustomerRating,
  getInventoryAlerts,
  getPendingOrders,
  getProductViews,
  getSalesPerformance,
  getTotalSales,
  type DashboardPeriod,
} from '../../api/dashboard';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [period, setPeriod] = useState<DashboardPeriod>('week');

  const [reloadKey, setReloadKey] = useState(0);
  const retry = () => setReloadKey((k) => k + 1);

  const sales = useDashboardCard(() => getTotalSales(period), [period, reloadKey]);
  const pending = useDashboardCard(() => getPendingOrders(), [reloadKey]);
  const rating = useDashboardCard(() => getCustomerRating(), [reloadKey]);
  const views = useDashboardCard(() => getProductViews('week'), [reloadKey]);
  const performance = useDashboardCard(() => getSalesPerformance(period), [
    period,
    reloadKey,
  ]);
  const inventory = useDashboardCard(() => getInventoryAlerts(), [reloadKey]);
  const activeOrders = useDashboardCard(() => getActiveOrders(5), [reloadKey]);

  const cards = [sales, pending, rating, views, performance, inventory, activeOrders];
  const anyLoading = cards.some((c) => c.loading);
  const allFailed = cards.every((c) => Boolean(c.error));
  const showFatalError = !anyLoading && allFailed;

  const periodLabel =
    period === 'day'
      ? 'hari ini'
      : period === 'week'
        ? 'minggu ini'
        : period === 'month'
          ? 'bulan ini'
          : 'tahun ini';

  return (
    <SellerLayout>
      <div className="space-y-6">

        <Reveal direction="up">
          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
            <div className="min-w-0">
              <div className="mb-2 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#538CDB]/10 px-2.5 py-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#FFD500]" />
                  <p className="text-[9px] font-bold uppercase tracking-[0.20em] text-[#538CDB]">
                    Seller Dashboard
                  </p>
                </span>
              </div>
              <h1
                className="
                  text-[22px] font-extrabold leading-tight tracking-tight
                  text-[#20242D] sm:text-[28px]
                "
              >
                Selamat datang kembali,{' '}
                <span className="text-[#538CDB]">{user?.name ?? 'Seller'}</span>
              </h1>
              <p className="mt-1 max-w-xl text-[12px] leading-relaxed text-[#737A87] sm:text-[13px]">
                Pantau performa tokomu {periodLabel} di satu tempat.
              </p>
            </div>

            <PeriodFilter value={period} onChange={setPeriod} />
          </div>
        </Reveal>

        {showFatalError ? (
          <Reveal direction="up">
            <DashboardErrorState onRetry={retry} />
          </Reveal>
        ) : (
          <>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
              <Reveal direction="up" delay={0}>
                <StatCard
                  title="Total Sales"
                  icon="card"
                  iconBg="bg-[#EEF5FF]"
                  iconText="text-[#538CDB]"
                  loading={sales.loading}
                  error={sales.error}
                  value={formatRupiah(sales.data?.value ?? 0)}
                  subtitle={periodLabel}
                  growth={sales.data?.growthPercentage}
                />
              </Reveal>

              <Reveal direction="up" delay={80}>
                <StatCard
                  title="Pending Orders"
                  icon="orders"
                  iconBg="bg-[#FFF7E0]"
                  iconText="text-[#B45309]"
                  loading={pending.loading}
                  error={pending.error}
                  value={`${pending.data?.value ?? 0} orders`}
                  subtitle={`${pending.data?.breakdown.waitingPayment ?? 0} belum bayar · ${pending.data?.breakdown.processing ?? 0} diproses`}
                />
              </Reveal>

              <Reveal direction="up" delay={160}>
                <StatCard
                  title="Customer Rating"
                  icon="star"
                  iconBg="bg-[#FFF7E0]"
                  iconText="text-[#FFD500]"
                  loading={rating.loading}
                  error={rating.error}
                  value={`${(rating.data?.value ?? 0).toFixed(1)}/${(rating.data?.scale ?? 5).toFixed(1)}`}
                  subtitle={`${rating.data?.reviewCount ?? 0} reviews`}
                />
              </Reveal>

              <Reveal direction="up" delay={240}>
                <StatCard
                  title="Product Views"
                  icon="eye"
                  iconBg="bg-[#F0FDF4]"
                  iconText="text-[#166534]"
                  loading={views.loading}
                  error={views.error}
                  value={String(views.data?.value ?? 0)}
                  subtitle={`minggu ini · ${views.data?.uniqueVisitors ?? 0} pengunjung unik`}
                />
              </Reveal>
            </div>

            <Reveal direction="up">
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

                <div className="relative mb-5 flex flex-wrap items-baseline justify-between gap-3">
                  <div className="flex items-center gap-2.5">
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
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                      </svg>
                    </span>
                    <div>
                      <h3 className="text-[14px] font-bold text-[#20242D] sm:text-[15px]">
                        Performa Penjualan
                      </h3>
                      <p className="text-[10px] text-[#737A87]">
                        Grafik pendapatan & barang terjual
                      </p>
                    </div>
                  </div>

                  {performance.data && (
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#737A87]">
                      <span>
                        <span className="font-bold text-[#20242D]">
                          {performance.data.totals.items}
                        </span>{' '}
                        barang
                      </span>
                      <span className="h-1 w-1 rounded-full bg-[#D8DEE9]" />
                      <span>
                        <span className="font-bold text-[#538CDB]">
                          {formatRupiah(performance.data.totals.revenue)}
                        </span>{' '}
                        total
                      </span>
                    </div>
                  )}
                </div>

                {performance.loading ? (
                  <div className="h-48 animate-pulse rounded-2xl bg-[#F5F7FB] sm:h-56 md:h-60" />
                ) : performance.error ? (
                  <div
                    className="
                      rounded-xl border border-[#FF4646]/20 bg-[#FFF0F0] px-3
                      py-2 text-[12px] font-medium text-[#C73535]
                    "
                  >
                    {performance.error}
                  </div>
                ) : (
                  <SalesChart
                    points={performance.data?.points ?? []}
                    granularity={performance.data?.granularity ?? 'day'}
                  />
                )}
              </div>
            </Reveal>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <Reveal direction="up">
                <InventoryAlerts
                  items={inventory.data?.items ?? []}
                  outOfStockCount={inventory.data?.outOfStockCount ?? 0}
                  lowStockCount={inventory.data?.lowStockCount ?? 0}
                  loading={inventory.loading}
                  error={inventory.error}
                />
              </Reveal>

              <Reveal direction="up" delay={100}>
                <ActiveOrders
                  items={activeOrders.data?.items ?? []}
                  totalActive={activeOrders.data?.value ?? 0}
                  loading={activeOrders.loading}
                  error={activeOrders.error}
                />
              </Reveal>
            </div>
          </>
        )}
      </div>
    </SellerLayout>
  );
};

export default DashboardPage;