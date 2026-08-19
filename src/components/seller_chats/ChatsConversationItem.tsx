import React from 'react';

import Avatar from '../ui/Avatar';
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
              ? 'bg-gradient-to-r from-[#f5f7fb] to-[#f5f7fb]'
              : 'hover:bg-[#F5F7FB]'
          }
        `}
      >
        {active && (
          <span className="absolute left-0 top-1/2 h-8 w-0.5 -translate-y-1/2 rounded-r-full bg-[#4077a6]" />
        )}

        <div className="relative shrink-0">
          <Avatar
            src={conversation.buyer.avatarUrl}
            name={conversation.buyer.name}
            className="h-11 w-11 text-[12px]"
          />
          {conversation.unreadCount > 0 && (
            <span
              className="
                absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center
                justify-center rounded-full bg-[#ba1a1a] px-1 text-[9px]
                font-bold text-white ring-2 ring-white
              "
            >
              {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span
              className="
                truncate text-[13px] font-semibold text-[#101319]
                group-hover:text-[#4077a6]
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
                  ? 'font-semibold text-[#101319]'
                  : 'text-[#737686]'
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