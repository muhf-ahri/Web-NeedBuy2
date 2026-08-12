import React, { useCallback, useEffect, useRef, useState } from 'react';
import SellerLayout from './SellerLayout';
import Icon from '../../components/ui/Icon';
import { useAuth } from '../../contexts/AuthContext';
import {
  getConversations,
  getMessages,
  sendMessage,
  type ChatMessage,
  type Conversation,
} from '../../api/messages';

const POLL_MS = 4000;

const timeLabel = (iso: string) =>
  new Date(iso).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

const ChatsPage: React.FC = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const active = conversations.find((c) => c.id === activeId) ?? null;

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
        if (!cancelled && list.length > 0) setActiveId((prev) => prev ?? list[0].id);
      } catch (err: any) {
        if (!cancelled) setError(err?.message ?? 'Gagal muat chat, coba lagi ya');
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
        if (!cancelled) setError(err?.message ?? 'Gagal muat pesan, coba lagi ya');
      });
    return () => {
      cancelled = true;
    };
  }, [activeId, loadConversations]);

  useEffect(() => {
    if (!activeId) return;
    const timer = setInterval(async () => {
      if (document.hidden) return;
      try {
        const after = messages[messages.length - 1]?.createdAt;
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
  }, [activeId, messages, loadConversations]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = draft.trim();
    if (!body || !activeId || sending) return;

    setSending(true);
    setError(null);
    try {
      const res = await sendMessage(activeId, body);
      setMessages((prev) => [...prev, res.data.data]);
      setDraft('');
      loadConversations().catch(() => {});
    } catch (err: any) {
      setError(err?.message ?? 'Pesannya gagal dikirim, coba lagi ya');
    } finally {
      setSending(false);
    }
  };

  return (
    <SellerLayout>
      <div className="space-y-6">
        <h1 className="text-[28px] font-bold text-[#191c1e]">Chat Pembeli</h1>
        {error && (
          <div className="p-3 bg-[#ffe0e0] border border-[#ffbcbc] text-[#a33131] text-[13px] rounded-xl">
            {error}
          </div>
        )}
        <div className="bg-white rounded-2xl border border-[#e0e3e5] overflow-hidden flex flex-col md:flex-row h-[600px]">
          <div className="w-full md:w-80 border-r border-[#e0e3e5] overflow-y-auto">
            {loading ? (
              <p className="px-4 py-6 text-[13px] text-[#737686]">Memuat percakapan…</p>
            ) : conversations.length === 0 ? (
              <p className="px-4 py-6 text-[13px] text-[#737686]">
                Belum ada pembeli yang mengirim pesan.
              </p>
            ) : (
              <ul className="divide-y divide-[#e0e3e5]">
                {conversations.map((chat) => (
                  <li key={chat.id}>
                    <button
                      onClick={() => setActiveId(chat.id)}
                      className={`w-full text-left px-4 py-3 transition-colors ${
                        activeId === chat.id ? 'bg-[#dbe1ff]' : 'hover:bg-[#f2f4f6]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-[#191c1e] truncate">
                          {chat.buyer.name}
                        </span>
                        <span className="text-[11px] text-[#737686] shrink-0">
                          {timeLabel(chat.lastMessageAt)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[12px] text-[#737686] truncate">
                          {chat.lastMessage?.body ?? 'Belum ada pesan nih'}
                        </p>
                        {chat.unreadCount > 0 && (
                          <span className="shrink-0 bg-[#ba1a1a] text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center">
                            {chat.unreadCount > 9 ? '9+' : chat.unreadCount}
                          </span>
                        )}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex-1 flex flex-col min-w-0">
            {active ? (
              <>
                <div className="border-b border-[#e0e3e5] px-4 py-3">
                  <p className="font-bold text-[#191c1e]">{active.buyer.name}</p>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f8f9fb]">
                  {messages.length === 0 ? (
                    <p className="text-center text-[13px] text-[#737686] py-6">
                      Belum ada pesan di percakapan ini.
                    </p>
                  ) : (
                    messages.map((msg) => {
                      const mine = msg.senderId === user?.id;
                      return (
                        <div
                          key={msg.id}
                          className={`flex ${mine ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                              mine
                                ? 'bg-[#004ac6] text-white rounded-br-sm'
                                : 'bg-white border border-[#e0e3e5] text-[#191c1e] rounded-bl-sm'
                            }`}
                          >
                            <p className="text-[13px] whitespace-pre-wrap break-words">
                              {msg.body}
                            </p>
                            <p
                              className={`text-[10px] mt-1 flex justify-end gap-1 ${
                                mine ? 'text-white/70' : 'text-[#737686]'
                              }`}
                            >
                              {timeLabel(msg.createdAt)}
                              {mine && msg.readAt && <span>· Dibaca</span>}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={bottomRef} />
                </div>

                <form onSubmit={handleSend} className="border-t border-[#e0e3e5] p-3 flex items-center gap-2">
                  <input
                    type="text"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    maxLength={2000}
                    placeholder="Tulis pesan..."
                    className="flex-1 px-4 py-2.5 rounded-full border border-[#c3c6d7] text-sm outline-none focus:border-[#004ac6] focus:ring-2 focus:ring-[#004ac6]/20 transition"
                  />
                  <button
                    type="submit"
                    disabled={sending || !draft.trim()}
                    className="w-11 h-11 shrink-0 rounded-full bg-[#004ac6] text-white flex items-center justify-center hover:bg-[#003ea8] disabled:opacity-50 transition-colors"
                    aria-label="Kirim pesan"
                  >
                    <Icon name="send" size={18} />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-[#737686] text-[13px]">
                {loading ? 'Memuat…' : 'Pilih chat dulu di sebelah kiri'}
              </div>
            )}
          </div>
        </div>
      </div>
    </SellerLayout>
  );
};

export default ChatsPage;