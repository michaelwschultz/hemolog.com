import firebase from 'lib/firebase'
import useFirestoreQuery, {
  FirestoreStatusType,
} from 'lib/hooks/useFirestoreQuery'
import { Person } from 'lib/types/person'

// TODO(michaelwschultz): move FirestoreStatusTypes to a more general place
type FirestoreStatusTypes = FirestoreStatusType

interface FirestoreUserResponse {
  person: Person | null
  status: FirestoreStatusTypes
  error: Error
}

export default function useDbUser(
  uid: string | string[]
): FirestoreUserResponse {
  const db = firebase.firestore()

  // TODO(michaelwschultz): This hook is causing more problems than it's worth
  // by caching the value it's causing FOOD (flash of outdated data).
  // Replace this with the new Firebase v9 hooks
  const { data, status, error } = useFirestoreQuery(
    db.collection('users').where('uid', '==', uid)
  )

  let person: Person | null = null
  if (data) {
    person = data[0]
  }

  return {
    person,
    status,
    error,
  }
}
