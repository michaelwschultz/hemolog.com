// firebase.ts
// Initializes firebase across app for firebase, auth, functions, and firestore

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
}

if (!firebase.apps.length) {
  firebase.initializeApp(config)
}

export const firestore = firebase.firestore()

// use emulator if developing locally
if (process.env.NODE_ENV === 'development') {
  firestore.useEmulator('localhost', 8080)
}

export default firebase
