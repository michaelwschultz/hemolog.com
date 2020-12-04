import firebase from 'lib/firebase'
// import usePagination from "firestore-pagination-hook";
import { useAuth } from 'lib/auth'

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
    // .orderBy('createdAt', 'desc')
    .limit(limit)

  const { data, status, error } = useFirestoreQuery(query)

  return {
    data,
    status,
    error,
  }
}

//   const {
//     loading,
//     loadingError,
//     loadingMore,
//     loadingMoreError,
//     hasMore,
//     items,
//     loadMore
//   } = usePagination(
//     db
//       .collection("infusions")
//       .orderBy("id", "asc"),
//     {
//       limit: 1
//     }
//   );

//   return {
//     loading,
//     loadingError,
//     loadingMore,
//     loadingMoreError,
//     hasMore,
//     items,
//     loadMore
//   }
// }
