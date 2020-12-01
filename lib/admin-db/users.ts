import { adminFirestore } from 'lib/firebase-admin'
import { compareAsc, parseISO } from 'date-fns'

async function getUser(uid: string) {
  try {
    const snapshot = await adminFirestore
      .collection('infusions')
      .where('userId', '==', uid)
      .get()

    const feedback = []

    snapshot.forEach((doc) => {
      feedback.push({ id: doc.id, ...doc.data() })
    })

    feedback.sort((a, b) =>
      compareAsc(parseISO(a.createdAt), parseISO(b.createdAt))
    )

    return { feedback }
  } catch (error) {
    return { error }
  }
}

export { getUser }
