// src/pages/seller/DashboardPage.tsx
import React from 'react';
import SellerLayout from './SellerLayout';
import Icon from '../../components/ui/Icon';
import { formatRupiah } from '../../utils/currency';

const DashboardPage: React.FC = () => {
  // Dummy data
  const totalSales = 1245000; // dalam rupiah
  const pendingOrders = 14;
  const rating = 4.9;
  const reviews = 120;
  const productViews = 2400;

  const inventoryAlerts = [
    { product: 'Mechanical Keyboard', stock: 2 },
    { product: 'Baskvi Keyboard', stock: 0 },
    { product: 'Laptop Stand', stock: 5 },
  ];

  const activeOrders = [
    { id: '57003001', customer: 'Joapor Smith', date: 'Sep 23, 2023', amount: 300000, status: 'Ready to Ship' },
    { id: '57000002', customer: 'Moren Smith', date: 'Sep 26, 2023', amount: 30000, status: 'Shipped' },
    { id: '57003073', customer: 'Marbin Smith', date: 'Aug 31, 2023', amount: 49000, status: 'Delivered' },
    { id: '57003074', customer: 'Janmy Smith', date: 'Jan 26, 2023', amount: 30000, status: 'Ready to Ship' },
    { id: '57003075', customer: 'Emily Chen', date: 'Oct 1, 2023', amount: 75000, status: 'Processing' },
  ];

  return (
    <SellerLayout>
      <div className="space-y-6">
        {/* Welcome */}
        <div>
          <h1 className="text-[28px] font-bold text-[#191c1e]">Seller Overview</h1>
          <p className="text-[15px] text-[#737686]">Welcome back, [Seller Name]</p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-[#e0e3e5] p-5">
            <p className="text-[12px] font-semibold text-[#737686] uppercase tracking-wider">Total Sales</p>
            <p className="text-[26px] font-bold text-[#191c1e] mt-1">{formatRupiah(totalSales)}</p>
            <span className="inline-block mt-1 text-[12px] text-green-600 bg-green-50 px-2 py-0.5 rounded-full">+5%</span>
          </div>
          <div className="bg-white rounded-2xl border border-[#e0e3e5] p-5">
            <p className="text-[12px] font-semibold text-[#737686] uppercase tracking-wider">Pending Orders</p>
            <p className="text-[26px] font-bold text-[#191c1e] mt-1">{pendingOrders} orders</p>
          </div>
          <div className="bg-white rounded-2xl border border-[#e0e3e5] p-5">
            <p className="text-[12px] font-semibold text-[#737686] uppercase tracking-wider">Customer Rating</p>
            <p className="text-[26px] font-bold text-[#191c1e] mt-1">{rating}/5.0</p>
            <span className="text-[12px] text-[#737686]">{reviews} reviews</span>
          </div>
          <div className="bg-white rounded-2xl border border-[#e0e3e5] p-5">
            <p className="text-[12px] font-semibold text-[#737686] uppercase tracking-wider">Product Views</p>
            <p className="text-[26px] font-bold text-[#191c1e] mt-1">{productViews}</p>
            <span className="text-[12px] text-[#737686]">this week</span>
          </div>
        </div>

        {/* Sales performance chart placeholder */}
        <div className="bg-white rounded-2xl border border-[#e0e3e5] p-5">
          <h3 className="text-[15px] font-bold text-[#191c1e] mb-4">Sales Performance</h3>
          <div className="h-48 flex items-end gap-2">
            {[120, 90, 150, 180, 110, 200, 160, 140].map((value, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-[#004ac6] rounded-t"
                  style={{ height: `${(value / 200) * 100}%` }}
                />
                <span className="text-[10px] text-[#737686] mt-1">{['Mon','Sun','Wed','Thu','Tue','Wed','Thu','Fri'][i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Inventory Alerts */}
          <div className="bg-white rounded-2xl border border-[#e0e3e5] p-5">
            <h3 className="text-[15px] font-bold text-[#191c1e] mb-4">Inventory Alerts</h3>
            <ul className="space-y-2">
              {inventoryAlerts.map((alert, idx) => (
                <li key={idx} className="flex items-center gap-2 text-[13px] text-[#ba1a1a]">
                  <Icon name="alert" size={16} className="text-[#ba1a1a]" />
                  <span>Low Stock: {alert.product} ({alert.stock} left)</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Active Orders */}
          <div className="bg-white rounded-2xl border border-[#e0e3e5] p-5">
            <h3 className="text-[15px] font-bold text-[#191c1e] mb-4">Active Orders</h3>
            <div className="space-y-3">
              {activeOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between text-[13px] border-b border-[#f2f4f6] pb-2 last:border-0">
                  <div>
                    <p className="font-semibold text-[#191c1e]">{order.id}</p>
                    <p className="text-[#737686] text-[11px]">{order.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatRupiah(order.amount)}</p>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#fff4e0] text-[#b45309]">{order.status}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-4 w-full py-2 rounded-full border border-[#004ac6] text-[#004ac6] font-semibold text-sm hover:bg-[#dbe1ff] transition-colors">
              Go to Shop
            </button>
          </div>
        </div>
      </div>
    </SellerLayout>
  );
};

export default DashboardPage;