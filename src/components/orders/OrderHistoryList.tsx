import React from 'react';

import Icon from '../ui/Icon';
import { formatRupiah } from '../../utils/currency';
import {
  historyStyle,
  historyLabel,
  STATUS_LABEL,
  dateTimeLabel,
} from './orders.helpers';
import type { Order } from '../../api/orders';

interface OrdersHistoryListProps {
  orders: Order[];
  onOpen: (id: string) => void;
}

const OrdersHistoryList: React.FC<OrdersHistoryListProps> = ({
  orders,
  onOpen,
}) => {
  return (
    <>

      <div
        className="
          hidden overflow-x-auto rounded-[24px] border border-white/80
          bg-white/95 shadow-[0_8px_24px_rgba(32,36,45,0.06)]
          backdrop-blur-sm md:block
        "
      >
        <table className="w-full min-w-[640px] text-left">
          <thead>
            <tr className="border-b border-[#e0e3e5] bg-[#F5F7FB]">
              <th
                scope="col"
                className="
                  px-5 py-3.5 text-[10px] font-bold uppercase
                  tracking-[0.14em] text-[#737686]
                "
              >
                ID Pesanan
              </th>
              <th
                scope="col"
                className="
                  px-5 py-3.5 text-[10px] font-bold uppercase
                  tracking-[0.14em] text-[#737686]
                "
              >
                Tanggal & Jam
              </th>
              <th
                scope="col"
                className="
                  px-5 py-3.5 text-[10px] font-bold uppercase
                  tracking-[0.14em] text-[#737686]
                "
              >
                Status
              </th>
              <th
                scope="col"
                className="
                  px-5 py-3.5 text-right text-[10px] font-bold uppercase
                  tracking-[0.14em] text-[#737686]
                "
              >
                Total
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F5F7FB]">
            {orders.map((order) => (
              <tr
                key={order.id}
                onClick={() => onOpen(order.id)}
                className="
                  cursor-pointer transition-colors hover:bg-[#F5F7FB]/60
                "
              >
                <td className="px-5 py-4">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpen(order.id);
                    }}
                    className="
                      font-mono text-[12px] font-bold text-[#004ac6]
                      hover:underline
                    "
                  >
                    #{order.orderNumber}
                  </button>
                  <p className="mt-0.5 text-[11px] text-[#737686]">
                    {order.seller.storeName}
                  </p>
                </td>
                <td className="px-5 py-4 whitespace-nowrap text-[12px] text-[#737686]">
                  {dateTimeLabel(order.createdAt)}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`
                      inline-flex items-center gap-1 rounded-full px-2.5
                      py-1 text-[11px] font-semibold ${historyStyle(order.status)}
                    `}
                  >
                    <span className="h-1 w-1 rounded-full bg-current opacity-60" />
                    {historyLabel(order.status)}
                  </span>
                  <p className="mt-1 text-[10px] text-[#A2A8B3]">
                    {STATUS_LABEL[order.status]}
                  </p>
                </td>
                <td
                  className="
                    px-5 py-4 text-right text-[13px] font-bold text-[#101319]
                    whitespace-nowrap
                  "
                >
                  {formatRupiah(order.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {orders.map((order) => (
          <button
            key={order.id}
            type="button"
            onClick={() => onOpen(order.id)}
            className="
              group w-full overflow-hidden rounded-[20px] border
              border-white/80 bg-white/95 p-4 text-left
              shadow-[0_6px_18px_rgba(32,36,45,0.05)] backdrop-blur-sm
              transition-all duration-200 active:scale-[0.99]
            "
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpen(order.id);
                  }}
                  className="
                    font-mono text-[12px] font-bold text-[#004ac6]
                    hover:underline
                  "
                >
                  #{order.orderNumber}
                </button>
                <p className="mt-0.5 truncate text-[11px] text-[#737686]">
                  {order.seller.storeName}
                </p>
              </div>
              <Icon
                name="chevronRight"
                size={15}
                className="shrink-0 text-[#A2A8B3]"
              />
            </div>

            <div className="mt-2.5 flex items-center justify-between gap-2">
              <span
                className={`
                  inline-flex items-center gap-1 rounded-full px-2.5 py-1
                  text-[10px] font-semibold ${historyStyle(order.status)}
                `}
              >
                {historyLabel(order.status)}
              </span>
              <span className="text-[12px] font-bold text-[#101319]">
                {formatRupiah(order.total)}
              </span>
            </div>

            <p className="mt-2 text-[10px] text-[#A2A8B3]">
              {dateTimeLabel(order.createdAt)}
            </p>
          </button>
        ))}
      </div>
    </>
  );
};

export default OrdersHistoryList;