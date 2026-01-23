// Insurance Dashboard Metrics
import { Users, Shield, AlertCircle, DollarSign, FileText, TrendingUp, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useDashboardStats } from '@/hooks/api/use-dashboard'

export function InsuranceMetrics() {
  const { data: stats, isLoading } = useDashboardStats()

  const metrics = [
    {
      title: 'Total Clients',
      value: stats?.total_clients || 0,
      icon: Users,
      description: 'Registered clients',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
    },
    {
      title: 'Active Policies',
      value: stats?.active_policies || 0,
      icon: Shield,
      description: 'Currently active',
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-950',
    },
    {
      title: 'Pending Quotes',
      value: stats?.pending_quotes || 0,
      icon: FileText,
      description: 'Awaiting response',
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-950',
    },
    {
      title: 'Open Claims',
      value: stats?.open_claims || 0,
      icon: AlertCircle,
      description: 'Active claims',
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-950',
    },
    {
      title: 'Overdue Invoices',
      value: stats?.overdue_invoices || 0,
      icon: Clock,
      description: 'Needs attention',
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-950',
    },
    {
      title: 'Expiring Soon',
      value: stats?.policies_expiring_soon || 0,
      icon: TrendingUp,
      description: 'Next 30 days',
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
    },
  ]

  if (isLoading) {
    return (
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-4 w-4 rounded' />
            </CardHeader>
            <CardContent>
              <Skeleton className='mb-2 h-8 w-16' />
              <Skeleton className='h-3 w-32' />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
      {metrics.map((metric) => (
        <Card key={metric.title} className='overflow-hidden transition-all hover:shadow-lg'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-3'>
            <CardTitle className='text-sm font-medium'>{metric.title}</CardTitle>
            <div className={`rounded-lg p-2 ${metric.bgColor}`}>
              <metric.icon className={`h-5 w-5 ${metric.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className='text-3xl font-bold tracking-tight'>
              {metric.value.toLocaleString()}
            </div>
            <p className='mt-1 text-xs text-muted-foreground'>{metric.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
