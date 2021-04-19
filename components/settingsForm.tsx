import React from 'react'
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
import splitbee from '@splitbee/web'

import { useAuth } from 'lib/auth'
import useDbUser from 'lib/hooks/useDbUser'
import { updateUser } from 'lib/db/users'

const SettingsForm = (): JSX.Element => {
  const { user } = useAuth()
  const [, setToast] = useToasts()
  const { person } = useDbUser(user!.uid)

  const formik = useFormik({
    initialValues: {
      hemophiliaType: person ? person.hemophiliaType : '',
      severity: person ? person.severity : '',
      factor: person ? person.factor : '',
      medication: person ? person.medication : '',
      // emergencyContacts: [
      //   {
      //     name: '',
      //     phone: '',
      //   },
      // ],
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      updateUser(user!.uid, values)
        .then(() => {
          setToast({
            text: 'Profile updated!',
            type: 'success',
            delay: 5000,
          })
        })
        .catch((error) =>
          setToast({
            text: `Something went wrong: ${error}`,
            type: 'error',
            delay: 10000,
          })
        )
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
    { label: 'Eloctate', value: 'Eloctate' },
    { label: 'Eloctate', value: 'Eloctate' },
    { label: 'Hemlibra', value: 'Hemlibra' },
    { label: 'Jivi', value: 'Jivi' },
    { label: 'NovoSeven', value: 'NovoSeven' },
    { label: 'Recombinate', value: 'Recombinate' },
    { label: 'Xyntha', value: 'Xyntha' },
  ]

  const handleSubmitForm = () => {
    splitbee.track('Updated Profile', { ...formik.values } as any)
    formik.submitForm
  }

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid.Container gap={2}>
        <Grid xs={24} md={12} direction='column'>
          <Text h5>Type of hemophilia</Text>
          <AutoComplete
            id='hemophiliaType'
            name='hemophiliaType'
            type='text'
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
            id='severity'
            name='severity'
            type='text'
            width='100%'
            placeholder='Severe'
            onChange={(value) => formik.setFieldValue('severity', value)}
            options={severityOptions}
            value={formik.values.severity}
          />
        </Grid>
        <Grid xs={24} md={12} direction='column'>
          <Text h5>Factor number</Text>
          <Input
            id='factor'
            name='factor'
            type='number'
            width='100%'
            placeholder='8'
            onChange={formik.handleChange}
            value={formik.values.factor ? formik.values.factor.toString() : ''}
          />
        </Grid>
        <Grid xs={24} md={12} direction='column'>
          <Text h5>Medication</Text>
          <AutoComplete
            id='medication'
            name='medication'
            type='text'
            width='100%'
            placeholder='Advate'
            onChange={(value) => formik.setFieldValue('medication', value)}
            options={factorOptions}
            value={formik.values.medication}
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
