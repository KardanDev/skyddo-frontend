import { Outlet } from '@tanstack/react-router'
import { Moon, Sun } from 'lucide-react'
import { getCookie } from '@/lib/cookies'
import { cn } from '@/lib/utils'
import { LayoutProvider } from '@/context/layout-provider'
import { SearchProvider } from '@/context/search-provider'
import { useTheme } from '@/context/theme-provider'
import { useAppearance } from '@/hooks/use-appearance'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { ChatbotWidget } from '@/components/chatbot-widget'
import { CommandPalette } from '@/components/command-palette'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { SkipToMain } from '@/components/skip-to-main'
import { Header } from './header'
import { NavUser } from './nav-user'

type AuthenticatedLayoutProps = {
  children?: React.ReactNode
}

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const defaultOpen = getCookie('sidebar_state') !== 'false'
  const { theme, setTheme } = useTheme()

  // Initialize appearance settings (loads from localStorage and applies)
  useAppearance()

  return (
    <SearchProvider>
      <LayoutProvider>
        <SidebarProvider defaultOpen={defaultOpen}>
          <SkipToMain />
          <AppSidebar />
          <SidebarInset
            className={cn(
              // Set content container, so we can use container queries
              '@container/content',

              // If layout is fixed, set the height
              // to 100svh to prevent overflow
              'has-data-[layout=fixed]:h-svh',

              // If layout is fixed and sidebar is inset,
              // set the height to 100svh - spacing (total margins) to prevent overflow
              'peer-data-[variant=inset]:has-data-[layout=fixed]:h-[calc(100svh-(var(--spacing)*4))]'
            )}
          >
            <Header fixed className='bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
              <div className='ml-auto flex items-center gap-2'>
                {/* Theme Switcher */}
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  <Sun className='h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
                  <Moon className='absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
                  <span className='sr-only'>Toggle theme</span>
                </Button>

                {/* User Dropdown */}
                <NavUser />
              </div>
            </Header>
            <div className='px-4 py-6 md:px-6 lg:px-8'>{children ?? <Outlet />}</div>
          </SidebarInset>
          <CommandPalette />
          <ChatbotWidget />
        </SidebarProvider>
      </LayoutProvider>
    </SearchProvider>
  )
}
