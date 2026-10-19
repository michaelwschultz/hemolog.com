import { adminFirestore } from '@/lib/firebase-admin'
import type { ApiKeyEntry } from '@/lib/types/users'

/**
 * Resolves an API key to its owning user. Only keys that have not been
 * revoked are accepted. Returns null when the key is unknown or revoked.
 */
export async function findActiveApiKey(
  apiKey: string
): Promise<ApiKeyEntry | null> {
  const snapshot = await adminFirestore
    .collection('api_keys')
    .where('key', '==', apiKey)
    .limit(1)
    .get()

  if (snapshot.empty) {
    return null
  }

  const doc = snapshot.docs[0]
  const entry = doc.data() as ApiKeyEntry

  if (entry.revokedAt) {
    return null
  }

  return entry
}
