import React from 'react';

interface OrdersHeaderProps {
  totalOrders: number;
  loading: boolean;
}

const OrdersHeader: React.FC<OrdersHeaderProps> = ({ totalOrders, loading }) => (
  <div>
    <div className="mb-2 flex items-center gap-2">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#538CDB]/10 px-2.5 py-1">
        <span className="h-1.5 w-1.5 rounded-full bg-[#FFD500]" />
        <p className="text-[9px] font-bold uppercase tracking-[0.20em] text-[#538CDB]">
          Pesanan Masuk
        </p>
      </span>
    </div>
    <h1 className="text-[22px] font-extrabold leading-tight tracking-tight text-[#20242D] sm:text-[28px]">
      Order Toko
    </h1>
    <p className="mt-1 max-w-xl text-[12px] leading-relaxed text-[#737A87] sm:text-[13px]">
      {loading ? (
        'Memuat order...'
      ) : (
        <>
          <span className="font-bold text-[#20242D] tabular-nums">
            {totalOrders}
          </span>{' '}
          order masuk ke toko kamu
        </>
      )}
    </p>
  </div>
);

export default OrdersHeader;