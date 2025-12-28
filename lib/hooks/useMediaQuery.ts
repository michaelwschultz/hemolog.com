import { useState, useEffect } from 'react'

export interface MediaQueryOptions {
  match?: 'up' | 'down'
}

export function useMediaQuery(
  query: string,
  _options?: MediaQueryOptions
): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches
    }
    return false
  })

  useEffect(() => {
    const mediaQuery = window.matchMedia(query)
    const handleChange = (event: MediaQueryListEvent): void => {
      setMatches(event.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    setMatches(mediaQuery.matches)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [query])

  return matches
}
