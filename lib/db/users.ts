import firebase from 'lib/firebase'

const firestore = firebase.firestore()

function createUser(uid, data) {
  return firestore
    .collection('users')
    .doc(uid)
    .set({ uid, ...data }, { merge: true })
}

async function deleteUser(uid) {
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

export { createUser, deleteUser }
