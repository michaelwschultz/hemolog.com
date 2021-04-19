import firebase from 'lib/firebase'
import { AttachedUserType } from 'lib/types/users'

const firestore = firebase.firestore()

export enum InfusionTypeEnum {
  PROPHY = 'PROPHY',
  BLEED = 'BLEED',
  PREVENTATIVE = 'PREVENTATIVE',
}

export type InfusionTypeOptions =
  | InfusionTypeEnum.PROPHY
  | InfusionTypeEnum.BLEED
  | InfusionTypeEnum.PREVENTATIVE

export interface Medication {
  brand: string
  costPerUnit?: number
  lot?: string
  units: number
}

export interface InfusionType {
  deletedAt: string | null
  uid?: string
  cause: string
  createdAt: string
  date: string
  medication: Medication
  sites: string
  type: InfusionTypeOptions
  user: AttachedUserType
}

// NOTE(michael) this might be a bad way of adding the doc id.
// Probably worth searching for another solution.
function createInfusion(data: InfusionType) {
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

async function updateInfusion(uid: string, newValues: Partial<InfusionType>) {
  return firestore.collection('infusions').doc(uid).update(newValues)
}

export { createInfusion, deleteInfusion, updateInfusion }
