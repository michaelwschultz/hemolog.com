import { getRecentUserInfusions } from 'lib/admin-db/infusions'
import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { token } = req.headers
    if (!token) {
      throw { message: 'Access denied. Missing valid token.' }
    }

    const { infusions, error } = await getRecentUserInfusions(token as string)

    if (error) {
      throw error
    }

    return res.status(200).json(infusions)
  } catch (error) {
    return res.status(500).send(error.message)
  }
}
