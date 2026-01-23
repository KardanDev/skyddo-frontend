import { Link } from '@tanstack/react-router'
import {
  User,
  Settings,
  LogOut,
  Building2,
} from 'lucide-react'
import useDialogState from '@/hooks/use-dialog-state'
import { useProfile } from '@/hooks/api/use-profile'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SignOutDialog } from '@/components/sign-out-dialog'
import { Skeleton } from '@/components/ui/skeleton'

export function NavUser() {
  const [open, setOpen] = useDialogState()
  const { data: profile, isLoading } = useProfile()

  if (isLoading) {
    return <Skeleton className='h-10 w-10 rounded-full' />
  }

  if (!profile) {
    return null
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' size='icon' className='h-10 w-10 rounded-full'>
            <Avatar className='h-9 w-9'>
              <AvatarImage src={profile.profile_photo_url || undefined} alt={profile.name} />
              <AvatarFallback className='bg-primary text-primary-foreground'>
                {profile.initials}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-64' align='end' sideOffset={8}>
          <DropdownMenuLabel className='p-0 font-normal'>
            <div className='flex items-center gap-3 px-2 py-3'>
              <Avatar className='h-10 w-10'>
                <AvatarImage src={profile.profile_photo_url || undefined} alt={profile.name} />
                <AvatarFallback className='bg-primary text-primary-foreground'>
                  {profile.initials}
                </AvatarFallback>
              </Avatar>
              <div className='flex flex-col space-y-0.5'>
                <p className='text-sm font-medium leading-none'>{profile.name}</p>
                {profile.position && (
                  <p className='text-xs text-muted-foreground'>{profile.position}</p>
                )}
                <p className='text-xs text-muted-foreground'>{profile.email}</p>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link to='/settings/profile'>
                <User className='mr-2 h-4 w-4' />
                Profile Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to='/settings/company'>
                <Building2 className='mr-2 h-4 w-4' />
                Company Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to='/settings'>
                <Settings className='mr-2 h-4 w-4' />
                General Settings
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setOpen(true)} className='text-destructive'>
            <LogOut className='mr-2 h-4 w-4' />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <SignOutDialog open={!!open} onOpenChange={setOpen} />
    </>
  )
}
