// Members Management Settings Page
import { useState } from 'react'
import { Plus, UserPlus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MembersTable } from './members-table'
import { InvitationsTable } from './invitations-table'
import { InviteMemberDialog } from './invite-member-dialog'
import { ContentSection } from '../components/content-section'

export function MembersSettings() {
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')

  return (
    <ContentSection
      title='Team Members'
      desc='Manage your team members, roles, and invitations.'
    >
      <Tabs defaultValue='members' className='space-y-6'>
        <div className='flex items-center justify-between'>
          <TabsList>
            <TabsTrigger value='members'>Members</TabsTrigger>
            <TabsTrigger value='invitations'>Pending Invitations</TabsTrigger>
          </TabsList>

          <Button onClick={() => setInviteDialogOpen(true)}>
            <UserPlus className='mr-2 h-4 w-4' />
            Invite Member
          </Button>
        </div>

        <TabsContent value='members' className='space-y-4'>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-center'>
            <div className='relative flex-1'>
              <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
              <Input
                placeholder='Search by name or email...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='pl-10'
              />
            </div>

            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className='w-full sm:w-48'>
                <SelectValue placeholder='Filter by role' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Roles</SelectItem>
                <SelectItem value='super_user'>Super User</SelectItem>
                <SelectItem value='admin'>Admin</SelectItem>
                <SelectItem value='member'>Member</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <MembersTable searchQuery={searchQuery} roleFilter={roleFilter} />
        </TabsContent>

        <TabsContent value='invitations' className='space-y-4'>
          <InvitationsTable />
        </TabsContent>
      </Tabs>

      <InviteMemberDialog
        open={inviteDialogOpen}
        onOpenChange={setInviteDialogOpen}
      />
    </ContentSection>
  )
}
