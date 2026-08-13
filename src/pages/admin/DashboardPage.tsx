// src/pages/admin/DashboardPage.tsx
import React from 'react';
import AdminLayout from './AdminLayout';
import Icon from '../../components/ui/Icon';
import { formatRupiah } from '../../utils/currency';

const DashboardPage: React.FC = () => {
  const stats = [
    {
      title: 'Total Revenue',
      value: 245500000,
      prefix: 'Rp',
      change: '+15.8% up vs last period',
      icon: 'payments',
      color: 'text-[#004ac6]',
    },
    {
      title: 'Total Orders',
      value: 2341,
      prefix: null,
      change: '+12.5% up vs last period',
      icon: 'orders',
      color: 'text-[#004ac6]',
    },
    {
      title: 'Active Stores',
      value: 1205,
      prefix: null,
      change: '+5.2% up vs last period',
      icon: 'store',
      color: 'text-[#004ac6]',
    },
    {
      title: 'Pending Approvals',
      value: 42,
      prefix: null,
      change: 'Action required',
      icon: 'pending',
      color: 'text-[#ba1a1a]',
    },
  ];

  const revenueData = [120, 190, 170, 220, 280, 350, 420];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
  const maxRevenue = Math.max(...revenueData);

  const topCategories = [
    { name: 'Electronics', percentage: 38 },
    { name: 'Fashion', percentage: 25 },
    { name: 'Food', percentage: 18 },
    { name: 'Beauty', percentage: 12 },
    { name: 'Home', percentage: 7 },
  ];

  const recentOrders = [
    { id: '#ORD-0921', customer: 'Budi Santoso', store: 'TechZone Official', amount: 4500000, status: 'Completed' },
    { id: '#ORD-0920', customer: 'Siti Aminah', store: 'Fashion Hub', amount: 850000, status: 'Processing' },
    { id: '#ORD-0919', customer: 'Ahmad Reza', store: "Gamer's Paradise", amount: 12300000, status: 'Pending' },
    { id: '#ORD-0918', customer: 'Dewi Lestari', store: 'Organic Foods', amount: 250000, status: 'Completed' },
    { id: '#ORD-0917', customer: 'Hendra Wijaya', store: 'Auto Parts Store', amount: 1200000, status: 'Processing' },
  ];

  const statusColor: Record<string, string> = {
    Completed: 'bg-[#d7f5dc] text-[#156b32]',
    Processing: 'bg-[#cfe8ff] text-[#0057b8]',
    Pending: 'bg-[#fff4e0] text-[#b45309]',
  };

  const pendingProducts = [
    { name: 'iPhone 15 Pro Max', store: 'TechZone Official' },
    { name: 'Samsung 4K Smart TV', store: 'Electro World' },
  ];

  const withdrawalRequests = [
    { store: 'Fashion Hub', bank: 'BCA', account: '****1234', amount: 'Rp 12.5M' },
    { store: 'Organic Foods', bank: 'Mandiri', account: '****5678', amount: 'Rp 3.2M' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-[28px] font-bold text-[#191c1e]">Admin Central</h1>
          <p className="text-[15px] text-[#737686]">Welcome back, Admin! Here's what's happening in your marketplace today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <div key={i} className="rounded-2xl border border-[#e0e3e5] bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#737686]">
                    {stat.title}
                  </p>
                  <div className="mt-1">
                    {stat.prefix && (
                      <span className="block text-[13px] font-medium text-[#737686]">{stat.prefix}</span>
                    )}
                    <p className="text-2xl font-bold text-[#191c1e] leading-tight">
                      {stat.prefix
                        ? formatRupiah(stat.value).replace('Rp', '').trim()
                        : stat.value.toLocaleString('id-ID')}
                    </p>
                  </div>
                  <p
                    className={`mt-1 text-[12px] font-medium ${
                      stat.change.includes('+') ? 'text-[#156b32]' : 'text-[#ba1a1a]'
                    }`}
                  >
                    {stat.change}
                  </p>
                </div>
                <div className={`rounded-full bg-[#dbe1ff] p-2.5 shrink-0 ${stat.color}`}>
                  <Icon name={stat.icon as any} size={20} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Revenue & Top Categories */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 rounded-2xl border border-[#e0e3e5] bg-white p-5">
            <h2 className="text-[15px] font-bold text-[#191c1e]">Revenue Overview</h2>
            <div className="mt-4 h-48">
              <div className="flex h-full items-end justify-between gap-2">
                {revenueData.map((value, idx) => {
                  const height = (value / maxRevenue) * 100;
                  return (
                    <div key={idx} className="flex flex-1 flex-col items-center">
                      <div
                        className="w-full rounded-t bg-[#004ac6] transition-all duration-300 hover:bg-[#003ea8]"
                        style={{ height: `${height}%`, minHeight: '8px' }}
                      />
                      <span className="mt-2 text-[10px] text-[#737686]">{months[idx]}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Top Categories */}
          <div className="rounded-2xl border border-[#e0e3e5] bg-white p-5">
            <h2 className="text-[15px] font-bold text-[#191c1e]">Top Categories</h2>
            <div className="mt-4 space-y-3">
              {topCategories.map((cat, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="text-[#434655]">{cat.name}</span>
                    <span className="font-semibold text-[#191c1e]">{cat.percentage}%</span>
                  </div>
                  <div className="mt-0.5 h-1.5 w-full rounded-full bg-[#f2f4f6]">
                    <div
                      className="h-1.5 rounded-full bg-[#004ac6]"
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="rounded-2xl border border-[#e0e3e5] bg-white p-5">
          <h2 className="text-[15px] font-bold text-[#191c1e]">Recent Orders</h2>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#f2f4f6] text-left text-[11px] font-semibold uppercase text-[#737686]">
                  <th className="pb-2 pr-2">Order ID</th>
                  <th className="pb-2 pr-2">Customer</th>
                  <th className="pb-2 pr-2">Store</th>
                  <th className="pb-2 pr-2">Amount</th>
                  <th className="pb-2 pr-2">Status</th>
                  <th className="pb-2">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f2f4f6]">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="text-[13px]">
                    <td className="py-2.5 pr-2 font-medium text-[#004ac6]">{order.id}</td>
                    <td className="py-2.5 pr-2">{order.customer}</td>
                    <td className="py-2.5 pr-2">{order.store}</td>
                    <td className="py-2.5 pr-2 font-semibold">{formatRupiah(order.amount)}</td>
                    <td className="py-2.5 pr-2">
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusColor[order.status] || 'bg-[#f2f4f6] text-[#737686]'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-2.5">
                      <button className="text-[#004ac6] hover:underline">
                        <Icon name="eye" size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Approvals & Withdrawal Requests */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Pending Approvals */}
          <div className="rounded-2xl border border-[#e0e3e5] bg-white p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-[15px] font-bold text-[#191c1e]">Pending Approvals</h2>
              <span className="rounded-full bg-[#ba1a1a] px-2 py-0.5 text-[11px] font-semibold text-white">42 New</span>
            </div>
            <div className="mt-3 space-y-3">
              {pendingProducts.map((product, idx) => (
                <div key={idx} className="flex items-center justify-between rounded-xl border border-[#e0e3e5] p-3">
                  <div>
                    <p className="text-[13px] font-semibold text-[#191c1e]">{product.name}</p>
                    <p className="text-[12px] text-[#737686]">{product.store}</p>
                  </div>
                  <button className="rounded-full bg-[#004ac6] px-3 py-1 text-[12px] font-semibold text-white hover:bg-[#003ea8]">
                    <Icon name="check" size={14} />
                  </button>
                </div>
              ))}
              <button className="mt-2 text-[13px] font-semibold text-[#004ac6] hover:underline">
                View All Approvals →
              </button>
            </div>
          </div>

          {/* Withdrawal Requests */}
          <div className="rounded-2xl border border-[#e0e3e5] bg-white p-5">
            <h2 className="text-[15px] font-bold text-[#191c1e]">Withdrawal Requests</h2>
            <div className="mt-3 space-y-3">
              {withdrawalRequests.map((req, idx) => (
                <div key={idx} className="flex items-center justify-between rounded-xl border border-[#e0e3e5] p-3">
                  <div>
                    <p className="text-[13px] font-semibold text-[#191c1e]">{req.store}</p>
                    <p className="text-[12px] text-[#737686]">{req.bank} - {req.account}</p>
                    <p className="text-[13px] font-bold text-[#004ac6]">{req.amount}</p>
                  </div>
                  <button className="rounded-full bg-[#004ac6] px-3 py-1 text-[12px] font-semibold text-white hover:bg-[#003ea8]">
                    Verify
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DashboardPage;