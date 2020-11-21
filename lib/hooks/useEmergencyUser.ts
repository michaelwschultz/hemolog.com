import { ExecFileOptionsWithStringEncoding } from 'child_process';
import firebase from 'firebase/app'
import 'firebase/firestore';
import useFirestoreQuery, { FirestoreStatusType } from 'lib/hooks/useFirestoreQuery'

// TODO move FirestoreStatusTypes to a more general place
type FirestoreStatusTypes =
  FirestoreStatusType.IDLE |
  FirestoreStatusType.ERROR |
  FirestoreStatusType.SUCCESS |
  FirestoreStatusType.LOADING

interface User {
  alertId: string;
  name?: string;
  uid: string;
}

interface InfusionResponse {
  data: User;
  status: FirestoreStatusTypes;
  error: Error;
}

export default function useGetEmergencyUser(alertId: string | string[]): InfusionResponse {
  const db = firebase.firestore()

  console.log('ALERT ID', alertId)

  const { data, status, error } = useFirestoreQuery(
    db.collection('users').where('alertId', '==', 'mws29')
  )

  return {
    data,
    status,
    error
  }
}