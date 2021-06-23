import {
  addDoc,
  collection,
  doc,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore'
import { firestore } from 'lib/firebase'
import { AttachedUserType } from 'lib/types/users'

export interface FeedbackType {
  createdAt: string
  message: string
  user: AttachedUserType
}

async function createFeedback(data: FeedbackType) {
  await addDoc(collection(firestore, 'feedback'), data)
}

async function deleteFeedback(uid: string) {
  const feedbackRef = doc(firestore, 'feedback', uid)
  await deleteDoc(feedbackRef)
}

async function updateFeedback(uid: string, newValues: any) {
  const feedbackRef = doc(firestore, 'feedback', uid)
  await updateDoc(feedbackRef, newValues)
}

export { createFeedback, deleteFeedback, updateFeedback }
