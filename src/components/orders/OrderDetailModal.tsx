import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Icon from '../ui/Icon';
import { formatRupiah } from '../../utils/currency';
import {
  STATUS_STYLE,
  STATUS_LABEL,
  dateTimeLabel,
  paymentMethodLabel,
} from './orders.helpers';
import type { Order } from '../../api/orders';

interface OrderDetailModalProps {
  order: Order;
  busy: boolean;
  checkingPayment: boolean;
  onClose: () => void;
  onPay: () => void;
  onCheckStatus: () => void;
  onCancel: () => void;
  onConfirmReceived: () => void;
  onOpenReview: (order: Order) => void;
  onRefresh: () => void;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  busy,
  checkingPayment,
  onClose,
  onPay,
  onCheckStatus,
  onCancel,
  onConfirmReceived,
  onOpenReview,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div
        className="absolute inset-0 bg-[#20242D]/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className="
          order-modal-enter relative flex max-h-[92vh] w-full max-w-2xl
          flex-col overflow-hidden rounded-[24px] border border-white/80
          bg-white/98 shadow-[0_18px_50px_rgba(32,36,45,0.20)]
          backdrop-blur-sm
        "
      >

        <div className="flex items-start justify-between gap-3 border-b border-[#E8ECF4] px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <div className="mb-1 flex items-center gap-2">
              <span
                className={`
                  inline-flex items-center gap-1 rounded-full px-2.5 py-1
                  text-[10px] font-semibold ${STATUS_STYLE[order.status]}
                `}
              >
                <span className="h-1 w-1 rounded-full bg-current opacity-60" />
                {STATUS_LABEL[order.status]}
              </span>
              <span className="font-mono text-[11px] font-bold text-[#737A87]">
                #{order.orderNumber}
              </span>
            </div>
            <p className="truncate text-[13px] font-bold text-[#20242D]">
              {order.seller.storeName}
            </p>
            <p className="mt-0.5 text-[11px] text-[#A2A8B3]">
              {dateTimeLabel(order.createdAt)}
            </p>
            <button
              type="button"
              onClick={() => navigate(`/messages?seller=${order.seller.id}`)}
              className="
                mt-1.5 inline-flex items-center gap-1 text-[11px]
                font-semibold text-[#538CDB] hover:underline
              "
            >
              <Icon name="chat" size={12} /> Chat penjual
            </button>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="
              shrink-0 rounded-full p-1.5 text-[#737A87] transition-colors
              hover:bg-[#F5F7FB] hover:text-[#20242D]
            "
            aria-label="Tutup"
          >
            <Icon name="close" size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6">
          <div className="space-y-5">
            <div
              className="
                flex flex-wrap items-center justify-between gap-2
                rounded-2xl bg-[#F5F7FB] px-4 py-3 text-[12px]
              "
            >
              <div className="flex items-center gap-2">
                <Icon name="card" size={15} className="text-[#538CDB]" />
                <span className="font-semibold text-[#20242D]">
                  {paymentMethodLabel(order.payment?.method)}
                </span>
              </div>
              <span className="text-[#737A87]">
                {order.statusPembayaranLabel}
              </span>
            </div>

            <div>
              <p
                className="
                  mb-3 text-[10px] font-bold uppercase tracking-[0.16em]
                  text-[#737A87]
                "
              >
                Detail Produk
              </p>
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="
                      flex items-center justify-between gap-3 rounded-xl
                      border border-[#E8ECF4] bg-white p-3
                    "
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-semibold text-[#20242D]">
                        {item.productName}
                      </p>
                      {item.variant && (
                        <p className="mt-0.5 text-[11px] text-[#737A87]">
                          Model: {item.variant}
                        </p>
                      )}
                      <p className="mt-0.5 text-[11px] text-[#A2A8B3]">
                        {item.quantity} × {formatRupiah(item.price)}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-[13px] font-bold text-[#20242D]">
                        {formatRupiah(item.subtotal)}
                      </p>
                      {order.status === 'COMPLETED' && !item.review && (
                        <button
                          type="button"
                          onClick={() => onOpenReview(order)}
                          className="
                            mt-1 inline-flex items-center gap-1 text-[11px]
                            font-semibold text-[#538CDB] hover:underline
                          "
                        >
                          <Icon name="star" size={11} />
                          Beri ulasan
                        </button>
                      )}
                      {item.review && (
                        <p
                          className="
                            mt-1 inline-flex items-center gap-1 text-[11px]
                            text-[#737A87]
                          "
                        >
                          <Icon
                            name="star"
                            size={11}
                            className="text-[#FFD500]"
                          />
                          {item.review.rating}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {order.address && (
              <div>
                <p
                  className="
                    mb-2 text-[10px] font-bold uppercase tracking-[0.16em]
                    text-[#737A87]
                  "
                >
                  Alamat Pengiriman
                </p>
                <div className="rounded-2xl bg-[#F5F7FB] p-4">
                  <div className="flex items-start gap-2">
                    <Icon
                      name="pin"
                      size={15}
                      className="mt-0.5 shrink-0 text-[#538CDB]"
                    />
                    <div className="min-w-0">
                      <p className="text-[12px] font-semibold text-[#20242D]">
                        {order.address.recipientName} · {order.address.phone}
                      </p>
                      <p className="mt-0.5 text-[11px] leading-relaxed text-[#737A87]">
                        {order.address.fullAddress}, {order.address.city},{' '}
                        {order.address.province} {order.address.postalCode}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="rounded-2xl bg-[#F5F7FB] p-4">
              <div className="space-y-2 text-[12px]">
                <div className="flex justify-between">
                  <span className="text-[#737A87]">Subtotal</span>
                  <span className="font-semibold text-[#20242D]">
                    {formatRupiah(order.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#737A87]">Ongkos kirim</span>
                  <span className="font-semibold text-[#20242D]">
                    {order.shippingCost === '0' || !order.shippingCost
                      ? 'Gratis'
                      : formatRupiah(order.shippingCost)}
                  </span>
                </div>
                <div
                  className="
                    flex justify-between border-t border-[#E8ECF4] pt-2
                  "
                >
                  <span className="text-[13px] font-bold text-[#20242D]">
                    Total
                  </span>
                  <span className="text-[15px] font-extrabold text-[#538CDB]">
                    {formatRupiah(order.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="
            flex flex-wrap gap-2 border-t border-[#E8ECF4] bg-white/95
            px-5 py-4 backdrop-blur-sm sm:px-6
          "
        >
          {order.status === 'WAITING_PAYMENT' && (
            <>
              <button
                type="button"
                onClick={onPay}
                disabled={busy}
                className="
                  flex h-10 flex-1 items-center justify-center gap-2
                  rounded-full bg-[#538CDB] px-4 text-[12px] font-semibold
                  text-white shadow-[0_6px_16px_rgba(83,140,219,0.25)]
                  transition-all duration-200 hover:bg-[#467BC7]
                  active:scale-[0.99] disabled:cursor-not-allowed
                  disabled:bg-[#A2A8B3] disabled:shadow-none
                "
              >
                {busy ? (
                  <Icon name="clock" size={14} className="animate-spin" />
                ) : (
                  <Icon name="card" size={14} />
                )}
                Bayar Sekarang
              </button>
              <button
                type="button"
                onClick={onCheckStatus}
                disabled={busy || checkingPayment}
                className="
                  flex h-10 flex-1 items-center justify-center gap-2
                  rounded-full border border-[#538CDB] bg-white px-4
                  text-[12px] font-semibold text-[#538CDB] transition-all
                  duration-200 hover:bg-[#538CDB] hover:text-white
                  active:scale-[0.99] disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {checkingPayment ? (
                  <Icon name="clock" size={14} className="animate-spin" />
                ) : (
                  <Icon name="clock" size={14} />
                )}
                {checkingPayment ? 'Ngecek...' : 'Cek Status'}
              </button>
              <button
                type="button"
                onClick={onCancel}
                disabled={busy}
                className="
                  flex h-10 flex-1 items-center justify-center gap-2
                  rounded-full border border-[#FF4646]/30 bg-white px-4
                  text-[12px] font-semibold text-[#C73535] transition-all
                  duration-200 hover:border-[#FF4646] hover:bg-[#FFF0F0]
                  active:scale-[0.99] disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                Batalkan
              </button>
            </>
          )}

          {order.status === 'PROCESSING' && order.payment?.method === 'COD' && (
            <>
              <div
                className="
                  flex h-10 flex-1 items-center justify-center gap-2
                  text-[12px] text-[#737A87]
                "
              >
                <Icon name="clock" size={14} />
                Menunggu dikirim penjual
              </div>
              <button
                type="button"
                onClick={onCancel}
                disabled={busy}
                className="
                  flex h-10 flex-1 items-center justify-center gap-2
                  rounded-full border border-[#FF4646]/30 bg-white px-4
                  text-[12px] font-semibold text-[#C73535] transition-all
                  duration-200 hover:border-[#FF4646] hover:bg-[#FFF0F0]
                  active:scale-[0.99] disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                Batalkan
              </button>
            </>
          )}

          {((order.status === 'PROCESSING' &&
            order.payment?.method !== 'COD') ||
            order.status === 'SHIPPED') && (
            <div
              className="
                flex h-10 w-full items-center justify-center gap-2
                text-[12px] text-[#737A87]
              "
            >
              <Icon name="clock" size={14} />
              Pesanan sedang diproses
            </div>
          )}

          {order.status === 'DELIVERED' && (
            <div className="w-full">
              <button
                type="button"
                onClick={onConfirmReceived}
                disabled={busy}
                className="
                  flex h-10 w-full items-center justify-center gap-2
                  rounded-full bg-[#22C55E] px-4 text-[12px] font-semibold
                  text-white shadow-[0_6px_16px_rgba(34,197,94,0.25)]
                  transition-all duration-200 hover:bg-[#16A34A]
                  active:scale-[0.99] disabled:cursor-not-allowed
                  disabled:bg-[#A2A8B3] disabled:shadow-none
                "
              >
                {busy ? (
                  <Icon name="clock" size={14} className="animate-spin" />
                ) : (
                  <Icon name="check" size={14} />
                )}
                Pesanan Diterima
              </button>
              <p className="mt-2 text-center text-[10px] text-[#A2A8B3]">
                Konfirmasi dulu barangnya sudah sampai, baru bisa kasih
                ulasan.
              </p>
            </div>
          )}

          {order.status === 'COMPLETED' && (
            <div
              className="
                flex h-10 w-full items-center justify-center gap-2
                text-[12px] font-semibold text-[#538CDB]
              "
            >
              <Icon name="check" size={14} />
              Pesanan selesai
            </div>
          )}

          {order.status === 'CANCELLED' && (
            <div
              className="
                flex h-10 w-full items-center justify-center gap-2
                text-[12px] font-semibold text-[#C73535]
              "
            >
              <Icon name="close" size={14} />
              Pesanan dibatalkan
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes order-modal-enter {
          0% { opacity: 0; transform: translateY(8px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .order-modal-enter {
          animation: order-modal-enter 0.22s cubic-bezier(0.22, 0.9, 0.35, 1) both;
        }
      `}</style>
    </div>
  );
};

export default OrderDetailModal;