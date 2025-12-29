// Placeholder - need to restore from git
export async function generateUniqueString(length: number): Promise<string> {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length)
}

export function track(event: string, data: Record<string, unknown>) {
  console.log('track', event, data)
}

import type { TreatmentType } from './db/infusions'

export function filterInfusions(
  infusions: TreatmentType[] | undefined,
  filterYear: string
): TreatmentType[] {
  if (!infusions) {
    return []
  }

  if (filterYear === 'All time') {
    return infusions
  }

  return infusions.filter((infusion) => {
    if (!infusion.date) {
      return false
    }
    const infusionYear = new Date(infusion.date).getFullYear().toString()
    return infusionYear === filterYear
  })
}
