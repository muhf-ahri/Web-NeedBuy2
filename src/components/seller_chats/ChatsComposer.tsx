import React, { useState } from 'react';

import Icon from '../ui/Icon';
import {
  AttachPhotoButton,
  PendingPhoto,
} from '../ui/ChatMessageBody';

interface ChatsComposerProps {
  draft: string;
  onDraftChange: (v: string) => void;
  photoUrl: string | null;
  onPhotoChange: (url: string | null) => void;
  onSend: (e: React.FormEvent) => void;
  sending: boolean;
  disabled?: boolean;
  error: string | null;
  onError: (e: string | null) => void;
}

const ChatsComposer: React.FC<ChatsComposerProps> = ({
  draft,
  onDraftChange,
  onSend,
  sending,
  disabled,
  error,
  onError,
}) => {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  const handleSend = (e: React.FormEvent) => {
    onSend(e);
  };

  const canSend = (draft.trim() || photoUrl) && !sending && !disabled;

  return (
    <form
      onSubmit={handleSend}
      className="shrink-0 border-t border-[#F5F7FB] bg-white/95 p-3 backdrop-blur-sm sm:p-4"
    >
      {error && (
        <div
          className="
            mb-2 flex items-center gap-2 rounded-xl border
            border-[#FF4646]/20 bg-[#FFF0F0] px-3 py-2
          "
        >
          <Icon name="alert" size={12} className="shrink-0 text-[#FF4646]" />
          <p className="flex-1 text-[11px] font-medium text-[#C73535]">
            {error}
          </p>
          <button
            type="button"
            onClick={() => onError(null)}
            className="text-[#C73535] hover:text-[#20242D]"
            aria-label="Tutup"
          >
            <Icon name="close" size={12} />
          </button>
        </div>
      )}

      {photoUrl && (
        <div className="mb-2">
          <PendingPhoto url={photoUrl} onRemove={() => setPhotoUrl(null)} />
        </div>
      )}

      <div className="flex items-end gap-2">
        <AttachPhotoButton
          disabled={sending || disabled}
          onUploaded={setPhotoUrl}
          onError={onError}
        />

        <div
          className="
            relative flex-1 rounded-full border border-[#E8ECF4] bg-[#F5F7FB]
            transition-all duration-200 focus-within:border-[#538CDB]
            focus-within:bg-white
            focus-within:shadow-[0_4px_14px_rgba(83,140,219,0.10)]
          "
        >
          <textarea
            value={draft}
            onChange={(e) => onDraftChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (canSend) handleSend(e as any);
              }
            }}
            placeholder="Tulis pesan..."
            maxLength={2000}
            rows={1}
            disabled={sending || disabled}
            className="
              w-full resize-none bg-transparent px-4 py-2.5 text-[13px]
              text-[#20242D] outline-none placeholder:text-[#A2A8B3]
              disabled:cursor-not-allowed
            "
            style={{ minHeight: '40px', maxHeight: '120px' }}
          />
        </div>

        <button
          type="submit"
          disabled={!canSend}
          className="
            flex h-11 w-11 shrink-0 items-center justify-center rounded-full
            bg-gradient-to-br from-[#5B93E0] to-[#3A66AC] text-white
            shadow-[0_6px_16px_rgba(83,140,219,0.30)] transition-all
            duration-200 hover:shadow-[0_8px_20px_rgba(83,140,219,0.40)]
            active:scale-[0.95] disabled:cursor-not-allowed
            disabled:from-[#D8DEE9] disabled:to-[#A2A8B3] disabled:shadow-none
          "
          aria-label="Kirim pesan"
        >
          {sending ? (
            <Icon name="clock" size={16} className="animate-spin" />
          ) : (
            <Icon name="send" size={16} />
          )}
        </button>
      </div>

      <div className="mt-1 flex items-center justify-between px-2">
        <p className="text-[10px] text-[#A2A8B3]">
          Tekan <kbd className="rounded bg-[#F5F7FB] px-1 font-mono">Enter</kbd> untuk kirim · <kbd className="rounded bg-[#F5F7FB] px-1 font-mono">Shift+Enter</kbd> baris baru
        </p>
        <p className="text-[10px] tabular-nums text-[#A2A8B3]">
          {draft.length}/2000
        </p>
      </div>
    </form>
  );
};

export default ChatsComposer;