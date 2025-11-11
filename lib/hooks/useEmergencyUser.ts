import firebase from 'lib/firebase'
import useFirestoreQuery, {
  type FirestoreStatusType,
} from 'lib/hooks/useFirestoreQuery'
import type { Person } from 'lib/types/person'

// TODO move FirestoreStatusTypes to a more general place
type FirestoreStatusTypes = FirestoreStatusType

interface FirestoreUserResponse {
  person: Person
  status: FirestoreStatusTypes
  error: Error
}

export default function useEmergencyUser(
  alertId?: string | string[]
): FirestoreUserResponse {
  const db = firebase.firestore()

  const { data, status, error } = useFirestoreQuery(
    db
      .collection('users')
      .where('alertId', '==', alertId || '')
      .limit(1)
  )

  // biome-ignore lint/suspicious/noImplicitAnyLet: fix later
  let person
  if (data) {
    person = data[0]
  }

  return {
    person,
    status,
    error,
  }
}
