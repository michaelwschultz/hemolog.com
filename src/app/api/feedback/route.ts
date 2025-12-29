import { auth } from '@/lib/firebase-admin'
import { getAllFeedback } from '@/lib/admin-db/feedback'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('token')

    if (!token) {
      throw { message: 'Access denied. Missing valid token.' }
    }

    const { uid } = await auth.verifyIdToken(token)
    if (!uid) {
      throw {
        message: `Invalid token`,
      }
    }

    const { feedback, error } = await getAllFeedback()

    if (error) {
      throw error
    }

    return Response.json(feedback)
  } catch (error: unknown) {
    const errorMessage =
      error &&
      typeof error === 'object' &&
      'message' in error &&
      typeof error.message === 'string'
        ? error.message
        : 'An error occurred'
    return Response.json({ error: errorMessage }, { status: 500 })
  }
}
