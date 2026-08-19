import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Icon from '../components/ui/Icon';
import NeedPayLoginPrompt from '../components/needpay/NeedPayLoginPrompt';

import { formatRupiah } from '../utils/currency';
import { getAccessToken } from '../api/auth';
import {
  getWallet,
  lookupAccount,
  setWalletPin,
  transferBalance,
  type AccountLookup,
  type Wallet,
} from '../api/wallet';

/**
 * Kirim saldo NeedPay ke pengguna lain.
 *
 * Bahasanya sengaja mengikuti NeedPay, bukan permukaan belanja: kertas krem,
 * tinta gelap, nominal hijau cetak, nomor rekening diperlakukan sebagai nomor
 * seri. Aturan itu ditetapkan di index.css supaya saldo terbaca sebagai UANG
 * dan tidak pernah tertukar dengan tombol aksi kobalt.
 *
 * Alurnya tiga langkah berurutan, dan penomorannya bukan hiasan: tiap langkah
 * benar-benar bergantung pada langkah sebelumnya. Nama penerima harus terbaca
 * sebelum nominal diisi, dan nominal harus pasti sebelum PIN diminta.
 */

const KERTAS = '#f4efe4';
const KERTAS_LIPAT = '#e6ddc9';
const TINTA = '#12100e';
const RUPIAH = '#0e7a5f';
const CAP = '#e8452c';

const NOMINAL_CEPAT = [20000, 50000, 100000, 250000];

const Langkah: React.FC<{ n: number; judul: string; aktif: boolean; children: React.ReactNode }> = ({
  n,
  judul,
  aktif,
  children,
}) => (
  <section className={aktif ? '' : 'opacity-45'} aria-disabled={!aktif}>
    <div className="mb-2.5 flex items-center gap-2.5">
      <span
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-[11px] font-bold"
        style={{ background: TINTA, color: KERTAS }}
      >
        {n}
      </span>
      <h2
        className="text-[11px] font-bold uppercase tracking-[0.16em]"
        style={{ color: TINTA }}
      >
        {judul}
      </h2>
    </div>
    <div className="pl-[34px]">{children}</div>
  </section>
);

