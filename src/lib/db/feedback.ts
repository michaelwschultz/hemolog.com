import { createDocument } from '@/lib/firestore-lite'
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
