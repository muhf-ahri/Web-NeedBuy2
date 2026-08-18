import React from 'react';

import Icon from '../ui/Icon';
import ChatsSearch from './ChatsSearch';
import ChatsConversationItem from './ChatsConversationItem';
import type { Conversation } from '../../api/messages';

interface ChatsConversationListProps {
  conversations: Conversation[];
  activeId: string | null;
  search: string;
  onSearchChange: (v: string) => void;
  onSelect: (id: string) => void;
  loading: boolean;
}

const ChatsConversationList: React.FC<ChatsConversationListProps> = ({
  conversations,
  activeId,
  search,
  onSearchChange,
  onSelect,
  loading,
}) => (
  <div className="flex h-full flex-col">
    
    <div className="shrink-0 border-b border-[#F5F7FB] p-3">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#737A87]">
          Semua Chat
        </p>
        <span className="text-[10px] font-semibold text-[#A2A8B3] tabular-nums">
          {conversations.length}
        </span>
      </div>
      <ChatsSearch value={search} onChange={onSearchChange} />
    </div>

    <div className="flex-1 overflow-y-auto overscroll-contain">
      {loading ? (
        <div className="space-y-0 divide-y divide-[#F5F7FB]">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-3.5 py-3">
              <div className="h-11 w-11 shrink-0 animate-pulse rounded-full bg-[#F5F7FB]" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-2/3 animate-pulse rounded-full bg-[#F5F7FB]" />
                <div className="h-2.5 w-full animate-pulse rounded-full bg-[#F5F7FB]" />
              </div>
            </div>
          ))}
        </div>
      ) : conversations.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
          <span
            className="
              flex h-14 w-14 items-center justify-center rounded-full
              bg-[#F5F7FB]
            "
          >
            <Icon
              name={search ? 'search' : 'chat'}
              size={22}
              className="text-[#A2A8B3]"
            />
          </span>
          <p className="mt-3 text-[13px] font-semibold text-[#20242D]">
            {search ? 'Tidak ada hasil' : 'Belum ada chat'}
          </p>
          <p className="mt-1 text-[11px] text-[#737A87]">
            {search
              ? `Tidak ada chat dari "${search}"`
              : 'Pembeli yang chat kamu akan muncul di sini'}
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-[#F5F7FB]">
          {conversations.map((chat) => (
            <ChatsConversationItem
              key={chat.id}
              conversation={chat}
              active={activeId === chat.id}
              onClick={() => onSelect(chat.id)}
            />
          ))}
        </ul>
      )}
    </div>
  </div>
);

export default ChatsConversationList;