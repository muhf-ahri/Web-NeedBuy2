// src/pages/ForgotPasswordPage.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/ui/Icon';
import Button from '../components/ui/Button';
import { forgotPassword } from '../api/auth';

const FIELD_CLASS =
  'w-full rounded-xl border border-[#c3c6d7] px-4 py-2.5 text-sm outline-none transition focus:border-[#004ac6] focus:ring-2 focus:ring-[#004ac6]/20';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;

    setBusy(true);
    setError(null);
    try {
      await forgotPassword(email.trim().toLowerCase());
      setSent(true);
    } catch (err: any) {
      setError(err?.message ?? 'Gagal kirim tautannya, coba lagi ya');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8f9fb] p-4">
      <div className="w-full max-w-md rounded-2xl border border-[#e0e3e5] bg-white p-8">
        {sent ? (
          <div className="text-center">
            <Icon name="check" size={36} className="mx-auto text-[#156b32]" />
            <h1 className="mt-4 text-[20px] font-bold text-[#191c1e]">Cek email kamu</h1>
            {/* Sengaja tidak bilang "akun ditemukan" — pesan yang sama muncul
                buat email yang nggak terdaftar, biar halaman ini nggak bisa
                dipakai ngecek siapa aja yang punya akun NeedBuy. */}
            <p className="mt-2 text-[14px] leading-relaxed text-[#737686]">
              Kalau <span className="font-semibold text-[#434655]">{email}</span> terdaftar di
              NeedBuy, tautan buat atur ulang password udah kami kirim ke sana. Tautannya
              berlaku 1 jam.
            </p>
            <p className="mt-2 text-[12px] text-[#737686]">
              Nggak ada di kotak masuk? Coba cek folder spam atau promosi.
            </p>
            <Link to="/login">
              <Button variant="primary" className="mt-5 w-full py-2.5 text-sm">
                Kembali ke Masuk
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-[22px] font-bold text-[#191c1e]">Lupa password?</h1>
            <p className="mt-1.5 text-[14px] text-[#737686]">
              Tulis email yang kamu pakai daftar. Kami kirimin tautan buat bikin password baru.
            </p>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              {error && (
                <div className="rounded-lg border border-[#ffbcbc] bg-[#ffe0e0] p-2.5 text-xs text-[#a33131]">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="fp-email" className="mb-1 block text-[13px] font-medium text-[#737686]">
                  Email
                </label>
                <input
                  id="fp-email"
                  type="email"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="kamu@email.com"
                  className={FIELD_CLASS}
                />
              </div>

              <Button type="submit" variant="primary" disabled={busy} className="w-full py-2.5 text-sm">
                {busy ? 'Ngirim…' : 'Kirim Tautan'}
              </Button>
            </form>

            <p className="mt-5 text-center text-[13px] text-[#737686]">
              Inget passwordnya?{' '}
              <Link to="/login" className="font-semibold text-[#004ac6] hover:underline">
                Masuk
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
