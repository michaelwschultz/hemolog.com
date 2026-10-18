import { getRecentUserInfusionsByApiKey } from 'lib/admin-db/infusions'
import { getApiKeyFromRequest } from 'lib/api-auth'
import type { NextApiRequest, NextApiResponse } from 'next'

const recentTreatments = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).send('Requires GET method.')
  }
  try {
    // SECURITY: Pull from the Authorization header when present,
    // falling back to the query param for backward compatibility.
    const apikey = getApiKeyFromRequest(req)
    const { alertid } = req.query
    if (!apikey && !alertid) {
      throw { message: 'Access denied. Missing api key.' }
    }

    const { infusions, error } = await getRecentUserInfusionsByApiKey(
      apikey as string,
      alertid as string
    )

    if (error) {
      throw error
    }

    return res.status(200).json(infusions)
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

export default recentTreatments
