import type { TreatmentType } from './db/treatments'

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

/** Calendar year from a `YYYY-MM-DD` treatment date. Date-only strings are UTC midnight, so `Date#getFullYear()` shifts them into the previous year in negative-offset timezones. */
export function treatmentCalendarYear(date: string): number | null {
  const match = /^(\d{4})-\d{2}-\d{2}/.exec(date)
  if (!match) {
    return null
  }
  return Number(match[1])
}

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
    const treatmentYear = treatmentCalendarYear(treatment.date)
    return treatmentYear !== null && treatmentYear.toString() === filterYear
  })
}
