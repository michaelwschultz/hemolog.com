import { adminFirestore } from 'lib/firebase-admin'

async function getUser(uid: string) {
  try {
    if (!uid) throw { message: 'No userId provided' }
    const user = await adminFirestore.collection('users').doc(uid).get()

    return { user }
  } catch (error) {
    return { error }
  }
}

export { getUser }
