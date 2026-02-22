import { useQuery } from '@tanstack/react-query'
import { fetchUserByAlertId } from '@/lib/db/users'
import type { Person } from '@/lib/types/person'

// Query key factory for emergency users (by alertId)
export const emergencyUserKeys = {
  all: ['users', 'alertId'] as const,
  detail: (alertId: string) => [...emergencyUserKeys.all, alertId] as const,
}

interface UseEmergencyUserQueryOptions {
  enabled?: boolean
}

interface EmergencyUserQueryResult {
  person: Person | null
  isLoading: boolean
  isError: boolean
  error: Error | null
  refetch: () => void
}

export function useEmergencyUserQuery(
  alertId: string | string[] | undefined,
  options: UseEmergencyUserQueryOptions = {}
): EmergencyUserQueryResult {
  // Normalize alertId to string
  const normalizedAlertId = Array.isArray(alertId) ? alertId[0] : alertId
  const { enabled = true } = options

  const query = useQuery({
    queryKey: emergencyUserKeys.detail(normalizedAlertId ?? ''),
    queryFn: async () => {
      if (!normalizedAlertId) {
        return null
      }
      return fetchUserByAlertId(normalizedAlertId)
    },
    enabled: enabled && !!normalizedAlertId,
    staleTime: 60 * 1000, // 1 minute (emergency data doesn't change often)
  })

  return {
    person: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}

export default useEmergencyUserQuery
