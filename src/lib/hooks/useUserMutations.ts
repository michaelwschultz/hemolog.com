import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { createUser, updateUser } from '@/lib/db/users'
import { userKeys } from './useUserQuery'
import type { UserType } from '@/lib/types/users'
import type { Person } from '@/lib/types/person'

interface UseUserMutationsOptions {
  onCreateSuccess?: () => void
  onUpdateSuccess?: () => void
  onError?: (error: Error) => void
}

export function useUserMutations(options: UseUserMutationsOptions = {}) {
  const queryClient = useQueryClient()
  const { onCreateSuccess, onUpdateSuccess, onError } = options

  // Create user mutation
  const createMutation = useMutation({
    mutationFn: async ({
      uid,
      userData,
    }: {
      uid: string
      userData: Partial<UserType>
    }) => {
      await createUser(uid, userData)
      return { uid, userData }
    },
    onError: (error) => {
      console.error('Failed to create user:', error)
      onError?.(error instanceof Error ? error : new Error(String(error)))
    },
    onSuccess: ({ uid }) => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(uid) })
      onCreateSuccess?.()
    },
  })

  // Update user mutation with optimistic update
  const updateMutation = useMutation({
    mutationFn: async ({
      uid,
      userData,
    }: {
      uid: string
      userData: Partial<UserType>
    }) => {
      await updateUser(uid, userData)
      return { uid, userData }
    },
    onMutate: async ({ uid, userData }) => {
      await queryClient.cancelQueries({ queryKey: userKeys.detail(uid) })

      const previousUser = queryClient.getQueryData<Person>(
        userKeys.detail(uid)
      )

      // Optimistically update
      if (previousUser) {
        queryClient.setQueryData<Person>(userKeys.detail(uid), {
          ...previousUser,
          ...userData,
        })
      }

      return { previousUser, uid }
    },
    onError: (error, _variables, context) => {
      if (context?.previousUser !== undefined) {
        queryClient.setQueryData(
          userKeys.detail(context.uid),
          context.previousUser
        )
      }
      toast.error(
        `Failed to update profile: ${error instanceof Error ? error.message : String(error)}`
      )
      onError?.(error instanceof Error ? error : new Error(String(error)))
    },
    onSuccess: () => {
      toast.success('Profile updated!')
      onUpdateSuccess?.()
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: userKeys.detail(variables.uid),
      })
    },
  })

  return {
    createUser: createMutation.mutate,
    createUserAsync: createMutation.mutateAsync,
    isCreating: createMutation.isPending,

    updateUser: updateMutation.mutate,
    updateUserAsync: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,

    isPending: createMutation.isPending || updateMutation.isPending,
  }
}

export default useUserMutations
