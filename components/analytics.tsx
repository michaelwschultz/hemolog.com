import { configure } from 'onedollarstats'
import { useEffect } from 'react'

import { event } from 'onedollarstats'
import type { BaseProps } from 'onedollarstats/dist/types'

export function Analytics() {
  useEffect(() => {
    configure({
      collectorUrl: 'https://collector.onedollarstats.com/events',
      hostname: 'hemolog.com',
      autocollect: true, // automatically tracks pageviews & clicks
      hashRouting: false, // track SPA hash route changes
      devmode: process.env.NODE_ENV !== 'production',
    })
  }, [])

  return null
}

/**
 * Track an event using the onedollarstats.com client.
 * Internally uses category "Event".
 * @param action - The event action (e.g., "Logged Infusion")
 * @param path - The path of the event (e.g., "/dashboard/[userId]/settings")
 * @param properties - Optional event properties
 */
export const track = (
  action: string,
  path: string,
  properties: BaseProps = {}
): void => {
  event(action, path, properties)
}
