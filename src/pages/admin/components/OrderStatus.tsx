import React from 'react';

export interface OrderStatusData {
  label: string;
  
  value: number;
  color: string;
}

interface OrderStatusProps {
  data: OrderStatusData[];
}

const OrderStatus: React.FC<OrderStatusProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <p className="py-6 text-center text-[13px] text-[#737686]">Belum ada order di periode ini.</p>
    );
  }

  return (
    <div className="space-y-3">
      {data.map((item) => (
        <div key={item.label}>
          <div className="flex items-center justify-between text-[13px]">
            <span className="text-[#434655]">{item.label}</span>
            <span className="font-semibold text-[#101319]">{item.value}%</span>
          </div>
          <div className="mt-0.5 h-1.5 w-full rounded-full bg-[#f2f4f6]">
            <div
              className="h-1.5 rounded-full"
              style={{ width: `${item.value}%`, backgroundColor: item.color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderStatus;
