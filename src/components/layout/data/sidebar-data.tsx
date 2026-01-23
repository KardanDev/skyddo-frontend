// Sidebar Navigation Data
import {
  LayoutDashboard,
  Users,
  Building2,
  FileText,
  Shield,
  AlertCircle,
  Receipt,
  FileBox,
  MessageSquare,
  Bot,
  UserCog,
  Settings,
} from 'lucide-react'
import { type NavGroup, type SidebarData } from '../types'

const navGroups: NavGroup[] = [
  {
    title: 'Dashboard',
    items: [
      {
        title: 'Overview',
        url: '/',
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: 'Insurance',
    items: [
      {
        title: 'Clients',
        url: '/clients',
        icon: Users,
      },
      {
        title: 'Insurers',
        url: '/insurers',
        icon: Building2,
      },
      {
        title: 'Quotes',
        url: '/quotes',
        icon: FileText,
      },
      {
        title: 'Policies',
        url: '/policies',
        icon: Shield,
      },
      {
        title: 'Claims',
        url: '/claims',
        icon: AlertCircle,
      },
      {
        title: 'Invoices',
        url: '/invoices',
        icon: Receipt,
      },
    ],
  },
  {
    title: 'Support',
    items: [
      {
        title: 'Tickets',
        url: '/tickets',
        icon: MessageSquare,
      },
      {
        title: 'Documents',
        url: '/documents',
        icon: FileBox,
      },
    ],
  },
  {
    title: 'Configuration',
    items: [
      {
        title: 'Chatbot AI',
        url: '/chatbot',
        icon: Bot,
      },
      {
        title: 'Settings',
        url: '/settings',
        icon: Settings,
      },
    ],
  },
]

export const sidebarData: SidebarData = {
  user: {
    name: 'Admin User',
    email: 'admin@skyydo.com',
    avatar: '/avatars/default.png',
  },
  teams: [
    {
      name: 'Skyydo Insurance',
      logo: Shield,
      plan: 'Enterprise',
    },
  ],
  navGroups,
}
