// src/components/home/CategoryCard.tsx
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

const getCategoryIcon = (
  name: string,
  slug: string
): IconName => {
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

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  rank,
}) => {
  return (
    <Link
      to={`/categories/${category.slug}`}
      className="
        group relative overflow-hidden
        rounded-[22px]
        border border-white/70
        bg-white/70
        p-4
        shadow-[0_8px_30px_rgba(52,91,140,0.07)]
        backdrop-blur-md
        transition-all duration-300
        hover:-translate-y-1
        hover:bg-white
        hover:shadow-[0_16px_38px_rgba(52,91,140,0.13)]
        focus-visible:outline-2
        focus-visible:outline-offset-2
        focus-visible:outline-[#004ac6]
      "
    >
      {/* Hover glow */}
      <span
        className="
          pointer-events-none
          absolute -right-10 -top-10
          h-24 w-24
          rounded-full
          bg-[#dceaff]
          opacity-0
          blur-2xl
          transition-opacity duration-300
          group-hover:opacity-100
        "
      />

      <div className="relative flex items-center gap-4">
        {/* Icon */}
        <span
          className="
            relative flex h-12 w-12 shrink-0
            items-center justify-center
            rounded-2xl
            bg-[#edf4ff]
            text-[#004ac6]
            transition-all duration-300
            group-hover:bg-[#004ac6]
            group-hover:text-white
            group-hover:shadow-[0_8px_18px_rgba(0,74,198,0.22)]
          "
        >
          <Icon
            name={getCategoryIcon(
              category.name,
              category.slug
            )}
            size={21}
          />

          <span
            className="
              absolute -left-2 -top-2
              flex h-5 w-5
              items-center justify-center
              rounded-full
              border-2 border-white
              bg-[#004ac6]
              text-[9px]
              font-bold
              text-white
            "
          >
            {rank}
          </span>
        </span>

        {/* Content */}
        <span className="min-w-0">
          <span
            className="
              block truncate
              text-[14px]
              font-bold
              leading-tight
              text-[#191c1e]
              transition-colors
              group-hover:text-[#004ac6]
            "
          >
            {category.name}
          </span>

          <span className="mt-1 block text-[11px] text-[#737686]">
            {category.sold.toLocaleString('id-ID')} terjual
          </span>

          <span className="mt-0.5 block text-[11px] font-semibold text-[#004ac6]">
            Mulai {formatRupiah(category.cheapest)}
          </span>
        </span>

        {/* Arrow */}
        <span
          className="
            ml-auto shrink-0
            translate-x-1
            text-[#004ac6]
            opacity-0
            transition-all duration-300
            group-hover:translate-x-0
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