// firebase-admin.ts
// Initializes firebase with admin privileges and returns both {db} used for accessing Firestore
// and {auth} use to verify logged in people.

import { initializeApp, getApps, cert, type App } from 'firebase-admin/app'
import { getFirestore, type Firestore } from 'firebase-admin/firestore'
import { getAuth, type Auth } from 'firebase-admin/auth'

const firebasePrivateKey = process.env.FIREBASE_PRIVATE_KEY
const privateKey = firebasePrivateKey?.replace(/\\n/g, '\n')

let app: App

if (getApps().length === 0) {
  app = initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // https://stackoverflow.com/a/41044630/1332513
      privateKey,
    }),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  })
} else {
  app = getApps()[0]
}

const adminFirestore: Firestore = getFirestore(app)
const auth: Auth = getAuth(app)

export { adminFirestore, auth }
