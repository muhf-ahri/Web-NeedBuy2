import React, { useState } from 'react';

import { formatRupiah } from '../../utils/currency';

interface NeedPayWithdrawProps {
  balance: string | number;
  onSubmit: (data: {
    amount: number;
    bankName: string;
    bankAccount: string;
    bankAccountName: string;
  }) => Promise<void>;
  busy: boolean;
  minWithdrawal: number;
  maxWithdrawal: number;
}

const NeedPayWithdraw: React.FC<NeedPayWithdrawProps> = ({
  balance,
  onSubmit,
  busy,
  minWithdrawal,
  maxWithdrawal,
}) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    amount: '',
    bankName: '',
    bankAccount: '',
    bankAccountName: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;

    await onSubmit({
      amount: Number(form.amount),
      bankName: form.bankName.trim(),
      bankAccount: form.bankAccount.trim(),
      bankAccountName: form.bankAccountName.trim(),
    });

    setForm({ amount: '', bankName: '', bankAccount: '', bankAccountName: '' });
    setOpen(false);
  };

  return (
    <section
      className="
        mt-6 overflow-hidden rounded-[24px] border border-white/80
        bg-white/95 p-6 shadow-[0_18px_50px_rgba(32,36,45,0.08)]
        backdrop-blur-sm
      "
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p
            className="
              mb-1 text-[10px] font-semibold uppercase tracking-[0.18em]
              text-[#004ac6]
            "
          >
            Cairkan ke rekening
          </p>
          <h2 className="text-[17px] font-bold text-[#101319]">Tarik Saldo</h2>
          <p className="mt-1 max-w-md text-[12px] leading-relaxed text-[#737686]">
            Cairkan saldo NeedPay ke rekening bank kamu. Admin yang bakal
            ninjau pengajuannya, biasanya 1 sampai 2 hari kerja.
          </p>
        </div>

        {!open && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="
              shrink-0 rounded-full border border-[#004ac6] bg-white px-4
              py-2 text-[12px] font-semibold text-[#004ac6] transition-all
              duration-200 hover:bg-[#004ac6] hover:text-white
            "
          >
            Ajukan
          </button>
        )}
      </div>

      {open && (
        <form
          className="mt-5 space-y-4 border-t border-[#e0e3e5] pt-5"
          onSubmit={handleSubmit}
        >
          <div>
            <label
              htmlFor="wd-amount"
              className="
                mb-1.5 block text-[11px] font-semibold uppercase
                tracking-[0.12em] text-[#737686]
              "
            >
              Nominal Penarikan
            </label>
            <div className="relative">
              <span
                className="
                  absolute left-4 top-1/2 -translate-y-1/2 text-[13px]
                  font-semibold text-[#737686]
                "
              >
                Rp
              </span>
              <input
                id="wd-amount"
                type="number"
                inputMode="numeric"
                min={minWithdrawal}
                max={maxWithdrawal}
                required
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                placeholder={`Min ${formatRupiah(minWithdrawal)}`}
                className="
                  w-full rounded-xl border border-[#e0e3e5] bg-[#F5F7FB]
                  py-3 pl-10 pr-4 text-[13px] text-[#101319] outline-none
                  transition-all duration-200 focus:border-[#004ac6]
                  focus:bg-white focus:shadow-[0_4px_16px_rgba(83,140,219,0.10)]
                "
              />
            </div>
            <p className="mt-1.5 text-[11px] text-[#A2A8B3]">
              Saldo tersedia{' '}
              <span className="font-semibold text-[#101319]">
                {formatRupiah(balance)}
              </span>
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="wd-bank"
                className="
                  mb-1.5 block text-[11px] font-semibold uppercase
                  tracking-[0.12em] text-[#737686]
                "
              >
                Nama Bank
              </label>
              <input
                id="wd-bank"
                type="text"
                required
                minLength={2}
                maxLength={60}
                value={form.bankName}
                onChange={(e) => setForm({ ...form, bankName: e.target.value })}
                placeholder="BCA"
                className="
                  w-full rounded-xl border border-[#e0e3e5] bg-[#F5F7FB]
                  px-4 py-3 text-[13px] text-[#101319] outline-none
                  transition-all duration-200 focus:border-[#004ac6]
                  focus:bg-white focus:shadow-[0_4px_16px_rgba(83,140,219,0.10)]
                "
              />
            </div>
            <div>
              <label
                htmlFor="wd-account"
                className="
                  mb-1.5 block text-[11px] font-semibold uppercase
                  tracking-[0.12em] text-[#737686]
                "
              >
                Nomor Rekening
              </label>
              <input
                id="wd-account"
                type="text"
                inputMode="numeric"
                required
                value={form.bankAccount}
                onChange={(e) =>
                  setForm({ ...form, bankAccount: e.target.value })
                }
                placeholder="1234567890"
                className="
                  w-full rounded-xl border border-[#e0e3e5] bg-[#F5F7FB]
                  px-4 py-3 text-[13px] text-[#101319] outline-none
                  transition-all duration-200 focus:border-[#004ac6]
                  focus:bg-white focus:shadow-[0_4px_16px_rgba(83,140,219,0.10)]
                "
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="wd-holder"
              className="
                mb-1.5 block text-[11px] font-semibold uppercase
                tracking-[0.12em] text-[#737686]
              "
            >
              Nama Pemilik Rekening
            </label>
            <input
              id="wd-holder"
              type="text"
              required
              minLength={2}
              maxLength={80}
              value={form.bankAccountName}
              onChange={(e) =>
                setForm({ ...form, bankAccountName: e.target.value })
              }
              placeholder="Sesuai buku tabungan"
              className="
                w-full rounded-xl border border-[#e0e3e5] bg-[#F5F7FB]
                px-4 py-3 text-[13px] text-[#101319] outline-none
                transition-all duration-200 focus:border-[#004ac6]
                focus:bg-white focus:shadow-[0_4px_16px_rgba(83,140,219,0.10)]
              "
            />
            <p className="mt-1.5 text-[11px] leading-relaxed text-[#A2A8B3]">
              Pastikan datanya bener. Saldo langsung dipotong pas kamu
              ngajuin, dan balik lagi kalau pengajuannya ditolak.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              disabled={busy}
              className="
                flex h-11 items-center justify-center rounded-full
                bg-[#004ac6] px-6 text-[13px] font-semibold text-white
                shadow-[0_7px_18px_rgba(83,140,219,0.25)] transition-all
                duration-200 hover:bg-[#004ac6]
                hover:shadow-[0_9px_22px_rgba(83,140,219,0.30)]
                active:scale-[0.99] disabled:cursor-not-allowed
                disabled:bg-[#A2A8B3] disabled:shadow-none
              "
            >
              {busy ? 'Ngirim…' : 'Ajukan Penarikan'}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => setOpen(false)}
              className="
                flex h-11 items-center justify-center rounded-full
                border border-[#e0e3e5] bg-white px-6 text-[13px]
                font-semibold text-[#101319] transition-all duration-200
                hover:border-[#004ac6] hover:text-[#004ac6]
                active:scale-[0.99] disabled:cursor-not-allowed
              "
            >
              Batal
            </button>
          </div>
        </form>
      )}
    </section>
  );
};

export default NeedPayWithdraw;