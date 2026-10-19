import type { NextRequest } from 'next/server'

/**
 * Reads the Hemolog API key from the request.
 * The Authorization header is preferred so the key stays out of URLs,
 * server logs, and browser history. `?apikey=` still works.
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

  const queryKey = request.nextUrl.searchParams.get('apikey')
  if (queryKey && queryKey.length > 0) {
    return queryKey
  }

  return null
}
