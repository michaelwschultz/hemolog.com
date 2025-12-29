import { compareAsc, compareDesc, parseISO } from 'date-fns'
import type { FeedbackType } from '@/lib/db/feedback'
import { adminFirestore } from '@/lib/firebase-admin'

async function getAllFeedback() {
  try {
    const snapshot = await adminFirestore.collection('feedback').get()
    const feedback: FeedbackType[] = []

    snapshot.forEach(async (doc) => {
      const data = doc.data() as FeedbackType
      feedback.push(data)
    })

    feedback.sort((a: FeedbackType, b: FeedbackType) =>
      compareDesc(parseISO(a.createdAt), parseISO(b.createdAt))
    )

    return { feedback }
  } catch (error) {
    return { error }
  }
}

async function getUserFeedback(userId: string) {
  try {
    const ref = adminFirestore
      .collection('feedback')
      .where('user.uid', '==', userId)
    const snapshot = await ref.get()
    const feedback: FeedbackType[] = []

    snapshot.forEach((doc) => {
      feedback.push(doc.data() as FeedbackType)
    })

    feedback.sort((a: FeedbackType, b: FeedbackType) =>
      compareAsc(parseISO(a.createdAt), parseISO(b.createdAt))
    )

    return { feedback }
  } catch (error) {
    return { error }
  }
}

export { getAllFeedback, getUserFeedback }
