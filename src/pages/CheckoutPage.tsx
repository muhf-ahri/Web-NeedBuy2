// src/pages/CheckoutPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Icon from '../components/ui/Icon';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { formatRupiah } from '../utils/currency';
import { previewCheckout, confirmCheckout, type CheckoutPreview, type CreatedOrderPayment, type PaymentMethod } from '../api/checkout';
import { getAddresses, getOrder, createAddress, type Address } from '../api/orders';
import { retryPayment } from '../api/payments';
import { payWithSnap } from '../utils/snap';
import { getAccessToken } from '../api/auth';
import { validateAddressForm, EMPTY_ADDRESS_FORM, type AddressFormData } from '../utils/address';
import { useCart as useCartContext } from '../contexts/CartContext';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshCartCount } = useCartContext();
  // Pilihan item dibawa dari halaman keranjang. Tanpa state (mis. checkout
  // dibuka langsung lewat URL), server memakai seluruh isi keranjang.
  const cartItemIds = (location.state as { cartItemIds?: string[] } | null)?.cartItemIds;
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [preview, setPreview] = useState<CheckoutPreview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('MIDTRANS');

  // Success / payment state
  const [createdOrders, setCreatedOrders] = useState<CreatedOrderPayment[] | null>(null);
  const [paying, setPaying] = useState(false);

  // Address form modal
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState<AddressFormData>(EMPTY_ADDRESS_FORM);
  const [savingAddress, setSavingAddress] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const isAuthed = !!getAccessToken();

  const loadData = useCallback(async () => {
    if (!isAuthed) return;
    setLoading(true);
    setError(null);
    try {
      const [addrRes, previewRes] = await Promise.allSettled([getAddresses(), previewCheckout(0, cartItemIds)]);

      if (addrRes.status === 'fulfilled') {
        const list = addrRes.value.data.data;
        setAddresses(list);
        setSelectedAddressId((prev) =>
          prev && list.some((a) => a.id === prev)
            ? prev
            : list.find((a) => a.isDefault)?.id ?? list[0]?.id ?? ''
        );
      }

      if (previewRes.status === 'fulfilled') {
        setPreview(previewRes.value.data.data);
      }

      if (addrRes.status === 'rejected' && previewRes.status === 'rejected') {
        throw addrRes.reason;
      }
    } catch (err: any) {
      setError(err.message ?? 'Gagal memuat data checkout');
    } finally {
      setLoading(false);
    }
  }, [isAuthed, cartItemIds]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const updateField = (key: keyof AddressFormData, value: string) => {
    setAddressForm((f) => ({ ...f, [key]: value }));
    setFieldErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const saveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateAddressForm(addressForm);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setError(null);
      return;
    }
    setSavingAddress(true);
    setError(null);
    try {
      await createAddress(addressForm);
      setShowAddressForm(false);
      setAddressForm(EMPTY_ADDRESS_FORM);
      setFieldErrors({});
      await loadData();
    } catch (err: any) {
      if (err?.fields?.length) {
        const mapped: Record<string, string> = {};
        err.fields.forEach((f: { path: string; message: string }) => {
          mapped[f.path] = f.message;
        });
        setFieldErrors(mapped);
        setError('Periksa kembali isian alamat.');
      } else {
        setError(err.message ?? 'Gagal menyimpan alamat');
      }
    } finally {
      setSavingAddress(false);
    }
  };

  const handleCheckout = async () => {
    if (!selectedAddressId) return;
    setError(null);
    try {
      const idempotencyKey = crypto.randomUUID();
      const res = await confirmCheckout(
        { addressId: selectedAddressId, cartItemIds, shippingCost: 0, paymentMethod },
        idempotencyKey
      );
      setCreatedOrders(res.data.data.orders);
      await refreshCartCount();
    } catch (err: any) {
      setError(err.message ?? 'Checkout gagal');
    }
  };

  // Token SELALU dibuat ulang sebelum membayar. Token dari hasil checkout bisa
  // kedaluwarsa kalau user membayar beberapa jam kemudian (mis. selesai isi
  // saldo), jadi jangan pernah dipakai ulang asal-asalan.
  const waitForPaymentSync = async (orders: CreatedOrderPayment[]) => {
    for (let i = 0; i < 6; i += 1) {
      await new Promise((r) => setTimeout(r, 2000));
      let allDone = true;
      for (const o of orders) {
        try {
          const res = await getOrder(o.orderId);
          if (res.data.data.status === 'WAITING_PAYMENT') {
            allDone = false;
            break;
          }
        } catch {
          allDone = false;
        }
      }
      if (allDone) break;
    }
  };

  const payOrders = async () => {
    if (!createdOrders) return;
    setPaying(true);
    setError(null);
    const online = createdOrders.filter((o) => o.paymentMethod === 'MIDTRANS');
    let paidAny = false;
    for (let i = 0; i < online.length; i += 1) {
      const order = online[i];
      try {
        const res = await retryPayment(order.orderId, crypto.randomUUID());
        const token = res.data.data.payment?.snapToken;
        if (!token) {
          setError(`Order #${order.orderNumber} gagal dibuat token pembayarannya. Coba lagi.`);
          continue;
        }
        await new Promise<void>((resolve) => {
          payWithSnap(token, {
            onSuccess: () => {
              paidAny = true;
              resolve();
            },
            onPending: () => {
              paidAny = true;
              resolve();
            },
            onError: (result) => {
              setError('Pembayaran gagal: ' + JSON.stringify(result));
              resolve();
            },
            onClose: () => resolve(),
          });
        });
      } catch (err: any) {
        setError(err.message ?? `Gagal memuat pembayaran order #${order.orderNumber}`);
      }
    }
    if (paidAny) {
      await waitForPaymentSync(online);
    }
    setPaying(false);
    navigate('/orders');
  };

  if (!isAuthed) {
    return (
      <div className="min-h-screen flex flex-col bg-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <Navbar />
        <main className="flex-1 max-w-6xl mx-auto w-full px-5 sm:px-10 py-16 flex items-center justify-center">
          <div className="text-center">
            <Icon name="lock" size={48} className="text-[#c3c6d7] mx-auto mb-4" />
            <p className="text-[#737686] mb-4">Login untuk melanjutkan checkout.</p>
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <Navbar />
        <main className="flex-1 max-w-6xl mx-auto w-full px-5 sm:px-10 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 bg-[#e0e3e5] rounded" />
            <div className="h-32 bg-[#f2f4f6] rounded-2xl" />
            <div className="h-32 bg-[#f2f4f6] rounded-2xl" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ── Success screen ────────────────────────────────────────────────
  if (createdOrders) {
    const hasOnline = createdOrders.some((o) => o.paymentMethod === 'MIDTRANS');
    const allCod = createdOrders.every((o) => o.paymentMethod === 'COD');
    const allPaidReady = !hasOnline;

    return (
      <div className="min-h-screen flex flex-col bg-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <Navbar />
        <main className="flex-1 max-w-2xl mx-auto w-full px-5 sm:px-10 py-12">
          <div className="text-center mb-8">
            <Icon name="check" size={56} className="text-[#15803d] mx-auto mb-3" />
            <h1 className="text-[26px] font-bold text-[#191c1e]">Checkout Berhasil</h1>
            <p className="text-[14px] text-[#737686] mt-1">
              {allCod
                ? `${createdOrders.length} pesanan dibuat. Pembayaran dilakukan saat barang tiba (COD).`
                : `${createdOrders.length} pesanan berhasil dibuat. Kamu bisa membayar kapan saja dari halaman Pesanan.`}
            </p>
          </div>

          {error && (
            <div className="bg-[#ffdad6] border border-[#ba1a1a]/20 rounded-2xl px-4 py-3 mb-4">
              <p className="text-[13px] text-[#93000a]">{error}</p>
            </div>
          )}

          <div className="bg-white border border-[#e0e3e5] rounded-2xl overflow-hidden">
            {createdOrders.map((order) => (
              <div key={order.orderId} className="px-5 py-4 border-b border-[#e0e3e5] last:border-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[14px] font-semibold text-[#191c1e]">#{order.orderNumber}</p>
                    <p className="text-[12px] text-[#737686]">
                      {order.paymentMethod === 'COD'
                        ? 'Bayar saat barang tiba (COD)'
                        : order.paymentError
                          ? 'Token pembayaran belum dibuat'
                          : 'Menunggu pembayaran online'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[14px] font-bold text-[#004ac6]">
                      {order.paymentMethod === 'COD' ? 'COD' : 'Bayar Online'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => navigate('/orders')}
              className="flex-1 px-6 py-3 rounded-full border border-[#c3c6d7] text-[14px] font-semibold text-[#191c1e] hover:border-[#004ac6] hover:text-[#004ac6] transition-colors"
            >
              {allCod ? 'Lihat Pesanan' : 'Bayar Nanti'}
            </button>
            {hasOnline && (
              <button
                onClick={payOrders}
                disabled={paying}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#004ac6] hover:bg-[#003ea8] text-white text-[14px] font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {paying && <Icon name="clock" size={16} className="animate-spin" />}
                {paying ? 'Memproses...' : 'Bayar Sekarang'}
              </button>
            )}
          </div>
          {allPaidReady && (
            <p className="mt-3 text-center text-[11px] text-[#737686]">
              Pesanan COD langsung diproses penjual — bayar tunai saat barang tiba.
            </p>
          )}
        </main>
        <Footer />
      </div>
    );
  }

  const canCheckout = !!preview && preview.canCheckout && !!selectedAddressId;

  return (
    <div className="min-h-screen flex flex-col bg-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-5 sm:px-10 py-8">
        <button
          onClick={() => navigate('/cart')}
          className="flex items-center gap-1 text-[#737686] hover:text-[#191c1e] mb-6 transition-colors"
        >
          <Icon name="chevronLeft" size={16} className="" />
          <span className="text-[13px]">Kembali ke Keranjang</span>
        </button>

        <h1 className="text-[28px] font-bold text-[#191c1e] mb-6">Checkout</h1>

        {error && (
          <div className="bg-[#ffdad6] border border-[#ba1a1a]/20 rounded-2xl px-4 py-3 mb-4">
            <p className="text-[13px] text-[#93000a]">{error}</p>
          </div>
        )}

        {!preview || preview.orders.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#737686] mb-4">Keranjang Anda kosong.</p>
            <button
              onClick={() => navigate('/categories')}
              className="px-6 py-2.5 rounded-full bg-[#004ac6] hover:bg-[#003ea8] text-white text-[14px] font-semibold transition-colors"
            >
              Mulai Belanja
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* ── Left column ── */}
            <div className="lg:col-span-2 space-y-5">
              {/* Address */}
              <div className="bg-white border border-[#e0e3e5] rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[15px] font-bold text-[#004ac6]">Alamat Pengiriman</h3>
                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="flex items-center gap-1.5 text-[12px] text-[#004ac6] hover:underline"
                  >
                    <Icon name="plus" size={14} className="" />
                    Alamat Baru
                  </button>
                </div>

                {addresses.length === 0 ? (
                  <p className="text-[13px] text-[#737686]">
                    Belum ada alamat. Tambahkan alamat pengiriman Anda.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {addresses.map((addr) => {
                      const isSelected = selectedAddressId === addr.id;
                      return (
                        <button
                          key={addr.id}
                          onClick={() => setSelectedAddressId(addr.id)}
                          className={`w-full flex items-start gap-3 text-left p-3 rounded-xl border transition-colors ${
                            isSelected
                              ? 'border-[#004ac6] bg-[#dbe1ff]/40'
                              : 'border-[#e0e3e5] hover:border-[#004ac6]'
                          }`}
                        >
                          <Icon name="pin" size={16} className="text-[#004ac6] mt-0.5 shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-[13px] font-semibold text-[#191c1e]">
                              {addr.recipientName} • {addr.phone}
                              {addr.label && <span className="text-[#737686] font-normal"> ({addr.label})</span>}
                              {addr.isDefault && <span className="text-[#004ac6]"> • Default</span>}
                            </p>
                            <p className="text-[12px] text-[#737686] mt-0.5">
                              {addr.fullAddress}, {addr.city}, {addr.province} {addr.postalCode}
                            </p>
                          </div>
                          <div
                            className="mt-0.5 w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center"
                            style={{ borderColor: isSelected ? '#004ac6' : '#c3c6d7' }}
                          >
                            {isSelected && <div className="w-2 h-2 rounded-full bg-[#004ac6]" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Order summary */}
              {preview.orders.map((order) => (
                <div key={order.sellerId} className="bg-white border border-[#e0e3e5] rounded-2xl p-5">
                  <p className="text-[13px] font-bold text-[#191c1e] mb-3">{order.storeName ?? 'Toko'}</p>
                  <div className="space-y-3">
                    {order.items.map((line) => (
                      // Dibuka di tab baru: mengecek produk tidak boleh
                      // membuang alamat dan metode bayar yang sudah dipilih.
                      <Link
                        key={line.cartItemId}
                        to={`/products/${line.productSlug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between gap-3 -mx-2 px-2 py-1.5 rounded-xl hover:bg-[#f2f4f6] transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={line.imageUrl ?? 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80'}
                            alt=""
                            loading="lazy"
                            className="w-11 h-11 rounded-lg object-cover bg-[#f2f4f6] shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="text-[13px] text-[#191c1e] truncate group-hover:text-[#004ac6] transition-colors">
                              {line.productName}
                            </p>
                            <p className="text-[12px] text-[#737686]">
                              {line.quantity} x {formatRupiah(line.price)}
                            </p>
                          </div>
                        </div>
                        <span className="flex items-center gap-1 shrink-0">
                          <span className="text-[13px] font-semibold text-[#191c1e]">{formatRupiah(line.subtotal)}</span>
                          <Icon name="chevronRight" size={14} className="text-[#c3c6d7] group-hover:text-[#004ac6] transition-colors" />
                        </span>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-[#e0e3e5] flex items-center justify-between">
                    <span className="text-[12px] text-[#737686]">Ongkir</span>
                    <span className="text-[12px] text-[#737686]">Gratis</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-[13px] font-semibold text-[#191c1e]">Total Toko</span>
                    <span className="text-[14px] font-bold text-[#004ac6]">{formatRupiah(order.total)}</span>
                  </div>
                </div>
              ))}

              {/* Stock problems */}
              {preview.stockProblems.length > 0 && (
                <div className="bg-[#ffdad6] border border-[#ba1a1a]/20 rounded-2xl px-4 py-3">
                  <p className="text-[13px] text-[#93000a] font-semibold mb-1">Stok tidak mencukupi</p>
                  {preview.stockProblems.map((sp) => (
                    <p key={sp.cartItemId} className="text-[12px] text-[#93000a]">
                      {sp.productName ?? 'Produk'} — diminta {sp.requested}, tersedia {sp.available}
                    </p>
                  ))}
                </div>
              )}
            </div>

            {/* ── Right column ── */}
            <div className="bg-white border border-[#e0e3e5] rounded-2xl p-5">
              <h3 className="text-[15px] font-bold text-[#004ac6] mb-4">Ringkasan</h3>
              <div className="space-y-2 text-[13px]">
                <div className="flex justify-between">
                  <span className="text-[#737686]">Total ({preview.orderCount} pesanan)</span>
                  <span className="font-semibold text-[#191c1e]">{formatRupiah(preview.grandTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#737686]">Ongkos kirim</span>
                  <span className="font-semibold text-[#191c1e]">Gratis</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-[#e0e3e5] flex items-center justify-between">
                <span className="text-[14px] font-semibold text-[#191c1e]">Total Bayar</span>
                <span className="text-[22px] font-bold text-[#004ac6]">{formatRupiah(preview.grandTotal)}</span>
              </div>

              <div className="mt-4 pt-4 border-t border-[#e0e3e5]">
                <p className="text-[13px] font-semibold text-[#191c1e] mb-2">Metode Pembayaran</p>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('MIDTRANS')}
                    className={`w-full flex items-start gap-3 text-left p-3 rounded-xl border transition-colors ${
                      paymentMethod === 'MIDTRANS'
                        ? 'border-[#004ac6] bg-[#dbe1ff]/40'
                        : 'border-[#e0e3e5] hover:border-[#004ac6]'
                    }`}
                  >
                    <div className="w-4 h-4 mt-0.5 rounded-full border-2 shrink-0 flex items-center justify-center"
                      style={{ borderColor: paymentMethod === 'MIDTRANS' ? '#004ac6' : '#c3c6d7' }}>
                      {paymentMethod === 'MIDTRANS' && <div className="w-2 h-2 rounded-full bg-[#004ac6]" />}
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-[#191c1e]">Bayar Online</p>
                      <p className="text-[11px] text-[#737686]">Midtrans (kartu, e-wallet, bank transfer, QRIS)</p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('COD')}
                    className={`w-full flex items-start gap-3 text-left p-3 rounded-xl border transition-colors ${
                      paymentMethod === 'COD'
                        ? 'border-[#004ac6] bg-[#dbe1ff]/40'
                        : 'border-[#e0e3e5] hover:border-[#004ac6]'
                    }`}
                  >
                    <div className="w-4 h-4 mt-0.5 rounded-full border-2 shrink-0 flex items-center justify-center"
                      style={{ borderColor: paymentMethod === 'COD' ? '#004ac6' : '#c3c6d7' }}>
                      {paymentMethod === 'COD' && <div className="w-2 h-2 rounded-full bg-[#004ac6]" />}
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-[#191c1e]">COD (Bayar di Tempat)</p>
                      <p className="text-[11px] text-[#737686]">Bayar tunai saat barang tiba</p>
                    </div>
                  </button>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={!canCheckout}
                className="mt-5 w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#004ac6] hover:bg-[#003ea8] text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Icon name="lock" size={16} className="" />
                Buat Pesanan
              </button>
              {!canCheckout && (
                <p className="mt-2 text-[11px] text-[#737686] text-center">
                  {!selectedAddressId ? 'Pilih alamat pengiriman terlebih dahulu.' : 'Perbaiki stok yang tidak tersedia.'}
                </p>
              )}
            </div>
          </div>
        )}
      </main>

      {/* ── Address form modal ── */}
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
            <form onSubmit={saveAddress} className="p-5 space-y-3">
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

export default CheckoutPage;
