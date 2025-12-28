import { getAllInfusionsByApiKey } from 'lib/admin-db/infusions'
import type { NextApiRequest, NextApiResponse } from 'next'

const treatments = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).send('Requires GET method.')
  }
  try {
    const { apikey } = req.query
    if (!apikey) {
      throw { message: 'Access denied. Missing api key.' }
    }

    const { infusions, error } = await getAllInfusionsByApiKey(apikey as string)

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

export default treatments
