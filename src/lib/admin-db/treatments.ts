import { compareDesc, parseISO } from 'date-fns'
import { findActiveApiKey } from '@/lib/admin-db/apiKeys'
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
    const apiKeyEntry = await findActiveApiKey(apiKey)

    if (!apiKeyEntry) {
      throw new Error(
        'Invalid or revoked API key. Manage your keys on your profile page at Hemolog.com'
      )
    }
    const uid = apiKeyEntry.uid

    const snapshot = await adminFirestore
      .collection('infusions')
      .where('user.uid', '==', uid)
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
    let uid = ''

    if (alertId) {
      const userSnapshot = await adminFirestore
        .collection('users')
        .where('alertId', '==', alertId)
        .limit(1)
        .get()
      if (!userSnapshot.docs[0]) {
        throw new Error(
          'Invalid alert ID. Check the link on your emergency card at Hemolog.com'
        )
      }
      uid = userSnapshot.docs[0].id
    } else {
      const apiKeyEntry = apiKey ? await findActiveApiKey(apiKey) : null
      if (!apiKeyEntry) {
        throw new Error(
          'Invalid or revoked API key. Manage your keys on your profile page at Hemolog.com'
        )
      }
      uid = apiKeyEntry.uid
    }

    const snapshot = await adminFirestore
      .collection('infusions')
      .where('user.uid', '==', uid)
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

    return { treatments: treatments.slice(0, 3) }
  } catch (error) {
    return { error }
  }
}

const TREATMENT_TYPES = new Set<string>(Object.values(TreatmentTypeEnum))

function isTreatmentType(value: unknown): value is TreatmentType['type'] {
  return typeof value === 'string' && TREATMENT_TYPES.has(value)
}

function isDateOnly(value: unknown): value is string {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
}

function finiteNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

function stringOrFallback(value: unknown, fallback: string): string {
  return typeof value === 'string' ? value : fallback
}

function buildLoggedTreatment(
  owner: AttachedUserType,
  lastTreatment: TreatmentType | null,
  incoming: Partial<TreatmentType>,
  now: string
): TreatmentType {
  const previousMedication = lastTreatment?.medication
  const incomingMedication = incoming.medication

  const units =
    finiteNumber(incomingMedication?.units) ??
    finiteNumber(previousMedication?.units) ??
    0

  const medication: TreatmentType['medication'] = {
    brand: stringOrFallback(
      incomingMedication?.brand,
      previousMedication?.brand || ''
    ),
    units,
  }

  const lot = stringOrFallback(
    incomingMedication?.lot,
    previousMedication?.lot ?? ''
  )
  if (lot) {
    medication.lot = lot
  }

  const costPerUnit =
    typeof incomingMedication?.costPerUnit === 'number' &&
    Number.isFinite(incomingMedication.costPerUnit)
      ? incomingMedication.costPerUnit
      : previousMedication?.costPerUnit
  if (typeof costPerUnit === 'number') {
    medication.costPerUnit = costPerUnit
  }

  const previousDate = lastTreatment?.date
  const fallbackDate = isDateOnly(previousDate)
    ? previousDate
    : now.slice(0, 10)
  const previousType = lastTreatment?.type

  return {
    cause: stringOrFallback(incoming.cause, lastTreatment?.cause || ''),
    createdAt: now,
    date: isDateOnly(incoming.date) ? incoming.date : fallbackDate,
    deletedAt: null,
    medication,
    sites: stringOrFallback(incoming.sites, lastTreatment?.sites || ''),
    type: isTreatmentType(incoming.type)
      ? incoming.type
      : isTreatmentType(previousType)
        ? previousType
        : TreatmentTypeEnum.PROPHY,
    user: owner,
  }
}

async function postTreatmentByApiKey(
  apiKey: string,
  lastTreatment: TreatmentType | null,
  newTreatment: Partial<TreatmentType>
) {
  try {
    const apiKeyEntry = await findActiveApiKey(apiKey)

    if (!apiKeyEntry) {
      throw new Error(
        'Invalid or revoked API key. Manage your keys on your profile page at Hemolog.com'
      )
    }

    const userSnapshot = await adminFirestore
      .collection('users')
      .where('uid', '==', apiKeyEntry.uid)
      .limit(1)
      .get()

    if (!userSnapshot.docs[0]) {
      throw new Error('User not found for the provided API key.')
    }

    const userDoc = userSnapshot.docs[0]
    const baseUser: AttachedUserType = {
      email: userDoc.data().email || '',
      name: userDoc.data().name || userDoc.data().displayName || '',
      photoUrl: userDoc.data().photoUrl || '',
      uid: userDoc.data().uid || userDoc.id,
    }

    const now = new Date().toISOString()
    const treatment = buildLoggedTreatment(
      baseUser,
      lastTreatment,
      newTreatment,
      now
    )

    const docRef = adminFirestore.collection('infusions').doc()
    await docRef.set({ ...treatment, uid: docRef.id })

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
