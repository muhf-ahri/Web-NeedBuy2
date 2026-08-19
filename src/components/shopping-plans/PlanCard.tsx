import React from 'react';

import Icon from '../ui/Icon';
import { formatRupiah } from '../../utils/currency';
import type { ShoppingPlan } from '../../api/plans';

interface PlanCardProps {
  plan: Pick<
    ShoppingPlan,
    'id' | 'name' | 'budget' | 'total' | 'needId' | 'name'
  > & {
    _count?: { items: number };
  };
  onClick: () => void;
}

const planTitle = (plan: { name: string | null }) => plan.name ?? 'Tanpa Nama';

const PlanCard: React.FC<PlanCardProps> = ({ plan, onClick }) => {
  const budgetNum = parseFloat(plan.budget);
  const totalNum = parseFloat(plan.total);
  const pct =
    budgetNum > 0 ? Math.min(100, Math.round((totalNum / budgetNum) * 100)) : 0;
  const count = plan._count?.items ?? 0;
  const overBudget = budgetNum > 0 && totalNum > budgetNum;

  return (
    <button
      type="button"
      onClick={onClick}
      className="
        group relative w-full overflow-hidden rounded-[24px] border
        border-white/80 bg-white/95 p-5 text-left
        shadow-[0_8px_24px_rgba(32,36,45,0.06)] backdrop-blur-sm
        transition-all duration-300 hover:-translate-y-0.5
        hover:shadow-[0_14px_36px_rgba(32,36,45,0.10)]
        focus-visible:outline-2 focus-visible:outline-offset-2
        focus-visible:outline-[#4077a6]
      "
    >

      <span
        className="
          pointer-events-none absolute -right-10 -top-10 h-24 w-24
          rounded-full bg-[#538cbd]/10 opacity-0 blur-2xl
          transition-opacity duration-300 group-hover:opacity-100
        "
      />

      <span
        className="
          pointer-events-none absolute right-5 top-5 h-1.5 w-1.5
          rounded-full bg-[#FFD500]
        "
      />

      <div className="relative flex items-start gap-3">
        <span
          className="
            flex h-10 w-10 shrink-0 items-center justify-center
            rounded-xl bg-[#538cbd]/10
            transition-transform duration-300 group-hover:scale-105
          "
        >
          <Icon name="grid" size={18} className="text-[#4077a6]" />
        </span>

        <div className="min-w-0 flex-1">
          <h3
            className="
              truncate text-[15px] font-bold leading-tight text-[#101319]
              transition-colors duration-200 group-hover:text-[#4077a6]
            "
          >
            {planTitle(plan)}
          </h3>
          <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-[#737686]">
            <span className="font-semibold text-[#101319]">{count}</span>
            produk
            {plan.needId && (
              <>
                <span className="h-1 w-1 rounded-full bg-[#e0e3e5]" />
                <span className="truncate">dari Kebutuhan</span>
              </>
            )}
          </p>
        </div>
      </div>

      <p className="mt-4 text-[20px] font-extrabold tracking-tight text-[#4077a6]">
        {formatRupiah(totalNum)}
      </p>

      {budgetNum > 0 ? (
        <div className="mt-3">
          <div className="h-1.5 overflow-hidden rounded-full bg-[#F5F7FB]">
            <div
              className={`
                h-full rounded-full transition-all duration-500
                ${overBudget ? 'bg-[#ba1a1a]' : 'bg-[#4077a6]'}
              `}
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="mt-1.5 flex items-center justify-between text-[10px]">
            <span
              className={`
                font-semibold
                ${overBudget ? 'text-[#ba1a1a]' : 'text-[#4077a6]'}
              `}
            >
              {pct}% terpakai
            </span>
            <span className="text-[#A2A8B3]">
              Anggaran {formatRupiah(budgetNum)}
            </span>
          </div>
        </div>
      ) : (
        <p className="mt-3 text-[10px] italic text-[#A2A8B3]">
          Tanpa anggaran
        </p>
      )}

      <div className="mt-4 flex items-center justify-between border-t border-[#F5F7FB] pt-3">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#737686]">
          Buka detail
        </span>
        <Icon
          name="arrowRight"
          size={14}
          className="
            text-[#4077a6] transition-transform duration-300
            group-hover:translate-x-1
          "
        />
      </div>
    </button>
  );
};

export default PlanCard;