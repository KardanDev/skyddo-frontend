// Recent Claims Widget
import { Link } from '@tanstack/react-router'
import { useClaims } from '@/hooks/api/use-claims'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export function RecentClaimsWidget() {
  const { data: claims, isLoading } = useClaims()

  const recentClaims =
    claims
      ?.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      .slice(0, 5) || []

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-500/10 text-blue-500'
      case 'under_review':
        return 'bg-yellow-500/10 text-yellow-500'
      case 'approved':
        return 'bg-green-500/10 text-green-500'
      case 'rejected':
        return 'bg-red-500/10 text-red-500'
      default:
        return 'bg-gray-500/10 text-gray-500'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Claims</CardTitle>
        <CardDescription>Latest 5 claim submissions</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className='text-sm text-muted-foreground'>Loading...</div>
        ) : recentClaims.length === 0 ? (
          <div className='text-sm text-muted-foreground'>No recent claims</div>
        ) : (
          <div className='space-y-4'>
            {recentClaims.map((claim) => (
              <div key={claim.id} className='flex items-center justify-between'>
                <div className='space-y-1'>
                  <Link
                    to='/claims'
                    className='text-sm font-medium hover:underline'
                  >
                    {claim.claim_number}
                  </Link>
                  <p className='text-xs text-muted-foreground'>
                    {claim.policy?.client?.name}
                  </p>
                </div>
                <div className='space-y-1 text-right'>
                  <Badge className={getStatusColor(claim.status)}>
                    {claim.status.replace('_', ' ')}
                  </Badge>
                  <p className='text-xs text-muted-foreground'>
                    MZN {claim.claim_amount.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
