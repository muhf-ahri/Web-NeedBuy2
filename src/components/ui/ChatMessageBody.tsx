import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from './Icon';
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_BYTES, uploadImage } from '../../api/uploads';
import type { ChatMessage } from '../../api/messages';

const API_ORIGIN = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '';

export const uploadSrc = (url: string): string => {
  try {
    const base = new URL(API_ORIGIN, window.location.origin);
    return new URL(url, base.origin).toString();
  } catch {
    return url;
  }
};

export const previewOf = (message: ChatMessage | null): string => {
  if (!message) return 'Belum ada pesan nih';
  if (message.body) return message.body;
  if (message.imageUrl) return 'Mengirim foto';
  if (message.orderId) return 'Mengirim detail pesanan';
  return 'Pesan kosong';
};

export const ChatMessageBody: React.FC<{ message: ChatMessage; mine: boolean }> = ({
  message,
  mine,
}) => {
  const navigate = useNavigate();

  return (
    <>

      {message.orderId && (
        <button
          type="button"
          onClick={() => navigate(`/orders/${message.orderId}/track`)}
          className={`mb-1.5 flex w-full items-center gap-2 rounded-xl border px-2.5 py-2 text-left transition-colors ${
            mine
              ? 'border-white/30 bg-white/15 hover:bg-white/25'
              : 'border-[#dbe1ff] bg-[#f5f7fb] hover:bg-[#dbe1ff]'
          }`}
        >
          <Icon name="orders" size={16} className={mine ? 'text-white' : 'text-[#004ac6]'} />
          <span className="min-w-0 flex-1">
            <span className={`block text-[11px] font-bold uppercase tracking-wide ${mine ? 'text-white/75' : 'text-[#737686]'}`}>
              Pesanan
            </span>
            <span className={`block text-[12px] font-semibold ${mine ? 'text-white' : 'text-[#004ac6]'}`}>
              Lihat & lacak paket
            </span>
          </span>
          <Icon name="chevronRight" size={14} className={mine ? 'text-white/75' : 'text-[#004ac6]'} />
        </button>
      )}

      {message.imageUrl && (
        <a
          href={uploadSrc(message.imageUrl)}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-1.5 block overflow-hidden rounded-xl"
        >
          <img
            src={uploadSrc(message.imageUrl)}
            alt="Foto yang dikirim"
            loading="lazy"
            className="max-h-64 w-full bg-black/10 object-cover"
          />
        </a>
      )}

      {message.body && <span className="whitespace-pre-wrap break-words">{message.body}</span>}
    </>
  );
};

export const AttachPhotoButton: React.FC<{
  disabled?: boolean;
  onUploaded: (url: string) => void;
  onError: (message: string) => void;
}> = ({ disabled = false, onUploaded, onError }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const pick = async (file: File) => {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      onError('Formatnya belum didukung. Pakai PNG, JPG, WEBP, atau GIF ya.');
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      onError(`Fotonya kegedean. Maksimal ${Math.round(MAX_IMAGE_BYTES / 1024 / 1024)} MB.`);
      return;
    }

    setBusy(true);
    try {
      const res = await uploadImage(file);
      onUploaded(res.data.data.url);
    } catch (err: any) {
      onError(err.message ?? 'Gagal unggah foto, coba lagi ya');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES.join(',')}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = '';
          if (file) pick(file);
        }}
      />
      <button
        type="button"
        disabled={disabled || busy}
        onClick={() => inputRef.current?.click()}
        aria-label="Lampirkan foto"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#c3c6d7] text-[#434655] transition-colors hover:border-[#004ac6] hover:text-[#004ac6] disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#004ac6]"
      >
        {busy ? <Icon name="clock" size={17} className="animate-spin" /> : <Icon name="upload" size={17} />}
      </button>
    </>
  );
};

export const PendingPhoto: React.FC<{ url: string; onRemove: () => void }> = ({ url, onRemove }) => (
  <div className="mb-2 flex items-center gap-2 rounded-xl border border-[#dbe1ff] bg-[#f5f7fb] p-2">
    <img src={uploadSrc(url)} alt="" className="h-12 w-12 rounded-lg object-cover" />
    <span className="flex-1 text-[12px] text-[#434655]">Foto siap dikirim</span>
    <button
      type="button"
      onClick={onRemove}
      className="rounded-full p-1 text-[#737686] transition-colors hover:text-[#ba1a1a]"
      aria-label="Batalkan foto"
    >
      <Icon name="close" size={16} />
    </button>
  </div>
);
