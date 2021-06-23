import { firestore } from 'lib/firebase'
import { doc, query, collection, where } from 'firebase/firestore'
// import usePagination from "firestore-pagination-hook";
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
  const { user } = useAuth()

  // TODO: add a query here instead of a ref
  const infusionRef = doc(firestore, 'infusions', user ? user.uid : uid)

  const q = query(
    collection(firestore, 'infusions'),
    where('capital', '==', true)
  )

  const infusionSnapshot = await getDoc(userRef)

  // TODO(michael) orderBy createdAt
  // this isn't working right now becuase Firebase
  // can't read the isostring format
  const oldq = firestore
    .collection('infusions')
    .where('user.uid', '==', user ? user.uid : uid)
    .where('deletedAt', '==', null)

  const { data, status, error } = useFirestoreQuery(infusionSnapshot)

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
