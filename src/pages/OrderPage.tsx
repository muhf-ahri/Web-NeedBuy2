import React, { useState, useCallback, useEffect } from 'react';


import Icon from '../components/ui/Icon';

import OrdersShell from '../components/orders/OrdersShell';
import OrdersHero from '../components/orders/OrdersHero';
import OrdersTabs from '../components/orders/OrdersTabs';
import OrderCard from '../components/orders/OrderCard';
import OrdersHistoryList from '../components/orders/OrderHistoryList';
import OrderDetailModal from '../components/orders/OrderDetailModal';
import ReviewModal from '../components/orders/ReviewModal';
import OrdersEmptyState from '../components/orders/OrdersEmptyState';
import OrdersErrorState from '../components/orders/OrdersErrorState';
import OrdersLoginPrompt from '../components/orders/OrdersLoginPormpt';

import {
  getOrders,
  getOrder,
  cancelOrder,
  createReview,
  updateOrderStatus,
  type Order,
} from '../api/orders';
import {
  ACCEPTED_IMAGE_TYPES,
  ACCEPTED_VIDEO_TYPES,
  MAX_IMAGE_BYTES,
  MAX_VIDEO_BYTES,
  uploadImage,
} from '../api/uploads';
import { retryPayment, syncPayment } from '../api/payments';
import { payWithSnap } from '../utils/snap';
import { getAccessToken } from '../api/auth';

import type { TabKey } from '../components/orders/orders.helpers';

