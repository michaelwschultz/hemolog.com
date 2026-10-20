import type { NextRequest } from 'next/server'
import { getRecentUserTreatmentsByApiKey } from '@/lib/admin-db/treatments'
import { adminFirestore } from '@/lib/firebase-admin'
import type { Person } from '@/lib/types/person'
import type { TreatmentType } from '@/lib/db/treatments'

/**
 * GET /api/emergency/[alertId]
 *
 * Public data for the emergency card: whitelisted person fields plus the
 * three most recent treatments. Email is never included.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ alertId: string }> }
): Promise<Response> {
  try {
    const { alertId } = await params

    const userSnapshot = await adminFirestore
      .collection('users')
      .where('alertId', '==', alertId)
      .limit(1)
      .get()

    const userDoc = userSnapshot.docs[0]
    if (!userDoc) {
      return Response.json(
        { error: 'Invalid alert ID. Check the link on your emergency card at Hemolog.com' },
        { status: 404 }
      )
    }

    const data = userDoc.data()
    const person: Person = {
      alertId: data.alertId || alertId,
      uid: data.uid || userDoc.id,
      name: data.name || data.displayName || '',
      photoUrl: data.photoUrl || undefined,
      hemophiliaType: data.hemophiliaType,
      severity: data.severity,
      medication: data.medication,
      monoclonalAntibody: data.monoclonalAntibody,
      injectionFrequency: data.injectionFrequency,
      factor: data.factor,
    }

    const { treatments, error } = await getRecentUserTreatmentsByApiKey(
      undefined,
      alertId
    )
    if (error) {
      throw error
    }

    // Treatments embed the owner object — strip everything we don't publish.
    const safeTreatments = (treatments ?? []).map((t: TreatmentType) => ({
      ...t,
      user: {
        uid: t.user?.uid,
        name: t.user?.name,
        photoUrl: t.user?.photoUrl,
      },
    }))

    return Response.json({ person, treatments: safeTreatments })
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
