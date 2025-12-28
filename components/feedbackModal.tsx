import { useFormik } from 'formik'
import toast from 'react-hot-toast'

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

  return (
    <>
      {visible && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto'>
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
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-vertical'
                    />
                  </div>
                </form>
              </div>
            </div>

            <div className='flex justify-end gap-3 p-6 border-t border-gray-200'>
              <button
                type='button'
                onClick={() => closeModal()}
                className='px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors'
              >
                Cancel
              </button>
              <button
                type='button'
                onClick={formik.submitForm}
                disabled={
                  !formik.isValid || !formik.dirty || formik.isSubmitting
                }
                className='px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center gap-2'
              >
                {formik.isSubmitting && (
                  <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                )}
                Send feedback
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
