import React from 'react';

import Icon from '../ui/Icon';

interface ChatsHeaderProps {
  totalConversations: number;
  totalUnread: number;
  loading: boolean;
}

const ChatsHeader: React.FC<ChatsHeaderProps> = ({
  totalConversations,
  totalUnread,
  loading,
}) => (
  <div className="flex flex-wrap items-start justify-between gap-4">
    <div className="min-w-0">
      <div className="mb-2 flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#538CDB]/10 px-2.5 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-[#FFD500]" />
          <p className="text-[9px] font-bold uppercase tracking-[0.20em] text-[#538CDB]">
            Percakapan
          </p>
        </span>
        {totalUnread > 0 && (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#FF4646] px-2 py-0.5 text-[9px] font-bold text-white">
            <span className="h-1 w-1 animate-pulse rounded-full bg-white" />
            {totalUnread} baru
          </span>
        )}
      </div>
      <h1 className="text-[22px] font-extrabold leading-tight tracking-tight text-[#20242D] sm:text-[28px]">
        Chat Pembeli
      </h1>
      <p className="mt-1 max-w-xl text-[12px] leading-relaxed text-[#737A87] sm:text-[13px]">
        {loading ? (
          'Memuat percakapan...'
        ) : (
          <>
            <span className="font-bold text-[#20242D] tabular-nums">
              {totalConversations}
            </span>{' '}
            percakapan · balas cepat biar rating naik
          </>
        )}
      </p>
    </div>
  </div>
);

export default ChatsHeader;