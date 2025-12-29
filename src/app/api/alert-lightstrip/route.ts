// NOTE(michael): this endpoint isn't used anywhere and was just an
// exploration of the HUE api.
import type { NextRequest } from 'next/server'

const REQUEST_URL = `${process.env.HUE_BRIDGE_URL}/lights/3`

export async function PUT(_request: NextRequest) {
  const response = await fetch(`${REQUEST_URL}/state`, {
    method: 'PUT',
    body: JSON.stringify({ on: true, hue: 0 }),
  })

  const result = await response.json()
  return Response.json(result)
}
