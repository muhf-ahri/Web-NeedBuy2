import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'blue' | 'yellow' | 'coral' | 'gray' | 'green';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'blue',
  className = '',
}) => {
  const variants = {
    blue: 'bg-[#f5f7fb] text-[#004ac6]',
    yellow: 'bg-[#fff7e0] text-[#b45309]',
    coral: 'bg-[#FFF0F0] text-[#ba1a1a]',
    gray: 'bg-[#f5f7fb] text-[#737686]',
    green: 'bg-[#e6f4ee] text-[#12805c]',
  };

  return (
    <span
      className={`
        inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
};

export default Badge;