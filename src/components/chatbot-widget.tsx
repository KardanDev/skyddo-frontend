// Chatbot Widget - Client-facing chat interface
import { useEffect, useRef, useState } from 'react'
import { MessageCircle, X, Send, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  useChatHistory,
  useSendChatMessage,
  useStartChatSession,
} from '@/hooks/api/use-chatbot'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'

interface Message {
  id: string
  sender: 'client' | 'bot'
  message: string
  timestamp: Date
}

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  const startSession = useStartChatSession()
  const sendMessage = useSendChatMessage()
  const { data: historyData } = useChatHistory(sessionId)

  // Load messages from history when available
  useEffect(() => {
    if (historyData?.history) {
      const historyMessages: Message[] = historyData.history.map(
        (msg: any) => ({
          id: msg.id.toString(),
          sender: msg.sender,
          message: msg.message,
          timestamp: new Date(msg.created_at),
        })
      )
      setMessages(historyMessages)
    }
  }, [historyData])

  // Start session when widget is opened for the first time
  useEffect(() => {
    if (isOpen && !sessionId) {
      startSession.mutate(undefined, {
        onSuccess: (data) => {
          setSessionId(data.session_id)
          setMessages([
            {
              id: 'welcome',
              sender: 'bot',
              message: data.message,
              timestamp: new Date(),
            },
          ])
        },
      })
    }
  }, [isOpen, sessionId])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !sessionId) return

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'client',
      message: inputMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage('')

    sendMessage.mutate(
      {
        session_id: sessionId,
        message: inputMessage,
        client_id: null, // TODO: Get from auth context if user is authenticated
      },
      {
        onSuccess: (data) => {
          const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            sender: 'bot',
            message: data.message,
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, botMessage])
        },
      }
    )
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isOpen) {
    return (
      <Button
        size='icon'
        className='fixed right-4 bottom-4 z-50 h-14 w-14 rounded-full shadow-lg'
        onClick={() => setIsOpen(true)}
      >
        <MessageCircle className='h-6 w-6' />
      </Button>
    )
  }

  return (
    <div className='fixed right-4 bottom-4 z-50 flex h-[600px] w-96 flex-col rounded-lg border bg-background shadow-xl'>
      {/* Header */}
      <div className='flex items-center justify-between rounded-t-lg border-b bg-primary p-4 text-primary-foreground'>
        <div className='flex items-center gap-2'>
          <MessageCircle className='h-5 w-5' />
          <div>
            <h3 className='font-semibold'>Skyydo Assistant</h3>
            <p className='text-xs opacity-90'>Always here to help</p>
          </div>
        </div>
        <Button
          size='icon'
          variant='ghost'
          className='hover:bg-primary-foreground/10'
          onClick={() => setIsOpen(false)}
        >
          <X className='h-5 w-5' />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className='flex-1 p-4' ref={scrollRef}>
        <div className='space-y-4'>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                'flex',
                msg.sender === 'client' ? 'justify-end' : 'justify-start'
              )}
            >
              <div
                className={cn(
                  'max-w-[80%] rounded-lg px-4 py-2 whitespace-pre-wrap',
                  msg.sender === 'client'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                )}
              >
                <p className='text-sm'>{msg.message}</p>
                <p className='mt-1 text-xs opacity-60'>
                  {msg.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))}
          {sendMessage.isPending && (
            <div className='flex justify-start'>
              <div className='rounded-lg bg-muted px-4 py-2'>
                <Loader2 className='h-4 w-4 animate-spin' />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className='border-t p-4'>
        <div className='flex gap-2'>
          <Input
            placeholder='Type your message...'
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={!sessionId || sendMessage.isPending}
          />
          <Button
            size='icon'
            onClick={handleSendMessage}
            disabled={
              !inputMessage.trim() || !sessionId || sendMessage.isPending
            }
          >
            <Send className='h-4 w-4' />
          </Button>
        </div>
        <p className='mt-2 text-center text-xs text-muted-foreground'>
          Powered by Skyydo Insurance
        </p>
      </div>
    </div>
  )
}
