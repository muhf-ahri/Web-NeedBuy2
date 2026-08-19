import React, { useRef } from 'react';

import Icon from '../ui/Icon';
import { ACCEPTED_IMAGE_TYPES } from '../../api/uploads';

interface LogoUploaderProps {
  logoUrl: string;
  uploading: boolean;
  onPick: (file: File) => void;
  onRemove: () => void;
}

const LogoUploader: React.FC<LogoUploaderProps> = ({
  logoUrl,
  uploading,
  onPick,
  onRemove,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (file) onPick(file);
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      
      <div
        className="
          relative flex h-24 w-24 shrink-0 items-center justify-center
          overflow-hidden rounded-2xl bg-gradient-to-br from-[#004ac6]/10
          to-[#003ea8]/10 ring-2 ring-[#e0e3e5] transition-all
          sm:h-28 sm:w-28
        "
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-1.5">
            <Icon name="clock" size={20} className="animate-spin text-[#004ac6]" />
            <span className="text-[9px] font-bold uppercase tracking-wider text-[#004ac6]">
              Upload
            </span>
          </div>
        ) : logoUrl ? (
          <img
            src={logoUrl}
            alt="Logo toko"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-1">
            <Icon name="upload" size={22} className="text-[#A2A8B3]" />
            <span className="text-[9px] font-bold uppercase tracking-wider text-[#A2A8B3]">
              Logo
            </span>
          </div>
        )}

        {logoUrl && !uploading && (
          <span
            className="
              pointer-events-none absolute right-1 top-1 h-2 w-2
              rounded-full bg-[#FFD500] ring-2 ring-white
            "
          />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_IMAGE_TYPES.join(',')}
          onChange={handleChange}
          className="hidden"
        />

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="
              inline-flex h-9 items-center gap-1.5 rounded-full border
              border-[#e0e3e5] bg-white px-4 text-[12px] font-semibold
              text-[#101319] transition-all duration-200 hover:border-[#004ac6]
              hover:text-[#004ac6] active:scale-[0.98]
              disabled:cursor-not-allowed disabled:opacity-50
            "
          >
            <Icon name="upload" size={13} />
            {uploading ? 'Mengunggah…' : 'Pilih Berkas'}
          </button>

          {logoUrl && !uploading && (
            <button
              type="button"
              onClick={onRemove}
              className="
                inline-flex h-9 items-center gap-1.5 rounded-full border
                border-transparent px-3 text-[12px] font-semibold
                text-[#ba1a1a] transition-all duration-200
                hover:bg-[#FFF0F0]
              "
            >
              <Icon name="trash" size={12} />
              Hapus
            </button>
          )}
        </div>

        <p className="mt-2 text-[11px] leading-relaxed text-[#737686]">
          Format PNG, JPG, WebP, atau GIF, maksimal 3 MB. Logo akan disimpan bersama
          setelan lainnya saat kamu tekan <span className="font-semibold text-[#004ac6]">Simpan</span>.
        </p>
      </div>
    </div>
  );
};

export default LogoUploader;