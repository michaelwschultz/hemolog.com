// db-admin.ts
// Contains methods that fetch data accross users or without the need for a [userId].

import { compareDesc, compareAsc, parseISO } from 'date-fns'

import { db } from 'lib/firebase-admin'

export async function getAllFeedback() {
  try {
    let ref = db.collection('feedback')
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

export async function getInfusion(infusionId) {
  const doc = await db.collection('infusions').doc(infusionId).get()
  const infusion = { id: doc.id, ...doc.data() }

  return { infusion }
}

export async function getAllSites() {
  const snapshot = await db.collection('sites').get()

  const sites = []

  snapshot.forEach((doc) => {
    sites.push({ id: doc.id, ...doc.data() })
  })

  return { sites }
}

export async function getUserInfusions(uid) {
  const snapshot = await db
    .collection('sites')
    .where('authorId', '==', uid)
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
