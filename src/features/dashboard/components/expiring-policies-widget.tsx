// Expiring Policies Widget
import { Link } from '@tanstack/react-router'
import { useExpiringPolicies } from '@/hooks/api/use-policies'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export function ExpiringPoliciesWidget() {
  const { data: expiringPolicies, isLoading } = useExpiringPolicies()

  const displayPolicies = expiringPolicies?.slice(0, 5) || []

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expiring Soon</CardTitle>
        <CardDescription>Policies expiring in the next 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className='text-sm text-muted-foreground'>Loading...</div>
        ) : displayPolicies.length === 0 ? (
          <div className='text-sm text-muted-foreground'>
            No policies expiring soon
          </div>
        ) : (
          <div className='space-y-4'>
            {displayPolicies.map((policy) => (
              <div
                key={policy.id}
                className='flex items-center justify-between'
              >
                <div className='space-y-1'>
                  <Link
                    to='/policies'
                    className='text-sm font-medium hover:underline'
                  >
                    {policy.policy_number}
                  </Link>
                  <p className='text-xs text-muted-foreground'>
                    {policy.client?.name}
                  </p>
                </div>
                <div className='text-right'>
                  <p className='text-xs text-muted-foreground'>
                    Expires: {new Date(policy.end_date).toLocaleDateString()}
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
