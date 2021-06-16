import { setDoc, doc, getDoc, updateDoc } from 'firebase/firestore'
import { firestore } from 'lib/firebase'
import { AttachedUserType } from 'lib/types/users'

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

async function createOrUpdateInfusion(data: InfusionType) {
  if (data.uid) {
    const infusionRef = doc(firestore, 'infusions', data.uid)
    const exisitingInfusion = await getDoc(infusionRef)

    if (exisitingInfusion.exists()) {
      const infusionRef = doc(firestore, 'infusions', data.uid)
      // update the existing infusion
      await setDoc(infusionRef, data, { merge: true })
    }
  } else {
    // create a new infusion
    await setDoc(doc(firestore, 'infusions'), data)
  }
}

async function deleteInfusion(uid: string) {
  const infusionRef = doc(firestore, 'infusions', uid)
  await updateDoc(infusionRef, {
    deletedAt: new Date().toISOString(),
  })
}

export { createOrUpdateInfusion, deleteInfusion }
