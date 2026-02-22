import {
  createDocument,
  getDocuments,
  softDeleteDocument,
  updateDocument,
  where,
} from '@/lib/firestore-lite'
import type { AttachedUserType } from '@/lib/types/users'

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

// Create a new treatment document
export async function createTreatment(data: TreatmentType): Promise<string> {
  const docId = await createDocument('infusions', data)
  return docId
}

// Soft delete a treatment (sets deletedAt timestamp)
export async function deleteTreatment(uid: string): Promise<void> {
  await softDeleteDocument('infusions', uid)
}

// Update a treatment document
export async function updateTreatment(
  uid: string,
  newValues: Partial<TreatmentType>
): Promise<void> {
  await updateDocument('infusions', uid, newValues)
}

// Fetch treatments for a user (used by TanStack Query)
export async function fetchTreatments(
  userUid: string
): Promise<TreatmentType[]> {
  const treatments = await getDocuments<TreatmentType>(
    'infusions',
    where('user.uid', '==', userUid),
    where('deletedAt', '==', null)
  )
  return treatments
}
