import React from 'react';

import Icon from '../ui/Icon';
import type { InventStats } from '../../api/invent';

interface ProductsStatsCardsProps {
  stats: InventStats | null;
  loading: boolean;
}

const ProductsStatsCards: React.FC<ProductsStatsCardsProps> = ({
  stats,
  loading,
}) => {
  const cards = [
    {
      title: 'Produk Tayang',
      value: stats?.active ?? '—',
      icon: 'eye' as const,
      iconBg: 'bg-[#F0FDF4]',
      iconText: 'text-[#166534]',
      valueColor: 'text-[#20242D]',
      accent: '#22C55E',
    },
    {
      title: 'Stok Habis',
      value: stats?.outOfStock ?? '—',
      icon: 'alert' as const,
      iconBg: 'bg-[#FFF0F0]',
      iconText: 'text-[#FF4646]',
      valueColor: 'text-[#FF4646]',
      accent: '#FF4646',
    },
    {
      title: 'Draf',
      value: stats?.drafts ?? '—',
      icon: 'edit' as const,
      iconBg: 'bg-[#F5F7FB]',
      iconText: 'text-[#737A87]',
      valueColor: 'text-[#20242D]',
      accent: '#A2A8B3',
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="
            relative overflow-hidden rounded-[20px] border border-white/80
            bg-white/95 p-3 shadow-[0_6px_18px_rgba(32,36,45,0.05)]
            backdrop-blur-sm transition-all duration-200
            hover:-translate-y-0.5 hover:shadow-[0_10px_26px_rgba(32,36,45,0.08)]
            sm:p-4
          "
        >
          {/* Dekorasi titik kuning */}
          <span
            className="
              pointer-events-none absolute right-3 top-3 h-1 w-1
              rounded-full bg-[#FFD500]
            "
          />

          <div className="flex items-start justify-between gap-2">
            <span
              className={`
                flex h-8 w-8 shrink-0 items-center justify-center
                rounded-lg ${card.iconBg} ${card.iconText}
              `}
            >
              <Icon name={card.icon} size={14} />
            </span>
            <span
              className="
                hidden h-1.5 w-1.5 rounded-full sm:block
              "
              style={{ backgroundColor: card.accent }}
            />
          </div>

          <p
            className="
              mt-2 text-[9px] font-bold uppercase tracking-[0.14em]
              text-[#737A87] sm:text-[10px]
            "
          >
            {card.title}
          </p>

          {loading ? (
            <div className="mt-1 h-7 w-10 animate-pulse rounded-full bg-[#F5F7FB]" />
          ) : (
            <p
              className={`
                mt-0.5 text-[20px] font-extrabold leading-none
                tabular-nums ${card.valueColor} sm:text-[24px]
              `}
            >
              {card.value}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProductsStatsCards;