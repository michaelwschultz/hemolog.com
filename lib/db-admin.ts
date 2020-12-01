// db-admin.ts
// Contains methods that fetch data accross users or without the need for a [userId].

import { compareDesc, compareAsc, parseISO } from 'date-fns'
import { db } from 'lib/firebase-admin'

export interface Feedback {
  createdAt: string
  message: string
  userId: string
}

export async function getUser(uid: string) {
  try {
    const snapshot = await db
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

export async function getAllFeedback() {
  try {
    const snapshot = await db.collection('feedback').get()
    const feedback = []

    snapshot.forEach(async (doc) => {
      const data = { id: doc.id, ...doc.data() }
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

export async function getUserFeedback(uid: string) {
  try {
    let ref = db.collection('feedback').where('userId', '==', uid)
    const snapshot = await ref.get()
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

export async function getAllInfusions() {
  const snapshot = await db.collection('infusions').get()

  const infusions = []

  snapshot.forEach((doc) => {
    infusions.push({ id: doc.id, ...doc.data() })
  })

  return { infusions }
}

export async function getInfusion(infusionId: string) {
  const snapshot = await db
    .collection('infusions')
    .where('uid', '==', infusionId)
    .get()
  const infusions = []

  snapshot.forEach((doc) => {
    infusions.push({ id: doc.id, ...doc.data() })
  })

  infusions.sort((a, b) =>
    compareDesc(parseISO(a.createdAt), parseISO(b.createdAt))
  )

  return { infusions }
}

export async function getUserInfusions(uid: string) {
  const snapshot = await db
    .collection('infusions')
    .where('userId', '==', uid)
    .get()

  const infusions = []

  snapshot.forEach((doc) => {
    infusions.push({ id: doc.id, ...doc.data() })
  })

  infusions.sort((a, b) =>
    compareDesc(parseISO(a.createdAt), parseISO(b.createdAt))
  )

  return { infusions }
}
