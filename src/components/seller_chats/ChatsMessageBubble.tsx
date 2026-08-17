import React from 'react';

import Icon from '../ui/Icon';
import { ChatMessageBody } from '../ui/ChatMessageBody';
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
            ? 'rounded-br-sm bg-gradient-to-br from-[#5B93E0] to-[#3A66AC] text-white'
            : 'rounded-bl-sm border border-[#E8ECF4] bg-white text-[#20242D]'
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
        {mine && message.readAt && (
          <span className="inline-flex items-center gap-0.5">
            <span className="h-1 w-1 rounded-full bg-white/80" />
            <Icon name="check" size={10} className="text-white/90" />
            Dibaca
          </span>
        )}
      </div>
    </div>
  </div>
);

export default ChatsMessageBubble;