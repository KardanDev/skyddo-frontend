// Reusable Empty State Component
import { type LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <Card>
      <CardHeader className='pb-4 text-center'>
        <div className='mb-4 flex justify-center'>
          <div className='rounded-full bg-muted p-3'>
            <Icon className='h-6 w-6 text-muted-foreground' />
          </div>
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      {action && (
        <CardContent className='flex justify-center pb-6'>
          <Button onClick={action.onClick}>{action.label}</Button>
        </CardContent>
      )}
    </Card>
  )
}

// Simplified version for use within existing cards
export function SimpleEmptyState({
  icon: Icon,
  title,
  description,
}: Omit<EmptyStateProps, 'action'>) {
  return (
    <div className='flex flex-col items-center justify-center py-12 text-center'>
      <div className='mb-4 rounded-full bg-muted p-3'>
        <Icon className='h-6 w-6 text-muted-foreground' />
      </div>
      <h3 className='text-lg font-semibold'>{title}</h3>
      <p className='mt-1 max-w-sm text-sm text-muted-foreground'>
        {description}
      </p>
    </div>
  )
}
