import React from 'react';

interface DividerProps {
  text?: string;
}

const Divider: React.FC<DividerProps> = ({
  text = 'atau',
}) => {
  return (
    <div className="my-5 flex items-center gap-3">

      <div className="h-px flex-1 bg-[#e0e3e5]" />

      <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#a2a8b3]">
        {text}
      </span>

      <div className="h-px flex-1 bg-[#e0e3e5]" />

    </div>
  );
};

export default Divider;