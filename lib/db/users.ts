import firebase, { firestore } from 'lib/firebase'

function createUser(uid: string, data: any) {
  return firestore
    .collection('users')
    .doc(uid)
    .set({ uid, ...data }, { merge: true })
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
