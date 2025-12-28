import { useState } from 'react'
import { useFormik } from 'formik'

import { useAuth } from 'lib/auth'
import useDbUser from 'lib/hooks/useDbUser'
import { updateUser } from 'lib/db/users'
import { track } from 'lib/helpers'
import toast from 'react-hot-toast'

const SettingsForm = (): JSX.Element => {
  const { user } = useAuth()
  const { person } = useDbUser(user?.uid || '')

  const formik = useFormik({
    initialValues: {
      hemophiliaType: person ? person.hemophiliaType : '',
      severity: person ? person.severity : '',
      factor: person ? person.factor : '',
      medication: person ? person.medication : '',
      monoclonalAntibody: person ? person.monoclonalAntibody : '',
      injectionFrequency: person ? person.injectionFrequency : '',
      // emergencyContacts: [
      //   {
      //     name: '',
      //     phone: '',
      //   },
      // ],
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      updateUser(user?.uid || '', values)
        .then(() => {
          toast.success('Profile updated!')
        })
        .catch((error) => {
          console.error(error)
          toast.error(`Something went wrong: ${error}`)
        })
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
            className='block text-lg font-semibold mb-2'
          >
            Type of hemophilia
          </label>
          <select
            id='hemophiliaType'
            name='hemophiliaType'
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
            value={formik.values.hemophiliaType}
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
            className='block text-lg font-semibold mb-2'
          >
            Severity
          </label>
          <select
            id='severity'
            name='severity'
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
            value={formik.values.severity}
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
          <label htmlFor='factor' className='block text-lg font-semibold mb-2'>
            Factor number
          </label>
          <input
            id='factor'
            name='factor'
            type='number'
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
            placeholder='8'
            onChange={formik.handleChange}
            value={formik.values.factor ? formik.values.factor.toString() : ''}
          />
        </div>

        <div>
          <label
            htmlFor='medication'
            className='block text-lg font-semibold mb-2'
          >
            Factor
          </label>
          <input
            id='medication'
            name='medication'
            type='text'
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
            placeholder='Advate'
            value={formik.values.medication}
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
            className='block text-lg font-semibold mb-2'
          >
            Monoclonal antibody
          </label>
          <input
            id='monoclonalAntibody'
            name='monoclonalAntibody'
            type='text'
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
            placeholder='Hemlibra'
            value={formik.values.monoclonalAntibody}
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
            className='block text-lg font-semibold mb-2'
          >
            Injection frequency
          </label>
          <select
            id='injectionFrequency'
            name='injectionFrequency'
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
            value={formik.values.injectionFrequency}
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
          <label htmlFor='emergencyContactName' className='block text-sm font-medium text-gray-700 mb-1'>Contact name</label>
          <input
            id='emergencyContactName'
            name='emergencyContactName'
            type='text'
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
            onChange={formik.handleChange}
            value={formik.values.emergencyContacts[0].name}
          />
        </div>
        <div>
          <label htmlFor='emergencyContactPhone' className='block text-sm font-medium text-gray-700 mb-1'>Contact phone number</label>
          <input
            id='emergencyContactPhone'
            name='emergencyContactPhone'
            type='text'
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
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
          className='px-6 py-3 bg-green-100 hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed text-green-800 rounded-lg font-medium transition-colors flex items-center gap-2'
        >
          {formik.isSubmitting && (
            <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-green-800'></div>
          )}
          Update
        </button>
      </div>
    </form>
  )
}

export default SettingsForm
