import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  createFeedback,
  deleteFeedback,
  type FeedbackType,
  updateFeedback,
} from '@/lib/db/feedback'

interface UseFeedbackMutationsOptions {
  onCreateSuccess?: (docId: string) => void
  onDeleteSuccess?: () => void
  onUpdateSuccess?: () => void
  onError?: (error: Error) => void
}

export function useFeedbackMutations(
  options: UseFeedbackMutationsOptions = {}
) {
  const { onCreateSuccess, onDeleteSuccess, onUpdateSuccess, onError } = options

  // Create feedback mutation
  const createMutation = useMutation({
    mutationFn: async (data: FeedbackType) => {
      const docId = await createFeedback(data)
      return docId
    },
    onError: (error) => {
      toast.error(
        `Failed to submit feedback: ${error instanceof Error ? error.message : String(error)}`
      )
      onError?.(error instanceof Error ? error : new Error(String(error)))
    },
    onSuccess: (docId) => {
      toast.success('Thank you for your feedback!')
      onCreateSuccess?.(docId)
    },
  })

  // Delete feedback mutation
  const deleteMutation = useMutation({
    mutationFn: async (uid: string) => {
      await deleteFeedback(uid)
      return uid
    },
    onError: (error) => {
      toast.error(
        `Failed to delete feedback: ${error instanceof Error ? error.message : String(error)}`
      )
      onError?.(error instanceof Error ? error : new Error(String(error)))
    },
    onSuccess: () => {
      onDeleteSuccess?.()
    },
  })

  // Update feedback mutation
  const updateMutation = useMutation({
    mutationFn: async ({
      uid,
      data,
    }: {
      uid: string
      data: Partial<FeedbackType>
    }) => {
      await updateFeedback(uid, data)
      return { uid, data }
    },
    onError: (error) => {
      toast.error(
        `Failed to update feedback: ${error instanceof Error ? error.message : String(error)}`
      )
      onError?.(error instanceof Error ? error : new Error(String(error)))
    },
    onSuccess: () => {
      onUpdateSuccess?.()
    },
  })

  return {
    createFeedback: createMutation.mutate,
    createFeedbackAsync: createMutation.mutateAsync,
    isCreating: createMutation.isPending,

    deleteFeedback: deleteMutation.mutate,
    deleteFeedbackAsync: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,

    updateFeedback: updateMutation.mutate,
    updateFeedbackAsync: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,

    isPending:
      createMutation.isPending ||
      deleteMutation.isPending ||
      updateMutation.isPending,
  }
}

export default useFeedbackMutations
