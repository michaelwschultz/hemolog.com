import firebase from 'firebase/app'
import 'firebase/firestore';
// import initFirebase from 'utils/auth/initFirebase'
// import usePagination from "firestore-pagination-hook";
// import { useUser } from 'utils/auth/useUser'

import useFirestoreQuery, { FirestoreStatusType } from 'lib/hooks/useFirestoreQuery'

export interface Medication {
  brand?: string;
  costPerUnit?: number;
  lot?: number;
  units?: number;
}

export interface Infusion {
  timestamp: string;
  id: string;
  bleedReason?: string;
  prophy?: boolean;
  sites?: string[];
  medication?: Medication;
}

type FirestoreStatusTypes =
  FirestoreStatusType.IDLE |
  FirestoreStatusType.ERROR |
  FirestoreStatusType.SUCCESS |
  FirestoreStatusType.LOADING

interface InfusionResponse {
  data: Infusion[];
  status: FirestoreStatusTypes;
  error: Error;
}


export default function useInfusions(limit?: number, uid?: string): InfusionResponse {
  const db = firebase.firestore()
  // const { user } = useUser()
  // const userId = uid || user.uid

  // const query = db.collection('infusions').where('uid', '==', uid).limit(limit)

  const query = db.collection('infusions').limit(limit)

  const { data, status, error } = useFirestoreQuery(query)

  return {
    data,
    status,
    error
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