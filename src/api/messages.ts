import apiClient from './client';
import type { ApiResponse } from '../types';

export interface ChatMessage {
  id: string;
  senderId: string;
  body: string;
  readAt: string | null;
  createdAt: string;
}

export interface Conversation {
  id: string;
  createdAt: string;
  lastMessageAt: string;
  buyer: { id: string; name: string };
  seller: { id: string; storeName: string; userId: string };
  lastMessage: ChatMessage | null;
  unreadCount: number;
}

export const getConversations = () =>
  apiClient.get<ApiResponse<Conversation[]>>('/messages/conversations');

export const startConversation = (sellerId: string) =>
  apiClient.post<ApiResponse<Conversation>>('/messages/conversations', { sellerId });

/** `after` = ISO timestamp pesan terakhir yang sudah dipegang client (polling). */
export const getMessages = (conversationId: string, after?: string) =>
  apiClient.get<ApiResponse<ChatMessage[]>>(`/messages/conversations/${conversationId}/messages`, {
    params: after ? { after } : undefined,
  });

export const sendMessage = (conversationId: string, body: string) =>
  apiClient.post<ApiResponse<ChatMessage>>(`/messages/conversations/${conversationId}/messages`, {
    body,
  });
