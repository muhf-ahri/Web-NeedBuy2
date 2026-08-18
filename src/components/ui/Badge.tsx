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
    blue: 'bg-[#F5F5FF] text-[#538CDB]',
    yellow: 'bg-[#FFFCD5] text-[#7A6500]',
    coral: 'bg-[#FFF0F0] text-[#FF4646]',
    gray: 'bg-[#F8FAFF] text-[#737A87]',
    green: 'bg-[#E8F9F0] text-[#2ECC71]',
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