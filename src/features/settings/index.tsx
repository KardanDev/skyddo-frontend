import { useMemo } from 'react'
import { Outlet } from '@tanstack/react-router'
import { User, Building2, Users, Palette } from 'lucide-react'
import { useProfile } from '@/hooks/api/use-profile'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { SidebarNav } from './components/sidebar-nav'

export function Settings() {
  const { data: profile, isLoading } = useProfile()

  // Conditionally include Company and Members settings only for admins and super users
  const sidebarNavItems = useMemo(() => {
    const items = [
      {
        title: 'Profile',
        href: '/settings/profile',
        icon: <User size={18} />,
      },
      {
        title: 'Appearance',
        href: '/settings/appearance',
        icon: <Palette size={18} />,
      },
    ]

    // Only show Company and Members settings to admins and super users
    if (profile?.role === 'admin' || profile?.role === 'super_user') {
      items.push(
        {
          title: 'Company',
          href: '/settings/company',
          icon: <Building2 size={18} />,
        },
        {
          title: 'Members',
          href: '/settings/members',
          icon: <Users size={18} />,
        }
      )
    }

    return items
  }, [profile?.role])

  return (
    <div className='space-y-6'>
      <div className='space-y-0.5'>
        <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>Settings</h1>
        <p className='text-muted-foreground'>
          {profile?.role === 'admin' || profile?.role === 'super_user'
            ? 'Manage your profile, appearance, company information, and team members.'
            : 'Manage your profile and appearance preferences.'}
        </p>
      </div>
      <Separator />
      {isLoading ? (
        <div className='flex gap-8'>
          <div className='space-y-2'>
            <Skeleton className='h-10 w-32' />
            <Skeleton className='h-10 w-32' />
          </div>
          <Skeleton className='h-96 flex-1' />
        </div>
      ) : (
        <div className='flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <aside className='lg:w-1/5'>
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className='flex-1'>
            <Outlet />
          </div>
        </div>
      )}
    </div>
  )
}
