// firebase-admin.ts
// Initializes firebase with admin privileges and returns both {db} used for accessing Firestore
// and {auth} use to verify logged in people.

import admin from 'firebase-admin'

const firebasePrivateKey = process.env.FIREBASE_PRIVATE_KEY
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // https://stackoverflow.com/a/41044630/1332513
      privateKey: firebasePrivateKey.replace(/\\n/g, '\n'),
    }),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  })
}

const db = admin.firestore()
const auth = admin.auth()

export { db, auth }
