import { compareDesc, parseISO } from 'date-fns'
import { adminFirestore } from '@/lib/firebase-admin'
import type { AttachedUserType } from '@/lib/types/users'
import { type TreatmentType, TreatmentTypeEnum } from '../db/treatments'

async function getAllTreatments() {
  const snapshot = await adminFirestore.collection('infusions').get()

  const treatments: TreatmentType[] = []

  snapshot.forEach((doc) => {
    treatments.push({ id: doc.id, ...doc.data() } as TreatmentType & {
      id: string
    })
  })

  return { treatments }
}

async function getTreatment(treatmentId: string) {
  const snapshot = await adminFirestore
    .collection('infusions')
    .where('uid', '==', treatmentId)
    .get()
  const treatments: TreatmentType[] = []

  snapshot.forEach((doc) => {
    treatments.push({ id: doc.id, ...doc.data() } as TreatmentType & {
      id: string
    })
  })

  treatments.sort((a: TreatmentType, b: TreatmentType) =>
    compareDesc(parseISO(a.createdAt), parseISO(b.createdAt))
  )

  return { treatments }
}

async function getAllTreatmentsByApiKey(apiKey: string) {
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
      .orderBy('date', 'desc')
      .get()

    const treatments: TreatmentType[] = []

    snapshot.forEach((doc) => {
      treatments.push({ id: doc.id, ...doc.data() } as TreatmentType & {
        id: string
      })
    })

    return { treatments }
  } catch (error) {
    return { error }
  }
}

async function getRecentUserTreatmentsByApiKey(
  apiKey?: string,
  alertId?: string
) {
  try {
    const userSnapshot = await adminFirestore
      .collection('users')
      .where(alertId ? 'alertId' : 'apiKey', '==', alertId || apiKey)
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
      // TODO: Need to add a timestamp value to each treatment and replace createdAt
      // .orderBy('timestamp', 'asc')
      // .limitToLast(3)
      .get()

    const treatments: TreatmentType[] = []

    // TODO: Find out why I was adding an id here.
    // The doc.id should already be available as the uid.
    // Removing for now.
    snapshot.forEach((doc) => {
      // treatments.push({ id: doc.id, ...doc.data() })
      treatments.push(doc.data() as TreatmentType)
    })

    // TODO: remove this hack after fixing the orderBy issue above
    treatments.sort((a: TreatmentType, b: TreatmentType) =>
      compareDesc(parseISO(a.createdAt), parseISO(b.createdAt))
    )
    treatments.length = 3

    return { treatments }
  } catch (error) {
    return { error }
  }
}

async function postTreatmentByApiKey(
  apiKey: string,
  lastTreatment: TreatmentType | null,
  newTreatment: Partial<TreatmentType>
) {
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

    const userDoc = userSnapshot.docs[0]
    const baseUser: AttachedUserType = {
      email: userDoc.data().email || '',
      name: userDoc.data().name || userDoc.data().displayName || '',
      photoUrl: userDoc.data().photoUrl || '',
      uid: userDoc.data().uid || userDoc.id,
    }

    const now = new Date().toISOString()
    const baseTreatment: TreatmentType = lastTreatment
      ? { ...lastTreatment }
      : {
          cause: '',
          createdAt: now,
          date: newTreatment.date || now.slice(0, 10),
          deletedAt: null,
          medication: {
            brand: newTreatment.medication?.brand || '',
            costPerUnit: newTreatment.medication?.costPerUnit,
            lot: newTreatment.medication?.lot,
            units: newTreatment.medication?.units || 0,
          },
          sites: '',
          type: newTreatment.type || TreatmentTypeEnum.PROPHY,
          user: (newTreatment.user as AttachedUserType) || baseUser,
        }

    const sanitizedBase = {
      ...baseTreatment,
      createdAt: now,
      cause: baseTreatment.cause || '',
      sites: baseTreatment.sites || '',
      deletedAt: null,
      user: baseTreatment.user || baseUser,
    }

    delete (sanitizedBase as Partial<TreatmentType>).uid

    const treatment: TreatmentType = {
      ...sanitizedBase,
      ...newTreatment,
      user: (newTreatment.user as AttachedUserType) || sanitizedBase.user,
      medication: {
        ...sanitizedBase.medication,
        ...(newTreatment.medication || {}),
      },
      createdAt: now,
      deletedAt: null,
    }

    await adminFirestore
      .collection('infusions')
      .add(treatment)
      .then((docRef) => {
        docRef.set({ uid: docRef.id, ...treatment })
      })

    return { treatment: { message: 'Success' } }
  } catch (error) {
    return { error }
  }
}

export {
  getAllTreatments,
  getAllTreatmentsByApiKey,
  getTreatment,
  getRecentUserTreatmentsByApiKey,
  postTreatmentByApiKey,
}
