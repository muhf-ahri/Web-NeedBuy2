import React, { useState, useEffect } from 'react';

import Button from './Button';
import Icon from './Icon';
import { deleteInvent, type InventProduct } from '../../api/invent';
import { formatRupiah } from '../../utils/currency';

interface DeleteDialogProps {
  product: InventProduct;
  onClose: () => void;
  onDeleted: () => void;
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({
  product,
  onClose,
  onDeleted,
}) => {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* Lock body scroll + ESC to close */
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !busy) onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose, busy]);

  const confirm = async () => {
    setBusy(true);
    setError(null);
    try {
      await deleteInvent(product.id);
      onDeleted();
    } catch (err: any) {
      setError(err?.message ?? 'Gagal hapus produk, coba lagi ya');
    } finally {
      setBusy(false);
    }
  };

  const primaryImage =
    product.images?.find((img) => img.isPrimary)?.url ||
    product.images?.[0]?.url;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#20242D]/50 backdrop-blur-sm delete-dialog-backdrop"
        onClick={() => !busy && onClose()}
      />

      {/* Modal card */}
      <div
        className="
          delete-dialog-enter relative w-full max-w-md overflow-hidden
          rounded-t-[24px] border border-white/80 bg-white/98
          shadow-[0_18px_50px_rgba(32,36,45,0.25)] backdrop-blur-sm
          sm:rounded-[24px]
        "
      >
        {/* ── Header ── */}
        <div className="relative border-b border-[#E8ECF4] bg-white/95 px-5 py-4 backdrop-blur-sm">
          {/* Dekorasi */}
          <span
            className="
              pointer-events-none absolute -right-8 -top-8 h-20 w-20
              rounded-full border border-[#FF4646]/15
            "
          />
          <span
            className="
              pointer-events-none absolute right-12 top-5 h-1.5 w-1.5
              rounded-full bg-[#FFD500]
            "
          />

          <div className="relative flex items-start gap-3">
            {/* Icon warning gradient merah */}
            <span
              className="
                flex h-11 w-11 shrink-0 items-center justify-center
                rounded-2xl bg-gradient-to-br from-[#FF6B6B] to-[#D32F2F]
                shadow-[0_8px_20px_rgba(255,70,70,0.30)]
              "
            >
              <Icon name="alert" size={20} className="text-white" />
            </span>

            <div className="min-w-0 flex-1 pt-0.5">
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#FF4646]">
                Konfirmasi hapus
              </p>
              <h2 className="mt-0.5 text-[16px] font-bold leading-tight text-[#20242D] sm:text-[18px]">
                Yakin hapus produk ini?
              </h2>
            </div>

            <button
              type="button"
              onClick={() => !busy && onClose()}
              className="
                -mr-1 -mt-1 shrink-0 rounded-full p-1.5 text-[#737A87]
                transition-colors hover:bg-[#F5F7FB] hover:text-[#20242D]
                disabled:cursor-not-allowed disabled:opacity-50
              "
              aria-label="Tutup"
              disabled={busy}
            >
              <Icon name="close" size={18} />
            </button>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="space-y-4 px-5 py-5 sm:px-6">
          {/* Warning message */}
          <p className="text-[13px] leading-relaxed text-[#434655]">
            Produk ini akan dihapus <span className="font-bold text-[#20242D]">permanen</span> dari toko kamu. Tindakan ini tidak bisa dibatalkan.
          </p>

          {/* Preview produk */}
          <div
            className="
              flex items-center gap-3 rounded-2xl border border-[#E8ECF4]
              bg-[#F5F7FB] p-3
            "
          >
            {/* Thumbnail */}
            <div
              className="
                h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-white
                ring-1 ring-[#E8ECF4]
              "
            >
              {primaryImage ? (
                <img
                  src={primaryImage}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center">
                  <Icon name="product" size={20} className="text-[#A2A8B3]" />
                </span>
              )}
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold text-[#20242D]">
                {product.name}
              </p>
              <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-[#737A87]">
                <span className="font-bold text-[#538CDB] tabular-nums">
                  {formatRupiah(product.price)}
                </span>
                <span className="h-1 w-1 rounded-full bg-[#D8DEE9]" />
                <span>Stok {product.stock}</span>
              </div>
            </div>

            {/* Trash indicator */}
            <span
              className="
                flex h-8 w-8 shrink-0 items-center justify-center rounded-lg
                bg-[#FFF0F0] text-[#FF4646]
              "
            >
              <Icon name="trash" size={14} />
            </span>
          </div>

          {/* Error banner */}
          {error && (
            <div
              className="
                flex items-center gap-2.5 rounded-xl border
                border-[#FF4646]/20 bg-[#FFF0F0] px-3 py-2.5 backdrop-blur-sm
              "
            >
              <span
                className="
                  flex h-7 w-7 shrink-0 items-center justify-center
                  rounded-full bg-[#FF4646]/15
                "
              >
                <Icon name="alert" size={13} className="text-[#FF4646]" />
              </span>
              <p className="flex-1 text-[12px] font-medium text-[#C73535]">
                {error}
              </p>
            </div>
          )}

          {/* Info box tambahan */}
          <div
            className="
              flex items-start gap-2.5 rounded-xl bg-[#FFF7E0]/60 px-3 py-2.5
            "
          >
            <Icon
              name="alert"
              size={13}
              className="mt-0.5 shrink-0 text-[#B45309]"
            />
            <p className="text-[11px] leading-relaxed text-[#B45309]">
              Order yang sudah masuk tetap tercatat, tapi produk ini tidak akan
              muncul lagi di pencarian atau halaman toko.
            </p>
          </div>
        </div>

        {/* ── Footer ── */}
        <div
          className="
            flex flex-col-reverse gap-2 border-t border-[#E8ECF4] bg-white/95
            p-4 backdrop-blur-sm sm:flex-row sm:gap-3 sm:px-6
          "
        >
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={busy}
            className="flex-1 py-2.5 text-[13px] sm:flex-none sm:px-5"
          >
            Batal
          </Button>

          <button
            type="button"
            onClick={confirm}
            disabled={busy}
            className="
              flex flex-1 items-center justify-center gap-2 rounded-full
              bg-[#FF4646] px-5 py-2.5 text-[13px] font-semibold text-white
              shadow-[0_6px_16px_rgba(255,70,70,0.25)] transition-all
              duration-200 hover:bg-[#E03131]
              hover:shadow-[0_8px_20px_rgba(255,70,70,0.35)] active:scale-[0.99]
              disabled:cursor-not-allowed disabled:bg-[#A2A8B3]
              disabled:shadow-none sm:flex-none
            "
          >
            {busy ? (
              <>
                <Icon name="clock" size={14} className="animate-spin" />
                Menghapus…
              </>
            ) : (
              <>
                <Icon name="trash" size={14} className="text-white" />
                Ya, hapus aja
              </>
            )}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes delete-dialog-backdrop {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .delete-dialog-backdrop {
          animation: delete-dialog-backdrop 0.2s ease both;
        }

        @keyframes delete-dialog-enter {
          0% { opacity: 0; transform: translateY(12px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .delete-dialog-enter {
          animation: delete-dialog-enter 0.28s cubic-bezier(0.22, 0.9, 0.35, 1) both;
        }
      `}</style>
    </div>
  );
};

export default DeleteDialog;