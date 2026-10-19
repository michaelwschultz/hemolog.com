'use client'

import { configure, event } from 'onedollarstats'
import { useEffect } from 'react'

export function Analytics() {
  useEffect(() => {
    configure({
      collectorUrl: 'https://collector.onedollarstats.com/events',
      hostname: 'hemolog.com',
      autocollect: true,
      hashRouting: false,
      devmode: process.env.NODE_ENV !== 'production',
    })
  }, [])

  return null
}

export function track(
  action: string,
  data: Record<string, unknown> = {}
): void {
  if (typeof window === 'undefined') {
    return
  }

  const props: Record<string, string> = {}
  for (const [key, value] of Object.entries(data)) {
    if (value == null) {
      continue
    }
    props[key] = typeof value === 'string' ? value : String(value)
  }

  void event(action, window.location.pathname, props)
}
