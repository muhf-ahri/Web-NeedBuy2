import React, { useState } from 'react';

import Icon from '../ui/Icon';
import Sheet from './Sheet';
import { formatRupiah } from '../../utils/currency';
import { useSearchSuggestions } from '../../hooks/useSearchSuggestions';
import { addItemToPlan } from '../../api/plans';

interface AddProductModalProps {
  planId: string;
  onClose: () => void;
  onAdded: () => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({
  planId,
  onClose,
  onAdded,
}) => {
  const [term, setTerm] = useState('');
  const { products, loading } = useSearchSuggestions(term);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const add = async (productId: string) => {
    setBusyId(productId);
    setError(null);
    try {
      await addItemToPlan(planId, productId, 1);
      onAdded();
    } catch (err: any) {
      setError(err.message ?? 'Gagal tambah produk, coba lagi ya');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <Sheet title="Tambah Produk" onClose={onClose} maxWidth="max-w-xl">
      
      <div
        className="
          group relative flex items-center rounded-full border
          border-[#E8ECF4] bg-[#F5F7FB] transition-all duration-200
          focus-within:border-[#538CDB] focus-within:bg-white
          focus-within:shadow-[0_6px_20px_rgba(83,140,219,0.12)]
        "
      >
        <span
          className="
            flex h-10 w-10 shrink-0 items-center justify-center
            text-[#737A87] group-focus-within:text-[#538CDB]
          "
        >
          <Icon name="search" size={16} />
        </span>
        <input
          autoFocus
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Cari produk... (mis. kipas angin)"
          className="
            min-w-0 flex-1 bg-transparent py-2.5 pr-4 text-[13px]
            text-[#20242D] outline-none placeholder:text-[#A2A8B3]
          "
        />
      </div>

      {error && (
        <div
          className="
            mt-3 flex items-center gap-2 rounded-2xl border
            border-[#FF4646]/20 bg-[#FFF0F0] px-4 py-3
          "
        >
          <Icon name="alert" size={15} className="shrink-0 text-[#FF4646]" />
          <p className="text-[13px] font-medium text-[#C73535]">{error}</p>
        </div>
      )}

      <div className="mt-4 space-y-2">
        {term.trim().length < 2 ? (
          <div className="py-10 text-center">
            <div
              className="
                mx-auto flex h-12 w-12 items-center justify-center
                rounded-full bg-[#F5F7FB]
              "
            >
              <Icon name="search" size={18} className="text-[#A2A8B3]" />
            </div>
            <p className="mt-3 text-[13px] font-semibold text-[#20242D]">
              Ketik minimal 2 huruf
            </p>
            <p className="mt-1 text-[11px] text-[#737A87]">
              untuk mulai mencari produk.
            </p>
          </div>
        ) : loading ? (
          <>
            <div
              className="
                flex items-center gap-3 rounded-2xl bg-[#F5F7FB] p-3
                animate-pulse
              "
            >
              <div className="h-11 w-11 shrink-0 rounded-lg bg-[#E8ECF4]" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-3/4 rounded-full bg-[#E8ECF4]" />
                <div className="h-3 w-1/3 rounded-full bg-[#E8ECF4]" />
              </div>
            </div>
            <div
              className="
                flex items-center gap-3 rounded-2xl bg-[#F5F7FB] p-3
                animate-pulse
              "
            >
              <div className="h-11 w-11 shrink-0 rounded-lg bg-[#E8ECF4]" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-3/4 rounded-full bg-[#E8ECF4]" />
                <div className="h-3 w-1/3 rounded-full bg-[#E8ECF4]" />
              </div>
            </div>
          </>
        ) : products.length === 0 ? (
          <div className="py-10 text-center">
            <div
              className="
                mx-auto flex h-12 w-12 items-center justify-center
                rounded-full bg-[#F5F7FB]
              "
            >
              <Icon name="product" size={18} className="text-[#A2A8B3]" />
            </div>
            <p className="mt-3 text-[13px] font-semibold text-[#20242D]">
              Produknya nggak ketemu
            </p>
            <p className="mt-1 text-[11px] text-[#737A87]">
              Coba kata kunci lain, atau cek ejaannya.
            </p>
          </div>
        ) : (
          products.map((p) => {
            const image =
              p.images.find((img) => img.isPrimary)?.url ||
              p.images[0]?.url ||
              '';
            const isBusy = busyId === p.id;

            return (
              <div
                key={p.id}
                className="
                  flex items-center gap-3 rounded-2xl border
                  border-[#E8ECF4] bg-white p-3 transition-all
                  duration-200 hover:border-[#538CDB]/40
                  hover:shadow-[0_4px_14px_rgba(83,140,219,0.08)]
                "
              >
                <div
                  className="
                    h-12 w-12 shrink-0 overflow-hidden rounded-xl
                    bg-[#F5F7FB]
                  "
                >
                  {image ? (
                    <img
                      src={image}
                      alt={p.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.opacity = '0';
                      }}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Icon name="product" size={18} className="text-[#A2A8B3]" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold text-[#20242D]">
                    {p.name}
                  </p>
                  <p className="mt-0.5 text-[12px] font-bold text-[#538CDB]">
                    {formatRupiah(p.price)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => add(p.id)}
                  disabled={isBusy}
                  className="
                    shrink-0 rounded-full bg-[#538CDB] px-4 py-2 text-[11px]
                    font-semibold text-white
                    shadow-[0_4px_12px_rgba(83,140,219,0.25)]
                    transition-all duration-200 hover:bg-[#467BC7]
                    active:scale-[0.98] disabled:cursor-not-allowed
                    disabled:bg-[#A2A8B3] disabled:shadow-none
                  "
                >
                  {isBusy ? (
                    <Icon name="clock" size={12} className="animate-spin" />
                  ) : (
                    <Icon name="plus" size={12} />
                  )}
                </button>
              </div>
            );
          })
        )}
      </div>
    </Sheet>
  );
};

export default AddProductModal;