import firebase from 'lib/firebase'
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
  error: Error
}

export default function useInfusions(
  limit?: number,
  uid?: string
): InfusionResponse {
  const db = firebase.firestore()
  const { user } = useAuth()

  // TODO(michael) orderBy createdAt
  // this isn't working right now becuase Firebase
  // can't read the isostring format
  const query = db
    .collection('infusions')
    .where('user.uid', '==', user ? user.uid : uid)
    .where('deletedAt', '==', null)

  const { data: unsortedData, status, error } = useFirestoreQuery(query)

  // NOTE(Michael) sorts infusions by date (newest to oldest)
  const data = unsortedData

  if (data) {
    data.sort((a: TreatmentType, b: TreatmentType) =>
      compareDesc(new Date(a.date), new Date(b.date))
    )

    // For now, I've moved the limiting into the useFirestoreQuery
    // method, this works ok but would be better to fix here long term
    if (limit) {
      data.length = limit
    }
  }

  return {
    data,
    status,
    error,
  }
}
