import { Circle } from 'lucide-react';
import type { BackendAvailabilityState } from '../hooks/useBackendAvailability';

interface ServerStatusIndicatorProps {
  backendAvailability?: BackendAvailabilityState;
}

export default function ServerStatusIndicator({ backendAvailability }: ServerStatusIndicatorProps) {
  if (!backendAvailability) {
    return null;
  }

  const { status } = backendAvailability;

  let statusText = 'Checking';
  let statusColor = 'text-yellow-500';
  let dotColor = 'fill-yellow-500';

  if (status === 'healthy') {
    statusText = 'Online';
    statusColor = 'text-green-500';
    dotColor = 'fill-green-500';
  } else if (status === 'unhealthy') {
    statusText = 'Offline';
    statusColor = 'text-red-500';
    dotColor = 'fill-red-500';
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border">
      <Circle className={`h-2 w-2 ${dotColor}`} />
      <span className={`text-xs font-medium ${statusColor}`}>Server: {statusText}</span>
    </div>
  );
}
