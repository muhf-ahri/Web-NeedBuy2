// src/pages/seller/AnalyticsPage.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SellerLayout from './SellerLayout';
import Icon from '../../components/ui/Icon';
import { formatRupiah } from '../../utils/currency';
import { useDashboardCard } from '../../hooks/useDashboardCard';
import { getSalesPerformance, type DashboardPeriod, type SalesPoint } from '../../api/dashboard';
import {
  getShopConversion,
  getShopInsights,
  getShopTopProducts,
  type InsightSeverity,
} from '../../api/shopAnalytics';

const PERIODS: { value: DashboardPeriod; label: string }[] = [
  { value: 'day', label: 'Hari' },
  { value: 'week', label: 'Minggu' },
  { value: 'month', label: 'Bulan' },
  { value: 'year', label: 'Tahun' },
];

const SEVERITY_STYLE: Record<InsightSeverity, { box: string; icon: string; dot: string }> = {
  critical: { box: 'bg-[#ffe0e0] border-[#ffbcbc]', icon: 'text-[#a33131]', dot: 'bg-[#ba1a1a]' },
  warning: { box: 'bg-[#fff4e0] border-[#ffe0b0]', icon: 'text-[#b45309]', dot: 'bg-[#b45309]' },
  positive: { box: 'bg-[#d7f5dc] border-[#b3e6c0]', icon: 'text-[#156b32]', dot: 'bg-[#156b32]' },
  info: { box: 'bg-white border-[#dbe1ff]', icon: 'text-[#004ac6]', dot: 'bg-[#004ac6]' },
};

/**
 * Grafik batang pendapatan per bucket waktu.
 *
 * Tinggi batang dinormalisasi ke nilai tertinggi pada rentang ini — sumbu Y
 * tetap 0, jadi batang yang dua kali lebih tinggi memang dua kali pendapatan.
 */
const RevenueChart: React.FC<{ points: SalesPoint[]; granularity: string }> = ({
  points,
  granularity,
}) => {
  if (points.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-[13px] text-[#737686]">
        Belum ada pendapatan pada rentang ini.
      </div>
    );
  }

  const max = Math.max(...points.map((p) => p.revenue), 1);
  const labelFor = (iso: string) => {
    const date = new Date(iso);
    if (granularity === 'hour') return `${String(date.getHours()).padStart(2, '0')}.00`;
    if (granularity === 'month') return date.toLocaleDateString('id-ID', { month: 'short' });
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="h-48 flex items-end gap-2">
      {points.map((point) => (
        <div key={point.bucket} className="flex-1 flex flex-col items-center justify-end h-full">
          <span className="text-[9px] text-[#737686] mb-1">
            {point.revenue > 0 ? Math.round(point.revenue / 1000) + 'rb' : ''}
          </span>
          <div
            className="w-full bg-[#004ac6] rounded-t min-h-[2px]"
            style={{ height: `${(point.revenue / max) * 100}%` }}
            title={`${labelFor(point.bucket)} · ${formatRupiah(point.revenue)}`}
          />
          <span className="text-[10px] text-[#737686] mt-1 truncate w-full text-center">
            {labelFor(point.bucket)}
          </span>
        </div>
      ))}
    </div>
  );
};

