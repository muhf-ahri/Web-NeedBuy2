// src/pages/admin/AnalyticsPage.tsx
import React from 'react';
import AdminLayout from './AdminLayout';
import Icon from '../../components/ui/Icon';
import StatCard from './components/StatCard';
import RevenueChart from './components/RevenueChart';
import TopCategories from './components/TopCategories';
import TopStores from './components/TopStores';
import OrderStatus from './components/OrderStatus';
import {
  DUMMY_STATS,
  DUMMY_REVENUE_DATA,
  DUMMY_TOP_CATEGORIES,
  DUMMY_TOP_STORES,
  DUMMY_ORDER_STATUS,
} from './data/analyticsData';

const AnalyticsPage: React.FC = () => {
  const stats = [
    {
      title: 'Total Pendapatan',
      value: DUMMY_STATS.totalRevenue,
      change: DUMMY_STATS.revenueChange,
      icon: 'payments' as const,
      isCurrency: true,
    },
    {
      title: 'Total Pesanan',
      value: DUMMY_STATS.totalOrders,
      change: DUMMY_STATS.ordersChange,
      icon: 'orders' as const,
      isCurrency: false,
    },
    {
      title: 'Conversion Rate',
      value: `${DUMMY_STATS.conversionRate}%`,
      change: DUMMY_STATS.conversionChange,
      icon: 'trending' as const,
      isCurrency: false,
    },
    {
      title: 'Pengguna Aktif',
      value: DUMMY_STATS.activeUsers,
      change: DUMMY_STATS.usersChange,
      icon: 'users' as const,
      isCurrency: false,
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-[28px] font-bold text-[#191c1e]">Analytics</h1>
          <p className="text-[15px] text-[#737686]">
            Overview of marketplace performance metrics and trends.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, idx) => (
            <StatCard
              key={idx}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              icon={stat.icon}
              isCurrency={stat.isCurrency}
            />
          ))}
        </div>

        {/* Revenue Chart & Order Status */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-[#e0e3e5] bg-white p-5 lg:col-span-2">
            <h2 className="text-[15px] font-bold text-[#191c1e]">
              Revenue Overview
            </h2>
            <RevenueChart data={DUMMY_REVENUE_DATA} />
          </div>

          <div className="rounded-2xl border border-[#e0e3e5] bg-white p-5">
            <h2 className="text-[15px] font-bold text-[#191c1e]">Order Status</h2>
            <div className="mt-3">
              <OrderStatus data={DUMMY_ORDER_STATUS} />
            </div>
          </div>
        </div>

        {/* Top Categories & Top Stores */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-[#e0e3e5] bg-white p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-[15px] font-bold text-[#191c1e]">
                Top Selling Categories
              </h2>
              <button className="text-[12px] font-semibold text-[#004ac6] hover:underline">
                View All
              </button>
            </div>
            <div className="mt-3">
              <TopCategories categories={DUMMY_TOP_CATEGORIES} />
            </div>
          </div>

          <div className="rounded-2xl border border-[#e0e3e5] bg-white p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-[15px] font-bold text-[#191c1e]">
                Top Performing Stores
              </h2>
              <button className="text-[12px] font-semibold text-[#004ac6] hover:underline">
                View All
              </button>
            </div>
            <div className="mt-3">
              <TopStores stores={DUMMY_TOP_STORES} />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AnalyticsPage;