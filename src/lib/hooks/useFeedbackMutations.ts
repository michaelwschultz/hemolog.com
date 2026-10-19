import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { createFeedback, type FeedbackType } from '@/lib/db/feedback'

interface UseFeedbackMutationsOptions {
  onCreateSuccess?: (docId: string) => void
  onError?: (error: Error) => void
}

export function useFeedbackMutations(
  options: UseFeedbackMutationsOptions = {}
) {
  const { onCreateSuccess, onError } = options

  const createMutation = useMutation({
    mutationFn: async (data: FeedbackType) => createFeedback(data),
    onError: (error) => {
      toast.error(
        `Something went wrong: ${error instanceof Error ? error.message : String(error)}`
      )
      onError?.(error instanceof Error ? error : new Error(String(error)))
    },
    onSuccess: (docId) => {
      toast.success("Feedback submitted! We'll respond soon via email.")
      onCreateSuccess?.(docId)
    },
  })

  return {
    createFeedback: createMutation.mutate,
    isCreating: createMutation.isPending,
  }
}
