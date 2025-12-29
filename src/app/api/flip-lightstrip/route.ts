// NOTE(michael): this endpoint isn't used anywhere and was just an
// exploration of the HUE api.
import type { NextRequest } from 'next/server'

const REQUEST_URL = `${process.env.HUE_BRIDGE_URL}/lights/3`

export async function PUT(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const onParam = searchParams.get('on')
  let on: boolean | undefined

  if (onParam) {
    switch (onParam) {
      case 'false': {
        on = false
        break
      }
      case 'true': {
        on = true
        break
      }
      case 'default': {
        on = true
        break
      }
    }
  } else {
    // Get current state and toggle
    const stateResponse = await fetch(REQUEST_URL, {
      method: 'GET',
    })
    const data = await stateResponse.json()
    const currentState = data.state.on
    // toggle light state
    on = !currentState
  }

  const response = await fetch(`${REQUEST_URL}/state`, {
    method: 'PUT',
    body: JSON.stringify({ on: on }),
  })

  const result = await response.json()
  return Response.json(result)
}
