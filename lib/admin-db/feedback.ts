import { adminFirestore } from 'lib/firebase-admin'
import { compareAsc, parseISO } from 'date-fns'

async function getAllFeedback() {
  try {
    const snapshot = await adminFirestore.collection('feedback').get()
    const feedback = []

    snapshot.forEach(async (doc) => {
      const data = { ...doc.data() }
      feedback.push(data)
    })

    feedback.sort((a, b) =>
      compareAsc(parseISO(a.createdAt), parseISO(b.createdAt))
    )

    return { feedback }
  } catch (error) {
    return { error }
  }
}

async function getUserFeedback(userId: string) {
  try {
    let ref = adminFirestore
      .collection('feedback')
      .where('user.uid', '==', userId)
    const snapshot = await ref.get()
    const feedback = []

    snapshot.forEach((doc) => {
      feedback.push({ ...doc.data() })
    })

    feedback.sort((a, b) =>
      compareAsc(parseISO(a.createdAt), parseISO(b.createdAt))
    )

    return { feedback }
  } catch (error) {
    return { error }
  }
}

export { getAllFeedback, getUserFeedback }
