import firebase from 'firebase/app'
import 'firebase/firestore';
import useFirestoreQuery, { FirestoreStatusType } from 'lib/hooks/useFirestoreQuery'

// TODO move FirestoreStatusTypes to a more general place
type FirestoreStatusTypes = FirestoreStatusType

export interface Person {
  alertId: string;
  name?: string;
  uid: string;
  photoUrl?: string;
}

interface InfusionResponse {
  person: Person;
  status: FirestoreStatusTypes;
  error: Error;
}

export default function useGetEmergencyUser(alertId: string | string[]): InfusionResponse {
  const db = firebase.firestore()

  const { data, status, error } = useFirestoreQuery(
    db.collection('users').where('alertId', '==', alertId || '').limit(1)
  )

  let person
  if (data) {
    person = data[0]
  }

  return {
    person,
    status,
    error
  }
}