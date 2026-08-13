// src/components/ui/filter/PriceRangeFilter.tsx
import React from 'react';
import PriceRangeInput from './PriceRangeInput';

interface PriceRangeFilterProps {
  minValue: string;
  maxValue: string;
  onMinChange: (value: string) => void;
  onMaxChange: (value: string) => void;
  minPlaceholder?: string;
  maxPlaceholder?: string;
}

const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
  minPlaceholder = '0',
  maxPlaceholder = 'Maks',
}) => {
  return (
    <PriceRangeInput
      minValue={minValue}
      maxValue={maxValue}
      onMinChange={onMinChange}
      onMaxChange={onMaxChange}
      minPlaceholder={minPlaceholder}
      maxPlaceholder={maxPlaceholder}
    />
  );
};

export default PriceRangeFilter;