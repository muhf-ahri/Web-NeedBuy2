import React, { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import StatCard from './components/StatCard';
import RevenueChart from './components/RevenueChart';
import TopCategories from './components/TopCategories';
import TopStores from './components/TopStores';
import OrderStatus from './components/OrderStatus';
import { getAnalytics, type AdminAnalytics, type OrderStatus as OrderStatusCode } from '../../api/admin';

const STATUS_LABEL: Record<OrderStatusCode, string> = {
  WAITING_PAYMENT: 'Nunggu Bayar',
  PROCESSING: 'Diproses',
  SHIPPED: 'Dikirim',
  DELIVERED: 'Sampai',
  COMPLETED: 'Selesai',
  CANCELLED: 'Dibatalkan',
};

const STATUS_COLOR: Record<OrderStatusCode, string> = {
  WAITING_PAYMENT: '#b45309',
  PROCESSING: '#4077a6',
  SHIPPED: '#4077a6',
  DELIVERED: '#12805c',
  COMPLETED: '#12805c',
  CANCELLED: '#93000a',
};

const AnalyticsPage: React.FC = () => {
  const [data, setData] = useState<AdminAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    getAnalytics()
      .then((res) => {
        if (alive) setData(res.data.data);
      })
      .catch((err: Error) => {
        if (alive) setError(err.message);
      })
      .finally(() => {
        if (alive) setIsLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const stats = data && [
    {
      title: 'Pendapatan Platform',
      value: data.totals.revenue,
      change: data.changes.revenue,
      icon: 'payments' as const,
      isCurrency: true,
    },
    {
      title: 'Total Pesanan',
      value: data.totals.orders,
      change: data.changes.orders,
      icon: 'orders' as const,
      isCurrency: false,
    },
    {
      title: 'Conversion Rate',
      value: `${data.totals.conversionRate}%`,
      change: data.changes.conversionRate,
      icon: 'trending' as const,
      isCurrency: false,
    },
    {
      title: 'Pembeli Aktif',
      value: data.totals.activeUsers,
      change: data.changes.activeUsers,
      icon: 'users' as const,
      isCurrency: false,
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-[28px] font-bold text-[#101319]">Analytics</h1>
          <p className="text-[15px] text-[#737686]">
            Performa marketplace {data ? `${data.windowDays} hari terakhir` : '30 hari terakhir'},
            dibanding periode sebelumnya.
          </p>
        </div>

        {error && (
          <div className="rounded-2xl border border-[#ffdad6] bg-[#fff0f0] p-4 text-[13px] text-[#93000a]">
            {error}
          </div>
        )}

        {isLoading || !data ? (
          <div className="rounded-2xl border border-[#e0e3e5] bg-white py-20 text-center text-[#737686]">
            <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-[#538cbd] border-t-transparent" />
            <span className="ml-2">Memuat…</span>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {stats!.map((stat) => (
                <StatCard
                  key={stat.title}
                  title={stat.title}
                  value={stat.value}
                  change={stat.change}
                  icon={stat.icon}
                  isCurrency={stat.isCurrency}
                />
              ))}
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="rounded-2xl border border-[#e0e3e5] bg-white p-5 lg:col-span-2">
                <h2 className="text-[15px] font-bold text-[#101319]">
                  Pendapatan Platform (12 bulan)
                </h2>
                <RevenueChart data={data.revenueSeries} />
              </div>

              <div className="rounded-2xl border border-[#e0e3e5] bg-white p-5">
                <h2 className="text-[15px] font-bold text-[#101319]">Status Pesanan</h2>
                <div className="mt-3">
                  <OrderStatus
                    data={data.ordersByStatus.map((row) => ({
                      label: STATUS_LABEL[row.status] ?? row.status,
                      value: row.percentage,
                      color: STATUS_COLOR[row.status] ?? '#737686',
                    }))}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-[#e0e3e5] bg-white p-5">
                <h2 className="text-[15px] font-bold text-[#101319]">Kategori Terlaris</h2>
                <div className="mt-3">
                  <TopCategories categories={data.topCategories} />
                </div>
              </div>

              <div className="rounded-2xl border border-[#e0e3e5] bg-white p-5">
                <h2 className="text-[15px] font-bold text-[#101319]">Toko Terbaik</h2>
                <div className="mt-3">
                  <TopStores stores={data.topStores} />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AnalyticsPage;
