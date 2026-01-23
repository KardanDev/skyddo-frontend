import { useEffect, useState } from 'react'

export type ColorPalette = 'default' | 'slate' | 'blue' | 'green' | 'orange' | 'rose' | 'purple' | 'cyan' | 'amber'
export type BorderRadius = 0 | 0.3 | 0.5 | 0.75 | 1.0
export type FontSize = 'small' | 'medium' | 'large' | 'extra-large'

interface AppearanceSettings {
  colorPalette: ColorPalette
  borderRadius: BorderRadius
  fontSize: FontSize
}

const STORAGE_KEY = 'skyydo-appearance'

const DEFAULT_SETTINGS: AppearanceSettings = {
  colorPalette: 'default',
  borderRadius: 0.5,
  fontSize: 'medium',
}

const COLOR_PALETTES: Record<ColorPalette, {
  light: Record<string, string>
  dark: Record<string, string>
}> = {
  default: {
    // Burgundy/Maroon - Warm and Professional
    light: {
      background: '#faf9f7',
      foreground: '#2d1b24',
      card: '#ffffff',
      'card-foreground': '#2d1b24',
      popover: '#ffffff',
      'popover-foreground': '#2d1b24',
      primary: '#744253',
      'primary-foreground': '#ffffff',
      secondary: '#f4f1ed',
      'secondary-foreground': '#2d1b24',
      muted: '#f8f6f3',
      'muted-foreground': '#6b5d66',
      accent: '#fdf6f9',
      'accent-foreground': '#5c3444',
      destructive: '#c4375a',
      'destructive-foreground': '#ffffff',
      border: '#e8e2dd',
      input: '#e8e2dd',
      ring: '#744253',
      'chart-1': '#744253',
      'chart-2': '#6b8e7f',
      'chart-3': '#d4a574',
      'chart-4': '#9d7b8f',
      'chart-5': '#c4375a',
      sidebar: '#ffffff',
      'sidebar-foreground': '#2d1b24',
      'sidebar-primary': '#744253',
      'sidebar-primary-foreground': '#ffffff',
      'sidebar-accent': '#f8f6f3',
      'sidebar-accent-foreground': '#2d1b24',
      'sidebar-border': '#e8e2dd',
      'sidebar-ring': '#744253',
    },
    dark: {
      background: '#1a0f15',
      foreground: '#f0e6ea',
      card: '#2a1d24',
      'card-foreground': '#f0e6ea',
      popover: '#2a1d24',
      'popover-foreground': '#f0e6ea',
      primary: '#a85c73',
      'primary-foreground': '#ffffff',
      secondary: '#3d2d35',
      'secondary-foreground': '#f0e6ea',
      muted: '#2a1d24',
      'muted-foreground': '#b8a5ac',
      accent: '#4a2f3b',
      'accent-foreground': '#f5d9e3',
      destructive: '#cd5878',
      'destructive-foreground': '#ffffff',
      border: '#3d2d35',
      input: '#3d2d35',
      ring: '#a85c73',
      'chart-1': '#a85c73',
      'chart-2': '#7fa89a',
      'chart-3': '#dbb78e',
      'chart-4': '#b693a8',
      'chart-5': '#e37091',
      sidebar: '#150a10',
      'sidebar-foreground': '#f0e6ea',
      'sidebar-primary': '#a85c73',
      'sidebar-primary-foreground': '#ffffff',
      'sidebar-accent': '#2a1d24',
      'sidebar-accent-foreground': '#f0e6ea',
      'sidebar-border': '#2a1d24',
      'sidebar-ring': '#a85c73',
    },
  },
  slate: {
    // Slate - Clean and Modern
    light: {
      background: '#fcfcfc',
      foreground: '#0f172a',
      card: '#ffffff',
      'card-foreground': '#0f172a',
      popover: '#ffffff',
      'popover-foreground': '#0f172a',
      primary: '#0f172a',
      'primary-foreground': '#ffffff',
      secondary: '#f1f5f9',
      'secondary-foreground': '#0f172a',
      muted: '#f8fafc',
      'muted-foreground': '#64748b',
      accent: '#f1f5f9',
      'accent-foreground': '#0f172a',
      destructive: '#ef4444',
      'destructive-foreground': '#ffffff',
      border: '#e2e8f0',
      input: '#e2e8f0',
      ring: '#0f172a',
      'chart-1': '#0f172a',
      'chart-2': '#334155',
      'chart-3': '#475569',
      'chart-4': '#64748b',
      'chart-5': '#94a3b8',
      sidebar: '#ffffff',
      'sidebar-foreground': '#0f172a',
      'sidebar-primary': '#0f172a',
      'sidebar-primary-foreground': '#ffffff',
      'sidebar-accent': '#f1f5f9',
      'sidebar-accent-foreground': '#0f172a',
      'sidebar-border': '#e2e8f0',
      'sidebar-ring': '#0f172a',
    },
    dark: {
      background: '#020617',
      foreground: '#f8fafc',
      card: '#0f172a',
      'card-foreground': '#f8fafc',
      popover: '#0f172a',
      'popover-foreground': '#f8fafc',
      primary: '#f8fafc',
      'primary-foreground': '#020617',
      secondary: '#1e293b',
      'secondary-foreground': '#f8fafc',
      muted: '#1e293b',
      'muted-foreground': '#94a3b8',
      accent: '#1e293b',
      'accent-foreground': '#f8fafc',
      destructive: '#7f1d1d',
      'destructive-foreground': '#f8fafc',
      border: '#1e293b',
      input: '#1e293b',
      ring: '#e2e8f0',
      'chart-1': '#f1f5f9',
      'chart-2': '#cbd5e1',
      'chart-3': '#94a3b8',
      'chart-4': '#64748b',
      'chart-5': '#475569',
      sidebar: '#020617',
      'sidebar-foreground': '#f8fafc',
      'sidebar-primary': '#f8fafc',
      'sidebar-primary-foreground': '#020617',
      'sidebar-accent': '#1e293b',
      'sidebar-accent-foreground': '#f8fafc',
      'sidebar-border': '#1e293b',
      'sidebar-ring': '#e2e8f0',
    },
  },
  blue: {
    // Blue - Classic and Trustworthy
    light: {
      background: '#f0f9ff',
      foreground: '#0c4a6e',
      card: '#ffffff',
      'card-foreground': '#0c4a6e',
      popover: '#ffffff',
      'popover-foreground': '#0c4a6e',
      primary: '#0284c7',
      'primary-foreground': '#ffffff',
      secondary: '#e0f2fe',
      'secondary-foreground': '#0c4a6e',
      muted: '#f0f9ff',
      'muted-foreground': '#475569',
      accent: '#dbeafe',
      'accent-foreground': '#1e40af',
      destructive: '#ef4444',
      'destructive-foreground': '#ffffff',
      border: '#bae6fd',
      input: '#bae6fd',
      ring: '#0284c7',
      'chart-1': '#0284c7',
      'chart-2': '#0369a1',
      'chart-3': '#0ea5e9',
      'chart-4': '#38bdf8',
      'chart-5': '#7dd3fc',
      sidebar: '#ffffff',
      'sidebar-foreground': '#0c4a6e',
      'sidebar-primary': '#0284c7',
      'sidebar-primary-foreground': '#ffffff',
      'sidebar-accent': '#e0f2fe',
      'sidebar-accent-foreground': '#0c4a6e',
      'sidebar-border': '#bae6fd',
      'sidebar-ring': '#0284c7',
    },
    dark: {
      background: '#0c1929',
      foreground: '#e0f2fe',
      card: '#163a5f',
      'card-foreground': '#e0f2fe',
      popover: '#163a5f',
      'popover-foreground': '#e0f2fe',
      primary: '#38bdf8',
      'primary-foreground': '#0c1929',
      secondary: '#1e40af',
      'secondary-foreground': '#e0f2fe',
      muted: '#163a5f',
      'muted-foreground': '#93c5fd',
      accent: '#1e40af',
      'accent-foreground': '#dbeafe',
      destructive: '#7f1d1d',
      'destructive-foreground': '#e0f2fe',
      border: '#1e40af',
      input: '#1e40af',
      ring: '#38bdf8',
      'chart-1': '#38bdf8',
      'chart-2': '#0ea5e9',
      'chart-3': '#0284c7',
      'chart-4': '#0369a1',
      'chart-5': '#075985',
      sidebar: '#081221',
      'sidebar-foreground': '#e0f2fe',
      'sidebar-primary': '#38bdf8',
      'sidebar-primary-foreground': '#0c1929',
      'sidebar-accent': '#163a5f',
      'sidebar-accent-foreground': '#e0f2fe',
      'sidebar-border': '#163a5f',
      'sidebar-ring': '#38bdf8',
    },
  },
  green: {
    // Green - Fresh and Natural
    light: {
      background: '#f0fdf4',
      foreground: '#14532d',
      card: '#ffffff',
      'card-foreground': '#14532d',
      popover: '#ffffff',
      'popover-foreground': '#14532d',
      primary: '#059669',
      'primary-foreground': '#ffffff',
      secondary: '#dcfce7',
      'secondary-foreground': '#14532d',
      muted: '#f0fdf4',
      'muted-foreground': '#4b5563',
      accent: '#d1fae5',
      'accent-foreground': '#166534',
      destructive: '#ef4444',
      'destructive-foreground': '#ffffff',
      border: '#86efac',
      input: '#86efac',
      ring: '#059669',
      'chart-1': '#059669',
      'chart-2': '#047857',
      'chart-3': '#10b981',
      'chart-4': '#34d399',
      'chart-5': '#6ee7b7',
      sidebar: '#ffffff',
      'sidebar-foreground': '#14532d',
      'sidebar-primary': '#059669',
      'sidebar-primary-foreground': '#ffffff',
      'sidebar-accent': '#dcfce7',
      'sidebar-accent-foreground': '#14532d',
      'sidebar-border': '#86efac',
      'sidebar-ring': '#059669',
    },
    dark: {
      background: '#022c22',
      foreground: '#dcfce7',
      card: '#064e3b',
      'card-foreground': '#dcfce7',
      popover: '#064e3b',
      'popover-foreground': '#dcfce7',
      primary: '#34d399',
      'primary-foreground': '#022c22',
      secondary: '#166534',
      'secondary-foreground': '#dcfce7',
      muted: '#064e3b',
      'muted-foreground': '#86efac',
      accent: '#166534',
      'accent-foreground': '#d1fae5',
      destructive: '#7f1d1d',
      'destructive-foreground': '#dcfce7',
      border: '#166534',
      input: '#166534',
      ring: '#34d399',
      'chart-1': '#34d399',
      'chart-2': '#10b981',
      'chart-3': '#059669',
      'chart-4': '#047857',
      'chart-5': '#065f46',
      sidebar: '#022c22',
      'sidebar-foreground': '#dcfce7',
      'sidebar-primary': '#34d399',
      'sidebar-primary-foreground': '#022c22',
      'sidebar-accent': '#064e3b',
      'sidebar-accent-foreground': '#dcfce7',
      'sidebar-border': '#064e3b',
      'sidebar-ring': '#34d399',
    },
  },
  orange: {
    // Orange - Energetic and Bold
    light: {
      background: '#fff7ed',
      foreground: '#7c2d12',
      card: '#ffffff',
      'card-foreground': '#7c2d12',
      popover: '#ffffff',
      'popover-foreground': '#7c2d12',
      primary: '#ea580c',
      'primary-foreground': '#ffffff',
      secondary: '#ffedd5',
      'secondary-foreground': '#7c2d12',
      muted: '#fff7ed',
      'muted-foreground': '#6b5d66',
      accent: '#fed7aa',
      'accent-foreground': '#c2410c',
      destructive: '#ef4444',
      'destructive-foreground': '#ffffff',
      border: '#fdba74',
      input: '#fdba74',
      ring: '#ea580c',
      'chart-1': '#ea580c',
      'chart-2': '#c2410c',
      'chart-3': '#f97316',
      'chart-4': '#fb923c',
      'chart-5': '#fdba74',
      sidebar: '#ffffff',
      'sidebar-foreground': '#7c2d12',
      'sidebar-primary': '#ea580c',
      'sidebar-primary-foreground': '#ffffff',
      'sidebar-accent': '#ffedd5',
      'sidebar-accent-foreground': '#7c2d12',
      'sidebar-border': '#fdba74',
      'sidebar-ring': '#ea580c',
    },
    dark: {
      background: '#431407',
      foreground: '#ffedd5',
      card: '#7c2d12',
      'card-foreground': '#ffedd5',
      popover: '#7c2d12',
      'popover-foreground': '#ffedd5',
      primary: '#fb923c',
      'primary-foreground': '#431407',
      secondary: '#c2410c',
      'secondary-foreground': '#ffedd5',
      muted: '#7c2d12',
      'muted-foreground': '#fdba74',
      accent: '#c2410c',
      'accent-foreground': '#fed7aa',
      destructive: '#7f1d1d',
      'destructive-foreground': '#ffedd5',
      border: '#c2410c',
      input: '#c2410c',
      ring: '#fb923c',
      'chart-1': '#fb923c',
      'chart-2': '#f97316',
      'chart-3': '#ea580c',
      'chart-4': '#c2410c',
      'chart-5': '#9a3412',
      sidebar: '#431407',
      'sidebar-foreground': '#ffedd5',
      'sidebar-primary': '#fb923c',
      'sidebar-primary-foreground': '#431407',
      'sidebar-accent': '#7c2d12',
      'sidebar-accent-foreground': '#ffedd5',
      'sidebar-border': '#7c2d12',
      'sidebar-ring': '#fb923c',
    },
  },
  rose: {
    // Rose - Elegant and Vibrant
    light: {
      background: '#fff1f2',
      foreground: '#881337',
      card: '#ffffff',
      'card-foreground': '#881337',
      popover: '#ffffff',
      'popover-foreground': '#881337',
      primary: '#e11d48',
      'primary-foreground': '#ffffff',
      secondary: '#ffe4e6',
      'secondary-foreground': '#881337',
      muted: '#fff1f2',
      'muted-foreground': '#6b5d66',
      accent: '#fecdd3',
      'accent-foreground': '#9f1239',
      destructive: '#be123c',
      'destructive-foreground': '#ffffff',
      border: '#fda4af',
      input: '#fda4af',
      ring: '#e11d48',
      'chart-1': '#e11d48',
      'chart-2': '#be123c',
      'chart-3': '#f43f5e',
      'chart-4': '#fb7185',
      'chart-5': '#fda4af',
      sidebar: '#ffffff',
      'sidebar-foreground': '#881337',
      'sidebar-primary': '#e11d48',
      'sidebar-primary-foreground': '#ffffff',
      'sidebar-accent': '#ffe4e6',
      'sidebar-accent-foreground': '#881337',
      'sidebar-border': '#fda4af',
      'sidebar-ring': '#e11d48',
    },
    dark: {
      background: '#4c0519',
      foreground: '#ffe4e6',
      card: '#881337',
      'card-foreground': '#ffe4e6',
      popover: '#881337',
      'popover-foreground': '#ffe4e6',
      primary: '#fb7185',
      'primary-foreground': '#4c0519',
      secondary: '#9f1239',
      'secondary-foreground': '#ffe4e6',
      muted: '#881337',
      'muted-foreground': '#fda4af',
      accent: '#9f1239',
      'accent-foreground': '#fecdd3',
      destructive: '#881337',
      'destructive-foreground': '#ffe4e6',
      border: '#9f1239',
      input: '#9f1239',
      ring: '#fb7185',
      'chart-1': '#fb7185',
      'chart-2': '#f43f5e',
      'chart-3': '#e11d48',
      'chart-4': '#be123c',
      'chart-5': '#9f1239',
      sidebar: '#4c0519',
      'sidebar-foreground': '#ffe4e6',
      'sidebar-primary': '#fb7185',
      'sidebar-primary-foreground': '#4c0519',
      'sidebar-accent': '#881337',
      'sidebar-accent-foreground': '#ffe4e6',
      'sidebar-border': '#881337',
      'sidebar-ring': '#fb7185',
    },
  },
  purple: {
    // Purple - Creative and Sophisticated
    light: {
      background: '#faf5ff',
      foreground: '#581c87',
      card: '#ffffff',
      'card-foreground': '#581c87',
      popover: '#ffffff',
      'popover-foreground': '#581c87',
      primary: '#9333ea',
      'primary-foreground': '#ffffff',
      secondary: '#f3e8ff',
      'secondary-foreground': '#581c87',
      muted: '#faf5ff',
      'muted-foreground': '#6b5d66',
      accent: '#e9d5ff',
      'accent-foreground': '#7e22ce',
      destructive: '#ef4444',
      'destructive-foreground': '#ffffff',
      border: '#d8b4fe',
      input: '#d8b4fe',
      ring: '#9333ea',
      'chart-1': '#9333ea',
      'chart-2': '#7e22ce',
      'chart-3': '#a855f7',
      'chart-4': '#c084fc',
      'chart-5': '#e9d5ff',
      sidebar: '#ffffff',
      'sidebar-foreground': '#581c87',
      'sidebar-primary': '#9333ea',
      'sidebar-primary-foreground': '#ffffff',
      'sidebar-accent': '#f3e8ff',
      'sidebar-accent-foreground': '#581c87',
      'sidebar-border': '#d8b4fe',
      'sidebar-ring': '#9333ea',
    },
    dark: {
      background: '#3b0764',
      foreground: '#f3e8ff',
      card: '#6b21a8',
      'card-foreground': '#f3e8ff',
      popover: '#6b21a8',
      'popover-foreground': '#f3e8ff',
      primary: '#c084fc',
      'primary-foreground': '#3b0764',
      secondary: '#7e22ce',
      'secondary-foreground': '#f3e8ff',
      muted: '#6b21a8',
      'muted-foreground': '#d8b4fe',
      accent: '#7e22ce',
      'accent-foreground': '#e9d5ff',
      destructive: '#7f1d1d',
      'destructive-foreground': '#f3e8ff',
      border: '#7e22ce',
      input: '#7e22ce',
      ring: '#c084fc',
      'chart-1': '#c084fc',
      'chart-2': '#a855f7',
      'chart-3': '#9333ea',
      'chart-4': '#7e22ce',
      'chart-5': '#6b21a8',
      sidebar: '#3b0764',
      'sidebar-foreground': '#f3e8ff',
      'sidebar-primary': '#c084fc',
      'sidebar-primary-foreground': '#3b0764',
      'sidebar-accent': '#6b21a8',
      'sidebar-accent-foreground': '#f3e8ff',
      'sidebar-border': '#6b21a8',
      'sidebar-ring': '#c084fc',
    },
  },
  cyan: {
    // Cyan - Modern and Tech-Forward
    light: {
      background: '#ecfeff',
      foreground: '#164e63',
      card: '#ffffff',
      'card-foreground': '#164e63',
      popover: '#ffffff',
      'popover-foreground': '#164e63',
      primary: '#0891b2',
      'primary-foreground': '#ffffff',
      secondary: '#cffafe',
      'secondary-foreground': '#164e63',
      muted: '#ecfeff',
      'muted-foreground': '#475569',
      accent: '#a5f3fc',
      'accent-foreground': '#155e75',
      destructive: '#ef4444',
      'destructive-foreground': '#ffffff',
      border: '#67e8f9',
      input: '#67e8f9',
      ring: '#0891b2',
      'chart-1': '#0891b2',
      'chart-2': '#0e7490',
      'chart-3': '#06b6d4',
      'chart-4': '#22d3ee',
      'chart-5': '#67e8f9',
      sidebar: '#ffffff',
      'sidebar-foreground': '#164e63',
      'sidebar-primary': '#0891b2',
      'sidebar-primary-foreground': '#ffffff',
      'sidebar-accent': '#cffafe',
      'sidebar-accent-foreground': '#164e63',
      'sidebar-border': '#67e8f9',
      'sidebar-ring': '#0891b2',
    },
    dark: {
      background: '#083344',
      foreground: '#cffafe',
      card: '#155e75',
      'card-foreground': '#cffafe',
      popover: '#155e75',
      'popover-foreground': '#cffafe',
      primary: '#22d3ee',
      'primary-foreground': '#083344',
      secondary: '#0e7490',
      'secondary-foreground': '#cffafe',
      muted: '#155e75',
      'muted-foreground': '#67e8f9',
      accent: '#0e7490',
      'accent-foreground': '#a5f3fc',
      destructive: '#7f1d1d',
      'destructive-foreground': '#cffafe',
      border: '#0e7490',
      input: '#0e7490',
      ring: '#22d3ee',
      'chart-1': '#22d3ee',
      'chart-2': '#06b6d4',
      'chart-3': '#0891b2',
      'chart-4': '#0e7490',
      'chart-5': '#155e75',
      sidebar: '#083344',
      'sidebar-foreground': '#cffafe',
      'sidebar-primary': '#22d3ee',
      'sidebar-primary-foreground': '#083344',
      'sidebar-accent': '#155e75',
      'sidebar-accent-foreground': '#cffafe',
      'sidebar-border': '#155e75',
      'sidebar-ring': '#22d3ee',
    },
  },
  amber: {
    // Amber - Warm and Inviting
    light: {
      background: '#fffbeb',
      foreground: '#78350f',
      card: '#ffffff',
      'card-foreground': '#78350f',
      popover: '#ffffff',
      'popover-foreground': '#78350f',
      primary: '#d97706',
      'primary-foreground': '#ffffff',
      secondary: '#fef3c7',
      'secondary-foreground': '#78350f',
      muted: '#fffbeb',
      'muted-foreground': '#6b5d66',
      accent: '#fde68a',
      'accent-foreground': '#92400e',
      destructive: '#ef4444',
      'destructive-foreground': '#ffffff',
      border: '#fcd34d',
      input: '#fcd34d',
      ring: '#d97706',
      'chart-1': '#d97706',
      'chart-2': '#b45309',
      'chart-3': '#f59e0b',
      'chart-4': '#fbbf24',
      'chart-5': '#fcd34d',
      sidebar: '#ffffff',
      'sidebar-foreground': '#78350f',
      'sidebar-primary': '#d97706',
      'sidebar-primary-foreground': '#ffffff',
      'sidebar-accent': '#fef3c7',
      'sidebar-accent-foreground': '#78350f',
      'sidebar-border': '#fcd34d',
      'sidebar-ring': '#d97706',
    },
    dark: {
      background: '#451a03',
      foreground: '#fef3c7',
      card: '#78350f',
      'card-foreground': '#fef3c7',
      popover: '#78350f',
      'popover-foreground': '#fef3c7',
      primary: '#fbbf24',
      'primary-foreground': '#451a03',
      secondary: '#92400e',
      'secondary-foreground': '#fef3c7',
      muted: '#78350f',
      'muted-foreground': '#fcd34d',
      accent: '#92400e',
      'accent-foreground': '#fde68a',
      destructive: '#7f1d1d',
      'destructive-foreground': '#fef3c7',
      border: '#92400e',
      input: '#92400e',
      ring: '#fbbf24',
      'chart-1': '#fbbf24',
      'chart-2': '#f59e0b',
      'chart-3': '#d97706',
      'chart-4': '#b45309',
      'chart-5': '#92400e',
      sidebar: '#451a03',
      'sidebar-foreground': '#fef3c7',
      'sidebar-primary': '#fbbf24',
      'sidebar-primary-foreground': '#451a03',
      'sidebar-accent': '#78350f',
      'sidebar-accent-foreground': '#fef3c7',
      'sidebar-border': '#78350f',
      'sidebar-ring': '#fbbf24',
    },
  },
}

