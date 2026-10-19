'use client'

import { useFormik } from 'formik'
import type React from 'react'
import { useRef } from 'react'

import { Popup } from '@/components/shared/popup'
import { useAuth } from '@/lib/auth'
import type { FeedbackType } from '@/lib/db/feedback'
import { useFeedbackMutations } from '@/lib/hooks/useFeedbackMutations'
import type { AttachedUserType } from '@/lib/types/users'

interface FeedbackModalProps {
  visible: boolean
  setVisible: (flag: boolean) => void
}

export default function FeedbackModal(
  props: FeedbackModalProps
): React.ReactElement {
  const { visible, setVisible } = props
  const { user } = useAuth()
  const resetFormRef = useRef<(() => void) | null>(null)

  const { createFeedback, isCreating } = useFeedbackMutations({
    onCreateSuccess: () => {
      setVisible(false)
      resetFormRef.current?.()
    },
  })

  const formik = useFormik({
    initialValues: {
      message: '',
    },
    onSubmit: (values) => {
      const feedbackUser: AttachedUserType = {
        email: user?.email || '',
        name: user?.name || '',
        photoUrl: user?.photoUrl || '',
        uid: user?.uid || '',
      }

      const feedbackPayload: FeedbackType = {
        ...values,
        createdAt: new Date().toISOString(),
        user: feedbackUser,
      }

      createFeedback(feedbackPayload)
    },
  })
  resetFormRef.current = formik.resetForm

  const closeModal = () => {
    setVisible(false)
    formik.resetForm()
  }

  return (
    <Popup open={visible} title='Feedback' onClose={closeModal}>
      <div className='p-6'>
        <p className='text-sm text-slate'>Hemolog.com</p>
        <p className='mt-4 text-ink'>
          If you've run into a bug or have an idea for how Hemolog could work
          better for you, let me know.
        </p>
        <form className='mt-4' onSubmit={formik.handleSubmit}>
          <label
            htmlFor='feedback-message'
            className='mb-1 block text-sm font-medium text-ink'
          >
            Your feedback
          </label>
          <textarea
            id='feedback-message'
            name='message'
            onChange={formik.handleChange}
            placeholder="Your thoughts are appreciated, feel free to write as much or as little as you'd like."
            value={formik.values.message}
            rows={4}
            className='field resize-y'
          />
        </form>
        <div className='mt-4 flex justify-end'>
          <button
            type='button'
            className='btn btn-primary'
            disabled={isCreating}
            onClick={() => formik.submitForm()}
          >
            Send feedback
          </button>
        </div>
      </div>
    </Popup>
  )
}
