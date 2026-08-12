import React from 'react';

const Divider: React.FC<{ text?: string }> = ({ text = 'ATAU LANJUT PAKAI' }) => {
  return (
    <div className="relative my-4">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-300" />
      </div>
      <div className="relative flex justify-center text-xs">
        <span className="px-2 bg-white text-gray-400">{text}</span>
      </div>
    </div>
  );
};

export default Divider;