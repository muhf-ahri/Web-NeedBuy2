// src/pages/admin/components/settings/MarketplaceInfo.tsx
import React, { useState } from 'react';
import Icon from '../../../../components/ui/Icon';
import Button from '../../../../components/ui/Button';

interface MarketplaceInfoData {
  name: string;
  description: string;
  roles: string;
}

const MarketplaceInfo: React.FC = () => {
  const [data, setData] = useState<MarketplaceInfoData>({
    name: 'NeedBuy Global Market',
    description: 'Platform belanja kebutuhan terpercaya untuk semua. Kami menghubungkan pembeli dengan penjual terverifikasi.',
    roles: 'Administrator, Seller, Buyer',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(data);

  const handleSave = () => {
    setData(form);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setForm(data);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="space-y-4 animate-slideDown">
        <div>
          <label className="block text-[12px] font-semibold text-[#434655] mb-1.5">
            Nama Marketplace <span className="text-[#ba1a1a]">*</span>
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Nama marketplace"
            className="w-full rounded-xl border border-[#c3c6d7] px-4 py-2.5 text-sm outline-none transition focus:border-[#004ac6] focus:ring-2 focus:ring-[#004ac6]/20 bg-white"
            autoFocus
          />
          <p className="mt-1 text-[11px] text-[#737686]">Nama yang akan tampil di seluruh platform.</p>
        </div>

        <div>
          <label className="block text-[12px] font-semibold text-[#434655] mb-1.5">
            Deskripsi Marketplace
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            placeholder="Deskripsikan marketplace Anda"
            className="w-full resize-none rounded-xl border border-[#c3c6d7] px-4 py-2.5 text-sm outline-none transition focus:border-[#004ac6] focus:ring-2 focus:ring-[#004ac6]/20 bg-white"
          />
          <p className="mt-1 text-[11px] text-[#737686]">Deskripsi singkat tentang marketplace.</p>
        </div>

        <div>
          <label className="block text-[12px] font-semibold text-[#434655] mb-1.5">
            Roles & Permissions
          </label>
          <input
            type="text"
            value={form.roles}
            onChange={(e) => setForm({ ...form, roles: e.target.value })}
            placeholder="Admin, Seller, Buyer"
            className="w-full rounded-xl border border-[#c3c6d7] px-4 py-2.5 text-sm outline-none transition focus:border-[#004ac6] focus:ring-2 focus:ring-[#004ac6]/20 bg-white"
          />
          <p className="mt-1 text-[11px] text-[#737686]">Pisahkan dengan koma (,).</p>
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
      {/* ── Nama Marketplace ── */}
      <div className="group flex items-start justify-between gap-4 rounded-xl p-3 -mx-3 transition-colors hover:bg-[#f8f9fb]">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Icon name="shop" size={16} className="text-[#737686] group-hover:text-[#004ac6] transition-colors" />
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#737686]">Nama Marketplace</p>
          </div>
          <p className="mt-1 text-[15px] font-semibold text-[#191c1e]">{data.name}</p>
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className="shrink-0 rounded-lg p-2 text-[#737686] transition-all hover:bg-[#dbe1ff] hover:text-[#004ac6] hover:scale-110"
          aria-label="Edit nama marketplace"
        >
          <Icon name="edit" size={16} />
        </button>
      </div>

      {/* ── Roles & Permissions ── */}
      <div className="group flex items-start justify-between gap-4 rounded-xl p-3 -mx-3 transition-colors hover:bg-[#f8f9fb]">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Icon name="users" size={16} className="text-[#737686] group-hover:text-[#004ac6] transition-colors" />
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#737686]">Roles & Permissions</p>
          </div>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {data.roles.split(',').map((role, idx) => (
              <span
                key={idx}
                className="rounded-full bg-[#dbe1ff] px-3 py-0.5 text-[12px] font-medium text-[#004ac6]"
              >
                {role.trim()}
              </span>
            ))}
          </div>
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className="shrink-0 rounded-lg p-2 text-[#737686] transition-all hover:bg-[#dbe1ff] hover:text-[#004ac6] hover:scale-110"
          aria-label="Edit roles & permissions"
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
          <p className="mt-1 text-[14px] text-[#434655] leading-relaxed">{data.description}</p>
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className="shrink-0 rounded-lg p-2 text-[#737686] transition-all hover:bg-[#dbe1ff] hover:text-[#004ac6] hover:scale-110"
          aria-label="Edit deskripsi marketplace"
        >
          <Icon name="edit" size={16} />
        </button>
      </div>
    </div>
  );
};

export default MarketplaceInfo;