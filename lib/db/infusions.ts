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
  createdAt: string
  medication: Medication
  sites: string
  cause: string
  type: InfusionTypeOptions
  user: AttachedUserType
}

function createInfusion(data: InfusionType) {
  return firestore.collection('infusions').add(data)
}

function deleteInfusion(uid: string) {
  return firestore.collection('infusions').doc(uid).delete()
}

async function updateInfusion(uid: string, newValues) {
  return firestore.collection('infusions').doc(uid).update(newValues)
}

export { createInfusion, deleteInfusion, updateInfusion }
