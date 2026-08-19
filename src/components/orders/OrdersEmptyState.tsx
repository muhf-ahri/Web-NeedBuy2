import React from 'react';
import { useNavigate } from 'react-router-dom';

import Icon from '../ui/Icon';

interface OrdersEmptyStateProps {
  tab: string;
}

const OrdersEmptyState: React.FC<OrdersEmptyStateProps> = ({ tab }) => {
  const navigate = useNavigate();

  return (
    <div
      className="
        rounded-[24px] border border-dashed border-[#e0e3e5] bg-white/70
        py-16 text-center backdrop-blur-sm
      "
    >
      <div
        className="
          mx-auto flex h-16 w-16 items-center justify-center rounded-full
          bg-gradient-to-br from-[#538cbd] to-[#284a67]
          shadow-[0_8px_20px_rgba(83,140,219,0.30)]
        "
      >
        <Icon name="orders" size={24} className="text-white" />
      </div>
      <p className="mt-4 text-[16px] font-bold text-[#101319]">
        Belum ada pesanan di sini
      </p>
      <p className="mx-auto mt-1 max-w-sm text-[13px] text-[#737686]">
        {tab === 'HISTORY'
          ? 'Riwayat pesanan yang sudah selesai atau dibatalkan akan muncul di sini.'
          : `Tidak ada pesanan dengan status "${tab}". Mulai belanja untuk bikin pesanan pertamamu.`}
      </p>
      <button
        type="button"
        onClick={() => navigate('/categories')}
        className="
          mt-5 inline-flex items-center gap-2 rounded-full bg-[#4077a6]
          px-5 py-2.5 text-[13px] font-semibold text-white
          shadow-[0_7px_18px_rgba(83,140,219,0.25)] transition-all
          hover:bg-[#4077a6] hover:shadow-[0_9px_22px_rgba(83,140,219,0.30)]
          active:scale-[0.99]
        "
      >
        <Icon name="grid" size={14} />
        Mulai Belanja
      </button>
    </div>
  );
};

export default OrdersEmptyState;