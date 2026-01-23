// Chatbot Configuration Page
import { ChatbotSettingsForm } from './components/chatbot-settings-form'

export default function ChatbotPage() {
  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>Chatbot AI</h1>
        <p className='text-muted-foreground'>
          Configure your AI chatbot integration with N8N workflow
        </p>
      </div>

      <div className='grid gap-6'>
        <ChatbotSettingsForm />

        <div className='grid gap-4 md:grid-cols-2'>
          <div className='rounded-lg border p-6'>
            <h3 className='mb-2 font-semibold'>Setup Guide</h3>
            <ol className='list-inside list-decimal space-y-2 text-sm text-muted-foreground'>
              <li>Create an N8N workflow for chatbot interactions</li>
              <li>Add a webhook trigger node to receive requests</li>
              <li>Configure nodes to query your backend API</li>
              <li>Add AI/LLM nodes for natural language processing</li>
              <li>Copy the webhook URL and paste it above</li>
              <li>Generate an API key for authentication</li>
              <li>Test the connection to verify setup</li>
            </ol>
          </div>

          <div className='rounded-lg border p-6'>
            <h3 className='mb-2 font-semibold'>Features</h3>
            <ul className='space-y-2 text-sm text-muted-foreground'>
              <li>✓ Query client information</li>
              <li>✓ Check policy status</li>
              <li>✓ View claim details</li>
              <li>✓ Get quote information</li>
              <li>✓ Answer insurance FAQs</li>
              <li>✓ Multi-channel support (WhatsApp, Web)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
