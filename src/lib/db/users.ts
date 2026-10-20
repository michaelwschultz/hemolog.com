import { getDocument, setDocument } from '@/lib/firestore-lite'
import type { Person } from '../types/person'
import type { UserType } from '../types/users'

// Helper to add timeout to a promise
function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(
        () => reject(new Error(`Operation timed out after ${timeoutMs}ms`)),
        timeoutMs
      )
    ),
  ])
}

// Create or update a user document
export async function createUser(
  uid: string,
  userData: Partial<UserType>
): Promise<void> {
  // Remove token from userData as it shouldn't be stored in Firestore
  const { token: _token, ...dataWithoutToken } = userData

  try {
    // Create or update user document with 10 second timeout
    await withTimeout(
      setDocument('users', uid, { uid, ...dataWithoutToken }),
      10000 // 10 second timeout
    )

    console.log('User document created/updated:', uid)
  } catch (error) {
    console.error('Error creating/updating user document:', error)
    throw error
  }
}

// Update a user document
export async function updateUser(
  uid: string,
  userData: Partial<UserType>
): Promise<void> {
  const { token: _token, ...dataWithoutToken } = userData
  await setDocument('users', uid, dataWithoutToken, true)
}

// Fetch a user by UID (used by TanStack Query)
export async function fetchUserByUid(uid: string): Promise<Person | null> {
  const user = await getDocument<Person>('users', uid)
  return user
}
