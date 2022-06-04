import { firestore } from 'lib/firebase'

async function createUser(uid: string, data: any) {
  try {
    await firestore
      .collection('users')
      .doc(uid)
      .set({ uid, ...data }, { merge: true })
  } catch (error) {
    console.error(error)
  }
}

async function deleteUser(uid: string) {
  firestore.collection('users').doc(uid).delete()
  const snapshot = await firestore
    .collection('infusions')
    .where('userId', '==', uid)
    .get()

  const batch = firestore.batch()

  snapshot.forEach((doc) => {
    batch.delete(doc.ref)
  })

  return batch.commit()
}

async function updateUser(uid: string, newValues: any) {
  return firestore.collection('users').doc(uid).update(newValues)
}

export { createUser, deleteUser, updateUser }
