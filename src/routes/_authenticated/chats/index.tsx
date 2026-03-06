import { createFileRoute } from '@tanstack/react-router'
import ChatbotPage from '@/features/chatbot'

export const Route = createFileRoute('/_authenticated/chats/')({
  component: ChatbotPage,
})
