// src/pages/admin/components/OrderStatus.tsx
import React from 'react';
import type { OrderStatusData } from '../data/analyticsData';

interface OrderStatusProps {
  data: OrderStatusData[];
}

const OrderStatus: React.FC<OrderStatusProps> = ({ data }) => {
  return (
    <div className="space-y-3">
      {data.map((item, idx) => (
        <div key={idx}>
          <div className="flex items-center justify-between text-[13px]">
            <span className="text-[#434655]">{item.label}</span>
            <span className="font-semibold text-[#191c1e]">{item.value}%</span>
          </div>
          <div className="mt-0.5 h-1.5 w-full rounded-full bg-[#f2f4f6]">
            <div
              className="h-1.5 rounded-full"
              style={{
                width: `${item.value}%`,
                backgroundColor: item.color,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderStatus;