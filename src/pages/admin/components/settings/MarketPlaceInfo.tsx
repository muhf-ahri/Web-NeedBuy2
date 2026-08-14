// src/pages/admin/components/settings/MarketplaceInfo.tsx
import React, { useState } from 'react';
import Icon from '../../../../components/ui/Icon';
import Button from '../../../../components/ui/Button';
import { CONFIG_KEYS } from '../../../../api/admin';
import type { SettingsCardProps } from '../../SettingsPage';

const DEFAULT_NAME = 'NeedBuy';

// Role bukan setelan — nilainya enum di database (UserRole), jadi ditampilkan
// sebagai fakta, bukan kolom isian yang menipu.
const ROLES = ['Administrator', 'Seller', 'Buyer'];

const MarketplaceInfo: React.FC<SettingsCardProps> = ({ values, onSave }) => {
  const name = values[CONFIG_KEYS.MARKETPLACE_NAME] || DEFAULT_NAME;
  const description = values[CONFIG_KEYS.MARKETPLACE_DESCRIPTION] || '';

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ name, description });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startEdit = () => {
    setForm({ name, description });
    setError(null);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (form.name.trim().length < 2) {
      setError('Nama marketplace minimal 2 karakter ya.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSave({
        [CONFIG_KEYS.MARKETPLACE_NAME]: form.name.trim(),
        [CONFIG_KEYS.MARKETPLACE_DESCRIPTION]: form.description.trim(),
      });
      setIsEditing(false);
    } catch (err: any) {
      setError(err?.message ?? 'Gagal simpan, coba lagi ya');
    } finally {
      setSaving(false);
    }
  };

  if (isEditing) {
    return (
      <div className="space-y-4 animate-slideDown">
        {error && (
          <div className="rounded-lg border border-[#ffbcbc] bg-[#ffe0e0] p-2.5 text-xs text-[#a33131]">
            {error}
          </div>
        )}

        <div>
          <label className="block text-[12px] font-semibold text-[#434655] mb-1.5">
            Nama Marketplace <span className="text-[#ba1a1a]">*</span>
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Nama marketplace"
            maxLength={80}
            className="w-full rounded-xl border border-[#c3c6d7] px-4 py-2.5 text-sm outline-none transition focus:border-[#004ac6] focus:ring-2 focus:ring-[#004ac6]/20 bg-white"
            autoFocus
          />
          <p className="mt-1 text-[11px] text-[#737686]">
            Dipakai buat judul tab browser dan nama yang tampil ke pembeli.
          </p>
        </div>

        <div>
          <label className="block text-[12px] font-semibold text-[#434655] mb-1.5">
            Deskripsi Marketplace
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            placeholder="Deskripsikan marketplace kamu"
            maxLength={2000}
            className="w-full resize-none rounded-xl border border-[#c3c6d7] px-4 py-2.5 text-sm outline-none transition focus:border-[#004ac6] focus:ring-2 focus:ring-[#004ac6]/20 bg-white"
          />
          <p className="mt-1 text-[11px] text-[#737686]">Deskripsi singkat tentang marketplace.</p>
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
    );
  }

  return (
    <div className="space-y-5">
      {/* ── Nama Marketplace ── */}
      <div className="group flex items-start justify-between gap-4 rounded-xl p-3 -mx-3 transition-colors hover:bg-[#f8f9fb]">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Icon name="shop" size={16} className="text-[#737686] group-hover:text-[#004ac6] transition-colors" />
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#737686]">Nama Marketplace</p>
          </div>
          <p className="mt-1 text-[15px] font-semibold text-[#191c1e]">{name}</p>
        </div>
        <button
          onClick={startEdit}
          className="shrink-0 rounded-lg p-2 text-[#737686] transition-all hover:bg-[#dbe1ff] hover:text-[#004ac6] hover:scale-110"
          aria-label="Edit nama marketplace"
        >
          <Icon name="edit" size={16} />
        </button>
      </div>

      {/* ── Deskripsi ── */}
      <div className="group flex items-start justify-between gap-4 rounded-xl p-3 -mx-3 transition-colors hover:bg-[#f8f9fb]">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Icon name="file-text" size={16} className="text-[#737686] group-hover:text-[#004ac6] transition-colors" />
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#737686]">Deskripsi Marketplace</p>
          </div>
          <p className="mt-1 text-[14px] text-[#434655] leading-relaxed">
            {description || <span className="text-[#737686]">Belum ada deskripsi.</span>}
          </p>
        </div>
        <button
          onClick={startEdit}
          className="shrink-0 rounded-lg p-2 text-[#737686] transition-all hover:bg-[#dbe1ff] hover:text-[#004ac6] hover:scale-110"
          aria-label="Edit deskripsi marketplace"
        >
          <Icon name="edit" size={16} />
        </button>
      </div>

      {/* ── Roles (read-only) ── */}
      <div className="rounded-xl p-3 -mx-3">
        <div className="flex items-center gap-2">
          <Icon name="users" size={16} className="text-[#737686]" />
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#737686]">Roles & Permissions</p>
        </div>
        <div className="mt-1 flex flex-wrap gap-1.5">
          {ROLES.map((role) => (
            <span
              key={role}
              className="rounded-full bg-[#dbe1ff] px-3 py-0.5 text-[12px] font-medium text-[#004ac6]"
            >
              {role}
            </span>
          ))}
        </div>
        <p className="mt-1.5 text-[11px] text-[#737686]">
          Role udah dikunci di database. Nambah role baru butuh perubahan skema, nggak bisa dari sini.
        </p>
      </div>
    </div>
  );
};

export default MarketplaceInfo;
