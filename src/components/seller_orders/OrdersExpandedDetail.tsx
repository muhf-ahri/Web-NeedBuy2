import React from 'react';

import Icon from '../ui/Icon';
import { formatRupiah } from '../../utils/currency';
import type { SellerOrder } from '../../api/orders';

interface OrdersExpandedDetailProps {
  order: SellerOrder;
}

const OrdersExpandedDetail: React.FC<OrdersExpandedDetailProps> = ({ order }) => (
  <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
    
    <div>
      <div className="mb-2.5 flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#538CDB]/10">
          <Icon name="orders" size={12} className="text-[#538CDB]" />
        </span>
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#737A87]">
          Barang Dipesan
        </p>
      </div>

      <ul className="space-y-1.5">
        {order.items.map((item) => (
          <li
            key={item.id}
            className="
              flex items-start justify-between gap-3 rounded-xl bg-[#F5F7FB]/60
              px-3 py-2
            "
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-semibold text-[#20242D]">
                {item.productName}
              </p>
              <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-[#737A87]">
                <span>x{item.quantity}</span>
                {item.variant && (
                  <>
                    <span className="h-1 w-1 rounded-full bg-[#D8DEE9]" />
                    <span className="truncate">Model: {item.variant}</span>
                  </>
                )}
              </div>
            </div>
            <span className="shrink-0 text-[12px] font-bold text-[#20242D] tabular-nums">
              {formatRupiah(Number(item.subtotal))}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-2 space-y-1 border-t border-[#E8ECF4] pt-2">
        <div className="flex justify-between text-[11px]">
          <span className="text-[#737A87]">Subtotal</span>
          <span className="font-semibold text-[#20242D] tabular-nums">
            {formatRupiah(Number(order.subtotal))}
          </span>
        </div>
        <div className="flex justify-between text-[11px]">
          <span className="text-[#737A87]">Ongkir</span>
          <span className="font-semibold text-[#20242D] tabular-nums">
            {formatRupiah(Number(order.shippingCost))}
          </span>
        </div>
        <div className="flex justify-between border-t border-[#E8ECF4] pt-1 text-[12px]">
          <span className="font-bold text-[#20242D]">Total</span>
          <span className="font-extrabold text-[#538CDB] tabular-nums">
            {formatRupiah(Number(order.total))}
          </span>
        </div>
      </div>
    </div>

    <div>
      <div className="mb-2.5 flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#FFF7E0]">
          <Icon name="pin" size={12} className="text-[#B45309]" />
        </span>
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#737A87]">
          Alamat Pengiriman
        </p>
      </div>

      {order.address ? (
        <div className="rounded-xl border border-[#E8ECF4] bg-[#F5F7FB]/40 p-3.5">
          <p className="text-[13px] font-bold text-[#20242D]">
            {order.address.recipientName}
          </p>
          <p className="mt-1 text-[11px] font-medium text-[#538CDB]">
            {order.address.phone}
          </p>
          <p className="mt-2 text-[12px] leading-relaxed text-[#434655]">
            {order.address.fullAddress}
          </p>
          <p className="mt-1 text-[11px] text-[#737A87]">
            {order.address.city}, {order.address.province}{' '}
            <span className="font-semibold text-[#20242D]">
              {order.address.postalCode}
            </span>
          </p>
        </div>
      ) : (
        <div className="flex items-center gap-2 rounded-xl border border-dashed border-[#D8DEE9] bg-[#F5F7FB]/40 p-3.5 text-[12px] text-[#737A87]">
          <Icon name="alert" size={14} className="shrink-0 text-[#A2A8B3]" />
          Alamat tidak tersedia.
        </div>
      )}
    </div>
  </div>
);

export default OrdersExpandedDetail;