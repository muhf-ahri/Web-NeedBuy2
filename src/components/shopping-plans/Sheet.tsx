import React, { useEffect } from 'react';

import Icon from '../ui/Icon';

interface SheetProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
}

const Sheet: React.FC<SheetProps> = ({
  title,
  onClose,
  children,
  maxWidth = 'max-w-lg',
}) => {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

      <div
        className="absolute inset-0 bg-[#20242D]/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className={`
          sheet-enter relative flex w-full ${maxWidth} flex-col
          overflow-hidden rounded-[24px] border border-white/80
          bg-white/98 shadow-[0_18px_50px_rgba(32,36,45,0.20)]
          backdrop-blur-sm max-h-[88vh]
        `}
      >
        <div
          className="
            flex items-center justify-between border-b border-[#E8ECF4]
            px-5 py-4
          "
        >
          <div className="flex items-center gap-2.5">
            <span
              className="
                flex h-8 w-8 items-center justify-center rounded-lg
                bg-[#538CDB]/10
              "
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#FFD500]" />
            </span>
            <h3 className="text-[15px] font-bold text-[#20242D]">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="
              flex h-8 w-8 items-center justify-center rounded-full
              text-[#737A87] transition-colors hover:bg-[#F5F7FB]
              hover:text-[#20242D]
            "
            aria-label="Tutup"
          >
            <Icon name="close" size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5">
          {children}
        </div>
      </div>

      <style>{`
        @keyframes sheet-enter {
          0% { opacity: 0; transform: translateY(8px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .sheet-enter {
          animation: sheet-enter 0.22s cubic-bezier(0.22, 0.9, 0.35, 1) both;
        }
      `}</style>
    </div>
  );
};

export default Sheet;