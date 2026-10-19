import { nanoid } from 'nanoid'
import {
  createDocument,
  getDocuments,
  setDocument,
  where,
} from '@/lib/firestore-lite'
import type { ApiKeyEntry } from '@/lib/types/users'

export async function listApiKeys(uid: string): Promise<ApiKeyEntry[]> {
  return getDocuments<ApiKeyEntry>('api_keys', where('uid', '==', uid))
}

export async function generateApiKeyEntry(
  uid: string,
  description: string
): Promise<ApiKeyEntry> {
  const apiKey = `hml_${nanoid(32)}`
  const entry: Omit<ApiKeyEntry, 'id'> = {
    key: apiKey,
    description: description.trim() || 'Untitled key',
    uid,
    createdAt: new Date().toISOString(),
    revokedAt: null,
  }
  const id = await createDocument('api_keys', entry)
  return { ...entry, id }
}

export async function revokeApiKeyEntry(
  id: string,
  uid: string
): Promise<void> {
  await setDocument(
    'api_keys',
    id,
    { uid, revokedAt: new Date().toISOString() },
    true
  )
}
