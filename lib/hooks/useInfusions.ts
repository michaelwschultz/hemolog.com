import firebase from 'lib/firebase'
// import usePagination from "firestore-pagination-hook";
// import { useUser } from 'utils/auth/useUser'

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
  _uid?: string
): InfusionResponse {
  const db = firebase.firestore()
  // const { user } = useUser()
  // const userId = uid || user.uid

  // const query = db.collection('infusions').where('uid', '==', uid).limit(limit)

  const query = db.collection('infusions').limit(limit)

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
