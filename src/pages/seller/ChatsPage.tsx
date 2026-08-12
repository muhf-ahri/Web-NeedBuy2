// src/pages/seller/ChatsPage.tsx
import React, { useState } from 'react';
import SellerLayout from './SellerLayout';
import Icon from '../../components/ui/Icon';

const ChatsPage: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<string | null>('1');

  const chats = [
    { id: '1', customer: 'Emily Chen', lastMessage: 'Is this available in blue?', time: '10:30AM', unread: true, order: 'Order#57003001' },
    { id: '2', customer: 'Joapor Smith', lastMessage: 'Hi, I have a question about my order.', time: '10:30AM', unread: false },
    { id: '3', customer: 'Janmy Smith', lastMessage: 'Is this available in blue?', time: '10:30AM', unread: false },
    { id: '4', customer: 'Moren Smith', lastMessage: 'Yes, it is available. Check the product page.', time: '10:30AM', unread: false },
    { id: '5', customer: 'Marbin Smith', lastMessage: 'Is this available in blue?', time: '9:30PM', unread: false },
  ];

  const messages = [
    { sender: 'customer', text: 'Is this available in blue?', time: '10:30AM' },
    { sender: 'seller', text: 'Hello Emily, I can help with that!', time: '10:31AM' },
    { sender: 'customer', text: 'Is this available in blue?', time: '10:32AM' },
    { sender: 'seller', text: 'Yes, it is available. Check the product page.', time: '10:33AM' },
  ];

  return (
    <SellerLayout>
      <div className="space-y-6">
        <h1 className="text-[28px] font-bold text-[#191c1e]">Customer Chats</h1>

        <div className="bg-white rounded-2xl border border-[#e0e3e5] overflow-hidden flex flex-col md:flex-row h-[600px]">
          {/* Chat list */}
          <div className="w-full md:w-80 border-r border-[#e0e3e5] overflow-y-auto">
            <ul className="divide-y divide-[#e0e3e5]">
              {chats.map((chat) => (
                <li key={chat.id}>
                  <button
                    onClick={() => setSelectedChat(chat.id)}
                    className={`w-full text-left px-4 py-3 transition-colors ${
                      selectedChat === chat.id ? 'bg-[#dbe1ff]' : 'hover:bg-[#f2f4f6]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#191c1e]">{chat.customer}</span>
                      <span className="text-[11px] text-[#737686]">{chat.time}</span>
                    </div>
                    <p className="text-[12px] text-[#737686] truncate">{chat.lastMessage}</p>
                    {chat.order && <p className="text-[11px] text-[#004ac6] mt-0.5">{chat.order}</p>}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Chat area */}
          <div className="flex-1 flex flex-col">
            {selectedChat ? (
              <>
                <div className="border-b border-[#e0e3e5] px-4 py-3">
                  <p className="font-bold text-[#191c1e]">
                    {chats.find(c => c.id === selectedChat)?.customer}
                  </p>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f8f9fb]">
                  {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.sender === 'seller' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                        msg.sender === 'seller'
                          ? 'bg-[#004ac6] text-white rounded-br-sm'
                          : 'bg-white border border-[#e0e3e5] text-[#191c1e] rounded-bl-sm'
                      }`}>
                        <p className="text-[13px]">{msg.text}</p>
                        <p className={`text-[10px] mt-1 flex justify-end ${
                          msg.sender === 'seller' ? 'text-white/70' : 'text-[#737686]'
                        }`}>
                          {msg.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-[#e0e3e5] p-3 flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2.5 rounded-full border border-[#c3c6d7] text-sm outline-none focus:border-[#004ac6] focus:ring-2 focus:ring-[#004ac6]/20 transition"
                  />
                  <button className="w-11 h-11 rounded-full bg-[#004ac6] text-white flex items-center justify-center hover:bg-[#003ea8] transition-colors">
                    <Icon name="send" size={18} />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-[#737686]">Select a chat</div>
            )}
          </div>
        </div>
      </div>
    </SellerLayout>
  );
};

export default ChatsPage;