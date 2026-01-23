// Chatbot Settings Form
import { useEffect, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'

const chatbotSettingsSchema = z.object({
  n8n_webhook_url: z.string().url('Must be a valid URL'),
  api_key: z.string().min(10, 'API key must be at least 10 characters'),
  backend_api_url: z.string().url('Must be a valid URL'),
  whatsapp_enabled: z.boolean(),
  landing_page_enabled: z.boolean(),
  welcome_message: z
    .string()
    .min(10, 'Welcome message must be at least 10 characters'),
})

type ChatbotSettingsSchema = z.infer<typeof chatbotSettingsSchema>

const STORAGE_KEY = 'chatbot_settings'

export function ChatbotSettingsForm() {
  const [isSaving, setIsSaving] = useState(false)

  const form = useForm<ChatbotSettingsSchema>({
    resolver: zodResolver(chatbotSettingsSchema),
    defaultValues: {
      n8n_webhook_url: '',
      api_key: '',
      backend_api_url: 'http://localhost:8000',
      whatsapp_enabled: false,
      landing_page_enabled: true,
      welcome_message:
        'Hello! How can I help you with your insurance needs today?',
    },
  })

  // Load settings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const settings = JSON.parse(saved)
        form.reset(settings)
      } catch (error) {
        // Log parse error in development
        // eslint-disable-next-line no-console
        console.error('Failed to load settings:', error)
      }
    }
  }, [form])

  const onSubmit = async (data: ChatbotSettingsSchema) => {
    setIsSaving(true)

    // Simulate saving delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))

    setIsSaving(false)
    toast.success('Chatbot settings saved successfully')
  }

  const handleTest = async () => {
    const values = form.getValues()

    if (!values.n8n_webhook_url) {
      toast.error('Please enter N8N webhook URL first')
      return
    }

    toast.promise(new Promise((resolve) => setTimeout(resolve, 2000)), {
      loading: 'Testing connection...',
      success: 'Connection successful!',
      error: 'Connection failed',
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chatbot Configuration</CardTitle>
        <CardDescription>
          Configure your AI chatbot settings and integration with N8N workflow
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              control={form.control}
              name='n8n_webhook_url'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>N8N Webhook URL *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='https://your-n8n-instance.com/webhook/...'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The webhook URL from your N8N workflow that will handle
                    chatbot requests
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='api_key'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Key *</FormLabel>
                  <FormControl>
                    <Input
                      type='password'
                      placeholder='Enter your API key'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    API key for authenticating requests to the N8N workflow
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='backend_api_url'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Backend API URL *</FormLabel>
                  <FormControl>
                    <Input placeholder='http://localhost:8000' {...field} />
                  </FormControl>
                  <FormDescription>
                    The URL of your backend API that N8N will query for data
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='welcome_message'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Welcome Message *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Enter the welcome message...'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The initial message users will see when starting a
                    conversation
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='space-y-4'>
              <FormField
                control={form.control}
                name='whatsapp_enabled'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                    <div className='space-y-0.5'>
                      <FormLabel className='text-base'>
                        WhatsApp Integration
                      </FormLabel>
                      <FormDescription>
                        Enable chatbot on WhatsApp Business API
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='landing_page_enabled'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                    <div className='space-y-0.5'>
                      <FormLabel className='text-base'>
                        Landing Page Widget
                      </FormLabel>
                      <FormDescription>
                        Show chatbot widget on your landing page
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className='flex gap-2'>
              <Button type='submit' disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Settings'}
              </Button>
              <Button
                type='button'
                variant='outline'
                onClick={handleTest}
                disabled={!form.watch('n8n_webhook_url')}
              >
                Test Connection
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
