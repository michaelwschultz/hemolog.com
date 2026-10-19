import type { TreatmentType } from '@/lib/db/treatments'

type OpenTreatmentDialog = (treatment?: TreatmentType) => void

let openDialog: OpenTreatmentDialog | null = null

export function registerTreatmentDialog(open: OpenTreatmentDialog) {
  openDialog = open
  return () => {
    if (openDialog === open) openDialog = null
  }
}

export function openTreatmentDialog(treatment?: TreatmentType) {
  openDialog?.(treatment)
}
