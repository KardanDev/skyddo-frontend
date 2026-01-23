// Auto-generating Breadcrumbs Component
import { useMemo } from 'react'
import { Link, useMatches, useRouterState } from '@tanstack/react-router'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { HomeIcon } from 'lucide-react'

interface BreadcrumbSegment {
  title: string
  path: string
  isLast: boolean
}

// Map route IDs to friendly names
const routeTitleMap: Record<string, string> = {
  // Main sections
  dashboard: 'Dashboard',
  clients: 'Clients',
  quotes: 'Quotes',
  policies: 'Policies',
  claims: 'Claims',
  invoices: 'Invoices',
  insurers: 'Insurers',
  'pricing-rules': 'Pricing Rules',
  users: 'Users',
  settings: 'Settings',
  profile: 'Profile',

  // Action routes
  new: 'New',
  edit: 'Edit',
  view: 'View',
  details: 'Details',

  // Settings sub-routes
  'company-settings': 'Company Settings',
  'account-settings': 'Account Settings',
  appearance: 'Appearance',
}

function formatRouteSegment(segment: string): string {
  // Remove leading/trailing slashes and underscores
  const cleaned = segment.replace(/^[/_]+|[/_]+$/g, '')

  // Check if we have a custom title
  if (routeTitleMap[cleaned]) {
    return routeTitleMap[cleaned]
  }

  // Convert kebab-case or snake_case to Title Case
  return cleaned
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function Breadcrumbs() {
  const matches = useMatches()
  const routerState = useRouterState()

  const breadcrumbs = useMemo<BreadcrumbSegment[]>(() => {
    // Filter out the root and authenticated routes
    const relevantMatches = matches.filter((match) => {
      const routeId = match.routeId
      return (
        routeId !== '__root__' &&
        routeId !== '/_authenticated' &&
        !routeId.startsWith('/(') && // Ignore error/auth route groups
        routeId !== '/'
      )
    })

    if (relevantMatches.length === 0) {
      return []
    }

    const segments: BreadcrumbSegment[] = []

    relevantMatches.forEach((match, index) => {
      const routeId = match.routeId
      const pathname = match.pathname

      // Skip if it's just a slash or index route
      if (!routeId || routeId === '/' || routeId === '/_authenticated/') {
        return
      }

      // Extract the last segment of the route ID for the title
      const routeParts = routeId.split('/')
      const lastPart = routeParts[routeParts.length - 1]

      // Skip dynamic route segments like $id
      if (lastPart?.startsWith('$')) {
        return
      }

      const title = formatRouteSegment(lastPart || '')

      // Only add if we have a valid title
      if (title) {
        segments.push({
          title,
          path: pathname,
          isLast: index === relevantMatches.length - 1,
        })
      }
    })

    return segments
  }, [matches])

  // Don't render if no breadcrumbs
  if (breadcrumbs.length === 0) {
    return null
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* Home breadcrumb */}
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to='/dashboard' className='flex items-center gap-1.5'>
              <HomeIcon className='h-4 w-4' />
              <span className='sr-only md:not-sr-only md:inline'>Home</span>
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {breadcrumbs.map((segment, index) => (
          <div key={segment.path} className='flex items-center gap-2'>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {segment.isLast ? (
                <BreadcrumbPage className='font-medium'>
                  {segment.title}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link to={segment.path}>{segment.title}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
