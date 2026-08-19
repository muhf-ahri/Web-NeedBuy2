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
          flex items-center gap-2.5 rounded-xl border border-[#ba1a1a]/20
          bg-[#FFF0F0] px-3 py-2.5
        "
      >
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#ba1a1a]/15">
          <Icon name="alert" size={12} className="text-[#ba1a1a]" />
        </span>
        <p className="flex-1 text-[11px] font-medium text-[#ba1a1a]">
          {error}
        </p>
        <button
          type="button"
          onClick={onDismissError}
          className="shrink-0 text-[#ba1a1a] hover:text-[#101319]"
          aria-label="Tutup"
        >
          <Icon name="close" size={12} />
        </button>
      </div>
    )}

    {saved && !error && (
      <div
        className="
          flex items-center gap-2.5 rounded-xl border border-[#12805c]/20
          bg-[#e6f4ee] px-3 py-2.5
        "
      >
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#12805c]/15">
          <Icon name="check" size={12} className="text-[#12805c]" />
        </span>
        <p className="text-[11px] font-medium text-[#12805c]">
          Setelan toko udah tersimpan.
        </p>
      </div>
    )}

    <button
      type="submit"
      disabled={saving}
      className="
        inline-flex h-11 items-center justify-center gap-2 rounded-full
        bg-[#4077a6] px-6 text-[13px] font-semibold text-white
        shadow-[0_7px_18px_rgba(83,140,219,0.25)] transition-all duration-200
        hover:bg-[#4077a6] hover:shadow-[0_9px_22px_rgba(83,140,219,0.30)]
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