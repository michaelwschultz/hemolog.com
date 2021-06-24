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

async function getRecentUserInfusions(uid: string) {
  try {
    const snapshot = await adminFirestore
      .collection('infusions')
      .where('user.uid', '==', uid)
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
    console.log('lower', error)
    return { error }
  }
}

export { getAllInfusions, getInfusion, getRecentUserInfusions }
