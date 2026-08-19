import React, { useEffect, useRef } from 'react';

import Avatar from '../ui/Avatar';
import Icon from '../ui/Icon';
import ChatsMessageBubble from './ChatsMessageBubble';
import ChatsComposer from './ChatsComposer';
import type { ChatMessage, Conversation } from '../../api/messages';

interface ChatsMessagesPanelProps {
  conversation: Conversation;
  messages: ChatMessage[];
  currentUserId?: string;
  draft: string;
  onDraftChange: (v: string) => void;
  photoUrl: string | null;
  onPhotoChange: (url: string | null) => void;
  onSend: (e: React.FormEvent) => void;
  sending: boolean;
  error: string | null;
  onError: (e: string | null) => void;
  onBack?: () => void;
  showBack?: boolean;
}

const ChatsMessagesPanel: React.FC<ChatsMessagesPanelProps> = ({
  conversation,
  messages,
  currentUserId,
  draft,
  onDraftChange,
  photoUrl,
  onPhotoChange,
  onSend,
  sending,
  error,
  onError,
  onBack,
  showBack,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end', behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex h-full flex-col bg-[#f5f7fb]">
      
      <div
        className="
          shrink-0 border-b border-[#F5F7FB] bg-white/95 px-3 py-3
          backdrop-blur-sm sm:px-4
        "
      >
        <div className="flex items-center gap-3">
          {showBack && onBack && (
            <button
              type="button"
              onClick={onBack}
              className="
                flex h-9 w-9 shrink-0 items-center justify-center
                rounded-full text-[#737686] transition-colors
                hover:bg-[#F5F7FB] hover:text-[#4077a6]
              "
              aria-label="Kembali ke daftar chat"
            >
              <Icon name="arrowLeft" size={18} />
            </button>
          )}

          <Avatar
            src={conversation.buyer.avatarUrl}
            name={conversation.buyer.name}
            className="h-10 w-10 text-[12px]"
          />

          <div className="min-w-0 flex-1">
            <p className="truncate text-[14px] font-bold text-[#101319]">
              {conversation.buyer.name}
            </p>
            <p className="flex items-center gap-1 text-[11px] text-[#12805c]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#12805c]" />
              Online
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto overscroll-contain px-3 py-4 sm:px-5">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <span
                className="
                  mx-auto flex h-14 w-14 items-center justify-center
                  rounded-full bg-white
                "
              >
                <Icon name="chat" size={22} className="text-[#A2A8B3]" />
              </span>
              <p className="mt-3 text-[13px] font-semibold text-[#101319]">
                Belum ada pesan
              </p>
              <p className="mt-1 text-[11px] text-[#737686]">
                Mulai percakapan dengan mengirim salam.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {messages.map((msg) => (
              <ChatsMessageBubble
                key={msg.id}
                message={msg}
                mine={msg.senderId === currentUserId}
              />
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <ChatsComposer
        draft={draft}
        onDraftChange={onDraftChange}
        photoUrl={photoUrl}
        onPhotoChange={onPhotoChange}
        onSend={onSend}
        sending={sending}
        error={error}
        onError={onError}
      />
    </div>
  );
};

export default ChatsMessagesPanel;