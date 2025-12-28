import { auth, adminFirestore } from 'lib/firebase-admin'

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
  const userDocRef = adminFirestore.collection('users').doc(uid)
  const infusionSnapshot = await adminFirestore
    .collection('infusions')
    .where('user.uid', '==', uid)
    .get()

  const docRefs: FirebaseFirestore.DocumentReference[] = [userDocRef]
  infusionSnapshot.forEach((docSnapshot) => {
    docRefs.push(docSnapshot.ref)
  })

  await deleteDocuments(docRefs)

  try {
    await auth.deleteUser(uid)
  } catch (error: unknown) {
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      error.code !== 'auth/user-not-found'
    ) {
      throw error
    }
  }

  return { deletedDocs: docRefs.length }
}

export { deleteUserAndData }
