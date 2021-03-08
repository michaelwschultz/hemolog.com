import { auth } from 'lib/firebase-admin'
import { getAllFeedback } from 'lib/admin-db/feedback'

export default async (req, res) => {
  try {
    if (!req.headers.token) {
      throw { message: 'Access denied. No user passed to endpoint.' }
    }

    const { uid } = await auth.verifyIdToken(req.headers.token)
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
