import React from 'react';

// ✅ previewOf dari ChatMessageBody (helper UI), type dari api/messages
import { previewOf } from '../ui/ChatMessageBody';
import type { Conversation } from '../../api/messages';

interface ChatsConversationItemProps {
  conversation: Conversation;
  active: boolean;
  onClick: () => void;
}

const timeLabel = (iso: string) =>
  new Date(iso).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });

const ChatsConversationItem: React.FC<ChatsConversationItemProps> = ({
  conversation,
  active,
  onClick,
}) => {
  const initials = (conversation.buyer.name || 'U')
    .split(' ')
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className={`
          group relative flex w-full items-start gap-3 px-3.5 py-3 text-left
          transition-all duration-200
          ${
            active
              ? 'bg-gradient-to-r from-[#EEF5FF] to-[#F5F5FF]'
              : 'hover:bg-[#F5F7FB]'
          }
        `}
      >
        {/* Active indicator */}
        {active && (
          <span className="absolute left-0 top-1/2 h-8 w-0.5 -translate-y-1/2 rounded-r-full bg-[#538CDB]" />
        )}

        {/* Avatar */}
        <div className="relative shrink-0">
          <span
            className="
              flex h-11 w-11 items-center justify-center rounded-full
              bg-gradient-to-br from-[#5B93E0] to-[#3A66AC] text-[12px]
              font-extrabold text-white ring-2 ring-white
            "
          >
            {initials}
          </span>
          {conversation.unreadCount > 0 && (
            <span
              className="
                absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center
                justify-center rounded-full bg-[#FF4646] px-1 text-[9px]
                font-bold text-white ring-2 ring-white
              "
            >
              {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span
              className="
                truncate text-[13px] font-semibold text-[#20242D]
                group-hover:text-[#538CDB]
              "
            >
              {conversation.buyer.name}
            </span>
            <span className="shrink-0 text-[10px] text-[#A2A8B3]">
              {timeLabel(conversation.lastMessageAt)}
            </span>
          </div>

          <p
            className={`
              mt-0.5 truncate text-[11px]
              ${
                conversation.unreadCount > 0
                  ? 'font-semibold text-[#20242D]'
                  : 'text-[#737A87]'
              }
            `}
          >
            {previewOf(conversation.lastMessage)}
          </p>
        </div>
      </button>
    </li>
  );
};

export default ChatsConversationItem;