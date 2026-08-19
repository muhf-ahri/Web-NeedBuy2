import React from 'react';

import { ReadReceipt, ChatMessageBody } from '../ui/ChatMessageBody';
import type { ChatMessage } from '../../api/messages';

interface ChatsMessageBubbleProps {
  message: ChatMessage;
  mine: boolean;
}

const timeLabel = (iso: string) =>
  new Date(iso).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });

const ChatsMessageBubble: React.FC<ChatsMessageBubbleProps> = ({
  message,
  mine,
}) => (
  <div className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
    <div
      className={`
        relative max-w-[85%] rounded-2xl px-3.5 py-2 shadow-sm sm:max-w-[70%]
        ${
          mine
            ? 'rounded-br-sm bg-gradient-to-br from-[#538cbd] to-[#284a67] text-white'
            : 'rounded-bl-sm border border-[#e0e3e5] bg-white text-[#101319]'
        }
      `}
    >
      <div className="text-[13px] leading-relaxed">
        <ChatMessageBody message={message} mine={mine} />
      </div>

      <div
        className={`
          mt-1 flex items-center justify-end gap-1 text-[9px]
          ${mine ? 'text-white/75' : 'text-[#A2A8B3]'}
        `}
      >
        <span>{timeLabel(message.createdAt)}</span>
        {mine && (
          <span className="inline-flex items-center gap-0.5">
            <span className="h-1 w-1 rounded-full bg-white/80" />
            <ReadReceipt readAt={message.readAt} size={10} className="text-white/90" />
            {message.readAt ? 'Dibaca' : 'Terkirim'}
          </span>
        )}
      </div>
    </div>
  </div>
);

export default ChatsMessageBubble;