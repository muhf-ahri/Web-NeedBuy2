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
    default: 'bg-white border border-[#E8ECF4]',
    blue: 'bg-white border border-[#538CDB] shadow-sm shadow-[#538CDB]/5',
    yellow: 'bg-white border border-[#FFD500] shadow-sm shadow-[#FFD500]/5',
    coral: 'bg-white border border-[#FF4646] shadow-sm shadow-[#FF4646]/5',
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