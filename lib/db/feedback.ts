import firebase from 'lib/firebase'
import { AttachedUserType } from 'lib/types/users'

const firestore = firebase.firestore()

export interface FeedbackType {
  createdAt: string
  message: string
  user: AttachedUserType
}

function createFeedback(data: FeedbackType) {
  return firestore.collection('feedback').add(data)
}

function deleteFeedback(uid: string) {
  return firestore.collection('feedback').doc(uid).delete()
}

function updateFeedback(uid: string, newValues) {
  return firestore.collection('feedback').doc(uid).update(newValues)
}

export { createFeedback, deleteFeedback, updateFeedback }
