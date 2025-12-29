import {
  createDocument,
  updateDocument,
  softDeleteDocument,
  getDocuments,
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

// Create a new infusion document
export async function createInfusion(data: TreatmentType): Promise<string> {
  const docId = await createDocument('infusions', data)
  return docId
}

// Soft delete an infusion (sets deletedAt timestamp)
export async function deleteInfusion(uid: string): Promise<void> {
  await softDeleteDocument('infusions', uid)
}

// Update an infusion document
export async function updateInfusion(
  uid: string,
  newValues: Partial<TreatmentType>
): Promise<void> {
  await updateDocument('infusions', uid, newValues)
}

// Fetch infusions for a user (used by TanStack Query)
export async function fetchInfusions(
  userUid: string
): Promise<TreatmentType[]> {
  const infusions = await getDocuments<TreatmentType>(
    'infusions',
    where('user.uid', '==', userUid),
    where('deletedAt', '==', null)
  )
  return infusions
}
