import firebase from 'lib/firebase'

const firestore = firebase.firestore()

function createInfusion(data) {
  const infusion = firestore.collection('infusions').doc()
  infusion.set(data)

  return infusion
}

function deleteInfusion(uid) {
  return firestore.collection('infusions').doc(uid).delete()
}

async function updateInfusion(uid, newValues) {
  return firestore.collection('infusions').doc(uid).update(newValues)
}

export { createInfusion, deleteInfusion, updateInfusion }
