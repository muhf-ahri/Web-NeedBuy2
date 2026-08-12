// src/pages/OrdersPage.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/ui/Icon';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { formatRupiah } from '../utils/currency';
import { getOrders, getOrder, cancelOrder, createReview, type Order, type OrderStatus } from '../api/orders';
import { retryPayment, syncPayment } from '../api/payments';
import { payWithSnap } from '../utils/snap';
import { getAccessToken } from '../api/auth';

/** Tab tambahan di luar filter status — tampilan riwayat, bukan filter server. */
type TabKey = OrderStatus | 'ALL' | 'HISTORY';

const STATUS_TABS: Array<{ key: TabKey; label: string }> = [
  { key: 'ALL', label: 'Semua' },
  { key: 'HISTORY', label: 'Riwayat' },
  { key: 'WAITING_PAYMENT', label: 'Menunggu Pembayaran' },
  { key: 'PROCESSING', label: 'Diproses' },
  { key: 'SHIPPED', label: 'Dikirim' },
  { key: 'DELIVERED', label: 'Selesai' },
  { key: 'COMPLETED', label: 'Ditinjau' },
  { key: 'CANCELLED', label: 'Dibatalkan' },
];

const STATUS_STYLE: Record<OrderStatus, string> = {
  WAITING_PAYMENT: 'bg-[#fff4e0] text-[#7c3e00]',
  PROCESSING: 'bg-[#e0e7ff] text-[#3730a3]',
  SHIPPED: 'bg-[#cfe8ff] text-[#0057b8]',
  DELIVERED: 'bg-[#d7f5dc] text-[#156b32]',
  COMPLETED: 'bg-[#e3e7f5] text-[#3f4a6b]',
  CANCELLED: 'bg-[#ffe0e0] text-[#a33131]',
};

const STATUS_LABEL: Record<OrderStatus, string> = {
  WAITING_PAYMENT: 'Menunggu Pembayaran',
  PROCESSING: 'Diproses',
  SHIPPED: 'Dikirim',
  DELIVERED: 'Selesai',
  COMPLETED: 'Ditinjau',
  CANCELLED: 'Dibatalkan',
};

/**
 * Riwayat cuma mengenal dua keadaan: pesanan sudah tuntas atau belum.
 * COMPLETED/DELIVERED = selesai, CANCELLED = batal, sisanya masih berjalan.
 */
const isSettled = (status: OrderStatus) => status === 'COMPLETED' || status === 'DELIVERED';

const historyLabel = (status: OrderStatus) =>
  status === 'CANCELLED' ? 'Dibatalkan' : isSettled(status) ? 'Selesai' : 'Belum selesai';

const historyStyle = (status: OrderStatus) =>
  status === 'CANCELLED'
    ? 'bg-[#ffe0e0] text-[#a33131]'
    : isSettled(status)
      ? 'bg-[#e6f4ee] text-[#12805c]'
      : 'bg-[#fff4e0] text-[#b45309]';

const dateTimeLabel = (iso: string) =>
  new Date(iso).toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const ONLINE_CHANNELS = ['MIDTRANS', 'qris', 'gopay', 'shopeepay', 'bank_transfer', 'echannel', 'bca_klikpay', 'cimb_clicks', 'danamon_online', 'akulaku'];

const paymentMethodLabel = (method: string | null | undefined): string => {
  if (!method) return 'Bayar Online';
  if (method === 'COD') return 'COD — Bayar di Tempat';
  return ONLINE_CHANNELS.includes(method) ? `Bayar via ${method}` : method;
};

