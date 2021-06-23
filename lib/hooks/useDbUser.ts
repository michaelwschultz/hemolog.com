import { firestore } from 'lib/firebase'
import { doc, getDoc } from 'firebase/firestore'
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

export default async function useDbUser(uid: string) {
  const userRef = doc(firestore, 'users', uid)
  const userSnapshot = await getDoc(userRef)

  // TODO(michaelwschultz): This hook is causing more problems than it's worth
  // by caching the value it's causing FOOD (flash of outdated data).
  // Replace this with the new Firebase v9 hooks
  const { data, status, error } = useFirestoreQuery(userSnapshot)

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
