import type { NextRequest } from 'next/server'
import { deleteUserAndData } from '@/lib/admin-db/users'
import { auth } from '@/lib/firebase-admin'

export async function DELETE(request: NextRequest) {
  try {
    const token = request.headers.get('token')

    if (!token) {
      throw new Error('Access denied. Missing valid token.')
    }

    const { uid } = await auth.verifyIdToken(token)

    if (!uid) {
      throw new Error('Access denied. Invalid token.')
    }

    await deleteUserAndData(uid)

    return Response.json({ success: true })
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unable to delete account.'
    return Response.json({ error: errorMessage }, { status: 500 })
  }
}
