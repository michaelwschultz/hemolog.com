import { getAllInfusionsByApiKey } from 'lib/admin-db/infusions'
import { NextApiRequest, NextApiResponse } from 'next'

const recentInfusions = async (req: NextApiRequest, res: NextApiResponse) => {
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
  } catch (error: any) {
    return res.status(500).send(error.message)
  }
}

export default recentInfusions
