import {
  createDocument,
  deleteDocument,
  updateDocument,
} from '@/lib/firestore-lite'
import type { AttachedUserType } from '@/lib/types/users'

export interface FeedbackType {
  uid?: string
  createdAt: string
  message: string
  user: AttachedUserType
}

// Create a new feedback document
export async function createFeedback(data: FeedbackType): Promise<string> {
  const docId = await createDocument('feedback', data)
  return docId
}

// Delete a feedback document (hard delete)
export async function deleteFeedback(uid: string): Promise<void> {
  await deleteDocument('feedback', uid)
}

// Update a feedback document
export async function updateFeedback(
  uid: string,
  newValues: Partial<FeedbackType>
): Promise<void> {
  await updateDocument('feedback', uid, newValues)
}
