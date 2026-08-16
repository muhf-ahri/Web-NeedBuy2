import React from 'react';

import Icon from '../ui/Icon';

interface OrdersHeroProps {
  totalCount: number;
  loading?: boolean;
}

const OrdersHero: React.FC<OrdersHeroProps> = ({ totalCount, loading }) => (
  <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
    <div className="min-w-0">
      <div className="mb-2 flex items-center gap-2">
        <span
          className="
            inline-flex items-center gap-1.5 rounded-full bg-[#538CDB]/10
            px-2.5 py-1
          "
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#FFD500]" />
          <p
            className="
              text-[9px] font-bold uppercase tracking-[0.20em] text-[#538CDB]
            "
          >
            Pesanan saya
          </p>
        </span>
      </div>

      <h1
        className="
          text-[26px] font-extrabold leading-tight tracking-tight
          text-[#20242D] sm:text-[32px]
        "
      >
        Pesanan Saya
      </h1>
      <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-[#737A87]">
        Pantau semua pesananmu di satu tempat — dari menunggu pembayaran
        sampai selesai diulas.
        {!loading && (
          <>
            {' '}
            Saat ini kamu punya{' '}
            <span className="font-bold text-[#20242D]">{totalCount}</span>{' '}
            pesanan.
          </>
        )}
      </p>
    </div>
  </div>
);

export default OrdersHero;