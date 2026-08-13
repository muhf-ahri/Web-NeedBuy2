// src/components/ui/filter/ConditionFilter.tsx
import React from 'react';

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
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((cond) => {
        const active = selected.includes(cond);
        return (
          <button
            key={cond}
            onClick={() => onChange(cond)}
            className={`px-3 py-1 rounded-full text-[12px] font-medium border transition-colors duration-200 ${
              active
                ? 'bg-[#191c1e] text-white border-[#191c1e]'
                : 'bg-white text-[#434655] border-[#c3c6d7] hover:border-[#004ac6] hover:text-[#004ac6]'
            }`}
          >
            {cond}
          </button>
        );
      })}
    </div>
  );
};

export default ConditionFilter;