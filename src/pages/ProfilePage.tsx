// src/pages/ProfilePage.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/ui/Icon';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { getUserProfile, updateProfile, changePassword, type User as UserType } from '../api/auth';
import { getAddresses, createAddress, deleteAddress, type Address } from '../api/orders';
import { validateAddressForm, EMPTY_ADDRESS_FORM, type AddressFormData } from '../utils/address';
import { useAuth } from '../contexts/AuthContext';
import VerifyEmailBanner from '../components/ui/VerifyEmailBanner';
import SellerRegisterForm from '../components/forms/SellerRegisterForm';

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
  const { logout } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Address form modal
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState<AddressFormData>(EMPTY_ADDRESS_FORM);
  const [savingAddress, setSavingAddress] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  // Password form
  const [pw, setPw] = useState({ currentPassword: '', newPassword: '' });
  const [savingPw, setSavingPw] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [profileRes, addrRes] = await Promise.all([getUserProfile(), getAddresses()]);
      const data = profileRes.data.data;
      setProfile(data);
      setName(data.name ?? '');
      setPhone(data.phone ?? '');
      setAddresses(addrRes.data.data ?? []);
    } catch (err: any) {
      setError(err.message ?? 'Gagal muat profil, coba lagi ya');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    setError(null);
    setSavedMessage(null);
    try {
      const res = await updateProfile({ name: name.trim() || undefined, phone: phone.trim() || null });
      setProfile((prev) => (prev ? { ...prev, ...res.data.data } : prev));
      setSavedMessage('Profil kamu udah keupdate.');
      setTimeout(() => setSavedMessage(null), 2500);
    } catch (err: any) {
      setError(err.message ?? 'Gagal update profil, coba lagi ya');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (!pw.currentPassword || !pw.newPassword) return;
    setSavingPw(true);
    setError(null);
    setSavedMessage(null);
    try {
      await changePassword({ currentPassword: pw.currentPassword, newPassword: pw.newPassword });
      setPw({ currentPassword: '', newPassword: '' });
      setSavedMessage('Password udah diganti.');
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
      <div className="min-h-screen flex flex-col bg-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <Navbar />
        <main className="flex-1 max-w-6xl mx-auto w-full px-5 sm:px-10 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-24 bg-[#f2f4f6] rounded-2xl" />
            <div className="h-32 bg-[#f2f4f6] rounded-2xl" />
            <div className="h-32 bg-[#f2f4f6] rounded-2xl" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col bg-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <Navbar />
        <main className="flex-1 max-w-6xl mx-auto w-full px-5 sm:px-10 py-16 flex items-center justify-center">
          <div className="text-center">
            <p className="text-[#737686] mb-4">Kamu belum login nih.</p>
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2.5 rounded-full bg-[#004ac6] text-white text-[14px] font-semibold"
            >
              Login
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const inputCls =
    'w-full px-3 py-2 rounded-lg border border-[#c3c6d7] outline-none focus:border-[#004ac6] focus:ring-2 focus:ring-[#004ac6]/20 text-sm transition';

  return (
    <div className="min-h-screen flex flex-col bg-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-5 sm:px-10 py-8">
        <h1 className="text-[28px] font-bold text-[#191c1e] mb-6">Profil Saya</h1>

        <VerifyEmailBanner />

        {error && (
          <div className="bg-[#ffdad6] border border-[#ba1a1a]/20 rounded-2xl px-4 py-3 mb-4">
            <p className="text-[13px] text-[#93000a]">{error}</p>
          </div>
        )}
        {savedMessage && (
          <div className="bg-[#d7f5dc] border border-[#156b32]/20 rounded-2xl px-4 py-3 mb-4">
            <p className="text-[13px] text-[#156b32]">{savedMessage}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* ── Left column ── */}
          <div className="space-y-5">
            {/* Summary card */}
            <div className="bg-[#191c1e] rounded-2xl p-6 text-white">
              <div className="w-14 h-14 rounded-full bg-[#004ac6] flex items-center justify-center mb-3">
                <Icon name="user" size={28} className="" />
              </div>
              <p className="text-[17px] font-bold">{profile.name || profile.username}</p>
              <p className="text-[12px] text-[#9ea3b0]">{profile.email}</p>
              {profile.seller && (
                <div className="mt-3 px-3 py-2 bg-white/10 rounded-lg">
                  <p className="text-[11px] text-[#9ea3b0] uppercase">Toko</p>
                  <p className="text-[13px] font-semibold">{profile.seller.storeName}</p>
                  <p className="text-[11px] text-[#9ea3b0]">Rating: {profile.seller.rating}</p>
                </div>
              )}
            </div>

            {/* Quick links */}
            <div className="bg-white border border-[#e0e3e5] rounded-2xl overflow-hidden">
              <button
                onClick={() => navigate('/orders')}
                className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-[#f8f9fb] transition-colors"
              >
                <span className="flex items-center gap-2 text-[13px] font-semibold text-[#191c1e]">
                  <Icon name="orders" size={16} className="text-[#004ac6]" /> Pesanan ({profile._count?.orders ?? 0})
                </span>
              </button>
              <button
                onClick={() => navigate('/wishlist')}
                className="w-full flex items-center justify-between px-5 py-3.5 text-left border-t border-[#e0e3e5] hover:bg-[#f8f9fb] transition-colors"
              >
                <span className="flex items-center gap-2 text-[13px] font-semibold text-[#191c1e]">
                  <Icon name="heart" size={16} className="text-[#004ac6]" /> Wishlist
                </span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-between px-5 py-3.5 text-left border-t border-[#e0e3e5] hover:bg-[#f8f9fb] transition-colors"
              >
                <span className="flex items-center gap-2 text-[13px] font-semibold text-[#ba1a1a]">
                  <Icon name="logout" size={16} className="" /> Keluar
                </span>
              </button>
            </div>
          </div>

          {/* ── Right column ── */}
          <div className="lg:col-span-2 space-y-5">
            {/* Profile form */}
            <div className="bg-white border border-[#e0e3e5] rounded-2xl p-5">
              <h3 className="flex items-center gap-2 text-[15px] font-bold text-[#191c1e] mb-4">
                <Icon name="user" size={16} className="text-[#004ac6]" /> Informasi Akun
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#737686] mb-1">Nama</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#737686] mb-1">Username</label>
                  <input type="text" value={profile.username} disabled className={`${inputCls} bg-[#f2f4f6] cursor-not-allowed`} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#737686] mb-1">Email</label>
                  <input type="email" value={profile.email} disabled className={`${inputCls} bg-[#f2f4f6] cursor-not-allowed`} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#737686] mb-1">No. HP</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} />
                </div>
              </div>
              <button
                onClick={handleSaveProfile}
                disabled={savingProfile}
                className="mt-4 flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#004ac6] hover:bg-[#003ea8] text-white text-[13px] font-semibold transition-colors disabled:opacity-50"
              >
                {savingProfile && <Icon name="clock" size={16} className="animate-spin" />}
                Simpan Perubahan
              </button>
            </div>

            {/* Toko — pendaftaran penjual pindah ke sini dari form register:
                nama perusahaan, alamat, dan logo tidak muat diminta saat
                register, dan tidak semua pembeli mau langsung buka toko. */}
            <div className="bg-white border border-[#e0e3e5] rounded-2xl p-5">
              <h3 className="flex items-center gap-2 text-[15px] font-bold text-[#191c1e] mb-1">
                <Icon name="shop" size={16} className="text-[#004ac6]" />
                {profile.seller ? 'Toko Saya' : 'Buka Toko'}
              </h3>

              {profile.seller ? (
                <>
                  <p className="text-[13px] text-[#737686] mb-4">
                    {profile.seller.storeName} — {profile.seller.status === 'ACTIVE' ? 'toko kamu aktif' : 'toko kamu sedang disuspend'}.
                    Mau ubah data toko? Buka Setelan Toko.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => navigate('/seller/dashboard')}
                      className="px-6 py-2.5 rounded-full bg-[#004ac6] hover:bg-[#003ea8] text-white text-[13px] font-semibold transition-colors"
                    >
                      Dashboard Toko
                    </button>
                    <button
                      onClick={() => navigate('/seller/settings')}
                      className="px-6 py-2.5 rounded-full border border-[#c3c6d7] text-[13px] font-semibold text-[#191c1e] hover:bg-[#f8f9fb] transition-colors"
                    >
                      Setelan Toko
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-[13px] text-[#737686] mb-4">
                    Lengkapi data perusahaan untuk mulai berjualan. Akun kamu tetap bisa
                    dipakai membeli seperti biasa.
                  </p>
                  <SellerRegisterForm onRegistered={loadData} />
                </>
              )}
            </div>

            {/* Addresses */}
            <div className="bg-white border border-[#e0e3e5] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="flex items-center gap-2 text-[15px] font-bold text-[#191c1e]">
                  <Icon name="pin" size={16} className="text-[#004ac6]" /> Alamat Saya
                </h3>
                <button
                  onClick={() => setShowAddressForm(true)}
                  className="flex items-center gap-1.5 text-[12px] text-[#004ac6] hover:underline"
                >
                  <Icon name="plus" size={14} className="" />
                  Tambah Alamat
                </button>
              </div>
              {addresses.length === 0 ? (
                <p className="text-[13px] text-[#737686]">Belum ada alamat tersimpan.</p>
              ) : (
                <div className="space-y-2">
                  {addresses.map((addr) => (
                    <div key={addr.id} className="flex items-center justify-between gap-3 bg-[#f8f9fb] rounded-xl p-3">
                      <div>
                        <p className="text-[13px] font-semibold text-[#191c1e]">
                          {addr.recipientName}
                          {addr.isDefault && <span className="ml-2 px-2 py-0.5 rounded-full bg-[#dbe1ff] text-[10px] font-semibold text-[#004ac6]">Utama</span>}
                        </p>
                        <p className="text-[12px] text-[#737686]">
                          {addr.fullAddress}, {addr.city}, {addr.province} {addr.postalCode}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteAddress(addr.id)}
                        className="text-[11px] text-[#ba1a1a] hover:underline shrink-0"
                      >
                        Hapus
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Password */}
            <div className="bg-white border border-[#e0e3e5] rounded-2xl p-5">
              <h3 className="flex items-center gap-2 text-[15px] font-bold text-[#191c1e] mb-4">
                <Icon name="lock" size={16} className="text-[#004ac6]" /> Ganti Password
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#737686] mb-1">Password Saat Ini</label>
                  <input
                    type="password"
                    value={pw.currentPassword}
                    onChange={(e) => setPw((p) => ({ ...p, currentPassword: e.target.value }))}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#737686] mb-1">Password Baru</label>
                  <input
                    type="password"
                    value={pw.newPassword}
                    onChange={(e) => setPw((p) => ({ ...p, newPassword: e.target.value }))}
                    className={inputCls}
                  />
                </div>
              </div>
              <button
                onClick={handleChangePassword}
                disabled={savingPw || !pw.currentPassword || !pw.newPassword}
                className="mt-4 flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#191c1e] hover:bg-[#004ac6] text-white text-[13px] font-semibold transition-colors disabled:opacity-50"
              >
                {savingPw && <Icon name="clock" size={16} className="animate-spin" />}
                Ganti Password
              </button>
            </div>
          </div>
        </div>
      </main>

      {showAddressForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-[#e0e3e5]">
              <h3 className="text-[15px] font-bold text-[#191c1e]">Alamat Baru</h3>
              <button
                onClick={() => setShowAddressForm(false)}
                className="text-[#737686] hover:text-[#191c1e] transition-colors"
              >
                <Icon name="close" size={20} className="" />
              </button>
            </div>
            <form onSubmit={handleSaveAddress} className="p-5 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="Nama Penerima"
                  value={addressForm.recipientName}
                  onChange={(v) => updateField('recipientName', v)}
                  error={fieldErrors.recipientName}
                  required
                />
                <Field
                  label="No. HP"
                  value={addressForm.phone}
                  onChange={(v) => updateField('phone', v)}
                  error={fieldErrors.phone}
                  required
                />
              </div>
              <Field
                label="Alamat Lengkap"
                value={addressForm.fullAddress}
                onChange={(v) => updateField('fullAddress', v)}
                error={fieldErrors.fullAddress}
                required
              />
              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="Kota"
                  value={addressForm.city}
                  onChange={(v) => updateField('city', v)}
                  error={fieldErrors.city}
                  required
                />
                <Field
                  label="Provinsi"
                  value={addressForm.province}
                  onChange={(v) => updateField('province', v)}
                  error={fieldErrors.province}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="Kode Pos"
                  value={addressForm.postalCode}
                  onChange={(v) => updateField('postalCode', v)}
                  error={fieldErrors.postalCode}
                  required
                />
                <Field
                  label="Label (mis. Rumah)"
                  value={addressForm.label}
                  onChange={(v) => updateField('label', v)}
                  error={fieldErrors.label}
                />
              </div>
              <button
                type="submit"
                disabled={savingAddress}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#004ac6] hover:bg-[#003ea8] text-white text-[14px] font-semibold transition-colors disabled:opacity-50"
              >
                {savingAddress && <Icon name="clock" size={16} className="animate-spin" />}
                Simpan Alamat
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

const Field: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  error?: string;
}> = ({ label, value, onChange, required, error }) => (
  <div>
    <label className="block text-xs font-medium text-[#737686] mb-1">{label}</label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      className={`w-full px-3 py-2 rounded-lg border outline-none focus:ring-2 text-sm transition ${
        error
          ? 'border-[#ba1a1a] focus:border-[#ba1a1a] focus:ring-[#ba1a1a]/20'
          : 'border-[#c3c6d7] focus:border-[#004ac6] focus:ring-[#004ac6]/20'
      }`}
    />
    {error && <p className="mt-1 text-[11px] text-[#ba1a1a]">{error}</p>}
  </div>
);

export default ProfilePage;
