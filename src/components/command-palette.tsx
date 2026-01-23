// Global Command Palette (Cmd+K)
import * as React from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  LayoutDashboard,
  Users,
  Building2,
  FileText,
  Shield,
  AlertCircle,
  Receipt,
  MessageSquare,
  FileBox,
  Bot,
  UserCog,
  Settings,
} from 'lucide-react'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'

const navigationItems = [
  {
    group: 'Navigation',
    items: [
      { title: 'Dashboard', url: '/', icon: LayoutDashboard },
      { title: 'Clients', url: '/clients', icon: Users },
      { title: 'Insurers', url: '/insurers', icon: Building2 },
      { title: 'Quotes', url: '/quotes', icon: FileText },
      { title: 'Policies', url: '/policies', icon: Shield },
      { title: 'Claims', url: '/claims', icon: AlertCircle },
      { title: 'Invoices', url: '/invoices', icon: Receipt },
      { title: 'Tickets', url: '/tickets', icon: MessageSquare },
      { title: 'Documents', url: '/documents', icon: FileBox },
    ],
  },
  {
    group: 'Configuration',
    items: [
      { title: 'Chatbot AI', url: '/chatbot', icon: Bot },
      { title: 'Members', url: '/members', icon: UserCog },
      { title: 'Settings', url: '/settings', icon: Settings },
    ],
  },
]

export function CommandPalette() {
  const [open, setOpen] = React.useState(false)
  const navigate = useNavigate()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const handleSelect = (url: string) => {
    setOpen(false)
    navigate({ to: url as any })
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder='Type a command or search...' />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {navigationItems.map((group) => (
          <CommandGroup key={group.group} heading={group.group}>
            {group.items.map((item) => {
              const Icon = item.icon
              return (
                <CommandItem
                  key={item.url}
                  onSelect={() => handleSelect(item.url)}
                >
                  <Icon className='mr-2 h-4 w-4' />
                  <span>{item.title}</span>
                </CommandItem>
              )
            })}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  )
}
