import type React from 'react'
import { createContext, useContext, useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'

export interface ThemeContextValue {
  theme: Theme
  switchTheme: () => void
}

export interface ThemeProviderProps {
  children: React.ReactNode
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

const THEME_STORAGE_KEY = 'hemolog-theme'

export function ThemeProvider({ children }: ThemeProviderProps): JSX.Element {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(THEME_STORAGE_KEY)
      if (stored === 'dark' || stored === 'light') {
        return stored
      }
    }
    return 'light'
  })

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  const switchTheme = (): void => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'))
  }

  const value: ThemeContextValue = {
    theme,
    switchTheme,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
