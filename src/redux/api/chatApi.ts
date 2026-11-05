import { baseApi } from './baseApi';

export interface ChatMessageItem {
  _id?: string;
  sender: 'user' | 'admin';
  senderName: string;
  text: string;
  seen: boolean;
  createdAt: string;
}

export interface SendMessagePayload {
  sessionId: string;
  text: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  userID?: string;
}

export interface ChatMessagesResponse {
  success: boolean;
  data: {
    conversationId: string | null;
    customerName?: string;
    messages: ChatMessageItem[];
    unreadByUser: number;
  };
}

export const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getChatMessages: builder.query<ChatMessagesResponse, string>({
      query: (sessionId) => ({
        url: `/chat/messages/${sessionId}`,
        method: 'GET',
      }),
      providesTags: ['Chat'],
    }),

    sendMessage: builder.mutation<{ success: boolean; data: any }, SendMessagePayload>({
      query: (body) => ({
        url: '/chat/send',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Chat'],
    }),

    syncChatUser: builder.mutation<
      { success: boolean; data: any },
      {
        sessionId: string;
        customerName?: string;
        customerPhone?: string;
        customerEmail?: string;
        userID?: string;
      }
    >({
      query: (body) => ({
        url: '/chat/sync-user',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Chat'],
    }),
  }),
});

export const { useGetChatMessagesQuery, useSendMessageMutation, useSyncChatUserMutation } = chatApi;
