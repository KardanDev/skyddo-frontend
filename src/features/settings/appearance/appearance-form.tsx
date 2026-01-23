import { useState } from 'react'
import { ChevronDownIcon } from '@radix-ui/react-icons'
import { fonts, fontLabels } from '@/config/fonts'
import {
  Check,
  Monitor,
  Moon,
  Palette,
  Sun,
  Layout as LayoutIcon,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useFont } from '@/context/font-provider'
import { useLayout, type Variant } from '@/context/layout-provider'
import { useTheme } from '@/context/theme-provider'
import {
  useAppearance,
  PALETTE_METADATA,
  type ColorPalette,
  type BorderRadius,
  type FontSize,
} from '@/hooks/use-appearance'
import { Button, buttonVariants } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const SIDEBAR_VARIANTS: Array<{
  value: Variant
  label: string
  description: string
}> = [
  { value: 'sidebar', label: 'Sidebar', description: 'Fixed sidebar layout' },
  { value: 'inset', label: 'Inset', description: 'Inset sidebar with padding' },
  {
    value: 'floating',
    label: 'Floating',
    description: 'Floating sidebar overlay',
  },
]

const BORDER_RADIUS: Array<{
  value: BorderRadius
  label: string
}> = [
  { value: 0, label: 'None' },
  { value: 0.3, label: 'Small' },
  { value: 0.5, label: 'Medium' },
  { value: 0.75, label: 'Large' },
  { value: 1.0, label: 'Extra Large' },
]

const FONT_SIZES: Array<{
  value: FontSize
  label: string
}> = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
  { value: 'extra-large', label: 'Extra Large' },
]

