import firebase from 'lib/firebase'
import { useAuth } from 'lib/auth'
import { compareDesc } from 'date-fns'

import useFirestoreQuery, {
  FirestoreStatusType,
} from 'lib/hooks/useFirestoreQuery'
import { InfusionType } from 'lib/db/infusions'

type FirestoreStatusTypes =
  | FirestoreStatusType.IDLE
  | FirestoreStatusType.ERROR
  | FirestoreStatusType.SUCCESS
  | FirestoreStatusType.LOADING

interface InfusionResponse {
  data: InfusionType[]
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

  const { data, status, error } = useFirestoreQuery(query)

  // NOTE(Michael) sorts infusions by date (newest to oldest)
  if (data) {
    data.sort((a: any, b: any) =>
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
