import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  createTreatment,
  deleteTreatment,
  type TreatmentType,
  updateTreatment,
} from '@/lib/db/treatments'
import { treatmentKeys } from './useTreatmentsQuery'

interface UseTreatmentMutationsOptions {
  onCreateSuccess?: (docId: string) => void
  onUpdateSuccess?: () => void
  onDeleteSuccess?: () => void
  onError?: (error: Error) => void
}

export function useTreatmentMutations(
  options: UseTreatmentMutationsOptions = {}
) {
  const queryClient = useQueryClient()
  const { onCreateSuccess, onUpdateSuccess, onDeleteSuccess, onError } = options

  // Create treatment mutation with optimistic update
  const createMutation = useMutation({
    mutationFn: async (data: TreatmentType) => {
      const docId = await createTreatment(data)
      return docId
    },
    onMutate: async (newTreatment) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: treatmentKeys.all })

      // Snapshot the previous value
      const userUid = newTreatment.user.uid
      const previousTreatments = queryClient.getQueryData<TreatmentType[]>(
        treatmentKeys.list(userUid)
      )

      // Optimistically update with a temporary ID
      const optimisticTreatment: TreatmentType = {
        ...newTreatment,
        uid: `temp-${Date.now()}`,
      }

      queryClient.setQueryData<TreatmentType[]>(
        treatmentKeys.list(userUid),
        (old) => (old ? [optimisticTreatment, ...old] : [optimisticTreatment])
      )

      return { previousTreatments, userUid }
    },
    onError: (error, _newTreatment, context) => {
      // Rollback on error
      if (context?.previousTreatments !== undefined) {
        queryClient.setQueryData(
          treatmentKeys.list(context.userUid),
          context.previousTreatments
        )
      }
      toast.error(
        `Failed to create treatment: ${error instanceof Error ? error.message : String(error)}`
      )
      onError?.(error instanceof Error ? error : new Error(String(error)))
    },
    onSuccess: (docId) => {
      toast.success('Treatment logged! Hope all is well.')
      onCreateSuccess?.(docId)
    },
    onSettled: (_data, _error, variables) => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({
        queryKey: treatmentKeys.list(variables.user.uid),
      })
    },
  })

  // Update treatment mutation with optimistic update
  const updateMutation = useMutation({
    mutationFn: async ({
      uid,
      userUid,
      data,
    }: {
      uid: string
      userUid: string
      data: Partial<TreatmentType>
    }) => {
      await updateTreatment(uid, data)
      return { uid, userUid, data }
    },
    onMutate: async ({ uid, userUid, data }) => {
      await queryClient.cancelQueries({ queryKey: treatmentKeys.all })

      const previousTreatments = queryClient.getQueryData<TreatmentType[]>(
        treatmentKeys.list(userUid)
      )

      // Optimistically update
      queryClient.setQueryData<TreatmentType[]>(
        treatmentKeys.list(userUid),
        (old) =>
          old?.map((treatment) =>
            treatment.uid === uid ? { ...treatment, ...data } : treatment
          ) ?? []
      )

      return { previousTreatments, userUid }
    },
    onError: (error, _variables, context) => {
      if (context?.previousTreatments !== undefined) {
        queryClient.setQueryData(
          treatmentKeys.list(context.userUid),
          context.previousTreatments
        )
      }
      toast.error(
        `Failed to update treatment: ${error instanceof Error ? error.message : String(error)}`
      )
      onError?.(error instanceof Error ? error : new Error(String(error)))
    },
    onSuccess: () => {
      toast.success('Treatment updated!')
      onUpdateSuccess?.()
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: treatmentKeys.list(variables.userUid),
      })
    },
  })

  // Delete treatment mutation with optimistic update (soft delete)
  const deleteMutation = useMutation({
    mutationFn: async ({ uid, userUid }: { uid: string; userUid: string }) => {
      await deleteTreatment(uid)
      return { uid, userUid }
    },
    onMutate: async ({ uid, userUid }) => {
      await queryClient.cancelQueries({ queryKey: treatmentKeys.all })

      const previousTreatments = queryClient.getQueryData<TreatmentType[]>(
        treatmentKeys.list(userUid)
      )

      // Optimistically remove from list
      queryClient.setQueryData<TreatmentType[]>(
        treatmentKeys.list(userUid),
        (old) => old?.filter((treatment) => treatment.uid !== uid) ?? []
      )

      return { previousTreatments, userUid }
    },
    onError: (error, _variables, context) => {
      if (context?.previousTreatments !== undefined) {
        queryClient.setQueryData(
          treatmentKeys.list(context.userUid),
          context.previousTreatments
        )
      }
      toast.error(
        `Failed to delete treatment: ${error instanceof Error ? error.message : String(error)}`
      )
      onError?.(error instanceof Error ? error : new Error(String(error)))
    },
    onSuccess: () => {
      toast.success('Treatment deleted')
      onDeleteSuccess?.()
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: treatmentKeys.list(variables.userUid),
      })
    },
  })

  return {
    createTreatment: createMutation.mutate,
    createTreatmentAsync: createMutation.mutateAsync,
    isCreating: createMutation.isPending,

    updateTreatment: updateMutation.mutate,
    updateTreatmentAsync: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,

    deleteTreatment: deleteMutation.mutate,
    deleteTreatmentAsync: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,

    isPending:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
  }
}

export default useTreatmentMutations
