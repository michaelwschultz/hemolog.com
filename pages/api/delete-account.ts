import type { NextApiRequest, NextApiResponse } from 'next'

import { auth } from 'lib/firebase-admin'
import { deleteUserAndData } from 'lib/admin-db/users'

const deleteAccount = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'DELETE') {
    return res.status(405).send('Requires DELETE method.')
  }

  try {
    const token = req.headers.token

    if (!token || typeof token !== 'string') {
      throw new Error('Access denied. Missing valid token.')
    }

    const { uid } = await auth.verifyIdToken(token)

    if (!uid) {
      throw new Error('Access denied. Invalid token.')
    }

    await deleteUserAndData(uid)

    return res.status(200).json({ success: true })
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unable to delete account.'
    return res.status(500).send(errorMessage)
  }
}

export default deleteAccount
