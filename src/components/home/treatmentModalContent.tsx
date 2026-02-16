import { format } from 'date-fns'
import React from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '@/lib/auth'
import {
  type TreatmentType,
  TreatmentTypeEnum,
  type TreatmentTypeOptions,
} from '@/lib/db/treatments'
import { track } from '@/lib/helpers'
import { useTreatmentMutations } from '@/lib/hooks/useTreatmentMutations'
import type { AttachedUserType } from '@/lib/types/users'

interface TreatmentValues {
  brand: string
  cause: string | null
  date: string
  lot?: string | null
  sites: string | null
  type: TreatmentTypeOptions
  units: string
  uid?: string | null
}

interface TreatmentModalProps {
  treatment?: TreatmentType
  // Previous treatment for prefilling form when creating new treatments
  previousTreatment?: TreatmentType
  // Callback when treatment is successfully created/updated
  onSuccess?: () => void
}

// Helper function to compute initial values - called once when modal mounts
function getInitialValues(
  treatment: TreatmentType | undefined,
  previousTreatment: TreatmentType | undefined,
  monoclonalAntibody: string | undefined
): TreatmentValues {
  const displayTreatment = treatment || previousTreatment
  const isAntibody = displayTreatment?.type === TreatmentTypeEnum.ANTIBODY

  return {
    brand: displayTreatment
      ? isAntibody
        ? monoclonalAntibody || ''
        : displayTreatment.medication.brand
      : '',
    cause: displayTreatment
      ? isAntibody
        ? null
        : displayTreatment.cause
      : null,
    date: treatment
      ? displayTreatment?.date || format(new Date(), 'yyyy-MM-dd')
      : format(new Date(), 'yyyy-MM-dd'),
    lot: displayTreatment
      ? isAntibody
        ? null
        : displayTreatment.medication.lot || ''
      : null,
    sites: displayTreatment
      ? isAntibody
        ? null
        : displayTreatment.sites
      : null,
    type: displayTreatment
      ? displayTreatment.type
      : (TreatmentTypeEnum.PROPHY as TreatmentTypeOptions),
    units: displayTreatment
      ? isAntibody
        ? '0'
        : displayTreatment.medication.units.toString()
      : '',
    uid: displayTreatment?.uid || null,
  }
}

export default React.forwardRef<
  { handleSubmit: () => void },
  TreatmentModalProps
