import { adminFirestore } from 'lib/firebase-admin'
import { compareDesc, parseISO } from 'date-fns'

import { TreatmentTypeEnum, type TreatmentType } from '../db/infusions'
import type { AttachedUserType } from 'lib/types/users'

async function getAllInfusions() {
  const snapshot = await adminFirestore.collection('infusions').get()

  const infusions: TreatmentType[] = []

  snapshot.forEach((doc) => {
    infusions.push({ id: doc.id, ...doc.data() } as TreatmentType & {
      id: string
    })
  })

  return { infusions }
}

async function getInfusion(infusionId: string) {
  const snapshot = await adminFirestore
    .collection('infusions')
    .where('uid', '==', infusionId)
    .get()
  const infusions: TreatmentType[] = []

  snapshot.forEach((doc) => {
    infusions.push({ id: doc.id, ...doc.data() } as TreatmentType & {
      id: string
    })
  })

  infusions.sort((a: TreatmentType, b: TreatmentType) =>
    compareDesc(parseISO(a.createdAt), parseISO(b.createdAt))
  )

  return { infusions }
}

async function getAllInfusionsByApiKey(apiKey: string) {
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

    const infusions: TreatmentType[] = []

    snapshot.forEach((doc) => {
      infusions.push({ id: doc.id, ...doc.data() } as TreatmentType & {
        id: string
      })
    })

    return { infusions }
  } catch (error) {
    return { error }
  }
}

async function getRecentUserInfusionsByApiKey(
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
      // TODO: Need to add a timestamp value to each infusion and replace createdAt
      // .orderBy('timestamp', 'asc')
      // .limitToLast(3)
      .get()

    const infusions: TreatmentType[] = []

    // TODO: Find out why I was adding an id here.
    // The doc.id should already be available as the uid.
    // Removing for now.
    snapshot.forEach((doc) => {
      // infusions.push({ id: doc.id, ...doc.data() })
      infusions.push(doc.data() as TreatmentType)
    })

    // TODO: remove this hack after fixing the orderBy issue above
    infusions.sort((a: TreatmentType, b: TreatmentType) =>
      compareDesc(parseISO(a.createdAt), parseISO(b.createdAt))
    )
    infusions.length = 3

    return { infusions }
  } catch (error) {
    return { error }
  }
}

async function postInfusionByApiKey(
  apiKey: string,
  lastInfusion: TreatmentType | null,
  newInfusion: Partial<TreatmentType>
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
    const baseInfusion: TreatmentType = lastInfusion
      ? { ...lastInfusion }
      : {
          cause: '',
          createdAt: now,
          date: newInfusion.date || now.slice(0, 10),
          deletedAt: null,
          medication: {
            brand: newInfusion.medication?.brand || '',
            costPerUnit: newInfusion.medication?.costPerUnit,
            lot: newInfusion.medication?.lot,
            units: newInfusion.medication?.units || 0,
          },
          sites: '',
          type: newInfusion.type || TreatmentTypeEnum.PROPHY,
          user: (newInfusion.user as AttachedUserType) || baseUser,
        }

    const sanitizedBase = {
      ...baseInfusion,
      createdAt: now,
      cause: baseInfusion.cause || '',
      sites: baseInfusion.sites || '',
      deletedAt: null,
      user: baseInfusion.user || baseUser,
    }

    delete (sanitizedBase as Partial<TreatmentType>).uid

    const infusion: TreatmentType = {
      ...sanitizedBase,
      ...newInfusion,
      user: (newInfusion.user as AttachedUserType) || sanitizedBase.user,
      medication: {
        ...sanitizedBase.medication,
        ...(newInfusion.medication || {}),
      },
      createdAt: now,
      deletedAt: null,
    }

    await adminFirestore
      .collection('infusions')
      .add(infusion)
      .then((docRef) => {
        docRef.set({ uid: docRef.id, ...infusion })
      })

    return { infusion: { message: 'Success' } }
  } catch (error) {
    return { error }
  }
}

export {
  getAllInfusions,
  getAllInfusionsByApiKey,
  getInfusion,
  getRecentUserInfusionsByApiKey,
  postInfusionByApiKey,
}
