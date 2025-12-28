import { useMemo } from 'react'
import { firestore, collection, query, where } from 'lib/firebase'
import { useAuth } from 'lib/auth'
import { compareDesc } from 'date-fns'

import useFirestoreQuery, {
  type FirestoreStatusType,
} from 'lib/hooks/useFirestoreQuery'
import type { TreatmentType } from 'lib/db/infusions'

type FirestoreStatusTypes = FirestoreStatusType

interface InfusionResponse {
  data: TreatmentType[]
  status: FirestoreStatusTypes
  error: Error | null
}

export default function useInfusions(
  limit?: number,
  uid?: string
): InfusionResponse {
  const { user } = useAuth()
  const userUid = user ? user.uid : uid

  // Memoize the query to prevent unnecessary re-subscriptions
  const firestoreQuery = useMemo(() => {
    const db = firestore.instance
    if (!db || !userUid) {
      return null
    }

    return query(
      collection(db, 'infusions'),
      where('user.uid', '==', userUid),
      where('deletedAt', '==', null)
    )
  }, [userUid])

  const {
    data: unsortedData,
    status,
    error,
  } = useFirestoreQuery<TreatmentType[]>(firestoreQuery)

  if (error) {
    console.error('NEW ERROR', error)
  }

  // NOTE(Michael) sorts infusions by date (newest to oldest)
  const data: TreatmentType[] = useMemo(() => {
    const arr: TreatmentType[] = Array.isArray(unsortedData) ? unsortedData : []

    if (arr.length > 0) {
      const sorted = [...arr].sort((a: TreatmentType, b: TreatmentType) =>
        compareDesc(new Date(a.date), new Date(b.date))
      )

      if (limit) {
        return sorted.slice(0, limit)
      }
      return sorted
    }

    return arr
  }, [unsortedData, limit])

  return {
    data,
    status,
    error: error ?? null,
  }
}