const AnalyticsPage: React.FC = () => {
  const [period, setPeriod] = useState<DashboardPeriod>('month');

  const revenue = useDashboardCard(() => getSalesPerformance(period), [period]);
  const conversion = useDashboardCard(() => getShopConversion(period), [period]);
  const topProducts = useDashboardCard(() => getShopTopProducts(period, 5), [period]);
  const insights = useDashboardCard(() => getShopInsights(period), [period]);

  return (
    <SellerLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h1 className="text-[28px] font-bold text-[#191c1e]">Shop Analytics</h1>
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

        {/* Revenue Growth */}
        <div className="bg-white rounded-2xl border border-[#e0e3e5] p-5">
          <div className="flex items-baseline justify-between mb-4">
            <h3 className="text-[15px] font-bold text-[#191c1e]">Revenue Growth</h3>
            {revenue.data && (
              <span className="text-[12px] text-[#737686]">
                Total {formatRupiah(revenue.data.totals.revenue)} · {revenue.data.totals.orders} order
              </span>
            )}
          </div>
          {revenue.loading ? (
            <div className="h-48 bg-[#f2f4f6] rounded animate-pulse" />
          ) : revenue.error ? (
            <p className="text-[13px] text-[#ba1a1a]">{revenue.error}</p>
          ) : (
            <RevenueChart
              points={revenue.data?.points ?? []}
              granularity={revenue.data?.granularity ?? 'day'}
            />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Conversion Rate */}
          <div className="bg-white rounded-2xl border border-[#e0e3e5] p-5">
            <h3 className="text-[15px] font-bold text-[#191c1e] mb-2">Conversion Rate</h3>
            {conversion.loading ? (
              <div className="h-12 w-32 bg-[#f2f4f6] rounded animate-pulse" />
            ) : conversion.error ? (
              <p className="text-[13px] text-[#ba1a1a]">{conversion.error}</p>
            ) : (
              <>
                <p className="text-[36px] font-bold text-[#004ac6] leading-tight">
                  {conversion.data?.conversionRate ?? 0}%
                </p>
                <p className="text-[13px] text-[#737686]">
                  {conversion.data?.orders ?? 0} order dari {conversion.data?.views ?? 0} kunjungan
                </p>
                {conversion.data && conversion.data.previous.views > 0 && (
                  <p
                    className={`text-[12px] mt-2 ${
                      conversion.data.changePoint >= 0 ? 'text-green-600' : 'text-[#ba1a1a]'
                    }`}
                  >
                    {conversion.data.changePoint >= 0 ? '▲' : '▼'}{' '}
                    {Math.abs(conversion.data.changePoint)} poin dibanding periode sebelumnya (
                    {conversion.data.previous.conversionRate}%)
                  </p>
                )}
              </>
            )}
          </div>

          {/* Top Selling Products */}
          <div className="bg-white rounded-2xl border border-[#e0e3e5] p-5">
            <h3 className="text-[15px] font-bold text-[#191c1e] mb-4">Top Selling Products</h3>
            {topProducts.loading ? (
              <div className="h-24 bg-[#f2f4f6] rounded animate-pulse" />
            ) : topProducts.error ? (
              <p className="text-[13px] text-[#ba1a1a]">{topProducts.error}</p>
            ) : topProducts.data && topProducts.data.length > 0 ? (
              <ul className="space-y-2">
                {topProducts.data.map((product) => (
                  <li
                    key={product.productId}
                    className="flex items-center justify-between gap-3 text-[13px] text-[#434655]"
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      <span className="font-semibold text-[#004ac6] shrink-0">{product.rank}.</span>
                      {product.slug ? (
                        <Link
                          to={`/products/${product.slug}`}
                          className="truncate hover:text-[#004ac6] hover:underline"
                        >
                          {product.productName}
                        </Link>
                      ) : (
                        <span className="truncate italic text-[#737686]">{product.productName}</span>
                      )}
                    </span>
                    <span className="text-right shrink-0">
                      <span className="font-semibold text-[#191c1e]">
                        {product.quantitySold} terjual
                      </span>
                      <span className="block text-[11px] text-[#737686]">
                        {formatRupiah(product.revenue)}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[13px] text-[#737686]">
                Belum ada penjualan pada rentang waktu ini.
              </p>
            )}
          </div>
        </div>

        {/* Insight toko — berbasis aturan, bukan LLM */}
        <div className="bg-[#f2f6ff] border border-[#dbe1ff] rounded-2xl p-5">
          <h3 className="flex items-center gap-2 text-[15px] font-bold text-[#191c1e] mb-1">
            <Icon name="spark" size={20} className="text-[#004ac6]" />
            Shop Insights
          </h3>
          <p className="text-[11px] text-[#737686] mb-3">
            Dihitung otomatis dari data toko kamu pada periode terpilih.
          </p>

          {insights.loading ? (
            <div className="h-20 bg-white/60 rounded animate-pulse" />
          ) : insights.error ? (
            <p className="text-[13px] text-[#ba1a1a]">{insights.error}</p>
          ) : (
            <ul className="space-y-2">
              {(insights.data?.insights ?? []).map((insight) => {
                const style = SEVERITY_STYLE[insight.severity];
                return (
                  <li
                    key={insight.code}
                    className={`flex items-start gap-2.5 text-[13px] text-[#434655] border rounded-xl px-3 py-2.5 ${style.box}`}
                  >
                    <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${style.dot}`} />
                    <span>{insight.message}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </SellerLayout>
  );
};

export default AnalyticsPage;
