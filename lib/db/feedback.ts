import {
  firestore,
  collection,
  doc,
  addDoc,
  deleteDoc,
  updateDoc,
} from 'lib/firebase'
import type { AttachedUserType } from 'lib/types/users'

export interface FeedbackType {
  createdAt: string
  message: string
  user: AttachedUserType
}

function createFeedback(data: FeedbackType) {
  const db = firestore.instance
  if (!db) {
    console.error('Firestore not available')
    return Promise.resolve({ id: '' })
  }

  return addDoc(collection(db, 'feedback'), data)
}

function deleteFeedback(uid: string) {
  const db = firestore.instance
  if (!db) {
    console.error('Firestore not available')
    return Promise.resolve()
  }

  return deleteDoc(doc(collection(db, 'feedback'), uid))
}

function updateFeedback(uid: string, newValues: Partial<FeedbackType>) {
  const db = firestore.instance
  if (!db) {
    console.error('Firestore not available')
    return Promise.resolve()
  }

  return updateDoc(doc(collection(db, 'feedback'), uid), newValues)
}

export { createFeedback, deleteFeedback, updateFeedback }
