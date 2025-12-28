import {
  firestore,
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
} from 'lib/firebase'
import type { AttachedUserType } from 'lib/types/users'

export enum TreatmentTypeEnum {
  PROPHY = 'PROPHY',
  BLEED = 'BLEED',
  PREVENTATIVE = 'PREVENTATIVE',
  ANTIBODY = 'ANTIBODY',
}

export type TreatmentTypeOptions =
  | TreatmentTypeEnum.PROPHY
  | TreatmentTypeEnum.BLEED
  | TreatmentTypeEnum.PREVENTATIVE
  | TreatmentTypeEnum.ANTIBODY

export interface Medication {
  brand: string
  costPerUnit?: number
  lot?: string
  units: number
}

export interface TreatmentType {
  deletedAt: string | null
  uid?: string
  cause: string
  createdAt: string
  date: string
  medication: Medication
  sites: string
  type: TreatmentTypeOptions
  user: AttachedUserType
}

// Helper to filter undefined values from objects (Firestore doesn't accept undefined)
function cleanUndefined<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined)
  ) as Partial<T>
}

// NOTE(michael) this might be a bad way of adding the doc id.
// Probably worth searching for another solution.
async function createInfusion(data: TreatmentType) {
  const db = firestore.instance
  if (!db) {
    console.error('Firestore not available')
    return
  }

  const cleanData = cleanUndefined(data)
  const infusionsRef = collection(db, 'infusions')
  const docRef = await addDoc(infusionsRef, cleanData)
  await setDoc(docRef, { uid: docRef.id, ...cleanData }, { merge: true })
}

function deleteInfusion(uid: string) {
  const db = firestore.instance
  if (!db) {
    console.error('Firestore not available')
    return Promise.resolve()
  }

  const infusionDocRef = doc(collection(db, 'infusions'), uid)
  return setDoc(
    infusionDocRef,
    { deletedAt: new Date().toISOString() },
    { merge: true }
  )
}

async function updateInfusion(uid: string, newValues: Partial<TreatmentType>) {
  const db = firestore.instance
  if (!db) {
    console.error('Firestore not available')
    return
  }

  const cleanValues = cleanUndefined(newValues)
  const infusionDocRef = doc(collection(db, 'infusions'), uid)
  return updateDoc(infusionDocRef, cleanValues)
}

export { createInfusion, deleteInfusion, updateInfusion }
