import { useMemo } from 'react'
import {
  firestore,
  collection,
  query,
  where,
  limit as firestoreLimit,
} from 'lib/firebase'
import useFirestoreQuery, {
  type FirestoreStatusType,
} from 'lib/hooks/useFirestoreQuery'
import type { Person } from 'lib/types/person'

// TODO move FirestoreStatusTypes to a more general place
type FirestoreStatusTypes = FirestoreStatusType

interface FirestoreUserResponse {
  person: Person | null
  status: FirestoreStatusTypes
  error: Error | null
}

export default function useEmergencyUser(
  alertId?: string | string[]
): FirestoreUserResponse {
  // Normalize alertId to string
  const normalizedAlertId = Array.isArray(alertId) ? alertId[0] : alertId

  // Memoize the query to prevent unnecessary re-subscriptions
  const firestoreQuery = useMemo(() => {
    const db = firestore.instance
    if (!db) {
      return null
    }

    return query(
      collection(db, 'users'),
      where('alertId', '==', normalizedAlertId || ''),
      firestoreLimit(1)
    )
  }, [normalizedAlertId])

  const { data, status, error } = useFirestoreQuery(firestoreQuery)

  let person: Person | undefined
  if (data && Array.isArray(data) && data.length > 0) {
    person = data[0] as Person
  }

  return {
    person: person ?? null,
    status,
    error: error ?? null,
  }
}
