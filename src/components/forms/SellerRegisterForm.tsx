import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../ui/Icon';
import { createSellerStore } from '../../api/sellers';
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_BYTES, uploadImage } from '../../api/uploads';
import { refreshToken as apiRefreshToken, getRefreshToken, setAuthTokens } from '../../api/auth';
import { useAuth } from '../../contexts/AuthContext';

interface Props {
  onRegistered: () => void;
}

const EMPTY = {
  storeName: '',
  address: '',
  phone: '',
  businessEmail: '',
  description: '',
  logoUrl: '',
};

const inputCls =
  'w-full px-3 py-2 rounded-lg border border-[#c3c6d7] outline-none focus:border-[#004ac6] focus:ring-2 focus:ring-[#004ac6]/20 text-sm transition';

const SellerRegisterForm: React.FC<Props> = ({ onRegistered }) => {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const set = (key: keyof typeof EMPTY, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError(null);
  };

  const handlePickLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setError('Logonya harus PNG, JPG, WebP, atau GIF ya. SVG belum didukung.');
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setError(`Ukuran logonya ${(file.size / 1024 / 1024).toFixed(1)} MB, maksimalnya 3 MB.`);
      return;
    }

    setUploading(true);
    setError(null);
    try {
      const res = await uploadImage(file);
      set('logoUrl', res.data.data.url);
    } catch (err: any) {
      setError(err?.message ?? 'Gagal unggah logo, coba lagi ya');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;

    if (form.storeName.trim().length < 3) {
      setError('Nama perusahaannya minimal 3 karakter ya.');
      return;
    }
    if (form.address.trim().length < 10) {
      setError('Alamatnya minimal 10 karakter ya.');
      return;
    }
    if (form.phone.trim().length < 8) {
      setError('Nomor teleponnya minimal 8 digit ya.');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await createSellerStore({
        storeName: form.storeName.trim(),
        address: form.address.trim(),
        phone: form.phone.trim(),
        ...(form.description.trim() ? { description: form.description.trim() } : {}),
        ...(form.logoUrl ? { logoUrl: form.logoUrl } : {}),
        ...(form.businessEmail.trim() ? { businessEmail: form.businessEmail.trim() } : {}),
      });

      const stored = getRefreshToken();
      if (stored) {
        const res = await apiRefreshToken(stored);
        setAuthTokens(res.data.data);
      }
      await refreshUser();

      onRegistered();
      navigate('/seller/dashboard');
    } catch (err: any) {
      setError(err?.message ?? 'Gagal daftarin toko, coba lagi ya');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-2.5 bg-[#fff0f0] border border-[#ffdad6] text-[#93000a] text-xs rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-[#737686] mb-1">
            Nama Perusahaan / Toko *
          </label>
          <input
            type="text"
            value={form.storeName}
            onChange={(e) => set('storeName', e.target.value)}
            minLength={3}
            maxLength={120}
            required
            className={inputCls}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#737686] mb-1">
            No. Telepon Toko *
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => set('phone', e.target.value)}
            minLength={8}
            maxLength={20}
            required
            className={inputCls}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-[#737686] mb-1">Alamat Perusahaan *</label>
        <textarea
          rows={2}
          value={form.address}
          onChange={(e) => set('address', e.target.value)}
          minLength={10}
          maxLength={500}
          required
          className={`${inputCls} resize-none`}
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-[#737686] mb-1">Email Bisnis</label>
        <input
          type="email"
          value={form.businessEmail}
          onChange={(e) => set('businessEmail', e.target.value)}
          maxLength={255}
          className={inputCls}
        />
        <p className="text-[11px] text-[#737686] mt-1">
          Opsional. Email buat login akunmu nggak ikut berubah.
        </p>
      </div>

      <div>
        <label className="block text-xs font-medium text-[#737686] mb-1">Deskripsi Toko</label>
        <textarea
          rows={3}
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          maxLength={2000}
          className={`${inputCls} resize-none`}
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-[#737686] mb-1">Logo Toko</label>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 shrink-0 bg-[#f2f4f6] rounded-xl overflow-hidden flex items-center justify-center text-[#737686] border border-dashed border-[#c3c6d7]">
            {uploading ? (
              <span className="text-[10px]">Ngunggah…</span>
            ) : form.logoUrl ? (
              <img src={form.logoUrl} alt="Logo toko" className="w-full h-full object-cover" />
            ) : (
              <Icon name="upload" size={24} className="" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_IMAGE_TYPES.join(',')}
              onChange={handlePickLogo}
              className="hidden"
            />
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded-full border border-[#c3c6d7] text-[12px] font-semibold text-[#101319] hover:bg-[#f5f7fb] transition-colors disabled:opacity-50"
              >
                {uploading ? 'Ngunggah…' : 'Pilih Berkas'}
              </button>
              {form.logoUrl && !uploading && (
                <button
                  type="button"
                  onClick={() => set('logoUrl', '')}
                  className="text-[12px] text-[#ba1a1a] hover:underline px-1"
                >
                  Hapus logo
                </button>
              )}
            </div>
            <p className="text-[11px] text-[#737686] mt-1.5">
              Opsional. PNG, JPG, WebP, atau GIF, maksimal 3 MB ya.
            </p>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={saving || uploading}
        className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#004ac6] hover:bg-[#003ea8] text-white text-[13px] font-semibold transition-colors disabled:opacity-50"
      >
        {saving && <Icon name="clock" size={16} className="animate-spin" />}
        Daftarkan Toko
      </button>
    </form>
  );
};

export default SellerRegisterForm;
