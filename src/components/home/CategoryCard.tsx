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

  imageUrl?: string | null;
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

  return 'grid';
};

interface CategoryCardProps {
  category: PopularCategory;
  rank: number;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, rank }) => {
  const isTopThree = rank <= 3;

  return (
    <Link
      to={`/categories/${category.slug}`}
      className="
        group relative block h-full overflow-hidden rounded-[24px] border
        border-white/80 bg-white/95 p-4 shadow-[0_8px_24px_rgba(32,36,45,0.06)]
        backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5
        hover:shadow-[0_14px_36px_rgba(32,36,45,0.10)]
        focus-visible:outline-2 focus-visible:outline-offset-2
        focus-visible:outline-[#004ac6]
      "
    >
      <span
        className="
          pointer-events-none absolute -right-10 -top-10 h-28 w-28
          rounded-full bg-[#004ac6]/10 opacity-0 blur-2xl
          transition-opacity duration-300 group-hover:opacity-100
        "
      />

      <span
        className="
          pointer-events-none absolute right-5 top-5 h-1.5 w-1.5
          rounded-full bg-[#FFD500]
        "
      />

      <span
        className="
          pointer-events-none absolute -bottom-6 -right-6 h-16 w-16
          rounded-full border border-[#004ac6]/10
        "
      />

      <div className="relative flex items-center gap-4">
        <span
          className="
            relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl
            shadow-[0_6px_16px_rgba(83,140,219,0.18)] ring-1 ring-[#e0e3e5]
          "
        >
          {category.imageUrl ? (
            <img
              src={category.imageUrl}
              alt={category.name}
              loading="lazy"
              draggable={false}
              className="
                h-full w-full select-none object-cover
                transition-transform duration-500 group-hover:scale-105
              "
            />
          ) : (
            <span
              className="
                relative flex h-full w-full items-center justify-center
                overflow-hidden bg-gradient-to-br from-[#004ac6] to-[#003ea8]
              "
            >
              <span className="pointer-events-none absolute -right-2 -top-2 h-6 w-6 rounded-full border border-white/25" />
              <span className="pointer-events-none absolute -bottom-3 -left-3 h-8 w-8 rounded-full border border-white/15" />
              <Icon
                name={getCategoryIcon(category.name, category.slug)}
                size={24}
                className="
                  text-white transition-transform duration-300
                  group-hover:scale-110
                "
              />
            </span>
          )}

          <span
            className={`
              absolute left-1.5 top-1.5 flex h-5 min-w-5 items-center
              justify-center rounded-full px-1 text-[9px] font-bold
              shadow-sm backdrop-blur-sm
              ${
                isTopThree
                  ? 'bg-[#FFD500] text-[#101319]'
                  : 'bg-white/90 text-[#004ac6]'
              }
            `}
          >
            {rank}
          </span>
        </span>

        <span className="min-w-0 flex-1">
          <span
            className="
              block truncate text-[15px] font-bold leading-tight
              text-[#101319] transition-colors duration-200
              group-hover:text-[#004ac6]
            "
          >
            {category.name}
          </span>

          <span className="mt-1.5 flex items-center gap-2 text-[11px]">
            <span className="text-[#737686]">
              {category.sold.toLocaleString('id-ID')} terjual
            </span>
            <span className="h-1 w-1 shrink-0 rounded-full bg-[#e0e3e5]" />
            <span className="truncate font-semibold text-[#004ac6]">
              Mulai {formatRupiah(category.cheapest)}
            </span>
          </span>
        </span>

        <span
          className="
            ml-auto shrink-0 translate-x-1 text-[#004ac6] opacity-0
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