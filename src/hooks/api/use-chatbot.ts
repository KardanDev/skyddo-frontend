// Chatbot Hooks (REAL API Integration)
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import api from '@/lib/api/client'

interface ChatMessage {
  id: number
  session_id: string
  client_id: number | null
  sender: 'client' | 'bot'
  message: string
  metadata: Record<string, any> | null
  created_at: string
  updated_at: string
}

interface ChatResponse {
  message: string
  intent?: string
  action?: string
  data?: any
  requiresAuth?: boolean
  metadata?: Record<string, any>
}

interface StartSessionResponse {
  session_id: string
  message: string
}

interface SendMessageInput {
  session_id: string
  message: string
  client_id?: number | null
}

// Query key factory
const chatbotKeys = {
  all: ['chatbot'] as const,
  sessions: () => [...chatbotKeys.all, 'sessions'] as const,
  session: (sessionId: string) =>
    [...chatbotKeys.sessions(), sessionId] as const,
  history: (sessionId: string) =>
    [...chatbotKeys.session(sessionId), 'history'] as const,
}

// Start a new chat session
export function useStartChatSession() {
  return useMutation({
    mutationFn: async () => {
      const response = await api.post<StartSessionResponse>(
        '/api/chatbot/start-session'
      )
      return response.data
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || 'Failed to start chat session'
      toast.error(message)
    },
  })
}

// Send message to chatbot
export function useSendChatMessage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: SendMessageInput) => {
      const response = await api.post<ChatResponse>(
        '/api/chatbot/send-message',
        data
      )
      return response.data
    },
    onSuccess: (_, variables) => {
      // Invalidate chat history to refetch with new messages
      queryClient.invalidateQueries({
        queryKey: chatbotKeys.history(variables.session_id),
      })
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to send message'
      toast.error(message)
    },
  })
}

// Get chat history for a session
export function useChatHistory(sessionId: string | null) {
  return useQuery({
    queryKey: sessionId ? chatbotKeys.history(sessionId) : ['chatbot', 'empty'],
    queryFn: async () => {
      if (!sessionId) return { history: [] }

      const response = await api.get<{ history: ChatMessage[] }>(
        '/api/chatbot/history',
        {
          params: { session_id: sessionId },
        }
      )
      return response.data
    },
    enabled: !!sessionId,
    staleTime: 0, // Always fetch fresh data
  })
}
