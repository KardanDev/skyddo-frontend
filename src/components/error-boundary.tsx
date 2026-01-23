// Global Error Boundary Component
import React from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface ErrorBoundaryProps {
  children: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console in development
    // eslint-disable-next-line no-console
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className='flex min-h-screen items-center justify-center p-4'>
          <Card className='w-full max-w-md'>
            <CardHeader>
              <div className='flex items-center gap-2'>
                <AlertTriangle className='h-5 w-5 text-destructive' />
                <CardTitle>Something went wrong</CardTitle>
              </div>
              <CardDescription>
                An unexpected error occurred. Please try again.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              {this.state.error && (
                <div className='rounded-md bg-muted p-3'>
                  <code className='text-xs text-muted-foreground'>
                    {this.state.error.message}
                  </code>
                </div>
              )}
              <div className='flex gap-2'>
                <Button
                  onClick={() => {
                    this.setState({ hasError: false, error: null })
                  }}
                  variant='outline'
                >
                  Try Again
                </Button>
                <Button
                  onClick={() => {
                    window.location.href = '/'
                  }}
                >
                  Go Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}
