// firebase-admin.ts
// Initializes firebase with admin privileges and returns both {db} used for accessing Firestore
// and {auth} use to verify logged in people.
import { initializeApp, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

const firebasePrivateKey = process.env.FIREBASE_PRIVATE_KEY
const privateKey = firebasePrivateKey?.replace(/\\n/g, '\n')

initializeApp({
  credential: cert({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    // https://stackoverflow.com/a/41044630/1332513
    privateKey,
  }),
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
})

const adminFirestore = getFirestore()
const auth = getAuth()

export { adminFirestore, auth }