const FONT_SIZE_VALUES: Record<FontSize, string> = {
  small: '14px',
  medium: '16px',
  large: '18px',
  'extra-large': '20px',
}

function getStoredSettings(): AppearanceSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) }
    }
  } catch (error) {
    console.error('Failed to load appearance settings:', error)
  }

  return DEFAULT_SETTINGS
}

function applyColorPalette(palette: ColorPalette) {
  const root = document.documentElement
  const isDark = root.classList.contains('dark')
  const colors = isDark ? COLOR_PALETTES[palette].dark : COLOR_PALETTES[palette].light

  Object.entries(colors).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value)
  })
}

function applyBorderRadius(radius: BorderRadius) {
  const root = document.documentElement
  root.style.setProperty('--radius', `${radius}rem`)
}

function applyFontSize(size: FontSize) {
  const root = document.documentElement
  root.style.setProperty('font-size', FONT_SIZE_VALUES[size])
}

export function useAppearance() {
  const [settings, setSettings] = useState<AppearanceSettings>(getStoredSettings)

  useEffect(() => {
    // Apply all settings on mount and when they change
    applyColorPalette(settings.colorPalette)
    applyBorderRadius(settings.borderRadius)
    applyFontSize(settings.fontSize)

    // Watch for theme changes to reapply color palette
    const observer = new MutationObserver(() => {
      applyColorPalette(settings.colorPalette)
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => observer.disconnect()
  }, [settings])

  const updateSettings = (partial: Partial<AppearanceSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...partial }

      // Persist to localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      } catch (error) {
        console.error('Failed to save appearance settings:', error)
      }

      return updated
    })
  }

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.error('Failed to reset appearance settings:', error)
    }
  }

  return {
    settings,
    updateSettings,
    resetSettings,
    setColorPalette: (palette: ColorPalette) => updateSettings({ colorPalette: palette }),
    setBorderRadius: (radius: BorderRadius) => updateSettings({ borderRadius: radius }),
    setFontSize: (size: FontSize) => updateSettings({ fontSize: size }),
  }
}

