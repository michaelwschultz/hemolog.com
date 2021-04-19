// Reducer for hook state and actions
import { useReducer, useEffect } from 'react'
import useMemoCompare from 'lib/hooks/useMemoCompare'

export enum FirestoreStatusType {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error',
}

interface Action {
  type: FirestoreStatusType
  payload?: any
}

const reducer = (_state: any, action: Action) => {
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
        error: action.payload,
      }
    default:
      throw new Error('invalid action')
  }
}

// Hook
export default function useFirestoreQuery(query: any) {
  // Our initial state
  // Start with an "idle" status if query is falsy, as that means hook consumer is
  // waiting on required data before creating the query object.
  // Example: useFirestoreQuery(uid && firestore.collection("profiles").doc(uid))
  const initialState = {
    status: query ? FirestoreStatusType.LOADING : FirestoreStatusType.IDLE,
    data: undefined,
    error: undefined,
  }

  // Setup our state and actions
  const [state, dispatch] = useReducer(reducer, initialState)

  // Get cached Firestore query object with useMemoCompare (https://usehooks.com/useMemoCompare)
  // Needed because firestore.collection("profiles").doc(uid) will always being a new object reference
  // causing effect to run -> state change -> rerender -> effect runs -> etc ...
  // This is nicer than requiring hook consumer to always memoize query with useMemo.
  const queryCached = useMemoCompare(query, (prevQuery: any) => {
    // Use built-in Firestore isEqual method to determine if "equal"
    return prevQuery && query && query.isEqual(prevQuery)
  })

  useEffect(() => {
    // Return early if query is falsy and reset to "idle" status in case
    // we're coming from "success" or "error" status due to query change.
    if (!queryCached) {
      dispatch({ type: FirestoreStatusType.IDLE })
      return
    }

    dispatch({ type: FirestoreStatusType.LOADING })

    // Subscribe to query with onSnapshot
    // Will unsubscribe on cleanup since this returns an unsubscribe function
    return queryCached.onSnapshot(
      (response: any) => {
        // Get data for collection or doc
        const data = response.docs
          ? getCollectionData(response)
          : getDocData(response)

        dispatch({ type: FirestoreStatusType.SUCCESS, payload: data })
      },
      (error: any) => {
        dispatch({ type: FirestoreStatusType.ERROR, payload: error })
      }
    )
  }, [queryCached]) // Only run effect if queryCached changes

  return state
}

// Get doc data and merge doc.id
function getDocData(doc: any) {
  return doc.exists === true ? { id: doc.id, ...doc.data() } : null
}

// Get array of doc data from collection
function getCollectionData(collection: any) {
  return collection.docs.map(getDocData)
}
