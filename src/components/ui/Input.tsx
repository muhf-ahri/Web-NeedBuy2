import React, { type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-[#101319]">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#737686]">
            {icon}
          </div>
        )}
        <input
          className={`
            w-full rounded-xl border border-[#e0e3e5] bg-white
            px-3 py-2.5 text-sm text-[#101319] outline-none
            transition-all duration-200
            placeholder:text-[#737686]
            focus:border-[#004ac6] focus:ring-4 focus:ring-[#004ac6]/20
            disabled:cursor-not-allowed disabled:bg-[#f5f7fb]
            ${icon ? 'pl-9' : ''}
            ${error ? 'border-[#ba1a1a] focus:border-[#ba1a1a] focus:ring-[#ba1a1a]/20' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-[#ba1a1a]">{error}</p>
      )}
    </div>
  );
};

export default Input;