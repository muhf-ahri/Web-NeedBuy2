import { markReadWhere } from '../api/notifications';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Avatar from '../components/ui/Avatar';
import Icon from '../components/ui/Icon';
import { ChatMessageBody, AttachPhotoButton, PendingPhoto, previewOf } from '../components/ui/ChatMessageBody';
import { useAuth } from '../contexts/AuthContext';
import {
  getConversations,
  getMessages,
  sendMessage,
  startConversation,
  type ChatMessage,
  type Conversation,
} from '../api/messages';
import { getAccessToken } from '../api/auth';

const POLL_MS = 4000;

const storeFaceOf = (conversation: Conversation) =>
  conversation.seller.logoUrl ?? conversation.seller.user?.avatarUrl ?? null;

const timeLabel = (iso: string) =>
  new Date(iso).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

const MessagesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [params, setParams] = useSearchParams();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const isAuthed = !!getAccessToken();
  const sellerParam = params.get('seller');
  const active = conversations.find((c) => c.id === activeId) ?? null;

  const loadConversations = useCallback(async () => {
    const res = await getConversations();
    setConversations(res.data.data);
    return res.data.data;
  }, []);

  // Membuka halaman pesan berarti notifikasi chatnya sudah dilihat.
  useEffect(() => {
    markReadWhere((n) => n.type === 'CHAT');
  }, []);

  useEffect(() => {
    if (!isAuthed) return;
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const list = await loadConversations();
        if (cancelled) return;

        if (sellerParam) {
          const res = await startConversation(sellerParam);
          if (cancelled) return;
          setActiveId(res.data.data.id);
          await loadConversations();
          setParams({}, { replace: true });
        } else if (list.length > 0) {
          setActiveId((prev) => prev ?? list[0].id);
        }
      } catch (err: any) {
        if (!cancelled) setError(err.message ?? 'Gagal muat chat, coba lagi ya');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthed, sellerParam]);

  useEffect(() => {
    if (!activeId) return;
    let cancelled = false;
    setMessages([]);
    getMessages(activeId)
      .then((res) => {
        if (!cancelled) setMessages(res.data.data);
      })
      .catch((err: any) => {
        if (!cancelled) setError(err.message ?? 'Gagal muat pesan, coba lagi ya');
      });
    return () => {
      cancelled = true;
    };
  }, [activeId]);

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

    if ((!body && !photoUrl) || !activeId) return;
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
      setError(err.message ?? 'Pesannya gagal dikirim, coba lagi ya');
    } finally {
      setSending(false);
    }
  };

  if (!isAuthed) {
    return (
      <div className="min-h-screen flex flex-col bg-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <Navbar />
        <main className="flex-1 max-w-6xl mx-auto w-full px-5 sm:px-10 py-16 flex items-center justify-center">
          <div className="text-center">
            <Icon name="chat" size={44} className="text-[#c3c6d7] mx-auto mb-4" />
            <p className="text-[#737686] mb-4">Login dulu ya buat chat sama penjual.</p>
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2.5 rounded-full bg-[#4077a6] hover:bg-[#284a67] text-white text-[14px] font-semibold transition-colors"
            >
              Login
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-5 sm:px-10 py-8">
        <h1 className="text-[28px] font-bold text-[#101319] mb-6">Pesan</h1>

        {error && (
          <div className="bg-[#ffdad6] border border-[#ba1a1a]/20 rounded-2xl px-4 py-3 mb-4">
            <p className="text-[13px] text-[#93000a]">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="animate-pulse h-96 bg-[#f2f4f6] rounded-2xl" />
        ) : conversations.length === 0 ? (
          <div className="text-center py-20">
            <Icon name="chat" size={44} className="text-[#c3c6d7] mx-auto mb-4" />
            <p className="text-[#737686]">Belum ada chat nih.</p>
            <p className="text-[13px] text-[#737686] mt-1">
              Buka halaman produk, lalu tekan "Chat penjual" untuk memulai.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-[280px_1fr] gap-4 border border-[#e0e3e5] rounded-2xl overflow-hidden">

            <aside className={`md:border-r border-[#e0e3e5] ${active ? 'hidden md:block' : ''}`}>
              <ul className="divide-y divide-[#e0e3e5] max-h-[70vh] overflow-y-auto">
                {conversations.map((conversation) => (
                  <li key={conversation.id}>
                    <button
                      onClick={() => setActiveId(conversation.id)}
                      className={`w-full text-left px-4 py-3 transition-colors ${
                        conversation.id === activeId ? 'bg-[#e4ebf1]' : 'hover:bg-[#f2f4f6]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Avatar
                          src={storeFaceOf(conversation)}
                          name={conversation.seller.storeName}
                          className="h-9 w-9 text-[11px]"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[13px] font-semibold text-[#101319] truncate">
                              {conversation.seller.storeName}
                            </span>
                            {conversation.unreadCount > 0 && (
                              <span className="bg-[#4077a6] text-white text-[10px] font-bold rounded-full min-w-5 h-5 px-1.5 flex items-center justify-center">
                                {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
                              </span>
                            )}
                          </div>
                          <p className="text-[12px] text-[#737686] truncate mt-0.5">
                            {previewOf(conversation.lastMessage)}
                          </p>
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </aside>

            <section className="flex flex-col min-h-[60vh] max-h-[70vh]">
              {active && (
                <header className="flex items-center gap-2 px-4 py-3 border-b border-[#e0e3e5]">
                  <button
                    onClick={() => setActiveId(null)}
                    className="md:hidden p-1.5 rounded-full text-[#434655] hover:bg-[#f2f4f6] transition-colors"
                    aria-label="Kembali ke daftar percakapan"
                  >
                    <Icon name="chevronLeft" size={18} />
                  </button>
                  <Avatar
                    src={storeFaceOf(active)}
                    name={active.seller.storeName}
                    className="h-9 w-9 text-[11px]"
                  />
                  <div className="min-w-0">
                    <p className="text-[14px] font-bold text-[#101319] truncate">
                      {active.seller.storeName}
                    </p>
                    <p className="text-[11px] text-[#737686]">Penjual</p>
                  </div>
                </header>
              )}

              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2 bg-[#f5f7fb]">
                {messages.length === 0 ? (
                  <p className="text-center text-[13px] text-[#737686] py-10">
                    Mulai percakapan dengan menanyakan stok, warna, atau estimasi pengiriman.
                  </p>
                ) : (
                  messages.map((message) => {
                    const mine = message.senderId === user?.id;
                    return (
                      <div key={message.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-[75%] rounded-2xl px-3.5 py-2 ${
                            mine
                              ? 'bg-[#4077a6] text-white rounded-br-sm'
                              : 'bg-white border border-[#e0e3e5] text-[#101319] rounded-bl-sm'
                          }`}
                        >
                          <div className="text-[13px] leading-relaxed">
                            <ChatMessageBody message={message} mine={mine} />
                          </div>
                          <p
                            className={`text-[10px] mt-1 flex items-center justify-end gap-1 ${
                              mine ? 'text-white/70' : 'text-[#737686]'
                            }`}
                          >
                            {timeLabel(message.createdAt)}
                            {mine && message.readAt && <Icon name="check" size={11} />}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={bottomRef} />
              </div>

              <form onSubmit={handleSend} className="border-t border-[#e0e3e5] p-3">
                {photoUrl && <PendingPhoto url={photoUrl} onRemove={() => setPhotoUrl(null)} />}
                <div className="flex items-center gap-2">
                <AttachPhotoButton
                  disabled={sending}
                  onUploaded={setPhotoUrl}
                  onError={setError}
                />
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Tulis pesan..."
                  maxLength={2000}
                  disabled={!activeId}
                  className="flex-1 px-4 py-2.5 rounded-full border border-[#c3c6d7] outline-none focus:border-[#538cbd] focus:ring-2 focus:ring-[#538cbd]/20 text-[13px] transition disabled:bg-[#f2f4f6]"
                  aria-label="Tulis pesan"
                />
                <button
                  type="submit"
                  disabled={sending || (!draft.trim() && !photoUrl) || !activeId}
                  className="w-11 h-11 shrink-0 rounded-full bg-[#4077a6] hover:bg-[#284a67] text-white flex items-center justify-center transition-colors disabled:opacity-50"
                  aria-label="Kirim pesan"
                >
                  <Icon name="send" size={18} />
                </button>
              </div>
              </form>
            </section>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default MessagesPage;