export function AppearanceForm() {
  const { font, setFont } = useFont()
  const { theme, setTheme } = useTheme()
  const { variant, setVariant } = useLayout()
  const { settings, setColorPalette, setBorderRadius, setFontSize } =
    useAppearance()

  const [isDirty, setIsDirty] = useState(false)

  const handleSave = () => {
    toast.success('Appearance settings saved successfully')
    setIsDirty(false)
  }

  const handleReset = () => {
    setTheme('system')
    setFont('inter')
    setVariant('sidebar')
    setColorPalette('default')
    setBorderRadius(0.5)
    setFontSize('small')
    toast.success('Appearance settings reset to defaults')
    setIsDirty(false)
  }

  return (
    <div className='space-y-8'>
      {/* Theme Section */}
      <div className='space-y-4'>
        <div>
          <h3 className='text-lg font-medium'>Theme Mode</h3>
          <p className='text-sm text-muted-foreground'>
            Choose between light, dark, or system preference
          </p>
        </div>
        <div className='grid grid-cols-3 gap-4'>
          <button
            type='button'
            onClick={() => {
              setTheme('light')
              setIsDirty(true)
            }}
            className={cn(
              'relative flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors hover:border-primary/50',
              theme === 'light' ? 'border-primary bg-primary/5' : 'border-muted'
            )}
          >
            {theme === 'light' && (
              <Check className='absolute top-2 right-2 h-4 w-4 text-primary' />
            )}
            <Sun className='h-6 w-6' />
            <span className='text-sm font-medium'>Light</span>
          </button>

          <button
            type='button'
            onClick={() => {
              setTheme('dark')
              setIsDirty(true)
            }}
            className={cn(
              'relative flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors hover:border-primary/50',
              theme === 'dark' ? 'border-primary bg-primary/5' : 'border-muted'
            )}
          >
            {theme === 'dark' && (
              <Check className='absolute top-2 right-2 h-4 w-4 text-primary' />
            )}
            <Moon className='h-6 w-6' />
            <span className='text-sm font-medium'>Dark</span>
          </button>

          <button
            type='button'
            onClick={() => {
              setTheme('system')
              setIsDirty(true)
            }}
            className={cn(
              'relative flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors hover:border-primary/50',
              theme === 'system'
                ? 'border-primary bg-primary/5'
                : 'border-muted'
            )}
          >
            {theme === 'system' && (
              <Check className='absolute top-2 right-2 h-4 w-4 text-primary' />
            )}
            <Monitor className='h-6 w-6' />
            <span className='text-sm font-medium'>System</span>
          </button>
        </div>
      </div>

      <Separator />

      {/* Color Palette Section */}
      <div className='space-y-4'>
        <div>
          <h3 className='flex items-center gap-2 text-lg font-medium'>
            <Palette className='h-5 w-5' />
            Color Palette
          </h3>
          <p className='text-sm text-muted-foreground'>
            Choose a color theme that transforms the entire interface
          </p>
        </div>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {(Object.keys(PALETTE_METADATA) as ColorPalette[]).map(
            (paletteKey) => {
              const palette = PALETTE_METADATA[paletteKey]
              return (
                <button
                  key={paletteKey}
                  type='button'
                  onClick={() => {
                    setColorPalette(paletteKey)
                    setIsDirty(true)
                  }}
                  className={cn(
                    'relative flex flex-col gap-3 rounded-lg border-2 p-4 text-left transition-all hover:border-primary/50 hover:shadow-md',
                    settings.colorPalette === paletteKey
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-muted'
                  )}
                >
                  {settings.colorPalette === paletteKey && (
                    <div className='absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary'>
                      <Check className='h-4 w-4 text-primary-foreground' />
                    </div>
                  )}
                  {/* Color swatches */}
                  <div className='flex gap-2'>
                    {palette.colors.map((color, idx) => (
                      <div
                        key={idx}
                        className='h-10 flex-1 rounded-md shadow-sm ring-1 ring-black/10'
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <div>
                    <div className='text-base font-semibold'>
                      {palette.label}
                    </div>
                    <div className='text-xs text-muted-foreground'>
                      {palette.description}
                    </div>
                  </div>
                </button>
              )
            }
          )}
        </div>
      </div>

      <Separator />

      {/* Sidebar Variant Section */}
      <div className='space-y-4'>
        <div>
          <h3 className='flex items-center gap-2 text-lg font-medium'>
            <LayoutIcon className='h-5 w-5' />
            Sidebar Layout
          </h3>
          <p className='text-sm text-muted-foreground'>
            Choose how the sidebar appears in your dashboard
          </p>
        </div>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
          {SIDEBAR_VARIANTS.map((v) => (
            <button
              key={v.value}
              type='button'
              onClick={() => {
                setVariant(v.value)
                setIsDirty(true)
              }}
              className={cn(
                'relative flex flex-col gap-2 rounded-lg border-2 p-4 text-left transition-colors hover:border-primary/50',
                variant === v.value
                  ? 'border-primary bg-primary/5'
                  : 'border-muted'
              )}
            >
              {variant === v.value && (
                <Check className='absolute top-2 right-2 h-4 w-4 text-primary' />
              )}
              <div className='font-medium'>{v.label}</div>
              <div className='text-xs text-muted-foreground'>
                {v.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Border Radius Section */}
      <div className='space-y-4'>
        <div>
          <h3 className='text-lg font-medium'>Border Radius</h3>
          <p className='text-sm text-muted-foreground'>
            Control the roundness of UI elements throughout the app
          </p>
        </div>
        <div className='flex flex-wrap gap-2'>
          {BORDER_RADIUS.map((r) => (
            <Button
              key={r.value}
              type='button'
              variant={
                settings.borderRadius === r.value ? 'default' : 'outline'
              }
              size='sm'
              onClick={() => {
                setBorderRadius(r.value)
                setIsDirty(true)
              }}
            >
              {r.label}
            </Button>
          ))}
        </div>
        {/* Visual preview */}
        <div className='grid grid-cols-2 gap-4 sm:grid-cols-4'>
          <div
            className='flex h-16 items-center justify-center border-2 border-primary bg-primary/20 text-xs font-medium transition-all'
            style={{ borderRadius: `${settings.borderRadius}rem` }}
          >
            Card
          </div>
          <div
            className='flex h-16 items-center justify-center border border-border bg-muted text-xs font-medium transition-all'
            style={{ borderRadius: `${settings.borderRadius}rem` }}
          >
            Input
          </div>
          <div
            className='flex h-16 items-center justify-center border border-border bg-accent text-xs font-medium transition-all'
            style={{ borderRadius: `${settings.borderRadius}rem` }}
          >
            Button
          </div>
          <div
            className='flex h-16 items-center justify-center border border-border bg-secondary text-xs font-medium transition-all'
            style={{ borderRadius: `${settings.borderRadius}rem` }}
          >
            Badge
          </div>
        </div>
      </div>

      <Separator />

      {/* Font Size Section */}
      <div className='space-y-4'>
        <div>
          <h3 className='text-lg font-medium'>Font Size</h3>
          <p className='text-sm text-muted-foreground'>
            Adjust the base font size for better readability
          </p>
        </div>
        <div className='flex flex-wrap gap-2'>
          {FONT_SIZES.map((s) => (
            <Button
              key={s.value}
              type='button'
              variant={settings.fontSize === s.value ? 'default' : 'outline'}
              size='sm'
              onClick={() => {
                setFontSize(s.value)
                setIsDirty(true)
              }}
            >
              {s.label}
            </Button>
          ))}
        </div>
        <div className='rounded-lg border-2 border-muted bg-muted/30 p-4'>
          <p className='text-sm leading-relaxed'>
            This is a preview of how text will appear at the selected font size.
            You can adjust the size to match your preference for comfortable
            reading across the dashboard.
          </p>
        </div>
      </div>

      <Separator />

      {/* Font Family Section */}
      <div className='space-y-4'>
        <div>
          <h3 className='text-lg font-medium'>Font Family</h3>
          <p className='text-sm text-muted-foreground'>
            Select your preferred typeface for the entire interface
          </p>
        </div>
        <div className='relative w-full max-w-xs'>
          <select
            className={cn(
              buttonVariants({ variant: 'outline' }),
              'w-full appearance-none pr-8 font-normal',
              'dark:bg-background dark:hover:bg-background'
            )}
            value={font}
            onChange={(e) => {
              setFont(e.target.value as typeof font)
              setIsDirty(true)
            }}
          >
            {fonts.map((f) => (
              <option key={f} value={f}>
                {fontLabels[f]}
              </option>
            ))}
          </select>
          <ChevronDownIcon className='pointer-events-none absolute end-3 top-2.5 h-4 w-4 opacity-50' />
        </div>
        <div className='space-y-2 rounded-lg border-2 border-muted bg-muted/30 p-4'>
          <p className='font-semibold'>Font Preview</p>
          <p className='text-sm'>
            The quick brown fox jumps over the lazy dog.
            ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789
          </p>
        </div>
      </div>

      <Separator />

      {/* Action Buttons */}
      <div className='flex items-center gap-4 pt-4'>
        <Button onClick={handleSave} disabled={!isDirty} size='lg'>
          Save Changes
        </Button>
        <Button variant='outline' onClick={handleReset} size='lg'>
          Reset to Defaults
        </Button>
        {isDirty && (
          <span className='text-sm text-muted-foreground'>
            You have unsaved changes
          </span>
        )}
      </div>
    </div>
  )
}
