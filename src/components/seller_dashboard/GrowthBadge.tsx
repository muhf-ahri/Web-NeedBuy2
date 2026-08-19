import React from 'react';

import Icon from '../ui/Icon';

interface GrowthBadgeProps {
  value: number;
  label?: string;
}

const GrowthBadge: React.FC<GrowthBadgeProps> = ({ value, label }) => {
  const up = value >= 0;

  return (
    <span
      className={`
        inline-flex items-center gap-1 rounded-full px-2 py-0.5
        text-[10px] font-bold tabular-nums
        ${up ? 'bg-[#e6f4ee] text-[#12805c]' : 'bg-[#FFF0F0] text-[#ba1a1a]'}
      `}
    >
      <Icon
        name={up ? 'arrowUp' : 'arrowDown'}
        size={10}
        className={up ? 'text-[#12805c]' : 'text-[#ba1a1a]'}
      />
      {up ? '+' : ''}
      {value.toFixed(1)}%
      {label && (
        <span className={up ? 'text-[#12805c]/70' : 'text-[#ba1a1a]/70'}>
          {label}
        </span>
      )}
    </span>
  );
};

export default GrowthBadge;