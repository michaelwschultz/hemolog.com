import { Sheet } from '@silk-hq/components'
import { useFormik } from 'formik'
import type React from 'react'
import toast from 'react-hot-toast'

import { useAuth } from '@/lib/auth'
import { createFeedback, type FeedbackType } from '@/lib/db/feedback'
import type { AttachedUserType } from '@/lib/types/users'

interface FeedbackValues {
  message: string
}

interface FeedbackModalProps {
  visible: boolean
  setVisible: (flag: boolean) => void
  bindings: Record<string, unknown>
}

export default function FeedbackModal(
  props: FeedbackModalProps
): React.ReactElement | null {
  const { visible, setVisible } = props
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
        toast.success("Feedback submitted! We'll respond soon via email.")
        closeModal()
      })
      .catch((error: unknown) =>
        toast.error(
          `Something went wrong: ${error instanceof Error ? error.message : String(error)}`
        )
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

  if (!visible) {
    return null
  }

  return (
    <Sheet.Root license='non-commercial'>
      <Sheet.View>
        <Sheet.Content className='max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white'>
          <div className='p-6'>
            <h3 className='text-lg font-semibold mb-2'>Feedback</h3>
            <p className='text-sm text-gray-600 mb-1'>Hemolog.com</p>

            <div className='mt-4'>
              <p className='text-gray-700 mb-4'>
                If you've run into a bug or have an idea for how Hemolog could
                work better for you, let me know.
              </p>

              <form onSubmit={formik.handleSubmit}>
                {/* <div className='mb-4'>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Name</label>
                    <input
                      type='text'
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                      placeholder={
                        user && user.displayName ? user.displayName : 'Your name'
                      }
                      disabled={user && user.displayName && !!user.displayName}
                      value={user && user.displayName ? user.displayName : ''}
                    />
                  </div> */}

                <div>
                  <label
                    htmlFor='message'
                    className='block text-sm font-medium text-gray-700 mb-1'
                  >
                    Your feedback
                  </label>
                  <textarea
                    id='message'
                    name='message'
                    onChange={formik.handleChange}
                    placeholder="Your thoughts are appreciated, feel free to write as much or as little as you'd like."
                    value={formik.values.message}
                    rows={4}
                    className='field resize-y'
                  />
                </div>
              </form>
            </div>
          </div>

          <div className='flex justify-end gap-3 border-t border-line p-6'>
            <button
              type='button'
              onClick={() => closeModal()}
              className='btn btn-secondary'
            >
              Cancel
            </button>
            <button
              type='button'
              onClick={formik.submitForm}
              disabled={!formik.isValid || !formik.dirty || formik.isSubmitting}
              className='btn btn-primary'
            >
              {formik.isSubmitting && (
                <span className='h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white' />
              )}
              Send feedback
            </button>
          </div>
        </Sheet.Content>
      </Sheet.View>
    </Sheet.Root>
  )
}