>(function TreatmentModalContent(props, ref) {
  const { treatment, previousTreatment, onSuccess } = props

  const { user } = useAuth()

  // Track if we've already submitted to prevent double-submission
  const hasSubmittedRef = React.useRef(false)

  // Reset submission flag on mount
  // biome-ignore lint/correctness/useExhaustiveDependencies: Intentionally empty deps - only run on mount to reset debug counter
  React.useEffect(() => {
    hasSubmittedRef.current = false
    console.log('TreatmentModalContent mounted', {
      treatment: treatment?.uid,
      previousTreatment: previousTreatment?.uid,
    })
    return () => {
      console.log('TreatmentModalContent unmounting')
      // Reset on unmount too, just in case
      hasSubmittedRef.current = false
    }
  }, [])

  // Stable reference to onSuccess to avoid closure issues
  const onSuccessRef = React.useRef(onSuccess)
  onSuccessRef.current = onSuccess

  // Use the mutations hook without callbacks - we'll handle success manually
  const mutations = useTreatmentMutations()

  // Store mutations in ref to ensure handlers don't recreate when mutations object changes
  const mutationsRef = React.useRef(mutations)
  mutationsRef.current = mutations

  // Store initial values in state so they don't change during the component lifecycle
  // The component remounts when the sheet opens, so this gives us fresh values each time
  const [values, setValues] = React.useState<TreatmentValues>(() => {
    const initialValues = getInitialValues(
      treatment,
      previousTreatment,
      user?.monoclonalAntibody
    )
    console.log('TreatmentModalContent: Initial values calculated on mount', {
      treatmentUid: treatment?.uid,
      previousTreatmentUid: previousTreatment?.uid,
    })
    return initialValues
  })

  // Store user in ref to avoid recreating handlers when user changes
  const userRef = React.useRef(user)
  userRef.current = user

  // Handle input changes
  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      setValues((prev) => ({ ...prev, [name]: value }))
    },
    []
  )

  // Set a specific field value
  const setFieldValue = React.useCallback(
    (
      field: keyof TreatmentValues,
      value: TreatmentValues[keyof TreatmentValues]
    ) => {
      setValues((prev) => ({ ...prev, [field]: value }))
    },
    []
  )

  // Memoize handlers to prevent recreation on every render
  // Use refs to access mutations and user to keep handlers stable
  const handleCreateTreatment = React.useCallback(
    (treatmentValues: TreatmentValues) => {
      const treatmentUser: AttachedUserType = {
        email: userRef.current?.email || '',
        name: userRef.current?.name || '',
        photoUrl: userRef.current?.photoUrl || '',
        uid: userRef.current?.uid || '',
      }

      // TODO:(michael) should probably move to toLocaleString()
      const { date, brand, lot, units, cause, sites, type } = treatmentValues

      // For antibody treatments, use monoclonal antibody from profile and clear cause/sites to null
      const isAntibody = type === TreatmentTypeEnum.ANTIBODY
      const medicationBrand = isAntibody
        ? userRef.current?.monoclonalAntibody || ''
        : brand

      const payload: TreatmentType = {
        cause: isAntibody ? null : cause || null,
        createdAt: new Date().toISOString(),
        deletedAt: null,
        date,
        medication: {
          brand: medicationBrand,
          units: isAntibody ? 0 : units ? parseInt(units, 10) : 0,
          ...(!isAntibody && lot ? { lot } : {}),
        },
        sites: isAntibody ? null : sites || null,
        type,
        user: treatmentUser,
      }

      mutationsRef.current.createTreatment(payload)
      // Close immediately - mutation runs in background
      onSuccessRef.current?.()
    },
    [] // Empty deps - use refs for all dependencies
  )

  const handleUpdateTreatment = React.useCallback(
    (treatmentValues: TreatmentValues) => {
      const treatmentUser: AttachedUserType = {
        email: userRef.current?.email || '',
        name: userRef.current?.name || '',
        photoUrl: userRef.current?.photoUrl || '',
        uid: userRef.current?.uid || '',
      }

      const { uid, date, brand, lot, units, cause, sites, type } =
        treatmentValues

      // For antibody treatments, use monoclonal antibody from profile and clear cause/sites to null
      const isAntibody = type === TreatmentTypeEnum.ANTIBODY
      const medicationBrand = isAntibody
        ? userRef.current?.monoclonalAntibody || ''
        : brand

      const payload: TreatmentType = {
        cause: isAntibody ? null : cause || null,
        createdAt: new Date().toISOString(),
        deletedAt: null,
        date,
        medication: {
          brand: medicationBrand,
          units: isAntibody ? 0 : units ? parseInt(units, 10) : 0,
          ...(!isAntibody && lot ? { lot } : {}),
        },
        sites: isAntibody ? null : sites || null,
        type,
        user: treatmentUser,
      }

      if (uid) {
        mutationsRef.current.updateTreatment({
          uid,
          userUid: userRef.current?.uid || '',
          data: payload,
        })
        // Close immediately - mutation runs in background
        onSuccessRef.current?.()
      } else {
        toast.error('Treatment database entry not found')
        hasSubmittedRef.current = false // Allow retry
      }
    },
    [] // Empty deps - use refs for all dependencies
  )

  // Store treatment and handlers in refs to stabilize onSubmit
  const treatmentRef = React.useRef(treatment)
  treatmentRef.current = treatment

  const handleCreateTreatmentRef = React.useRef(handleCreateTreatment)
  handleCreateTreatmentRef.current = handleCreateTreatment

  const handleUpdateTreatmentRef = React.useRef(handleUpdateTreatment)
  handleUpdateTreatmentRef.current = handleUpdateTreatment

  // Store values in ref for stable submit handler
  const valuesRef = React.useRef(values)
  valuesRef.current = values

  const onSubmit = React.useCallback(() => {
    console.log('onSubmit called', {
      hasSubmitted: hasSubmittedRef.current,
      treatmentUid: treatmentRef.current?.uid,
    })
    if (hasSubmittedRef.current) {
      console.warn('onSubmit: Already submitted, ignoring')
      return
    }
    hasSubmittedRef.current = true

    if (treatmentRef.current) {
      handleUpdateTreatmentRef.current(valuesRef.current)
    } else {
      handleCreateTreatmentRef.current(valuesRef.current)
    }
  }, []) // Empty deps - use refs for all dependencies

  // Define handleSubmit with useCallback to stabilize the reference
  const handleSubmit = React.useCallback(() => {
    console.log('handleSubmit called', {
      hasSubmitted: hasSubmittedRef.current,
      values: valuesRef.current,
    })
    track('Logged Treatment', {
      type: valuesRef.current.type,
    })
    onSubmit()
  }, [onSubmit])

  React.useImperativeHandle(ref, () => ({ handleSubmit }), [handleSubmit])

  return (
    <div className='p-6'>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit()
        }}
        className='space-y-4'
      >
        {/* Treatment Type Buttons */}
        <div className='grid grid-cols-3 gap-2'>
          <button
            type='button'
            onClick={() => {
              setFieldValue('type', TreatmentTypeEnum.PROPHY)
              // Clear antibody-specific fields when switching away from antibody
              if (values.type === TreatmentTypeEnum.ANTIBODY) {
                setFieldValue('brand', '')
                setFieldValue('cause', '')
                setFieldValue('sites', '')
              }
            }}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              values.type === TreatmentTypeEnum.PROPHY
                ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Prophy
          </button>
          <button
            type='button'
            onClick={() => {
              setFieldValue('type', TreatmentTypeEnum.BLEED)
              // Clear antibody-specific fields when switching away from antibody
              if (values.type === TreatmentTypeEnum.ANTIBODY) {
                setFieldValue('brand', '')
                setFieldValue('cause', '')
                setFieldValue('sites', '')
              }
            }}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              values.type === TreatmentTypeEnum.BLEED
                ? 'bg-green-100 text-green-800 border border-green-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Bleed
          </button>
          <button
            type='button'
            onClick={() => {
              setFieldValue('type', TreatmentTypeEnum.PREVENTATIVE)
              // Clear antibody-specific fields when switching away from antibody
              if (values.type === TreatmentTypeEnum.ANTIBODY) {
                setFieldValue('brand', '')
                setFieldValue('cause', '')
                setFieldValue('sites', '')
              }
            }}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              values.type === TreatmentTypeEnum.PREVENTATIVE
                ? 'bg-red-100 text-red-800 border border-red-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Preventative
          </button>
        </div>

        {user?.monoclonalAntibody && (
          <button
            type='button'
            onClick={() => {
              setFieldValue('type', TreatmentTypeEnum.ANTIBODY)
              // Set brand to monoclonal antibody and clear cause/sites when switching to antibody
              setFieldValue('brand', user?.monoclonalAntibody || '')
              setFieldValue('cause', '')
              setFieldValue('sites', '')
              setFieldValue('units', '0')
              setFieldValue('lot', '')
            }}
            className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              values.type === TreatmentTypeEnum.ANTIBODY
                ? 'bg-blue-100 text-blue-800 border border-blue-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Monoclonal antibody
          </button>
        )}

        {/* Date Input */}
        <div>
          <label
            htmlFor='date'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Date
          </label>
          <input
            id='date'
            name='date'
            type='date'
            onChange={handleChange}
            value={values.date}
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
          />
        </div>

        {/* Medication Input */}
        <div>
          <label
            htmlFor='brand'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Medication
          </label>
          <input
            id='brand'
            name='brand'
            type='text'
            onChange={handleChange}
            placeholder='Brand name'
            disabled={values.type === TreatmentTypeEnum.ANTIBODY}
            value={
              values.type === TreatmentTypeEnum.ANTIBODY
                ? user?.monoclonalAntibody || ''
                : values.brand
            }
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed'
          />
        </div>

        {values.type !== TreatmentTypeEnum.ANTIBODY && (
          <>
            {/* Units Input */}
            <div>
              <label
                htmlFor='units'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Units
              </label>
              <div className='relative'>
                <input
                  id='units'
                  name='units'
                  type='number'
                  onChange={handleChange}
                  placeholder='3000'
                  value={values.units}
                  className='w-full px-3 py-2 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                />
                <span className='absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500'>
                  units
                </span>
              </div>
            </div>

            {/* Lot Number Input */}
            <div>
              <label
                htmlFor='lot'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Lot Number
              </label>
              <input
                id='lot'
                name='lot'
                type='text'
                onChange={handleChange}
                placeholder='Lot number'
                value={values.lot ?? ''}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
              />
            </div>

            {/* Affected Areas Input */}
            <div>
              <label
                htmlFor='sites'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Affected Areas
              </label>
              <input
                id='sites'
                name='sites'
                type='text'
                onChange={handleChange}
                placeholder='Left ankle, right knee'
                value={values.sites ?? ''}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
              />
            </div>

            {/* Cause Input */}
            <div>
              <label
                htmlFor='cause'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Cause of Bleed
              </label>
              <input
                id='cause'
                name='cause'
                type='text'
                onChange={handleChange}
                placeholder='Ran into a door'
                value={values.cause ?? ''}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
              />
            </div>
          </>
        )}
      </form>
    </div>
  )
})
