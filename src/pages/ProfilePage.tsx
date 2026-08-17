import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Icon from '../components/ui/Icon';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import VerifyEmailBanner from '../components/ui/VerifyEmailBanner';
import Reveal from '../components/ui/Reveal';

import ProfileHero from '../components/profile/ProfileHero';
import ProfileInfoForm from '../components/profile/ProfileInfoForm';
import ProfileSellerSection from '../components/profile/ProfileSellerSection';
import ProfileAddressSection from '../components/profile/ProfileAddressSection';
import ProfilePasswordForm from '../components/profile/ProfilePasswordForm';
import ProfileLoginPrompt from '../components/profile/ProfileLoginPrompt';

import {
  getAccessToken,
  setSessionTokens,
  getUserProfile,
  updateProfile,
  changePassword,
  type User as UserType,
} from '../api/auth';
import {
  getAddresses,
  createAddress,
  deleteAddress,
  type Address,
} from '../api/orders';
import {
  validateAddressForm,
  EMPTY_ADDRESS_FORM,
  type AddressFormData,
} from '../utils/address';
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_BYTES, uploadImage } from '../api/uploads';
import { useAuth } from '../contexts/AuthContext';

interface ProfileData extends UserType {
  seller?: {
    id: string;
    storeName: string;
    rating: string;
    status: string;
  } | null;
  _count?: {
    orders: number;
    needs: number;
    addresses: number;
  };
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { logout, refreshUser } = useAuth();

  const isAuthed = !!getAccessToken();

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState<AddressFormData>(EMPTY_ADDRESS_FORM);
  const [savingAddress, setSavingAddress] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const [pw, setPw] = useState({ currentPassword: '', newPassword: '' });
  const [savingPw, setSavingPw] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    const [profileRes, addrRes] = await Promise.allSettled([
      getUserProfile(),
      getAddresses(),
    ]);

    if (profileRes.status === 'fulfilled') {
      const data = profileRes.value.data.data;
      setProfile(data);
      setName(data.name ?? '');
      setPhone(data.phone ?? '');
    } else {
      setError(profileRes.reason?.message ?? 'Gagal muat profil, coba lagi ya');
    }

