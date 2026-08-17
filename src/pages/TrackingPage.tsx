import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Icon from '../components/ui/Icon';
import { getAccessToken } from '../api/auth';
import { notificationSocketUrl } from '../api/notifications';
import {
  getTracking, STAGE_LABEL,
  type OrderTracking, type TrackingEvent, type TrackingStage,
} from '../api/tracking';

const timeOf = (iso: string) =>
  new Date(iso).toLocaleString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

const StageRail: React.FC<{ stages: TrackingStage[]; reached: TrackingStage | null }> = ({
  stages,
  reached,
}) => {
  const reachedIndex = reached ? stages.indexOf(reached) : -1;

  return (
    <ol className="flex items-start">
      {stages.map((stage, index) => {
        const done = index <= reachedIndex;
        const lineDone = index < reachedIndex;

        return (
          <li key={stage} className="flex flex-1 flex-col items-center text-center">
            <div className="flex w-full items-center">

              <span
                className={`h-0.5 flex-1 ${index === 0 ? 'opacity-0' : done ? 'bg-[#004ac6]' : 'bg-[#e0e3e5]'}`}
              />
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                  done ? 'bg-[#004ac6] text-white' : 'bg-[#e0e3e5] text-[#737686]'
                }`}
              >
                {done ? <Icon name="check" size={13} /> : index + 1}
              </span>
              <span
                className={`h-0.5 flex-1 ${
                  index === stages.length - 1 ? 'opacity-0' : lineDone ? 'bg-[#004ac6]' : 'bg-[#e0e3e5]'
                }`}
              />
            </div>
            <span
              className={`mt-1.5 px-1 text-[10px] leading-tight sm:text-[11px] ${
                done ? 'font-semibold text-[#101319]' : 'text-[#737686]'
              }`}
            >
              {STAGE_LABEL[stage]}
            </span>
          </li>
        );
      })}
    </ol>
  );
};

const TrackingPage: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
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

  if (!isAuthed) {
    return (
      <Shell>
        <div className="rounded-2xl border border-[#e0e3e5] bg-white py-16 text-center">
          <Icon name="lock" size={44} className="mx-auto mb-3 text-[#c3c6d7]" />
          <p className="text-[15px] font-semibold text-[#101319]">Login dulu buat lacak paketmu.</p>
          <button
            onClick={() => navigate('/login')}
            className="mt-5 rounded-full bg-[#004ac6] px-6 py-2.5 text-[14px] font-semibold text-white"
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
        <div className="h-40 animate-pulse rounded-2xl bg-white" />
      </Shell>
    );
  }

  if (error || !data) {
    return (
      <Shell>
        <div className="rounded-2xl border border-[#e0e3e5] bg-white py-16 text-center">
          <p className="text-[14px] text-[#ba1a1a]">{error ?? 'Pesanannya nggak ketemu.'}</p>
          <button
            onClick={() => navigate('/orders')}
            className="mt-4 text-[13px] font-semibold text-[#004ac6] hover:underline"
          >
            Balik ke daftar pesanan
          </button>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <button
        onClick={() => navigate('/orders')}
        className="mb-5 flex items-center gap-1 text-[#737686] transition-colors hover:text-[#101319]"
      >
        <Icon name="chevronLeft" size={16} />
        <span className="text-[13px]">Balik ke pesanan</span>
      </button>

      <div className="overflow-hidden rounded-2xl border border-[#e0e3e5] bg-white">
        <div className="bg-gradient-to-br from-[#004ac6] to-[#002a7a] p-5 text-white">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-white/70">
                Lacak paket
              </p>
              <p className="mt-1 truncate text-[20px] font-bold">#{data.orderNumber}</p>
              <p className="mt-0.5 text-[13px] text-white/80">
                {data.storeName} → {data.destination || 'alamatmu'}
              </p>
            </div>

            <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold">
              <span
                className={`h-1.5 w-1.5 rounded-full ${live ? 'bg-[#7fe8b2]' : 'bg-white/50'}`}
                aria-hidden="true"
              />
              {live ? 'Live' : 'Terputus'}
            </span>
          </div>
        </div>

        <div className="px-3 py-5 sm:px-5">
          <StageRail stages={data.stageOrder} reached={data.currentStage} />
        </div>
      </div>

      <section className="mt-5 overflow-hidden rounded-2xl border border-[#e0e3e5] bg-white">
        <header className="border-b border-[#e0e3e5] bg-[#f7f9ff] px-4 py-3 sm:px-5">
          <h2 className="text-[14px] font-bold text-[#101319]">Riwayat perjalanan</h2>
        </header>

        <div className="p-4 sm:p-5">
          {data.events.length === 0 ? (
            <p className="py-8 text-center text-[13px] text-[#737686]">
              Belum ada jejak. Muncul di sini begitu penjual mulai menyiapkan paketmu.
            </p>
          ) : (
            <ol className="relative">
              {[...data.events].reverse().map((event, index) => {
                const newest = index === 0;
                return (
                  <li key={event.id} className="relative flex gap-3.5 pb-5 last:pb-0">
                    <div className="flex flex-col items-center">
                      <span
                        className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
                          newest ? 'bg-[#004ac6] ring-4 ring-[#dbe1ff]' : 'bg-[#c3c6d7]'
                        }`}
                        aria-hidden="true"
                      />
                      {index < data.events.length - 1 && (
                        <span className="mt-1 w-0.5 flex-1 bg-[#e0e3e5]" aria-hidden="true" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1 pb-1">
                      <p
                        className={`text-[13px] ${
                          newest ? 'font-bold text-[#101319]' : 'font-semibold text-[#434655]'
                        }`}
                      >
                        {STAGE_LABEL[event.stage]}
                      </p>
                      <p className="mt-0.5 text-[13px] text-[#434655]">{event.description}</p>
                      <p className="mt-0.5 text-[11px] text-[#737686]">
                        {timeOf(event.createdAt)}
                        {event.location && ` · ${event.location}`}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      </section>

      <p className="mt-4 text-center text-[11px] text-[#737686]">
        Jejak berasal dari penjual dan sistem NeedBuy, belum terhubung ke sistem kurir.
      </p>
    </Shell>
  );
};

const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex min-h-screen flex-col bg-[#f2f4f6]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
    <Navbar />
    <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-8 sm:px-10">{children}</main>
    <Footer />
  </div>
);

export default TrackingPage;
