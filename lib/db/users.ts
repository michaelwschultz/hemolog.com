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

async function createUser(uid: string, data: Partial<UserType>) {
  const db = firestore.instance
  if (!db) {
    console.error('Firestore not available')
    return
  }

  try {
    // Filter out undefined values - Firestore doesn't accept them
    const cleanData = Object.fromEntries(
      Object.entries({ uid, ...data }).filter(([, v]) => v !== undefined)
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
  const cleanValues = Object.fromEntries(
    Object.entries(newValues).filter(([, v]) => v !== undefined)
  )
  const userDocRef = doc(collection(db, 'users'), uid)
  return updateDoc(userDocRef, cleanValues)
}

export { createUser, deleteUser, updateUser }
