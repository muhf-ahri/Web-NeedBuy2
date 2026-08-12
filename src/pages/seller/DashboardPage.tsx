// src/pages/seller/DashboardPage.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SellerLayout from './SellerLayout';
import Icon from '../../components/ui/Icon';
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
  type SalesPoint,
} from '../../api/dashboard';

const PERIODS: { value: DashboardPeriod; label: string }[] = [
  { value: 'day', label: 'Hari' },
  { value: 'week', label: 'Minggu' },
  { value: 'month', label: 'Bulan' },
  { value: 'year', label: 'Tahun' },
];

/** Bingkai card seragam: judul + state loading/error, isi diserahkan ke children. */
const Card: React.FC<{
  title: string;
  loading: boolean;
  error: string | null;
  children: React.ReactNode;
}> = ({ title, loading, error, children }) => (
  <div className="bg-white rounded-2xl border border-[#e0e3e5] p-5">
    <p className="text-[12px] font-semibold text-[#737686] uppercase tracking-wider">{title}</p>
    {loading ? (
      <div className="mt-2 h-7 w-28 bg-[#f2f4f6] rounded animate-pulse" />
    ) : error ? (
      <p className="text-[13px] text-[#ba1a1a] mt-2">{error}</p>
    ) : (
      children
    )}
  </div>
);

const GrowthBadge: React.FC<{ value: number }> = ({ value }) => {
  const up = value >= 0;
  return (
    <span
      className={`inline-block mt-1 text-[12px] px-2 py-0.5 rounded-full ${
        up ? 'text-green-600 bg-green-50' : 'text-[#ba1a1a] bg-[#ffdad6]'
      }`}
    >
      {up ? '+' : ''}
      {value}%
    </span>
  );
};

