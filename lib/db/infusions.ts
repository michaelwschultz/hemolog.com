import { firestore } from 'lib/firebase'
import { AttachedUserType } from 'lib/types/users'

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

// NOTE(michael) this might be a bad way of adding the doc id.
// Probably worth searching for another solution.
function createInfusion(data: TreatmentType) {
  return firestore
    .collection('infusions')
    .add(data)
    .then((docRef) => {
      docRef.set({ uid: docRef.id, ...data }, { merge: true })
    })
}

function deleteInfusion(uid: string) {
  return firestore
    .collection('infusions')
    .doc(uid)
    .set({ deletedAt: new Date().toISOString() }, { merge: true })
}

async function updateInfusion(uid: string, newValues: Partial<TreatmentType>) {
  return firestore.collection('infusions').doc(uid).update(newValues)
}

export { createInfusion, deleteInfusion, updateInfusion }