const NeedPayTransferPage: React.FC = () => {
  const navigate = useNavigate();
  const isAuthed = Boolean(getAccessToken());

  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [nomor, setNomor] = useState('');
  const [penerima, setPenerima] = useState<AccountLookup | null>(null);
  const [mencari, setMencari] = useState(false);
  const [nominal, setNominal] = useState('');
  const [pin, setPin] = useState('');
  const [catatan, setCatatan] = useState('');
  const [kirim, setKirim] = useState(false);
  const [galat, setGalat] = useState<string | null>(null);
  const [selesai, setSelesai] = useState<{ jumlah: string; ke: AccountLookup } | null>(null);

  // PIN baru dipasang di sini juga: tanpa PIN transfer mustahil, dan menyuruh
  // user pindah halaman di tengah niat mengirim uang itu menyebalkan.
  const [pinBaru, setPinBaru] = useState('');
  const [menyimpanPin, setMenyimpanPin] = useState(false);

  const kunciRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isAuthed) return;
    getWallet()
      .then(setWallet)
      .catch(() => setGalat('Saldo NeedPay gagal dimuat. Muat ulang halamannya ya.'));
  }, [isAuthed]);

  if (!isAuthed) return <NeedPayLoginPrompt />;

  const saldo = Number(wallet?.balance ?? 0);
  const jumlah = Number(nominal.replace(/[^0-9]/g, '') || 0);
  const cukup = jumlah > 0 && jumlah <= saldo;
  const siapKirim = Boolean(penerima) && cukup && jumlah >= 1000 && pin.length === 6 && !kirim;

  const cariPenerima = async () => {
    const bersih = nomor.trim().toUpperCase();
    if (!bersih) return;
    setMencari(true);
    setGalat(null);
    setPenerima(null);
    try {
      const hasil = await lookupAccount(bersih);
      if (hasil.accountNumber === wallet?.accountNumber) {
        setGalat('Itu nomor rekening kamu sendiri.');
        return;
      }
      setPenerima(hasil);
    } catch {
      setGalat('Nomor rekening itu nggak terdaftar. Cek lagi angkanya.');
    } finally {
      setMencari(false);
    }
  };

  const simpanPin = async () => {
    if (pinBaru.length !== 6) return;
    setMenyimpanPin(true);
    setGalat(null);
    try {
      await setWalletPin(pinBaru);
      setWallet((w) => (w ? { ...w, hasPin: true } : w));
      setPinBaru('');
    } catch (err: any) {
      setGalat(err.message ?? 'PIN gagal disimpan, coba lagi ya.');
    } finally {
      setMenyimpanPin(false);
    }
  };

  const kirimSekarang = async () => {
    if (!penerima || kirim) return;
    setKirim(true);
    setGalat(null);
    try {
      if (!kunciRef.current) kunciRef.current = crypto.randomUUID();
      const hasil = await transferBalance(
        {
          toAccountNumber: penerima.accountNumber,
          amount: jumlah,
          pin,
          ...(catatan.trim() ? { note: catatan.trim() } : {}),
        },
        kunciRef.current
      );
      kunciRef.current = null;
      setWallet((w) => (w ? { ...w, balance: String(hasil.balance) } : w));
      setSelesai({ jumlah: hasil.amount, ke: hasil.to });
      setPin('');
      setNominal('');
      setCatatan('');
    } catch (err: any) {
      setGalat(err.message ?? 'Transfernya gagal. Saldo kamu nggak berubah.');
    } finally {
      setKirim(false);
    }
  };

  const inputKertas =
    'w-full rounded-xl border px-3.5 py-2.5 text-[14px] outline-none transition-colors';
  const gayaInput = {
    background: '#fffdf8',
    borderColor: KERTAS_LIPAT,
    color: TINTA,
  } as React.CSSProperties;

  return (
    <div
      className="flex min-h-screen flex-col bg-[#f2f4f6]"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <Navbar />

      <main className="mx-auto w-full max-w-[720px] flex-1 px-4 py-8 sm:px-6">
        <button
          type="button"
          onClick={() => navigate('/needpay')}
          className="mb-5 inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#434655] hover:text-[#101319]"
        >
          <Icon name="arrowLeft" size={13} />
          Kembali ke NeedPay
        </button>

        {/* Slip transfer. Kertas, bukan kartu aplikasi. */}
        <div
          className="overflow-hidden rounded-[20px] shadow-[0_18px_50px_rgba(18,16,14,0.14)]"
          style={{ background: KERTAS }}
        >
          <header
            className="flex flex-wrap items-end justify-between gap-3 px-5 py-4 sm:px-7"
            style={{ borderBottom: `1px dashed ${KERTAS_LIPAT}` }}
          >
            <div>
              <p
                className="text-[10px] font-bold uppercase tracking-[0.2em]"
                style={{ color: RUPIAH }}
              >
                NeedPay
              </p>
              <h1 className="mt-0.5 text-[22px] font-bold" style={{ color: TINTA }}>
                Kirim saldo
              </h1>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-[0.14em]" style={{ color: '#7b7365' }}>
                Saldo kamu
              </p>
              <p
                className="text-[19px] font-bold tabular-nums"
                style={{ color: RUPIAH }}
              >
                {formatRupiah(saldo)}
              </p>
              {wallet && (
                <p
                  className="mt-0.5 font-mono text-[11px] tracking-[0.18em]"
                  style={{ color: '#7b7365' }}
                >
                  {wallet.accountNumber}
                </p>
              )}
            </div>
          </header>

          {selesai ? (
            <div className="px-5 py-10 text-center sm:px-7">
              <span
                className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full"
                style={{ background: RUPIAH, color: KERTAS }}
              >
                <Icon name="check" size={26} />
              </span>
              <p className="text-[13px]" style={{ color: '#7b7365' }}>
                Terkirim ke
              </p>
              <p className="text-[17px] font-bold" style={{ color: TINTA }}>
                {selesai.ke.name}
              </p>
              <p className="mt-3 text-[28px] font-bold tabular-nums" style={{ color: RUPIAH }}>
                {formatRupiah(selesai.jumlah)}
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelesai(null);
                    setPenerima(null);
                    setNomor('');
                  }}
                  className="h-10 rounded-full px-5 text-[13px] font-semibold"
                  style={{ background: TINTA, color: KERTAS }}
                >
                  Kirim lagi
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/needpay')}
                  className="h-10 rounded-full px-5 text-[13px] font-semibold"
                  style={{ border: `1px solid ${KERTAS_LIPAT}`, color: TINTA }}
                >
                  Lihat riwayat
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-7 px-5 py-6 sm:px-7">
              {galat && (
                <p
                  className="rounded-xl px-3.5 py-2.5 text-[12px] font-medium"
                  style={{ background: '#fdeae6', color: CAP }}
                  role="alert"
                >
                  {galat}
                </p>
              )}

              <Langkah n={1} judul="Rekening tujuan" aktif>
                <div className="flex flex-wrap gap-2">
                  <input
                    value={nomor}
                    onChange={(e) => setNomor(e.target.value.toUpperCase())}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        cariPenerima();
                      }
                    }}
                    placeholder="NP0000000001"
                    className={`${inputKertas} min-w-0 flex-1 font-mono tracking-[0.14em]`}
                    style={gayaInput}
                    aria-label="Nomor rekening tujuan"
                  />
                  <button
                    type="button"
                    onClick={cariPenerima}
                    disabled={mencari || !nomor.trim()}
                    className="h-[42px] shrink-0 rounded-xl px-4 text-[13px] font-semibold disabled:opacity-45"
                    style={{ background: TINTA, color: KERTAS }}
                  >
                    {mencari ? 'Mencari…' : 'Cek'}
                  </button>
                </div>

                {penerima && (
                  <div
                    className="mt-2.5 flex items-center gap-2.5 rounded-xl px-3.5 py-2.5"
                    style={{ background: '#e8f2ec', border: `1px solid ${RUPIAH}33` }}
                  >
                    <Icon name="check" size={14} style={{ color: RUPIAH }} />
                    <p className="text-[13px] font-bold" style={{ color: TINTA }}>
                      {penerima.name}
                    </p>
                  </div>
                )}
              </Langkah>

              <Langkah n={2} judul="Jumlah" aktif={Boolean(penerima)}>
                <input
                  value={nominal}
                  onChange={(e) => setNominal(e.target.value.replace(/[^0-9]/g, ''))}
                  inputMode="numeric"
                  placeholder="0"
                  disabled={!penerima}
                  className={`${inputKertas} tabular-nums`}
                  style={gayaInput}
                  aria-label="Jumlah yang dikirim"
                />
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {NOMINAL_CEPAT.map((n) => (
                    <button
                      key={n}
                      type="button"
                      disabled={!penerima || n > saldo}
                      onClick={() => setNominal(String(n))}
                      className="rounded-full px-3 py-1 text-[11px] font-semibold disabled:opacity-40"
                      style={{ border: `1px solid ${KERTAS_LIPAT}`, color: TINTA }}
                    >
                      {formatRupiah(n)}
                    </button>
                  ))}
                </div>
                {jumlah > 0 && !cukup && (
                  <p className="mt-1.5 text-[12px]" style={{ color: CAP }}>
                    Saldo kamu cuma {formatRupiah(saldo)}.
                  </p>
                )}
                {jumlah > 0 && cukup && jumlah < 1000 && (
                  <p className="mt-1.5 text-[12px]" style={{ color: CAP }}>
                    Minimal kirim Rp 1.000.
                  </p>
                )}
                <input
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  placeholder="Catatan buat penerima (opsional)"
                  maxLength={120}
                  disabled={!penerima}
                  className={`${inputKertas} mt-2 text-[13px]`}
                  style={gayaInput}
                  aria-label="Catatan"
                />
              </Langkah>

              {/* Membuat PIN tidak boleh ikut diredupkan: user yang belum punya PIN
                  harus bisa membuatnya kapan saja, tidak menunggu nominal terisi. */}
              <Langkah
                n={3}
                judul="PIN"
                aktif={wallet ? !wallet.hasPin || (Boolean(penerima) && cukup) : false}
              >
                {wallet && !wallet.hasPin ? (
                  <div
                    className="rounded-xl px-3.5 py-3"
                    style={{ background: '#fdf6e3', border: `1px solid ${KERTAS_LIPAT}` }}
                  >
                    <p className="text-[12px] font-semibold" style={{ color: TINTA }}>
                      Kamu belum punya PIN
                    </p>
                    <p className="mb-2.5 mt-0.5 text-[11px]" style={{ color: '#7b7365' }}>
                      Bikin PIN 6 angka sekarang. Ini yang dipakai tiap kali kirim saldo.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <input
                        value={pinBaru}
                        onChange={(e) => setPinBaru(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                        inputMode="numeric"
                        type="password"
                        placeholder="······"
                        className={`${inputKertas} w-32 text-center font-mono tracking-[0.4em]`}
                        style={gayaInput}
                        aria-label="PIN baru"
                      />
                      <button
                        type="button"
                        onClick={simpanPin}
                        disabled={pinBaru.length !== 6 || menyimpanPin}
                        className="h-[42px] rounded-xl px-4 text-[13px] font-semibold disabled:opacity-45"
                        style={{ background: RUPIAH, color: KERTAS }}
                      >
                        {menyimpanPin ? 'Menyimpan…' : 'Simpan PIN'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <input
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                    inputMode="numeric"
                    type="password"
                    placeholder="······"
                    disabled={!penerima || !cukup}
                    className={`${inputKertas} w-40 text-center font-mono tracking-[0.4em]`}
                    style={gayaInput}
                    aria-label="PIN transfer"
                  />
                )}
              </Langkah>

              <div style={{ borderTop: `1px dashed ${KERTAS_LIPAT}` }} className="pt-5">
                <button
                  type="button"
                  onClick={kirimSekarang}
                  disabled={!siapKirim}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-full text-[14px] font-bold transition-opacity disabled:opacity-40"
                  style={{ background: RUPIAH, color: KERTAS }}
                >
                  {kirim ? (
                    <>
                      <Icon name="clock" size={16} className="animate-spin" />
                      Mengirim…
                    </>
                  ) : (
                    <>
                      <Icon name="send" size={16} />
                      Kirim {jumlah > 0 ? formatRupiah(jumlah) : 'saldo'}
                    </>
                  )}
                </button>
                <p className="mt-2 text-center text-[11px]" style={{ color: '#7b7365' }}>
                  Saldo pindah begitu tombol ditekan dan nggak bisa dibatalkan.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NeedPayTransferPage;
