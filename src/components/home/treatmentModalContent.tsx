import { format } from 'date-fns'
import { useFormik } from 'formik'
import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
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
  cause: string
  date: string
  lot?: string
  sites: string
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
) {
  const displayTreatment = treatment || previousTreatment
  const isAntibody = displayTreatment?.type === TreatmentTypeEnum.ANTIBODY

  return {
    brand: displayTreatment
      ? isAntibody
        ? monoclonalAntibody || ''
        : displayTreatment.medication.brand
      : '',
    cause: displayTreatment ? (isAntibody ? '' : displayTreatment.cause) : '',
    date: treatment
      ? displayTreatment?.date || format(new Date(), 'yyyy-MM-dd')
      : format(new Date(), 'yyyy-MM-dd'),
    lot: displayTreatment
      ? isAntibody
        ? ''
        : displayTreatment.medication.lot || ''
      : '',
    sites: displayTreatment ? (isAntibody ? '' : displayTreatment.sites) : '',
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

export default forwardRef<{ handleSubmit: () => void }, TreatmentModalProps>(
  function TreatmentModalContent(props, ref) {
    const { treatment, previousTreatment, onSuccess } = props

    const { user } = useAuth()

    // Generate all IDs unconditionally at the top level
    const dateId = useId()
    const brandId = useId()
    const unitsId = useId()
    const lotId = useId()
    const sitesId = useId()
    const causeId = useId()

    // Debug: Track render count to detect infinite loops
    const renderCountRef = useRef(0)

    // Track if we've already submitted to prevent double-submission
    const hasSubmittedRef = useRef(false)

    // Reset counter and submission flag on mount
    useEffect(() => {
      renderCountRef.current = 0
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
    }, [previousTreatment?.uid, treatment?.uid])

    renderCountRef.current += 1
    if (renderCountRef.current > 10) {
      console.error('TreatmentModalContent render loop detected!', {
        renderCount: renderCountRef.current,
        treatment: treatment?.uid,
        previousTreatment: previousTreatment?.uid,
      })
      throw new Error('Infinite render loop detected in TreatmentModalContent')
    }

    // Stable reference to onSuccess to avoid closure issues
    const onSuccessRef = useRef(onSuccess)
    onSuccessRef.current = onSuccess

    // Use the mutations hook without callbacks - we'll handle success manually
    const mutations = useTreatmentMutations()

    // Store mutations in ref to ensure handlers don't recreate when mutations object changes
    const mutationsRef = useRef(mutations)
    mutationsRef.current = mutations

    const [initialValues] = useState(() => {
      const values = getInitialValues(
        treatment,
        previousTreatment,
        user?.monoclonalAntibody
      )
      console.log('TreatmentModalContent: Initial values calculated on mount', {
        treatmentUid: treatment?.uid,
        previousTreatmentUid: previousTreatment?.uid,
      })
      return values
    })

    // Store user in ref to avoid recreating handlers when user changes
    const userRef = useRef(user)
    userRef.current = user

    // Memoize handlers to prevent recreation on every render
    // Use refs to access mutations and user to keep handlers stable
    const handleCreateTreatment = useCallback(
      (treatmentValues: TreatmentValues) => {
        const treatmentUser: AttachedUserType = {
          email: userRef.current?.email || '',
          name: userRef.current?.name || '',
          photoUrl: userRef.current?.photoUrl || '',
          uid: userRef.current?.uid || '',
        }

        // TODO:(michael) should probably move to toLocaleString()
        const { date, brand, lot, units, cause, sites, type } = treatmentValues

        // For antibody treatments, use monoclonal antibody from profile and clear cause/sites
        const isAntibody = type === TreatmentTypeEnum.ANTIBODY
        const medicationBrand = isAntibody
          ? userRef.current?.monoclonalAntibody || ''
          : brand

        const payload: TreatmentType = {
          cause: isAntibody ? '' : cause,
          createdAt: new Date().toISOString(),
          deletedAt: null,
          date,
          medication: {
            brand: medicationBrand,
            lot: isAntibody ? undefined : lot,
            units: isAntibody ? 0 : units ? parseInt(units, 10) : 0,
          },
          sites: isAntibody ? '' : sites,
          type,
          user: treatmentUser,
        }

        mutationsRef.current.createTreatment(payload)
        // Close immediately - mutation runs in background
        onSuccessRef.current?.()
      },
      [] // Empty deps - use refs for all dependencies
    )

    const handleUpdateTreatment = useCallback(
      (treatmentValues: TreatmentValues) => {
        const treatmentUser: AttachedUserType = {
          email: userRef.current?.email || '',
          name: userRef.current?.name || '',
          photoUrl: userRef.current?.photoUrl || '',
          uid: userRef.current?.uid || '',
        }

        const { uid, date, brand, lot, units, cause, sites, type } =
          treatmentValues

        // For antibody treatments, use monoclonal antibody from profile and clear cause/sites
        const isAntibody = type === TreatmentTypeEnum.ANTIBODY
        const medicationBrand = isAntibody
          ? userRef.current?.monoclonalAntibody || ''
          : brand

        const payload: TreatmentType = {
          cause: isAntibody ? '' : cause,
          createdAt: new Date().toISOString(),
          deletedAt: null,
          date,
          medication: {
            brand: medicationBrand,
            lot: isAntibody ? undefined : lot,
            units: isAntibody ? 0 : units ? parseInt(units, 10) : 0,
          },
          sites: isAntibody ? '' : sites,
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
    const treatmentRef = useRef(treatment)
    treatmentRef.current = treatment

    const handleCreateTreatmentRef = useRef(handleCreateTreatment)
    handleCreateTreatmentRef.current = handleCreateTreatment

    const handleUpdateTreatmentRef = useRef(handleUpdateTreatment)
    handleUpdateTreatmentRef.current = handleUpdateTreatment

    // TODO(michael) Add formik validation
    // Memoize onSubmit with empty deps - use refs for all dependencies
    const onSubmit = useCallback((values: TreatmentValues) => {
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
        handleUpdateTreatmentRef.current(values)
      } else {
        handleCreateTreatmentRef.current(values)
      }
    }, []) // Empty deps - use refs for all dependencies

    const formik = useFormik({
      initialValues,
      enableReinitialize: false, // Prevent formik from resetting on prop changes
      onSubmit,
    })

    // Define handleSubmit with useCallback to stabilize the reference
    // Use ref to access formik to avoid dependency on formik object
    const formikRef = useRef(formik)
    formikRef.current = formik

    const handleSubmit = useCallback(() => {
      console.log('handleSubmit called', {
        hasSubmitted: hasSubmittedRef.current,
        formikValues: formikRef.current.values,
      })
      track('Logged Treatment', {
        type: formikRef.current.values.type,
      })
      formikRef.current.submitForm()
    }, [])

    useImperativeHandle(ref, () => ({ handleSubmit }), [handleSubmit])

    return (
      <div className='p-6'>
        <form onSubmit={formik.handleSubmit} className='space-y-4'>
          {/* Treatment Type Buttons */}
          <div className='grid grid-cols-3 gap-2'>
            <button
              type='button'
              onClick={() => {
                formik.setFieldValue('type', TreatmentTypeEnum.PROPHY)
                // Clear antibody-specific fields when switching away from antibody
                if (formik.values.type === TreatmentTypeEnum.ANTIBODY) {
                  formik.setFieldValue('brand', '')
                  formik.setFieldValue('cause', '')
                  formik.setFieldValue('sites', '')
                }
              }}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                formik.values.type === TreatmentTypeEnum.PROPHY
                  ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Prophy
            </button>
            <button
              type='button'
              onClick={() => {
                formik.setFieldValue('type', TreatmentTypeEnum.BLEED)
                // Clear antibody-specific fields when switching away from antibody
                if (formik.values.type === TreatmentTypeEnum.ANTIBODY) {
                  formik.setFieldValue('brand', '')
                  formik.setFieldValue('cause', '')
                  formik.setFieldValue('sites', '')
                }
              }}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                formik.values.type === TreatmentTypeEnum.BLEED
                  ? 'bg-green-100 text-green-800 border border-green-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Bleed
            </button>
            <button
              type='button'
              onClick={() => {
                formik.setFieldValue('type', TreatmentTypeEnum.PREVENTATIVE)
                // Clear antibody-specific fields when switching away from antibody
                if (formik.values.type === TreatmentTypeEnum.ANTIBODY) {
                  formik.setFieldValue('brand', '')
                  formik.setFieldValue('cause', '')
                  formik.setFieldValue('sites', '')
                }
              }}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                formik.values.type === TreatmentTypeEnum.PREVENTATIVE
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
                formik.setFieldValue('type', TreatmentTypeEnum.ANTIBODY)
                // Set brand to monoclonal antibody and clear cause/sites when switching to antibody
                formik.setFieldValue('brand', user?.monoclonalAntibody || '')
                formik.setFieldValue('cause', '')
                formik.setFieldValue('sites', '')
                formik.setFieldValue('units', '0')
                formik.setFieldValue('lot', '')
              }}
              className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                formik.values.type === TreatmentTypeEnum.ANTIBODY
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
              htmlFor={dateId}
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Date
            </label>
            <input
              id={dateId}
              name='date'
              type='date'
              onChange={formik.handleChange}
              value={formik.values.date}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
            />
          </div>

          {/* Medication Input */}
          <div>
            <label
              htmlFor={brandId}
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Medication
            </label>
            <input
              id={brandId}
              name='brand'
              type='text'
              onChange={formik.handleChange}
              placeholder='Brand name'
              disabled={formik.values.type === TreatmentTypeEnum.ANTIBODY}
              value={
                formik.values.type === TreatmentTypeEnum.ANTIBODY
                  ? user?.monoclonalAntibody || ''
                  : formik.values.brand
              }
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed'
            />
          </div>

          {formik.values.type !== TreatmentTypeEnum.ANTIBODY && (
            <>
              {/* Units Input */}
              <div>
                <label
                  htmlFor={unitsId}
                  className='block text-sm font-medium text-gray-700 mb-1'
                >
                  Units
                </label>
                <div className='relative'>
                  <input
                    id={unitsId}
                    name='units'
                    type='number'
                    onChange={formik.handleChange}
                    placeholder='3000'
                    value={formik.values.units}
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
                  htmlFor={lotId}
                  className='block text-sm font-medium text-gray-700 mb-1'
                >
                  Lot Number
                </label>
                <input
                  id={lotId}
                  name='lot'
                  type='text'
                  onChange={formik.handleChange}
                  placeholder='Lot number'
                  value={formik.values.lot}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                />
              </div>

              {/* Affected Areas Input */}
              <div>
                <label
                  htmlFor={sitesId}
                  className='block text-sm font-medium text-gray-700 mb-1'
                >
                  Affected Areas
                </label>
                <input
                  id={sitesId}
                  name='sites'
                  type='text'
                  onChange={formik.handleChange}
                  placeholder='Left ankle, right knee'
                  value={formik.values.sites}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                />
              </div>

              {/* Cause Input */}
              <div>
                <label
                  htmlFor={causeId}
                  className='block text-sm font-medium text-gray-700 mb-1'
                >
                  Cause of Bleed
                </label>
                <input
                  id={causeId}
                  name='cause'
                  type='text'
                  onChange={formik.handleChange}
                  placeholder='Ran into a door'
                  value={formik.values.cause}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                />
              </div>
            </>
          )}
        </form>
      </div>
    )
  }
)
