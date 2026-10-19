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

  const units = Number.parseInt(values.units, 10)
  if (!values.units || Number.isNaN(units) || units <= 0) {
    errors.units = 'Enter a positive unit count'
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
      units: isAntibody ? 0 : Number.parseInt(values.units, 10) || 0,
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

function formatToday(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
