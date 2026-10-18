import {
  firestore,
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  writeBatch,
} from 'lib/firebase'
import type { UserType } from 'lib/types/users'

/**
 * SECURITY: Ensure sensitive credentials are never written to Firestore.
 * The Firebase ID Token is ephemeral and should not be persisted.
 * The API Key is only ever transmitted via the Authorization header.
 */
function sanitizeUserForDb(data: Partial<UserType>): Partial<UserType> {
  const { token, apiKey, ...safeData } = data
  if (token || apiKey) {
    console.warn(
      'Attempted to persist sensitive credentials (token/apiKey) to Firestore. Stripping fields.'
    )
  }
  return safeData
}

async function createUser(uid: string, data: Partial<UserType>) {
  const db = firestore.instance
  if (!db) {
    console.error('Firestore not available')
    return
  }

  try {
    // Filter out undefined values - Firestore doesn't accept them
    // SECURITY: Strip token and apiKey before writing to Firestore.
    const safeData = sanitizeUserForDb(data)
    const cleanData = Object.fromEntries(
      Object.entries({ uid, ...safeData }).filter(([, v]) => v !== undefined)
    )
    const userDocRef = doc(collection(db, 'users'), uid)
    await setDoc(userDocRef, cleanData, { merge: true })
  } catch (error) {
    console.error(error)
  }
}

async function deleteUser(uid: string) {
  const db = firestore.instance
  if (!db) {
    console.error('Firestore not available')
    return
  }

  const userDocRef = doc(collection(db, 'users'), uid)
  await deleteDoc(userDocRef)

  const infusionsQuery = query(
    collection(db, 'infusions'),
    where('user.uid', '==', uid)
  )
  const snapshot = await getDocs(infusionsQuery)

  const batch = writeBatch(db)
  snapshot.forEach((docSnap) => {
    batch.delete(docSnap.ref)
  })

  return batch.commit()
}

async function updateUser(uid: string, newValues: Partial<UserType>) {
  const db = firestore.instance
  if (!db) {
    console.error('Firestore not available')
    return
  }

  // Filter out undefined values - Firestore doesn't accept them
  // SECURITY: Strip token and apiKey before writing to Firestore.
  const safeValues = sanitizeUserForDb(newValues)
  const cleanValues = Object.fromEntries(
    Object.entries(safeValues).filter(([, v]) => v !== undefined)
  )
  const userDocRef = doc(collection(db, 'users'), uid)
  return updateDoc(userDocRef, cleanValues)
}

export { createUser, deleteUser, updateUser }
