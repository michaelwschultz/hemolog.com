// Reducer for hook state and actions
import { useReducer, useEffect, useRef } from 'react'
import {
  onSnapshot,
  type Query,
  type DocumentReference,
  type QuerySnapshot,
  type DocumentSnapshot,
  type DocumentData,
} from 'firebase/firestore'

export enum FirestoreStatusType {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error',
}

interface Action<T = unknown> {
  type: FirestoreStatusType
  payload?: T
}

interface State<T = unknown> {
  status: FirestoreStatusType
  data: T | undefined
  error: Error | undefined
}

const reducer = <T>(_state: State<T>, action: Action<T>): State<T> => {
  switch (action.type) {
    case FirestoreStatusType.IDLE:
      return {
        status: FirestoreStatusType.IDLE,
        data: undefined,
        error: undefined,
      }
    case FirestoreStatusType.LOADING:
      return {
        status: FirestoreStatusType.LOADING,
        data: undefined,
        error: undefined,
      }
    case FirestoreStatusType.SUCCESS:
      return {
        status: FirestoreStatusType.SUCCESS,
        data: action.payload,
        error: undefined,
      }
    case FirestoreStatusType.ERROR:
      return {
        status: FirestoreStatusType.ERROR,
        data: undefined,
        error: action.payload as Error | undefined,
      }
    default:
      throw new Error('invalid action')
  }
}

type FirestoreQueryType =
  | Query<DocumentData, DocumentData>
  | DocumentReference<DocumentData, DocumentData>

// Hook
export default function useFirestoreQuery<T = unknown>(
  query: FirestoreQueryType | null | undefined
) {
  // Our initial state
  // Start with an "idle" status if query is falsy, as that means hook consumer is
  // waiting on required data before creating the query object.
  const initialState: State<T> = {
    status: query ? FirestoreStatusType.LOADING : FirestoreStatusType.IDLE,
    data: undefined,
    error: undefined,
  }

  // Setup our state and actions
  const [state, dispatch] = useReducer(reducer<T>, initialState)

  // Track the previous query to avoid re-subscribing unnecessarily
  const prevQueryRef = useRef<FirestoreQueryType | null | undefined>(null)

  useEffect(() => {
    // Return early if query is falsy and reset to "idle" status
    if (!query) {
      dispatch({ type: FirestoreStatusType.IDLE })
      return
    }

    // Check if query changed (simple reference equality)
    // For v9, we rely on the consumer to memoize their queries
    if (prevQueryRef.current === query) {
      return
    }
    prevQueryRef.current = query

    dispatch({ type: FirestoreStatusType.LOADING })

    // Subscribe to query with onSnapshot
    // Handle both Query and DocumentReference
    const isDocRef = 'type' in query && query.type === 'document'

    if (isDocRef) {
      // Document reference
      const unsubscribe = onSnapshot(
        query as DocumentReference<DocumentData, DocumentData>,
        (docSnap: DocumentSnapshot<DocumentData>) => {
          const data = docSnap.exists()
            ? { id: docSnap.id, ...docSnap.data() }
            : null
          dispatch({ type: FirestoreStatusType.SUCCESS, payload: data as T })
        },
        (error: Error) => {
          dispatch({
            type: FirestoreStatusType.ERROR,
            payload: error as T & Error,
          })
        }
      )
      return () => unsubscribe()
    } else {
      // Query
      const unsubscribe = onSnapshot(
        query as Query<DocumentData, DocumentData>,
        (snapshot: QuerySnapshot<DocumentData>) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          dispatch({ type: FirestoreStatusType.SUCCESS, payload: data as T })
        },
        (error: Error) => {
          dispatch({
            type: FirestoreStatusType.ERROR,
            payload: error as T & Error,
          })
        }
      )
      return () => unsubscribe()
    }
  }, [query])

  return state
}
