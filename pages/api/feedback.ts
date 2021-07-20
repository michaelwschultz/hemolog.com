import { auth } from 'lib/firebase-admin'
import { getAllFeedback } from 'lib/admin-db/feedback'
import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (!req.headers.token) {
      throw { message: 'Access denied. Missing valid token.' }
    }

    const { uid } = await auth.verifyIdToken(req.headers.token as string)
    if (!uid) {
      throw {
        message: `Invalid token`,
      }
    }

    const { feedback, error } = await getAllFeedback()

    if (error) {
      throw error
    }

    return res.status(200).json(feedback)
  } catch (error) {
    return res.status(500).send(error.message)
  }
}
