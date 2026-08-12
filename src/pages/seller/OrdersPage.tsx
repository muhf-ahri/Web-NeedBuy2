// src/pages/seller/OrdersPage.tsx
import React, { useCallback, useEffect, useState } from 'react';
import SellerLayout from './SellerLayout';
import Icon from '../../components/ui/Icon';
import { formatRupiah } from '../../utils/currency';
import {
  getSellerOrders,
  updateOrderStatus,
  type OrdersMeta,
  type OrderStatus,
  type SellerOrder,
} from '../../api/orders';

const PAGE_SIZE = 10;

const STATUS_CLASS: Record<OrderStatus, string> = {
  WAITING_PAYMENT: 'bg-[#f2f4f6] text-[#737686]',
  PROCESSING: 'bg-[#fff4e0] text-[#b45309]',
  SHIPPED: 'bg-[#cfe8ff] text-[#0057b8]',
  DELIVERED: 'bg-[#d7f5dc] text-[#156b32]',
  COMPLETED: 'bg-[#d7f5dc] text-[#156b32]',
  CANCELLED: 'bg-[#ffe0e0] text-[#a33131]',
};

const STATUS_FILTERS: { value: OrderStatus | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'Semua' },
  { value: 'WAITING_PAYMENT', label: 'Belum Dibayar' },
  { value: 'PROCESSING', label: 'Diproses' },
  { value: 'SHIPPED', label: 'Dikirim' },
  { value: 'DELIVERED', label: 'Sampai' },
  { value: 'COMPLETED', label: 'Selesai' },
  { value: 'CANCELLED', label: 'Batal' },
];

/**
 * Aksi yang boleh dilakukan PENJUAL, mengikuti peta transisi di backend.
 *
 * Hanya dua ini: `COMPLETED` dan pembatalan adalah hak pembeli — menampilkan
 * tombolnya di sini hanya akan menghasilkan 403 dari server.
 */
