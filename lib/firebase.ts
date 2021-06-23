// firebase.ts
// Initializes firebase across app for firebase, auth, functions, and firestore

import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFunctions } from 'firebase/functions'
import { getFirestore } from 'firebase/firestore'

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
}

const firebase = initializeApp(config)
const firestore = getFirestore()
const firebaseAuth = getAuth()
const firebaseFunctions = getFunctions()

export { firebase, firebaseAuth, firebaseFunctions, firestore }
