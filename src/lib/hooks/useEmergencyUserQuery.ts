import { useQuery } from '@tanstack/react-query'
import type { TreatmentType } from '@/lib/db/treatments'
import type { Person } from '@/lib/types/person'

interface EmergencyData {
  person: Person
  treatments: TreatmentType[]
}

// Query key factory for emergency data (by alertId)
export const emergencyUserKeys = {
  all: ['users', 'alertId'] as const,
  detail: (alertId: string) => [...emergencyUserKeys.all, alertId] as const,
}

interface UseEmergencyUserQueryOptions {
  enabled?: boolean
}

interface EmergencyUserQueryResult {
  person: Person | null
  treatments: TreatmentType[]
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
    queryFn: async (): Promise<EmergencyData> => {
      if (!normalizedAlertId) {
        throw new Error('Missing alert ID')
      }
      const response = await fetch(`/api/emergency/${normalizedAlertId}`)
      if (!response.ok) {
        const body = await response.json().catch(() => null)
        throw new Error(
          body?.error || `Emergency data request failed (${response.status})`
        )
      }
      return response.json()
    },
    enabled: enabled && !!normalizedAlertId,
    staleTime: 60 * 1000, // 1 minute (emergency data doesn't change often)
  })

  return {
    person: query.data?.person ?? null,
    treatments: query.data?.treatments ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}
