import firebase from 'lib/firebase'

const firestore = firebase.firestore()

// TODO: Move to ./users
export function createUser(uid, data) {
  return firestore
    .collection('users')
    .doc(uid)
    .set({ uid, ...data }, { merge: true })
}

export async function deleteUser(uid) {
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

// TODO: Move to ./infusions
export function createInfusion(data) {
  const infusion = firestore.collection('infusions').doc()
  infusion.set(data)

  return infusion
}

export function deleteInfusion(uid) {
  return firestore.collection('infusions').doc(uid).delete()
}

export async function updateInfusion(uid, newValues) {
  return firestore.collection('infusions').doc(uid).update(newValues)
}

// TODO: Move to ./feedback
export function createFeedback(data) {
  return firestore.collection('feedback').add(data)
}

export function deleteFeedback(uid) {
  return firestore.collection('feedback').doc(uid).delete()
}

export function updateFeedback(uid, newValues) {
  return firestore.collection('feedback').doc(uid).update(newValues)
}