const OrderPage: React.FC = () => {

  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<TabKey>('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const [selected, setSelected] = useState<Order | null>(null);
  const [busy, setBusy] = useState(false);
  const [checkingPayment, setCheckingPayment] = useState(false);

  const [reviewFor, setReviewFor] = useState<Order | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewMedia, setReviewMedia] = useState<
    Array<{ url: string; kind: 'IMAGE' | 'VIDEO' }>
  >([]);
  const [uploadingMedia, setUploadingMedia] = useState(false);

  const isAuthed = !!getAccessToken();

  const retry = () => {
    setError(null);
    setReloadKey((k) => k + 1);
  };

  const fetchOrders = useCallback(async () => {
    if (!isAuthed) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getOrders(
        activeTab === 'ALL' || activeTab === 'HISTORY'
          ? {}
          : { status: activeTab }
      );
      setOrders(res.data.data);
    } catch (err: any) {
      setError(err.message ?? 'Gagal muat pesanan, coba lagi ya');
    } finally {
      setLoading(false);
    }
  }, [isAuthed, activeTab]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders, reloadKey]);

  const openDetail = async (id: string) => {
    setError(null);
    try {
      let res = await getOrder(id);
      if (
        res.data.data.status === 'WAITING_PAYMENT' &&
        res.data.data.payment?.method !== 'COD'
      ) {
        try {
          await syncPayment(id);
          res = await getOrder(id);
        } catch {}
      }
      setSelected(res.data.data);
    } catch (err: any) {
      setError(err.message ?? 'Gagal muat detail pesanan, coba lagi ya');
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
      setError(err.message ?? 'Gagal batalin pesanan, coba lagi ya');
    } finally {
      setBusy(false);
    }
  };

  const waitForPaymentSync = async (orderId: string) => {
    setCheckingPayment(true);
    try {
      for (let i = 0; i < 4; i += 1) {
        try {
          await syncPayment(orderId);
        } catch {}
        const res = await getOrder(orderId);
        if (
          res.data.data.status !== 'WAITING_PAYMENT' ||
          res.data.data.payment?.status === 'PAID'
        ) {
          setSelected(res.data.data);
          break;
        }
        await new Promise((r) => setTimeout(r, 2000));
      }
    } catch {} finally {
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
        setError('Token pembayarannya belum ada. Coba lagi nanti ya.');
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
            setError('Pembayarannya gagal: ' + JSON.stringify(result));
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
      setError(err.message ?? 'Gagal muat data pembayaran, coba lagi ya');
    } finally {
      setBusy(false);
    }
  };

  const handleCheckStatus = async () => {
    if (!selected) return;
    await waitForPaymentSync(selected.id);
    await openDetail(selected.id);
  };

  const handleConfirmReceived = async () => {
    if (!selected) return;
    setBusy(true);
    setError(null);
    try {
      await updateOrderStatus(selected.id, 'COMPLETED');
      await openDetail(selected.id);
      await fetchOrders();
    } catch (err: any) {
      setError(
        err.message ?? 'Gagal konfirmasi pesanan diterima, coba lagi ya'
      );
    } finally {
      setBusy(false);
    }
  };

  const openReview = (order: Order) => {
    setReviewFor(order);
    setRating(5);
    setComment('');
    setReviewMedia([]);
  };

  const submitReview = async () => {
    if (!reviewFor) return;
    const targetItem = reviewFor.items.find((i) => !i.review);
    if (!targetItem) return;

    setBusy(true);
    setError(null);
    try {
      await createReview(reviewFor.id, targetItem.id, {
        rating,
        comment: comment.trim() || undefined,
        ...(reviewMedia.length > 0 ? { media: reviewMedia } : {}),
      });
      setReviewFor(null);
      setRating(5);
      setComment('');
      setReviewMedia([]);
      await openDetail(reviewFor.id);
      await fetchOrders();
    } catch (err: any) {
      setError(err.message ?? 'Ulasannya gagal dikirim, coba lagi ya');
    } finally {
      setBusy(false);
    }
  };

  const handlePickReviewMedia = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = [...(e.target.files ?? [])];
    e.target.value = '';
    if (files.length === 0) return;

    if (reviewMedia.length + files.length > 5) {
      setError('Maksimal 5 foto/video per ulasan.');
      return;
    }

    setUploadingMedia(true);
    setError(null);
    try {
      for (const file of files) {
        const isVideo = ACCEPTED_VIDEO_TYPES.includes(file.type);
        const isImage = ACCEPTED_IMAGE_TYPES.includes(file.type);
        if (!isImage && !isVideo) {
          setError(
            `"${file.name}" harus foto (PNG/JPG/WebP/GIF) atau video (MP4/WebM).`
          );
          continue;
        }
        const limit = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
        if (file.size > limit) {
          setError(
            `Ukuran "${file.name}" terlalu besar, maksimal ${
              isVideo ? '20 MB untuk video' : '3 MB untuk foto'
            }.`
          );
          continue;
        }
        const res = await uploadImage(file);
        setReviewMedia((prev) => [
          ...prev,
          { url: res.data.data.url, kind: res.data.data.kind },
        ]);
      }
    } catch (err: any) {
      setError(err?.message ?? 'Gagal unggah lampiran, coba lagi ya');
    } finally {
      setUploadingMedia(false);
    }
  };

  const removeMedia = (index: number) => {
    setReviewMedia((prev) => prev.filter((_, i) => i !== index));
  };

  if (!isAuthed) {
    return <OrdersLoginPrompt />;
  }

  const showFatalError = !loading && Boolean(error) && orders.length === 0;

  return (
    <OrdersShell>
      <OrdersHero totalCount={orders.length} loading={loading} />

      {error && !showFatalError && (
        <div
          className="
            mb-5 flex items-center gap-3 rounded-2xl border
            border-[#ba1a1a]/20 bg-[#FFF0F0] px-4 py-3 backdrop-blur-sm
          "
        >
          <span
            className="
              flex h-8 w-8 shrink-0 items-center justify-center rounded-full
              bg-[#ba1a1a]/15
            "
          >
            <Icon name="alert" size={15} className="text-[#ba1a1a]" />
          </span>
          <p className="flex-1 text-[13px] font-medium text-[#ba1a1a]">
            {error}
          </p>
          <button
            type="button"
            onClick={() => setError(null)}
            className="shrink-0 rounded-full p-1 text-[#ba1a1a] hover:bg-white"
            aria-label="Tutup"
          >
            <Icon name="close" size={14} />
          </button>
        </div>
      )}

      <OrdersTabs activeTab={activeTab} onChange={setActiveTab} />

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="
                h-28 animate-pulse rounded-[24px] border border-white/80
                bg-white/95
              "
            />
          ))}
        </div>
      ) : showFatalError ? (
        <OrdersErrorState onRetry={retry} errorMessage={error ?? undefined} />
      ) : orders.length === 0 ? (
        <OrdersEmptyState tab={activeTab} />
      ) : activeTab === 'HISTORY' ? (
        <OrdersHistoryList orders={orders} onOpen={openDetail} />
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} onOpen={openDetail} />
          ))}
        </div>
      )}

      {selected && (
        <OrderDetailModal
          order={selected}
          busy={busy}
          checkingPayment={checkingPayment}
          onClose={() => setSelected(null)}
          onPay={handlePay}
          onCheckStatus={handleCheckStatus}
          onCancel={handleCancel}
          onConfirmReceived={handleConfirmReceived}
          onOpenReview={openReview}
          onRefresh={fetchOrders}
        />
      )}

      {reviewFor && (
        <ReviewModal
          order={reviewFor}
          rating={rating}
          comment={comment}
          reviewMedia={reviewMedia}
          uploadingMedia={uploadingMedia}
          busy={busy}
          onClose={() => setReviewFor(null)}
          onRatingChange={setRating}
          onCommentChange={setComment}
          onPickMedia={handlePickReviewMedia}
          onRemoveMedia={removeMedia}
          onSubmit={submitReview}
        />
      )}
    </OrdersShell>
  );
};

export default OrderPage;