// Members Table Component
import { useState } from 'react'
import { MoreHorizontal, Pencil, Trash2, Shield, Crown, User as UserIcon } from 'lucide-react'
import { useUsers, useDeleteUser, type User } from '@/hooks/api/use-users'
import { useProfile } from '@/hooks/api/use-profile'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { EditMemberDialog } from './edit-member-dialog'

interface MembersTableProps {
  searchQuery: string
  roleFilter: string
}

const roleConfig = {
  super_user: {
    label: 'Super User',
    icon: Crown,
    variant: 'default' as const,
    color: 'text-yellow-600',
  },
  admin: {
    label: 'Admin',
    icon: Shield,
    variant: 'secondary' as const,
    color: 'text-blue-600',
  },
  member: {
    label: 'Member',
    icon: UserIcon,
    variant: 'outline' as const,
    color: 'text-gray-600',
  },
}

export function MembersTable({ searchQuery, roleFilter }: MembersTableProps) {
  const { data: profile } = useProfile()
  const { data: users, isLoading } = useUsers({
    search: searchQuery,
    role: roleFilter,
  })

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [userToEdit, setUserToEdit] = useState<User | null>(null)

  const deleteMutation = useDeleteUser()

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user)
    setDeleteDialogOpen(true)
  }

  const handleEditClick = (user: User) => {
    setUserToEdit(user)
    setEditDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (userToDelete) {
      deleteMutation.mutate(userToDelete.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false)
          setUserToDelete(null)
        },
      })
    }
  }

  const canManageUser = (user: User) => {
    // Super users can't be managed
    if (user.role === 'super_user') return false

    // Can't manage yourself
    if (user.id === profile?.id) return false

    // Only super users and admins can manage others
    if (profile?.role === 'super_user') return true
    if (profile?.role === 'admin' && user.role === 'member') return true

    return false
  }

  if (isLoading) {
    return (
      <div className='space-y-4'>
        {[...Array(5)].map((_, i) => (
          <div key={i} className='flex items-center gap-4'>
            <Skeleton className='h-12 w-12 rounded-full' />
            <div className='flex-1 space-y-2'>
              <Skeleton className='h-4 w-48' />
              <Skeleton className='h-3 w-32' />
            </div>
            <Skeleton className='h-8 w-24' />
          </div>
        ))}
      </div>
    )
  }

  if (!users || users.length === 0) {
    return (
      <div className='flex min-h-[200px] items-center justify-center rounded-lg border border-dashed'>
        <div className='text-center'>
          <UserIcon className='mx-auto h-12 w-12 text-muted-foreground/50' />
          <p className='mt-4 text-sm text-muted-foreground'>
            {searchQuery || roleFilter !== 'all'
              ? 'No members found matching your filters'
              : 'No team members yet'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className='rounded-lg border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className='w-[100px]'></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => {
              const roleInfo = roleConfig[user.role]
              const RoleIcon = roleInfo.icon

              return (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className='flex items-center gap-3'>
                      <Avatar>
                        <AvatarImage src={user.profile_photo_url || undefined} />
                        <AvatarFallback>{user.initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className='font-medium'>{user.name}</p>
                        <p className='text-sm text-muted-foreground'>{user.email}</p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge variant={roleInfo.variant} className='gap-1'>
                      <RoleIcon className={`h-3 w-3 ${roleInfo.color}`} />
                      {roleInfo.label}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <span className='text-sm text-muted-foreground'>
                      {user.position || '—'}
                    </span>
                  </TableCell>

                  <TableCell>
                    <span className='text-sm text-muted-foreground'>
                      {new Date(user.created_at).toLocaleDateString()}
                    </span>
                  </TableCell>

                  <TableCell>
                    {canManageUser(user) && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant='ghost' size='icon'>
                            <MoreHorizontal className='h-4 w-4' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleEditClick(user)}>
                            <Pencil className='mr-2 h-4 w-4' />
                            Edit Member
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteClick(user)}
                            className='text-destructive focus:text-destructive'
                          >
                            <Trash2 className='mr-2 h-4 w-4' />
                            Remove Member
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Team Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove <strong>{userToDelete?.name}</strong> from
              your team? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            >
              Remove Member
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <EditMemberDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        user={userToEdit}
      />
    </>
  )
}
