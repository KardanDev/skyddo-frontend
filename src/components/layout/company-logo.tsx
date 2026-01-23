import { Link } from '@tanstack/react-router'
import { Building2 } from 'lucide-react'
import { useCompanySettings } from '@/hooks/api/use-company-settings'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { Skeleton } from '@/components/ui/skeleton'

export function CompanyLogo() {
  const { setOpenMobile } = useSidebar()
  const { data: settings, isLoading } = useCompanySettings()

  if (isLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <div className='flex items-center gap-2 px-2 py-1.5'>
            <Skeleton className='h-8 w-8 rounded-lg' />
            <div className='flex flex-col gap-1'>
              <Skeleton className='h-4 w-32' />
              <Skeleton className='h-3 w-24' />
            </div>
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size='lg'
          className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
          asChild
        >
          <Link to='/' onClick={() => setOpenMobile(false)}>
            <div className='flex aspect-square h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground'>
              {settings?.logo_url || '/images/skyddo_logo.jpg' ? (
                <img
                  src={settings?.logo_url || '/images/skyddo_logo.jpg'}
                  alt={settings?.company_name || 'Skyddo'}
                  className='h-full w-full rounded-lg object-contain p-1'
                />
              ) : (
                <Building2 className='h-5 w-5' />
              )}
            </div>
            <div className='grid flex-1 text-start text-sm leading-tight'>
              <span className='truncate font-semibold'>
                {settings?.company_name || 'Skyddo'}
              </span>
              <span className='truncate text-xs text-muted-foreground'>
                Insurance Management
              </span>
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
