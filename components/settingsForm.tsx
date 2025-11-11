import { useState } from 'react'
import { useFormik } from 'formik'
import {
  Input,
  Button,
  Text,
  Spacer,
  useToasts,
  Grid,
  AutoComplete,
} from '@geist-ui/react'

import { useAuth } from 'lib/auth'
import useDbUser from 'lib/hooks/useDbUser'
import { updateUser } from 'lib/db/users'
import { track } from 'lib/helpers'

const SettingsForm = (): JSX.Element => {
  const { user } = useAuth()
  const [, setToast] = useToasts()
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
          setToast({
            text: 'Profile updated!',
            type: 'success',
            delay: 5000,
          })
        })
        .catch((error) => {
          console.error(error)
          setToast({
            text: `Something went wrong: ${error}`,
            type: 'error',
            delay: 10000,
          })
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
    <form onSubmit={formik.handleSubmit}>
      <Grid.Container gap={2}>
        <Grid xs={24} md={12} direction='column'>
          <Text h5>Type of hemophilia</Text>
          <AutoComplete
            crossOrigin={undefined}
            id='hemophiliaType'
            name='hemophiliaType'
            width='100%'
            placeholder='A'
            onChange={(value) => formik.setFieldValue('hemophiliaType', value)}
            options={hemophiliaTypeOptions}
            value={formik.values.hemophiliaType}
          />
        </Grid>
        <Grid xs={24} md={12} direction='column'>
          <Text h5>Severity</Text>
          <AutoComplete
            crossOrigin={undefined}
            id='severity'
            name='severity'
            width='100%'
            disableFreeSolo
            placeholder='Severe'
            onChange={(value) => formik.setFieldValue('severity', value)}
            options={severityOptions}
            value={formik.values.severity}
          />
        </Grid>
        <Grid xs={24} md={12} direction='column'>
          <Text h5>Factor number</Text>
          <Input
            crossOrigin={undefined}
            id='factor'
            name='factor'
            htmlType='number'
            width='100%'
            placeholder='8'
            onChange={formik.handleChange}
            value={formik.values.factor ? formik.values.factor.toString() : ''}
          />
        </Grid>
        <Grid xs={24} md={12} direction='column'>
          <Text h5>Factor</Text>
          <AutoComplete
            crossOrigin={undefined}
            id='medication'
            name='medication'
            clearable
            width='100%'
            placeholder='Advate'
            onChange={(value) => formik.setFieldValue('medication', value)}
            options={filteredFactorOptions}
            value={formik.values.medication}
            onSearch={(value) =>
              searchHandler(value, factorOptions, setFilteredFactorOptions)
            }
          />
        </Grid>
        <Grid xs={24} md={12} direction='column'>
          <Text h5>Monoclonal antibody</Text>
          <AutoComplete
            crossOrigin={undefined}
            id='monoclonalAntibody'
            name='monoclonalAntibody'
            clearable
            width='100%'
            placeholder='Hemlibra'
            onChange={(value) =>
              formik.setFieldValue('monoclonalAntibody', value)
            }
            options={monoclonalAntibodyOptions}
            value={formik.values.monoclonalAntibody}
          />
        </Grid>
        <Grid xs={24} md={12} direction='column'>
          <Text h5>Injection frequency</Text>
          <AutoComplete
            crossOrigin={undefined}
            id='injectionFrequency'
            name='injectionFrequency'
            disableFreeSolo
            clearable
            width='100%'
            placeholder='Every other week'
            onChange={(value) => {
              formik.setFieldValue('injectionFrequency', value)
            }}
            options={injectionFrequencyOptions}
            value={
              injectionFrequencyOptions.find(
                (option) => option.value === formik.values.injectionFrequency
              )?.label
            }
          />
        </Grid>
      </Grid.Container>
      {/* <Text h5>Emergency contacts</Text>
      <Text h5>Contact name</Text>
      <Input
        id='emergencyContactName'
        name='emergencyContactName'
        type='text'
        onChange={formik.handleChange}
        value={formik.values.emergencyContacts[0].name}
      />
      <Spacer />
      <Text h5>Contact phone number</Text>
      <Input
        id='emergencyContactPhone'
        name='emergencyContactPhone'
        type='text'
        onChange={formik.handleChange}
        value={formik.values.emergencyContacts[0].phone}
      />
      <Spacer /> */}
      <Spacer />
      <Button
        type='success-light'
        onClick={handleSubmitForm}
        disabled={!formik.isValid || !formik.dirty}
        loading={formik.isSubmitting}
      >
        Update
      </Button>
    </form>
  )
}

export default SettingsForm
