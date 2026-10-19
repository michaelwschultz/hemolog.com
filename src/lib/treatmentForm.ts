import {
  type TreatmentType,
  TreatmentTypeEnum,
  type TreatmentTypeOptions,
} from '@/lib/db/treatments'
import type { AttachedUserType } from '@/lib/types/users'

export interface TreatmentFormValues {
  brand: string
  cause: string
  date: string
  lot?: string
  sites: string
  type: TreatmentTypeOptions
  units: string
  uid?: string | null
}

export function validateTreatmentValues(
  values: TreatmentFormValues
): Partial<Record<keyof TreatmentFormValues, string>> {
  const errors: Partial<Record<keyof TreatmentFormValues, string>> = {}

  if (!values.date) {
    errors.date = 'Date is required'
  }

  if (values.type === TreatmentTypeEnum.ANTIBODY) {
    return errors
  }

  if (!values.brand.trim()) {
    errors.brand = 'Medication is required'
  }

  if (parsePositiveUnits(values.units) === null) {
    errors.units = 'Enter a whole number of units'
  }

  return errors
}

export function buildTreatmentPayload(
  values: TreatmentFormValues,
  user: AttachedUserType,
  monoclonalAntibody: string | undefined,
  existingCreatedAt?: string
): TreatmentType {
  const isAntibody = values.type === TreatmentTypeEnum.ANTIBODY
  const isBleed = values.type === TreatmentTypeEnum.BLEED
  const medicationBrand = isAntibody ? monoclonalAntibody || '' : values.brand

  return {
    cause: isBleed ? values.cause : '',
    createdAt: existingCreatedAt ?? new Date().toISOString(),
    deletedAt: null,
    date: values.date,
    medication: {
      brand: medicationBrand,
      lot: isAntibody ? undefined : values.lot,
      units: isAntibody ? 0 : (parsePositiveUnits(values.units) ?? 0),
    },
    sites: isBleed ? values.sites : '',
    type: values.type,
    user,
  }
}

export function getTreatmentFormInitialValues(
  treatment: TreatmentType | undefined,
  previousTreatment: TreatmentType | undefined,
  profileMedication: string | undefined,
  profileMonoclonalAntibody: string | undefined
): TreatmentFormValues {
  const displayTreatment = treatment || previousTreatment
  const isAntibody = displayTreatment?.type === TreatmentTypeEnum.ANTIBODY
  const medication = displayTreatment?.medication

  const defaultBrand = displayTreatment
    ? isAntibody
      ? profileMonoclonalAntibody || ''
      : medication?.brand || ''
    : profileMedication || ''

  return {
    brand: defaultBrand,
    cause: displayTreatment ? (isAntibody ? '' : displayTreatment.cause) : '',
    date: treatment ? displayTreatment?.date || formatToday() : formatToday(),
    lot: displayTreatment ? (isAntibody ? '' : medication?.lot || '') : '',
    sites: displayTreatment ? (isAntibody ? '' : displayTreatment.sites) : '',
    type: displayTreatment ? displayTreatment.type : TreatmentTypeEnum.PROPHY,
    units: displayTreatment
      ? isAntibody
        ? '0'
        : medication?.units != null
          ? String(medication.units)
          : ''
      : '',
    uid: displayTreatment?.uid || null,
  }
}

/** Whole IU count. `parseInt` would accept `3,500` as 3 and `3500iu` as 3500. Number inputs can also yield a numeric value. */
function parsePositiveUnits(raw: unknown): number | null {
  if (typeof raw === 'number') {
    return Number.isSafeInteger(raw) && raw > 0 ? raw : null
  }
  if (typeof raw !== 'string') {
    return null
  }
  const trimmed = raw.trim()
  if (!/^\d+$/.test(trimmed)) {
    return null
  }
  const units = Number(trimmed)
  if (!Number.isSafeInteger(units) || units <= 0) {
    return null
  }
  return units
}

function formatToday(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
