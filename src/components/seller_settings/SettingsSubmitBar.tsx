import React from 'react';

import Icon from '../ui/Icon';

interface SettingsSubmitBarProps {
  saving: boolean;
  saved: boolean;
  error: string | null;
  onDismissError: () => void;
}

const SettingsSubmitBar: React.FC<SettingsSubmitBarProps> = ({
  saving,
  saved,
  error,
  onDismissError,
}) => (
  <div className="space-y-3">
    
    {error && (
      <div
        className="
          flex items-center gap-2.5 rounded-xl border border-[#FF4646]/20
          bg-[#FFF0F0] px-3 py-2.5
        "
      >
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#FF4646]/15">
          <Icon name="alert" size={12} className="text-[#FF4646]" />
        </span>
        <p className="flex-1 text-[11px] font-medium text-[#C73535]">
          {error}
        </p>
        <button
          type="button"
          onClick={onDismissError}
          className="shrink-0 text-[#C73535] hover:text-[#20242D]"
          aria-label="Tutup"
        >
          <Icon name="close" size={12} />
        </button>
      </div>
    )}

    {saved && !error && (
      <div
        className="
          flex items-center gap-2.5 rounded-xl border border-[#22C55E]/20
          bg-[#F0FDF4] px-3 py-2.5
        "
      >
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#22C55E]/15">
          <Icon name="check" size={12} className="text-[#22C55E]" />
        </span>
        <p className="text-[11px] font-medium text-[#166534]">
          Setelan toko udah tersimpan.
        </p>
      </div>
    )}

    <button
      type="submit"
      disabled={saving}
      className="
        inline-flex h-11 items-center justify-center gap-2 rounded-full
        bg-[#538CDB] px-6 text-[13px] font-semibold text-white
        shadow-[0_7px_18px_rgba(83,140,219,0.25)] transition-all duration-200
        hover:bg-[#467BC7] hover:shadow-[0_9px_22px_rgba(83,140,219,0.30)]
        active:scale-[0.99] disabled:cursor-not-allowed
        disabled:bg-[#A2A8B3] disabled:shadow-none
      "
    >
      {saving ? (
        <>
          <Icon name="clock" size={14} className="animate-spin" />
          Menyimpan…
        </>
      ) : (
        <>
          <Icon name="check" size={14} />
          Simpan Setelan
        </>
      )}
    </button>
  </div>
);

export default SettingsSubmitBar;