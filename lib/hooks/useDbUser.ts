import firebase from 'lib/firebase'
import useFirestoreQuery, {
  FirestoreStatusType,
} from 'lib/hooks/useFirestoreQuery'

// TODO(michael) move FirestoreStatusTypes to a more general place
type FirestoreStatusTypes = FirestoreStatusType

export interface Person {
  alertId: string
  name?: string
  uid: string
  photoUrl?: string
  hemophiliaType?: string
  severity?: string
  medication?: string
  factor?: number
}

interface FirestoreUserResponse {
  person: Person
  status: FirestoreStatusTypes
  error: Error
}

export default function useDbUser(
  uid: string | string[],
): FirestoreUserResponse {
  const db = firebase.firestore()

  const { data, status, error } = useFirestoreQuery(
    db
      .collection('users')
      .where('uid', '==', uid || '')
      .limit(1),
  )

  let person: Person
  if (data) {
    person = data[0]
  }

  return {
    person,
    status,
    error,
  }
}
