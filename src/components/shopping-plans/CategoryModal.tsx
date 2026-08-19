import React, { useState } from 'react';

import Icon from '../ui/Icon';
import Sheet from './Sheet';
import { formatRupiah } from '../../utils/currency';
import { createPlan, updatePlan } from '../../api/plans';

interface CategoryModalProps {
  initial?: { name: string; budget: string };
  planId?: string;
  onClose: () => void;
  onSaved: (planId: string) => void;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  initial,
  planId,
  onClose,
  onSaved,
}) => {
  const [name, setName] = useState(initial?.name ?? '');
  const [budget, setBudget] = useState(initial?.budget ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Nama kategorinya diisi dulu ya.');
      return;
    }
    const budgetNum = Number(budget) || 0;
    if (budgetNum < 0) {
      setError('Anggaran nggak boleh minus.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      if (planId) {
        await updatePlan(planId, { name: trimmed, budget: budgetNum });
        onSaved(planId);
      } else {
        const res = await createPlan({ name: trimmed, budget: budgetNum });
        onSaved(res.data.data.id);
      }
    } catch (err: any) {
      setError(err.message ?? 'Gagal simpan kategori, coba lagi ya');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Sheet
      title={planId ? 'Ubah Kategori' : 'Buat Kategori Belanja'}
      onClose={onClose}
    >
      <div className="space-y-4">
        {error && (
          <div
            className="
              flex items-center gap-2 rounded-2xl border border-[#ba1a1a]/20
              bg-[#FFF0F0] px-4 py-3
            "
          >
            <Icon name="alert" size={15} className="shrink-0 text-[#ba1a1a]" />
            <p className="text-[13px] font-medium text-[#ba1a1a]">{error}</p>
          </div>
        )}

        <div>
          <label
            htmlFor="cat-name"
            className="
              mb-1.5 block text-[10px] font-semibold uppercase
              tracking-[0.16em] text-[#737686]
            "
          >
            Nama Kategori
          </label>
          <input
            id="cat-name"
            autoFocus
            value={name}
            maxLength={60}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && save()}
            placeholder="Contoh: Kamar, Dapur, Setup WFH..."
            className="
              w-full rounded-xl border border-[#e0e3e5] bg-[#F5F7FB] px-4
              py-3 text-[13px] text-[#101319] outline-none
              placeholder:text-[#A2A8B3] transition-all duration-200
              focus:border-[#004ac6] focus:bg-white
              focus:shadow-[0_4px_16px_rgba(83,140,219,0.10)]
            "
          />
        </div>

        <div>
          <label
            htmlFor="cat-budget"
            className="
              mb-1.5 block text-[10px] font-semibold uppercase
              tracking-[0.16em] text-[#737686]
            "
          >
            Anggaran{' '}
            <span className="normal-case tracking-normal text-[#A2A8B3]">
              (opsional)
            </span>
          </label>
          <div className="relative">
            <span
              className="
                absolute left-4 top-1/2 -translate-y-1/2 text-[12px]
                font-semibold text-[#737686]
              "
            >
              Rp
            </span>
            <input
              id="cat-budget"
              type="number"
              min={0}
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="Kosongkan kalau nggak pakai anggaran"
              className="
                w-full rounded-xl border border-[#e0e3e5] bg-[#F5F7FB]
                py-3 pl-10 pr-4 text-[13px] text-[#101319] outline-none
                placeholder:text-[#A2A8B3] transition-all duration-200
                focus:border-[#004ac6] focus:bg-white
                focus:shadow-[0_4px_16px_rgba(83,140,219,0.10)]
                [appearance:textfield]
                [&::-webkit-inner-spin-button]:appearance-none
                [&::-webkit-outer-spin-button]:appearance-none
              "
            />
          </div>
          {budget && Number(budget) > 0 && (
            <p className="mt-1.5 text-[11px] text-[#737686]">
              Anggaran:{' '}
              <span className="font-semibold text-[#101319]">
                {formatRupiah(Number(budget))}
              </span>
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="
            flex h-11 w-full items-center justify-center gap-2
            rounded-full bg-[#004ac6] text-[14px] font-semibold text-white
            shadow-[0_7px_18px_rgba(83,140,219,0.25)] transition-all
            duration-200 hover:bg-[#004ac6]
            hover:shadow-[0_9px_22px_rgba(83,140,219,0.30)]
            active:scale-[0.99] disabled:cursor-not-allowed
            disabled:bg-[#A2A8B3] disabled:shadow-none
          "
        >
          {saving && <Icon name="clock" size={15} className="animate-spin" />}
          {planId ? 'Simpan Perubahan' : 'Buat Kategori'}
        </button>
      </div>
    </Sheet>
  );
};

export default CategoryModal;