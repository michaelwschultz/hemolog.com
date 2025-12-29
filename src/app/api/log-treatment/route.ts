import {
  getRecentUserInfusionsByApiKey,
  postInfusionByApiKey,
} from '@/lib/admin-db/infusions'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const apikey = searchParams.get('apikey')

    if (!apikey) {
      throw { message: 'Access denied. Missing api key.' }
    }

    const body = await request.json()

    if (!body) {
      throw { message: 'Missing infusion data.' }
    }

    const { infusions, error } = await getRecentUserInfusionsByApiKey(apikey)

    if (error) throw error

    const mostRecentInfusion =
      infusions && infusions.length > 0 ? infusions[0] : null

    try {
      const { infusion, error } = await postInfusionByApiKey(
        apikey,
        mostRecentInfusion,
        body
      )
      if (error) throw error
      return Response.json(infusion)
    } catch (error: unknown) {
      const errorMessage =
        error &&
        typeof error === 'object' &&
        'message' in error &&
        typeof error.message === 'string'
          ? error.message
          : 'An error occurred'
      return Response.json({ error: errorMessage }, { status: 500 })
    }
  } catch (error: unknown) {
    const errorMessage =
      error &&
      typeof error === 'object' &&
      'message' in error &&
      typeof error.message === 'string'
        ? error.message
        : 'An error occurred'
    return Response.json({ error: errorMessage }, { status: 500 })
  }
}
