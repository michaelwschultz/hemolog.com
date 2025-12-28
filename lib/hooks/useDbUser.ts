import { useMemo } from 'react'
import { firestore, collection, query, where } from 'lib/firebase'
import useFirestoreQuery, {
  type FirestoreStatusType,
} from 'lib/hooks/useFirestoreQuery'
import type { Person } from 'lib/types/person'

// TODO(michaelwschultz): move FirestoreStatusTypes to a more general place
type FirestoreStatusTypes = FirestoreStatusType

interface FirestoreUserResponse {
  person: Person | null
  status: FirestoreStatusTypes
  error: Error | null
}

export default function useDbUser(
  uid: string | string[]
): FirestoreUserResponse {
  // Normalize uid to string
  const normalizedUid = Array.isArray(uid) ? uid[0] : uid

  // Memoize the query to prevent unnecessary re-subscriptions
  const firestoreQuery = useMemo(() => {
    const db = firestore.instance
    if (!db || !normalizedUid) {
      return null
    }

    return query(collection(db, 'users'), where('uid', '==', normalizedUid))
  }, [normalizedUid])

  const { data, status, error } = useFirestoreQuery(firestoreQuery)

  let person: Person | null = null
  if (data && Array.isArray(data) && data.length > 0) {
    person = data[0] as Person
  }

  return {
    person,
    status,
    error: error ?? null,
  }
}
