// src/pages/admin/components/settings/RegionalSettings.tsx
import React, { useState } from 'react';
import Button from '../../../../components/ui/Button';
import Icon from '../../../../components/ui/Icon';

const RegionalSettings: React.FC = () => {
  const [currency, setCurrency] = useState('IDR');
  const [timezone, setTimezone] = useState('Asia/Jakarta');

  const [isEditing, setIsEditing] = useState(false);
  const [formCurrency, setFormCurrency] = useState(currency);
  const [formTimezone, setFormTimezone] = useState(timezone);

  const handleSave = () => {
    setCurrency(formCurrency);
    setTimezone(formTimezone);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormCurrency(currency);
    setFormTimezone(timezone);
    setIsEditing(false);
  };

  // Mapping untuk label mata uang
  const currencyLabel: Record<string, string> = {
    IDR: 'Indonesian Rupiah (Rp)',
    USD: 'US Dollar ($)',
    EUR: 'Euro (€)',
    SGD: 'Singapore Dollar (S$)',
  };

  // Mapping untuk label timezone
  const timezoneLabel: Record<string, string> = {
    'Asia/Jakarta': 'Asia/Jakarta (UTC+7)',
    'Asia/Makassar': 'Asia/Makassar (UTC+8)',
    'Asia/Jayapura': 'Asia/Jayapura (UTC+9)',
    UTC: 'UTC+00:00 Universal Time Coordinated',
  };

  if (isEditing) {
    return (
      <div className="space-y-4 animate-slideDown">
        <div>
          <label className="block text-[12px] font-semibold text-[#434655] mb-1.5">
            Mata Uang Default <span className="text-[#ba1a1a]">*</span>
          </label>
          <select
            value={formCurrency}
            onChange={(e) => setFormCurrency(e.target.value)}
            className="w-full rounded-xl border border-[#c3c6d7] px-4 py-2.5 text-sm outline-none transition focus:border-[#004ac6] focus:ring-2 focus:ring-[#004ac6]/20 bg-white appearance-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23737686' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 12px center',
              paddingRight: '36px',
            }}
          >
            <option value="IDR">IDR - Indonesian Rupiah (Rp)</option>
            <option value="USD">USD - US Dollar ($)</option>
            <option value="EUR">EUR - Euro (€)</option>
            <option value="SGD">SGD - Singapore Dollar (S$)</option>
          </select>
          <p className="mt-1 text-[11px] text-[#737686]">Mata uang yang digunakan untuk semua transaksi.</p>
        </div>

        <div>
          <label className="block text-[12px] font-semibold text-[#434655] mb-1.5">
            Zona Waktu <span className="text-[#ba1a1a]">*</span>
          </label>
          <select
            value={formTimezone}
            onChange={(e) => setFormTimezone(e.target.value)}
            className="w-full rounded-xl border border-[#c3c6d7] px-4 py-2.5 text-sm outline-none transition focus:border-[#004ac6] focus:ring-2 focus:ring-[#004ac6]/20 bg-white appearance-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23737686' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 12px center',
              paddingRight: '36px',
            }}
          >
            <option value="Asia/Jakarta">Asia/Jakarta (UTC+7)</option>
            <option value="Asia/Makassar">Asia/Makassar (UTC+8)</option>
            <option value="Asia/Jayapura">Asia/Jayapura (UTC+9)</option>
            <option value="UTC">UTC+00:00 Universal Time Coordinated</option>
          </select>
          <p className="mt-1 text-[11px] text-[#737686]">Zona waktu untuk semua timestamp di platform.</p>
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="primary" onClick={handleSave} className="flex-1 sm:flex-none text-sm px-6 py-2.5">
            <Icon name="check" size={16} className="mr-1.5" />
            Simpan Perubahan
          </Button>
          <Button variant="outline" onClick={handleCancel} className="text-sm px-6 py-2.5">
            Batal
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* ── Mata Uang Default ── */}
      <div className="group flex items-start justify-between gap-4 rounded-xl p-3 -mx-3 transition-colors hover:bg-[#f8f9fb]">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Icon name="wallet" size={16} className="text-[#737686] group-hover:text-[#004ac6] transition-colors" />
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#737686]">Mata Uang Default</p>
          </div>
          <p className="mt-1 text-[15px] font-semibold text-[#191c1e]">
            {currency}
            <span className="ml-2 text-[13px] font-normal text-[#737686]">
              {currencyLabel[currency] || currency}
            </span>
          </p>
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className="shrink-0 rounded-lg p-2 text-[#737686] transition-all hover:bg-[#dbe1ff] hover:text-[#004ac6] hover:scale-110"
          aria-label="Edit mata uang default"
        >
          <Icon name="edit" size={16} />
        </button>
      </div>

      {/* ── Zona Waktu ── */}
      <div className="group flex items-start justify-between gap-4 rounded-xl p-3 -mx-3 transition-colors hover:bg-[#f8f9fb]">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Icon name="clock" size={16} className="text-[#737686] group-hover:text-[#004ac6] transition-colors" />
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#737686]">Zona Waktu</p>
          </div>
          <p className="mt-1 text-[15px] font-semibold text-[#191c1e]">
            {timezone}
            <span className="ml-2 text-[13px] font-normal text-[#737686]">
              {timezoneLabel[timezone] || timezone}
            </span>
          </p>
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className="shrink-0 rounded-lg p-2 text-[#737686] transition-all hover:bg-[#dbe1ff] hover:text-[#004ac6] hover:scale-110"
          aria-label="Edit zona waktu"
        >
          <Icon name="edit" size={16} />
        </button>
      </div>
    </div>
  );
};

export default RegionalSettings;