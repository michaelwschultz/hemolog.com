import { useQuery } from '@tanstack/react-query'
import { fetchUserByUid } from '@/lib/db/users'
import type { Person } from '@/lib/types/person'

// Query key factory for users
export const userKeys = {
  all: ['users'] as const,
  detail: (uid: string) => [...userKeys.all, uid] as const,
}

interface UseUserQueryOptions {
  enabled?: boolean
}

interface UserQueryResult {
  person: Person | null
  isLoading: boolean
  isError: boolean
  error: Error | null
  refetch: () => void
}

export function useUserQuery(
  uid: string | string[] | undefined,
  options: UseUserQueryOptions = {}
): UserQueryResult {
  // Normalize uid to string
  const normalizedUid = Array.isArray(uid) ? uid[0] : uid
  const { enabled = true } = options

  const query = useQuery({
    queryKey: userKeys.detail(normalizedUid ?? ''),
    queryFn: async () => {
      if (!normalizedUid) {
        return null
      }
      return fetchUserByUid(normalizedUid)
    },
    enabled: enabled && !!normalizedUid,
    staleTime: 30 * 1000, // 30 seconds
  })

  return {
    person: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}

// Alias for backward compatibility with useDbUser
export default useUserQuery
