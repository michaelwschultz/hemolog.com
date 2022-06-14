// firebase.ts
// Initializes firebase across app for firebase, auth, functions, and firestore

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_API_KEY || 'development',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'localhost',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'hemolog',
}

if (!firebase.apps.length) {
  firebase.initializeApp(config)
}

export const firestore = firebase.firestore()

// use emulator if developing locally
if (process.env.NEXT_PUBLIC_USE_EMULATORS) {
  // !!! Removing this line will break Cypress tests !!!
  // https://github.com/firebase/firebase-js-sdk/issues/1674
  // Comment this line if having issues when developing using the emulator locally.
  firestore.settings({ experimentalForceLongPolling: true })
  firestore.useEmulator('localhost', 8080)
}

export default firebase
