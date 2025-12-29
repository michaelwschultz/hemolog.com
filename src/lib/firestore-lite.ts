// firestore-lite.ts
// Lightweight Firestore client using REST API via firebase/firestore/lite
// This replaces the full Firestore SDK to reduce bundle size and eliminate WebSocket issues

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import {
  getFirestore,
  connectFirestoreEmulator,
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
  type Firestore,
  type QueryConstraint,
  type DocumentData,
  type WithFieldValue,
} from 'firebase/firestore/lite'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_API_KEY || 'development',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'localhost',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'hemolog',
}

let firebaseApp: FirebaseApp | null = null
let firestoreInstance: Firestore | null = null
let emulatorConnected = false

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

export function getFirestoreLite(): Firestore | null {
  if (typeof window === 'undefined') {
    return null
  }

  const app = getApp()
  if (!app) {
    return null
  }

  if (!firestoreInstance) {
    firestoreInstance = getFirestore(app)

    // Connect to emulator if in development mode
    const useEmulators =
      process.env.NEXT_PUBLIC_USE_EMULATORS === 'true' ||
      process.env.NEXT_PUBLIC_USE_EMULATORS === '1' ||
      window.location.hostname === 'localhost'

    if (useEmulators && !emulatorConnected) {
      try {
        connectFirestoreEmulator(firestoreInstance, 'localhost', 8082)
        emulatorConnected = true
        console.log('✓ Connected to Firestore Lite emulator at localhost:8082')
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.includes('already been called')
        ) {
          emulatorConnected = true
        } else {
          console.warn(
            'Firestore Lite emulator connection warning:',
            error instanceof Error ? error.message : String(error)
          )
          emulatorConnected = true
        }
      }
    }
  }

  return firestoreInstance
}

// Helper to filter undefined values from objects (Firestore doesn't accept undefined)
function cleanUndefined<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined)
  ) as Partial<T>
}

// Generic document fetch by ID
export async function getDocument<T = DocumentData>(
  collectionName: string,
  docId: string
): Promise<(T & { id: string }) | null> {
  const db = getFirestoreLite()
  if (!db) {
    throw new Error('Firestore not available')
  }

  const docRef = doc(collection(db, collectionName), docId)
  const docSnap = await getDoc(docRef)

  if (!docSnap.exists()) {
    return null
  }

  return { id: docSnap.id, ...docSnap.data() } as T & { id: string }
}

// Generic collection query
export async function getDocuments<T = DocumentData>(
  collectionName: string,
  ...queryConstraints: QueryConstraint[]
): Promise<(T & { id: string })[]> {
  const db = getFirestoreLite()
  if (!db) {
    throw new Error('Firestore not available')
  }

  const collectionRef = collection(db, collectionName)
  const q = query(collectionRef, ...queryConstraints)
  const querySnapshot = await getDocs(q)

  return querySnapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  })) as (T & { id: string })[]
}

// Create a new document with auto-generated ID
export async function createDocument<T extends DocumentData>(
  collectionName: string,
  data: WithFieldValue<T>
): Promise<string> {
  const db = getFirestoreLite()
  if (!db) {
    throw new Error('Firestore not available')
  }

  const cleanData = cleanUndefined(data as object)
  const collectionRef = collection(db, collectionName)
  const docRef = await addDoc(collectionRef, cleanData)

  // Update the document with its own ID (common pattern for this app)
  await setDoc(docRef, { uid: docRef.id, ...cleanData }, { merge: true })

  return docRef.id
}

// Create or update a document with a specific ID
export async function setDocument<T extends DocumentData>(
  collectionName: string,
  docId: string,
  data: WithFieldValue<T>,
  merge = true
): Promise<void> {
  const db = getFirestoreLite()
  if (!db) {
    throw new Error('Firestore not available')
  }

  const cleanData = cleanUndefined(data as object)
  const docRef = doc(collection(db, collectionName), docId)
  await setDoc(docRef, cleanData, { merge })
}

// Update specific fields of a document
export async function updateDocument<T extends DocumentData>(
  collectionName: string,
  docId: string,
  data: Partial<T>
): Promise<void> {
  const db = getFirestoreLite()
  if (!db) {
    throw new Error('Firestore not available')
  }

  const cleanData = cleanUndefined(data as object)
  const docRef = doc(collection(db, collectionName), docId)
  await updateDoc(docRef, cleanData)
}

// Delete a document (hard delete)
export async function deleteDocument(
  collectionName: string,
  docId: string
): Promise<void> {
  const db = getFirestoreLite()
  if (!db) {
    throw new Error('Firestore not available')
  }

  const docRef = doc(collection(db, collectionName), docId)
  await deleteDoc(docRef)
}

// Soft delete a document (set deletedAt timestamp)
export async function softDeleteDocument(
  collectionName: string,
  docId: string
): Promise<void> {
  const db = getFirestoreLite()
  if (!db) {
    throw new Error('Firestore not available')
  }

  const docRef = doc(collection(db, collectionName), docId)
  await setDoc(docRef, { deletedAt: new Date().toISOString() }, { merge: true })
}

// Re-export query helpers for building constraints
export { collection, doc, query, where, limit, orderBy }
export type { QueryConstraint, DocumentData }
