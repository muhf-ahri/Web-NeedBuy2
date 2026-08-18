import React from 'react';

import Icon from '../ui/Icon';

interface ChatsSearchProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

const ChatsSearch: React.FC<ChatsSearchProps> = ({
  value,
  onChange,
  placeholder = 'Cari pembeli...',
}) => (
  <div className="relative">
    <Icon
      name="search"
      size={15}
      className="
        pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2
        text-[#A2A8B3]
      "
    />
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="
        w-full rounded-full border border-[#E8ECF4] bg-[#F5F7FB] py-2
        pl-9 pr-9 text-[12px] text-[#20242D] outline-none
        placeholder:text-[#A2A8B3] transition-all duration-200
        focus:border-[#538CDB] focus:bg-white
        focus:shadow-[0_4px_12px_rgba(83,140,219,0.10)]
      "
    />
    {value && (
      <button
        type="button"
        onClick={() => onChange('')}
        className="
          absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2
          items-center justify-center rounded-full text-[#A2A8B3]
          transition-colors hover:bg-white hover:text-[#20242D]
        "
        aria-label="Hapus pencarian"
      >
        <Icon name="close" size={12} />
      </button>
    )}
  </div>
);

export default ChatsSearch;