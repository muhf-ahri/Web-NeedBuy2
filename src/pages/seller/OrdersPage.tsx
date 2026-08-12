// src/pages/seller/OrdersPage.tsx
import React from 'react';
import SellerLayout from './SellerLayout';
import Icon from '../../components/ui/Icon';
import { formatRupiah } from '../../utils/currency';

const OrdersPage: React.FC = () => {
  const orders = [
    { id: 'ORD-001', customer: 'Alex Johnson', date: 'Oct 31, 2023', amount: 120000, status: 'Processing' },
    { id: 'ORD-002', customer: 'Maria Garcia', date: 'Oct 30, 2023', amount: 45500, status: 'Shipped' },
    { id: 'ORD-003', customer: 'Ken Chen', date: 'Oct 29, 2023', amount: 250000, status: 'Delivered' },
    { id: 'ORD-004', customer: 'Jamili Waii', date: 'Oct 18, 2023', amount: 45500, status: 'Shipped' },
    { id: 'ORD-005', customer: 'Siarzy Johnson', date: 'Oct 15, 2023', amount: 120000, status: 'Delivered' },
  ];

  const statusColors: Record<string, string> = {
    Processing: 'bg-[#fff4e0] text-[#b45309]',
    Shipped: 'bg-[#cfe8ff] text-[#0057b8]',
    Delivered: 'bg-[#d7f5dc] text-[#156b32]',
  };

  return (
    <SellerLayout>
      <div className="space-y-6">
        <h1 className="text-[28px] font-bold text-[#191c1e]">Shop Orders</h1>

        <div className="bg-white rounded-2xl border border-[#e0e3e5] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#f2f4f6] text-[11px] font-semibold text-[#737686] uppercase tracking-wider">
                  <th className="px-4 py-3 text-left">Order ID</th>
                  <th className="px-4 py-3 text-left">Customer Name</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Amount</th>
                  <th className="px-4 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e0e3e5]">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#f8f9fb] transition-colors">
                    <td className="px-4 py-3 font-mono font-semibold text-[#004ac6]">{order.id}</td>
                    <td className="px-4 py-3">{order.customer}</td>
                    <td className="px-4 py-3 text-[#737686]">{order.date}</td>
                    <td className="px-4 py-3 font-semibold">{formatRupiah(order.amount)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${statusColors[order.status] || 'bg-[#f2f4f6] text-[#737686]'}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </SellerLayout>
  );
};

export default OrdersPage;