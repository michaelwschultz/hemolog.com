import React from 'react'
import { Modal, Textarea, Text, Spacer, useToasts } from '@geist-ui/react'
import { useFormik } from 'formik'
import { useAuth } from 'lib/auth'
import { createFeedback, FeedbackType, FeedbackUserType } from 'lib/db/feedback'

interface FeedbackValues {
  message: string
}

export default function FeedbackModal(props): JSX.Element {
  const { visible, setVisible, bindings } = props
  const [, setToast] = useToasts()
  const { user } = useAuth()

  function handleCreateFeedback(feedback: FeedbackValues) {
    const feedbackUser: FeedbackUserType = {
      email: user.email,
      name: user.name,
      photoUrl: user.photoUrl,
      uid: user.uid,
    }

    const feedbackPayload: FeedbackType = {
      ...feedback,
      createdAt: new Date().toISOString(),
      user: feedbackUser,
    }

    createFeedback(feedbackPayload)
      .then(() => {
        setToast({
          text: "Feedback submitted! I'll get back to you as soon as I can.",
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
  }

  function closeModal() {
    formik.resetForm()
    setVisible(false)
  }

  const formik = useFormik({
    initialValues: {
      message: '',
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      handleCreateFeedback(values)
      formik.resetForm()
    },
  })

  return (
    <Modal open={visible} {...bindings}>
      <Modal.Title>Feedback</Modal.Title>
      <Modal.Subtitle>Hemolog.com</Modal.Subtitle>
      <Modal.Content>
        <p>
          If you've run into a bug or have an idea for how Hemolog could work
          better for you, let me know.
        </p>
        <Spacer />
        <form onSubmit={formik.handleSubmit}>
          {/* <Text h6>Name</Text>
          <Input
            width='100%'
            placeholder={
              user && user.displayName ? user.displayName : 'Your name'
            }
            disabled={user && user.displayName && !!user.displayName}
            value={user && user.displayName ? user.displayName : ''}
          /> */}
          <Spacer />
          <Text h6>Your feedback</Text>
          <Textarea
            name='message'
            value={formik.values.message}
            onChange={(e) => formik.setFieldValue('message', e.target.value)}
            width='100%'
            placeholder="Your thoughts are appreciated, feel free to write as much or as little as you'd like."
          />
        </form>
      </Modal.Content>
      <Modal.Action passive onClick={() => closeModal()}>
        Cancel
      </Modal.Action>
      <Modal.Action
        onClick={formik.submitForm}
        disabled={!formik.isValid || !formik.dirty}
        loading={formik.isSubmitting}
      >
        Send feedback
      </Modal.Action>
    </Modal>
  )
}
