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

async function getAllUserInfusions(uid: string) {
  const snapshot = await adminFirestore
    .collection('infusions')
    .where('userId', '==', uid)
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

export { getAllInfusions, getInfusion, getAllUserInfusions }