const SELLER_ACTION: Partial<Record<OrderStatus, { to: 'SHIPPED' | 'DELIVERED'; label: string }>> = {
  PROCESSING: { to: 'SHIPPED', label: 'Tandai Dikirim' },
  SHIPPED: { to: 'DELIVERED', label: 'Tandai Sampai' },
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<SellerOrder[]>([]);
  const [meta, setMeta] = useState<OrdersMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [status, setStatus] = useState<OrderStatus | 'ALL'>('ALL');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);

  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  // Pencarian dikerjakan server (ikut mencari nama/email pembeli dan nama
  // produk), jadi ditahan dulu supaya tiap ketikan tidak jadi satu request.
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getSellerOrders({
        status: status === 'ALL' ? undefined : status,
        q: debouncedSearch || undefined,
        page,
        limit: PAGE_SIZE,
      });
      setOrders(result.items);
      setMeta(result.meta);
    } catch (err: any) {
      setError(err?.message ?? 'Gagal muat order, coba lagi ya');
    } finally {
      setLoading(false);
    }
  }, [status, debouncedSearch, page]);

  useEffect(() => {
    load();
  }, [load]);

  const advance = async (order: SellerOrder) => {
    const action = SELLER_ACTION[order.status];
    if (!action) return;
    setBusyId(order.id);
    setActionError(null);
    try {
      await updateOrderStatus(order.id, action.to);
      await load();
    } catch (err: any) {
      setActionError(err?.message ?? 'Gagal ubah status order, coba lagi ya');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <SellerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-[28px] font-bold text-[#191c1e]">Order Toko</h1>
          <p className="text-[15px] text-[#737686]">
            {meta ? `${meta.total} order masuk ke toko kamu` : 'Order yang masuk ke toko kamu'}
          </p>
        </div>

        {/* Filter status + pencarian */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px] max-w-sm">
            <Icon
              name="search"
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737686]"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari no. order, pembeli, atau produk…"
              className="w-full pl-9 pr-3 py-2 rounded-full border border-[#c3c6d7] text-sm outline-none focus:border-[#004ac6] focus:ring-2 focus:ring-[#004ac6]/20 transition"
            />
          </div>

          <div className="flex gap-1 flex-wrap">
            {STATUS_FILTERS.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setStatus(option.value);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-full text-[12px] font-semibold transition-colors border ${
                  status === option.value
                    ? 'bg-[#004ac6] text-white border-[#004ac6]'
                    : 'bg-white text-[#434655] border-[#c3c6d7] hover:border-[#004ac6]'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {actionError && (
          <div className="p-3 bg-[#ffe0e0] border border-[#ffbcbc] text-[#a33131] text-[13px] rounded-xl">
            {actionError}
          </div>
        )}

        <div className="bg-white rounded-2xl border border-[#e0e3e5] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#f2f4f6] text-[11px] font-semibold text-[#737686] uppercase tracking-wider">
                  <th className="px-4 py-3 text-left">ID Order</th>
                  <th className="px-4 py-3 text-left">Nama Pembeli</th>
                  <th className="px-4 py-3 text-left">Tanggal</th>
                  <th className="px-4 py-3 text-left">Total</th>
                  <th className="px-4 py-3 text-left">Bayar</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e0e3e5]">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-[#737686]">
                      Memuat order…
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-[#ba1a1a]">
                      {error}
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-[#737686]">
                      {debouncedSearch || status !== 'ALL'
                        ? 'Nggak ada order yang cocok sama filter ini.'
                        : 'Belum ada order yang masuk nih.'}
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => {
                    const action = SELLER_ACTION[order.status];
                    const isOpen = expanded === order.id;
                    return (
                      <React.Fragment key={order.id}>
                        <tr className="hover:bg-[#f8f9fb] transition-colors">
                          <td className="px-4 py-3 font-mono font-semibold text-[#004ac6] whitespace-nowrap">
                            {order.orderNumber}
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-[#191c1e]">{order.user.name}</p>
                            <p className="text-[11px] text-[#737686]">{order.user.email}</p>
                          </td>
                          <td className="px-4 py-3 text-[#737686] whitespace-nowrap">
                            {formatDate(order.createdAt)}
                          </td>
                          <td className="px-4 py-3 font-semibold whitespace-nowrap">
                            {formatRupiah(Number(order.total))}
                            <span className="block text-[11px] font-normal text-[#737686]">
                              {order.totalBarang} barang
                            </span>
                          </td>
                          <td className="px-4 py-3 text-[12px] text-[#434655]">
                            {order.statusPembayaranLabel}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap ${STATUS_CLASS[order.status]}`}
                            >
                              {order.statusPengirimanLabel}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right whitespace-nowrap">
                            {action && (
                              <button
                                onClick={() => advance(order)}
                                disabled={busyId === order.id}
                                className="px-3 py-1 rounded-full bg-[#004ac6] text-white text-[12px] font-semibold hover:bg-[#003a9e] disabled:opacity-50 transition"
                              >
                                {busyId === order.id ? '…' : action.label}
                              </button>
                            )}
                            <button
                              onClick={() => setExpanded(isOpen ? null : order.id)}
                              className="text-[#737686] hover:text-[#004ac6] p-1 ml-1"
                              aria-label={isOpen ? 'Tutup detail' : 'Lihat detail'}
                            >
                              <Icon name={isOpen ? 'chevronDown' : 'chevronRight'} size={16} />
                            </button>
                          </td>
                        </tr>

                        {isOpen && (
                          <tr className="bg-[#f8f9fb]">
                            <td colSpan={7} className="px-4 py-4">
                              <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                  <p className="text-[11px] font-semibold text-[#737686] uppercase mb-2">
                                    Barang dipesan
                                  </p>
                                  <ul className="space-y-1">
                                    {order.items.map((item) => (
                                      <li
                                        key={item.id}
                                        className="flex justify-between gap-3 text-[13px]"
                                      >
                                        <span className="text-[#191c1e]">
                                          {item.productName}{' '}
                                          <span className="text-[#737686]">x{item.quantity}</span>
                                          {item.variant && (
                                            <span className="block text-[11px] text-[#737686]">
                                              Model: {item.variant}
                                            </span>
                                          )}
                                        </span>
                                        <span className="font-medium whitespace-nowrap">
                                          {formatRupiah(Number(item.subtotal))}
                                        </span>
                                      </li>
                                    ))}
                                  </ul>
                                  <div className="mt-2 pt-2 border-t border-[#e0e3e5] text-[12px] text-[#737686] space-y-0.5">
                                    <p className="flex justify-between">
                                      <span>Subtotal</span>
                                      <span>{formatRupiah(Number(order.subtotal))}</span>
                                    </p>
                                    <p className="flex justify-between">
                                      <span>Ongkir</span>
                                      <span>{formatRupiah(Number(order.shippingCost))}</span>
                                    </p>
                                  </div>
                                </div>

                                <div>
                                  <p className="text-[11px] font-semibold text-[#737686] uppercase mb-2">
                                    Alamat pengiriman
                                  </p>
                                  {order.address ? (
                                    <div className="text-[13px] text-[#434655] leading-relaxed">
                                      <p className="font-semibold text-[#191c1e]">
                                        {order.address.recipientName}
                                      </p>
                                      <p>{order.address.phone}</p>
                                      <p>{order.address.fullAddress}</p>
                                      <p>
                                        {order.address.city}, {order.address.province}{' '}
                                        {order.address.postalCode}
                                      </p>
                                    </div>
                                  ) : (
                                    <p className="text-[13px] text-[#737686]">
                                      Alamat tidak tersedia.
                                    </p>
                                  )}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-[#e0e3e5]">
              <span className="text-[12px] text-[#737686]">
                Halaman {meta.page} dari {meta.totalPages} · {meta.total} order
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={meta.page <= 1}
                  className="px-3 py-1 rounded-full border border-[#c3c6d7] text-[12px] disabled:opacity-40 hover:border-[#004ac6] transition"
                >
                  Sebelumnya
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={meta.page >= meta.totalPages}
                  className="px-3 py-1 rounded-full border border-[#c3c6d7] text-[12px] disabled:opacity-40 hover:border-[#004ac6] transition"
                >
                  Berikutnya
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </SellerLayout>
  );
};

export default OrdersPage;
