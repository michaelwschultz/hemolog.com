import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  generateApiKeyEntry,
  listApiKeys,
  revokeApiKeyEntry,
} from '@/lib/db/apiKeys'

export const apiKeyKeys = {
  all: ['apiKeys'] as const,
  list: (uid: string) => [...apiKeyKeys.all, uid] as const,
}

export function useApiKeysQuery(uid: string | undefined) {
  const query = useQuery({
    queryKey: apiKeyKeys.list(uid ?? ''),
    queryFn: () => (uid ? listApiKeys(uid) : Promise.resolve([])),
    enabled: !!uid,
    staleTime: 30 * 1000,
  })

  return {
    apiKeys: query.data ?? [],
    isLoading: query.isLoading,
    refetch: query.refetch,
  }
}

export function useApiKeysMutations() {
  const queryClient = useQueryClient()

  const invalidate = (uid: string) => {
    queryClient.invalidateQueries({ queryKey: apiKeyKeys.list(uid) })
  }

  const createMutation = useMutation({
    mutationFn: async ({
      uid,
      description,
    }: {
      uid: string
      description: string
    }) => {
      const entry = await generateApiKeyEntry(uid, description)
      invalidate(uid)
      return entry
    },
    onError: (error) => {
      toast.error(
        `Failed to create API key: ${error instanceof Error ? error.message : String(error)}`
      )
    },
    onSuccess: () => {
      toast.success('API key created')
    },
  })

  const revokeMutation = useMutation({
    mutationFn: async ({ id, uid }: { id: string; uid: string }) => {
      await revokeApiKeyEntry(id, uid)
      invalidate(uid)
    },
    onError: (error) => {
      toast.error(
        `Failed to revoke API key: ${error instanceof Error ? error.message : String(error)}`
      )
    },
    onSuccess: () => {
      toast.success('API key revoked')
    },
  })

  return {
    createApiKey: createMutation.mutate,
    createApiKeyAsync: createMutation.mutateAsync,
    revokeApiKey: revokeMutation.mutate,
    isCreating: createMutation.isPending,
    isRevoking: revokeMutation.isPending,
  }
}

export function maskApiKey(key: string): string {
  // Show only the first 8 characters, e.g., "sk_abcd..."
  if (key.length <= 8) return '••••••••'
  return `${key.slice(0, 8)}••••••••••••••••••••`
}
