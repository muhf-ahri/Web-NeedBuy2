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
import { getWallet } from '../api/wallet';
import { getCoupons, couponDiscount, COUPON_SKIN, type Coupon } from '../api/coupons';
import { StepCard, StepAction, StepEmpty, DataRow, ChoiceRow } from '../components/ui/StepCard';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshCartCount } = useCartContext();

  const cartItemIds = (location.state as { cartItemIds?: string[] } | null)?.cartItemIds;
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [preview, setPreview] = useState<CheckoutPreview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('MIDTRANS');
  const [walletBalance, setWalletBalance] = useState(0);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [couponCode, setCouponCode] = useState<string | null>(null);

  const [createdOrders, setCreatedOrders] = useState<CreatedOrderPayment[] | null>(null);
  const [paying, setPaying] = useState(false);

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
      const [addrRes, previewRes, walletRes, couponRes] = await Promise.allSettled([
        getAddresses(),
        previewCheckout(0, cartItemIds),
        getWallet(),
        getCoupons('mine'),
      ]);

      setCoupons(
        couponRes.status === 'fulfilled'
          ? couponRes.value.data.data.filter((c) => !c.usedAt && !c.expired)
          : []
      );

      setWalletBalance(walletRes.status === 'fulfilled' ? Number(walletRes.value.balance) : 0);

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
      setError(err.message ?? 'Gagal muat data checkout, coba lagi ya');
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
        setError('Cek lagi isian alamatnya ya.');
      } else {
        setError(err.message ?? 'Gagal simpan alamat, coba lagi ya');
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
        {
          addressId: selectedAddressId,
          cartItemIds,
          shippingCost: 0,
          paymentMethod,
          ...(couponCode ? { couponCode } : {}),
        },
        idempotencyKey
      );
      setCreatedOrders(res.data.data.orders);
      await refreshCartCount();
    } catch (err: any) {
      setError(err.message ?? 'Checkoutnya gagal, coba lagi ya');
    }
  };

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
              setError('Pembayarannya gagal: ' + JSON.stringify(result));
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
      <div className="min-h-screen flex flex-col bg-[#f2f4f6]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <Navbar />
        <main className="flex-1 max-w-6xl mx-auto w-full px-5 sm:px-10 py-16 flex items-center justify-center">
          <div className="text-center">
            <Icon name="lock" size={48} className="text-[#c3c6d7] mx-auto mb-4" />
            <p className="text-[#737686] mb-4">Login dulu ya buat lanjut checkout.</p>
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f2f4f6]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
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

  if (createdOrders) {
    const hasOnline = createdOrders.some((o) => o.paymentMethod === 'MIDTRANS');
    const allCod = createdOrders.every((o) => o.paymentMethod === 'COD');
    const allNeedPay = createdOrders.every((o) => o.paymentMethod === 'NEEDPAY');
    const allPaidReady = !hasOnline;

    return (
      <div className="min-h-screen flex flex-col bg-[#f2f4f6]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <Navbar />
        <main className="flex-1 max-w-2xl mx-auto w-full px-5 sm:px-10 py-12">
          <div className="text-center mb-8">
            <Icon name="check" size={56} className="text-[#12805c] mx-auto mb-3" />
            <h1 className="text-[26px] font-bold text-[#101319]">Checkout Berhasil!</h1>
            <p className="text-[14px] text-[#737686] mt-1">
              {allNeedPay
                ? `${createdOrders.length} pesanan dibuat dan sudah dibayar pakai saldo NeedPay.`
                : allCod
                  ? `${createdOrders.length} pesanan dibuat. Pembayaran dilakukan saat barang tiba (COD).`
                  : `${createdOrders.length} pesanan berhasil dibuat. Kamu bisa membayar kapan saja dari halaman Pesanan.`}
            </p>
          </div>

          {error && (
            <div className="bg-[#ffdad6] border border-[#ba1a1a]/20 rounded-2xl px-4 py-3 mb-4">
              <p className="text-[13px] text-[#93000a]">{error}</p>
            </div>
          )}

          <div className="overflow-hidden rounded-2xl border border-[#e0e3e5] bg-white">
            {createdOrders.map((order) => (
              <div key={order.orderId} className="px-5 py-4 border-b border-[#e0e3e5] last:border-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[14px] font-semibold text-[#101319]">#{order.orderNumber}</p>
                    <p className="text-[12px] text-[#737686]">
                      {order.paymentMethod === 'COD'
                        ? 'Bayar saat barang tiba (COD)'
                        : order.paymentMethod === 'NEEDPAY'
                          ? 'Lunas pakai saldo NeedPay'
                          : order.paymentError
                            ? 'Token pembayarannya belum dibuat'
                            : 'Nunggu pembayaran online'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[14px] font-bold text-[#4077a6]">
                      {order.paymentMethod === 'COD'
                        ? 'COD'
                        : order.paymentMethod === 'NEEDPAY'
                          ? 'NeedPay'
                          : 'Bayar Online'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => navigate('/orders')}
              className="flex-1 px-6 py-3 rounded-full border border-[#c3c6d7] text-[14px] font-semibold text-[#101319] hover:border-[#538cbd] hover:text-[#4077a6] transition-colors"
            >
              {allCod ? 'Lihat Pesanan' : 'Bayar Nanti Aja'}
            </button>
            {hasOnline && (
              <button
                onClick={payOrders}
                disabled={paying}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#4077a6] hover:bg-[#284a67] text-white text-[14px] font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {paying && <Icon name="clock" size={16} className="animate-spin" />}
                {paying ? 'Bentar ya...' : 'Bayar Sekarang'}
              </button>
            )}
          </div>
          {allPaidReady && (
            <p className="mt-3 text-center text-[11px] text-[#737686]">
              Pesanan COD langsung diproses penjual, bayar tunai saat barang tiba.
            </p>
          )}
        </main>
        <Footer />
      </div>
    );
  }

  const canCheckout = !!preview && preview.canCheckout && !!selectedAddressId;

  const cartSubtotal = preview ? Number(preview.grandTotal) : 0;
  const cartShipping = 0;

  const appliedCoupon = coupons.find((c) => c.code === couponCode) ?? null;
  const couponCut = appliedCoupon
    ? couponDiscount(appliedCoupon, cartSubtotal, cartShipping)
    : 0;
  const payable = Math.max(cartSubtotal + cartShipping - couponCut, 0);

  const needPayEnough = !!preview && walletBalance >= payable;

  const shipTo = addresses.find((a) => a.id === selectedAddressId) ?? null;

  return (
    <div className="flex min-h-screen flex-col bg-[#f2f4f6]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />

      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-8 sm:px-10">
        <button
          onClick={() => navigate('/cart')}
          className="mb-5 flex items-center gap-1 text-[#737686] transition-colors hover:text-[#101319]"
        >
          <Icon name="chevronLeft" size={16} />
          <span className="text-[13px]">Balik ke keranjang</span>
        </button>

        <h1 className="text-[28px] font-bold text-[#101319]">Checkout</h1>
        <p className="mt-1 text-[14px] text-[#737686]">
          Cek penerima, alamat, dan cara bayarnya. Pesanan baru dibuat setelah kamu menekan tombol di bawah.
        </p>

        {error && (
          <div className="mt-5 rounded-2xl border border-[#ba1a1a]/20 bg-[#ffdad6] px-4 py-3">
            <p className="text-[13px] text-[#93000a]">{error}</p>
          </div>
        )}

        {!preview || preview.orders.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-[#e0e3e5] bg-white py-20 text-center">
            <Icon name="cart" size={44} className="mx-auto mb-3 text-[#c3c6d7]" />
            <p className="text-[15px] font-semibold text-[#101319]">Keranjangmu masih kosong.</p>
            <p className="mt-1 text-[13px] text-[#737686]">Pilih barangnya dulu, checkoutnya nanti.</p>
            <button
              onClick={() => navigate('/categories')}
              className="mt-5 rounded-full bg-[#4077a6] px-6 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-[#284a67]"
            >
              Mulai belanja
            </button>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 items-start gap-5 lg:grid-cols-3">
            <div className="space-y-5 lg:col-span-2">

              <StepCard
                step={1}
                title="Kontak penerima"
                hint={shipTo ? 'Orang yang dihubungi kurir' : undefined}
                done={!!shipTo}
                action={
                  shipTo ? <StepAction onClick={() => setShowAddressForm(true)}>Ubah</StepAction> : undefined
                }
              >
                {shipTo ? (
                  <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <DataRow label="Nama lengkap" value={shipTo.recipientName} />
                    <DataRow label="Nomor telepon" value={shipTo.phone} />
                  </dl>
                ) : (
                  <StepEmpty
                    text="Belum ada data penerima"
                    cta="Isi nama & nomor telepon"
                    onClick={() => setShowAddressForm(true)}
                  />
                )}
              </StepCard>

              <StepCard
                step={2}
                title="Alamat pengiriman"
                hint={addresses.length > 1 ? `${addresses.length} alamat tersimpan` : undefined}
                done={!!shipTo}
                action={<StepAction onClick={() => setShowAddressForm(true)}>Alamat baru</StepAction>}
              >
                {addresses.length === 0 ? (
                  <StepEmpty
                    text="Belum ada alamat tersimpan"
                    cta="Tambah alamat pengiriman"
                    onClick={() => setShowAddressForm(true)}
                  />
                ) : (
                  <>
                    {shipTo && (
                      <dl className="mb-4 grid grid-cols-1 gap-4 rounded-xl bg-[#f5f7fb] p-4 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                          <DataRow label="Alamat lengkap" value={shipTo.fullAddress} />
                        </div>
                        <DataRow label="Kota" value={shipTo.city} />
                        <DataRow label="Provinsi" value={shipTo.province} />
                        <DataRow label="Kode pos" value={shipTo.postalCode} />
                        <DataRow label="Nomor HP" value={shipTo.phone} />
                      </dl>
                    )}

                    {addresses.length > 1 && (
                      <>
                        <p className="mb-2 text-[12px] font-semibold text-[#737686]">Kirim ke alamat lain</p>
                        <div className="space-y-2">
                          {addresses.map((addr) => (
                            <ChoiceRow
                              key={addr.id}
                              selected={selectedAddressId === addr.id}
                              onClick={() => setSelectedAddressId(addr.id)}
                            >
                              <span className="block truncate text-[13px] font-semibold text-[#101319]">
                                {addr.recipientName}
                                {addr.label && <span className="font-normal text-[#737686]"> · {addr.label}</span>}
                                {addr.isDefault && <span className="text-[#4077a6]"> · Utama</span>}
                              </span>
                              <span className="mt-0.5 block text-[12px] text-[#737686]">
                                {addr.fullAddress}, {addr.city}, {addr.province} {addr.postalCode}
                              </span>
                            </ChoiceRow>
                          ))}
                        </div>
                      </>
                    )}
                  </>
                )}
              </StepCard>

              <StepCard step={3} title="Metode pembayaran" done>
                <div className="space-y-2">
                  <ChoiceRow
                    selected={paymentMethod === 'MIDTRANS'}
                    onClick={() => setPaymentMethod('MIDTRANS')}
                  >
                    <span className="block text-[13px] font-semibold text-[#101319]">Bayar online</span>
                    <span className="block text-[11px] text-[#737686]">
                      Kartu, e-wallet, transfer bank, QRIS via Midtrans
                    </span>
                  </ChoiceRow>

                  <ChoiceRow selected={paymentMethod === 'COD'} onClick={() => setPaymentMethod('COD')}>
                    <span className="block text-[13px] font-semibold text-[#101319]">Bayar di tempat (COD)</span>
                    <span className="block text-[11px] text-[#737686]">Bayar tunai saat barang tiba</span>
                  </ChoiceRow>

                  <ChoiceRow
                    selected={paymentMethod === 'NEEDPAY'}
                    disabled={!needPayEnough}
                    onClick={() => setPaymentMethod('NEEDPAY')}
                  >
                    <span className="block text-[13px] font-semibold text-[#101319]">Saldo NeedPay</span>
                    <span className="block text-[11px] text-[#737686]">
                      Saldo kamu {formatRupiah(walletBalance)}
                      {!needPayEnough && ' (kurang untuk pesanan ini)'}
                    </span>
                  </ChoiceRow>
                </div>

                {!needPayEnough && (
                  <button
                    type="button"
                    onClick={() => navigate('/needpay')}
                    className="mt-2.5 text-[12px] font-semibold text-[#4077a6] hover:underline"
                  >
                    Isi saldo NeedPay →
                  </button>
                )}
              </StepCard>

              <section className="overflow-hidden rounded-2xl border border-[#e0e3e5] bg-white">
                <header className="border-b border-[#e0e3e5] px-4 py-3 sm:px-5">
                  <h2 className="text-[14px] font-bold text-[#101319]">
                    Barang yang dibeli
                    <span className="ml-1.5 font-medium text-[#737686]">
                      · {preview.orderCount} pesanan
                    </span>
                  </h2>
                </header>

                <div className="divide-y divide-[#e0e3e5]">
                  {preview.orders.map((order) => (
                    <div key={order.sellerId} className="p-4 sm:p-5">
                      <p className="mb-3 text-[12px] font-bold uppercase tracking-wide text-[#4077a6]">
                        {order.storeName ?? 'Toko'}
                      </p>
                      <div className="space-y-2">
                        {order.items.map((line) => (
                          <Link
                            key={line.cartItemId}
                            to={`/products/${line.productSlug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group -mx-2 flex items-center justify-between gap-3 rounded-xl px-2 py-1.5 transition-colors hover:bg-[#f5f7fb]"
                          >
                            <span className="flex min-w-0 items-center gap-3">
                              <img
                                src={line.imageUrl ?? 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80'}
                                alt=""
                                loading="lazy"
                                className="h-11 w-11 shrink-0 rounded-lg bg-[#f2f4f6] object-cover"
                              />
                              <span className="min-w-0">
                                <span className="block truncate text-[13px] text-[#101319] transition-colors group-hover:text-[#4077a6]">
                                  {line.productName}
                                </span>
                                <span className="block text-[12px] text-[#737686]">
                                  {line.quantity} × {formatRupiah(line.price)}
                                  {line.bulkDiscountPercent > 0 && (
                                    <span className="ml-1.5 font-semibold text-[#12805c]">
                                      grosir −{line.bulkDiscountPercent}%
                                    </span>
                                  )}
                                </span>
                                {line.variant && (
                                  <span className="block text-[11px] text-[#737686]">Model: {line.variant}</span>
                                )}
                              </span>
                            </span>
                            <span className="shrink-0 text-[13px] font-semibold text-[#101319]">
                              {formatRupiah(line.subtotal)}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {preview.stockProblems.length > 0 && (
                <div className="rounded-2xl border border-[#fff7e0] bg-[#fff7e0] px-4 py-3">
                  <p className="text-[13px] font-semibold text-[#b45309]">Ada item yang stoknya kurang</p>
                  {preview.stockProblems.map((sp) => (
                    <p key={sp.cartItemId} className="mt-0.5 text-[12px] text-[#b45309]">
                      {sp.productName ?? 'Produk'}: diminta {sp.requested}, tersedia {sp.available}
                    </p>
                  ))}
                </div>
              )}
            </div>

            <aside className="lg:sticky lg:top-24">
              <div className="overflow-hidden rounded-2xl border border-[#e0e3e5] bg-white">
                <div className="bg-gradient-to-br from-[#538cbd] to-[#284a67] p-5 text-white">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-white/70">
                    Total bayar
                  </p>
                  <p className="mt-1 text-[30px] font-bold leading-none tabular-nums">
                    {formatRupiah(payable)}
                  </p>

                  <dl className="mt-4 space-y-1.5 border-t border-white/20 pt-3 text-[13px]">
                    <div className="flex justify-between">
                      <dt className="text-white/75">Subtotal barang</dt>
                      <dd className="font-semibold tabular-nums">{formatRupiah(cartSubtotal)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-white/75">Ongkos kirim</dt>
                      <dd className="font-semibold">Gratis</dd>
                    </div>
                    {couponCut > 0 && (
                      <div className="flex justify-between">
                        <dt className="text-white/75">Potongan kupon</dt>
                        <dd className="font-semibold tabular-nums text-[#7fe8b2]">
                          − {formatRupiah(couponCut)}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>

                <div className="border-b border-[#e0e3e5] p-4 sm:p-5">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <p className="text-[13px] font-bold text-[#101319]">Kupon</p>
                    {couponCode && (
                      <button
                        type="button"
                        onClick={() => setCouponCode(null)}
                        className="text-[12px] font-semibold text-[#ba1a1a] hover:underline"
                      >
                        Lepas
                      </button>
                    )}
                  </div>

                  {coupons.length === 0 ? (
                    <StepEmpty
                      text="Belum punya kupon"
                      cta="Klaim di halaman Kupon"
                      onClick={() => navigate('/coupons')}
                    />
                  ) : (
                    <div className="max-h-56 space-y-2 overflow-y-auto">
                      {coupons.map((coupon) => {
                        const skin = COUPON_SKIN[coupon.category] ?? COUPON_SKIN.DISCOUNT;
                        const cut = couponDiscount(coupon, cartSubtotal, cartShipping);
                        const shortfall = Number(coupon.minSpend) - cartSubtotal;
                        const usable = cut > 0;
                        const picked = couponCode === coupon.code;

                        return (
                          <ChoiceRow
                            key={coupon.id}
                            selected={picked}
                            disabled={!usable}
                            onClick={() => setCouponCode(picked ? null : coupon.code)}
                          >
                            <span className="flex items-center gap-2">
                              <span
                                className="shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-bold"
                                style={{ backgroundColor: skin.stub, color: skin.ink }}
                              >
                                {skin.label}
                              </span>
                              <span className="truncate text-[12px] font-semibold text-[#101319]">
                                {coupon.title}
                              </span>
                            </span>
                            <span className="mt-0.5 block text-[11px] text-[#737686]">
                              {usable
                                ? `Potong ${formatRupiah(cut)}`
                                : shortfall > 0
                                  ? `Kurang ${formatRupiah(shortfall)} lagi`
                                  : 'Nggak memotong apa-apa di pesanan ini'}
                            </span>
                          </ChoiceRow>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="p-4 sm:p-5">
                  <button
                    onClick={handleCheckout}
                    disabled={!canCheckout}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-[#4077a6] px-6 py-3.5 text-[15px] font-bold text-white transition-colors hover:bg-[#284a67] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4077a6]"
                  >
                    <Icon name="lock" size={16} />
                    Checkout · {formatRupiah(payable)}
                  </button>

                  <p className="mt-2.5 text-center text-[11px] text-[#737686]">
                    {!canCheckout
                      ? !selectedAddressId
                        ? 'Pilih alamat pengiriman dulu ya.'
                        : 'Beresin dulu item yang stoknya kurang.'
                      : 'Stok baru dikunci setelah pesanan dibuat.'}
                  </p>
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>

      {showAddressForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-3 border-b border-[#e0e3e5] bg-[#f5f7fb] p-4">
              <div>
                <h3 className="text-[15px] font-bold text-[#101319]">Alamat & kontak penerima</h3>
                <p className="mt-0.5 text-[12px] text-[#737686]">Mengisi langkah 1 dan 2 sekaligus.</p>
              </div>
              <button
                onClick={() => setShowAddressForm(false)}
                className="text-[#737686] hover:text-[#101319] transition-colors"
              >
                <Icon name="close" size={20} className="" />
              </button>
            </div>
            <form onSubmit={saveAddress} className="p-5 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="Nama lengkap"
                  value={addressForm.recipientName}
                  onChange={(v) => updateField('recipientName', v)}
                  error={fieldErrors.recipientName}
                  required
                />
                <Field
                  label="Nomor telepon"
                  value={addressForm.phone}
                  onChange={(v) => updateField('phone', v)}
                  error={fieldErrors.phone}
                  required
                />
              </div>
              <Field
                label="Alamat lengkap"
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
                  label="Kode pos"
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
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#4077a6] hover:bg-[#284a67] text-white text-[14px] font-semibold transition-colors disabled:opacity-50"
              >
                {savingAddress && <Icon name="clock" size={16} className="animate-spin" />}
                Simpan alamat
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
    <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-[#737686]">
      {label}
    </label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      className={`w-full px-3 py-2 rounded-lg border outline-none focus:ring-2 text-sm transition ${
        error
          ? 'border-[#ba1a1a] focus:border-[#ba1a1a] focus:ring-[#ba1a1a]/20'
          : 'border-[#c3c6d7] focus:border-[#538cbd] focus:ring-[#538cbd]/20'
      }`}
    />
    {error && <p className="mt-1 text-[11px] text-[#ba1a1a]">{error}</p>}
  </div>
);

export default CheckoutPage;
