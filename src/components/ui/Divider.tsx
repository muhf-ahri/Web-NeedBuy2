import React from 'react';

interface DividerProps {
  text?: string;
}

const Divider: React.FC<DividerProps> = ({
  text = 'atau',
}) => {
  return (
    <div className="my-5 flex items-center gap-3">

      <div className="h-px flex-1 bg-[#E8ECF4]" />

      <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#A0A6B1]">
        {text}
      </span>

      <div className="h-px flex-1 bg-[#E8ECF4]" />

    </div>
  );
};

export default Divider;