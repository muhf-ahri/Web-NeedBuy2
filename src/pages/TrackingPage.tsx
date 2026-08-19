import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Icon, { type IconName } from '../components/ui/Icon';
import { getAccessToken } from '../api/auth';
import { markReadWhere, notificationSocketUrl } from '../api/notifications';
import {
  getTracking, STAGE_LABEL,
  type OrderTracking, type TrackingEvent, type TrackingStage,
} from '../api/tracking';

const timeOf = (iso: string) =>
  new Date(iso).toLocaleString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

/** Ikon per tahap — dipakai di rel rute dan di riwayat, biar tiap jejak punya wajah sendiri. */
const STAGE_ICON: Record<TrackingStage, IconName> = {
  PACKING: 'layers',
  PICKED_UP: 'shop',
  IN_TRANSIT: 'truck',
  OUT_FOR_DELIVERY: 'pin',
  DELIVERED: 'check',
  RETURNED: 'arrowLeft',
  CANCELLED: 'close',
};

const isBadStage = (stage: TrackingStage | null) =>
  stage === 'RETURNED' || stage === 'CANCELLED';

/* ───────────────────────── rel rute ───────────────────────── */

const StageRail: React.FC<{
  stages: TrackingStage[];
  reached: TrackingStage | null;
}> = ({ stages, reached }) => {
  const reduceMotion = useReducedMotion();
  const reachedIndex = reached ? stages.indexOf(reached) : -1;
  const last = stages.length - 1;
  const progress = last > 0 ? Math.max(reachedIndex, 0) / last : 0;
  const accent = isBadStage(reached) ? '#ba1a1a' : '#4077a6';

  return (
    <div className="relative">
      {/* jalur kurir: garis putus-putus yang terisi seiring paket jalan */}
      <div className="absolute inset-x-[7%] top-[18px] h-1 rounded-full bg-[#e0e3e5]" />
      <motion.div
        className="absolute left-[7%] top-[18px] h-1 origin-left rounded-full"
        style={{ width: '86%', backgroundColor: accent }}
        initial={{ scaleX: reduceMotion ? progress : 0 }}
        animate={{ scaleX: progress }}
        transition={{ duration: reduceMotion ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* truk penanda posisi sekarang */}
      {reachedIndex >= 0 && reachedIndex < last && (
        <motion.div
          className="absolute top-[2px] z-10 -ml-[15px]"
          style={{ left: `${7 + progress * 86}%` }}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: reduceMotion ? 0 : 0.7 }}
        >
          <motion.span
            className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#FFD500] text-[#101319] shadow-[0_6px_14px_rgba(255,213,0,0.45)]"
            animate={reduceMotion ? undefined : { y: [0, -3, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Icon name="truck" size={15} />
          </motion.span>
        </motion.div>
      )}

      <ol className="relative flex items-start">
        {stages.map((stage, index) => {
          const done = index <= reachedIndex;
          const current = index === reachedIndex;

          return (
            <li key={stage} className="flex flex-1 flex-col items-center text-center">
              <motion.span
                initial={{ scale: reduceMotion ? 1 : 0.4, opacity: reduceMotion ? 1 : 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: reduceMotion ? 0 : 0.1 + index * 0.08, type: 'spring', stiffness: 320, damping: 20 }}
                className={`
                  flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full
                  border-[3px] border-white transition-colors
                  ${done
                    ? 'text-white shadow-[0_6px_16px_rgba(83,140,219,0.35)]'
                    : 'bg-[#e0e3e5] text-[#A2A8B3]'}
                  ${current ? 'ring-4 ring-[#FFD500]/45' : ''}
                `}
                style={done ? { backgroundColor: accent } : undefined}
              >
                <Icon name={STAGE_ICON[stage]} size={16} />
              </motion.span>

              <span
                className={`
                  mt-2 px-0.5 text-[10px] leading-tight sm:text-[11px]
                  ${done ? 'font-bold text-[#101319]' : 'text-[#737686]'}
                `}
              >
                {STAGE_LABEL[stage]}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

/* ───────────────────────── halaman ───────────────────────── */

const TrackingPage: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const isAuthed = !!getAccessToken();

  const [data, setData] = useState<OrderTracking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [live, setLive] = useState(false);

  const load = useCallback(async () => {
    if (!isAuthed || !id) {
      setLoading(false);
      return;
    }
    try {
      setData(await getTracking(id));
    } catch (err: any) {
      setError(err.message ?? 'Gagal muat lacak paket, coba lagi ya');
    } finally {
      setLoading(false);
    }
  }, [id, isAuthed]);

  // Membuka lacak paket berarti update order ini sudah dilihat, jadi
  // notifikasinya dilunasi — bukan semuanya, hanya yang menyangkut order ini.
  useEffect(() => {
    if (!id) return;
    markReadWhere((n) => n.order?.orderId === id);
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const token = getAccessToken();
    if (!token || !id) return;

    const socket = new WebSocket(notificationSocketUrl(token));
    socket.onopen = () => setLive(true);
    socket.onclose = () => setLive(false);
    socket.onerror = () => setLive(false);

    socket.onmessage = (message) => {
      try {
        const payload = JSON.parse(message.data) as {
          event: string;
          data?: { orderId?: string; event?: TrackingEvent };
        };
        if (payload.event !== 'tracking' || payload.data?.orderId !== id) return;

        const incoming = payload.data.event;
        if (!incoming) return;

        setData((prev) =>
          prev && !prev.events.some((e) => e.id === incoming.id)
            ? { ...prev, events: [...prev.events, incoming] }
            : prev
        );
        load();
      } catch {
      }
    };

    return () => socket.close();
  }, [id, load]);

  const timeline = useMemo(
    () => (data ? [...data.events].reverse() : []),
    [data]
  );

  if (!isAuthed) {
    return (
      <Shell>
        <div className="rounded-[28px] border border-white bg-white/95 px-6 py-16 text-center shadow-[0_10px_30px_rgba(32,36,45,0.07)]">
          <span className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#f5f7fb]">
            <Icon name="lock" size={26} className="text-[#4077a6]" />
          </span>
          <p className="text-[16px] font-extrabold text-[#101319]">Login dulu buat lacak paketmu</p>
          <p className="mt-1.5 text-[13px] text-[#737686]">
            Jejak pengiriman cuma bisa dilihat pemilik pesanan.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="mt-6 rounded-full bg-[#4077a6] px-7 py-3 text-[14px] font-bold text-white shadow-[0_8px_20px_rgba(83,140,219,0.35)] transition hover:bg-[#4077a6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#101319]"
          >
            Login
          </button>
        </div>
      </Shell>
    );
  }

  if (loading) {
    return (
      <Shell>
        <div className="space-y-5">
          <div className="h-[190px] animate-pulse rounded-[28px] bg-white/80" />
          <div className="h-[260px] animate-pulse rounded-[28px] bg-white/60" />
        </div>
      </Shell>
    );
  }

  if (error || !data) {
    return (
      <Shell>
        <div className="rounded-[28px] border border-white bg-white/95 px-6 py-16 text-center shadow-[0_10px_30px_rgba(32,36,45,0.07)]">
          <span className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF0F0]">
            <Icon name="alert" size={26} className="text-[#ba1a1a]" />
          </span>
          <p className="text-[15px] font-bold text-[#101319]">
            {error ?? 'Pesanannya nggak ketemu'}
          </p>
          <p className="mt-1.5 text-[13px] text-[#737686]">
            Cek lagi dari daftar pesanan kamu ya.
          </p>
          <button
            onClick={() => navigate('/orders')}
            className="mt-6 rounded-full border border-[#e0e3e5] px-6 py-2.5 text-[13px] font-bold text-[#4077a6] transition hover:bg-[#f5f7fb]"
          >
            Balik ke daftar pesanan
          </button>
        </div>
      </Shell>
    );
  }

  const accent = isBadStage(data.currentStage) ? '#ba1a1a' : '#4077a6';
  const stageNow = data.currentStage ? STAGE_LABEL[data.currentStage] : 'Belum jalan';

  return (
    <Shell>
      <button
        onClick={() => navigate('/orders')}
        className="mb-5 flex items-center gap-1.5 rounded-full text-[#737686] transition-colors hover:text-[#101319] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4077a6]"
      >
        <Icon name="chevronLeft" size={16} />
        <span className="text-[13px] font-semibold">Balik ke pesanan</span>
      </button>

      {/* ── resi: kartu tiket dengan sobekan di tengah ── */}
      <motion.article
        initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-[28px] border border-white bg-white shadow-[0_14px_40px_rgba(32,36,45,0.09)]"
      >
        <div
          className="relative px-5 pb-8 pt-6 text-white sm:px-7"
          style={{ background: `linear-gradient(135deg, ${accent} 0%, #284a67 100%)` }}
        >
          {/* garis rute dekoratif di latar */}
          <svg
            className="pointer-events-none absolute -right-8 -top-6 h-[150px] w-[260px] opacity-25"
            viewBox="0 0 260 150"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M-10 120 C 60 120, 60 40, 130 40 S 200 110, 270 30"
              stroke="white"
              strokeWidth="2"
              strokeDasharray="7 9"
              strokeLinecap="round"
            />
            <circle cx="130" cy="40" r="5" fill="#FFD500" />
          </svg>

          <div className="relative flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-white/70">
                Resi pengiriman
              </p>
              <p className="mt-1.5 truncate font-mono text-[22px] font-extrabold tracking-tight sm:text-[26px]">
                #{data.orderNumber}
              </p>
            </div>

            <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                {live && !reduceMotion && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FFD500] opacity-75" />
                )}
                <span className={`relative inline-flex h-2 w-2 rounded-full ${live ? 'bg-[#FFD500]' : 'bg-white/50'}`} />
              </span>
              {live ? 'Live' : 'Terputus'}
            </span>
          </div>

          {/* asal → tujuan */}
          <div className="relative mt-6 flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/60">Dari</p>
              <p className="mt-0.5 truncate text-[13px] font-bold">{data.storeName}</p>
            </div>

            <div className="flex shrink-0 items-center gap-1 px-1 text-white/50">
              <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
              <span className="h-px w-8 border-t border-dashed border-white/60 sm:w-16" />
              <Icon name="truck" size={14} className="text-[#FFD500]" />
              <span className="h-px w-8 border-t border-dashed border-white/60 sm:w-16" />
              <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
            </div>

            <div className="min-w-0 flex-1 text-right">
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/60">Ke</p>
              <p className="mt-0.5 truncate text-[13px] font-bold">{data.destination || 'Alamatmu'}</p>
            </div>
          </div>
        </div>

        {/* sobekan tiket */}
        <div className="relative h-0">
          <span className="absolute -left-3 -top-3 h-6 w-6 rounded-full bg-[#f5f7fb]" />
          <span className="absolute -right-3 -top-3 h-6 w-6 rounded-full bg-[#f5f7fb]" />
          <span className="absolute inset-x-6 top-[-1px] border-t-2 border-dashed border-[#e0e3e5]" />
        </div>

        <div className="px-3 pb-6 pt-8 sm:px-7">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold"
              style={{ backgroundColor: `${accent}14`, color: accent }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {stageNow}
            </span>
            <span className="text-[11px] font-semibold text-[#737686]">
              {data.finished ? 'Perjalanan selesai' : 'Paket masih jalan'}
            </span>
          </div>

          <StageRail stages={data.stageOrder} reached={data.currentStage} />
        </div>
      </motion.article>

      {/* ── riwayat perjalanan ── */}
      <section className="mt-6 overflow-hidden rounded-[28px] border border-white bg-white/95 shadow-[0_10px_30px_rgba(32,36,45,0.06)]">
        <header className="flex items-center justify-between gap-3 border-b border-[#e0e3e5] bg-[#f5f7fb] px-5 py-4 sm:px-7">
          <h2 className="flex items-center gap-2 text-[14px] font-extrabold text-[#101319]">
            <Icon name="activity" size={16} className="text-[#4077a6]" />
            Riwayat perjalanan
          </h2>
          <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-[#737686]">
            {data.events.length} jejak
          </span>
        </header>

        <div className="px-5 py-6 sm:px-7">
          {timeline.length === 0 ? (
            <div className="py-10 text-center">
              <span className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#fff7e0]">
                <Icon name="clock" size={24} className="text-[#B45309]" />
              </span>
              <p className="text-[13px] font-bold text-[#101319]">Belum ada jejak</p>
              <p className="mt-1 text-[12px] text-[#737686]">
                Bakal muncul di sini begitu penjual mulai nyiapin paketmu.
              </p>
            </div>
          ) : (
            <ol className="relative">
              {timeline.map((event, index) => {
                const newest = index === 0;
                const bad = isBadStage(event.stage);
                const dot = bad ? '#ba1a1a' : newest ? '#4077a6' : '#e0e3e5';

                return (
                  <motion.li
                    key={event.id}
                    initial={{ opacity: 0, x: reduceMotion ? 0 : -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: reduceMotion ? 0 : index * 0.07, duration: 0.35 }}
                    className="relative flex gap-4 pb-5 last:pb-0"
                  >
                    <div className="flex flex-col items-center">
                      <span
                        className={`
                          flex h-9 w-9 shrink-0 items-center justify-center rounded-full
                          ${newest ? 'text-white' : 'bg-[#F5F7FB] text-[#737686]'}
                        `}
                        style={
                          newest
                            ? { backgroundColor: dot, boxShadow: `0 0 0 5px ${dot}22` }
                            : undefined
                        }
                        aria-hidden="true"
                      >
                        <Icon name={STAGE_ICON[event.stage]} size={15} />
                      </span>
                      {index < timeline.length - 1 && (
                        <span className="mt-1.5 w-0.5 flex-1 rounded-full bg-gradient-to-b from-[#e0e3e5] to-[#f5f7fb]" aria-hidden="true" />
                      )}
                    </div>

                    <div
                      className={`
                        min-w-0 flex-1 rounded-2xl px-4 py-3
                        ${newest ? 'bg-[#f5f7fb]' : 'bg-transparent'}
                      `}
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <p
                          className={`text-[13px] ${newest ? 'font-extrabold text-[#101319]' : 'font-bold text-[#434655]'}`}
                        >
                          {STAGE_LABEL[event.stage]}
                        </p>
                        {newest && (
                          <span className="rounded-full bg-[#FFD500] px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-[#101319]">
                            Terbaru
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-[13px] leading-relaxed text-[#434655]">
                        {event.description}
                      </p>
                      <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-[#737686]">
                        <span className="inline-flex items-center gap-1">
                          <Icon name="clock" size={11} />
                          {timeOf(event.createdAt)}
                        </span>
                        {event.location && (
                          <span className="inline-flex items-center gap-1">
                            <Icon name="pin" size={11} />
                            {event.location}
                          </span>
                        )}
                      </p>
                    </div>
                  </motion.li>
                );
              })}
            </ol>
          )}
        </div>
      </section>

      <p className="mt-5 text-center text-[11px] leading-relaxed text-[#737686]">
        Jejak berasal dari penjual dan sistem NeedBuy, belum terhubung ke sistem kurir.
      </p>
    </Shell>
  );
};

const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    className="relative flex min-h-screen flex-col bg-[#f5f7fb]"
    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
  >
    <Navbar />
    <main className="relative mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:px-8">
      {children}
    </main>
    <Footer />
  </div>
);

export default TrackingPage;
