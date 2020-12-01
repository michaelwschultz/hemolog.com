import { auth } from 'lib/firebase-admin'
import { getAllFeedback } from 'lib/db-admin'

export default async (req, res) => {
  try {
    if (!req.headers.token) {
      throw { message: 'Access denied. No user passed to endpoint.' }
    }

    const { uid } = await auth.verifyIdToken(req.headers.token)
    if (uid !== process.env.MICHAELS_USER_ID) {
      throw {
        message: `You aren't Michael. Sorry but this is for his eyes only.`,
      }
    }

    const { feedback, error } = await getAllFeedback()

    if (error) {
      throw error
    }
    res.status(200).json(feedback)
  } catch (error) {
    // logger.error(
    //   {
    //     request: {
    //       headers: formatObjectKeys(req.headers),
    //       url: req.url,
    //       method: req.method
    //     },
    //     response: {
    //       statusCode: res.statusCode
    //     }
    //   },
    //   error.message
    // );

    res.status(500).json({ error })
  }
}
