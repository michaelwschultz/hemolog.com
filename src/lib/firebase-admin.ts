// firebase-admin.ts
// Initializes firebase with admin privileges and returns both {db} used for accessing Firestore
// and {auth} use to verify logged in people.

import { type App, cert, getApps, initializeApp } from 'firebase-admin/app'
import { type Auth, getAuth } from 'firebase-admin/auth'
import { type Firestore, getFirestore } from 'firebase-admin/firestore'

const useEmulators = process.env.NEXT_PUBLIC_USE_EMULATORS === 'true'

let app: App

if (getApps().length === 0) {
  if (useEmulators) {
    // For emulators, use a minimal config without credentials
    // The emulators don't require authentication
    process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8082'
    process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099'

    app = initializeApp({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'hemolog',
    })
  } else {
    // Production: use service account credentials
    const firebasePrivateKey = process.env.FIREBASE_PRIVATE_KEY
    const privateKey = firebasePrivateKey?.replace(/\\n/g, '\n')

    if (!privateKey) {
      throw new Error(
        'FIREBASE_PRIVATE_KEY is required for production. Set it in your environment variables.'
      )
    }

    app = initializeApp({
      credential: cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey,
      }),
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    })
  }
} else {
  app = getApps()[0]
}

const adminFirestore: Firestore = getFirestore(app)
const auth: Auth = getAuth(app)

export { adminFirestore, auth }
