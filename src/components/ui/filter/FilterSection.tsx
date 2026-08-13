// src/components/ui/FilterSection.tsx
import React from 'react';

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
}

const FilterSection: React.FC<FilterSectionProps> = ({ title, children }) => (
  <div className="py-4 border-b border-[#e0e3e5] last:border-0">
    <p className="text-[11px] font-bold text-[#737686] uppercase tracking-wider mb-3">{title}</p>
    {children}
  </div>
);

export default FilterSection;