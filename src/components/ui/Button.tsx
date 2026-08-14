// src/components/ui/Button.tsx
import React, { type ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'google' | 'apple' | 'danger' | 'success';
  fullWidth?: boolean;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  fullWidth = false,
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  const base =
    'inline-flex items-center justify-center rounded-full font-semibold transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-opacity-20 disabled:opacity-50';

  const sizeClasses = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-2.5 text-sm',
    lg: 'px-8 py-3 text-base',
  };

  const variants = {
    primary:
      'bg-[#538CDB] text-white hover:bg-[#467BC7] focus:ring-[#538CDB]',
    secondary:
      'bg-[#F5F5FF] text-[#538CDB] hover:bg-[#E8ECF8] focus:ring-[#538CDB] border border-[#E8ECF4]',
    outline:
      'bg-white text-[#538CDB] border border-[#538CDB] hover:bg-[#F5F5FF] focus:ring-[#538CDB]',
    google:
      'bg-white text-[#20242D] border border-[#E8ECF4] hover:border-[#538CDB] hover:bg-[#F5F5FF] focus:ring-[#538CDB]',
    apple:
      'bg-[#20242D] text-white hover:bg-[#3a3f4a] focus:ring-[#20242D] border border-[#20242D]',
    danger:
      'bg-[#FF4646] text-white hover:bg-[#E63E3E] focus:ring-[#FF4646]',
    success:
      'bg-[#2ECC71] text-white hover:bg-[#27AE60] focus:ring-[#2ECC71]',
  };

  return (
    <button
      className={`
        ${base}
        ${sizeClasses[size]}
        ${variants[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;