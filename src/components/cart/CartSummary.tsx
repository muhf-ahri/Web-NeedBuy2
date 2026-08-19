import React from 'react';

import Icon from '../ui/Icon';
import { formatRupiah } from '../../utils/currency';

interface CartSummaryProps {
  subtotal: number;
  selectedCount: number;
  budget: number | null;
  pct: number;
  budgetInput: string;
  onBudgetInputChange: (v: string) => void;
  onBudgetSave: () => void;
  onBudgetRemove: () => void;
  onCheckout: () => void;
  onContinue: () => void;
  busy: boolean;
}

const CartSummary: React.FC<CartSummaryProps> = ({
  subtotal,
  selectedCount,
  budget,
  pct,
  budgetInput,
  onBudgetInputChange,
  onBudgetSave,
  onBudgetRemove,
  onCheckout,
  onContinue,
  busy,
}) => (
  <div className="space-y-4">

    <div
      className="
        relative overflow-hidden rounded-[24px] bg-gradient-to-br
        from-[#538cbd] to-[#284a67] p-5 text-white
        shadow-[0_18px_50px_rgba(83,140,219,0.30)] sm:p-6
      "
    >

      <div className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full border border-white/15" />
      <div className="pointer-events-none absolute bottom-6 right-8 h-16 w-16 rounded-full border border-white/10" />
      <div className="pointer-events-none absolute right-[20%] top-[14%] h-1.5 w-1.5 rounded-full bg-[#FFD500]" />

      <div className="relative">
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">
          Subtotal {selectedCount} item terpilih
        </p>
        <p className="text-[26px] font-extrabold leading-none tabular-nums sm:text-[28px]">
          {formatRupiah(subtotal)}
        </p>

        {budget !== null && (
          <div className="mt-4">
            <div className="h-1.5 overflow-hidden rounded-full bg-white/20">
              <div
                className={`
                  h-full rounded-full transition-all duration-500
                  ${pct >= 100 ? 'bg-[#FFD500]' : 'bg-white'}
                `}
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="mt-1.5 text-[11px] text-white/70">
              {pct}% dari budget {formatRupiah(budget)}
            </p>
          </div>
        )}

        <div className="mt-4 flex items-center gap-2">
          <input
            type="number"
            inputMode="numeric"
            value={budgetInput}
            onChange={(e) => onBudgetInputChange(e.target.value)}
            placeholder={budget !== null ? formatRupiah(budget) : 'Atur budget keranjang'}
            className="
              min-w-0 flex-1 rounded-full border border-white/25 bg-white/10
              px-4 py-2 text-[12px] text-white outline-none transition
              placeholder:text-white/50 focus:border-white
              [appearance:textfield]
              [&::-webkit-inner-spin-button]:appearance-none
              [&::-webkit-outer-spin-button]:appearance-none
            "
          />
          <button
            type="button"
            onClick={onBudgetSave}
            disabled={busy || !budgetInput.trim()}
            className="
              shrink-0 rounded-full bg-white px-4 py-2 text-[12px] font-bold
              text-[#284a67] transition-colors hover:bg-[#f5f7fb]
              disabled:cursor-not-allowed disabled:opacity-50
            "
          >
            {budget !== null ? 'Ubah' : 'Simpan'}
          </button>
        </div>

        {budget !== null && (
          <button
            type="button"
            onClick={onBudgetRemove}
            disabled={busy}
            className="
              mt-2 text-[11px] text-white/70 transition-colors
              hover:text-white disabled:opacity-50
            "
          >
            Hapus budget
          </button>
        )}
      </div>
    </div>

    <button
      type="button"
      onClick={onCheckout}
      disabled={selectedCount === 0}
      className="
        flex w-full items-center justify-center gap-2 rounded-full
        bg-[#4077a6] px-6 py-3 font-semibold text-white
        shadow-[0_7px_18px_rgba(83,140,219,0.25)] transition-all
        duration-200 hover:bg-[#4077a6]
        hover:shadow-[0_9px_22px_rgba(83,140,219,0.30)] active:scale-[0.99]
        disabled:cursor-not-allowed disabled:bg-[#A2A8B3] disabled:shadow-none
      "
    >
      <Icon name="lock" size={16} />
      {selectedCount === 0
        ? 'Pilih itemnya dulu ya'
        : `Checkout ${selectedCount} item`}
    </button>

    <button
      type="button"
      onClick={onContinue}
      className="
        flex w-full items-center justify-center gap-2 rounded-full border
        border-[#e0e3e5] bg-white px-6 py-3 font-semibold text-[#101319]
        transition-all duration-200 hover:border-[#538cbd]
        hover:text-[#4077a6] active:scale-[0.99]
      "
    >
      Lanjut belanja
      <Icon name="arrowRight" size={16} />
    </button>
  </div>
);

export default CartSummary;