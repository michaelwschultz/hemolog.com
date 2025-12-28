// firebase.ts
// Initializes firebase across app for auth and firestore using modular v9+ API

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import {
  getFirestore,
  connectFirestoreEmulator,
  type Firestore,
} from 'firebase/firestore'
import {
  getAuth as getFirebaseAuth,
  connectAuthEmulator,
  type Auth,
} from 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_API_KEY || 'development',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'localhost',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'hemolog',
}

// Singleton instances
let firebaseApp: FirebaseApp | null = null
let firestoreInstance: Firestore | null = null
let authInstance: Auth | null = null
let firestoreEmulatorConnected = false
let authEmulatorConnected = false

// Initialize Firebase app (only on client-side)
function getApp(): FirebaseApp | null {
  if (typeof window === 'undefined') {
    return null
  }

  if (!firebaseApp) {
    const apps = getApps()
    if (apps.length === 0) {
      firebaseApp = initializeApp(firebaseConfig)
    } else {
      firebaseApp = apps[0]
    }
  }

  return firebaseApp
}

// Get Firestore instance
function getFirestoreInstance(): Firestore | null {
  if (typeof window === 'undefined') {
    return null
  }

  const app = getApp()
  if (!app) {
    return null
  }

  if (!firestoreInstance) {
    firestoreInstance = getFirestore(app)

    // Connect to emulator if developing locally
    if (process.env.NEXT_PUBLIC_USE_EMULATORS && !firestoreEmulatorConnected) {
      try {
        connectFirestoreEmulator(firestoreInstance, 'localhost', 8082)
        firestoreEmulatorConnected = true
      } catch {
        // Emulator already connected, ignore
      }
    }
  }

  return firestoreInstance
}

// Get Auth instance
export function getAuth(): Auth | null {
  if (typeof window === 'undefined') {
    return null
  }

  const app = getApp()
  if (!app) {
    return null
  }

  if (!authInstance) {
    authInstance = getFirebaseAuth(app)

    // Connect to emulator if developing locally
    if (process.env.NEXT_PUBLIC_USE_EMULATORS && !authEmulatorConnected) {
      try {
        connectAuthEmulator(authInstance, 'http://localhost:9099', {
          disableWarnings: true,
        })
        authEmulatorConnected = true
      } catch {
        // Emulator already connected, ignore
      }
    }
  }

  return authInstance
}

// Export firestore getter - components should use this
export const firestore = {
  get instance(): Firestore | null {
    return getFirestoreInstance()
  },
}

// Re-export commonly used Firestore functions for convenience
export {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  query,
  where,
  limit,
  orderBy,
  onSnapshot,
  writeBatch,
  type DocumentData,
  type QuerySnapshot,
  type DocumentSnapshot,
  type Query,
  type CollectionReference,
} from 'firebase/firestore'
