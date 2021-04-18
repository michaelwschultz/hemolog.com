import { auth } from 'lib/firebase-admin'
import { getAllFeedback } from 'lib/admin-db/feedback'
import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (!req.headers.token) {
      throw { message: 'Access denied. No user passed to endpoint.' }
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
    res.status(200).json(feedback)
  } catch (error) {
    res.status(500).json({ error })
  }
}
