import { Modal, Textarea, Text, Spacer, useToasts } from '@geist-ui/react'
import { useFormik } from 'formik'

import { useAuth } from 'lib/auth'
import { createFeedback, type FeedbackType } from 'lib/db/feedback'
import type { AttachedUserType } from 'lib/types/users'

interface FeedbackValues {
  message: string
}

interface FeedbackModalProps {
  visible: boolean
  setVisible: (flag: boolean) => void
  bindings: Record<string, unknown>
}

export default function FeedbackModal(props: FeedbackModalProps): JSX.Element {
  const { visible, setVisible, bindings } = props
  const [, setToast] = useToasts()
  const { user } = useAuth()

  const handleCreateFeedback = async (feedback: FeedbackValues) => {
    const feedbackUser: AttachedUserType = {
      email: user?.email || '',
      name: user?.name || '',
      photoUrl: user?.photoUrl || '',
      uid: user?.uid || '',
    }

    const feedbackPayload: FeedbackType = {
      ...feedback,
      createdAt: new Date().toISOString(),
      user: feedbackUser,
    }

    createFeedback(feedbackPayload)
      .then(() => {
        setToast({
          text: "Feedback submitted! We'll respond soon via email.",
          type: 'success',
          delay: 5000,
        })
        closeModal()
      })
      .catch((error: unknown) =>
        setToast({
          text: `Something went wrong: ${error instanceof Error ? error.message : String(error)}`,
          type: 'error',
          delay: 10000,
        })
      )
  }

  const closeModal = () => {
    setVisible(false)
    formik.resetForm()
  }

  const formik = useFormik({
    initialValues: {
      message: '',
    },
    onSubmit: async (values) => {
      await handleCreateFeedback(values)
    },
  })

  return (
    <Modal visible={visible} {...bindings}>
      <Modal.Title>Feedback</Modal.Title>
      <Modal.Subtitle>Hemolog.com</Modal.Subtitle>
      <Modal.Content>
        <p>
          If you’ve run into a bug or have an idea for how Hemolog could work
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
            id='message'
            name='message'
            onChange={formik.handleChange}
            placeholder="Your thoughts are appreciated, feel free to write as much or as little as you'd like."
            value={formik.values.message}
            width='100%'
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
