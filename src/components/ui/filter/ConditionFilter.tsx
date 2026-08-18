import React from 'react';

import Icon from '../Icon';

interface ConditionFilterProps {
  options: string[];
  selected: string[];
  onChange: (condition: string) => void;
}

const ConditionFilter: React.FC<ConditionFilterProps> = ({
  options,
  selected,
  onChange,
}) => {
  if (options.length === 0) {
    return (
      <p className="py-3 text-center text-[11px] text-[#A2A8B3]">
        Tidak ada pilihan kondisi.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((cond) => {
        const active = selected.includes(cond);
        return (
          <button
            key={cond}
            type="button"
            onClick={() => onChange(cond)}
            className={`
              inline-flex items-center gap-1.5 rounded-full border px-3.5
              py-1.5 text-[12px] font-semibold transition-all duration-200
              active:scale-[0.98]
              ${
                active
                  ? 'border-[#538CDB] bg-[#538CDB] text-white shadow-[0_4px_12px_rgba(83,140,219,0.25)]'
                  : 'border-[#E8ECF4] bg-white text-[#20242D] hover:border-[#538CDB]/40 hover:text-[#538CDB]'
              }
            `}
          >
            {active && <Icon name="check" size={12} className="text-white" />}
            {cond}
          </button>
        );
      })}
    </div>
  );
};

export default ConditionFilter;