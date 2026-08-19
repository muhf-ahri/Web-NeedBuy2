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
      'bg-[#004ac6] text-white hover:bg-[#004ac6] focus:ring-[#004ac6]',
    secondary:
      'bg-[#f5f7fb] text-[#004ac6] hover:bg-[#f5f7fb] focus:ring-[#004ac6] border border-[#e0e3e5]',
    outline:
      'bg-white text-[#004ac6] border border-[#004ac6] hover:bg-[#f5f7fb] focus:ring-[#004ac6]',
    google:
      'bg-white text-[#101319] border border-[#e0e3e5] hover:border-[#004ac6] hover:bg-[#f5f7fb] focus:ring-[#004ac6]',
    apple:
      'bg-[#101319] text-white hover:bg-[#434655] focus:ring-[#101319] border border-[#101319]',
    danger:
      'bg-[#ba1a1a] text-white hover:bg-[#ba1a1a] focus:ring-[#ba1a1a]',
    success:
      'bg-[#12805c] text-white hover:bg-[#12805c] focus:ring-[#12805c]',
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