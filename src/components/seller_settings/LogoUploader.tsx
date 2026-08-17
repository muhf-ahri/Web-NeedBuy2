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
      {/* Preview / placeholder */}
      <div
        className="
          relative flex h-24 w-24 shrink-0 items-center justify-center
          overflow-hidden rounded-2xl bg-gradient-to-br from-[#5B93E0]/10
          to-[#3A66AC]/10 ring-2 ring-[#E8ECF4] transition-all
          sm:h-28 sm:w-28
        "
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-1.5">
            <Icon name="clock" size={20} className="animate-spin text-[#538CDB]" />
            <span className="text-[9px] font-bold uppercase tracking-wider text-[#538CDB]">
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

        {/* Dekorasi titik kuning saat ada logo */}
        {logoUrl && !uploading && (
          <span
            className="
              pointer-events-none absolute right-1 top-1 h-2 w-2
              rounded-full bg-[#FFD500] ring-2 ring-white
            "
          />
        )}
      </div>

      {/* Aksi */}
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
              border-[#E8ECF4] bg-white px-4 text-[12px] font-semibold
              text-[#20242D] transition-all duration-200 hover:border-[#538CDB]
              hover:text-[#538CDB] active:scale-[0.98]
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
                text-[#FF4646] transition-all duration-200
                hover:bg-[#FFF0F0]
              "
            >
              <Icon name="trash" size={12} />
              Hapus
            </button>
          )}
        </div>

        <p className="mt-2 text-[11px] leading-relaxed text-[#737A87]">
          PNG, JPG, WebP, atau GIF — maks 3 MB. Logo akan disimpan bersama
          setelan lainnya saat kamu tekan <span className="font-semibold text-[#538CDB]">Simpan</span>.
        </p>
      </div>
    </div>
  );
};

export default LogoUploader;