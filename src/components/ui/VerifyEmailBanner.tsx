// src/components/ui/VerifyEmailBanner.tsx
import React, { useState } from 'react';
import Icon from './Icon';
import { resendVerification } from '../../api/auth';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Muncul cuma buat akun yang emailnya belum diverifikasi. Ini satu-satunya
 * pintu masuk ke `POST /auth/resend-verification` — tanpa ini, user yang
 * emailnya nggak sampai nggak punya cara minta kirim ulang.
 */
const VerifyEmailBanner: React.FC = () => {
  const { user } = useAuth();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  // `undefined` = backend versi lama yang belum mengirim field ini. Diamkan,
  // jangan tuduh user belum verifikasi hanya karena datanya nggak ada.
  if (!user || user.emailVerifiedAt !== null) return null;

  const handleResend = async () => {
    setBusy(true);
    setFailed(false);
    try {
      await resendVerification();
      setMessage('Tautannya udah dikirim ulang. Cek kotak masuk atau folder spam ya.');
    } catch (err: any) {
      setFailed(true);
      setMessage(err?.message ?? 'Gagal kirim ulang, coba lagi nanti ya');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mb-4 rounded-2xl border border-[#f0c36d] bg-[#fff4e0] px-4 py-3">
      <div className="flex flex-wrap items-center gap-3">
        <Icon name="alert" size={18} className="shrink-0 text-[#b45309]" />
        <p className="min-w-0 flex-1 text-[13px] text-[#8a5a09]">
          Email <span className="font-semibold">{user.email}</span> belum diverifikasi. Cek
          kotak masukmu buat konfirmasi.
        </p>
        <button
          type="button"
          onClick={handleResend}
          disabled={busy}
          className="shrink-0 rounded-lg border border-[#b45309]/30 px-3 py-1.5 text-[12px] font-semibold text-[#b45309] transition-colors hover:bg-[#f0c36d]/30 disabled:opacity-50"
        >
          {busy ? 'Ngirim…' : 'Kirim Ulang'}
        </button>
      </div>
      {message && (
        <p className={`mt-2 text-[12px] ${failed ? 'text-[#a33131]' : 'text-[#156b32]'}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default VerifyEmailBanner;
