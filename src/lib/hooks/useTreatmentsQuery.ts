import { useQuery } from '@tanstack/react-query'
import { compareDesc } from 'date-fns'
import { useMemo } from 'react'
import { useAuth } from '@/lib/auth'
import { fetchTreatments, type TreatmentType } from '@/lib/db/treatments'

// Query key factory for treatments
export const treatmentKeys = {
  all: ['infusions'] as const,
  list: (uid: string) => [...treatmentKeys.all, uid] as const,
}

interface UseTreatmentsQueryOptions {
  limit?: number
  uid?: string
  // Polling interval in ms (default: no polling)
  refetchInterval?: number
}

interface TreatmentQueryResult {
  data: TreatmentType[]
  isLoading: boolean
  isError: boolean
  error: Error | null
  isFetching: boolean
  refetch: () => void
}

export function useTreatmentsQuery(
  options: UseTreatmentsQueryOptions = {}
): TreatmentQueryResult {
  const { limit: maxItems, uid: overrideUid, refetchInterval } = options
  const { user } = useAuth()
  const userUid = overrideUid ?? user?.uid

  const query = useQuery({
    queryKey: treatmentKeys.list(userUid ?? ''),
    queryFn: async () => {
      if (!userUid) {
        return []
      }
      return fetchTreatments(userUid)
    },
    enabled: !!userUid,
    refetchInterval,
    // Keep data fresh
    staleTime: 10 * 1000, // 10 seconds
  })

  // Sort treatments by date (newest first) and apply limit
  // Memoized to prevent creating new array references on every render
  const sortedData = useMemo(() => {
    if (!query.data) return []
    return [...query.data].sort((a, b) =>
      compareDesc(new Date(a.date), new Date(b.date))
    )
  }, [query.data])

  const limitedData = useMemo(() => {
    return maxItems ? sortedData.slice(0, maxItems) : sortedData
  }, [sortedData, maxItems])

  return {
    data: limitedData,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isFetching: query.isFetching,
    refetch: query.refetch,
  }
}

// Hook alias for backward compatibility
export default useTreatmentsQuery