const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<TabKey>('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Order | null>(null);
  const [busy, setBusy] = useState(false);
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [reviewFor, setReviewFor] = useState<Order | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const isAuthed = !!getAccessToken();

  const fetchOrders = useCallback(async () => {
    if (!isAuthed) return;
    setLoading(true);
    setError(null);
    try {
      // Riwayat memakai seluruh pesanan — pemisahan selesai/belum dilakukan di UI.
      const res = await getOrders(
        activeTab === 'ALL' || activeTab === 'HISTORY' ? {} : { status: activeTab }
      );
      setOrders(res.data.data);
    } catch (err: any) {
      setError(err.message ?? 'Gagal memuat pesanan');
    } finally {
      setLoading(false);
    }
  }, [isAuthed, activeTab]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const openDetail = async (id: string) => {
    setError(null);
    try {
      let res = await getOrder(id);
      // Order yang masih menunggu pembayaran ditanyakan dulu ke gateway.
      // Notifikasi webhook bisa tidak pernah sampai; tanpa langkah ini, order
      // yang sebenarnya sudah dibayar terlihat "menunggu pembayaran" selamanya.
      if (res.data.data.status === 'WAITING_PAYMENT' && res.data.data.payment?.method !== 'COD') {
        try {
          await syncPayment(id);
          res = await getOrder(id);
        } catch {
          // Gateway tidak menjawab bukan alasan menutup detail pesanan.
        }
      }
      setSelected(res.data.data);
    } catch (err: any) {
      setError(err.message ?? 'Gagal memuat detail pesanan');
    }
  };

  const handleCancel = async () => {
    if (!selected) return;
    setBusy(true);
    setError(null);
    try {
      await cancelOrder(selected.id, crypto.randomUUID());
      setSelected(null);
      await fetchOrders();
    } catch (err: any) {
      setError(err.message ?? 'Gagal membatalkan pesanan');
    } finally {
      setBusy(false);
    }
  };

  /**
   * Setelah Snap selesai, status ditarik langsung dari Midtrans — tidak
   * menunggu webhook, karena notifikasi bisa tertunda atau tidak sampai sama
   * sekali. Diulang beberapa kali karena metode seperti VA butuh sesaat
   * sebelum berstatus settlement.
   */
  const waitForPaymentSync = async (orderId: string) => {
    setCheckingPayment(true);
    try {
      for (let i = 0; i < 4; i += 1) {
        try {
          await syncPayment(orderId);
        } catch {
          // Gagal satu putaran bukan alasan berhenti; percobaan berikutnya jalan.
        }
        const res = await getOrder(orderId);
        if (res.data.data.status !== 'WAITING_PAYMENT' || res.data.data.payment?.status === 'PAID') {
          setSelected(res.data.data);
          break;
        }
        await new Promise((r) => setTimeout(r, 2000));
      }
    } catch {
      // Biarkan fetchOrders di bawah yang menyinkronkan tampilan terakhir.
    } finally {
      setCheckingPayment(false);
    }
  };

  const handlePay = async () => {
    if (!selected) return;
    setBusy(true);
    setError(null);
    try {
      const res = await retryPayment(selected.id, crypto.randomUUID());
      const token = res.data.data.payment?.snapToken;
      if (!token) {
        setError('Tidak ada token pembayaran. Coba lagi nanti.');
        return;
      }
      let paid = false;
      await new Promise<void>((resolve) => {
        payWithSnap(token, {
          onSuccess: () => {
            paid = true;
            resolve();
          },
          onPending: () => {
            paid = true;
            resolve();
          },
          onError: (result) => {
            setError('Pembayaran gagal: ' + JSON.stringify(result));
            resolve();
          },
          onClose: () => resolve(),
        });
      });
      if (paid) {
        await waitForPaymentSync(selected.id);
      }
      await openDetail(selected.id);
      await fetchOrders();
    } catch (err: any) {
      setError(err.message ?? 'Gagal memuat pembayaran');
    } finally {
      setBusy(false);
    }
  };

  const submitReview = async (itemId: string) => {
    if (!reviewFor) return;
    setBusy(true);
    setError(null);
    try {
      await createReview(reviewFor.id, itemId, { rating, comment: comment.trim() || undefined });
      setReviewFor(null);
      setRating(5);
      setComment('');
      await openDetail(reviewFor.id);
      await fetchOrders();
    } catch (err: any) {
      setError(err.message ?? 'Gagal mengirim ulasan');
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
            <Icon name="lock" size={44} className="text-[#c3c6d7] mx-auto mb-4" />
            <p className="text-[#737686] mb-4">Login untuk melihat pesanan Anda.</p>
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2.5 rounded-full bg-[#004ac6] hover:bg-[#003ea8] text-white text-[14px] font-semibold transition-colors"
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

      <main className="flex-1 max-w-6xl mx-auto w-full px-5 sm:px-10 py-8">
        <h1 className="text-[28px] font-bold text-[#191c1e] mb-6">Pesanan Saya</h1>

        {error && (
          <div className="bg-[#ffdad6] border border-[#ba1a1a]/20 rounded-2xl px-4 py-3 mb-4">
            <p className="text-[13px] text-[#93000a]">{error}</p>
          </div>
        )}

        {/* Status tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-1.5 rounded-full text-[12px] font-semibold whitespace-nowrap transition-colors ${
                activeTab === tab.key
                  ? 'bg-[#004ac6] text-white'
                  : 'bg-[#f2f4f6] text-[#434655] hover:bg-[#e5e8f0]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-24 bg-[#f2f4f6] rounded-2xl" />
            <div className="h-24 bg-[#f2f4f6] rounded-2xl" />
            <div className="h-24 bg-[#f2f4f6] rounded-2xl" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <Icon name="orders" size={44} className="text-[#c3c6d7] mx-auto mb-4" />
            <p className="text-[#737686]">Belum ada pesanan.</p>
            <button
              onClick={() => navigate('/categories')}
              className="mt-4 px-6 py-2.5 rounded-full bg-[#004ac6] hover:bg-[#003ea8] text-white text-[14px] font-semibold transition-colors"
            >
              Mulai Belanja
            </button>
          </div>
        ) : activeTab === 'HISTORY' ? (
          <div className="overflow-x-auto rounded-2xl border border-[#e0e3e5]">
            <table className="w-full min-w-[560px] text-left">
              <thead>
                <tr className="bg-[#f2f4f6] text-[11px] uppercase tracking-wider text-[#737686]">
                  <th scope="col" className="px-4 py-3 font-semibold">ID Pesanan</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Tanggal &amp; jam</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Status</th>
                  <th scope="col" className="px-4 py-3 font-semibold text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e0e3e5]">
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => openDetail(order.id)}
                    className="cursor-pointer hover:bg-[#f8f9fb] transition-colors"
                  >
                    <td className="px-4 py-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openDetail(order.id);
                        }}
                        className="font-mono text-[12px] font-semibold text-[#004ac6] hover:underline"
                      >
                        #{order.orderNumber}
                      </button>
                      <p className="text-[11px] text-[#737686] mt-0.5">{order.seller.storeName}</p>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-[#434655] whitespace-nowrap">
                      {dateTimeLabel(order.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-semibold ${historyStyle(order.status)}`}>
                        {historyLabel(order.status)}
                      </span>
                      <p className="text-[11px] text-[#737686] mt-0.5">{STATUS_LABEL[order.status]}</p>
                    </td>
                    <td className="px-4 py-3 text-right text-[13px] font-bold text-[#101319] whitespace-nowrap">
                      {formatRupiah(order.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <button
                key={order.id}
                onClick={() => openDetail(order.id)}
                className="w-full text-left bg-white border border-[#e0e3e5] rounded-2xl p-4 hover:border-[#004ac6] hover:shadow-sm transition-all"
              >
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-semibold ${STATUS_STYLE[order.status]}`}>
                      {STATUS_LABEL[order.status]}
                    </span>
                    <span className="text-[12px] text-[#737686]">#{order.orderNumber}</span>
                  </div>
                  <Icon name="chevronRight" size={16} className="text-[#c3c6d7]" />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    {order.items.slice(0, 3).map((item) => (
                      <div key={item.id} className="w-11 h-11 rounded-lg bg-[#f2f4f6] flex items-center justify-center shrink-0">
                        <Icon name="orders" size={20} className="text-[#737686]" />
                      </div>
                    ))}
                    <div className="min-w-0">
                      <p className="text-[13px] text-[#191c1e] truncate">
                        {order.items[0]?.productName ?? 'Produk'}
                        {order.totalBarang > 1 ? ` + ${order.totalBarang - 1} lainnya` : ''}
                      </p>
                      <p className="text-[11px] text-[#737686]">
                        {order.seller.storeName} · {new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[14px] font-bold text-[#191c1e]">{formatRupiah(order.total)}</p>
                    {order.status === 'WAITING_PAYMENT' && (
                      <p className="text-[11px] text-[#7c3e00] font-medium">Menunggu pembayaran</p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>

      {/* ── Detail modal ── */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-[#e0e3e5]">
              <div>
                <p className="text-[14px] font-bold text-[#191c1e]">Pesanan #{selected.orderNumber}</p>
                <p className="text-[11px] text-[#737686]">
                  {selected.seller.storeName} · {dateTimeLabel(selected.createdAt)}
                </p>
                <button
                  onClick={() => navigate(`/messages?seller=${selected.seller.id}`)}
                  className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-[#004ac6] hover:underline"
                >
                  <Icon name="chat" size={12} /> Chat penjual
                </button>
              </div>
              <button onClick={() => setSelected(null)} className="text-[#737686] hover:text-[#191c1e] transition-colors">
                <Icon name="close" size={18} />
              </button>
            </div>

            <div className="p-5 space-y-5">
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-[11px] font-semibold ${STATUS_STYLE[selected.status]}`}>
                  {STATUS_LABEL[selected.status]}
                </span>
                <span className="text-[12px] text-[#737686]">
                  {paymentMethodLabel(selected.payment?.method)} · {selected.statusPembayaranLabel}
                </span>
              </div>

              {/* Items */}
              <div className="space-y-3">
                {selected.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[13px] font-semibold text-[#191c1e]">{item.productName}</p>
                      <p className="text-[12px] text-[#737686]">{item.quantity} x {formatRupiah(item.price)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[13px] font-semibold text-[#191c1e]">{formatRupiah(item.subtotal)}</p>
                      {selected.status === 'COMPLETED' && !item.review && (
                        <button
                          onClick={() => {
                            setReviewFor(selected);
                            setRating(5);
                            setComment('');
                          }}
                          className="text-[11px] text-[#004ac6] hover:underline font-medium"
                        >
                          Beri ulasan
                        </button>
                      )}
                      {item.review && (
                        <p className="text-[11px] text-[#737686] flex items-center justify-end gap-1">
                          <Icon name="star" size={12} className="text-[#f59e0b]" /> {item.review.rating}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Address */}
              {selected.address && (
                <div className="bg-[#f8f9fb] rounded-xl p-3">
                  <p className="text-[11px] font-semibold text-[#737686] uppercase mb-1">Alamat Pengiriman</p>
                  <p className="text-[12px] text-[#191c1e]">
                    {selected.address.recipientName} · {selected.address.phone}
                  </p>
                  <p className="text-[12px] text-[#737686]">
                    {selected.address.fullAddress}, {selected.address.city}, {selected.address.province} {selected.address.postalCode}
                  </p>
                </div>
              )}

              {/* Totals */}
              <div className="border-t border-[#e0e3e5] pt-3 space-y-1 text-[13px]">
                <div className="flex justify-between">
                  <span className="text-[#737686]">Subtotal</span>
                  <span className="text-[#191c1e]">{formatRupiah(selected.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#737686]">Ongkos kirim</span>
                  <span className="text-[#191c1e]">{selected.shippingCost === '0' || !selected.shippingCost ? 'Gratis' : formatRupiah(selected.shippingCost)}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-[#e0e3e5]">
                  <span className="font-semibold text-[#191c1e]">Total</span>
                  <span className="font-bold text-[#004ac6] text-[16px]">{formatRupiah(selected.total)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                {selected.status === 'WAITING_PAYMENT' && (
                  <>
                    <button
                      onClick={handlePay}
                      disabled={busy}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[#004ac6] hover:bg-[#003ea8] text-white text-[13px] font-semibold transition-colors disabled:opacity-50"
                    >
                      {busy ? <Icon name="clock" size={16} className="animate-spin" /> : <Icon name="card" size={16} />}
                      Bayar Sekarang
                    </button>
                    <button
                      onClick={() => {
                        setError(null);
                        openDetail(selected.id);
                      }}
                      disabled={busy || checkingPayment}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full border border-[#004ac6] text-[#004ac6] text-[13px] font-semibold hover:bg-[#dbe1ff]/40 transition-colors disabled:opacity-50"
                    >
                      {checkingPayment ? <Icon name="clock" size={16} className="animate-spin" /> : <Icon name="clock" size={16} />}
                      {checkingPayment ? 'Mengecek...' : 'Periksa Status'}
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={busy}
                      className="flex-1 px-4 py-2.5 rounded-full border border-[#ba1a1a]/30 text-[#93000a] text-[13px] font-semibold hover:bg-[#ffdad6]/40 transition-colors disabled:opacity-50"
                    >
                      Batalkan Pesanan
                    </button>
                  </>
                )}
                {selected.status === 'PROCESSING' && selected.payment?.method === 'COD' && (
                  <>
                    <div className="flex-1 flex items-center justify-center gap-2 text-[12px] text-[#737686]">
                      <Icon name="clock" size={16} />
                      Menunggu dikirim penjual
                    </div>
                    <button
                      onClick={handleCancel}
                      disabled={busy}
                      className="flex-1 px-4 py-2.5 rounded-full border border-[#ba1a1a]/30 text-[#93000a] text-[13px] font-semibold hover:bg-[#ffdad6]/40 transition-colors disabled:opacity-50"
                    >
                      Batalkan Pesanan
                    </button>
                  </>
                )}
                {((selected.status === 'PROCESSING' && selected.payment?.method !== 'COD') || selected.status === 'SHIPPED') && (
                  <div className="flex-1 flex items-center justify-center gap-2 text-[12px] text-[#737686]">
                    <Icon name="clock" size={16} />
                    Pesanan sedang diproses oleh penjual
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Review modal ── */}
      {reviewFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-4 border-b border-[#e0e3e5]">
              <h3 className="text-[15px] font-bold text-[#191c1e]">Beri Ulasan</h3>
              <button onClick={() => setReviewFor(null)} className="text-[#737686] hover:text-[#191c1e] transition-colors">
                <Icon name="close" size={18} />
              </button>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} onClick={() => setRating(n)}>
                    <Icon name="star" size={28} className={`transition-colors ${n <= rating ? 'text-[#f59e0b]' : 'text-[#c3c6d7]'}`} />
                  </button>
                ))}
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tulis ulasan Anda (opsional)"
                rows={4}
                className="w-full px-3 py-2 rounded-lg border border-[#c3c6d7] outline-none focus:border-[#004ac6] focus:ring-2 focus:ring-[#004ac6]/20 text-sm resize-none transition"
              />
              <button
                onClick={() => reviewFor.items.find((i) => !i.review)?.id && submitReview(reviewFor.items.find((i) => !i.review)!.id)}
                disabled={busy}
                className="mt-4 w-full flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#004ac6] hover:bg-[#003ea8] text-white text-[14px] font-semibold transition-colors disabled:opacity-50"
              >
                {busy && <Icon name="clock" size={16} className="animate-spin" />}
                Kirim Ulasan
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default OrdersPage;
