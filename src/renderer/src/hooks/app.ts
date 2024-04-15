import { useQuery } from '@tanstack/react-query'
import { fetchState } from '../api/app'

export const useFetchState = (options?: { refetchInterval?: number }) => {
  const { isLoading, data, error } = useQuery({
    queryKey: ['app:state'],
    queryFn: fetchState,
    refetchInterval: options?.refetchInterval
  })

  return { isLoading, data, error }
}
