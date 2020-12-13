import React from 'react'
import { useFormik } from 'formik'
import { Input, Button, Text, Spacer, useToasts } from '@geist-ui/react'

import { useAuth } from 'lib/auth'
import useDbUser from 'lib/hooks/useDbUser'
import { updateUser } from 'lib/db/users'

const SettingsForm = () => {
  const { user } = useAuth()
  const [, setToast] = useToasts()
  const { person } = useDbUser(user && user.uid)

  const formik = useFormik({
    initialValues: {
      hemophiliaType: person ? person.hemophiliaType : '',
      severity: person ? person.severity : '',
      // emergencyContacts: [
      //   {
      //     name: '',
      //     phone: '',
      //   },
      // ],
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      updateUser(user.uid, values)
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

  return (
    <form onSubmit={formik.handleSubmit}>
      <Text h5>Type of hemophilia</Text>
      <Input
        id='hemophiliaType'
        name='hemophiliaType'
        type='text'
        onChange={formik.handleChange}
        value={formik.values.hemophiliaType}
      />
      <Spacer />
      <Text h5>Severity</Text>
      <Input
        id='severity'
        name='severity'
        type='text'
        onChange={formik.handleChange}
        value={formik.values.severity}
      />
      <Spacer />
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
      <Button
        type='success'
        onClick={formik.submitForm}
        disabled={!formik.isValid || !formik.dirty}
        loading={formik.isSubmitting}
      >
        Update
      </Button>
    </form>
  )
}

export default SettingsForm