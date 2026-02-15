import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';

export type AvailabilityStatus = 'checking' | 'healthy' | 'unhealthy';

export interface BackendAvailabilityState {
  status: AvailabilityStatus;
  lastChecked: Date | null;
  lastError: string | null;
  isHealthy: boolean;
  isChecking: boolean;
  refetch: () => void;
}

export function useBackendAvailability(options?: { enabled?: boolean; refetchInterval?: number }): BackendAvailabilityState {
  const { actor, isFetching: isActorFetching } = useActor();
  const enabled = options?.enabled ?? true;

  const { data, error, isLoading, refetch, dataUpdatedAt } = useQuery({
    queryKey: ['backend-availability'],
    queryFn: async () => {
      if (!actor) {
        throw new Error('Actor not initialized');
      }
      const result = await actor.isAvailable();
      return result;
    },
    enabled: !!actor && !isActorFetching && enabled,
    retry: 1,
    refetchInterval: options?.refetchInterval,
    refetchOnWindowFocus: true,
    staleTime: 10000, // Consider data stale after 10 seconds
  });

  let status: AvailabilityStatus = 'checking';
  let lastError: string | null = null;
  let isHealthy = false;

  if (isLoading || isActorFetching) {
    status = 'checking';
  } else if (error) {
    status = 'unhealthy';
    lastError = error instanceof Error ? error.message : String(error);
  } else if (data === true) {
    status = 'healthy';
    isHealthy = true;
  } else {
    status = 'unhealthy';
    lastError = 'Backend returned unexpected response';
  }

  return {
    status,
    lastChecked: dataUpdatedAt ? new Date(dataUpdatedAt) : null,
    lastError,
    isHealthy,
    isChecking: status === 'checking',
    refetch: () => {
      refetch();
    },
  };
}

/**
 * Standalone helper to perform a one-off availability check.
 * Can be used by the terminal or other components that need to check
 * backend availability without using the React Query hook.
 */
export async function checkBackendAvailability(
  actor: any
): Promise<{ healthy: boolean; error?: string }> {
  if (!actor) {
    return { healthy: false, error: 'Backend actor is not initialized yet' };
  }

  try {
    const result = await actor.isAvailable();
    return { healthy: result === true };
  } catch (error) {
    return {
      healthy: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