const SalesChart: React.FC<{ points: SalesPoint[]; granularity: string }> = ({
  points,
  granularity,
}) => {
  if (points.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-[13px] text-[#737686]">
        Belum ada penjualan pada rentang ini.
      </div>
    );
  }

  const width = 600;
  const height = 180;
  const padding = 8;
  const maxRevenue = Math.max(...points.map((p) => p.revenue), 1);
  const maxItems = Math.max(...points.map((p) => p.items), 1);

  const x = (index: number) =>
    points.length === 1
      ? width / 2
      : padding + (index * (width - padding * 2)) / (points.length - 1);
  const y = (value: number, max: number) =>
    height - padding - (value / max) * (height - padding * 2);

  const line = (accessor: (p: SalesPoint) => number, max: number) =>
    points.map((point, index) => `${x(index)},${y(accessor(point), max)}`).join(' ');

  const labelFor = (iso: string) => {
    const date = new Date(iso);
    if (granularity === 'hour') return `${String(date.getHours()).padStart(2, '0')}.00`;
    if (granularity === 'month') return date.toLocaleDateString('id-ID', { month: 'short' });
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  };

  return (
    <div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-48"
        preserveAspectRatio="none"
        role="img"
        aria-label="Grafik penjualan"
      >
        <polyline
          points={line((p) => p.revenue, maxRevenue)}
          fill="none"
          stroke="#004ac6"
          strokeWidth={3}
          vectorEffect="non-scaling-stroke"
        />
        <polyline
          points={line((p) => p.items, maxItems)}
          fill="none"
          stroke="#f59e0b"
          strokeWidth={2}
          strokeDasharray="6 4"
          vectorEffect="non-scaling-stroke"
        />
        {points.map((point, index) => (
          <circle
            key={point.bucket}
            cx={x(index)}
            cy={y(point.revenue, maxRevenue)}
            r={3}
            fill="#004ac6"
          />
        ))}
      </svg>

      <div className="flex justify-between mt-1">
        {points.map((point) => (
          <span key={point.bucket} className="text-[10px] text-[#737686]">
            {labelFor(point.bucket)}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-4 mt-3 text-[11px] text-[#737686]">
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-0.5 bg-[#004ac6] inline-block" /> Pemasukan
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-0.5 bg-[#f59e0b] inline-block" /> Barang terjual
        </span>
      </div>
    </div>
  );
};

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [period, setPeriod] = useState<DashboardPeriod>('week');

  // Satu endpoint per card — card yang gagal hanya menampilkan errornya sendiri.
  const sales = useDashboardCard(() => getTotalSales(period), [period]);
  const pending = useDashboardCard(() => getPendingOrders(), []);
  const rating = useDashboardCard(() => getCustomerRating(), []);
  const views = useDashboardCard(() => getProductViews('week'), []);
  const performance = useDashboardCard(() => getSalesPerformance(period), [period]);
  const inventory = useDashboardCard(() => getInventoryAlerts(), []);
  const activeOrders = useDashboardCard(() => getActiveOrders(5), []);

  return (
    <SellerLayout>
      <div className="space-y-6">
        {/* Welcome + filter periode */}
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-[28px] font-bold text-[#191c1e]">Seller Overview</h1>
            <p className="text-[15px] text-[#737686]">Welcome back, {user?.name ?? 'Seller'}</p>
          </div>

          <div className="flex gap-1 bg-white border border-[#e0e3e5] rounded-full p-1">
            {PERIODS.map((option) => (
              <button
                key={option.value}
                onClick={() => setPeriod(option.value)}
                className={`px-3 py-1 rounded-full text-[12px] font-semibold transition-colors ${
                  period === option.value
                    ? 'bg-[#004ac6] text-white'
                    : 'text-[#434655] hover:bg-[#f2f4f6]'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card title="Total Sales" loading={sales.loading} error={sales.error}>
            <p className="text-[26px] font-bold text-[#191c1e] mt-1">
              {formatRupiah(sales.data?.value ?? 0)}
            </p>
            <GrowthBadge value={sales.data?.growthPercentage ?? 0} />
          </Card>

          <Card title="Pending Orders" loading={pending.loading} error={pending.error}>
            <p className="text-[26px] font-bold text-[#191c1e] mt-1">
              {pending.data?.value ?? 0} orders
            </p>
            <span className="text-[12px] text-[#737686]">
              {pending.data?.breakdown.waitingPayment ?? 0} belum bayar ·{' '}
              {pending.data?.breakdown.processing ?? 0} diproses
            </span>
          </Card>

          <Card title="Customer Rating" loading={rating.loading} error={rating.error}>
            <p className="text-[26px] font-bold text-[#191c1e] mt-1">
              {(rating.data?.value ?? 0).toFixed(1)}/{(rating.data?.scale ?? 5).toFixed(1)}
            </p>
            <span className="text-[12px] text-[#737686]">
              {rating.data?.reviewCount ?? 0} reviews
            </span>
          </Card>

          <Card title="Product Views" loading={views.loading} error={views.error}>
            <p className="text-[26px] font-bold text-[#191c1e] mt-1">{views.data?.value ?? 0}</p>
            <span className="text-[12px] text-[#737686]">
              this week · {views.data?.uniqueVisitors ?? 0} pengunjung
            </span>
          </Card>
        </div>

        {/* Sales performance — KPI grafik garis */}
        <div className="bg-white rounded-2xl border border-[#e0e3e5] p-5">
          <div className="flex items-baseline justify-between mb-4">
            <h3 className="text-[15px] font-bold text-[#191c1e]">Sales Performance</h3>
            {performance.data && (
              <span className="text-[12px] text-[#737686]">
                {performance.data.totals.items} barang ·{' '}
                {formatRupiah(performance.data.totals.revenue)}
              </span>
            )}
          </div>

          {performance.loading ? (
            <div className="h-48 bg-[#f2f4f6] rounded animate-pulse" />
          ) : performance.error ? (
            <p className="text-[13px] text-[#ba1a1a]">{performance.error}</p>
          ) : (
            <SalesChart
              points={performance.data?.points ?? []}
              granularity={performance.data?.granularity ?? 'day'}
            />
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Inventory Alerts */}
          <div className="bg-white rounded-2xl border border-[#e0e3e5] p-5">
            <div className="flex items-baseline justify-between mb-4">
              <h3 className="text-[15px] font-bold text-[#191c1e]">Inventory Alerts</h3>
              {inventory.data && (
                <span className="text-[11px] text-[#737686]">
                  {inventory.data.outOfStockCount} habis · {inventory.data.lowStockCount} menipis
                </span>
              )}
            </div>

            {inventory.loading ? (
              <div className="h-20 bg-[#f2f4f6] rounded animate-pulse" />
            ) : inventory.error ? (
              <p className="text-[13px] text-[#ba1a1a]">{inventory.error}</p>
            ) : inventory.data && inventory.data.items.length > 0 ? (
              <ul className="space-y-2">
                {inventory.data.items.map((alert) => (
                  <li
                    key={alert.productId}
                    className="flex items-center gap-2 text-[13px] text-[#ba1a1a]"
                  >
                    <Icon name="alert" size={16} className="text-[#ba1a1a] shrink-0" />
                    <span>
                      {alert.level === 'OUT_OF_STOCK' ? 'Stok habis' : 'Stok menipis'}:{' '}
                      {alert.productName} ({alert.stock} tersisa)
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[13px] text-[#737686]">Semua stok aman.</p>
            )}
          </div>

          {/* Active Orders */}
          <div className="bg-white rounded-2xl border border-[#e0e3e5] p-5">
            <div className="flex items-baseline justify-between mb-4">
              <h3 className="text-[15px] font-bold text-[#191c1e]">Active Orders</h3>
              {activeOrders.data && (
                <span className="text-[11px] text-[#737686]">{activeOrders.data.value} aktif</span>
              )}
            </div>

            {activeOrders.loading ? (
              <div className="h-24 bg-[#f2f4f6] rounded animate-pulse" />
            ) : activeOrders.error ? (
              <p className="text-[13px] text-[#ba1a1a]">{activeOrders.error}</p>
            ) : activeOrders.data && activeOrders.data.items.length > 0 ? (
              <div className="space-y-3">
                {activeOrders.data.items.map((order) => (
                  <div
                    key={order.orderId}
                    className="flex items-center justify-between text-[13px] border-b border-[#f2f4f6] pb-2 last:border-0"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="font-semibold text-[#191c1e] truncate">{order.orderNumber}</p>
                      <p className="text-[#737686] text-[11px] truncate">
                        {order.customer} · {order.itemCount} barang
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-semibold">{formatRupiah(order.amount)}</p>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#fff4e0] text-[#b45309]">
                        {order.statusLabel}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[13px] text-[#737686]">Belum ada order aktif.</p>
            )}

            <Link
              to="/seller/orders"
              className="mt-4 block text-center w-full py-2 rounded-full border border-[#004ac6] text-[#004ac6] font-semibold text-sm hover:bg-[#dbe1ff] transition-colors"
            >
              Lihat semua order
            </Link>
          </div>
        </div>
      </div>
    </SellerLayout>
  );
};

export default DashboardPage;
