import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  createInfusion,
  deleteInfusion,
  type TreatmentType,
  updateInfusion,
} from '@/lib/db/infusions'
import { infusionKeys } from './useInfusionsQuery'

interface UseInfusionMutationsOptions {
  onCreateSuccess?: (docId: string) => void
  onUpdateSuccess?: () => void
  onDeleteSuccess?: () => void
  onError?: (error: Error) => void
}

export function useInfusionMutations(
  options: UseInfusionMutationsOptions = {}
) {
  const queryClient = useQueryClient()
  const { onCreateSuccess, onUpdateSuccess, onDeleteSuccess, onError } = options

  // Create infusion mutation with optimistic update
  const createMutation = useMutation({
    mutationFn: async (data: TreatmentType) => {
      const docId = await createInfusion(data)
      return docId
    },
    onMutate: async (newInfusion) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: infusionKeys.all })

      // Snapshot the previous value
      const userUid = newInfusion.user.uid
      const previousInfusions = queryClient.getQueryData<TreatmentType[]>(
        infusionKeys.list(userUid)
      )

      // Optimistically update with a temporary ID
      const optimisticInfusion: TreatmentType = {
        ...newInfusion,
        uid: `temp-${Date.now()}`,
      }

      queryClient.setQueryData<TreatmentType[]>(
        infusionKeys.list(userUid),
        (old) => (old ? [optimisticInfusion, ...old] : [optimisticInfusion])
      )

      return { previousInfusions, userUid }
    },
    onError: (error, _newInfusion, context) => {
      // Rollback on error
      if (context?.previousInfusions !== undefined) {
        queryClient.setQueryData(
          infusionKeys.list(context.userUid),
          context.previousInfusions
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
        queryKey: infusionKeys.list(variables.user.uid),
      })
    },
  })

  // Update infusion mutation with optimistic update
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
      await updateInfusion(uid, data)
      return { uid, userUid, data }
    },
    onMutate: async ({ uid, userUid, data }) => {
      await queryClient.cancelQueries({ queryKey: infusionKeys.all })

      const previousInfusions = queryClient.getQueryData<TreatmentType[]>(
        infusionKeys.list(userUid)
      )

      // Optimistically update
      queryClient.setQueryData<TreatmentType[]>(
        infusionKeys.list(userUid),
        (old) =>
          old?.map((infusion) =>
            infusion.uid === uid ? { ...infusion, ...data } : infusion
          ) ?? []
      )

      return { previousInfusions, userUid }
    },
    onError: (error, _variables, context) => {
      if (context?.previousInfusions !== undefined) {
        queryClient.setQueryData(
          infusionKeys.list(context.userUid),
          context.previousInfusions
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
        queryKey: infusionKeys.list(variables.userUid),
      })
    },
  })

  // Delete infusion mutation with optimistic update (soft delete)
  const deleteMutation = useMutation({
    mutationFn: async ({ uid, userUid }: { uid: string; userUid: string }) => {
      await deleteInfusion(uid)
      return { uid, userUid }
    },
    onMutate: async ({ uid, userUid }) => {
      await queryClient.cancelQueries({ queryKey: infusionKeys.all })

      const previousInfusions = queryClient.getQueryData<TreatmentType[]>(
        infusionKeys.list(userUid)
      )

      // Optimistically remove from list
      queryClient.setQueryData<TreatmentType[]>(
        infusionKeys.list(userUid),
        (old) => old?.filter((infusion) => infusion.uid !== uid) ?? []
      )

      return { previousInfusions, userUid }
    },
    onError: (error, _variables, context) => {
      if (context?.previousInfusions !== undefined) {
        queryClient.setQueryData(
          infusionKeys.list(context.userUid),
          context.previousInfusions
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
        queryKey: infusionKeys.list(variables.userUid),
      })
    },
  })

  return {
    createInfusion: createMutation.mutate,
    createInfusionAsync: createMutation.mutateAsync,
    isCreating: createMutation.isPending,

    updateInfusion: updateMutation.mutate,
    updateInfusionAsync: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,

    deleteInfusion: deleteMutation.mutate,
    deleteInfusionAsync: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,

    isPending:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
  }
}

export default useInfusionMutations
