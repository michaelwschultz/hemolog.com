import { firestore } from 'lib/firebase'
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
  writeBatch,
  updateDoc,
} from 'firebase/firestore'

// TODO: add typing
async function createUser(uid: string, data: any) {
  const userRef = doc(firestore, 'users', uid)
  await setDoc(userRef, data, { merge: true })
}

async function deleteUser(uid: string) {
  await deleteDoc(doc(firestore, 'users', uid))

  const userInfusions = query(
    collection(firestore, 'infusions'),
    where('userId', '==', uid)
  )

  const snapshot = await getDocs(userInfusions)
  const batch = writeBatch(firestore)

  snapshot.forEach((doc) => {
    batch.delete(doc.ref)
  })

  await batch.commit()
}

// TODO: add typing
async function updateUser(uid: string, newValues: any) {
  const userRef = doc(firestore, 'users', uid)
  await updateDoc(userRef, newValues)
}

export { createUser, deleteUser, updateUser }
