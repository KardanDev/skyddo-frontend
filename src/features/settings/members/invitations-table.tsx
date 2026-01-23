// Invitations Table Component
import { useState } from 'react'
import { MoreHorizontal, Mail, Trash2, Clock, Copy } from 'lucide-react'
import { useInvitations, useRevokeInvitation, type Invitation } from '@/hooks/api/use-invitations'
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
import { toast } from 'sonner'

export function InvitationsTable() {
  const { data: invitations, isLoading } = useInvitations()
  const revokeMutation = useRevokeInvitation()

  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false)
  const [invitationToRevoke, setInvitationToRevoke] = useState<Invitation | null>(null)

  const handleRevokeClick = (invitation: Invitation) => {
    setInvitationToRevoke(invitation)
    setRevokeDialogOpen(true)
  }

  const handleRevokeConfirm = () => {
    if (invitationToRevoke) {
      revokeMutation.mutate(invitationToRevoke.id, {
        onSuccess: () => {
          setRevokeDialogOpen(false)
          setInvitationToRevoke(null)
        },
      })
    }
  }

  const copyInvitationLink = (shortCode: string) => {
    // Use the API base URL for the short link
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
    const inviteUrl = `${apiBaseUrl.replace('/api', '')}/api/i/${shortCode}`
    navigator.clipboard.writeText(inviteUrl)
    toast.success('Invitation link copied to clipboard')
  }

  const getExpiryStatus = (expiresAt: string) => {
    const now = new Date()
    const expiry = new Date(expiresAt)
    const daysLeft = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    if (daysLeft < 0) {
      return { label: 'Expired', variant: 'destructive' as const }
    } else if (daysLeft === 0) {
      return { label: 'Expires today', variant: 'default' as const }
    } else if (daysLeft === 1) {
      return { label: '1 day left', variant: 'secondary' as const }
    } else {
      return { label: `${daysLeft} days left`, variant: 'secondary' as const }
    }
  }

  if (isLoading) {
    return (
      <div className='space-y-4'>
        {[...Array(3)].map((_, i) => (
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

  if (!invitations || invitations.length === 0) {
    return (
      <div className='flex min-h-[200px] items-center justify-center rounded-lg border border-dashed'>
        <div className='text-center'>
          <Mail className='mx-auto h-12 w-12 text-muted-foreground/50' />
          <p className='mt-4 text-sm text-muted-foreground'>
            No pending invitations
          </p>
          <p className='text-xs text-muted-foreground'>
            Invite new members to see them here
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
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Invited By</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead>Sent</TableHead>
              <TableHead className='w-[100px]'></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invitations.map((invitation) => {
              const expiryStatus = getExpiryStatus(invitation.expires_at)

              return (
                <TableRow key={invitation.id}>
                  <TableCell>
                    <div className='flex items-center gap-2'>
                      <Mail className='h-4 w-4 text-muted-foreground' />
                      <span className='font-medium'>{invitation.email}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge variant='outline' className='capitalize'>
                      {invitation.role.replace('_', ' ')}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <span className='text-sm text-muted-foreground'>
                      {invitation.inviter.name}
                    </span>
                  </TableCell>

                  <TableCell>
                    <Badge variant={expiryStatus.variant} className='gap-1'>
                      <Clock className='h-3 w-3' />
                      {expiryStatus.label}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <span className='text-sm text-muted-foreground'>
                      {new Date(invitation.created_at).toLocaleDateString()}
                    </span>
                  </TableCell>

                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='ghost' size='icon'>
                          <MoreHorizontal className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => copyInvitationLink(invitation.short_code)}
                        >
                          <Copy className='mr-2 h-4 w-4' />
                          Copy Link
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleRevokeClick(invitation)}
                          className='text-destructive focus:text-destructive'
                        >
                          <Trash2 className='mr-2 h-4 w-4' />
                          Revoke Invitation
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={revokeDialogOpen} onOpenChange={setRevokeDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke Invitation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to revoke the invitation to{' '}
              <strong>{invitationToRevoke?.email}</strong>? They will no longer be able
              to join using this invitation link.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRevokeConfirm}
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            >
              Revoke Invitation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
