import { adminFirestore } from 'lib/firebase-admin'
import { compareDesc, parseISO } from 'date-fns'

async function getAllInfusions() {
  const snapshot = await adminFirestore.collection('infusions').get()

  const infusions: any = []

  snapshot.forEach((doc) => {
    infusions.push({ id: doc.id, ...doc.data() })
  })

  return { infusions }
}

async function getInfusion(infusionId: string) {
  const snapshot = await adminFirestore
    .collection('infusions')
    .where('uid', '==', infusionId)
    .get()
  const infusions: any = []

  snapshot.forEach((doc) => {
    infusions.push({ id: doc.id, ...doc.data() })
  })

  infusions.sort((a: any, b: any) =>
    compareDesc(parseISO(a.createdAt), parseISO(b.createdAt))
  )

  return { infusions }
}

async function getRecentUserInfusionsByApiKey(apiKey: string) {
  try {
    const userSnapshot = await adminFirestore
      .collection('users')
      .where('apiKey', '==', apiKey)
      .limit(1)
      .get()

    if (!userSnapshot.docs[0]) {
      throw new Error(
        'Invalid API key. Reset your key on your profile page at Hemolog.com'
      )
    }
    const user = userSnapshot.docs[0].data()

    const snapshot = await adminFirestore
      .collection('infusions')
      .where('user.uid', '==', user.uid)
      .where('deletedAt', '==', null)
      // TODO: Need to add a timestamp value to each infusion and replace createdAt
      // .orderBy('timestamp', 'asc')
      // .limitToLast(3)
      .get()

    const infusions: any = []

    snapshot.forEach((doc) => {
      infusions.push({ id: doc.id, ...doc.data() })
    })

    // TODO: remove this hack after fixing the orderBy issue above
    infusions.sort((a: any, b: any) =>
      compareDesc(parseISO(a.createdAt), parseISO(b.createdAt))
    )
    infusions.length = 3

    return { infusions }
  } catch (error) {
    return { error }
  }
}

export { getAllInfusions, getInfusion, getRecentUserInfusionsByApiKey }
