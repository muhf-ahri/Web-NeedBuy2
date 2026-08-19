import React from 'react';

import Icon from '../ui/Icon';

interface SearchErrorBannerProps {
  message: string;
  variant?: 'error' | 'warning';
}

const SearchErrorBanner: React.FC<SearchErrorBannerProps> = ({
  message,
  variant = 'error',
}) => {
  const style =
    variant === 'error'
      ? {
          border: 'border-[#ba1a1a]/20',
          bg: 'bg-[#FFF0F0]',
          icon: 'bg-[#ba1a1a]/15',
          iconColor: 'text-[#ba1a1a]',
          text: 'text-[#ba1a1a]',
        }
      : {
          border: 'border-[#FFD500]/30',
          bg: 'bg-[#FFF7E0]',
          icon: 'bg-[#FFD500]/20',
          iconColor: 'text-[#B45309]',
          text: 'text-[#B45309]',
        };

  return (
    <div
      className={`
        mb-4 flex items-center gap-3 rounded-2xl border ${style.border}
        ${style.bg} px-4 py-3 backdrop-blur-sm
      `}
    >
      <span
        className={`
          flex h-8 w-8 shrink-0 items-center justify-center rounded-full
          ${style.icon}
        `}
      >
        <Icon name="alert" size={15} className={style.iconColor} />
      </span>
      <p className={`text-[13px] font-medium ${style.text}`}>{message}</p>
    </div>
  );
};

export default SearchErrorBanner;