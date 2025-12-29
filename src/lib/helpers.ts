export const CONFIG = {
  blueskyUrl: 'https://bsky.app/profile/michaelschultz.com',
}

export async function generateUniqueString(length: number): Promise<string> {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length)
}

export function track(event: string, data: Record<string, unknown>) {
  console.log('track', event, data)
}

import type { TreatmentType } from './db/treatments'

export function filterTreatments(
  treatments: TreatmentType[] | undefined,
  filterYear: string
): TreatmentType[] {
  if (!treatments) {
    return []
  }

  if (filterYear === 'All time') {
    return treatments
  }

  return treatments.filter((treatment) => {
    if (!treatment.date) {
      return false
    }
    const treatmentYear = new Date(treatment.date).getFullYear().toString()
    return treatmentYear === filterYear
  })
}