export const PALETTE_METADATA: Record<ColorPalette, { label: string; description: string; colors: string[] }> = {
  default: {
    label: 'Default',
    description: 'Default color palette',
    colors: ['#744253', '#f8f6f3', '#fdf6f9']
  },
  slate: {
    label: 'Slate',
    description: 'Clean and modern',
    colors: ['#475569', '#f8fafc', '#f1f5f9']
  },
  blue: {
    label: 'Ocean Blue',
    description: 'Classic and trustworthy',
    colors: ['#3b82f6', '#f0f9ff', '#dbeafe']
  },
  green: {
    label: 'Emerald',
    description: 'Fresh and natural',
    colors: ['#10b981', '#f0fdf4', '#d1fae5']
  },
  orange: {
    label: 'Sunset',
    description: 'Energetic and bold',
    colors: ['#f97316', '#fff7ed', '#fed7aa']
  },
  rose: {
    label: 'Rose',
    description: 'Elegant and vibrant',
    colors: ['#e11d48', '#fff1f2', '#fecdd3']
  },
  purple: {
    label: 'Violet',
    description: 'Creative and sophisticated',
    colors: ['#a855f7', '#faf5ff', '#e9d5ff']
  },
  cyan: {
    label: 'Aqua',
    description: 'Modern and tech-forward',
    colors: ['#06b6d4', '#ecfeff', '#a5f3fc']
  },
  amber: {
    label: 'Golden',
    description: 'Warm and inviting',
    colors: ['#f59e0b', '#fffbeb', '#fde68a']
  },
}
