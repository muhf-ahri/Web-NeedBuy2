import React from 'react';
import Icon from './Icon';

export const StepCard: React.FC<{
  step: number;
  title: string;

  hint?: string;

  done?: boolean;
  action?: React.ReactNode;
  children: React.ReactNode;
}> = ({ step, title, hint, done = false, action, children }) => (
  <section className="overflow-hidden rounded-2xl border border-[#e0e3e5] bg-white">
    <header className="flex items-center gap-3 border-b border-[#e0e3e5] bg-[#f7f9ff] px-4 py-3 sm:px-5">
      <span
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] font-bold transition-colors ${
          done ? 'bg-[#004ac6] text-white' : 'bg-[#dbe1ff] text-[#004ac6]'
        }`}
        aria-hidden="true"
      >
        {done ? <Icon name="check" size={14} /> : step}
      </span>

      <div className="min-w-0 flex-1">
        <h2 className="text-[14px] font-bold leading-tight text-[#101319]">{title}</h2>
        {hint && <p className="truncate text-[12px] text-[#737686]">{hint}</p>}
      </div>

      {action}
    </header>

    <div className="p-4 sm:p-5">{children}</div>
  </section>
);

export const DataRow: React.FC<{ label: string; value?: string | null }> = ({ label, value }) => (
  <div className="min-w-0">
    <dt className="text-[11px] font-semibold uppercase tracking-wide text-[#737686]">{label}</dt>
    <dd className="mt-0.5 text-[13px] font-medium text-[#101319] break-words">
      {value?.trim() ? value : <span className="font-normal text-[#c3c6d7]">Belum diisi</span>}
    </dd>
  </div>
);

export const StepEmpty: React.FC<{ text: string; cta: string; onClick: () => void }> = ({
  text,
  cta,
  onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full rounded-xl border border-dashed border-[#c3c6d7] px-4 py-5 text-center transition-colors hover:border-[#004ac6] hover:bg-[#f7f9ff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#004ac6]"
  >
    <span className="block text-[13px] font-semibold text-[#101319]">{text}</span>
    <span className="mt-0.5 block text-[12px] font-semibold text-[#004ac6]">{cta} →</span>
  </button>
);

export const StepAction: React.FC<{ onClick: () => void; children: React.ReactNode }> = ({
  onClick,
  children,
}) => (
  <button
    type="button"
    onClick={onClick}
    className="shrink-0 rounded-full px-2.5 py-1 text-[12px] font-semibold text-[#004ac6] transition-colors hover:bg-[#dbe1ff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#004ac6]"
  >
    {children}
  </button>
);

export const ChoiceRow: React.FC<{
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ selected, disabled = false, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-pressed={selected}
    className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-55 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#004ac6] ${
      selected
        ? 'border-[#004ac6] bg-[#dbe1ff]/50'
        : 'border-[#e0e3e5] enabled:hover:border-[#004ac6] enabled:hover:bg-[#f7f9ff]'
    }`}
  >
    <span
      className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2"
      style={{ borderColor: selected ? '#004ac6' : '#c3c6d7' }}
      aria-hidden="true"
    >
      {selected && <span className="h-2 w-2 rounded-full bg-[#004ac6]" />}
    </span>
    <span className="min-w-0 flex-1">{children}</span>
  </button>
);

export default StepCard;
