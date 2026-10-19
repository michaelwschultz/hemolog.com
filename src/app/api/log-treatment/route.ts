import type { NextRequest } from 'next/server'
import {
  getRecentUserTreatmentsByApiKey,
  postTreatmentByApiKey,
} from '@/lib/admin-db/treatments'
import { getApiKeyFromRequest } from '@/lib/api-auth'

export async function POST(request: NextRequest) {
  try {
    const apikey = getApiKeyFromRequest(request)

    if (!apikey) {
      throw { message: 'Access denied. Missing api key.' }
    }

    const body = await request.json()

    if (!body) {
      throw { message: 'Missing treatment data.' }
    }

    const { treatments, error } = await getRecentUserTreatmentsByApiKey(apikey)

    if (error) throw error

    const mostRecentTreatment =
      treatments && treatments.length > 0 ? treatments[0] : null

    try {
      const { treatment, error } = await postTreatmentByApiKey(
        apikey,
        mostRecentTreatment,
        body
      )
      if (error) throw error
      return Response.json(treatment)
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
