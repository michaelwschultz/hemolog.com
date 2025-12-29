import { adminFirestore, auth } from '@/lib/firebase-admin'

const BATCH_LIMIT = 400

async function deleteDocuments(docRefs: FirebaseFirestore.DocumentReference[]) {
  if (!docRefs.length) return

  let batch = adminFirestore.batch()
  let operationCount = 0

  const commitBatch = async () => {
    if (!operationCount) return
    await batch.commit()
    batch = adminFirestore.batch()
    operationCount = 0
  }

  for (const ref of docRefs) {
    batch.delete(ref)
    operationCount += 1

    if (operationCount === BATCH_LIMIT) {
      await commitBatch()
    }
  }

  await commitBatch()
}

async function deleteUserAndData(uid: string) {
  // Delete Auth user FIRST - this is more likely to fail due to external dependencies.
  // If this fails, no data is lost and the user can retry.
  // If we deleted Firestore first and Auth failed, we'd leave the user in an
  // inconsistent state (no data but still able to sign in).
  try {
    await auth.deleteUser(uid)
  } catch (error: unknown) {
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      error.code !== 'auth/user-not-found'
    ) {
      // Auth deletion failed - don't delete any data, throw to caller
      throw error
    }
    // auth/user-not-found is okay - continue to delete orphaned data
  }

  // Auth user deleted (or didn't exist), now safe to delete Firestore data
  const userDocRef = adminFirestore.collection('users').doc(uid)
  const treatmentSnapshot = await adminFirestore
    .collection('infusions')
    .where('user.uid', '==', uid)
    .get()

  const docRefs: FirebaseFirestore.DocumentReference[] = [userDocRef]
  treatmentSnapshot.forEach((docSnapshot) => {
    docRefs.push(docSnapshot.ref)
  })

  await deleteDocuments(docRefs)

  return { deletedDocs: docRefs.length }
}

export { deleteUserAndData }
