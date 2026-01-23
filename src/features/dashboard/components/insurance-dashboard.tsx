// Insurance Dashboard
import { Link } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ExpiringPoliciesWidget } from './expiring-policies-widget'
import { InsuranceMetrics } from './insurance-metrics'
import { RecentClaimsWidget } from './recent-claims-widget'

export function InsuranceDashboard() {
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Dashboard</h1>
          <p className='text-muted-foreground'>Insurance management overview</p>
        </div>
        <div className='flex gap-2'>
          <Button asChild>
            <Link to='/clients'>
              <Plus className='mr-2 h-4 w-4' />
              New Client
            </Link>
          </Button>
          <Button asChild variant='outline'>
            <Link to='/quotes'>
              <Plus className='mr-2 h-4 w-4' />
              New Quote
            </Link>
          </Button>
        </div>
      </div>

      <InsuranceMetrics />

      <div className='grid gap-4 md:grid-cols-2'>
        <ExpiringPoliciesWidget />
        <RecentClaimsWidget />
      </div>
    </div>
  )
}
