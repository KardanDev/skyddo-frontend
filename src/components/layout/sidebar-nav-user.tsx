import { Link } from '@tanstack/react-router'
import {
  User,
  Settings,
  LogOut,
  Building2,
  ChevronsUpDown,
} from 'lucide-react'
import useDialogState from '@/hooks/use-dialog-state'
import { useProfile } from '@/hooks/api/use-profile'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { SignOutDialog } from '@/components/sign-out-dialog'
import { Skeleton } from '@/components/ui/skeleton'

export function SidebarNavUser() {
  const { isMobile } = useSidebar()
  const [open, setOpen] = useDialogState()
  const { data: profile, isLoading } = useProfile()

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

  if (!profile) {
    return null
  }

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size='lg'
                className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
              >
                <Avatar className='h-8 w-8 rounded-lg'>
                  <AvatarImage src={profile.profile_photo_url || undefined} alt={profile.name} />
                  <AvatarFallback className='rounded-lg bg-primary text-primary-foreground'>
                    {profile.initials}
                  </AvatarFallback>
                </Avatar>
                <div className='grid flex-1 text-start text-sm leading-tight'>
                  <span className='truncate font-semibold'>{profile.name}</span>
                  <span className='truncate text-xs text-muted-foreground'>{profile.email}</span>
                </div>
                <ChevronsUpDown className='ms-auto size-4' />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
              side={isMobile ? 'bottom' : 'right'}
              align='end'
              sideOffset={4}
            >
              <DropdownMenuLabel className='p-0 font-normal'>
                <div className='flex items-center gap-2 px-1 py-1.5 text-start text-sm'>
                  <Avatar className='h-8 w-8 rounded-lg'>
                    <AvatarImage src={profile.profile_photo_url || undefined} alt={profile.name} />
                    <AvatarFallback className='rounded-lg bg-primary text-primary-foreground'>
                      {profile.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className='grid flex-1 text-start text-sm leading-tight'>
                    <span className='truncate font-semibold'>{profile.name}</span>
                    {profile.position && (
                      <span className='truncate text-xs text-muted-foreground'>
                        {profile.position}
                      </span>
                    )}
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link to='/settings/profile'>
                    <User />
                    Profile Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to='/settings/company'>
                    <Building2 />
                    Company Settings
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setOpen(true)}>
                <LogOut />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <SignOutDialog open={!!open} onOpenChange={setOpen} />
    </>
  )
}
