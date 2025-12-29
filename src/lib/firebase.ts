// firebase.ts
// Initializes firebase across app for authentication only
// Firestore operations are now handled by firestore-lite.ts

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
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

let firebaseApp: FirebaseApp | null = null
let authInstance: Auth | null = null
let authEmulatorConnected = false

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
    const useEmulators =
      process.env.NEXT_PUBLIC_USE_EMULATORS === 'true' ||
      process.env.NEXT_PUBLIC_USE_EMULATORS === '1'

    if (useEmulators && !authEmulatorConnected) {
      try {
        connectAuthEmulator(authInstance, 'http://localhost:9099', {
          disableWarnings: true,
        })
        authEmulatorConnected = true
      } catch (error) {
        // If emulator is already connected, Firebase throws an error
        // We can safely ignore it, but log other errors for debugging
        if (
          error instanceof Error &&
          !error.message.includes('already been called')
        ) {
          console.warn('Auth emulator connection warning:', error.message)
        }
        authEmulatorConnected = true // Mark as connected even if error occurred
      }
    }
  }

  return authInstance
}
