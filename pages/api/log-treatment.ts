import {
  getRecentUserInfusionsByApiKey,
  postInfusionByApiKey,
} from 'lib/admin-db/infusions'
import { getApiKeyFromRequest } from 'lib/api-auth'
import type { NextApiRequest, NextApiResponse } from 'next'

const logTreatment = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Requires POST method.')
  }

  try {
    // SECURITY: Pull from the Authorization header when present,
    // falling back to the query param for backward compatibility.
    const apikey = getApiKeyFromRequest(req)
    if (!apikey) {
      throw { message: 'Access denied. Missing api key.' }
    }

    if (!req.body) {
      throw { message: 'Missing infusion data.' }
    }

    const { infusions, error } = await getRecentUserInfusionsByApiKey(
      apikey as string
    )

    if (error) throw error

    const mostRecentInfusion =
      infusions && infusions.length > 0 ? infusions[0] : null

    try {
      const { infusion, error } = await postInfusionByApiKey(
        apikey as string,
        mostRecentInfusion,
        req.body
      )
      if (error) throw error
      return res.status(200).json(infusion)
    } catch (error: unknown) {
      const errorMessage =
        error &&
        typeof error === 'object' &&
        'message' in error &&
        typeof error.message === 'string'
          ? error.message
          : 'An error occurred'
      return res.status(500).send(errorMessage)
    }
  } catch (error: unknown) {
    const errorMessage =
      error &&
      typeof error === 'object' &&
      'message' in error &&
      typeof error.message === 'string'
        ? error.message
        : 'An error occurred'
    return res.status(500).send(errorMessage)
  }
}

export default logTreatment
