import React from 'react';
import { Link } from 'react-router-dom';

import Icon, { type IconName } from '../ui/Icon';
import { formatRupiah } from '../../utils/currency';

export type PopularCategory = {
  name: string;
  slug: string;
  sold: number;
  products: number;
  cheapest: number;
};

const getCategoryIcon = (name: string, slug: string): IconName => {
  const key = (name + slug).toLowerCase();

  if (
    key.includes('tech') ||
    key.includes('elektro') ||
    key.includes('computer') ||
    key.includes('device')
  ) {
    return 'grid';
  }

  if (
    key.includes('habitat') ||
    key.includes('home') ||
    key.includes('furnish') ||
    key.includes('office')
  ) {
    return 'home';
  }

  if (
    key.includes('culin') ||
    key.includes('kitchen') ||
    key.includes('food') ||
    key.includes('masak')
  ) {
    return 'orders';
  }

  if (
    key.includes('apparel') ||
    key.includes('cloth') ||
    key.includes('fashion') ||
    key.includes('pakaian')
  ) {
    return 'tag';
  }

  if (
    key.includes('maintenance') ||
    key.includes('tool') ||
    key.includes('repair') ||
    key.includes('perawatan')
  ) {
    return 'plan';
  }

  return 'spark';
};

interface CategoryCardProps {
  category: PopularCategory;
  rank: number;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, rank }) => {
  return (
    <Link
      to={`/categories/${category.slug}`}
      className="
        group relative overflow-hidden rounded-[24px] border border-white/80
        bg-white/95 p-4 shadow-[0_12px_32px_rgba(32,36,45,0.06)]
        backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5
        hover:shadow-[0_18px_44px_rgba(32,36,45,0.10)]
        focus-visible:outline-2 focus-visible:outline-offset-2
        focus-visible:outline-[#538CDB]
      "
    >
      {/* Hover glow — biru brand, soft */}
      <span
        className="
          pointer-events-none absolute -right-10 -top-10 h-28 w-28
          rounded-full bg-[#538CDB]/10 opacity-0 blur-2xl
          transition-opacity duration-300 group-hover:opacity-100
        "
      />

      {/* Dekorasi: circle border tipis di pojok (sama seperti card Login/NeedPay) */}
      <span
        className="
          pointer-events-none absolute -right-6 -top-6 h-16 w-16
          rounded-full border border-[#538CDB]/10
        "
      />
      <span
        className="
          pointer-events-none absolute right-6 top-6 h-1.5 w-1.5
          rounded-full bg-[#FFD500]
        "
      />

      <div className="relative flex items-center gap-4">
        {/* Icon container — gradient biru (sama seperti logo "N" Navbar) */}
        <span
          className="
            relative flex h-12 w-12 shrink-0 items-center justify-center
            overflow-hidden rounded-xl bg-gradient-to-br from-[#5B93E0]
            to-[#3A66AC] text-white shadow-[0_4px_12px_rgba(83,140,219,0.25)]
            transition-all duration-300 group-hover:-translate-y-0.5
            group-hover:shadow-[0_6px_16px_rgba(83,140,219,0.30)]
          "
        >
          {/* Decorative circle kecil di pojok (callback ke logo "N") */}
          <span
            className="
              pointer-events-none absolute -right-1 -top-1 h-3 w-3
              rounded-full border border-white/25
            "
          />
          <Icon
            name={getCategoryIcon(category.name, category.slug)}
            size={21}
            className="text-white"
          />

          {/* Badge rank — dengan aksen kuning di pinggir */}
          <span
            className="
              absolute -left-2 -top-2 flex h-5 w-5 items-center
              justify-center rounded-full border-2 border-white bg-[#538CDB]
              text-[9px] font-bold text-white shadow-[0_2px_8px_rgba(83,140,219,0.30)]
            "
          >
            {rank}
            {/* Titik kuning kecil di pinggir badge (callback ke elemen dekoratif) */}
            <span className="pointer-events-none absolute -right-0.5 top-0.5 h-1 w-1 rounded-full bg-[#FFD500]" />
          </span>
        </span>

        {/* Content */}
        <span className="min-w-0 flex-1">
          <span
            className="
              block truncate text-[14px] font-bold leading-tight
              text-[#20242D] transition-colors duration-200
              group-hover:text-[#538CDB]
            "
          >
            {category.name}
          </span>

          <span className="mt-1 block text-[11px] text-[#737A87]">
            {category.sold.toLocaleString('id-ID')} terjual
          </span>

          <span className="mt-0.5 block text-[11px] font-semibold text-[#538CDB]">
            Mulai {formatRupiah(category.cheapest)}
          </span>
        </span>

        {/* Arrow — muncul saat hover */}
        <span
          className="
            ml-auto shrink-0 translate-x-1 text-[#538CDB] opacity-0
            transition-all duration-300 group-hover:translate-x-0
            group-hover:opacity-100
          "
        >
          <Icon name="arrowRight" size={16} />
        </span>
      </div>
    </Link>
  );
};

export default CategoryCard;