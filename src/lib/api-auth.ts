import type { NextRequest } from 'next/server'

/**
 * Reads the Hemolog API key from the request.
 * The API key must be sent in the Authorization header so the key stays out
 * of URLs, server logs, and browser history. Query-parameter keys
 * (`?apikey=`) are no longer accepted.
 */
export function getApiKeyFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')

  if (authHeader) {
    const [scheme, ...rest] = authHeader.trim().split(/\s+/)
    const token = rest.join(' ')
    const normalized = scheme?.toLowerCase()

    if ((normalized === 'bearer' || normalized === 'apikey') && token) {
      return token
    }
  }

  return null
}
