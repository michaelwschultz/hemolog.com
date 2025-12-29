import { getAllInfusionsByApiKey } from '@/lib/admin-db/infusions'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const apikey = searchParams.get('apikey')

    if (!apikey) {
      throw { message: 'Access denied. Missing api key.' }
    }

    const { infusions, error } = await getAllInfusionsByApiKey(apikey)

    if (error) {
      throw error
    }

    return Response.json(infusions)
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
