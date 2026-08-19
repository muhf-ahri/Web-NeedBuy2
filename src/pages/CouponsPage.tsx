import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Icon from '../components/ui/Icon';
import { formatRupiah } from '../utils/currency';
import { claimCoupon, claimCouponByCode, getCoupons, COUPON_SKIN, type Coupon } from '../api/coupons';
import { getAccessToken } from '../api/auth';

const TABS = [
  { key: 'available' as const, label: 'Tersedia' },
  { key: 'mine' as const, label: 'Kupon Saya' },
];

const valueLabel = (coupon: Coupon) => {
  if (coupon.type === 'FREE_SHIPPING') return 'GRATIS';
  if (coupon.type === 'PERCENT') return `${Number(coupon.value)}%`;
  return formatRupiah(coupon.value);
};

const expiryLabel = (iso: string | null) => {
  if (!iso) return 'Nggak ada batas waktu';
  const date = new Date(iso);
  const days = Math.ceil((date.getTime() - Date.now()) / 86_400_000);
  if (days <= 0) return 'Udah kedaluwarsa';
  if (days <= 3) return `Berakhir ${days} hari lagi`;
  return `Berlaku sampai ${date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}`;
};

const CouponCard: React.FC<{
  coupon: Coupon;
  busy: boolean;
  onClaim: (id: string) => void;
}> = ({ coupon, busy, onClaim }) => {
  const used = !!coupon.usedAt;
  const dead = used || coupon.expired || coupon.soldOut;
  const skin = COUPON_SKIN[coupon.category] ?? COUPON_SKIN.DISCOUNT;

  return (
    <article
      className={`relative flex overflow-hidden rounded-2xl border border-[#e0e3e5] bg-white ${
        dead ? 'opacity-60' : ''
      }`}
    >
      <div
        className="w-24 shrink-0 flex flex-col items-center justify-center gap-1 px-2 border-r border-dashed"
        style={{ backgroundColor: skin.stub, color: skin.ink, borderColor: skin.edge }}
      >
        <Icon name={coupon.type === 'FREE_SHIPPING' ? 'truck' : 'tag'} size={18} />
        <span className="text-[17px] font-bold leading-none text-center break-all">
          {valueLabel(coupon)}
        </span>
        <span className="text-[10px] uppercase tracking-wide text-center leading-tight">
          {skin.label}
        </span>
      </div>

      <div className="flex-1 p-4 min-w-0">
        <h3 className="text-[14px] font-bold text-[#101319] truncate">{coupon.title}</h3>
        {coupon.description && (
          <p className="text-[12px] text-[#434655] mt-0.5 line-clamp-2">{coupon.description}</p>
        )}

        <dl className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[#737686]">
          <div className="flex gap-1">
            <dt>Min. belanja</dt>
            <dd className="font-semibold text-[#434655]">
              {Number(coupon.minSpend) > 0 ? formatRupiah(coupon.minSpend) : 'Tidak ada'}
            </dd>
          </div>
          <div className="flex gap-1">
            <dt>Kode</dt>
            <dd className="font-mono font-semibold text-[#434655]">{coupon.code}</dd>
          </div>
        </dl>

        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="text-[11px] text-[#737686]">
            {used
              ? `Dipakai ${new Date(coupon.usedAt!).toLocaleDateString('id-ID')}`
              : expiryLabel(coupon.expiresAt)}
          </span>

          {coupon.claimed ? (
            <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#12805c]">
              <Icon name="check" size={14} />
              {used ? 'Udah dipakai' : 'Udah disimpan'}
            </span>
          ) : (
            <button
              onClick={() => onClaim(coupon.id)}
              disabled={busy || coupon.soldOut}
              className="px-4 py-1.5 rounded-full bg-[#4077a6] hover:bg-[#284a67] text-white text-[12px] font-semibold transition-colors disabled:opacity-50"
            >
              {coupon.soldOut ? 'Kuota habis' : 'Klaim'}
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

const CouponsPage: React.FC = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'available' | 'mine'>('available');
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [code, setCode] = useState('');

  const isAuthed = !!getAccessToken();

  const fetchCoupons = useCallback(async () => {
    if (!isAuthed) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getCoupons(tab);
      setCoupons(res.data.data);
    } catch (err: any) {
      setError(err.message ?? 'Gagal muat kupon, coba lagi ya');
    } finally {
      setLoading(false);
    }
  }, [isAuthed, tab]);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const handleClaim = async (id: string) => {
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      await claimCoupon(id);
      setNotice('Kupon udah kesimpen. Cek di tab Kupon Saya ya.');
      await fetchCoupons();
    } catch (err: any) {
      setError(err.message ?? 'Gagal klaim kupon, coba lagi ya');
    } finally {
      setBusy(false);
    }
  };

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      const res = await claimCouponByCode(code.trim().toUpperCase());
      setNotice(`Kupon "${res.data.data.title}" tersimpan.`);
      setCode('');
      await fetchCoupons();
    } catch (err: any) {
      setError(err.message ?? 'Kode kuponnya nggak bisa dipakai');
    } finally {
      setBusy(false);
    }
  };

  if (!isAuthed) {
    return (
      <div className="min-h-screen flex flex-col bg-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <Navbar />
        <main className="flex-1 max-w-6xl mx-auto w-full px-5 sm:px-10 py-16 flex items-center justify-center">
          <div className="text-center">
            <Icon name="coupon" size={44} className="text-[#c3c6d7] mx-auto mb-4" />
            <p className="text-[#737686] mb-4">Login dulu ya buat ngumpulin kupon.</p>
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2.5 rounded-full bg-[#4077a6] hover:bg-[#284a67] text-white text-[14px] font-semibold transition-colors"
            >
              Login
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto w-full px-5 sm:px-10 py-8">
        <h1 className="text-[28px] font-bold text-[#101319] mb-1">Kupon</h1>
        <p className="text-[13px] text-[#737686] mb-6">
          Klaim kupon sekarang, pakai saat checkout.
        </p>

        <form onSubmit={handleRedeem} className="flex gap-2 mb-6">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Punya kode kupon? Tempel di sini"
            className="flex-1 px-4 py-2.5 rounded-full border border-[#c3c6d7] outline-none focus:border-[#538cbd] focus:ring-2 focus:ring-[#538cbd]/20 text-[13px] uppercase transition"
            aria-label="Kode kupon"
          />
          <button
            type="submit"
            disabled={busy || !code.trim()}
            className="px-5 py-2.5 rounded-full bg-[#4077a6] hover:bg-[#284a67] text-white text-[13px] font-semibold transition-colors disabled:opacity-50"
          >
            Tukar
          </button>
        </form>

        {notice && (
          <div className="bg-[#e6f4ee] border border-[#12805c]/20 rounded-2xl px-4 py-3 mb-4">
            <p className="text-[13px] text-[#12805c]">{notice}</p>
          </div>
        )}
        {error && (
          <div className="bg-[#ffdad6] border border-[#ba1a1a]/20 rounded-2xl px-4 py-3 mb-4">
            <p className="text-[13px] text-[#93000a]">{error}</p>
          </div>
        )}

        <div className="flex gap-2 mb-6">
          {TABS.map((item) => (
            <button
              key={item.key}
              onClick={() => setTab(item.key)}
              className={`px-4 py-1.5 rounded-full text-[12px] font-semibold transition-colors ${
                tab === item.key
                  ? 'bg-[#4077a6] text-white'
                  : 'bg-[#f2f4f6] text-[#434655] hover:bg-[#e0e3e5]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-28 bg-[#f2f4f6] rounded-2xl" />
            <div className="h-28 bg-[#f2f4f6] rounded-2xl" />
          </div>
        ) : coupons.length === 0 ? (
          <div className="text-center py-16">
            <Icon name="coupon" size={44} className="text-[#c3c6d7] mx-auto mb-4" />
            <p className="text-[#737686] text-[14px]">
              {tab === 'mine'
                ? 'Belum ada kupon kesimpen. Klaim dulu dari tab Tersedia.'
                : 'Belum ada kupon baru buat sekarang.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {coupons.map((coupon) => (
              <CouponCard key={coupon.id} coupon={coupon} busy={busy} onClaim={handleClaim} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CouponsPage;
