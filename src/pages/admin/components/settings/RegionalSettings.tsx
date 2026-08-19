import React, { useState } from 'react';
import Button from '../../../../components/ui/Button';
import Icon from '../../../../components/ui/Icon';
import { CONFIG_KEYS } from '../../../../api/admin';
import type { SettingsCardProps } from '../../SettingsPage';

const DEFAULT_TIMEZONE = 'Asia/Jakarta';

const TIMEZONES: Record<string, string> = {
  'Asia/Jakarta': 'WIB (UTC+7)',
  'Asia/Makassar': 'WITA (UTC+8)',
  'Asia/Jayapura': 'WIT (UTC+9)',
  UTC: 'Universal Time Coordinated',
};

const RegionalSettings: React.FC<SettingsCardProps> = ({ values, onSave }) => {
  const timezone = values[CONFIG_KEYS.TIMEZONE] || DEFAULT_TIMEZONE;

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(timezone);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await onSave({ [CONFIG_KEYS.TIMEZONE]: form });
      setIsEditing(false);
    } catch (err: any) {
      setError(err?.message ?? 'Gagal simpan, coba lagi ya');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      
      <div className="rounded-xl p-3 -mx-3">
        <div className="flex items-center gap-2">
          <Icon name="wallet" size={16} className="text-[#737686]" />
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#737686]">Mata Uang</p>
        </div>
        <p className="mt-1 text-[15px] font-semibold text-[#101319]">
          IDR
          <span className="ml-2 text-[13px] font-normal text-[#737686]">Rupiah (Rp)</span>
        </p>
        <p className="mt-1.5 text-[11px] text-[#737686]">
          Harga, saldo NeedPay, dan payment gateway semuanya jalan di Rupiah. Ganti mata uang
          butuh konversi kurs, jadi belum bisa diubah dari sini.
        </p>
      </div>

      {isEditing ? (
        <div className="space-y-4 animate-slideDown">
          {error && (
            <div className="rounded-lg border border-[#ffdad6] bg-[#fff0f0] p-2.5 text-xs text-[#93000a]">
              {error}
            </div>
          )}
          <div>
            <label className="block text-[12px] font-semibold text-[#434655] mb-1.5">
              Zona Waktu <span className="text-[#ba1a1a]">*</span>
            </label>
            <select
              value={form}
              onChange={(e) => setForm(e.target.value)}
              className="w-full rounded-xl border border-[#c3c6d7] bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#538cbd] focus:ring-2 focus:ring-[#538cbd]/20"
              autoFocus
            >
              {Object.entries(TIMEZONES).map(([value, label]) => (
                <option key={value} value={value}>
                  {value}: {label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-[11px] text-[#737686]">
              Zona waktu acuan buat laporan dan jadwal promo.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={saving}
              className="flex-1 sm:flex-none text-sm px-6 py-2.5"
            >
              <Icon name="check" size={16} className="mr-1.5" />
              {saving ? 'Nyimpen…' : 'Simpan Perubahan'}
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsEditing(false)}
              disabled={saving}
              className="text-sm px-6 py-2.5"
            >
              Batal
            </Button>
          </div>
        </div>
      ) : (
        <div className="group flex items-start justify-between gap-4 rounded-xl p-3 -mx-3 transition-colors hover:bg-[#f5f7fb]">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <Icon name="clock" size={16} className="text-[#737686] group-hover:text-[#4077a6] transition-colors" />
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#737686]">Zona Waktu</p>
            </div>
            <p className="mt-1 text-[15px] font-semibold text-[#101319]">
              {timezone}
              <span className="ml-2 text-[13px] font-normal text-[#737686]">
                {TIMEZONES[timezone] ?? ''}
              </span>
            </p>
          </div>
          <button
            onClick={() => {
              setForm(timezone);
              setError(null);
              setIsEditing(true);
            }}
            className="shrink-0 rounded-lg p-2 text-[#737686] transition-all hover:bg-[#e4ebf1] hover:text-[#4077a6] hover:scale-110"
            aria-label="Edit zona waktu"
          >
            <Icon name="edit" size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default RegionalSettings;
