import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import SellerLayout from './SellerLayout';
import Reveal from '../../components/ui/Reveal';
import Icon from '../../components/ui/Icon'

import ChatsHeader from '../../components/seller_chats/ChatsHeader';
import ChatsConversationList from '../../components/seller_chats/ChatsConversationList';
import ChatsMessagesPanel from '../../components/seller_chats/ChatsMessagesPanel';
import ChatsEmptyState from '../../components/seller_chats/ChatsEmptyState';

import { useAuth } from '../../contexts/AuthContext';
import {
  getConversations,
  getMessages,
  sendMessage,
  type ChatMessage,
  type Conversation,
} from '../../api/messages';

const POLL_MS = 4000;

type MobileView = 'list' | 'chat';

const ChatsPage: React.FC = () => {
  const { user } = useAuth();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [mobileView, setMobileView] = useState<MobileView>('list');

  const active = conversations.find((c) => c.id === activeId) ?? null;

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const filteredConversations = useMemo(() => {
    if (!debouncedSearch) return conversations;
    const q = debouncedSearch.toLowerCase();
    return conversations.filter((c) => {
      const name = c.buyer.name?.toLowerCase() ?? '';
      const preview = c.lastMessage?.body?.toLowerCase() ?? '';
      return name.includes(q) || preview.includes(q);
    });
  }, [conversations, debouncedSearch]);

  const totalUnread = useMemo(
    () => conversations.reduce((sum, c) => sum + (c.unreadCount ?? 0), 0),
    [conversations]
  );

  const loadConversations = useCallback(async () => {
    const res = await getConversations();
    setConversations(res.data.data);
    return res.data.data;
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const list = await loadConversations();
        if (!cancelled && list.length > 0) {
          setActiveId((prev) => prev ?? list[0].id);
        }
      } catch (err: any) {
        if (!cancelled)
          setError(err?.message ?? 'Gagal muat chat, coba lagi ya');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [loadConversations]);

  useEffect(() => {
    if (!activeId) return;
    let cancelled = false;
    setMessages([]);
    getMessages(activeId)
      .then((res) => {
        if (cancelled) return;
        setMessages(res.data.data);
        loadConversations().catch(() => {});
      })
      .catch((err: any) => {
        if (!cancelled)
          setError(err?.message ?? 'Gagal muat pesan, coba lagi ya');
      });
    return () => {
      cancelled = true;
    };
  }, [activeId, loadConversations]);

  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  useEffect(() => {
    if (!activeId) return;
    const timer = setInterval(async () => {
      if (document.hidden) return;
      try {
        const last = messagesRef.current[messagesRef.current.length - 1];
        const after = last?.createdAt;
        const res = await getMessages(activeId, after);
        const fresh = res.data.data;
        if (fresh.length > 0) {
          setMessages((prev) => {
            const seen = new Set(prev.map((m) => m.id));
            return [...prev, ...fresh.filter((m) => !seen.has(m.id))];
          });
          loadConversations().catch(() => {});
        }
      } catch {}
    }, POLL_MS);
    return () => clearInterval(timer);
  }, [activeId, loadConversations]);

  const handleSelectConversation = (id: string) => {
    setActiveId(id);
    setMobileView('chat');
  };

  const handleBack = () => setMobileView('list');

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = draft.trim();
    if ((!body && !photoUrl) || !activeId || sending) return;

    setSending(true);
    setError(null);
    try {
      const res = await sendMessage(activeId, {
        ...(body ? { body } : {}),
        ...(photoUrl ? { imageUrl: photoUrl } : {}),
      });
      setMessages((prev) => [...prev, res.data.data]);
      setDraft('');
      setPhotoUrl(null);
      loadConversations().catch(() => {});
    } catch (err: any) {
      setError(err?.message ?? 'Pesannya gagal dikirim, coba lagi ya');
    } finally {
      setSending(false);
    }
  };

  if (error && conversations.length === 0 && !loading) {
    return (
      <SellerLayout>
        <div className="space-y-6">
          <Reveal direction="up">
            <ChatsHeader
              totalConversations={0}
              totalUnread={0}
              loading={false}
            />
          </Reveal>
          <Reveal direction="up">
            <ChatsEmptyState
              variant="error"
              errorMessage={error}
              onRetry={() => window.location.reload()}
            />
          </Reveal>
        </div>
      </SellerLayout>
    );
  }

  return (
    <SellerLayout>
      <div className="space-y-5 sm:space-y-6">
        <Reveal direction="up">
          <ChatsHeader
            totalConversations={conversations.length}
            totalUnread={totalUnread}
            loading={loading}
          />
        </Reveal>

        <Reveal direction="up" delay={80}>
          <div
            className="
              flex h-[70vh] min-h-[560px] overflow-hidden rounded-[24px]
              border border-white/80 bg-white/95 shadow-[0_18px_50px_rgba(32,36,45,0.08)]
              backdrop-blur-sm
            "
          >

            <div
              className={`
                w-full shrink-0 border-r border-[#F5F7FB] bg-white
                md:w-[340px] lg:w-[380px]
                ${mobileView === 'chat' ? 'hidden md:block' : 'block'}
              `}
            >
              <ChatsConversationList
                conversations={filteredConversations}
                activeId={activeId}
                search={search}
                onSearchChange={setSearch}
                onSelect={handleSelectConversation}
                loading={loading}
              />
            </div>

            <div
              className={`
                min-w-0 flex-1
                ${mobileView === 'list' ? 'hidden md:block' : 'block'}
              `}
            >
              {active ? (
                <ChatsMessagesPanel
                  conversation={active}
                  messages={messages}
                  currentUserId={user?.id}
                  draft={draft}
                  onDraftChange={setDraft}
                  photoUrl={photoUrl}
                  onPhotoChange={setPhotoUrl}
                  onSend={handleSend}
                  sending={sending}
                  error={error}
                  onError={setError}
                  onBack={handleBack}
                  showBack
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-[#f5f7fb]/50">
                  <div className="text-center">
                    <span
                      className="
                        mx-auto flex h-16 w-16 items-center justify-center
                        rounded-full bg-white
                      "
                    >
                      <Icon name="chat" size={26} className="text-[#A2A8B3]" />
                    </span>
                    <p className="mt-3 text-[14px] font-semibold text-[#101319]">
                      Pilih percakapan
                    </p>
                    <p className="mt-1 text-[12px] text-[#737686]">
                      Pilih chat dari daftar di kiri untuk mulai balas
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </SellerLayout>
  );
};

export default ChatsPage;