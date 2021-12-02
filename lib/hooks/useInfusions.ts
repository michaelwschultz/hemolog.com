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

  let query = db
    .collection('infusions')
    .where('user.uid', '==', user ? user.uid : uid)
    .where('deletedAt', '==', null)
    .orderBy('date', 'desc')

  if (limit) {
    query = db
      .collection('infusions')
      .where('user.uid', '==', user ? user.uid : uid)
      .where('deletedAt', '==', null)
      .orderBy('date', 'desc')
      .limit(limit)
  }

  const { data, status, error } = useFirestoreQuery(query)

  // NOTE(Michael) sorts infusions by date (newest to oldest)
  if (data) {
    data.sort((a: any, b: any) =>
      compareDesc(new Date(a.date), new Date(b.date))
    )
  }

  return {
    data,
    status,
    error,
  }
}
