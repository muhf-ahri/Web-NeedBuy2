import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'blue' | 'yellow' | 'coral' | 'ghost';
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
}) => {
  const variantClasses = {
    default: 'bg-white border border-[#e0e3e5]',
    blue: 'bg-white border border-[#004ac6] shadow-sm shadow-[#004ac6]/5',
    yellow: 'bg-white border border-[#FFD500] shadow-sm shadow-[#FFD500]/5',
    coral: 'bg-white border border-[#ba1a1a] shadow-sm shadow-[#ba1a1a]/5',
    ghost: 'bg-transparent border-0',
  };

  return (
    <div
      className={`
        rounded-2xl p-6 shadow-sm transition-all duration-200 hover:shadow-md
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;