import { useQuery } from '@tanstack/react-query'
import { compareDesc } from 'date-fns'
import { useAuth } from '@/lib/auth'
import { fetchInfusions, type TreatmentType } from '@/lib/db/infusions'

// Query key factory for infusions
export const infusionKeys = {
  all: ['infusions'] as const,
  list: (uid: string) => [...infusionKeys.all, uid] as const,
}

interface UseInfusionsQueryOptions {
  limit?: number
  uid?: string
  // Polling interval in ms (default: no polling)
  refetchInterval?: number
}

interface InfusionQueryResult {
  data: TreatmentType[]
  isLoading: boolean
  isError: boolean
  error: Error | null
  refetch: () => void
}

export function useInfusionsQuery(
  options: UseInfusionsQueryOptions = {}
): InfusionQueryResult {
  const { limit: maxItems, uid: overrideUid, refetchInterval } = options
  const { user } = useAuth()
  const userUid = overrideUid ?? user?.uid

  const query = useQuery({
    queryKey: infusionKeys.list(userUid ?? ''),
    queryFn: async () => {
      if (!userUid) {
        return []
      }
      return fetchInfusions(userUid)
    },
    enabled: !!userUid,
    refetchInterval,
    // Keep data fresh
    staleTime: 10 * 1000, // 10 seconds
  })

  // Sort infusions by date (newest first) and apply limit
  const sortedData = (query.data ?? [])
    .slice()
    .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))

  const limitedData = maxItems ? sortedData.slice(0, maxItems) : sortedData

  return {
    data: limitedData,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}

// Hook alias for backward compatibility
export default useInfusionsQuery
