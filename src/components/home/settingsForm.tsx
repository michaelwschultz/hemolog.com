import { useFormik } from 'formik'
import { type ReactElement, useState } from 'react'
import { track } from '@/components/shared/analytics'
import { useAuth } from '@/lib/auth'
import { useUserMutations } from '@/lib/hooks/useUserMutations'
import { useUserQuery } from '@/lib/hooks/useUserQuery'

const SettingsForm = (): ReactElement => {
  const { user } = useAuth()
  const { person } = useUserQuery(user?.uid)
  const { updateUser } = useUserMutations()

  const formik = useFormik({
    initialValues: {
      hemophiliaType: person?.hemophiliaType ?? '',
      severity: person?.severity ?? '',
      factor: person?.factor ? person.factor.toString() : '',
      medication: person?.medication ?? '',
      monoclonalAntibody: person?.monoclonalAntibody ?? '',
      injectionFrequency: person?.injectionFrequency ?? '',
      // emergencyContacts: [
      //   {
      //     name: '',
      //     phone: '',
      //   },
      // ],
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      if (user?.uid) {
        updateUser({ uid: user.uid, userData: values })
      }
    },
  })

  const severityOptions = [
    { label: 'Mild', value: 'Mild' },
    { label: 'Moderate', value: 'Moderate' },
    { label: 'Severe', value: 'Severe' },
  ]

  const hemophiliaTypeOptions = [
    { label: 'A', value: 'A' },
    { label: 'B', value: 'B' },
    { label: 'Von Willebrand Disease', value: 'Von Willebrand Disease' },
  ]

  const factorOptions = [
    { label: 'Advate', value: 'Advate' },
    { label: 'Adynovate', value: 'Adynovate' },
    { label: 'Afstyla', value: 'Afstyla' },
    { label: 'Alprolix', value: 'Alprolix' },
    { label: 'Benefix', value: 'Benefix' },
    { label: 'Eloctate', value: 'Eloctate' },
    { label: 'Esperoct', value: 'Esperoct' },
    { label: 'Idelvion', value: 'Idelvion' },
    { label: 'Ixinity', value: 'Ixinity' },
    { label: 'Jivi', value: 'Jivi' },
    { label: 'Kogenate FS', value: 'Kogenate FS' },
    { label: 'Kovaltry', value: 'Kovaltry' },
    { label: 'NovoEight', value: 'NovoEight' },
    { label: 'NovoSeven', value: 'NovoSeven' },
    { label: 'NUWIQ', value: 'NUWIQ' },
    { label: 'Rebinyn', value: 'Rebinyn' },
    { label: 'Recombinate', value: 'Recombinate' },
    { label: 'Rixubis', value: 'Rixubis' },
    { label: 'Xyntha', value: 'Xyntha' },
  ]

  const monoclonalAntibodyOptions = [{ label: 'Hemlibra', value: 'Hemlibra' }]

  const injectionFrequencyOptions = [
    {
      label: 'Weekly',
      value: 'Weekly',
    },
    {
      label: 'Every other week',
      value: 'Every other week',
    },
    {
      label: 'Monthly',
      value: 'Monthly',
    },
  ]

  const handleSubmitForm = () => {
    track('Updated Profile', { ...formik.values })
    formik.submitForm()
  }

  const [filteredFactorOptions, setFilteredFactorOptions] =
    useState(factorOptions)

  interface Option {
    label: string
    value: string
  }

  const searchHandler = (
    currentValue: string,
    allOptions: Option[],
    setOptions: (options: Option[]) => void
  ) => {
    if (!currentValue) return setOptions(allOptions)
    const relatedOptions = allOptions.filter((item) =>
      item.value.toLowerCase().startsWith(currentValue.toLowerCase())
    )
    setOptions(relatedOptions)
  }

  return (
    <form onSubmit={formik.handleSubmit} className='space-y-6'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div>
          <label
            htmlFor='hemophiliaType'
            className='mb-1.5 block text-sm font-medium text-slate'
          >
            Type of hemophilia
          </label>
          <select
            id='hemophiliaType'
            name='hemophiliaType'
            className='field'
            value={formik.values.hemophiliaType ?? ''}
            onChange={(e) =>
              formik.setFieldValue('hemophiliaType', e.target.value)
            }
          >
            <option value=''>Select type</option>
            {hemophiliaTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor='severity'
            className='mb-1.5 block text-sm font-medium text-slate'
          >
            Severity
          </label>
          <select
            id='severity'
            name='severity'
            className='field'
            value={formik.values.severity ?? ''}
            onChange={(e) => formik.setFieldValue('severity', e.target.value)}
          >
            <option value=''>Select severity</option>
            {severityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor='factor'
            className='mb-1.5 block text-sm font-medium text-slate'
          >
            Factor number
          </label>
          <input
            id='factor'
            name='factor'
            type='number'
            className='field'
            placeholder='8'
            onChange={formik.handleChange}
            value={formik.values.factor ?? ''}
          />
        </div>

        <div>
          <label
            htmlFor='medication'
            className='mb-1.5 block text-sm font-medium text-slate'
          >
            Factor
          </label>
          <input
            id='medication'
            name='medication'
            type='text'
            className='field'
            placeholder='Advate'
            value={formik.values.medication ?? ''}
            onChange={(e) => {
              formik.setFieldValue('medication', e.target.value)
              searchHandler(
                e.target.value,
                factorOptions,
                setFilteredFactorOptions
              )
            }}
            list='factor-options'
          />
          <datalist id='factor-options'>
            {filteredFactorOptions.map((option) => (
              <option key={option.value} value={option.value} />
            ))}
          </datalist>
        </div>

        <div>
          <label
            htmlFor='monoclonalAntibody'
            className='mb-1.5 block text-sm font-medium text-slate'
          >
            Monoclonal antibody
          </label>
          <input
            id='monoclonalAntibody'
            name='monoclonalAntibody'
            type='text'
            className='field'
            placeholder='Hemlibra'
            value={formik.values.monoclonalAntibody ?? ''}
            onChange={(e) =>
              formik.setFieldValue('monoclonalAntibody', e.target.value)
            }
            list='antibody-options'
          />
          <datalist id='antibody-options'>
            {monoclonalAntibodyOptions.map((option) => (
              <option key={option.value} value={option.value} />
            ))}
          </datalist>
        </div>

        <div>
          <label
            htmlFor='injectionFrequency'
            className='mb-1.5 block text-sm font-medium text-slate'
          >
            Injection frequency
          </label>
          <select
            id='injectionFrequency'
            name='injectionFrequency'
            className='field'
            value={formik.values.injectionFrequency ?? ''}
            onChange={(e) =>
              formik.setFieldValue('injectionFrequency', e.target.value)
            }
          >
            <option value=''>Select frequency</option>
            {injectionFrequencyOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Emergency contacts section - commented out in original */}
      {/*
      <div className='space-y-4'>
        <h5 className='text-lg font-semibold'>Emergency contacts</h5>
        <div>
          <label htmlFor='emergencyContactName' className='block text-sm font-medium text-slate mb-1'>Contact name</label>
          <input
            id='emergencyContactName'
            name='emergencyContactName'
            type='text'
            className='field'
            onChange={formik.handleChange}
            value={formik.values.emergencyContacts[0].name}
          />
        </div>
        <div>
          <label htmlFor='emergencyContactPhone' className='block text-sm font-medium text-slate mb-1'>Contact phone number</label>
          <input
            id='emergencyContactPhone'
            name='emergencyContactPhone'
            type='text'
            className='field'
            onChange={formik.handleChange}
            value={formik.values.emergencyContacts[0].phone}
          />
        </div>
      </div>
      */}

      <div className='pt-4'>
        <button
          type='button'
          onClick={handleSubmitForm}
          disabled={!formik.isValid || !formik.dirty || formik.isSubmitting}
          className='btn btn-primary'
        >
          {formik.isSubmitting && (
            <span className='h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white' />
          )}
          Save profile
        </button>
      </div>
    </form>
  )
}

export default SettingsForm
