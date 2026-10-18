import type { NextApiRequest } from 'next'

/**
 * Extracts the API key from the incoming request.
 *
 * SECURITY:
 * Prefers the `Authorization` header (`Bearer <key>` or `ApiKey <key>`)
 * over the query parameter. Header values are not written to web-server
 * logs, browser history, or referrer headers, so they are safer to use.
 *
 * Query param (`?apikey=`) is still supported for backward compatibility,
 * but clients are encouraged to switch to the header.
 */
export function getApiKeyFromRequest(req: NextApiRequest): string | null {
  const authHeader = req.headers['authorization']

  if (authHeader && typeof authHeader === 'string') {
    const [scheme, ...rest] = authHeader.trim().split(/\s+/)
    const token = rest.join(' ')

    if (scheme?.toLowerCase() === 'bearer' && token) {
      return token
    }

    if (scheme?.toLowerCase() === 'apikey' && token) {
      return token
    }
  }

  // Fallback to query parameter for backward compatibility.
  const queryKey = req.query.apikey
  if (typeof queryKey === 'string' && queryKey.length > 0) {
    return queryKey
  }

  return null
}
