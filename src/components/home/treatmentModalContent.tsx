import { useFormik } from 'formik'
import {
  forwardRef,
  useCallback,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import toast from 'react-hot-toast'
import { track } from '@/components/shared/analytics'
import { useAuth } from '@/lib/auth'
import {
  type TreatmentType,
  TreatmentTypeEnum,
  type TreatmentTypeOptions,
} from '@/lib/db/treatments'
import { useTreatmentMutations } from '@/lib/hooks/useTreatmentMutations'
import { useUserQuery } from '@/lib/hooks/useUserQuery'
import {
  buildTreatmentPayload,
  getTreatmentFormInitialValues,
  type TreatmentFormValues,
  validateTreatmentValues,
} from '@/lib/treatmentForm'
import type { AttachedUserType } from '@/lib/types/users'

interface TreatmentModalProps {
  treatment?: TreatmentType
  previousTreatment?: TreatmentType
  onSuccess?: () => void
}

export default forwardRef<{ handleSubmit: () => void }, TreatmentModalProps>(
  function TreatmentModalContent(props, ref) {
    const { treatment, previousTreatment, onSuccess } = props
    const { user } = useAuth()
    const { person } = useUserQuery(user?.uid)

    const dateId = useId()
    const brandId = useId()
    const unitsId = useId()
    const lotId = useId()
    const sitesId = useId()
    const causeId = useId()

    const hasSubmittedRef = useRef(false)
    const onSuccessRef = useRef(onSuccess)
    onSuccessRef.current = onSuccess

    const mutations = useTreatmentMutations({
      onCreateSuccess: () => onSuccessRef.current?.(),
      onUpdateSuccess: () => onSuccessRef.current?.(),
      onError: () => {
        hasSubmittedRef.current = false
      },
    })
    const mutationsRef = useRef(mutations)
    mutationsRef.current = mutations

    const userRef = useRef(user)
    userRef.current = user

    const personRef = useRef(person)
    personRef.current = person

    const treatmentRef = useRef(treatment)
    treatmentRef.current = treatment

    const submitTreatment = useCallback((values: TreatmentFormValues) => {
      const treatmentUser: AttachedUserType = {
        email: userRef.current?.email || '',
        name: userRef.current?.name || '',
        photoUrl: userRef.current?.photoUrl || '',
        uid: userRef.current?.uid || '',
      }

      const payload = buildTreatmentPayload(
        values,
        treatmentUser,
        personRef.current?.monoclonalAntibody
      )

      if (treatmentRef.current?.uid) {
        mutationsRef.current.updateTreatment({
          uid: treatmentRef.current.uid,
          userUid: userRef.current?.uid || '',
          data: {
            ...payload,
            createdAt: treatmentRef.current.createdAt,
          },
        })
        return
      }

      mutationsRef.current.createTreatment(payload)
    }, [])

    const submitTreatmentRef = useRef(submitTreatment)
    submitTreatmentRef.current = submitTreatment

    const onSubmit = useCallback((values: TreatmentFormValues) => {
      if (hasSubmittedRef.current) {
        return
      }
      hasSubmittedRef.current = true

      if (treatmentRef.current && !treatmentRef.current.uid) {
        toast.error('Treatment database entry not found')
        hasSubmittedRef.current = false
        return
      }

      submitTreatmentRef.current(values)
    }, [])

    const [initialValues] = useState(() =>
      getTreatmentFormInitialValues(
        treatment,
        previousTreatment,
        person?.medication,
        person?.monoclonalAntibody
      )
    )

    const formik = useFormik({
      initialValues,
      enableReinitialize: false,
      validate: validateTreatmentValues,
      onSubmit,
    })

    const formikRef = useRef(formik)
    formikRef.current = formik

    const selectTreatmentType = (type: TreatmentTypeOptions) => {
      const current = formikRef.current.values
      if (type === TreatmentTypeEnum.ANTIBODY) {
        formikRef.current.setValues({
          ...current,
          type,
          brand: personRef.current?.monoclonalAntibody || '',
          cause: '',
          sites: '',
          units: '0',
          lot: '',
        })
        return
      }

      const leavingAntibody = current.type === TreatmentTypeEnum.ANTIBODY
      formikRef.current.setValues({
        ...current,
        type,
        cause: type === TreatmentTypeEnum.BLEED ? current.cause : '',
        sites: type === TreatmentTypeEnum.BLEED ? current.sites : '',
        ...(leavingAntibody
          ? {
              brand: personRef.current?.medication || '',
              cause: '',
              sites: '',
              units: '',
              lot: '',
            }
          : {}),
      })
    }

    const handleSubmit = useCallback(() => {
      track('Logged Treatment', {
        type: formikRef.current.values.type,
      })
      formikRef.current.submitForm()
    }, [])

    useImperativeHandle(ref, () => ({ handleSubmit }), [handleSubmit])

    const inputBase = 'field min-h-[44px] px-4 py-2.5 text-base'
    const typeButtonBase =
      'rounded-xl text-sm font-medium transition-all active:scale-[0.98] min-h-[44px]'
    const showBleedFields = formik.values.type === TreatmentTypeEnum.BLEED
    const showMedicationFields =
      formik.values.type !== TreatmentTypeEnum.ANTIBODY

    return (
      <div className='p-4 sm:p-6'>
        <form onSubmit={formik.handleSubmit} className='space-y-5'>
          <div>
            <p className='text-xs font-medium text-gray-500 uppercase tracking-wide mb-3'>
              Treatment type
            </p>
            <div className='grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3'>
              <button
                type='button'
                onClick={() => selectTreatmentType(TreatmentTypeEnum.PROPHY)}
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
                onClick={() => selectTreatmentType(TreatmentTypeEnum.BLEED)}
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
                onClick={() =>
                  selectTreatmentType(TreatmentTypeEnum.PREVENTATIVE)
                }
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

          {person?.monoclonalAntibody && (
            <button
              type='button'
              onClick={() => selectTreatmentType(TreatmentTypeEnum.ANTIBODY)}
              className={`w-full ${typeButtonBase} ${
                formik.values.type === TreatmentTypeEnum.ANTIBODY
                  ? 'bg-sky-100 text-sky-900 border-2 border-sky-300 shadow-sm'
                  : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100 hover:border-gray-300'
              }`}
            >
              Monoclonal antibody
            </button>
          )}

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
            {formik.errors.date && (
              <p className='mt-1 text-sm text-primary-600'>
                {formik.errors.date}
              </p>
            )}
          </div>

          {showMedicationFields && (
            <>
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
                  value={formik.values.brand}
                  className={inputBase}
                />
                {formik.errors.brand && (
                  <p className='mt-1 text-sm text-primary-600'>
                    {formik.errors.brand}
                  </p>
                )}
              </div>

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
                {formik.errors.units && (
                  <p className='mt-1 text-sm text-primary-600'>
                    {formik.errors.units}
                  </p>
                )}
              </div>

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
            </>
          )}

          {showBleedFields && (
            <>
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
