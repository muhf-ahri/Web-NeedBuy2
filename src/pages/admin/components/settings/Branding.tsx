import React, { useRef, useState } from 'react';
import Icon from '../../../../components/ui/Icon';
import Button from '../../../../components/ui/Button';
import { CONFIG_KEYS, type ConfigKey } from '../../../../api/admin';
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_BYTES, uploadImage } from '../../../../api/uploads';
import type { SettingsCardProps } from '../../SettingsPage';

type Slot = {
  key: ConfigKey;
  title: string;
  hint: string;
  box: string;
  emptyIcon: 'upload' | 'image';
};

const SLOTS: Slot[] = [
  {
    key: CONFIG_KEYS.BRAND_LOGO_URL,
    title: 'Logo Utama',
    hint: 'PNG, JPG, WebP, atau GIF, maksimal 3 MB. Rasio 1:1 paling aman.',
    box: 'h-28 w-28 rounded-2xl',
    emptyIcon: 'upload',
  },
  {
    key: CONFIG_KEYS.BRAND_FAVICON_URL,
    title: 'Favicon',
    hint: 'PNG, JPG, WebP, atau GIF, maksimal 3 MB. Ukuran 32×32 px direkomendasikan.',
    box: 'h-20 w-20 rounded-xl',
    emptyIcon: 'image',
  },
];

const Branding: React.FC<SettingsCardProps> = ({ values, onSave }) => {
  const [busyKey, setBusyKey] = useState<ConfigKey | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRefs = useRef<Partial<Record<ConfigKey, HTMLInputElement | null>>>({});

  const store = async (key: ConfigKey, url: string) => {
    setBusyKey(key);
    setError(null);
    try {
      await onSave({ [key]: url });
    } catch (err: any) {
      setError(err?.message ?? 'Gagal simpan, coba lagi ya');
    } finally {
      setBusyKey(null);
    }
  };

  const handlePick = async (key: ConfigKey, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    e.target.value = '';
    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setError('Formatnya harus PNG, JPG, WebP, atau GIF ya. SVG belum didukung.');
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setError(`Ukuran berkasnya ${(file.size / 1024 / 1024).toFixed(1)} MB, maksimalnya 3 MB.`);
      return;
    }

    setBusyKey(key);
    setError(null);
    try {
      const res = await uploadImage(file);
      await onSave({ [key]: res.data.data.url });
    } catch (err: any) {
      setError(err?.message ?? 'Gagal unggah berkas, coba lagi ya');
    } finally {
      setBusyKey(null);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg border border-[#ffdad6] bg-[#fff0f0] p-2.5 text-xs text-[#93000a]">
          {error}
        </div>
      )}

      {SLOTS.map((slot, index) => {
        const url = values[slot.key] || '';
        const busy = busyKey === slot.key;

        return (
          <div key={slot.key} className={index > 0 ? 'border-t border-[#e0e3e5] pt-4' : undefined}>
            <h3 className="mb-2 text-[14px] font-bold text-[#101319]">{slot.title}</h3>

            <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
              <div
                className={`flex shrink-0 items-center justify-center overflow-hidden border-2 border-dashed transition-colors ${slot.box} ${
                  url ? 'border-[#538cbd] bg-[#f5f7fb]' : 'border-[#c3c6d7] bg-[#f5f7fb]'
                }`}
              >
                {busy ? (
                  <span className="text-[10px] text-[#737686]">Ngunggah…</span>
                ) : url ? (
                  <img src={url} alt={slot.title} className="h-full w-full object-contain p-2" />
                ) : (
                  <Icon name={slot.emptyIcon} size={24} className="text-[#c3c6d7]" />
                )}
              </div>

              <div className="space-y-2">
                <input
                  ref={(el) => {
                    inputRefs.current[slot.key] = el;
                  }}
                  type="file"
                  accept={ACCEPTED_IMAGE_TYPES.join(',')}
                  onChange={(e) => handlePick(slot.key, e)}
                  className="hidden"
                />
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={busy}
                    onClick={() => inputRefs.current[slot.key]?.click()}
                    className="text-sm"
                  >
                    <Icon name="upload" size={14} className="mr-1" />
                    {url ? `Ganti ${slot.title}` : `Upload ${slot.title}`}
                  </Button>
                  {url && !busy && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => store(slot.key, '')}
                      className="border-[#ba1a1a]/30 text-sm text-[#ba1a1a] hover:bg-[#fff0f0]"
                    >
                      <Icon name="trash" size={14} className="mr-1" />
                      Hapus
                    </Button>
                  )}
                </div>
                <p className="text-[11px] text-[#737686]">{slot.hint}</p>
                <p className="text-[11px] text-[#737686]">
                  Langsung kesimpen begitu berkasnya selesai diunggah.
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Branding;
