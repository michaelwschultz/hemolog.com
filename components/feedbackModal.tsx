import React from 'react'
import { Modal, Input, Textarea, Text, Spacer } from '@geist-ui/react'
import { useUser } from 'utils/auth/useUser'

export default function FeedbackModal(props): JSX.Element {
  const { visible, setVisible, bindings } = props
  const { user } = useUser()

  // TODO: implement formik
  // Submitted feedback could be viewed on a feedback page that can only be seen by me.

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
        <form>
          <Text h6>Name</Text>
          <Input
            width='100%'
            placeholder={
              user && user.displayName ? user.displayName : 'Your name'
            }
            disabled={user && user.displayName && !!user.displayName}
            value={user && user.displayName ? user.displayName : ''}
          />
          <Spacer />
          <Text h6>Your feedback</Text>
          <Textarea
            width='100%'
            placeholder="Your thoughts are appreciated, feel free to write as much or as little as you'd like."
          />
        </form>
      </Modal.Content>
      <Modal.Action passive onClick={() => setVisible(false)}>
        Cancel
      </Modal.Action>
      <Modal.Action onClick={() => alert("This doesn't do anything yet")}>
        Send feedback
      </Modal.Action>
    </Modal>
  )
}
