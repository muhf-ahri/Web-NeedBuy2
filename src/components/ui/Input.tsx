// src/components/ui/Input.tsx
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
        <label className="mb-1.5 block text-sm font-medium text-[#20242D]">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#737A87]">
            {icon}
          </div>
        )}
        <input
          className={`
            w-full rounded-xl border border-[#E8ECF4] bg-white
            px-3 py-2.5 text-sm text-[#20242D] outline-none
            transition-all duration-200
            placeholder:text-[#9AA1AD]
            focus:border-[#538CDB] focus:ring-4 focus:ring-[#538CDB]/20
            disabled:cursor-not-allowed disabled:bg-[#F8FAFF]
            ${icon ? 'pl-9' : ''}
            ${error ? 'border-[#FF4646] focus:border-[#FF4646] focus:ring-[#FF4646]/20' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-[#FF4646]">{error}</p>
      )}
    </div>
  );
};

export default Input;