    if (addrRes.status === 'fulfilled') {
      setAddresses(addrRes.value.data.data ?? []);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    if (!isAuthed) {
      setLoading(false);
      return;
    }
    loadData();
  }, [isAuthed, loadData]);

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    setError(null);
    setSavedMessage(null);
    try {
      const res = await updateProfile({
        name: name.trim() || undefined,
        phone: phone.trim() || null,
      });
      setProfile((prev) => (prev ? { ...prev, ...res.data.data } : prev));
      setSavedMessage('Profil kamu udah keupdate.');
      setTimeout(() => setSavedMessage(null), 2500);
    } catch (err: any) {
      setError(err.message ?? 'Gagal update profil, coba lagi ya');
    } finally {
      setSavingProfile(false);
    }
  };

  const saveAvatar = async (avatarUrl: string | null) => {
    const res = await updateProfile({ avatarUrl });
    setProfile((prev) => (prev ? { ...prev, ...res.data.data } : prev));

    await refreshUser();
    setSavedMessage(avatarUrl ? 'Foto profil kamu udah keganti.' : 'Foto profil udah dihapus.');
    setTimeout(() => setSavedMessage(null), 2500);
  };

  const handlePickPhoto = async (file: File) => {
    setError(null);
    setSavedMessage(null);

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setError('Formatnya harus PNG, JPG, WebP, atau GIF ya. SVG belum didukung.');
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setError(`Ukuran fotonya ${(file.size / 1024 / 1024).toFixed(1)} MB, maksimalnya 3 MB.`);
      return;
    }

    setUploadingPhoto(true);
    try {
      const uploaded = await uploadImage(file);
      await saveAvatar(uploaded.data.data.url);
    } catch (err: any) {
      setError(err.message ?? 'Gagal unggah foto, coba lagi ya');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleRemovePhoto = async () => {
    setError(null);
    setSavedMessage(null);
    setUploadingPhoto(true);
    try {
      await saveAvatar(null);
    } catch (err: any) {
      setError(err.message ?? 'Gagal hapus foto, coba lagi ya');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleChangePassword = async () => {
    if (!pw.currentPassword || !pw.newPassword) return;
    setSavingPw(true);
    setError(null);
    setSavedMessage(null);
    try {
      const res = await changePassword({
        currentPassword: pw.currentPassword,
        newPassword: pw.newPassword,
      });
      setSessionTokens(res.data.data.accessToken, res.data.data.refreshToken);
      setPw({ currentPassword: '', newPassword: '' });
      setSavedMessage('Password udah diganti. Perangkat lain otomatis keluar.');
      setTimeout(() => setSavedMessage(null), 2500);
    } catch (err: any) {
      setError(err.message ?? 'Gagal ganti password, coba lagi ya');
    } finally {
      setSavingPw(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    setError(null);
    try {
      await deleteAddress(id);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    } catch (err: any) {
      setError(err.message ?? 'Gagal hapus alamat, coba lagi ya');
    }
  };

  const updateField = (key: keyof AddressFormData, value: string) => {
    setAddressForm((f) => ({ ...f, [key]: value }));
    setFieldErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateAddressForm(addressForm);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setError(null);
      setSavedMessage(null);
      return;
    }
    setSavingAddress(true);
    setError(null);
    setSavedMessage(null);
    try {
      await createAddress(addressForm);
      setShowAddressForm(false);
      setAddressForm(EMPTY_ADDRESS_FORM);
      setFieldErrors({});
      const addrRes = await getAddresses();
      setAddresses(addrRes.data.data ?? []);
      setSavedMessage('Alamatnya udah kesimpen.');
      setTimeout(() => setSavedMessage(null), 2500);
    } catch (err: any) {
      if (err?.fields?.length) {
        const mapped: Record<string, string> = {};
        err.fields.forEach((f: { path: string; message: string }) => {
          mapped[f.path] = f.message;
        });
        setFieldErrors(mapped);
        setError('Cek lagi isian alamatnya ya.');
      } else {
        setError(err.message ?? 'Gagal simpan alamat, coba lagi ya');
      }
    } finally {
      setSavingAddress(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex flex-col bg-[#F5F5FF]"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        <Navbar />
        <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-8 sm:px-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-4">
              <div className="h-72 animate-pulse rounded-[24px] bg-white/95" />
              <div className="h-48 animate-pulse rounded-[24px] bg-white/95" />
            </div>
            <div className="space-y-4 lg:col-span-2">
              <div className="h-60 animate-pulse rounded-[24px] bg-white/95" />
              <div className="h-60 animate-pulse rounded-[24px] bg-white/95" />
              <div className="h-60 animate-pulse rounded-[24px] bg-white/95" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAuthed) {
    return <ProfileLoginPrompt />;
  }

  if (!profile) {
    return (
      <div
        className="min-h-screen flex flex-col bg-[#F5F5FF]"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        <Navbar />
        <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-8">
          <div
            className="
              w-full max-w-md rounded-[24px] border border-white/80 bg-white/95
              px-6 py-8 text-center shadow-[0_18px_50px_rgba(32,36,45,0.10)]
              backdrop-blur-sm
            "
          >
            <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#FF4646]/15">
              <Icon name="alert" size={20} className="text-[#FF4646]" />
            </span>
            <h1 className="text-[18px] font-extrabold text-[#20242D]">
              Profil kamu nggak bisa dimuat
            </h1>
            <p className="mt-2 text-[13px] leading-relaxed text-[#737A87]">
              {error ?? 'Ada yang error di jalan. Coba lagi ya.'}
            </p>
            <p className="mt-1 text-[12px] text-[#A2A8B3]">
              Kamu masih login, ini kendala koneksi ke server dan bukan sesi kamu.
            </p>
            <button
              type="button"
              onClick={loadData}
              className="
                mt-5 w-full rounded-2xl bg-[#538CDB] px-4 py-2.5 text-[13px]
                font-bold text-white transition-colors hover:bg-[#3A66AC]
              "
            >
              Coba lagi
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const stats = {
    orders: profile._count?.orders ?? 0,
    needs: profile._count?.needs ?? 0,
    addresses: profile._count?.addresses ?? addresses.length,
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-[#F5F5FF]"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-8 sm:px-8">
        <Reveal direction="up">
          <div className="mb-6">
            <div className="mb-2 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#538CDB]/10 px-2.5 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FFD500]" />
                <p className="text-[9px] font-bold uppercase tracking-[0.20em] text-[#538CDB]">
                  Akun saya
                </p>
              </span>
            </div>
            <h1 className="text-[26px] font-extrabold leading-tight tracking-tight text-[#20242D] sm:text-[32px]">
              Profil Saya
            </h1>
            <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-[#737A87]">
              Kelola informasi akun, alamat, dan pengaturan toko di satu
              tempat.
            </p>
          </div>
        </Reveal>

        <Reveal direction="up">
          <VerifyEmailBanner />
        </Reveal>

        {error && (
          <Reveal direction="up">
            <div
              className="
                mb-5 flex items-center gap-3 rounded-2xl border
                border-[#FF4646]/20 bg-[#FFF0F0] px-4 py-3 backdrop-blur-sm
              "
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FF4646]/15">
                <Icon name="alert" size={15} className="text-[#FF4646]" />
              </span>
              <p className="text-[13px] font-medium text-[#C73535]">{error}</p>
            </div>
          </Reveal>
        )}

        {savedMessage && (
          <Reveal direction="up">
            <div
              className="
                mb-5 flex items-center gap-3 rounded-2xl border
                border-[#22C55E]/20 bg-[#F0FDF4] px-4 py-3 backdrop-blur-sm
              "
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#22C55E]/15">
                <Icon name="check" size={15} className="text-[#22C55E]" />
              </span>
              <p className="text-[13px] font-medium text-[#166534]">
                {savedMessage}
              </p>
            </div>
          </Reveal>
        )}

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
          <Reveal direction="up">
            <ProfileHero
              name={profile.name || ''}
              email={profile.email}
              username={profile.username}
              avatarUrl={profile.avatarUrl}
              onPickPhoto={handlePickPhoto}
              onRemovePhoto={handleRemovePhoto}
              uploadingPhoto={uploadingPhoto}
              seller={profile.seller}
              stats={stats}
              onNavigateOrders={() => navigate('/orders')}
              onNavigateWishlist={() => navigate('/wishlist')}
              onLogout={handleLogout}
            />
          </Reveal>

          <div className="space-y-5 lg:col-span-2">
            <Reveal direction="up" delay={80}>
              <ProfileInfoForm
                name={name}
                phone={phone}
                username={profile.username}
                email={profile.email}
                onNameChange={setName}
                onPhoneChange={setPhone}
                onSave={handleSaveProfile}
                saving={savingProfile}
              />
            </Reveal>

            <Reveal direction="up" delay={160}>
              <ProfileSellerSection
                seller={profile.seller}
                onRegistered={loadData}
              />
            </Reveal>

            <Reveal direction="up" delay={240}>
              <ProfileAddressSection
                addresses={addresses}
                onAdd={() => setShowAddressForm(true)}
                onDelete={handleDeleteAddress}
                showModal={showAddressForm}
                onCloseModal={() => setShowAddressForm(false)}
                form={addressForm}
                onFieldChange={updateField}
                fieldErrors={fieldErrors}
                saving={savingAddress}
                onSubmit={handleSaveAddress}
              />
            </Reveal>

            <Reveal direction="up" delay={320}>
              <ProfilePasswordForm
                currentPassword={pw.currentPassword}
                newPassword={pw.newPassword}
                onCurrentChange={(v) =>
                  setPw((p) => ({ ...p, currentPassword: v }))
                }
                onNewChange={(v) => setPw((p) => ({ ...p, newPassword: v }))}
                onSubmit={handleChangePassword}
                saving={savingPw}
              />
            </Reveal>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProfilePage;