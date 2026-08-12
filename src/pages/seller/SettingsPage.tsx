// src/pages/seller/SettingsPage.tsx
import React, { useEffect, useRef, useState } from 'react';
import SellerLayout from './SellerLayout';
import Icon from '../../components/ui/Icon';
import Button from '../../components/ui/Button';
import { getOwnSeller, updateSellerStore, type OwnSeller } from '../../api/sellers';
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_BYTES, uploadImage } from '../../api/uploads';

interface FormState {
  storeName: string;
  description: string;
  logoUrl: string;
  businessEmail: string;
  vacationMode: boolean;
}

const toForm = (seller: OwnSeller): FormState => ({
  storeName: seller.storeName,
  description: seller.description ?? '',
  logoUrl: seller.logoUrl ?? '',
  businessEmail: seller.businessEmail ?? '',
  vacationMode: seller.vacationMode,
});

const FIELD_CLASS =
  'w-full px-3 py-2 rounded-lg border border-[#c3c6d7] outline-none focus:border-[#004ac6] focus:ring-2 focus:ring-[#004ac6]/20 text-sm transition';

const SettingsPage: React.FC = () => {
  const [form, setForm] = useState<FormState | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [productCount, setProductCount] = useState(0);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;
    getOwnSeller()
      .then((res) => {
        if (cancelled) return;
        setForm(toForm(res.data.data));
        setProductCount(res.data.data._count?.products ?? 0);
      })
      .catch((err: any) => {
        if (!cancelled) setError(err?.message ?? 'Gagal memuat setelan toko');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
    setSaved(false);
  };

  /**
   * Berkas diunggah begitu dipilih, lalu URL hasilnya masuk ke form. Setelan
   * baru benar-benar tersimpan saat tombol Update ditekan — jadi logo yang
   * sudah terunggah tapi belum disimpan tidak akan mengubah apa pun.
   */
  const handlePickLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Input direset supaya memilih berkas yang sama dua kali tetap memicu event.
    e.target.value = '';
    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setError('Format harus PNG, JPG, WebP, atau GIF. SVG tidak didukung.');
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setError(`Ukuran berkas ${(file.size / 1024 / 1024).toFixed(1)} MB, maksimal 3 MB.`);
      return;
    }

    setUploading(true);
    setError(null);
    setSaved(false);
    try {
      const res = await uploadImage(file);
      set('logoUrl', res.data.data.url);
    } catch (err: any) {
      setError(err?.message ?? 'Gagal mengunggah logo');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form || saving) return;

    if (form.storeName.trim().length < 3) {
      setError('Nama toko minimal 3 karakter.');
      return;
    }

    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      // String kosong dikirim apa adanya — server yang mengubahnya jadi null,
      // itulah cara mengosongkan deskripsi/logo/email.
      const res = await updateSellerStore({
        storeName: form.storeName.trim(),
        description: form.description.trim(),
        logoUrl: form.logoUrl.trim(),
        businessEmail: form.businessEmail.trim(),
        vacationMode: form.vacationMode,
      });
      setForm(toForm(res.data.data));
      setSaved(true);
    } catch (err: any) {
      setError(err?.message ?? 'Gagal menyimpan setelan');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SellerLayout>
      <div className="space-y-6">
        <h1 className="text-[28px] font-bold text-[#191c1e]">Seller Settings</h1>

        <div className="bg-white rounded-2xl border border-[#e0e3e5] p-6 max-w-2xl">
          {loading ? (
            <div className="space-y-4">
              <div className="h-10 bg-[#f2f4f6] rounded animate-pulse" />
              <div className="h-20 bg-[#f2f4f6] rounded animate-pulse" />
              <div className="h-10 bg-[#f2f4f6] rounded animate-pulse" />
            </div>
          ) : !form ? (
            <p className="text-[13px] text-[#ba1a1a]">{error ?? 'Setelan toko tidak tersedia.'}</p>
          ) : (
            <form className="space-y-5" onSubmit={handleSubmit}>
              {error && (
                <div className="p-2.5 bg-[#ffe0e0] border border-[#ffbcbc] text-[#a33131] text-xs rounded-lg">
                  {error}
                </div>
              )}
              {saved && (
                <div className="p-2.5 bg-[#d7f5dc] border border-[#b3e6c0] text-[#156b32] text-xs rounded-lg">
                  Setelan toko tersimpan.
                </div>
              )}

              {/* Shop Name */}
              <div>
                <label className="block text-[13px] font-medium text-[#737686] mb-1">
                  Shop Name
                </label>
                <input
                  type="text"
                  value={form.storeName}
                  onChange={(e) => set('storeName', e.target.value)}
                  minLength={3}
                  maxLength={120}
                  className={FIELD_CLASS}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-[13px] font-medium text-[#737686] mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => set('description', e.target.value)}
                  maxLength={2000}
                  className={`${FIELD_CLASS} resize-none`}
                />
              </div>

              {/* Logo — URL, karena proyek ini tidak punya jalur upload berkas */}
              <div>
                <label className="block text-[13px] font-medium text-[#737686] mb-1">
                  Logo Toko
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 shrink-0 bg-[#f2f4f6] rounded-xl overflow-hidden flex items-center justify-center text-[#737686] border border-dashed border-[#c3c6d7]">
                    {uploading ? (
                      <span className="text-[10px] text-[#737686]">Mengunggah…</span>
                    ) : form.logoUrl ? (
                      <img src={form.logoUrl} alt="Logo toko" className="w-full h-full object-cover" />
                    ) : (
                      <Icon name="upload" size={24} />
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
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        disabled={uploading}
                        onClick={() => fileInputRef.current?.click()}
                        className="text-sm"
                      >
                        {uploading ? 'Mengunggah…' : 'Choose File'}
                      </Button>
                      {form.logoUrl && !uploading && (
                        <button
                          type="button"
                          onClick={() => set('logoUrl', '')}
                          className="text-[12px] text-[#ba1a1a] hover:underline px-2"
                        >
                          Hapus logo
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-[#737686] mt-1.5">
                      PNG, JPG, WebP, atau GIF — maksimal 3 MB. Logo tersimpan setelah kamu
                      menekan Update Settings.
                    </p>
                  </div>
                </div>
              </div>

              {/* Business Email */}
              <div>
                <label className="block text-[13px] font-medium text-[#737686] mb-1">
                  Business Email
                </label>
                <input
                  type="email"
                  value={form.businessEmail}
                  onChange={(e) => set('businessEmail', e.target.value)}
                  maxLength={255}
                  className={FIELD_CLASS}
                />
                <p className="text-[11px] text-[#737686] mt-1">
                  Hanya alamat kontak toko. Email untuk login akun tidak ikut berubah.
                </p>
              </div>

              {/* Vacation Mode */}
              <div className="border border-[#e0e3e5] rounded-xl p-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.vacationMode}
                    onChange={(e) => set('vacationMode', e.target.checked)}
                    className="w-4 h-4 mt-0.5 accent-[#004ac6]"
                  />
                  <span>
                    <span className="text-[13px] font-medium text-[#191c1e]">Vacation Mode</span>
                    <span className="block text-[11px] text-[#737686] mt-0.5">
                      Saat aktif, {productCount} produk kamu tetap bisa dilihat tapi pembeli
                      tidak bisa menambahkannya ke keranjang atau checkout. Order yang sudah
                      masuk tetap harus diproses seperti biasa.
                    </span>
                  </span>
                </label>
              </div>

              <Button
                type="submit"
                variant="primary"
                disabled={saving}
                className="w-full sm:w-auto px-8 py-2.5 text-sm"
              >
                {saving ? 'Menyimpan…' : 'Update Settings'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </SellerLayout>
  );
};

export default SettingsPage;
