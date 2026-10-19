'use client'

import { useFormik } from 'formik'
import type React from 'react'
import toast from 'react-hot-toast'

import { Popup } from '@/components/shared/popup'
import { useAuth } from '@/lib/auth'
import { createFeedback, type FeedbackType } from '@/lib/db/feedback'
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

  const formik = useFormik({
    initialValues: {
      message: '',
    },
    onSubmit: async (values, { setSubmitting, resetForm }) => {
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

      try {
        await createFeedback(feedbackPayload)
        toast.success("Feedback submitted! We'll respond soon via email.")
        setVisible(false)
        resetForm()
      } catch (error: unknown) {
        toast.error(
          `Something went wrong: ${error instanceof Error ? error.message : String(error)}`
        )
      } finally {
        setSubmitting(false)
      }
    },
  })

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
            onClick={() => formik.submitForm()}
          >
            Send feedback
          </button>
        </div>
      </div>
    </Popup>
  )
}
