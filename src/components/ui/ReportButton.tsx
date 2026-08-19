import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';
import Button from './Button';
import Icon from './Icon';
import { getAccessToken } from '../../api/auth';
import { createReport, type ReportTargetType } from '../../api/reports';

interface ReportButtonProps {
  targetType: ReportTargetType;
  targetId: string;
  
  targetLabel: string;
  className?: string;
  
  compact?: boolean;
}

const REASONS: Record<ReportTargetType, string[]> = {
  PRODUCT: [
    'Produk palsu atau tiruan',
    'Barang terlarang',
    'Deskripsi atau foto menyesatkan',
    'Harga tidak wajar / penipuan',
  ],
  SELLER: [
    'Penjual tidak mengirim barang',
    'Penjual kasar atau mengancam',
    'Toko diduga penipuan',
    'Jual barang terlarang',
  ],
  REVIEW: [
    'Ulasan mengandung kata kasar',
    'Ulasan palsu atau spam',
    'Ulasan berisi data pribadi',
    'Ulasan tidak berhubungan dengan produk',
  ],
};

const TARGET_WORD: Record<ReportTargetType, string> = {
  PRODUCT: 'Produk',
  SELLER: 'Toko',
  REVIEW: 'Ulasan',
};

const OTHER = 'Alasan lain';

const ReportButton: React.FC<ReportButtonProps> = ({
  targetType,
  targetId,
  targetLabel,
  className = '',
  compact = false,
}) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [description, setDescription] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const word = TARGET_WORD[targetType];

  const handleOpen = () => {
    if (!getAccessToken()) {
      navigate('/login');
      return;
    }
    setReason('');
    setCustomReason('');
    setDescription('');
    setError(null);
    setDone(false);
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;

    const finalReason = (reason === OTHER ? customReason : reason).trim();
    if (finalReason.length < 4) {
      setError('Pilih alasannya dulu, atau tulis minimal 4 karakter.');
      return;
    }

    setBusy(true);
    setError(null);
    try {
      await createReport({
        targetType,
        targetId,
        reason: finalReason,
        ...(description.trim() ? { description: description.trim() } : {}),
      });
      setDone(true);
    } catch (err: any) {
      setError(err?.message ?? 'Gagal ngirim laporan, coba lagi ya');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        aria-label={`Laporkan ${word.toLowerCase()} ini`}
        className={`inline-flex items-center gap-1.5 rounded-lg text-[12px] font-medium text-[#737686] transition-colors hover:text-[#ba1a1a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ba1a1a]/40 ${
          compact ? 'p-1.5' : 'px-2 py-1'
        } ${className}`}
      >
        <Icon name="alert" size={14} />
        {!compact && <span>Laporkan</span>}
      </button>

      <Modal isOpen={open} onClose={() => setOpen(false)} title={`Laporkan ${word}`}>
        {done ? (
          <div className="space-y-4 text-center">
            <Icon name="check" size={32} className="mx-auto text-[#12805c]" />
            <p className="text-[14px] text-[#101319]">Laporan kamu udah masuk.</p>
            <p className="text-[12px] text-[#737686]">
              Tim kami bakal ninjau dan nindaklanjuti kalau memang melanggar. Kamu nggak perlu
              ngirim laporan yang sama lagi.
            </p>
            <Button variant="primary" onClick={() => setOpen(false)} className="w-full py-2.5 text-sm">
              Tutup
            </Button>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <p className="rounded-lg bg-[#f2f4f6] px-3 py-2 text-[12px] text-[#434655]">
              {word} yang dilaporkan: <span className="font-semibold">{targetLabel}</span>
            </p>

            {error && (
              <div className="rounded-lg border border-[#ffdad6] bg-[#fff0f0] p-2.5 text-xs text-[#93000a]">
                {error}
              </div>
            )}

            <fieldset>
              <legend className="mb-2 text-[13px] font-medium text-[#434655]">
                Kenapa kamu ngelaporin ini?
              </legend>
              <div className="space-y-1.5">
                {[...REASONS[targetType], OTHER].map((item) => (
                  <label
                    key={item}
                    className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-[13px] text-[#101319] transition-colors hover:bg-[#f5f7fb]"
                  >
                    <input
                      type="radio"
                      name="report-reason"
                      value={item}
                      checked={reason === item}
                      onChange={() => setReason(item)}
                      className="h-4 w-4 accent-[#004ac6]"
                    />
                    {item}
                  </label>
                ))}
              </div>
            </fieldset>

            {reason === OTHER && (
              <input
                type="text"
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                maxLength={120}
                placeholder="Tulis alasanmu"
                aria-label="Alasan lain"
                className="w-full rounded-xl border border-[#c3c6d7] px-3 py-2.5 text-sm outline-none transition focus:border-[#004ac6] focus:ring-2 focus:ring-[#004ac6]/20"
                autoFocus
              />
            )}

            <div>
              <label
                htmlFor="report-description"
                className="mb-1 block text-[13px] font-medium text-[#434655]"
              >
                Ceritain detailnya <span className="text-[#737686]">(opsional)</span>
              </label>
              <textarea
                id="report-description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={1000}
                placeholder="Makin jelas ceritanya, makin cepat kami tindak."
                className="w-full resize-none rounded-xl border border-[#c3c6d7] px-3 py-2.5 text-sm outline-none transition focus:border-[#004ac6] focus:ring-2 focus:ring-[#004ac6]/20"
              />
            </div>

            <div className="flex gap-3">
              <Button type="submit" variant="primary" disabled={busy} className="flex-1 py-2.5 text-sm">
                {busy ? 'Ngirim…' : 'Kirim Laporan'}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={busy}
                onClick={() => setOpen(false)}
                className="px-6 py-2.5 text-sm"
              >
                Batal
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
};

export default ReportButton;
