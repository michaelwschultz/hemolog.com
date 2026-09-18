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

    // Reset counter and submission flag when treatment/previousTreatment changes
    // biome-ignore lint/correctness/useExhaustiveDependencies: intentional - reset on treatment change
    useEffect(() => {
      renderCountRef.current = 0
      hasSubmittedRef.current = false
      return () => {
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
      return getInitialValues(
        treatment,
        previousTreatment,
        user?.monoclonalAntibody
      )
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
      if (hasSubmittedRef.current) return
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
      track('Logged Treatment', {
        type: formikRef.current.values.type,
      })
      formikRef.current.submitForm()
    }, [])

    useImperativeHandle(ref, () => ({ handleSubmit }), [handleSubmit])

    const inputBase =
      'w-full min-h-[44px] px-4 py-2.5 text-base border border-gray-200 rounded-xl bg-white shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:ring-offset-1'

    const typeButtonBase =
      'rounded-xl text-sm font-medium transition-all active:scale-[0.98] min-h-[44px]'

    return (
      <div className='p-4 sm:p-6 pb-[max(1rem,env(safe-area-inset-bottom))]'>
        <form onSubmit={formik.handleSubmit} className='space-y-5'>
          {/* Treatment Type Buttons - responsive: 2 cols on mobile, 3 on larger */}
          <div>
            <p className='text-xs font-medium text-gray-500 uppercase tracking-wide mb-3'>
              Treatment type
            </p>
            <div className='grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3'>
              <button
                type='button'
                onClick={() => {
                  formik.setFieldValue('type', TreatmentTypeEnum.PROPHY)
                  if (formik.values.type === TreatmentTypeEnum.ANTIBODY) {
                    formik.setFieldValue('brand', '')
                    formik.setFieldValue('cause', '')
                    formik.setFieldValue('sites', '')
                  }
                }}
                className={`${typeButtonBase} ${
                  formik.values.type === TreatmentTypeEnum.PROPHY
                    ? 'bg-amber-100 text-amber-900 border-2 border-amber-300 shadow-sm'
                    : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                }`}
              >
                Prophy
              </button>
              <button
                type='button'
                onClick={() => {
                  formik.setFieldValue('type', TreatmentTypeEnum.BLEED)
                  if (formik.values.type === TreatmentTypeEnum.ANTIBODY) {
                    formik.setFieldValue('brand', '')
                    formik.setFieldValue('cause', '')
                    formik.setFieldValue('sites', '')
                  }
                }}
                className={`${typeButtonBase} ${
                  formik.values.type === TreatmentTypeEnum.BLEED
                    ? 'bg-emerald-100 text-emerald-900 border-2 border-emerald-300 shadow-sm'
                    : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                }`}
              >
                Bleed
              </button>
              <button
                type='button'
                onClick={() => {
                  formik.setFieldValue('type', TreatmentTypeEnum.PREVENTATIVE)
                  if (formik.values.type === TreatmentTypeEnum.ANTIBODY) {
                    formik.setFieldValue('brand', '')
                    formik.setFieldValue('cause', '')
                    formik.setFieldValue('sites', '')
                  }
                }}
                className={`${typeButtonBase} ${
                  formik.values.type === TreatmentTypeEnum.PREVENTATIVE
                    ? 'bg-primary-50 text-primary-800 border-2 border-primary-300 shadow-sm'
                    : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                }`}
              >
                Preventative
              </button>
            </div>
          </div>

          {user?.monoclonalAntibody && (
            <button
              type='button'
              onClick={() => {
                formik.setFieldValue('type', TreatmentTypeEnum.ANTIBODY)
                formik.setFieldValue('brand', user?.monoclonalAntibody || '')
                formik.setFieldValue('cause', '')
                formik.setFieldValue('sites', '')
                formik.setFieldValue('units', '0')
                formik.setFieldValue('lot', '')
              }}
              className={`w-full ${typeButtonBase} ${
                formik.values.type === TreatmentTypeEnum.ANTIBODY
                  ? 'bg-sky-100 text-sky-900 border-2 border-sky-300 shadow-sm'
                  : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100 hover:border-gray-300'
              }`}
            >
              Monoclonal antibody
            </button>
          )}

          {/* Date Input */}
          <div>
            <label
              htmlFor={dateId}
              className='block text-sm font-medium text-gray-700 mb-1.5'
            >
              Date
            </label>
            <input
              id={dateId}
              name='date'
              type='date'
              onChange={formik.handleChange}
              value={formik.values.date}
              className={inputBase}
            />
          </div>

          {/* Medication Input */}
          <div>
            <label
              htmlFor={brandId}
              className='block text-sm font-medium text-gray-700 mb-1.5'
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
              className={`${inputBase} disabled:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-70`}
            />
          </div>

          {formik.values.type !== TreatmentTypeEnum.ANTIBODY && (
            <>
              {/* Units Input */}
              <div>
                <label
                  htmlFor={unitsId}
                  className='block text-sm font-medium text-gray-700 mb-1.5'
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
                    className={`${inputBase} pr-14`}
                  />
                  <span className='absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400'>
                    units
                  </span>
                </div>
              </div>

              {/* Lot Number Input */}
              <div>
                <label
                  htmlFor={lotId}
                  className='block text-sm font-medium text-gray-700 mb-1.5'
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
                  className={inputBase}
                />
              </div>

              {/* Affected Areas Input */}
              <div>
                <label
                  htmlFor={sitesId}
                  className='block text-sm font-medium text-gray-700 mb-1.5'
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
                  className={inputBase}
                />
              </div>

              {/* Cause Input */}
              <div>
                <label
                  htmlFor={causeId}
                  className='block text-sm font-medium text-gray-700 mb-1.5'
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
                  className={inputBase}
                />
              </div>
            </>
          )}
        </form>
      </div>
    )
  }
)
