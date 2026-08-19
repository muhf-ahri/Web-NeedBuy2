import React, { useEffect, useState } from 'react';

import SellerLayout from './SellerLayout';
import Reveal from '../../components/ui/Reveal';

import SettingsHeader from '../../components/seller_settings/SettingsHeader';
import SettingsErrorState from '../../components/seller_settings/SettingsErrorState';
import SettingsSection from '../../components/seller_settings/SettingsSection';
import SettingsFormFields from '../../components/seller_settings/SettingsFormFields';
import LogoUploader from '../../components/seller_settings/LogoUploader';
import VacationToggle from '../../components/seller_settings/VocationToggle';
import SettingsSubmitBar from '../../components/seller_settings/SettingsSubmitBar';

import {
  getOwnSeller,
  updateSellerStore,
  type OwnSeller,
} from '../../api/sellers';
import { MAX_IMAGE_BYTES, uploadImage } from '../../api/uploads';

interface FormState {
  storeName: string;
  description: string;
  address: string;
  phone: string;
  logoUrl: string;
  businessEmail: string;
  vacationMode: boolean;
}

const toForm = (seller: OwnSeller): FormState => ({
  storeName: seller.storeName,
  description: seller.description ?? '',
  address: seller.address ?? '',
  phone: seller.phone ?? '',
  logoUrl: seller.logoUrl ?? '',
  businessEmail: seller.businessEmail ?? '',
  vacationMode: seller.vacationMode,
});

const SettingsPage: React.FC = () => {
  const [form, setForm] = useState<FormState | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [productCount, setProductCount] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const retry = () => {
    setReloadKey((k) => k + 1);
    setError(null);
  };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getOwnSeller()
      .then((res) => {
        if (cancelled) return;
        setForm(toForm(res.data.data));
        setProductCount(res.data.data._count?.products ?? 0);
      })
      .catch((err: any) => {
        if (!cancelled)
          setError(err?.message ?? 'Gagal muat setelan toko, coba lagi ya');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
    setSaved(false);
  };

  const handlePickLogo = async (file: File) => {
    const ACCEPTED = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
    if (!ACCEPTED.includes(file.type)) {
      setError('Formatnya harus PNG, JPG, WebP, atau GIF ya.');
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setError(
        `Ukuran berkasnya ${(file.size / 1024 / 1024).toFixed(1)} MB, maksimalnya 3 MB.`
      );
      return;
    }

    setUploading(true);
    setError(null);
    setSaved(false);
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
    if (!form || saving) return;

    if (form.storeName.trim().length < 3) {
      setError('Nama tokonya minimal 3 karakter ya.');
      return;
    }

    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const res = await updateSellerStore({
        storeName: form.storeName.trim(),
        description: form.description.trim(),
        address: form.address.trim(),
        phone: form.phone.trim(),
        logoUrl: form.logoUrl.trim(),
        businessEmail: form.businessEmail.trim(),
        vacationMode: form.vacationMode,
      });
      setForm(toForm(res.data.data));
      setSaved(true);
    } catch (err: any) {
      setError(err?.message ?? 'Gagal simpan setelan, coba lagi ya');
    } finally {
      setSaving(false);
    }
  };

  const showFatalError = !loading && !form && Boolean(error);

  return (
    <SellerLayout>
      <div className="space-y-5 sm:space-y-6">
        <Reveal direction="up">
          <SettingsHeader />
        </Reveal>

        {showFatalError ? (
          <Reveal direction="up">
            <SettingsErrorState onRetry={retry} />
          </Reveal>
        ) : loading ? (
          <div className="space-y-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <Reveal key={i} direction="up" delay={i * 60}>
                <div
                  className="
                    rounded-[20px] border border-white/80 bg-white/95 p-5
                    shadow-[0_6px_18px_rgba(32,36,45,0.05)] backdrop-blur-sm
                    sm:p-6
                  "
                >
                  <div className="mb-4 flex items-center gap-2.5">
                    <div className="h-8 w-8 animate-pulse rounded-lg bg-[#F5F7FB]" />
                    <div className="space-y-1.5">
                      <div className="h-2.5 w-20 animate-pulse rounded-full bg-[#F5F7FB]" />
                      <div className="h-3.5 w-32 animate-pulse rounded-full bg-[#F5F7FB]" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-10 animate-pulse rounded-xl bg-[#F5F7FB]" />
                    <div className="h-20 animate-pulse rounded-xl bg-[#F5F7FB]" />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        ) : form ? (
          <form onSubmit={handleSubmit} className="max-w-3xl space-y-5">
            <Reveal direction="up" delay={60}>
              <SettingsSection
                eyebrow="Bagian 1"
                title="Informasi Toko"
                description="Identitas yang ditampilkan ke pembeli"
                icon="shop"
                iconBg="bg-[#f5f7fb]"
                iconText="text-[#4077a6]"
              >
                <SettingsFormFields form={form} setField={set} />
              </SettingsSection>
            </Reveal>

            <Reveal direction="up" delay={120}>
              <SettingsSection
                eyebrow="Bagian 2"
                title="Logo Toko"
                description="Tampilan visual tokomu di halaman produk"
                icon="upload"
                iconBg="bg-[#FFF7E0]"
                iconText="text-[#B45309]"
              >
                <LogoUploader
                  logoUrl={form.logoUrl}
                  uploading={uploading}
                  onPick={handlePickLogo}
                  onRemove={() => set('logoUrl', '')}
                />
              </SettingsSection>
            </Reveal>

            <Reveal direction="up" delay={180}>
              <SettingsSection
                eyebrow="Bagian 3"
                title="Mode Operasional"
                description="Kontrol ketersediaan toko untuk pembeli"
                icon="moon"
                iconBg="bg-[#e6f4ee]"
                iconText="text-[#12805c]"
              >
                <VacationToggle
                  checked={form.vacationMode}
                  onChange={(v) => set('vacationMode', v)}
                  productCount={productCount}
                />
              </SettingsSection>
            </Reveal>

            <Reveal direction="up" delay={240}>
              <SettingsSubmitBar
                saving={saving}
                saved={saved}
                error={error}
                onDismissError={() => setError(null)}
              />
            </Reveal>
          </form>
        ) : null}
      </div>
    </SellerLayout>
  );
};

export default SettingsPage;