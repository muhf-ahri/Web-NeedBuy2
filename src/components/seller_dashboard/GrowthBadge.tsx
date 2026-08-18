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
        ${up ? 'bg-[#DCFCE7] text-[#166534]' : 'bg-[#FFF0F0] text-[#C73535]'}
      `}
    >
      <Icon
        name={up ? 'arrowUp' : 'arrowDown'}
        size={10}
        className={up ? 'text-[#22C55E]' : 'text-[#FF4646]'}
      />
      {up ? '+' : ''}
      {value.toFixed(1)}%
      {label && (
        <span className={up ? 'text-[#166534]/70' : 'text-[#C73535]/70'}>
          {label}
        </span>
      )}
    </span>
  );
};

export default GrowthBadge;