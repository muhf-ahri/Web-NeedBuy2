import React from 'react';

import Icon from '../ui/Icon';
import { formatRupiah } from '../../utils/currency';
import type { Need, ClarificationItem } from '../../api/needs';

interface NeedsCreateFormProps {
  rawInput: string;
  onRawInputChange: (v: string) => void;
  onSubmit: () => void;
  onConfirm: (needId: string) => void;
  onProcess: (needId: string) => void;
  creating: boolean;
  busyType: string | null;
  parsed: {
    need: Need;
    needsClarification: boolean;
    clarificationQuestions: ClarificationItem[];
  } | null;
}

const NeedsCreateForm: React.FC<NeedsCreateFormProps> = ({
  rawInput,
  onRawInputChange,
  onSubmit,
  onConfirm,
  onProcess,
  creating,
  busyType,
  parsed,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div
      className="
        mb-6 overflow-hidden rounded-[24px] border border-white/80
        bg-white/95 p-5 shadow-[0_18px_50px_rgba(32,36,45,0.08)]
        backdrop-blur-sm sm:p-6
      "
    >
      {/* Header */}
      <div className="mb-4 flex items-center gap-2.5">
        <span
          className="
            flex h-9 w-9 shrink-0 items-center justify-center
            rounded-xl bg-gradient-to-br from-[#5B93E0] to-[#3A66AC]
            shadow-[0_4px_12px_rgba(83,140,219,0.25)]
          "
        >
          <Icon name="spark" size={16} className="text-white" />
        </span>
        <div className="min-w-0">
          <h3 className="text-[15px] font-bold text-[#20242D]">
            Ceritain Kebutuhanmu
          </h3>
          <p className="text-[11px] text-[#737A87]">
            AI akan menganalisis dan mencarikan produk yang pas.
          </p>
        </div>
      </div>

      {/* Contoh */}
      <div
        className="
          mb-4 flex items-start gap-2 rounded-xl bg-[#F5F7FB] px-3.5 py-2.5
        "
      >
        <Icon
          name="alert"
          size={13}
          className="mt-0.5 shrink-0 text-[#538CDB]"
        />
        <p className="text-[11px] leading-relaxed text-[#737A87]">
          <span className="font-semibold text-[#20242D]">Contoh:</span>{' '}
          "Saya butuh laptop untuk editing video budget 15 juta, ram minimal
          16GB."
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <textarea
          value={rawInput}
          onChange={(e) => onRawInputChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              onSubmit();
            }
          }}
          rows={3}
          placeholder="Ceritain kebutuhanmu... (tekan Enter buat dianalisis)"
          className="
            w-full resize-none rounded-xl border border-[#E8ECF4]
            bg-[#F5F7FB] px-4 py-3 text-[13px] text-[#20242D] outline-none
            placeholder:text-[#A2A8B3] transition-all duration-200
            focus:border-[#538CDB] focus:bg-white
            focus:shadow-[0_4px_16px_rgba(83,140,219,0.10)]
          "
        />

        <div className="mt-3 flex flex-wrap gap-2.5">
          <button
            type="submit"
            disabled={creating || !rawInput.trim()}
            className="
              flex h-10 items-center gap-2 rounded-full bg-[#538CDB] px-5
              text-[12px] font-semibold text-white
              shadow-[0_6px_16px_rgba(83,140,219,0.25)] transition-all
              duration-200 hover:bg-[#467BC7]
              hover:shadow-[0_8px_20px_rgba(83,140,219,0.30)]
              active:scale-[0.99] disabled:cursor-not-allowed
              disabled:bg-[#A2A8B3] disabled:shadow-none
            "
          >
            {creating && <Icon name="clock" size={14} className="animate-spin" />}
            <Icon name="spark" size={13} />
            Analisis Kebutuhan
          </button>
        </div>
      </form>

      {/* Hasil analisis */}
      {parsed && (
        <div
          className="
            mt-5 overflow-hidden rounded-2xl border border-[#E8ECF4]
            bg-[#F5F7FB]
          "
        >
          <div className="border-b border-[#E8ECF4] bg-white px-4 py-3">
            <div className="flex items-center gap-2">
              <span
                className="
                  flex h-6 w-6 items-center justify-center rounded-lg
                  bg-[#22C55E]/15
                "
              >
                <Icon name="check" size={13} className="text-[#22C55E]" />
              </span>
              <p className="text-[13px] font-bold text-[#20242D]">
                Hasil Analisis
              </p>
            </div>
          </div>

          <div className="space-y-2 px-4 py-3 text-[12px]">
            <div className="flex gap-2">
              <span className="shrink-0 font-semibold text-[#737A87]">
                Kebutuhan:
              </span>
              <span className="text-[#20242D]">
                {parsed.need.goal ?? '—'}
              </span>
            </div>
            <div className="flex gap-2">
              <span className="shrink-0 font-semibold text-[#737A87]">
                Budget:
              </span>
              <span className="text-[#20242D]">
                {parsed.need.budget
                  ? formatRupiah(parsed.need.budget)
                  : '—'}
              </span>
            </div>
            <div className="flex gap-2">
              <span className="shrink-0 font-semibold text-[#737A87]">
                Lokasi:
              </span>
              <span className="text-[#20242D]">
                {parsed.need.location ?? '—'}
              </span>
            </div>
          </div>

          {parsed.needsClarification && (
            <div
              className="
                mx-4 mb-4 flex items-start gap-2 rounded-xl border
                border-[#FFD500]/30 bg-[#FFF7E0] px-3.5 py-3
              "
            >
              <Icon
                name="alert"
                size={14}
                className="mt-0.5 shrink-0 text-[#B45309]"
              />
              <div className="min-w-0">
                <p className="text-[12px] font-semibold text-[#B45309]">
                  Informasi masih kurang
                </p>
                <ul className="mt-1 space-y-0.5">
                  {parsed.clarificationQuestions.map((q, i) => (
                    <li
                      key={i}
                      className="text-[11px] leading-relaxed text-[#B45309]"
                    >
                      • {q.question}
                      {q.context && (
                        <span className="text-[#B45309]/80"> ({q.context})</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Actions */}
          <div
            className="
              flex flex-wrap gap-2 border-t border-[#E8ECF4] bg-white
              px-4 py-3
            "
          >
            <button
              type="button"
              onClick={() => onConfirm(parsed.need.id)}
              disabled={busyType === 'confirm'}
              className="
                flex h-9 items-center gap-1.5 rounded-full bg-[#538CDB]
                px-4 text-[12px] font-semibold text-white
                shadow-[0_4px_12px_rgba(83,140,219,0.25)] transition-all
                duration-200 hover:bg-[#467BC7] active:scale-[0.99]
                disabled:cursor-not-allowed disabled:bg-[#A2A8B3]
                disabled:shadow-none
              "
            >
              {busyType === 'confirm' && (
                <Icon name="clock" size={12} className="animate-spin" />
              )}
              Konfirmasi & Cari
            </button>
            <button
              type="button"
              onClick={() => onProcess(parsed.need.id)}
              disabled={busyType === 'process'}
              className="
                flex h-9 items-center gap-1.5 rounded-full border
                border-[#538CDB] bg-white px-4 text-[12px] font-semibold
                text-[#538CDB] transition-all duration-200 hover:bg-[#538CDB]
                hover:text-white active:scale-[0.99]
                disabled:cursor-not-allowed disabled:opacity-50
              "
            >
              {busyType === 'process' && (
                <Icon name="clock" size={12} className="animate-spin" />
              )}
              Cari Sekarang
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NeedsCreateForm;